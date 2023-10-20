<?php

namespace App\Http\Controllers\Spa;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\BusinessEntity;
use App\Models\Cases;
use App\Models\Category;
use App\Models\CategoryCase;
use App\Models\CompanyAccount;
use App\Models\Kecamatan;
use App\Models\Logistic;
use App\Models\MasterDiscount;
use App\Models\MasterTax;
use App\Models\Package;
use App\Models\PaymentTerm;
use App\Models\PriorityCase;
use App\Models\Product;
use App\Models\ProductAdditional;
use App\Models\ProductStock;
use App\Models\ProductVariant;
use App\Models\ProductTiktok;
use App\Models\PurchaseOrder;
use App\Models\RefundMaster;
use App\Models\ReturMaster;
use App\Models\Role;
use App\Models\SkuMaster;
use App\Models\SourceCase;
use App\Models\StatusCase;
use App\Models\TypeCase;
use App\Models\User;
use App\Models\Variant;
use App\Models\Warehouse;
use App\Models\WarehouseTiktok;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MasterController extends Controller
{
    public function getBrand()
    {
        $brand = Brand::where('status', 1)->get();
        return response()->json([
            'status' => 'success',
            'data' => $brand
        ]);
    }

    public function getBussinnesEntity()
    {
        $bussinesEntity = BusinessEntity::all();
        return response()->json([
            'status' => 'success',
            'data' => $bussinesEntity
        ]);
    }

    public function getRole($role_user = 'superadmin')
    {
        if (in_array($role_user, ['superadmin', 'admin', 'adminsales'])) {
            $role = Role::whereIn('role_type', ['superadmin', 'admin', 'purchasing', 'mitra', 'finance', 'warehouse', 'cs', 'leadcs', 'leadsales', 'member'])->get();
            return response()->json([
                'status' => 'success',
                'data' => $role
            ]);
        }

        $role = Role::whereIn('role_type', ['admin', 'purchasing', 'mitra', 'finance', 'warehouse', 'cs', 'leadcs', 'leadsales', 'member'])->get();
        return response()->json([
            'status' => 'success',
            'data' => $role
        ]);
    }

    public function getSku()
    {
        $sku  = SkuMaster::all();
        return response()->json([
            'status' => 'success',
            'data' => $sku
        ]);
    }

    public function getSkuTiktok()
    {
        $sku  = ProductTiktok::all();
        return response()->json([
            'status' => 'success',
            'data' => $sku
        ]);
    }

    public function getProvinsi()
    {
        $provinsi = DB::table('addr_provinsi')->get();
        $respon = [
            'error' => false,
            'status_code' => 200,
            'message' => 'Provinsi Lists',
            'data' => $provinsi
        ];
        return response()->json($respon, 200);
    }

    public function getKota($id)
    {
        $kota = DB::table('addr_kabupaten')->where('prov_id', $id)->get();
        $respon = [
            'error' => false,
            'status_code' => 200,
            'message' => 'Kota Lists',
            'data' => $kota
        ];
        return response()->json($respon, 200);
    }


    public function getKecamatan($id)
    {
        $kecamatan = DB::table('addr_kecamatan')->where('kab_id', $id)->get();
        $respon = [
            'error' => false,
            'status_code' => 200,
            'message' => 'Kecamatan Lists',
            'data' => $kecamatan
        ];
        return response()->json($respon, 200);
    }


    public function getKelurahan($id)
    {
        $kelurahan = DB::table('addr_kelurahan')->where('kec_id', $id)->get();
        $respon = [
            'error' => false,
            'status_code' => 200,
            'message' => 'Kelurahan Lists',
            'data' => $kelurahan
        ];
        return response()->json($respon, 200);
    }

    public function getWarehouse()
    {
        $user = auth()->user();
        if ($user->role->role_type != 'mitra') {
            $warehouses = Warehouse::where('status', 1)->get();
        } else {
            // $warehouses = Warehouse::where('status', 1)->get();
            $warehouses = Warehouse::leftjoin('warehouse_users', 'warehouse_users.warehouse_id', 'warehouses.id')->where('warehouse_users.user_id', $user->id)->where('warehouses.status', 1)->select('warehouses.*')->get();
        }

        return response()->json([
            'status' => 'success',
            'data' => $warehouses
        ]);
    }

    public function getWarehouseTiktok()
    {
        // $user = auth()->user();
        $warehouses = WarehouseTiktok::all();
        // if ($user->role->role_type != 'mitra') {
        //     $warehouses = Warehouse::where('status', 1)->get();
        // } else {
        //     $warehouses = Warehouse::leftjoin('warehouse_users', 'warehouse_users.warehouse_id', 'warehouses.id')->where('warehouse_users.user_id', $user->id)->where('warehouses.status', 1)->select('warehouses.*')->get();
        // }

        return response()->json([
            'status' => 'success',
            'data' => $warehouses
        ]);
    }

    public function getTop()
    {
        $top = PaymentTerm::all();

        return response()->json([
            'status' => 'success',
            'data' => $top
        ]);
    }

    public function getProductList($sales_channel = null)
    {
        $product = ProductVariant::whereStatus(1)->whereNull('deleted_at');
        if ($sales_channel) {
            $product->where('sales_channel', 'like', "%$sales_channel%");
        }

        $products = $product->get();

        return response()->json([
            'status' => 'success',
            'data' => $products
        ]);
    }
    public function getProductListMaster()
    {
        $product = Product::whereStatus(1)->whereNull('deleted_at')->get();

        return response()->json([
            'status' => 'success',
            'data' => $product
        ]);
    }

    public function getProductAdditionalList($type)
    {
        $product = ProductAdditional::whereStatus(1)->whereType($type)->get();

        return response()->json([
            'status' => 'success',
            'data' => $product
        ]);
    }

    public function getMasterTax()
    {
        $tax = MasterTax::all();

        return response()->json([
            'status' => 'success',
            'data' => $tax
        ]);
    }

    public function getMasterDiscount($sales_channel = null)
    {
        $tax = MasterDiscount::all();
        if ($sales_channel) {
            $tax = MasterDiscount::where('sales_channel', 'like', "%$sales_channel%")->get();
        }

        return response()->json([
            'status' => 'success',
            'data' => $tax
        ]);
    }

    public function getPackage()
    {
        $package = Package::all();

        return response()->json([
            'status' => 'success',
            'data' => $package
        ]);
    }

    public function getVariant()
    {
        $package = Variant::all();

        return response()->json([
            'status' => 'success',
            'data' => $package
        ]);
    }


    public function getTypeCase()
    {
        $typeCase = TypeCase::all();

        return response()->json([
            'status' => 'success',
            'data' => $typeCase
        ]);
    }

    public function getCategory()
    {
        $category = Category::all();

        return response()->json([
            'status' => 'success',
            'data' => $category
        ]);
    }

    public function getOfflineExpedition()
    {
        $logistic = Logistic::where('logistic_type', 'offline')->get();
        return response()->json([
            'status' => 'success',
            'data' => $logistic
        ]);
    }

    // get company account
    public function getCompanyAccount()
    {
        $companyAccount = CompanyAccount::all();
        return response()->json([
            'status' => 'success',
            'data' => $companyAccount
        ]);
    }

    //  get product stock
    public function getProductStockMaster(Request $request)
    {
        $productStock = ProductStock::where('product_id', $request->product_id)->where('warehouse_id', $request->warehouse_id)->groupBy('product_id')->select('*')->selectRaw("SUM(stock) as stock_total")->orderBy('is_allocated', 'asc')->get();
        $stock = [];

        foreach ($productStock as $key => $item) {
            $stock[] = [
                'key' => $key,
                'id' => $item->id,
                'product_id' => $item->product_id,
                'qty' => intval($item->stock_total),
                'from_warehouse_id' => $request->warehouse_id,
                'to_warehouse_id' => null,
                'sku' => $item->product?->sku,
                'u_of_m' => $item->product?->u_of_m,
                'is_allocated' => false,
                'qty_alocation' => 0,
            ];
        }

        return response()->json([
            'status' => 'success',
            'data' => $stock
        ]);
    }

    // get vendor
    public function getVendors()
    {
        $vendor = PurchaseOrder::select('vendor_code', 'vendor_name')->groupBy('vendor_code')->get();
        return response()->json([
            'status' => 'success',
            'data' => $vendor->map(function ($item) {
                return [
                    'code' => $item->vendor_code,
                    'name' => $item->vendor_name
                ];
            })
        ]);
    }

    // get case list
    public function getCaseList()
    {
        $cases = [];

        // manual case
        $manual_cases = Cases::all();
        foreach ($manual_cases as $manual_case) {
            $cases[] = [
                'id' => $manual_case->id,
                'name' => $manual_case->title,
                'type' => 'manual'
            ];
        }

        // refund case
        $refund_cases = RefundMaster::all();
        foreach ($refund_cases as $refund_case) {
            $cases[] = [
                'id' => $refund_case->id,
                'name' => $refund_case->title,
                'type' => 'refund'
            ];
        }

        // return case
        $return_cases = ReturMaster::all();
        foreach ($return_cases as $return_case) {
            $cases[] = [
                'id' => $return_case->id,
                'name' => $return_case->title,
                'type' => 'return'
            ];
        }

        return response()->json([
            'status' => 'success',
            'data' => $cases
        ]);
    }

    public function getProductByCase(Request $request)
    {
        $case = null;
        $type_case = $request->case_type;
        $case_title = $request->case_title;
        if ($type_case == 'manual') {
            $case = Cases::where('title', $case_title)->first();
        } else if ($type_case == 'refund') {
            $case = RefundMaster::where('title', $case_title)->first();
        } else if ($type_case == 'return') {
            $case = ReturMaster::where('title', $case_title)->first();
        }

        return response()->json([
            'status' => 'success',
            'data' => $case->items
        ]);
    }

    public function getSourceCase()
    {
        $type = SourceCase::all();
        return response()->json([
            'status' => 'success',
            'data' => $type
        ]);
    }

    public function getPriorityCase()
    {
        $type = PriorityCase::all();
        return response()->json([
            'status' => 'success',
            'data' => $type
        ]);
    }

    public function getStatusCase()
    {
        $type = StatusCase::all();
        return response()->json([
            'status' => 'success',
            'data' => $type
        ]);
    }

    public function getCategoryCase()
    {
        $type = CategoryCase::all();
        return response()->json([
            'status' => 'success',
            'data' => $type
        ]);
    }

    public function getLogistic()
    {
        $type = Logistic::all();
        return response()->json([
            'status' => 'success',
            'data' => $type
        ]);
    }

    // seacrh province
    public function searchAddress(Request $request)
    {
        $kecamatan = Kecamatan::where('nama', 'like', "%$request->search%")->get();

        $results = [];
        foreach ($kecamatan as $item) {
            $results[] = [
                'value' => $item->id,
                'label' => $item->result,
            ];
        }

        return response()->json([
            'status' => 'success',
            'data' => $results
        ]);
    }

    // load user by phone
    public function loadUserByPhone(Request $request)
    {
        $user = User::where('telepon', formatPhone($request->phone))->first();
        // $address = [];

        // foreach ($user->addressUsers as $address) {
        //     $address[] = [
        //         // 'label' => $address->kec_id,
        //         'value' => $address->kecamatan,
        //     ];
        // }
        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'telepon' => $user->telepon,
                'email' => $user->email,
                'address' => $user->addressUsers
            ]
        ]);
    }
}
