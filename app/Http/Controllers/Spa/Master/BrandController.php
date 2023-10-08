<?php

namespace App\Http\Controllers\Spa\Master;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\BrandCustomerSupport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Str;


class BrandController extends Controller
{
    public function index($brand_id = null)
    {
        return view('spa.spa-index');
    }

    public function listBrand(Request $request)
    {
        $search = $request->search;
        $status = $request->status;

        $brand =  Brand::with('brandCustomerSupport')->where('brands.status', 1);

        if ($search) {
            $brand->where(function ($query) use ($search) {
                $query->where('name', 'like', "%$search%");
                $query->orWhere('email', 'like', "%$search%");
                $query->orWhere('phone', 'like', "%$search%");
            });
        }

        if ($status) {
            $brand->whereIn('tbl_brands.status', $status);
        }


        $brands = $brand->orderBy('created_at', 'desc')->paginate($request->perpage);
        return response()->json([
            'status' => 'success',
            'data' => $brands,
            'message' => 'List Brand'
        ]);
    }


    public function getDetailBrand($brand_id)
    {
        $brand = Brand::with('brandCustomerSupport')->find($brand_id);

        return response()->json([
            'status' => 'success',
            'data' => $brand,
            'message' => 'Detail Brand'
        ]);
    }

    public function saveBrand(Request $request)
    {
        try {
            DB::beginTransaction();
            $logo = $this->uploadImage($request, 'logo');
            $data = [
                'name'  => $request->name,
                'slug'  => Str::slug($request->name),
                'logo'  => $logo,
                'phone'  => $request->phone,
                'email'  => $request->email,
                'address'  => $request->address,
                'provinsi_id'  => $request->provinsi_id,
                'kabupaten_id'  => $request->kabupaten_id,
                'kecamatan_id'  => $request->kecamatan_id,
                'kelurahan_id'  => $request->kelurahan_id,
                'kodepos'  => $request->kodepos,
                'origin_code'  => $request->origin_code,
                'twitter'  => $request->twitter,
                'facebook'  => $request->facebook,
                'instagram'  => $request->instagram,
                'status'  => $request->status,
                'code'  => $request->code,
                'description'  => $request->description
            ];

            $brand = Brand::create($data);

            $cs_data = [];
            foreach (json_decode($request->customerlist, true) as $key => $value) {
                $cs_data[] = [
                    'brand_id' => $brand->id,
                    'type' => $value['type'],
                    'value' => $value['value'],
                    'status' => $value['status'],
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            }

            BrandCustomerSupport::insert($cs_data);

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Brand Berhasil Disimpan'
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Brand Gagal Disimpan'
            ], 400);
        }
    }

    public function updateBrand(Request $request, $brand_id)
    {
        try {
            DB::beginTransaction();

            $data = [
                'name'  => $request->name,
                'slug'  => Str::slug($request->name),
                'phone'  => $request->phone,
                'email'  => $request->email,
                'address'  => $request->address,
                'provinsi_id'  => $request->provinsi_id,
                'kabupaten_id'  => $request->kabupaten_id,
                'kecamatan_id'  => $request->kecamatan_id,
                'kelurahan_id'  => $request->kelurahan_id,
                'kodepos'  => $request->kodepos,
                'origin_code'  => $request->origin_code,
                'twitter'  => $request->twitter,
                'facebook'  => $request->facebook,
                'instagram'  => $request->instagram,
                'status'  => $request->status,
                'code'  => $request->code,
                'description'  => $request->description
            ];
            $row = Brand::find($brand_id);


            if ($request->logo) {
                $logo = $this->uploadImage($request, 'logo');
                $data = ['logo' => $logo];
                if (Storage::exists('public/' . $request->logo)) {
                    Storage::delete('public/' . $request->logo);
                }
            }

            $row->update($data);
            $row->brandCustomerSupport()->delete();
            $cs_data = [];
            foreach (json_decode($request->customerlist, true) as $key => $value) {
                $cs_data[] = [
                    'brand_id' => $row->id,
                    'type' => $value['type'],
                    'value' => $value['value'],
                    'status' => $value['status'],
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            }

            BrandCustomerSupport::insert($cs_data);
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Brand Berhasil Disimpan'
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Brand Gagal Disimpan',
                'error' => $th->getMessage()
            ], 400);
        }
    }

    public function deleteBrand($brand_id)
    {
        $brand = Brand::find($brand_id);
        $brand->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Data Brand berhasil dihapus'
        ]);
    }

    public function uploadImage($request, $path)
    {
        if (!$request->hasFile($path)) {
            return response()->json([
                'error' => true,
                'message' => 'File not found',
                'status_code' => 400,
            ], 400);
        }
        $file = $request->file($path);
        if (!$file->isValid()) {
            return response()->json([
                'error' => true,
                'message' => 'Image file not valid',
                'status_code' => 400,
            ], 400);
        }
        $file = Storage::disk('s3')->put('upload/master/brand', $request[$path], 'public');
        return $file;
    }
}
