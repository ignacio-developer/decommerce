<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class MapServices
{

    function calcDistance($endPoint) {
        $startPoint = 'Стара Загора';
        $url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=$startPoint&destinations=$endPoint&key=AIzaSyBsABPU22OBYYuOhqvgOt5qWwnMAKnoe4M";
        $response = Http::get($url)->object();
        if($response) {
            $distance = round($response->rows[0]->elements[0]->distance->value / 1000);
        } else {
            $distance = false;
        }
        return $distance;
    }


    function getPostalCode($lat, $lon) {
        $postal_code = false;
        $url = "https://maps.googleapis.com/maps/api/geocode/json?latlng={$lat},{$lon}&key=AIzaSyBsABPU22OBYYuOhqvgOt5qWwnMAKnoe4M";
        $response = Http::get($url)->object();
        if($response) {
            foreach ($response->results[1]->address_components as $value) {
                if ($value->types[0] == 'postal_code') {
                    $postal_code = $value->long_name;
                }
            }
        }
        return $postal_code;
    }

}

