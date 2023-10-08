<?php

namespace App\Http\Controllers\Spa;

use App\Http\Controllers\Controller;
use App\Exports\ContactSkuExport;
use App\Models\AddressUser;
use App\Models\Cases;
use App\Models\Company;
use App\Models\Contact;
use App\Models\ContactDownline;
use App\Models\OrderLead;
use App\Models\OrderManual;
use App\Models\Role;
use App\Models\Transaction;
use App\Models\TransactionAgent;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class ContactController extends Controller
{
    public function index($user_id = null)
    {
        return view('spa.spa-index');
    }

    public function listContact(Request $request)
    {
        $search = $request->search;
        $roles = $request->roles;
        $status = $request->status;
        $createdBy = $request->createdBy;
        $user = auth()->user();
        $role = $user->role->role_type;
        $contact =  User::whereHas('roles', function ($query) {
            $query->where('role_type', '!=', 'hrd');
        });
        if ($search) {
            $contact->where('name', 'like', "%$search%");
            $contact->orWhere('email', 'like', "%$search%");
            $contact->orWhereHas('roles', function ($query) use ($search) {
                $query->where('role_name', 'like', "%$search%");
            });
        }
        if ($roles) {
            $contact->whereHas('roles', function ($query) use ($roles) {
                $query->whereIn('role_id', $roles);
            });
        }

        if ($status) {
            $contact->whereIn('status', $status);
        }

        if ($createdBy) {
            $contact->where('created_by', $createdBy);
        }

        if (in_array($role, ['superadmin', 'adminsales', 'leadsales', 'admin'])) {
            $contact->where('created_by', $user->id);
        }

        if (in_array($role, ['leadcs'])) {
            $contact->orWhereHas('roles', function ($query) {
                $query->whereIn('role_type', ['mitra', 'member', 'subagent']);
            });
        }

        $contacts = $contact->orderBy('users.created_at', 'desc')->paginate($request->perpage);
        return response()->json([
            'status' => 'success',
            'data' => tap($contacts, function ($contacts) {
                return $contacts->getCollection()->transform(function ($item) {
                    return [
                        'id' => $item['id'],
                        'name' => $item['name'],
                        'email' => $item['email'],
                        'telepon' => $item['telepon'],
                        'created_by_name' => $item['created_by_name'],
                        'role' => $item['role'],
                        'created_at' => $item['created_at'],
                        'amount_detail' => $item['amount_detail'],
                    ];
                });
            }),
            'message' => 'List Contact'
        ]);
    }

    public function detailContact($user_id)
    {
        $contact =  User::with(['addressUsers', 'company', 'brand', 'brands', 'userCreated', 'company.businessEntity', 'contactDownlines'])->where('id', $user_id)->first();

        // total debt
        $total_order_lead = 0;
        $total_order_manual = 0;
        $total_invoice = 0;
        $total_amount = 0;
        $list_order = [];
        $debt_order_leads = OrderLead::whereContact($user_id)->where('status', 2)->get();
        foreach ($debt_order_leads as $key => $value) {
            $list_order[] = $value;
            $total_invoice += 1;
            $total_amount += $value->amount_billing_approved;
            $total_order_lead += $value->amount;
        }

        $debt_order_manuals = OrderManual::whereContact($user_id)->where('status', 2)->get();
        foreach ($debt_order_manuals as $key => $value) {
            $list_order[] = $value;
            $total_invoice += 1;
            $total_amount += $value->amount_billing_approved;
            $total_order_manual += $value->amount;
        }
        $total_debt = $total_order_lead + $total_order_manual;

        return response()->json([
            'status' => 'success',
            'data' => $contact,
            'order_lead' => [
                'list' => $list_order,
                'total_debt' => $total_debt,
                'total_invoice_active' => $total_invoice,
                'total_invoice_amount' => $total_amount,
            ]
        ]);
    }

    public function contactTransaction($user_id)
    {
        $user = User::find($user_id);
        $role = $user->role->role_type;
        if (in_array($role, ['mitra', 'subagent'])) {
            $transaction =  TransactionAgent::with(['user', 'paymentMethod'])->where('user_id', $user->id)->whereIn('status', [1, 2, 3, 7])->whereIn('status_delivery', [1, 2, 3, 21])->orderBy('created_at', 'desc')->get();
            return response()->json([
                'status' => 'success',
                'data' => $transaction
            ]);
        }

        $transaction =  Transaction::with(['user', 'paymentMethod'])->where('user_id', $user->id)->whereIn('status', [1, 2, 3, 7])->whereIn('status_delivery', [1, 2, 3, 21])->orderBy('created_at', 'desc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $transaction
        ]);
    }

    public function contactTransactionHistory($user_id)
    {
        $user = User::find($user_id);
        $role = $user->role->role_type;
        if (in_array($role, ['mitra', 'subagent'])) {
            $transaction =  TransactionAgent::with(['user', 'paymentMethod'])->where('user_id', $user->id)->whereIn('status_delivery', [4, 5, 6, 7])->whereIn('status', [4, 5, 6, 7])->orderBy('created_at', 'desc')->get();
            return response()->json([
                'status' => 'success',
                'data' => $transaction
            ]);
        }

        $transaction =  Transaction::with(['user', 'paymentMethod'])->where('user_id', $user->id)->whereIn('status_delivery', [4, 5, 6, 7])->whereIn('status', [4, 5, 6, 7])->orderBy('created_at', 'desc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $transaction
        ]);
    }

    public function contactHistoryCase($user_id)
    {
        $cases = Cases::with(['contactUser', 'createdUser', 'typeCase', 'priorityCase', 'sourceCase', 'categoryCase', 'statusCase'])->where('contact', $user_id)->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $cases
        ]);
    }

    public function updateProfileContact(Request $request)
    {
        $user = User::find($request->user_id);
        $user->name = $request->name;
        $user->email = $request->email;
        $user->telepon = formatPhone($request->telepon);
        $user->gender = $request->gender;
        $user->bod = $request->bod;

        if ($request->password) {
            $user->password = Hash::make($request->password);
        }

        if ($request->profile_image) {
            if (!$request->hasFile('profile_image')) {
                return response()->json([
                    'error' => true,
                    'message' => 'File not found',
                    'status_code' => 400,
                ], 400);
            }
            $file = $request->file('profile_image');
            if (!$file->isValid()) {
                return response()->json([
                    'error' => true,
                    'message' => 'Image file not valid',
                    'status_code' => 400,
                ], 400);
            }

            $file = Storage::disk('s3')->put('upload/user', $request->profile_image, 'public');
            if ($user->profile_photo_path) {
                if (Storage::disk('s3')->exists($user->profile_photo_path)) {
                    Storage::disk('s3')->delete($user->profile_photo_path);
                }
            }

            $user->profile_photo_path = $file;
        }

        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Update Profile Success'
        ]);
    }

    public function disabledTelegramNotification(Request $request)
    {
        $user = User::find($request->user_id);
        $user->telegram_chat_id = null;

        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Notifikasi Berhasil Dimatikan'
        ]);
    }

    public function storeContact(Request $request)
    {
        // $checkmail = User::where('email', $request->email);
        // if ($request->user_id) {
        //     $checkmail->where('id', '!=', $request->user_id);
        // }
        // if ($checkmail->first()) {
        //     return response()->json([
        //         'status' => 'error',
        //         'message' => 'Email sudah terdaftar'
        //     ], 400);
        // }

        // check company email
        // if ($request->company_email) {
        //     $checkCompanyEmail = Company::where('email', $request->company_email);
        //     if ($request->user_id) {
        //         $checkCompanyEmail->where('user_id', '!=', $request->user_id);
        //     }
        //     if ($checkCompanyEmail->first()) {
        //         return response()->json([
        //             'status' => 'error',
        //             'message' => 'Company Email sudah terdaftar',
        //             'type' => 'company_email'
        //         ], 400);
        //     }
        // }

        // check company name
        // if ($request->company_name) {
        //     $checkCompanyName = Company::where('name', 'like', '%' . $request->company_name . '%');
        //     if ($request->user_id) {
        //         $checkCompanyName->where('user_id', '!=', $request->user_id);
        //     }

        //     if ($checkCompanyName->first()) {
        //         return response()->json([
        //             'status' => 'error',
        //             'message' => 'Company name sudah terdaftar',
        //             'type' => 'company_name'
        //         ], 400);
        //     }
        // }


        if (is_array($request->brand_id)) {
            if (count($request->brand_id) == 0) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Brand tidak boleh kosong'
                ], 400);
            }
        }

        try {
            DB::beginTransaction();
            $role = Role::find($request->role_id);
            $sales_channel = json_decode($request->sales_channel, true);
            $user = User::updateOrCreate(['id'  => $request->user_id], [
                'name'  => $request->name,
                'uid' => $request->uid,
                'email'  => $request->email,
                'password'  => Hash::make('admin123'),
                'telepon'  => formatPhone($request->telepon),
                'gender'  => $request->gender,
                'bod'  => $request->bod,
                'brand_id'  => $request->brand_id[0],
                'created_by' => auth()->user()->id,
                'sales_channel'  => implode(',', $sales_channel),
            ]);
            $user->brands()->sync($request->brand_id);
            $user->teams()->sync(1, ['role' => $role->role_type]);
            $user->roles()->sync($request->role_id);

            $data = [
                'name'  => $request->company_name ?? null,
                'address'  => $request->company_address ?? null,
                'npwp'  => $request->npwp ?? null,
                'npwp_name'  => $request->npwp_name ?? null,
                'email'  => $request->company_email ?? null,
                'phone'  => $request->company_telepon ? formatPhone($request->company_telepon) : null,
                'brand_id'  => $request->brand_id[0],
                'owner_name'  => $request->owner_name ?? null,
                'owner_phone'  => $request->owner_phone ? formatPhone($request->owner_phone) : null,
                'pic_name'  => $request->pic_name ?? null,
                'pic_phone'  => $request->pic_phone ? formatPhone($request->pic_phone) : null,
                'status'  => 1,
                'user_id' => $user->id,
                'business_entity' => $request->business_entity ?? null,
                'layer_type' => $request->layer_type ?? null,
                'nib' => $request->nib ?? null,
            ];

            if ($request->file_nib) {
                $file = $this->uploadImage($request, 'file_nib');
                $data['file_nib'] = $file;
            }

            Company::updateOrCreate(['user_id' => $user->id], $data);
            DB::commit();
            return response()->json([
                'status' => 'error',
                'message' => 'Contact berhasil disimpan'
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'error' => $th->getMessage(),
                'status' => 'error',
                'message' => 'Contact gagal disimpan',
            ], 400);
        }
    }

    public function getUserCreatedBy(Request $request)
    {
        $user = auth()->user();
        $role = $user->role->role_type;
        $users = User::where('name', 'like', '%' . $request->search . '%');
        if (!in_array($role, ['superadmin', 'adminsales', 'leadsales'])) {
            $users->where('created_by', $user->id);
        }

        $userData = $users->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'nama' => $item->name
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $userData
        ]);
    }

    public function blackListUser($user_id)
    {
        $user = User::find($user_id);
        $user->status = $user->status == 1 ? 0 : 1;
        $user->save();
        $status = $user->status == 1 ? 'aktifkan' : 'nonaktifkan';
        return response()->json([
            'status' => 'success',
            'message' => "User berhasil di $status"
        ]);
    }

    public function saveAddress(Request $request)
    {
        $dataAddress = [
            'type'  => $request->type,
            'nama'  => $request->nama,
            'alamat'  => $request->alamat,
            'provinsi_id'  => $request->provinsi_id,
            'kabupaten_id'  => $request->kabupaten_id,
            'kecamatan_id'  => $request->kecamatan_id,
            'kelurahan_id'  => $request->kelurahan_id,
            'kodepos'  => $request->kodepos,
            'telepon'  => formatPhone($request->telepon),
            'user_id'  => $request->user_id,
            'is_default' => 0
        ];

        AddressUser::updateOrCreate(['id' => $request->address_id], $dataAddress);

        return response()->json([
            'status' => 'success',
            'message' => 'Alamat berhasil disimpan'
        ]);
    }

    public function setDefaultAddress(Request $request)
    {
        $addresses = AddressUser::where('user_id', $request->user_id)->get();
        foreach ($addresses as $key => $address) {
            if ($address->id == $request->address_id) {
                $address->update(['is_default' => 1]);
            } else {
                $address->update(['is_default' => 0]);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Alamat berhasil disimpan'
        ]);
    }

    public function getMemberDownline(Request $request, $user_id)
    {
        $search = $request->search;
        $downline_id = ContactDownline::where('user_id', $user_id)->pluck('company_id')->toArray();
        $user = User::query();
        if ($search) {
            $user->where('name', 'like', "%$search%");
        }
        $user->whereHas('company', function ($query) use ($downline_id) {
            $query->whereNotIn('id', $downline_id)->where('layer_type', 'sub-distributor');
        });

        $data = $user->limit($request->limit ?? 5)->get()->map(function ($item) {
            return [
                'id' => $item->company->id,
                'nama' => $item->name
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    public function saveMember(Request $request, $user_id)
    {
        ContactDownline::updateOrCreate([
            'user_id' => $user_id,
            'company_id' => $request->company_id
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Contact berhasil disimpan'
        ]);
    }

    public function deleteMember($downline_id)
    {
        $member = ContactDownline::find($downline_id);
        $member->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Contact berhasil dihapus'
        ]);
    }

    public function deleteContact($address_id)
    {
        $contact = AddressUser::find($address_id);
        $contact->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Contact berhasil dihapus'
        ]);
    }

    public function export()
    {
        $file_name = 'FIS-Data_Contact-' . date('d-m-Y') . '.xlsx';

        Excel::store(new ContactSkuExport(null), $file_name, 's3', null, [
            'visibility' => 'public',
        ]);
        return response()->json([
            'status' => 'success',
            'data' => Storage::disk('s3')->url($file_name),
            'message' => 'List Convert'
        ]);
    }
}
