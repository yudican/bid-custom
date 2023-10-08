<?php

namespace App\Http\Controllers\Spa\Master;

use App\Http\Controllers\Controller;
use App\Models\Variant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Str;

class VariantController extends Controller
{
    public function index($variant_id = null)
    {
        return view('spa.spa-index');
    }

    public function listVariant(Request $request)
    {
        $search = $request->search;
        $status = $request->status;

        $variant =  Variant::query();
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
            'message' => 'List Variant'
        ]);
    }


    public function getDetailVariant($variant_id)
    {
        $brand = Variant::find($variant_id);

        return response()->json([
            'status' => 'success',
            'data' => $brand,
            'message' => 'Detail Variant'
        ]);
    }

    public function saveVariant(Request $request)
    {
        try {
            DB::beginTransaction();
            $data = [
                'name'  => $request->name,
                'slug'  => Str::slug($request->name),
                'status'  => $request->status
            ];

            Variant::create($data);

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Variant Berhasil Disimpan'
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Variant Gagal Disimpan'
            ], 400);
        }
    }

    public function updateVariant(Request $request, $variant_id)
    {
        try {
            DB::beginTransaction();
            $data = [
                'name'  => $request->name,
                'slug'  => Str::slug($request->name),
                'status'  => $request->status
            ];
            $row = Variant::find($variant_id);
            $row->update($data);

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Variant Berhasil Disimpan'
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Variant Gagal Disimpan'
            ], 400);
        }
    }

    public function deleteVariant($variant_id)
    {
        $banner = Variant::find($variant_id);
        $banner->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Data Variant berhasil dihapus'
        ]);
    }
}
