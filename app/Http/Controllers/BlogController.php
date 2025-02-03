<?php

namespace App\Http\Controllers;

use App\Models\BlogArticle;
use App\Models\BlogCategory;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function allCategories()
    {
        $blogCategories = BlogCategory::all();
        return response()->json($blogCategories);
    }

    public function allArticles()
    {
        $articles = BlogArticle::all();
        return response()->json($articles);
    }

    public function getArticle($id)
    {
        // Eager load the 'category' relationship
        $article = BlogArticle::with('category')->find($id);

        if ($article) {
            return response()->json($article);
        }

        return response()->json(['message' => 'Article not found'], 404);
    }
}
