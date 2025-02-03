<?php

namespace App\Services;

use App\Models\Order;
use Gdinko\Econt\Enums\LabelMode;
use Gdinko\Econt\Enums\ShipmentType;
use Gdinko\Econt\Exceptions\EcontException;
use Gdinko\Econt\Exceptions\EcontValidationException;
use Gdinko\Econt\Facades\Econt;
use Gdinko\Econt\Hydrators\Address;
use Gdinko\Econt\Hydrators\Label;
use Gdinko\Econt\Models\CarrierEcontCity;
use Gdinko\Econt\Models\CarrierEcontOffice;
use Gdinko\Econt\Models\CarrierEcontStreet;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class EcontService
{

    /**
     * @param $address  array   [ econt_city, econt_street, econt_street_number ]
     * @return array
     */
    public function validateAddress($address)
    {
        try {
            $econt_city = CarrierEcontCity::query()
                ->where('econt_city_id', $address["econt_city_id"])->firstOrFail();
            $econt_street = CarrierEcontStreet::query()
                ->where('econt_street_id', $address["econt_street_id"])->firstOrFail();
        } catch (ModelNotFoundException) {
            return [
                "success" => false,
                "message" => trans('Plase, enter street and street number.')
            ];
        }

        try {
            $address = new Address([
                'city' => [
                    'name' => $econt_city->name
                ],
                'street' => $econt_street->name,
                'num' => $address["econt_street_number"]
            ]);

            $validation = Econt::validateAddress($address);
            if ($validation["validationStatus"] == "normal") {
                return array("success" => true);
            }
            return ["success" => false, "message" => trans('Please, enter street and street number.')];
        } catch (EcontValidationException $eve) {
            return $eve->getErrors() + ["success" => false, "message" => trans('Please, enter street and street number.')];
        } catch (EcontException $ee) {
            return $ee->getErrors()["innerErrors"][0] + ["success" => false, "message" => trans('Please, enter street and street number.')];
        }
    }

    /**
     * @param $address  array   [ delivery_type, econt_city, econt_street, econt_street_number, econt_office ]
     * @return array|false
     */
    public function calculateDeliveryFee($data, $total = false, $weight = false)
    {
        if (!Str::startsWith($data["delivery_type"], 'econt')) {
            return false;
        }
        $street = null;
        $street_num = null;
        $office_code = null;


        $econt_city = CarrierEcontCity::query()
            ->where('econt_city_id', $data["econt_city_id"])
            ->first();

        if ($data["delivery_type"] == 'econt_address') {
            $econt_street = CarrierEcontStreet::query()
                ->where('econt_street_id', $data["econt_street_id"])
                ->first();

            if (!$econt_street) {
                return false;
            }

            $street = $econt_street->name;
            $street_num = $data["econt_street_number"];
        }
        if ($data["delivery_type"] == 'econt_office') {
            $econt_office = CarrierEcontOffice::query()
                ->where('econt_office_id', $data["econt_office_id"])
                ->first();

            if (!$econt_office) {
                return false;
            }

            $office_code = $econt_office->code;
        }


        $labelData = [
            'senderClient' => [
                'name' => env('ECONT_SENDER_NAME'),
                'phones' => [
                    0 => env('ECONT_SENDER_PHONE'),
                ],
            ],
            'senderAddress' => [
                'city' => [
                    'country' => [
                        'code3' => 'BGR',
                    ],
                    'name' => env('ECONT_SENDER_CITY_NAME'),
                    'postCode' => env('ECONT_SENDER_CITY_POSTCODE'),
                ],
            ],
            'senderOfficeCode' => env('ECONT_SENDER_OFFICE_ID'),
            'receiverAddress' => [
                'city' => [
                    'country' => [
                        'code3' => 'BGR',
                    ],
                    'name' => 'София',
                    'postCode' => 1000,
                ],
                'street' => $street,
                'num' => $street_num,
            ],
            'receiverOfficeCode' => $office_code,
            'packCount' => 1,
            'shipmentType' => ShipmentType::PACK,
            'weight' => $weight ?? 1,
            'shipmentDescription' => 'строителни материали',
            'services' => [
                'cdAmount' => $total,
                'cdType' => 'get',
                'cdCurrency' => 'BGN',
                'smsNotification' => true,
            ],
            'payAfterAccept' => false,
            'payAfterTest' => false,
        ];


        $label = new Label(
            $labelData,
            LabelMode::CALCULATE
        );


        try {
            $result = Econt::createLabel($label);
        } catch (EcontException) {
            return [
                "message" => "Не може да се достави до избрана локация. Моля, опитайте друга."
            ];
        }
        return $result;
    }

    public function createLabelFromOrder(Order $order)
    {
        // ECONT ADDRESS DATA
        $street = ($order->delivery_type == 'econt_address') ? $order->econt_street->name : null;
        $street_num = ($order->delivery_type == 'econt_address') ? $order->econt_street_number : null;
        // ECONT OFFICE DATA
        $office_code = ($order->delivery_type == 'econt_office') ? $order->econt_office->code : null;
        $labelData = [
            'senderClient' => [
                'name' => env('ECONT_SENDER_NAME'),
                'phones' => [
                    0 => env('ECONT_SENDER_PHONE'),
                ],
            ],
            'senderAddress' => [
                'city' => [
                    'country' => [
                        'code3' => 'BGR',
                    ],
                    'name' => env('ECONT_SENDER_CITY_NAME'),
                    'postCode' => env('ECONT_SENDER_CITY_POSTCODE'),
                ],
            ],
            'senderOfficeCode' => env('ECONT_SENDER_OFFICE_ID'),
            'receiverClient' =>
                [
                    'name' => $order->full_name,
                    'phones' =>
                        [
                            0 => $order->phone,
                        ],
                ],
            'receiverAddress' => [
                'city' => [
                    'country' => [
                        'code3' => 'BGR',
                    ],
                    'name' => $order->econt_city->name,
                    'postCode' => $order->econt_city->post_code,
                ],
                'street' => $street,
                'num' => $street_num,
            ],
            'receiverOfficeCode' => $office_code,
            'packCount' => 1,
            'shipmentType' => ShipmentType::PACK,
            'weight' => 1,
            'shipmentDescription' => 'стока',
            'services' => [
                'cdAmount' => number_format($order->total, 2),
                'cdType' => 'get',
                'cdCurrency' => 'BGN',
                'smsNotification' => true,
            ],
            'payAfterAccept' => false,
            'payAfterTest' => false,
            'holidayDeliveryDay' => 'workday',
        ];

        Log::channel('econt')->info($labelData);

        $label = new Label(
            $labelData,
            LabelMode::CREATE
        );

        try {
            $result = Econt::createLabel($label);
        } catch (EcontException $ee) {
            Log::channel('econt')->error($ee->getMessage());
        }


        return $result ?? null;
    }
}
