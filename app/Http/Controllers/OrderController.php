<?php

namespace App\Http\Controllers;

use App\Mail\OrderConfirmation;
use App\Services\EcontService;
use App\Services\MapServices;
use Gdinko\Econt\Models\CarrierEcontCity;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class OrderController extends Controller
{
    public function store(Request $request)
    {

        Log::info('Order creation attempt', ['request' => $request->all()]);
        // Validate the incoming request
//        $request->validate([
//            'buyer_name' => 'required|string',
//            'buyer_email' => 'required|string|email',
//            'buyer_phone' => 'required|string',
//            'order_info' => 'nullable|string',
//            'econt_city' => 'required|string',
//            'econt_street_number' => 'required|string',
//            'econt_street' => 'required|string',
//            'econt_street_id' => 'nullable|string',
//            'subtotal' => 'required|numeric',
//            'discount' => 'nullable|numeric',
//            'total' => 'required|numeric',
//            'items' => 'required|array',
//            'items.*.id' => 'required|exists:products,id',
//            'items.*.name' => 'required|string',
//            'items.*.quantity' => 'required|numeric|min:1',
//            'items.*.price' => 'required|numeric|min:0',
//        ]);



        $existingOrder = Order::where('email', $request->buyer_email)
            ->where('created_at', '>=', now()->subMinutes(1))
            ->first();

        if ($existingOrder) {
            Log::warning('Duplicate order attempt by ' . $request->buyer_email);
            return response()->json(['message' => 'An order has already been placed recently.'], 409);
        }

        foreach ($request->input('items') as $item) {
            $product = Product::find($item['id']);
            if (!$product || $product->quantity < $item['quantity']) {
                return response()->json(['message' => 'Insufficient stock for product: ' . $item['name']], 400);
            }
        }

        $order = null;

        try {
            DB::transaction(function () use ($request, &$order) {

                $order = Order::create([
                    'full_name' => $request->buyer_name,
                    'email' => $request->buyer_email,
                    'phone' => $request->buyer_phone,
                    'order_notes' => $request->order_info,
                    'econt_city_id' => $request->econt_city_id,
                    'econt_office_id' => $request->econt_office_id,
                    'econt_street_number' => $request->econt_street_number,
                    'econt_street_id' => $request->econt_street_id,
                    'subtotal' => $request->subtotal,
                    'delivery_type' => $request->delivery_type,
                    'discount' => $request->discount,
                    'total' => $request->total,
                ]);

                // Create order items and reduce stock
                foreach ($request->input('items') as $item) {
                    Log::info('Creating order items for product ID: ' . $item['id']);

                    $order->orderItems()->create([
                        'product_id' => $item['id'],
                        'product_name' => $item['name'],
                        'quantity' => $item['quantity'],
                        'single_price' => $item['price'],
                    ]);

                    // Update product stock
                    $product = Product::find($item['id']);
                    $newStockQuantity = $product->quantity - $item['quantity'];

                    if ($newStockQuantity >= 0) {
                        $product->update(['quantity' => $newStockQuantity]);
                    } else {
                        throw new \Exception('Insufficient stock for product: ' . $product->name);
                    }
                }
            });
        } catch (\Exception $e) {
            Log::error('Transaction failed: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while processing your order.'], 500);
        }

        $deliveryInfo = [
            'name' => $request->buyer_name,
            'delivery_type' => $request->delivery_type,
            'discount' => $request->discount,
            'econt_office' => $request->econt_office,
            'address' => $request->econt_street . ', ' . $request->econt_street_number . ', ' . $request->econt_city,
            'phone' => $request->buyer_phone,
            'email' => $request->buyer_email,
        ];

        $products = $request->input('items');

        // Send order confirmation email
        try {
            Mail::to($request->buyer_email)->send(new OrderConfirmation($deliveryInfo, $products));
        } catch (\Exception $e) {
            Log::error('Failed to send email: ' . $e->getMessage());
        }

        // Return a success response
        return response()->json([
            'message' => 'Order placed successfully!',
            'order' => $order,
            'items' => $order->orderItems,
        ], 201);
    }

    public function getPostCode(Request $request)
    {
        if (session()->has('econt_city_id')) {
            return collect([
                "econt_city_id" => session()->get('econt_city_id'),
                "name"  => session()->get('econt_city_name'),
            ])->toJson();
        }
        $mapServices = new MapServices();
        $postal_code = $mapServices->getPostalCode($request->lat, $request->lon);

        if (strlen($postal_code) == 4) {
            $max_tries = 4;
            $try = 1;
            $found = false;
            while (!$found && $try <= $max_tries) {
                $city = CarrierEcontCity::query()
                    ->where('country_code3', '=', 'BGR')
                    ->where('post_code', 'LIKE', $postal_code . '%')
                    ->first();
                if ($city) {
                    session(['econt_city_id' => $city->econt_city_id]);
                    session(['econt_city_name' => $city->name]);
                    return $city->toJson();
                }
                $try++;
                $postal_code = substr_replace($postal_code, "0", -1);
            }
        }

        return response()->json(["error" => true]);
    }


    public function deliveryType(Request $request)
    {



        $delivery_types = array(
            'econt_address', 'econt_office', 'store_transport', 'store_pickup'
        );
        if (!in_array($request["delivery_type"], $delivery_types)) {
            return json_encode([
                "success" => false,
                "messsage" => trans("Invalid Delivery Type")
            ]);
        }
        $data = $request->input('delivery_data');
        if ($data['delivery_type'] == "store_pickup") {
            return json_encode([
                "canFinish" => true,
                "deliveryFee" => 0,
            ]);
        }

        if ($data['delivery_type'] == 'store_transport') {

            if (empty($data['store_transport_city'])) {
                return json_encode([
                    "success" => false,
                    "messsage" => trans("Select city!")
                ]);
            }

            $endPoint = CarrierEcontCity::query()
                ->where('econt_city_id', $data["store_transport_city"])
                ->first();

            if (!$endPoint) {
                return [
                    "success" => false,
                    "messsage" => trans("Invalid city.")
                ];
            }



            $mapServices = new MapServices();
            $distance = $mapServices->calcDistance($endPoint->name . ', ' . $data['store_transport_address']);
            $totalPrice = ($distance * 2) * 1.5;

            return [
                "canFinish" => true,
                "deliveryFee" => $totalPrice,
            ];
        }


        $econt = new EcontService();

        $result = $econt->calculateDeliveryFee($data);

        Log::info("Request Data: ", $request->all());

        if (!isset($result["label"]["totalPrice"])) {
            Log::error("Econt API Error: " . json_encode($result));
            return [
                "canFinish" => false,
                "message" => $result["message"] ?? ""
            ];
        }
        return response()->json([
            "success" => true,
            "canFinish" => true,
            "deliveryFee" => $result["label"]["totalPrice"],
        ]);
        // return [
        //     "canFinish" => true,
        //     "deliveryFee" => $result["label"]["totalPrice"],
        // ];
    }
}
