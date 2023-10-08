<?php

namespace App\Http\Controllers\Spa\Master;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Str;


class BannerController extends Controller
{
    public function index($banner_id = null)
    {
        return view('spa.spa-index');
    }

    public function listBanner(Request $request)
    {
        $search = $request->search;
        $status = $request->status;

        $banner =  Banner::query();
        if ($search) {
            $banner->where(function ($query) use ($search) {
                $query->where('title', 'like', "%$search%");
            });
        }

        if ($status) {
            $banner->whereIn('status', $status);
        }


        $banners = $banner->orderBy('created_at', 'desc')->paginate($request->perpage);
        return response()->json([
            'status' => 'success',
            'data' => $banners,
            'message' => 'List Banner'
        ]);
    }


    public function getDetailBanner($banner_id)
    {
        $brand = Banner::with('brands')->find($banner_id);

        return response()->json([
            'status' => 'success',
            'data' => $brand,
            'message' => 'Detail Banner'
        ]);
    }

    public function saveBanner(Request $request)
    {
        try {
            DB::beginTransaction();
            $image = $this->uploadImage($request, 'image');
            $brand_id = json_decode($request->brand_id, true);
            $data = [
                'title'  => $request->title,
                'url'  => $request->url,
                'image'  => $image,
                'slug'  => Str::slug($request->title),
                'description'  => $request->description,
                'brand_id'  => is_array($brand_id) && count($brand_id) > 0 ? $brand_id[0] : 1,
                'status'  => $request->status
            ];

            $banner = Banner::create($data);
            $banner->brands()->attach($brand_id);

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Banner Berhasil Disimpan'
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Banner Gagal Disimpan'
            ], 400);
        }
    }

    public function updateBanner(Request $request, $banner_id)
    {
        try {
            DB::beginTransaction();
            $brand_id = json_decode($request->brand_id, true);
            $data = [
                'title'  => $request->title,
                'url'  => $request->url,
                'slug'  => Str::slug($request->title),
                'description'  => $request->description,
                'brand_id'  => is_array($brand_id) && count($brand_id) > 0 ? $brand_id[0] : 1,
                'status'  => $request->status
            ];
            $row = Banner::find($banner_id);

            if ($request->image) {
                $image = $this->uploadImage($request, 'image');
                $data = ['image' => $image];
                if (Storage::exists('public/' . $request->image)) {
                    Storage::delete('public/' . $request->image);
                }
            }

            $row->update($data);
            $row->brands()->sync($brand_id);

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Banner Berhasil Disimpan'
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Banner Gagal Disimpan'
            ], 400);
        }
    }

    public function deleteBanner($banner_id)
    {
        $banner = Banner::find($banner_id);
        $banner->brands()->detach();
        $banner->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Data Banner berhasil dihapus'
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
        $file = Storage::disk('s3')->put('upload/master/banner', $request[$path], 'public');
        return $file;
    }
}
