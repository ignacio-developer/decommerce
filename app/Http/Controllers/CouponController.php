<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Coupon;

class CouponController extends Controller
{
    public function applyCoupon(Request $request)
    {
        $request->validate([
            'coupon_code' => 'required|string'
        ]);

        $coupon = Coupon::where('coupon_code', $request->coupon_code)->first();

        if (!$coupon || !$coupon->is_active) {
            return response()->json([
                'valid' => false,
                'message' => 'Invalid or expired coupon'
            ], 404);
        }

        return response()->json([
            'valid' => true,
            'percent' => $coupon->percent,
        ]);
    }
}
