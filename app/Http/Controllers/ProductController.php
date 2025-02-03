<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['images', 'category'])->get();


        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::with(['images', 'reviews.user'])->find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json($product);
    }


    public function topRated()
    {
        $topRatedProducts = Product::with(['images', 'category'])
        ->withAvg('reviews', 'rating')
        ->orderByDesc('reviews_avg_rating')
        ->take(6)
        ->get();

        return response()->json($topRatedProducts);
    }

}
