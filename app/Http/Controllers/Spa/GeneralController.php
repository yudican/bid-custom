<?php

namespace App\Http\Controllers\Spa;

use App\Http\Controllers\Controller;
use App\Models\AddressUser;
use App\Models\Company;
use App\Models\LeadMaster;
use App\Models\OrderLead;
use App\Models\OrderManual;
use App\Models\ProductNeed;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GeneralController extends Controller
{
    public function loadUser()
    {
        $user = Auth::user();

        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'telepon' => $user->telepon,
                'service_ginee_url' => $user->service_ginee_url,
                'menu_data' => $user->menu_data,
                'role' => $user->role,
                'account_id' => $user?->account_id ?? 1,
            ]
        ]);
    }

    public function storeSetting(Request $request)
    {
        setSetting($request->key, $request->value);

        return response()->json([
            'status' => 'success',
        ]);
    }

    public function loadSetting(Request $request)
    {
        $value = getSetting($request->key);

        return response()->json([
            'status' => 'success',
            'data' => $value
        ]);
    }

    public function deleteSetting(Request $request)
    {
        removeSetting($request->key);

        return response()->json([
            'status' => 'success',
        ]);
    }

    public function getContact(Request $request)
    {
        $user = auth()->user();
        $role = $user->role->role_type;

        $user_list = User::query();

        if (!in_array($role, ['superadmin', 'adminsales', 'leadsales', 'admin', 'finance'])) {
            $user_list->where('created_by', $user->id);
        }

        if ($request->search) {
            $user_list->where('name', 'like', '%' . $request->search . '%');
        }

        $user_list->whereHas('roles', function ($query) use ($request) {
            $query->whereIn('role_type', $request->role_type ?? ['member']);
        });

        $userData = $user_list->limit($request->limit ?? 5)->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'nama' => $item->name . ' - ' . $item->role?->role_name,
                'isLoyal' => $item->isLoyal
            ];
        });


        return response()->json([
            'status' => 'success',
            'data' => $userData,
        ]);
    }

    public function getContactWarehouse(Request $request)
    {
        $user_list = User::query();

        if ($request->search) {
            $user_list->where('name', 'like', '%' . $request->search . '%');
        }

        $user_list->whereHas('roles', function ($query) {
            $query->whereIn('role_type', ['warehouse', 'mitra', 'purchasing']);
        });

        $userData = $user_list->limit($request->limit ?? 5)->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'nama' => $item->name . ' - ' . $item->role?->role_name
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $userData,
        ]);
    }

    public function getSales(Request $request)
    {
        $user = auth()->user();
        $user_list = User::query();
        if ($request->search) {
            $user_list->where('name', 'like', '%' . $request->search . '%');
        }
        $user_list->whereHas('roles', function ($query) {
            $query->whereIn('role_type', ['sales', 'leadsales', 'adminsales']);
        });

        $userData = $user_list->whereNotIn('id', [$user->id])->limit($request->limit ?? 5)->get()->map(function ($item) use ($user) {

            return [
                'id' => $item->id,
                'nama' => $item->name
            ];
        });

        $newUser = [];

        foreach ($userData as $key => $value) {
            $newUser[0]['id'] = $user->id;
            $newUser[0]['nama'] = $user->name;
            $newUser[$key + 1] = $value;
        }

        return response()->json([
            'status' => 'success',
            'data' => $newUser
        ]);
    }

    public function getWarehouseUser(Request $request)
    {
        $warehouse = User::query();

        if ($request->search) {
            $warehouse->where('name', 'like', '%' . $request->search . '%');
        }

        $warehouses = $warehouse->whereHas('roles', function ($query) {
            $query->whereIn('role_type', ['warehouse']);
        })->get();

        return response()->json([
            'status' => 'success',
            'data' => $warehouses
        ]);
    }

    public function getCompany(Request $request)
    {
        $company = Company::query();

        if ($request->search) {
            $company->where('name', 'like', '%' . $request->search . '%');
        }

        $companies = $company->limit($request->limit ?? 5)->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'nama' => $item->name
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $companies
        ]);
    }

    public function getAddressUser($user_id)
    {
        $address = AddressUser::where('user_id', $user_id)->get();

        return response()->json([
            'status' => 'success',
            'data' => $address
        ]);
    }

    public function updateProductNeed(Request $request)
    {
        ProductNeed::find($request->item_id)->update([
            $request->field => $request->value,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => $request->field . ' Produk berhasil diubah!',
        ]);
    }

    public function updateOrderNotes(Request $request)
    {
        $order = OrderLead::where('uid_lead', $request->uid_lead)->first();

        if ($request->type == 'manual') {
            $order = OrderManual::where('uid_lead', $request->uid_lead)->first();
        }

        if ($order) {
            $order->update([
                'notes' => $request->notes,
            ]);
            return response()->json([
                'status' => 'success',
                'message' => $request->type . ' Notea berhasil diupdate',
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Order tidak ditemukan',
        ], 400);
    }

    public function getApprovalUser(Request $request)
    {
        $warehouse = User::query();

        if ($request->search) {
            $warehouse->where('name', 'like', '%' . $request->search . '%');
        }

        $warehouses = $warehouse->whereHas('roles', function ($query) {
            $query->whereIn('role_type', ['warehouse', 'finance', 'collector', 'lead_finance', 'admin', 'superadmin', 'purchasing']);
        })->get();

        return response()->json([
            'status' => 'success',
            'data' => $warehouses->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama' => $item->name,
                    'role' => $item->role->role_name,
                    'role_id' => $item->role->id,
                ];
            })
        ]);
    }

    public function getAddressWithUser($user_id)
    {
        $user = User::find($user_id);

        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->telepon,
                'address' => $user->addressUsers
            ]
        ]);
    }
}
