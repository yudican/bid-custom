<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function getContactList()
    {

        $user = auth()->user();
        $contact = User::whereHas('roles', function ($query) {
            return $query->where('role_type', ['member', 'agent', 'subagent']);
        })->where('created_by', auth()->user()->id)->get();

        if (in_array($user->role->role_type, ['superadmin', 'admin', 'adminsales'])) {
            $contact = User::whereHas('roles', function ($query) {
                return $query->where('role_type', ['member', 'agent', 'subagent']);
            })->get();
        }

        $users = [];

        foreach ($contact as $key => $val) {
            $users[] = [
                'id' => $val->id,
                'name' => $val->name,
                'email' => $val->email,
                'telepon' => $val->telepon,
                'bod' => $val->bod,
                'gender' => $val->gender,
                'device_id' => $val->device_id,
                'profile_photo_url' => $val->profile_photo_url,
            ];
        }

        return response()->json([
            'status' => 'success',
            'message' => 'List User',
            'data' => $users
        ]);
    }


    function createContact(Request $request)
    {
        $validate = [
            'name' => 'required',
            'email' => 'required',
            'telepon' => 'required',
            'bod' => 'required',
            'gender' => 'required',
        ];

        $validator = Validator::make($request->all(), $validate);

        // response validation error
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Form Tidak Lengkap',
                'error' => $validator->errors()
            ], 400);
        }

        try {
            DB::beginTransaction();

            $data = [
                'name' => $request->name,
                'email' => $request->email,
                'telepon' => $request->telepon,
                'bod' => $request->bod,
                'gender' => $request->gender,
                'password' => Hash::make('admin123'),
                'created_by' => auth()->user()->id,
            ];

            if ($request->photo) {
                $photo = $this->uploadImage($request, 'photo');
                $data['profile_photo_path'] = $photo;
            }

            $user = User::create($data);
            $role = Role::where('role_type', 'member')->first();
            $user->roles()->attach($role->id);
            $user->teams()->attach(1, ['role' => $role->role_type]);

            DB::commit();
            return response()->json([
                'message' => 'Successfully add contact',
                'data' => new UserResource($user)
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error add contact',
                'data' => [],
                'error' =>  $th->getMessage()
            ], 400);
        }
    }


    function updateContact(Request $request, $contact_id)
    {
        $validate = [
            'name' => 'required',
            'email' => 'required',
            'telepon' => 'required',
            'bod' => 'required',
            'gender' => 'required',
        ];



        $validator = Validator::make($request->all(), $validate);

        // response validation error
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Form Tidak Lengkap'
            ], 400);
        }

        $user = User::find($contact_id);

        if (!$user) {
            return response()->json([
                'message' => 'User Not Found',
                'data' => []
            ], 404);
        }
        try {
            DB::beginTransaction();

            $data = [
                'name' => $request->name,
                'email' => $request->email,
                'telepon' => formatPhone($request->telepon),
                'bod' => $request->bod,
                'gender' => $request->gender,
            ];

            if ($request->photo) {
                $photo = $this->uploadImage($request, 'photo');
                $data['profile_photo_path'] = $photo;
            }

            $user->update($data);

            DB::commit();
            return response()->json([
                'message' => 'Successfully update contact',
                'data' => $user
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error update contact',
                'data' => []
            ], 400);
        }
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
        $file = Storage::disk('s3')->put('upload/contact', $request[$path], 'public');
        return $file;
    }
}
