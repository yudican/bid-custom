<?php

namespace App\Http\Controllers\Spa\Master;

use App\Http\Controllers\Controller;
use App\Models\SkuMaster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Str;

class SkuController extends Controller
{
    public function index($sku_id = null)
    {
        return view('spa.spa-index');
    }

    public function listSku(Request $request)
    {
        $search = $request->search;
        $status = $request->status;
        $package = $request->package_id;

        $sku =  SkuMaster::query();
        if ($search) {
            $sku->where(function ($query) use ($search) {
                $query->where('sku', 'like', "%$search%");
            });
        }

        if ($status) {
            $sku->where('status', $status);
        }

        if ($package) {
            $sku->where('package_id', $package);
        }


        $variants = $sku->orderBy('created_at', 'desc')->paginate($request->perpage);
        return response()->json([
            'status' => 'success',
            'data' => $variants,
            'message' => 'List SkuMaster'
        ]);
    }


    public function getDetailSku($sku_id)
    {
        $brand = SkuMaster::find($sku_id);

        return response()->json([
            'status' => 'success',
            'data' => $brand,
            'message' => 'Detail SkuMaster'
        ]);
    }

    public function saveSku(Request $request)
    {
        try {
            DB::beginTransaction();
            $data = [
                'sku'  => $request->sku,
                'package_id'  => $request->package_id,
                'expired_at'  => $request->expired_at,
            ];

            SkuMaster::create($data);

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Data SkuMaster Berhasil Disimpan'
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'status' => 'success',
                'message' => 'Data SkuMaster Gagal Disimpan'
            ], 400);
        }
    }

    public function updateSku(Request $request, $sku_id)
    {
        try {
            DB::beginTransaction();
            $data = [
                'sku'  => $request->sku,
                'package_id'  => $request->package_id,
                'expired_at'  => $request->expired_at,
                'status' => $request->status,
            ];

            if ($request->status) {
                $data['status'] = $request->status;
            }

            $row = SkuMaster::find($sku_id);
            $row->update($data);

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Data SkuMaster Berhasil Disimpan'
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'status' => 'success',
                'message' => 'Data SkuMaster Gagal Disimpan'
            ], 400);
        }
    }

    public function deleteSku($sku_id)
    {
        $banner = SkuMaster::find($sku_id);
        $banner->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Data SkuMaster berhasil dihapus'
        ]);
    }
}
