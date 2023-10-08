<?php

namespace App\Http\Controllers\Spa\Master;

use App\Http\Controllers\Controller;
use App\Models\PaymentTerm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Str;

class PaymentTermController extends Controller
{
    public function index($payment_term_id = null)
    {
        return view('spa.spa-index');
    }

    public function listPaymentTerm(Request $request)
    {
        $search = $request->search;
        $status = $request->status;

        $variant =  PaymentTerm::query();
        if ($search) {
            $variant->where(function ($query) use ($search) {
                $query->where('name', 'like', "%$search%");
            });
        }

        if ($status) {
            $variant->whereIn('status', $status);
        }


        $variants = $variant->orderBy('created_at', 'desc')->paginate($request->perpage);
        return response()->json([
            'status' => 'success',
            'data' => $variants,
            'message' => 'List PaymentTerm'
        ]);
    }


    public function getDetailPaymentTerm($payment_term_id)
    {
        $brand = PaymentTerm::find($payment_term_id);

        return response()->json([
            'status' => 'success',
            'data' => $brand,
            'message' => 'Detail PaymentTerm'
        ]);
    }

    public function savePaymentTerm(Request $request)
    {
        try {
            DB::beginTransaction();
            $data = [
                'name'  => $request->name,
                'description'  => $request->description,
                'days_of'  => $request->days_of
            ];

            PaymentTerm::create($data);

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Data PaymentTerm Berhasil Disimpan'
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'status' => 'success',
                'message' => 'Data PaymentTerm Gagal Disimpan'
            ], 400);
        }
    }

    public function updatePaymentTerm(Request $request, $payment_term_id)
    {
        try {
            DB::beginTransaction();
            $data = [
                'name'  => $request->name,
                'description'  => $request->description,
                'days_of'  => $request->days_of
            ];
            $row = PaymentTerm::find($payment_term_id);
            $row->update($data);

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Data PaymentTerm Berhasil Disimpan'
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'status' => 'success',
                'message' => 'Data PaymentTerm Gagal Disimpan'
            ], 400);
        }
    }

    public function deletePaymentTerm($payment_term_id)
    {
        $banner = PaymentTerm::find($payment_term_id);
        $banner->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Data PaymentTerm berhasil dihapus'
        ]);
    }
}
