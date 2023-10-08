<?php

namespace App\Http\Controllers\Spa;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Str;

class ProfileController extends Controller
{
    public function index($id = null)
    {
        return view('spa.spa-index');
    }

    public function listTicket(Request $request)
    {
        $search = $request->search;
        $status = $request->status;

        $tiket =  Ticket::query();
        if ($search) {
            $tiket->where(function ($query) use ($search) {
                $query->where('tiket', 'like', "%$search%");
            });
        }

        if ($status) {
            $tiket->where('status', $status);
        }


        $variants = $tiket->orderBy('created_at', 'desc')->paginate($request->perpage);
        return response()->json([
            'status' => 'success',
            'data' => $variants,
            'message' => 'List Ticket'
        ]);
    }


    public function detailProfile()
    {
        $user = User::find(auth()->user()->id);

        return response()->json([
            'status' => 'success',
            'data' => $user,
            'message' => 'Detail Ticket'
        ]);
    }
}
