<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Seed Users
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('0123456789'),
        ]);
        
        User::factory(5)->create([ // Creates 5 random users
            'password' => Hash::make('0123456789')
        ]);

        // Seed Categories
        $categories = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Toys'];
        
        foreach ($categories as $category) {
            Category::create([
                'name' => $category,
                'img' => '/images/categories/categorieimage.jpg', // Placeholder image
            ]);
        }

        // Seed Products
        $categories = Category::all();
        foreach ($categories as $category) {
            for ($i = 0; $i < 10; $i++) { // 10 products per category
                $product = Product::create([
                    'category_id' => $category->id,
                    'name' => $category->name . ' Product ' . ($i + 1),
                    'description' => 'This is a description for ' . $category->name . ' Product ' . ($i + 1),
                    'price' => rand(10, 500),
                    'on_sale_price' => rand(5, 450),
                    'quantity' => rand(1, 100),
                    'on_sale' => rand(0, 1),
                    'on_sale_percent' => rand(5, 50),
                ]);

                // Seed Product Images (2 per product)
                for ($j = 0; $j < 2; $j++) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_url' => '/images/products/productimage.jpg',
                    ]);
                }
            }
        }
    }
}
