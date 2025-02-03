<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $deliveryInfo;
    public $products;

    public function __construct($deliveryInfo, $products)
    {
        $this->deliveryInfo = $deliveryInfo;
        $this->products = $products;
    }

    public function build()
    {
        // Calculate total price
        $totalPrice = array_reduce($this->products, function ($carry, $product) {
            // Use the on_sale_price if the product is on sale
            $price = isset($product['on_sale']) && $product['on_sale']
                ? $product['on_sale_price']
                : $product['price'];

            return $carry + ($price * $product['quantity']);
        }, 0);

        return $this->view('emails.order_confirmation')
            ->with([
                'deliveryInfo' => $this->deliveryInfo,
                'products' => $this->products,
                'totalPrice' => $totalPrice,
            ]);
    }
}
