<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\EcontService;
use Gdinko\Econt\Enums\LabelMode;
use Gdinko\Econt\Enums\ShipmentType;
use Gdinko\Econt\Facades\Econt;
use Gdinko\Econt\Hydrators\Label;
use Gdinko\Econt\Models\CarrierEcontCity;
use Gdinko\Econt\Models\CarrierEcontOffice;
use Gdinko\Econt\Models\CarrierEcontStreet;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class EcontController extends Controller
{
    public function getCities(Request $request)
    {
        $cities = [];
        if ($request->has('q')) {

            $search = $request->q;
            $cities = CarrierEcontCity::query()
                ->select(DB::raw("econt_city_id, CONCAT(name,', ', region_name) as name"))
                ->where('name', '!=', "")
                ->where('name', 'LIKE', "%{$search}%")
                ->orWhere('name_en', 'LIKE', "%{$search}%")
                ->orWhere('post_code', 'LIKE', "%{$search}%")
//                ->limit('10')
                ->get();
        }

        return response()->json($cities);
    }

    public function getOffices(Request $request)
    {
        $offices = [];
        if ($request->has('econt_city.id')) {
            $cityId = $request->input('econt_city.id');
            $query = CarrierEcontOffice::query()
                ->where('econt_city_id', '=', $cityId);
            if ($request->has('q')) {
                $search = $request->q;
                $query
                    ->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('name_en', 'LIKE', "%{$search}%")
                    ->where('econt_city_id', '=', $cityId);
                // ->limit('10');
            }
            $offices = $query->get();
        }
        return response()->json($offices);
    }

    public function getStreets(Request $request)
    {
        $streets = [];
        if ($request->has('econt_city.id')) {
            $cityId = $request->input('econt_city.id');
            $query = CarrierEcontStreet::query()
                ->where('econt_city_id', '=', $cityId);

            if ($request->has('q')) {
                $search = $request->q;
                $query
                    ->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('name_en', 'LIKE', "%{$search}%")
                    ->where('econt_city_id', '=', $cityId);
            }

            $streets = $query->get();
        }

        return response()->json($streets);
    }


    public function validateAddress(Request $request)
    {
        $data = $request->all();

        $econtService = new EcontService();
        return json_encode($econtService->validateAddress($data));
    }

    public function createLabel(Order $order)
    {
        $path = $order->econtLabel();

        return response()->download($path);
    }
}
