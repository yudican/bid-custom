<?php

namespace App\Http\Controllers\Spa\Setting;

use App\Http\Controllers\Controller;
use App\Models\NotificationTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class NotificationTemplateController extends Controller
{
    public function index($template_id = null)
    {
        return view('spa.spa-index');
    }

    public function listNotificationTemplate(Request $request)
    {
        $search = $request->search;
        $role_id = $request->role_id;
        $type = $request->type;

        $banner =  NotificationTemplate::query();
        if ($search) {
            $banner->where(function ($query) use ($search) {
                $query->where('notification_code', 'like', "%$search%");
                $query->orWhere('notification_title', 'like', "%$search%");
                $query->orWhere('notification_subtitle', 'like', "%$search%");
                $query->orWhere('notification_note', 'like', "%$search%");
            });
        }

        if ($type) {
            $banner->where('notification_type', $type);
        }

        if ($role_id) {
            $banner->whereHas('roles', function ($query) use ($role_id) {
                $query->whereIn('role_id', $role_id);
            });
        }


        $banners = $banner->orderBy('created_at', 'desc')->paginate($request->perpage);
        return response()->json([
            'status' => 'success',
            'data' => $banners,
            'message' => 'List Notification Template'
        ]);
    }


    public function getDetailNotificationTemplate($template_id)
    {
        $brand = NotificationTemplate::with('roles')->find($template_id);

        return response()->json([
            'status' => 'success',
            'data' => $brand,
            'message' => 'Detail Notification Template'
        ]);
    }

    public function saveNotificationTemplate(Request $request)
    {
        try {
            DB::beginTransaction();
            $role_id = json_decode($request->role_ids, true);
            $data = [
                'notification_code'  => $request->notification_code,
                'notification_title'  => $request->notification_title,
                'notification_subtitle'  => $request->notification_subtitle,
                'notification_body'  => $request->notification_body,
                'notification_type'  => $request->notification_type,
                'notification_note'  => $request->notification_note,
            ];

            $banner = NotificationTemplate::create($data);
            $banner->roles()->attach($role_id);

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Notification Template Berhasil Disimpan'
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Notification Template Gagal Disimpan'
            ], 400);
        }
    }

    public function updateNotificationTemplate(Request $request, $template_id)
    {
        try {
            DB::beginTransaction();
            $role_id = json_decode($request->role_ids, true);
            $data = [
                'notification_code'  => $request->notification_code,
                'notification_title'  => $request->notification_title,
                'notification_subtitle'  => $request->notification_subtitle,
                'notification_body'  => $request->notification_body,
                'notification_type'  => $request->notification_type,
                'notification_note'  => $request->notification_note,
            ];
            $row = NotificationTemplate::find($template_id);

            $row->update($data);
            $row->roles()->sync($role_id);

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Notification Template Berhasil Disimpan'
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Notification Template Gagal Disimpan'
            ], 400);
        }
    }

    public function deleteNotificationTemplate($template_id)
    {
        $banner = NotificationTemplate::find($template_id);
        $banner->roles()->detach();
        $banner->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Data Notification Template berhasil dihapus'
        ]);
    }
}
