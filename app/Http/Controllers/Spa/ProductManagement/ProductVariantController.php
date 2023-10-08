<?php

namespace App\Http\Controllers\Spa\ProductManagement;

use App\Exports\ProductVariantExport;
use App\Exports\ProductVariantBaseInventoryExport;
use App\Http\Controllers\Controller;
use App\Models\Level;
use App\Models\LogApproveFinance;
use App\Models\Price;
use App\Models\ProductVariant;
use App\Models\Role;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Str;

class ProductVariantController extends Controller
{
    public function index($product_variant_id = null)
    {
        return view('spa.spa-index');
    }

    public function listProductVariant(Request $request)
    {
        $search = $request->search;
        $status = $request->status;
        $package_id = $request->package_id;
        $variant_id = $request->variant_id;
        $role_id = $request->role_id;
        $sku = $request->sku;
        $product_id = $request->product_id;
        $sales_channel = $request->sales_channel;

        $product =  ProductVariant::query();
        if ($search) {
            $product->where(function ($query) use ($search) {
                $query->where('name', 'like', "%$search%");
            });
        }

        if ($status) {
            $product->whereIn('status', $status);
        }

        if ($package_id) {
            $product->whereIn('package_id', $package_id);
        }

        if ($variant_id) {
            $product->whereIn('variant_id', $variant_id);
        }

        if ($sku) {
            $product->whereIn('sku', $sku);
        }

        if ($product_id) {
            $product->where('product_id', $product_id);
        }

        if ($sales_channel) {
            $product->where('sales_channel', 'like', "%$sales_channel%");
        }

        $products = $product->orderBy('created_at', 'asc')->whereNull('deleted_at')->paginate($request->perpage);
        if ($role_id) {
            $role = Role::find($role_id);
            return response()->json([
                'status' => 'success',
                'data' => tap($products)->map(function ($item) use ($role) {
                    $item['final_price'] = $item->getPrice($role->role_type)['final_price'];
                    return $item;
                }),
                'message' => 'List Product'
            ]);
        }

        return response()->json([
            'status' => 'success',
            'data' => $products,
            'message' => 'List Product'
        ]);
    }


    public function getDetailProductVariant($product_variant_id = null)
    {
        if ($product_variant_id) {
            $product = ProductVariant::with('product')->find($product_variant_id);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'product' => $product,
                    'prices' => Level::all()->map(function ($item) use ($product) {
                        $price = $product->prices->where('level_id', $item->id)->first();
                        return [
                            'id' => $item->id,
                            'name' => $item->name,
                            'basic_price' => $price ? $price->basic_price : 0,
                            'final_price' => $price ? $price->final_price : 0,
                        ];
                    })
                ],
                'message' => 'Detail Product'
            ]);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'product' => null,
                'prices' => Level::all()->map(function ($item) {

                    return [
                        'id' => $item->id,
                        'name' => $item->name,
                        'basic_price' => 0,
                        'final_price' => 0,
                    ];
                })
            ],
            'message' => 'Detail Product'
        ]);
    }

    public function saveProductVariant(Request $request)
    {
        try {
            DB::beginTransaction();

            $image = Storage::disk('s3')->put('upload/product-variant', $request->image, 'public');
            $prices = json_decode($request->prices, true);
            $sales_channel = json_decode($request->sales_channel, true);
            $data = [
                'product_id'  => $request->product_id,
                'package_id'  => $request->package_id,
                'variant_id'  => $request->variant_id,
                'sku_variant'  => $request->sku_variant,
                'sku'  => $request->sku,
                'sku_tiktok'  => $request->sku_tiktok,
                'qty_bundling'  => $request->qty_bundling,
                'name'  => $request->name,
                'slug'  => Str::slug($request->slug),
                'description'  => $request->description,
                'sales_channel'  => implode(',', $sales_channel),
                'image'  => $image,
                'weight'  => $request->weight,
                'status'  => $request->status,
            ];
            $product = ProductVariant::create($data);
            foreach ($prices as $key => $value) {
                Price::create([
                    'product_variant_id' => $product->id,
                    'level_id' => $value['id'],
                    'basic_price' => $value['basic_price'],
                    'final_price' => $value['final_price'],
                ]);
            }
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Save Product Success'
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Product Failed to Save'
            ], 400);
        }
    }

    public function updateProductVariant(Request $request, $product_variant_id)
    {
        try {
            DB::beginTransaction();
            $product = ProductVariant::find($product_variant_id);
            $prices = json_decode($request->prices, true);
            $sales_channel = json_decode($request->sales_channel, true);
            $data = [
                'product_id'  => $request->product_id,
                'package_id'  => $request->package_id,
                'variant_id'  => $request->variant_id,
                'sku_variant'  => $request->sku_variant,
                'sku'  => $request->sku,
                'sku_tiktok'  => $request->sku_tiktok,
                'qty_bundling'  => $request->qty_bundling,
                'name'  => $request->name,
                'slug'  => Str::slug($request->slug),
                'description'  => $request->description,
                'sales_channel'  => implode(',', $sales_channel),
                'weight'  => $request->weight,
                'status'  => $request->status,
            ];

            if ($request->image) {
                $image = Storage::disk('s3')->put('upload/product-variant', $request->image, 'public');
                $data = ['image' => $image];
                if (Storage::exists('public/' . $request->image)) {
                    Storage::delete('public/' . $request->image);
                }
            }

            $product->update($data);

            foreach ($prices as $key => $value) {
                $price = Price::where('product_variant_id', $product_variant_id)->where('level_id', $value['id'])->first();
                if ($price) {
                    $price->update([
                        'product_variant_id' => $product->id,
                        'level_id' => $value['id'],
                        'basic_price' => $value['basic_price'],
                        'final_price' => $value['final_price'],
                    ]);
                } else {
                    $price = Price::create([
                        'product_variant_id' => $product->id,
                        'level_id' => $value['id'],
                        'basic_price' => $value['basic_price'],
                        'final_price' => $value['final_price'],
                    ]);
                }
            }

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Save Product Success'
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Product Failed to Save',
                'error' => $th->getMessage()
            ], 400);
        }
    }

    public function updateStatusProductVariant(Request $request, $product_variant_id)
    {
        $product = ProductVariant::find($product_variant_id);
        $product->status = $request->status;
        $product->save();

        return response()->json([
            'status' => 'success',
            'data' => $product,
            'message' => 'Update Status Product'
        ]);
    }

    public function deleteProductVariant($product_variant_id)
    {
        $product = ProductVariant::find($product_variant_id);
        $product->update(['deleted_at' => Carbon::now()]);

        return response()->json([
            'status' => 'success',
            'message' => 'Delete Product Success'
        ]);
    }

    public function export()
    {
        $file_name = 'product-variant.xlsx';
        Excel::store(new ProductVariantExport(), $file_name, 's3', null, [
            'visibility' => 'public',
        ]);
        return response()->json([
            'status' => 'success',
            'data' => Storage::disk('s3')->url($file_name),
            'message' => 'List Convert'
        ]);
    }

    public function exportBaseInventory()
    {
        $file_name = 'product-variant.xlsx';
        Excel::store(new ProductVariantBaseInventoryExport(), $file_name, 's3', null, [
            'visibility' => 'public',
        ]);
        return response()->json([
            'status' => 'success',
            'data' => Storage::disk('s3')->url($file_name),
            'message' => 'List Convert'
        ]);
    }
}
