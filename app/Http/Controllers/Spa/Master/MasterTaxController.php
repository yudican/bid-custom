<?php

namespace App\Http\Controllers\Spa\Master;

use App\Http\Controllers\Controller;
use App\Models\MasterTax;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Str;

class MasterTaxController extends Controller
{
    public function index($master_tax_id = null)
    {
        return view('spa.spa-index');
    }

    public function listMasterTax(Request $request)
    {
        $search = $request->search;
        $status = $request->status;

        $master_tax =  MasterTax::query();
        if ($search) {
            $master_tax->where(function ($query) use ($search) {
                $query->where('name', 'like', "%$search%");
            });
        }

        if ($status) {
            $master_tax->whereIn('status', $status);
        }


        $master_taxs = $master_tax->orderBy('created_at', 'desc')->paginate($request->perpage);
        return response()->json([
            'status' => 'success',
            'data' => $master_taxs,
            'message' => 'List MasterTax'
        ]);
    }


    public function getDetailMasterTax($master_tax_id)
    {
        $brand = MasterTax::find($master_tax_id);

        return response()->json([
            'status' => 'success',
            'data' => $brand,
            'message' => 'Detail MasterTax'
        ]);
    }

    public function saveMasterTax(Request $request)
    {
        try {
            DB::beginTransaction();
            $data = [
                'tax_code'  => $request->tax_code,
                'tax_percentage'  => $request->tax_percentage
            ];

            MasterTax::create($data);

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Data MasterTax Berhasil Disimpan'
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'status' => 'success',
                'message' => 'Data MasterTax Gagal Disimpan'
            ], 400);
        }
    }

    public function updateMasterTax(Request $request, $master_tax_id)
    {
        try {
            DB::beginTransaction();
            $data = [
                'tax_code'  => $request->tax_code,
                'tax_percentage'  => $request->tax_percentage
            ];
            $row = MasterTax::find($master_tax_id);
            $row->update($data);

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Data MasterTax Berhasil Disimpan'
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'status' => 'success',
                'message' => 'Data MasterTax Gagal Disimpan'
            ], 400);
        }
    }

    public function deleteMasterTax($master_tax_id)
    {
        $banner = MasterTax::find($master_tax_id);
        $banner->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Data MasterTax berhasil dihapus'
        ]);
    }
}
