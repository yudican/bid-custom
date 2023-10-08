<?php

namespace App\Http\Controllers\Spa\Master;

use App\Http\Controllers\Controller;
use App\Models\ProductAdditional;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductAdditionalController extends Controller
{
  public function index($product_additional_id = null)
  {
    return view('spa.spa-index');
  }

  public function listProductAdditional(Request $request)
  {
    $search = $request->search;
    $status = $request->status;

    $product =  ProductAdditional::query()->where('type', $request->type);
    if ($search) {
      $product->where(function ($query) use ($search) {
        $query->where('name', 'like', "%$search%");
        $query->orwhere('sku', 'like', "%$search%");
      });
    }

    if ($status) {
      $product->whereIn('status', $status);
    }


    $products = $product->orderBy('created_at', 'desc')->paginate($request->perpage);
    return response()->json([
      'status' => 'success',
      'data' => $products,
      'message' => 'List product'
    ]);
  }

  public function getDetailProductAdditional($product_additional_id)
  {
    $brand = ProductAdditional::find($product_additional_id);

    return response()->json([
      'status' => 'success',
      'data' => $brand,
      'message' => 'Detail Variant'
    ]);
  }

  public function saveProductAdditional(Request $request)
  {
    try {
      DB::beginTransaction();
      $data = [
        'name'  => $request->name,
        'sku'  => $request->sku,
        'status'  => $request->status,
        'notes'  => $request->notes,
        'type'  => $request->type,
      ];

      ProductAdditional::create($data);

      DB::commit();
      return response()->json([
        'status' => 'success',
        'message' => 'Data Product Berhasil Disimpan'
      ]);
    } catch (\Throwable $th) {
      DB::rollback();
      return response()->json([
        'status' => 'success',
        'message' => 'Data Product Gagal Disimpan'
      ], 400);
    }
  }

  public function updateProductAdditional(Request $request, $product_additional_id)
  {
    try {
      DB::beginTransaction();
      $data = [
        'name'  => $request->name,
        'sku'  => $request->sku,
        'status'  => $request->status,
        'notes'  => $request->notes,
        'type'  => $request->type,
      ];
      $row = ProductAdditional::find($product_additional_id);
      $row->update($data);

      DB::commit();
      return response()->json([
        'status' => 'success',
        'message' => 'Data Product Berhasil Disimpan'
      ]);
    } catch (\Throwable $th) {
      DB::rollback();
      return response()->json([
        'status' => 'success',
        'message' => 'Data Product Gagal Disimpan'
      ], 400);
    }
  }

  public function deleteProductAdditional($product_additional_id)
  {
    $banner = ProductAdditional::find($product_additional_id);
    $banner->delete();
    return response()->json([
      'status' => 'success',
      'message' => 'Data Product berhasil dihapus'
    ]);
  }
}
