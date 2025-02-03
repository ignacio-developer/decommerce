<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\EcontController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use App\Http\Middleware\SecurityHeaders;
use App\Models\BlogCategory;
use Illuminate\Support\Facades\Route;


Route::middleware([SecurityHeaders::class])->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/reset-password', [AuthController::class, 'sendResetCode']);
    Route::post('/update-password', [AuthController::class, 'updatePassword']);

    Route::middleware('auth:sanctum')->delete('/reviews/{id}', [ReviewController::class, 'destroy']);
    Route::put('/reviews/{review}', [ReviewController::class, 'update'])->name('reviews.update');

    Route::get('/user', [AuthController::class, 'show']);
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/product/{id}', [ProductController::class, 'show']);
    Route::get('/products/top-rated', [ProductController::class, 'topRated']);
    Route::post('/apply-coupon', [CouponController::class, 'applyCoupon']);
    Route::get('/blog-categories', [BlogController::class, 'allCategories']);
    Route::get('/articles', [BlogController::class, 'allArticles']);
    Route::get('/article/{id}', [BlogController::class, 'getArticle']);
    Route::post('/contact', [ContactController::class, 'sendContactForm']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::post('/order/delivery_type', [OrderController::class, 'deliveryType'])->name('order.delivery.type');
    Route::post('/order/postal_code', [OrderController::class, 'getPostCode'])->name('order.postal_code');

    // Econt routes
    Route::get('/econt/get_cities', [EcontController::class, 'getCities'])->name('econt.get.cities');
    Route::get('/econt/get_offices', [EcontController::class, 'getOffices'])->name('econt.get.offices');
    Route::get('/econt/get_streets', [EcontController::class, 'getStreets'])->name('econt.get.streets');
    Route::get('/econt/validate_address', [EcontController::class, 'validateAddress'])->name('econt.validate.address');
});



Route::get('/', function () {
    return view('welcome');
});

Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');




