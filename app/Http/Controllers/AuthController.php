<?php


namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        Log::info('Attempting login with:', $credentials);


        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('token-name')->plainTextToken;

            return response()->json(['token' => $token], 200);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }


    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'User registered successfully'], 201);
    }


    public function sendResetCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
            ], 400);
        }


        $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $resetCode = substr(str_shuffle(str_repeat($characters, 5)), 0, 5);

        $user = User::where('email', $request->email)->first();
        $user->reset_code = $resetCode;
        $user->save();

        Mail::send('emails.reset_code', ['resetCode' => $resetCode, 'userName' => $user->name], function ($message) use ($request) {
            $message->to($request->email);
            $message->subject('Password Reset Code');
        });

        return response()->json([
            'success' => true,
            'message' => 'A password reset code has been sent to your email.',
        ]);
    }


    public function updatePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'reset_code' => 'required|string|size:5',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        if ($user->reset_code !== $request->reset_code) {
            return response()->json(['error' => 'Invalid reset code.'], 403);
        }

        $user->password = Hash::make($request->new_password);
        $user->reset_code = null;
        $user->save();

        return response()->json(['message' => 'Password updated successfully.']);
    }

    public function show(Request $request)
    {
        return response()->json($request->user());
    }


}
