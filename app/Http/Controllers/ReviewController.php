<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'productId' => 'required|exists:products,id',
            'userId' => 'required|exists:users,id',
            'comment' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
        ]);

        $review = Review::create([
            'product_id' => $validated['productId'],
            'user_id' => $validated['userId'],
            'comment' => $validated['comment'],
            'rating' => $validated['rating'],
            'title' => $validated['title'],
        ]);

        return response()->json(['message' => 'Review submitted successfully!', 'review' => $review], 201);
    }


    public function update(Request $request, Review $review)
    {
        // Ensure the authenticated user owns the review
        if ($review->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Validate the updated review data
        $validated = $request->validate([
            'comment' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        // Update the review
        $review->update([
            'comment' => $validated['comment'],
            'rating' => $validated['rating'],
        ]);

        return response()->json(['message' => 'Review updated successfully', 'review' => $review], 200);
    }


    public function destroy($id)
    {
        // Find the review by its ID
        $review = Review::find($id);

        // Check if the review exists
        if (!$review) {
            return response()->json(['message' => 'Review not found'], 404);
        }

        // Check if the logged-in user is the owner of the review
        if ($review->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete the review
        $review->delete();

        // Return success response
        return response()->json(['message' => 'Review deleted successfully'], 200);
    }
}
