<?php

namespace App\Http\Controllers\Spa\Master;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Str;

class PackageController extends Controller
{
  public function index($package_id = null)
  {
    return view('spa.spa-index');
  }

  public function listPackage(Request $request)
  {
    $search = $request->search;
    $status = $request->status;

    $banner =  Package::query();
    if ($search) {
      $banner->where(function ($query) use ($search) {
        $query->where('name', 'like', "%$search%");
      });
    }

    if ($status) {
      $banner->whereIn('status', $status);
    }


    $banners = $banner->orderBy('created_at', 'desc')->paginate($request->perpage);
    return response()->json([
      'status' => 'success',
      'data' => $banners,
      'message' => 'List Package'
    ]);
  }


  public function getDetailPackage($package_id)
  {
    $brand = Package::find($package_id);

    return response()->json([
      'status' => 'success',
      'data' => $brand,
      'message' => 'Detail Package'
    ]);
  }

  public function savePackage(Request $request)
  {
    try {
      DB::beginTransaction();
      $data = [
        'name'  => $request->name,
        'slug'  => Str::slug($request->name),
        'description'  => $request->description,
        'status'  => $request->status
      ];

      Package::create($data);

      DB::commit();
      return response()->json([
        'status' => 'success',
        'message' => 'Data Package Berhasil Disimpan'
      ]);
    } catch (\Throwable $th) {
      DB::rollback();
      return response()->json([
        'status' => 'success',
        'message' => 'Data Package Gagal Disimpan'
      ], 400);
    }
  }

  public function updatePackage(Request $request, $package_id)
  {
    try {
      DB::beginTransaction();
      $data = [
        'name'  => $request->name,
        'slug'  => Str::slug($request->name),
        'description'  => $request->description,
        'status'  => $request->status
      ];
      $row = Package::find($package_id);
      $row->update($data);

      DB::commit();
      return response()->json([
        'status' => 'success',
        'message' => 'Data Package Berhasil Disimpan'
      ]);
    } catch (\Throwable $th) {
      DB::rollback();
      return response()->json([
        'status' => 'success',
        'message' => 'Data Package Gagal Disimpan'
      ], 400);
    }
  }

  public function deletePackage($package_id)
  {
    $banner = Package::find($package_id);
    $banner->delete();
    return response()->json([
      'status' => 'success',
      'message' => 'Data Package berhasil dihapus'
    ]);
  }
}
