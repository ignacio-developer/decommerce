<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ProductImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'image_url',
    ];

    protected $appends = ['full_image_url'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

/*
    public function getFullImageUrlAttribute()
    {
        return asset('storage/images/products/' . $this->image_url);
    }
*/
    public function getFullImageUrlAttribute()
    {
        // Ensure we don't duplicate "images/products/"
        return asset('storage/' . ltrim($this->image_url, '/'));
    }

}
