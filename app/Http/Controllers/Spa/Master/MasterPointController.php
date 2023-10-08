<?php

namespace App\Http\Controllers\Spa\Master;

use App\Http\Controllers\Controller;
use App\Models\MasterPoint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Str;

class MasterPointController extends Controller
{
    public function index($master_point_id = null)
    {
        return view('spa.spa-index');
    }

    public function listMasterPoint(Request $request)
    {
        $search = $request->search;
        $brand_id = $request->brand_id;
        $type = $request->type;

        $row =  MasterPoint::query();
        if ($search) {
            $row->where(function ($query) use ($search) {
                $query->where('type', 'like', "%$search%");
            });
        }

        if ($type) {
            $row->where('type', $type);
        }

        if ($brand_id) {
            $row->whereHas('brands', function ($query) use ($brand_id) {
                $query->whereIn('brands.id', $brand_id);
            });
        }


        $rows = $row->orderBy('created_at', 'desc')->paginate($request->perpage);
        return response()->json([
            'status' => 'success',
            'data' => $rows,
            'message' => 'List Master Point'
        ]);
    }


    public function getDetailMasterPoint($master_point_id)
    {
        $row = MasterPoint::with('brands')->find($master_point_id);

        return response()->json([
            'status' => 'success',
            'data' => $row,
            'message' => 'Detail Master Point'
        ]);
    }

    public function saveMasterPoint(Request $request)
    {
        try {
            DB::beginTransaction();
            $data = [
                'type'  => $request->type,
                'point'  => $request->point,
                'min_trans'  => $request->min_trans,
                'max_trans'  => $request->max_trans,
                'nominal'  => $request->nominal,
            ];

            $point = MasterPoint::create($data);
            $brand_id = json_decode($request->brand_id, true);
            $point->brands()->attach($brand_id);
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Master Point Berhasil Disimpan'
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Master Point Gagal Disimpan'
            ], 400);
        }
    }

    public function updateMasterPoint(Request $request, $master_point_id)
    {
        try {
            DB::beginTransaction();
            $data = [
                'type'  => $request->type,
                'point'  => $request->point,
                'min_trans'  => $request->min_trans,
                'max_trans'  => $request->max_trans,
                'nominal'  => $request->nominal,
            ];
            $row = MasterPoint::find($master_point_id);

            $row->update($data);
            $brand_id = json_decode($request->brand_id, true);
            $row->brands()->sync($brand_id);
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Master Point Berhasil Disimpan'
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Master Point Gagal Disimpan'
            ], 400);
        }
    }

    public function deleteMasterPoint($master_point_id)
    {
        $row = MasterPoint::find($master_point_id);
        $row->delete();
        $row->brands()->detach();
        return response()->json([
            'status' => 'success',
            'message' => 'Data Master Point berhasil dihapus'
        ]);
    }
}
