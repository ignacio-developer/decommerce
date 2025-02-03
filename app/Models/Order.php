<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'order_notes',
        'econt_city_id',
        'econt_office_id',
        'econt_street_id',
        'econt_street_number',
        'econt_entrance',
        'econt_floor',
        'econt_apartment_number',
        'econt_label',
        'delivery_fee',
        'delivery_type',
        'subtotal',
        'discount',
        'total',

    ];



    public function user()
     {
         return $this->belongsTo(User::class);
     }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

}

