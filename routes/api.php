<?php

use App\Http\Controllers\Api\AjaxController;
use App\Http\Controllers\Api\Transaction\ConfirmPaymentController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\V1\ActivityController;
use App\Http\Controllers\Api\V1\ContactController as V1ContactController;
use App\Http\Controllers\Api\V1\Prospect\ProspectController;
use App\Http\Controllers\Notification\PaymentNotification;
use App\Http\Controllers\SendEmailController;
use App\Http\Controllers\Spa\AgentDomainManagementController;
use App\Http\Controllers\Spa\AgentManagementController;
use App\Http\Controllers\Spa\Auth\LoginController;
use App\Http\Controllers\Spa\Case\ManualController;
use App\Http\Controllers\Spa\Case\RefundController;
use App\Http\Controllers\Spa\Case\ReturnController;
use App\Http\Controllers\Spa\CheckoutAgent;
use App\Http\Controllers\Spa\ContactController;
use App\Http\Controllers\Spa\DashboardController;
use App\Http\Controllers\Spa\GeneralController;
use App\Http\Controllers\Spa\GenieController;
use App\Http\Controllers\Spa\GPCustomerController;
use App\Http\Controllers\Spa\GPSubmissionController;
use App\Http\Controllers\Spa\InventoryController;
use App\Http\Controllers\Spa\LeadController;
use App\Http\Controllers\Spa\Master\BannerController;
use App\Http\Controllers\Spa\Master\BrandController;
use App\Http\Controllers\Spa\Master\CategoryCaseController;
use App\Http\Controllers\Spa\Master\CategoryController;
use App\Http\Controllers\Spa\Master\CompanyAccountController;
use App\Http\Controllers\Spa\Master\LevelController;
use App\Http\Controllers\Spa\Master\LogisticController;
use App\Http\Controllers\Spa\Master\MasterDiscountController;
use App\Http\Controllers\Spa\Master\MasterPointController;
use App\Http\Controllers\Spa\Master\PackageController;
use App\Http\Controllers\Spa\Master\PaymentMethodController;
use App\Http\Controllers\Spa\Master\VariantController;
use App\Http\Controllers\Spa\Master\VoucherController;
use App\Http\Controllers\Spa\Master\PaymentTermController;
use App\Http\Controllers\Spa\Master\MasterTaxController;
use App\Http\Controllers\Spa\Master\PriorityCaseController;
use App\Http\Controllers\Spa\Master\ProductAdditionalController;
use App\Http\Controllers\Spa\Master\SalesChannelController;
use App\Http\Controllers\Spa\Master\SkuController;
use App\Http\Controllers\Spa\Master\SourceCaseController;
use App\Http\Controllers\Spa\Master\StatusCaseController;
use App\Http\Controllers\Spa\Master\TypeCaseController;
use App\Http\Controllers\Spa\Master\WarehouseController;
use App\Http\Controllers\Spa\MasterController;
use App\Http\Controllers\Spa\MenuController;
use App\Http\Controllers\Spa\Order\GpController;
use App\Http\Controllers\Spa\Order\OrderFreeBiesController;
use App\Http\Controllers\Spa\Order\SalesReturnController;
use App\Http\Controllers\Spa\OrderLeadController;
use App\Http\Controllers\Spa\TicketController;
use App\Http\Controllers\Spa\MappingProductController;
use App\Http\Controllers\Spa\MappingSettlementController;
use App\Http\Controllers\Spa\MappingOrderController;
use App\Http\Controllers\Spa\MappingWarehouseController;
use App\Http\Controllers\Spa\ProfileController;
use App\Http\Controllers\Spa\OrderManualController;
use App\Http\Controllers\Spa\ProductManagement\ConvertController;
use App\Http\Controllers\Spa\ProductManagement\ImportController;
use App\Http\Controllers\Spa\ProductManagement\ProductCommentRatingController;
use App\Http\Controllers\Spa\ProductManagement\ProductMarginBottom;
use App\Http\Controllers\Spa\ProductManagement\ProductMasterController;
use App\Http\Controllers\Spa\ProductManagement\ProductVariantController;
use App\Http\Controllers\Spa\Purchase\PurchaseOrderController;
use App\Http\Controllers\Spa\Purchase\PurchaseRequisitionController;
use App\Http\Controllers\Spa\Setting\NotificationTemplateController;
use App\Http\Controllers\Spa\TransactionController;
use App\Http\Controllers\Spa\TransAgentController;
use App\Http\Controllers\Spa\AgentLocationController;
use App\Http\Controllers\Spa\Master\MasterOngkirController;
use App\Http\Controllers\Spa\StockMovementController;
use App\Http\Controllers\Spa\TiktokController;
use App\Http\Controllers\Webhook\GineeWebhookController;
use App\Http\Controllers\Webhook\TelegramBotController;
use App\Http\Controllers\Webhook\TiktokWebhookController;
use App\Models\OrderManual;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| SPA API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// agent location
Route::get('domain', [AgentLocationController::class, 'listAgentDomain']);
Route::get('district/{prov_id}', [AgentLocationController::class, 'listDistrictByProvince']);
Route::get('subdistrict/{district_id}', [AgentLocationController::class, 'listSubdistrictByDistrict']);
Route::get('user/province', [AgentLocationController::class, 'listProvinceByUser']);
Route::get('user/subdistrict/{subdistrict_id}', [AgentLocationController::class, 'listUserBySubdistrict']);

// tiktok
Route::post('tiktok-order', [TiktokController::class, 'getTektokOrder']);
Route::post('store-tiktok-order', [TiktokController::class, 'storeTiktokOrder']);
Route::get('follow-up/{id}', [TiktokController::class, 'followUp']);

Route::post('proccess/login', [LoginController::class, 'login']);
Route::post('auth/login', [LoginController::class, 'loginApi']);

Route::post('purchase-requisition/save', [PurchaseRequisitionController::class, 'createRequitition']);

Route::post('mapping/order/webhook', [TiktokWebhookController::class, 'webhook']);
Route::post('telegram/webhook', [TelegramBotController::class, 'handle']);


// prospect
Route::prefix('prospect')->middleware('auth:sanctum')->group(function () {
    Route::post('list', [ProspectController::class, 'index']);
    Route::get('list/{status?}', [ProspectController::class, 'index']);
    Route::get('detail/{id}', [ProspectController::class, 'show']);
    Route::get('tags', [ProspectController::class, 'prospectTags']);
    Route::get('status', [ProspectController::class, 'prospectStatus']);
    Route::post('create', [ProspectController::class, 'createProspect']);
    Route::get('activity/list', [ProspectController::class, 'getAllActivityProspect']);
    Route::post('activity/list/{id}', [ProspectController::class, 'getProspectActivity']);
    Route::post('activity/create', [ProspectController::class, 'createProspectActivity']);
    Route::post('activity/update/{id}', [ProspectController::class, 'updateProspectActivity']);
    Route::post('update/{id}', [ProspectController::class, 'updatedProspect']);
    Route::post('delete/{id}', [ProspectController::class, 'deleteProspect']);
    Route::get('contact/{user_id}', [ProspectController::class, 'prospectByContact']);
});

// activity
Route::prefix('activity')->middleware('auth:sanctum')->group(function () {
    Route::get('list', [ActivityController::class, 'index']);
    Route::get('detail/{id}', [ActivityController::class, 'show']);
    Route::post('create', [ActivityController::class, 'createActivity']);
    Route::post('update/{id}', [ActivityController::class, 'updatedActivity']);
});

// order online
Route::prefix('order-online')->middleware('auth:sanctum')->group(function () {
    Route::get('list', [ActivityController::class, 'index']);
    Route::get('detail/{id}', [ActivityController::class, 'show']);
    Route::post('create', [ActivityController::class, 'createActivity']);
    Route::post('update/{id}', [ActivityController::class, 'updatedActivity']);
});

Route::prefix('contact')->middleware('auth:sanctum')->group(function () {
    Route::get('list', [V1ContactController::class, 'getContactList']);
    Route::post('create', [V1ContactController::class, 'createContact']);
    Route::post('update/{contact_id}', [V1ContactController::class, 'createUpdate']);
});

Route::group(['middleware' => ['auth:sanctum']], function () {


    // general
    Route::get('general/load-user', [GeneralController::class, 'loadUser']);
    Route::post('general/store-setting', [GeneralController::class, 'storeSetting']);
    Route::post('general/load-setting', [GeneralController::class, 'loadSetting']);
    Route::post('general/delete-setting', [GeneralController::class, 'deleteSetting']);
    Route::post('general/search-contact', [GeneralController::class, 'getContact']);
    Route::post('general/search-sales', [GeneralController::class, 'getSales']);
    Route::post('general/search-contact-warehouse', [GeneralController::class, 'getContactWarehouse']);
    Route::post('general/search-company', [GeneralController::class, 'getCompany']);
    Route::get('general/warehouse-user', [GeneralController::class, 'getWarehouseUser']);
    Route::post('general/approval-user', [GeneralController::class, 'getApprovalUser']);
    Route::get('general/address-user/{user_id}', [GeneralController::class, 'getAddressUser']);
    Route::get('general/user-with-address/{user_id}', [GeneralController::class, 'getAddressWithUser']);
    Route::post('general/update-product-need', [GeneralController::class, 'updateProductNeed']);
    Route::post('general/order/update-notes', [GeneralController::class, 'updateOrderNotes']);

    // master data
    // brand
    Route::post('master/brand', [BrandController::class, 'listBrand']);
    Route::get('master/brand/{brand_id}', [BrandController::class, 'getDetailBrand']);
    Route::post('master/brand/save', [BrandController::class, 'saveBrand']);
    Route::post('master/brand/save/{brand_id}', [BrandController::class, 'updateBrand']);
    Route::delete('master/brand/delete/{brand_id}', [BrandController::class, 'deleteBrand']);

    // company_account
    Route::post('master/company-account', [CompanyAccountController::class, 'listCompanyAccount']);
    Route::get('master/company-account/{company_account_id}', [CompanyAccountController::class, 'getDetailCompanyAccount']);
    Route::post('master/company-account/save', [CompanyAccountController::class, 'saveCompanyAccount']);
    Route::post('master/company-account/save/{company_account_id}', [CompanyAccountController::class, 'updateCompanyAccount']);
    Route::delete('master/company-account/delete/{company_account_id}', [CompanyAccountController::class, 'deleteCompanyAccount']);
    Route::post('master/company-account/status/{company_account_id}', [CompanyAccountController::class, 'updateStatusCompanyAccount']);

    // banner
    Route::post('master/banner', [BannerController::class, 'listBanner']);
    Route::get('master/banner/{banner_id}', [BannerController::class, 'getDetailBanner']);
    Route::post('master/banner/save', [BannerController::class, 'saveBanner']);
    Route::post('master/banner/save/{banner_id}', [BannerController::class, 'updateBanner']);
    Route::delete('master/banner/delete/{banner_id}', [BannerController::class, 'deleteBanner']);

    // category
    Route::post('master/category', [CategoryController::class, 'listCategory']);
    Route::get('master/category/{category_id}', [CategoryController::class, 'getDetailCategory']);
    Route::post('master/category/save', [CategoryController::class, 'saveCategory']);
    Route::post('master/category/save/{category_id}', [CategoryController::class, 'updateCategory']);
    Route::delete('master/category/delete/{category_id}', [CategoryController::class, 'deleteCategory']);

    // point
    Route::post('master/point', [MasterPointController::class, 'listMasterPoint']);
    Route::get('master/point/{master_point_id}', [MasterPointController::class, 'getDetailMasterPoint']);
    Route::post('master/point/save', [MasterPointController::class, 'saveMasterPoint']);
    Route::post('master/point/save/{master_point_id}', [MasterPointController::class, 'updateMasterPoint']);
    Route::delete('master/point/delete/{master_point_id}', [MasterPointController::class, 'deleteMasterPoint']);

    // package
    Route::post('master/package', [PackageController::class, 'listPackage']);
    Route::get('master/package/{package_id}', [PackageController::class, 'getDetailPackage']);
    Route::post('master/package/save', [PackageController::class, 'savePackage']);
    Route::post('master/package/save/{package_id}', [PackageController::class, 'updatePackage']);
    Route::delete('master/package/delete/{package_id}', [PackageController::class, 'deletePackage']);


    // payment-method
    Route::post('master/payment-method', [PaymentMethodController::class, 'listPaymentMethod']);
    Route::get('master/payment-method-parents', [PaymentMethodController::class, 'getParentsData']);
    Route::get('master/payment-method/{payment_method_id}', [PaymentMethodController::class, 'getDetailPaymentMethod']);
    Route::post('master/payment-method/save', [PaymentMethodController::class, 'savePaymentMethod']);
    Route::post('master/payment-method/save/{payment_method_id}', [PaymentMethodController::class, 'updatePaymentMethod']);
    Route::delete('master/payment-method/delete/{payment_method_id}', [PaymentMethodController::class, 'deletePaymentMethod']);


    // variant
    Route::post('master/variant', [VariantController::class, 'listVariant']);
    Route::get('master/variant/{variant_id}', [VariantController::class, 'getDetailVariant']);
    Route::post('master/variant/save', [VariantController::class, 'saveVariant']);
    Route::post('master/variant/save/{variant_id}', [VariantController::class, 'updateVariant']);
    Route::delete('master/variant/delete/{variant_id}', [VariantController::class, 'deleteVariant']);

    // voucher
    Route::post('master/voucher', [VoucherController::class, 'listVoucher']);
    Route::get('master/voucher/{payment_method_id}', [VoucherController::class, 'getDetailVoucher']);
    Route::post('master/voucher/save', [VoucherController::class, 'saveVoucher']);
    Route::post('master/voucher/save/{payment_method_id}', [VoucherController::class, 'updateVoucher']);
    Route::delete('master/voucher/delete/{payment_method_id}', [VoucherController::class, 'deleteVoucher']);

    // payment term
    Route::post('master/payment-term', [PaymentTermController::class, 'listPaymentTerm']);
    Route::get('master/payment-term/{payment_term_id}', [PaymentTermController::class, 'getDetailPaymentTerm']);
    Route::post('master/payment-term/save', [PaymentTermController::class, 'savePaymentTerm']);
    Route::post('master/payment-term/save/{payment_term_id}', [PaymentTermController::class, 'updatePaymentTerm']);
    Route::delete('master/payment-term/delete/{payment_term_id}', [PaymentTermController::class, 'deletePaymentTerm']);

    // master tax
    Route::post('master/master-tax', [MasterTaxController::class, 'listMasterTax']);
    Route::get('master/master-tax/{master_tax_id}', [MasterTaxController::class, 'getDetailMasterTax']);
    Route::post('master/master-tax/save', [MasterTaxController::class, 'saveMasterTax']);
    Route::post('master/master-tax/save/{master_tax_id}', [MasterTaxController::class, 'updateMasterTax']);
    Route::delete('master/master-tax/delete/{master_tax_id}', [MasterTaxController::class, 'deleteMasterTax']);


    // sku 
    Route::post('master/sku', [SkuController::class, 'listSku']);
    Route::get('master/sku/{sku_id}', [SkuController::class, 'getDetailSku']);
    Route::post('master/sku/save', [SkuController::class, 'saveSku']);
    Route::post('master/sku/save/{sku_id}', [SkuController::class, 'updateSku']);
    Route::delete('master/sku/delete/{sku_id}', [SkuController::class, 'deleteSku']);

    // ticket
    Route::post('ticket', [TicketController::class, 'listTicket']);
    Route::get('ticket/detail/{id}', [TicketController::class, 'detailTicket']);

    // tiktok
    Route::post('tiktok', [TiktokController::class, 'listTiktok']);
    Route::post('tiktok/export', [TiktokController::class, 'export']);

    // Mapping Tiktok
    Route::post('mapping/product', [MappingProductController::class, 'list']);
    Route::get('mapping/product/detail/{id}', [MappingProductController::class, 'detail']);
    Route::get('mapping/refresh', [MappingProductController::class, 'refreshToken']);
    Route::get('mapping/product/syncron', [MappingProductController::class, 'syncron']);
    Route::post('mapping/settlement', [MappingSettlementController::class, 'list']);
    Route::get('mapping/settlement/detail/{id}', [MappingSettlementController::class, 'detail']);
    Route::get('mapping/settlement/syncron', [MappingSettlementController::class, 'syncron']);
    Route::post('mapping/order', [MappingOrderController::class, 'list']);
    Route::get('mapping/order/detail/{id}', [MappingOrderController::class, 'detail']);
    Route::get('mapping/order/track/{tiktok_order_id}', [MappingOrderController::class, 'getTrackingHistory']);
    Route::post('mapping/order/syncron', [MappingOrderController::class, 'syncron']);
    Route::get('mapping/order/syncron/cancel', [MappingOrderController::class, 'syncronCancel']);
    Route::get('mapping/order/syncrontest', [MappingOrderController::class, 'syncron_test']);

    Route::post('mapping/order/invoice', [MappingOrderController::class, 'printInvoice']);
    Route::post('mapping/order/label', [MappingOrderController::class, 'printLabel']);
    Route::post('mapping/warehouse', [MappingWarehouseController::class, 'list']);
    Route::get('mapping/warehouse/detail/{id}', [MappingWarehouseController::class, 'detail']);
    Route::get('mapping/warehouse/syncron', [MappingWarehouseController::class, 'syncron']);

    // profile
    Route::post('profile', [ProfileController::class, 'listTicket']);
    Route::get('profile/detail', [ProfileController::class, 'detailProfile']);

    // warehouse 
    Route::post('master/warehouse', [WarehouseController::class, 'listWarehouse']);
    Route::get('master/warehouse/{warehouse_id}', [WarehouseController::class, 'getDetailWarehouse']);
    Route::post('master/warehouse/save', [WarehouseController::class, 'saveWarehouse']);
    Route::post('master/warehouse/save/{warehouse_id}', [WarehouseController::class, 'updateWarehouse']);
    Route::delete('master/warehouse/delete/{warehouse_id}', [WarehouseController::class, 'deleteWarehouse']);

    // master discount 
    Route::post('master/master-discount', [MasterDiscountController::class, 'listMasterDiscount']);
    Route::get('master/master-discount/{master_discount_id}', [MasterDiscountController::class, 'getDetailMasterDiscount']);
    Route::post('master/master-discount/save', [MasterDiscountController::class, 'saveMasterDiscount']);
    Route::post('master/master-discount/save/{master_discount_id}', [MasterDiscountController::class, 'updateMasterDiscount']);
    Route::delete('master/master-discount/delete/{master_discount_id}', [MasterDiscountController::class, 'deleteMasterDiscount']);

    // type case 
    Route::post('master/type-case', [TypeCaseController::class, 'listTypeCase']);
    Route::get('master/type-case/{type_case_id}', [TypeCaseController::class, 'getDetailTypeCase']);
    Route::post('master/type-case/save', [TypeCaseController::class, 'saveTypeCase']);
    Route::post('master/type-case/save/{type_case_id}', [TypeCaseController::class, 'updateTypeCase']);
    Route::delete('master/type-case/delete/{type_case_id}', [TypeCaseController::class, 'deleteTypeCase']);

    // category type case 
    Route::post('master/category-type-case', [CategoryCaseController::class, 'listCategoryCase']);
    Route::get('master/category-type-case/{category_type_case_id}', [CategoryCaseController::class, 'getDetailCategoryCase']);
    Route::post('master/category-type-case/save', [CategoryCaseController::class, 'saveCategoryCase']);
    Route::post('master/category-type-case/save/{category_type_case_id}', [CategoryCaseController::class, 'updateCategoryCase']);
    Route::delete('master/category-type-case/delete/{category_type_case_id}', [CategoryCaseController::class, 'deleteCategoryCase']);

    // status case 
    Route::post('master/status-case', [StatusCaseController::class, 'listStatusCase']);
    Route::get('master/status-case/{status_case_id}', [StatusCaseController::class, 'getDetailStatusCase']);
    Route::post('master/status-case/save', [StatusCaseController::class, 'saveStatusCase']);
    Route::post('master/status-case/save/{status_case_id}', [StatusCaseController::class, 'updateStatusCase']);
    Route::delete('master/status-case/delete/{status_case_id}', [StatusCaseController::class, 'deleteStatusCase']);

    // priority case 
    Route::post('master/priority-case', [PriorityCaseController::class, 'listPriorityCase']);
    Route::get('master/priority-case/{priority_case_id}', [PriorityCaseController::class, 'getDetailPriorityCase']);
    Route::post('master/priority-case/save', [PriorityCaseController::class, 'savePriorityCase']);
    Route::post('master/priority-case/save/{priority_case_id}', [PriorityCaseController::class, 'updatePriorityCase']);
    Route::delete('master/priority-case/delete/{priority_case_id}', [PriorityCaseController::class, 'deletePriorityCase']);

    // source case 
    Route::post('master/source-case', [SourceCaseController::class, 'listSourceCase']);
    Route::get('master/source-case/{source_case_id}', [SourceCaseController::class, 'getDetailSourceCase']);
    Route::post('master/source-case/save', [SourceCaseController::class, 'saveSourceCase']);
    Route::post('master/source-case/save/{source_case_id}', [SourceCaseController::class, 'updateSourceCase']);
    Route::delete('master/source-case/delete/{source_case_id}', [SourceCaseController::class, 'deleteSourceCase']);

    // level
    Route::post('master/level', [LevelController::class, 'listLevel']);
    Route::get('master/level/{level_id}', [LevelController::class, 'getDetailLevel']);
    Route::post('master/level/save', [LevelController::class, 'saveLevel']);
    Route::post('master/level/save/{level_id}', [LevelController::class, 'updateLevel']);
    Route::delete('master/level/delete/{level_id}', [LevelController::class, 'deleteLevel']);


    // pengemasan
    Route::post('master/pengemasan', [ProductAdditionalController::class, 'listProductAdditional']);
    Route::get('master/pengemasan/{product_additional_id}', [ProductAdditionalController::class, 'getDetailProductAdditional']);
    Route::post('master/pengemasan/save', [ProductAdditionalController::class, 'saveProductAdditional']);
    Route::post('master/pengemasan/save/{product_additional_id}', [ProductAdditionalController::class, 'updateProductAdditional']);
    Route::delete('master/pengemasan/delete/{product_additional_id}', [ProductAdditionalController::class, 'deleteProductAdditional']);

    // perlengkapan
    Route::post('master/perlengkapan', [ProductAdditionalController::class, 'listProductAdditional']);
    Route::get('master/perlengkapan/{product_additional_id}', [ProductAdditionalController::class, 'getDetailProductAdditional']);
    Route::post('master/perlengkapan/save', [ProductAdditionalController::class, 'saveProductAdditional']);
    Route::post('master/perlengkapan/save/{product_additional_id}', [ProductAdditionalController::class, 'updateProductAdditional']);
    Route::delete('master/perlengkapan/delete/{product_additional_id}', [ProductAdditionalController::class, 'deleteProductAdditional']);

    // sales-channel
    Route::post('master/sales-channel', [SalesChannelController::class, 'listSalesChannel']);
    Route::get('master/sales-channel/{sales_channel_id}', [SalesChannelController::class, 'getDetailSalesChannel']);
    Route::post('master/sales-channel/save', [SalesChannelController::class, 'saveSalesChannel']);
    Route::post('master/sales-channel/save/{sales_channel_id}', [SalesChannelController::class, 'updateSalesChannel']);
    Route::delete('master/sales-channel/delete/{sales_channel_id}', [SalesChannelController::class, 'deleteSalesChannel']);

    // shipping method
    Route::post('master/shipping-method/logistic', [LogisticController::class, 'listLogistic']);
    Route::post('master/shipping-method/logistic/rates', [LogisticController::class, 'listLogisticRates']);
    Route::post('master/shipping-method/logistic/update', [LogisticController::class, 'updateStatusLogistic']);
    Route::post('master/shipping-method/logistic/sync/logistic', [LogisticController::class, 'updateSyncLogistic']);
    Route::post('master/shipping-method/logistic/rates/update', [LogisticController::class, 'updateStatusLogisticRates']);
    Route::get('master/shipping-method/logistic/rates/discount/{logistic_rate_id}', [LogisticController::class, 'getLogisticDiscount']);
    Route::post('master/shipping-method/logistic/rates/discount/save', [LogisticController::class, 'saveLogisticDiscount']);

    Route::post('master/shipping-method/offline/logistic/save/{logistic_id?}', [LogisticController::class, 'saveLogistic']);
    Route::post('master/shipping-method/offline/logistic/rates/save/{logistic_rates_id?}', [LogisticController::class, 'saveLogisticRates']);
    Route::delete('master/shipping-method/offline/logistic/delete/{logistic_id}', [LogisticController::class, 'deleteLogistic']);
    Route::delete('master/shipping-method/offline/logistic/rates/delete/{logistic_rates_id}', [LogisticController::class, 'deleteLogisticRates']);

    Route::post('master/ongkir', [MasterOngkirController::class, 'listMasterOngkir']);
    Route::get('master/ongkir/{master_ongkir_id}', [MasterOngkirController::class, 'getDetailMasterOngkir']);
    Route::post('master/ongkir/save', [MasterOngkirController::class, 'saveMasterOngkir']);
    Route::post('master/ongkir/save/{master_ongkir_id}', [MasterOngkirController::class, 'updateMasterOngkir']);
    Route::delete('master/ongkir/delete/{master_ongkir_id}', [MasterOngkirController::class, 'deleteMasterOngkir']);

    // master data general
    Route::get('master/brand', [MasterController::class, 'getBrand']);
    Route::get('master/categories', [MasterController::class, 'getCategory']);
    Route::get('master/bussiness-entity', [MasterController::class, 'getBussinnesEntity']);
    Route::get('master/role/{role_user?}', [MasterController::class, 'getRole']);
    Route::get('master/warehouse', [MasterController::class, 'getWarehouse']);
    Route::get('master/top', [MasterController::class, 'getTop']);
    Route::get('master/sku', [MasterController::class, 'getSku']);
    Route::get('master/skutiktok', [MasterController::class, 'getSkuTiktok']);
    Route::get('master/warehousetiktok', [MasterController::class, 'getWarehouseTiktok']);
    Route::get('master/variant', [MasterController::class, 'getVariant']);
    Route::get('master/products/{sales_channel?}', [MasterController::class, 'getProductList']);
    Route::get('master/product-lists', [MasterController::class, 'getProductListMaster']);
    Route::post('master/product/stocks', [MasterController::class, 'getProductStockMaster']);
    Route::get('master/products/additional/{type}', [MasterController::class, 'getProductAdditionalList']);
    Route::get('master/taxs', [MasterController::class, 'getMasterTax']);
    Route::get('master/vendors', [MasterController::class, 'getVendors']);
    Route::get('master/discounts/{sales_channel?}', [MasterController::class, 'getMasterDiscount']);
    Route::get('master/package', [MasterController::class, 'getPackage']);
    Route::get('master/company-account', [MasterController::class, 'getCompanyAccount']);
    Route::get('master/logistic/offline', [MasterController::class, 'getOfflineExpedition']);
    Route::get('master/logistic', [MasterController::class, 'getLogistic']);
    Route::get('master/type-case', [MasterController::class, 'getTypeCase']);
    Route::get('master/source-case', [MasterController::class, 'getSourceCase']);
    Route::get('master/priority-case', [MasterController::class, 'getPriorityCase']);
    Route::get('master/status-case', [MasterController::class, 'getStatusCase']);
    Route::get('master/category-case', [MasterController::class, 'getCategoryCase']);
    Route::get('master/list-case', [MasterController::class, 'getCaseList']);
    Route::post('master/list-case', [MasterController::class, 'getProductByCase']);
    Route::get('master/provinsi', [MasterController::class, 'getProvinsi']);
    Route::get('master/kabupaten/{id}', [MasterController::class, 'getKota']);
    Route::get('master/kecamatan/{id}', [MasterController::class, 'getKecamatan']);
    Route::get('master/kelurahan/{id}', [MasterController::class, 'getKelurahan']);
    Route::post('master/address/search', [MasterController::class, 'searchAddress']);
    Route::post('master/search/user', [MasterController::class, 'loadUserByPhone']);

    // checkout agent
    Route::get('cart', [CheckoutAgent::class, 'getCart']);
    Route::get('cart/delete/{cart_id}', [CheckoutAgent::class, 'deleteCart']);
    Route::get('cart/add-qty/{cart_id}', [CheckoutAgent::class, 'addQty']);
    Route::post('cart/update-qty/{cart_id}', [CheckoutAgent::class, 'updateChartQty']);
    Route::get('cart/remove-qty/{cart_id}', [CheckoutAgent::class, 'minusQty']);
    Route::get('cart/selectAll', [CheckoutAgent::class, 'selectAll']);
    Route::get('cart/select/{cart_id}', [CheckoutAgent::class, 'selectItem']);
    Route::post('cart/select-variant', [CheckoutAgent::class, 'selectVariant']);
    Route::get('cart/payment-method', [CheckoutAgent::class, 'getPaymentMethod']);
    Route::get('cart/warehouse', [CheckoutAgent::class, 'getWarehouse']);
    Route::get('cart/address', [CheckoutAgent::class, 'getAddress']);

    // contact
    Route::post('contact', [ContactController::class, 'listContact']);
    Route::post('contact/disabled-telegram', [ContactController::class, 'disabledTelegramNotification']);
    Route::post('contact/save-contact', [ContactController::class, 'storeContact']);
    Route::post('contact/service/search-user', [ContactController::class, 'getUserCreatedBy']);
    Route::get('contact/detail/{user_id}', [ContactController::class, 'detailContact']);
    Route::get('contact/detail/transaction/active/{user_id}', [ContactController::class, 'contactTransaction']);
    Route::get('contact/detail/transaction/history/{user_id}', [ContactController::class, 'contactTransactionHistory']);
    Route::get('contact/detail/case/history/{user_id}', [ContactController::class, 'contactHistoryCase']);
    Route::post('contact/detail/update', [ContactController::class, 'updateProfileContact']);
    Route::get('contact/black-list/{user_id}', [ContactController::class, 'blackListUser']);
    Route::post('contact/address/save-address', [ContactController::class, 'saveAddress']);
    Route::post('contact/address/set-default-address', [ContactController::class, 'setDefaultAddress']);
    Route::get('contact/address/delete/{address_id}', [ContactController::class, 'deleteContact']);
    Route::post('contact/downline/member/list/{user_id}', [ContactController::class, 'getMemberDownline']);
    Route::post('contact/downline/member/save/{user_id}', [ContactController::class, 'saveMember']);
    Route::delete('contact/downline/member/delete/{downline_id}', [ContactController::class, 'deleteMember']);
    Route::post('contact/export', [ContactController::class, 'export']);

    //Trans Agent
    Route::post('transAgent', [TransAgentController::class, 'listTransAgentAll']);
    Route::post('transAgentWaitingPayment', [TransAgentController::class, 'listTransAgentWaitingPayment']);
    Route::post('confirmationAgent', [TransAgentController::class, 'confirmation']);
    Route::post('newTransactionAgent', [TransAgentController::class, 'newTransaction']);
    Route::post('warehouseAgent', [TransAgentController::class, 'warehouse']);
    Route::post('readyProductAgent', [TransAgentController::class, 'readyProduct']);
    Route::post('deliveryAgent', [TransAgentController::class, 'delivery']);
    Route::post('orderAcceptedAgent', [TransAgentController::class, 'orderAccepted']);
    Route::post('historyAgent', [TransAgentController::class, 'history']);
    Route::get('trans-agent/detail/{id}', [TransAgentController::class, 'detailTransAgent']);
    Route::post('trans-agent/assign-warehouse/{id}', [TransAgentController::class, 'assignWarehouse']);
    Route::post('trans-agent/packing-process/{id}', [TransAgentController::class, 'packingProcess']);
    Route::post('trans-agent/product-receive/{id}', [TransAgentController::class, 'productReceived']);

    // bulk
    Route::post('trans-agent/bulk/invoice', [TransAgentController::class, 'bulkInvoice']);


    Route::get('genie/order/sync', [GenieController::class, 'syncData']);
    Route::get('genie/order/cancel-sync', [GenieController::class, 'cancelSync']);
    Route::get('genie/order/detail/{orderId}', [GenieController::class, 'detail']);
    Route::get('genie/order/sync-check', [GenieController::class, 'checkSync']);
    Route::post('genie/order/list', [GenieController::class, 'orderList']);
    Route::post('genie/sync/gp', [GenieController::class, 'submitGp']);
    Route::post('genie/dashboard', [GenieController::class, 'dashboardDetail']);
    Route::post('genie-order/export', [GenieController::class, 'export']);

    // Gp
    Route::post('channel/gp/list', [GPSubmissionController::class, 'submissionList']);
    Route::post('channel/gp/list/detail/{list_id}', [GPSubmissionController::class, 'submissionListDetail']);

    // order lead
    Route::post('order-lead', [OrderLeadController::class, 'listOrderLead']);
    Route::get('order-lead/{uid_lead}', [OrderLeadController::class, 'detailOrderLead']);
    Route::post('order-lead/change-courier', [OrderLeadController::class, 'changeCourier']);
    Route::post('order-lead/service/search-contact', [OrderLeadController::class, 'getUserContact']);
    Route::post('order-lead/service/search-sales', [OrderLeadController::class, 'getUserSales']);
    Route::get('order-lead/assign-warehouse/{uid_lead}', [OrderLeadController::class, 'assignWarehouse']);
    Route::post('order-lead/billing', [OrderLeadController::class, 'billing']);
    Route::post('order-lead/billing/verify', [OrderLeadController::class, 'billingVerify']);
    Route::get('order-lead/cancel/{uid_lead}', [OrderLeadController::class, 'cancel']);
    Route::get('order-lead/closed/{uid_lead}', [OrderLeadController::class, 'setClosed']);
    Route::post('order-lead/reminder/save', [OrderLeadController::class, 'saveReminder']);
    Route::post('order-lead/reminder/update', [OrderLeadController::class, 'updateReminder']);
    Route::get('order-lead/reminder/delete/{reminder_id}', [OrderLeadController::class, 'deleteReminder']);
    Route::post('order-lead/shipping/save', [OrderLeadController::class, 'saveOrderShipping']);
    Route::post('order-lead/update/kode-unik', [OrderLeadController::class, 'deleteUniqueCode']);
    Route::post('order-lead/update/ongkir/{uid_lead}', [OrderLeadController::class, 'updateOngkosKirim']);
    Route::post('order-lead/export', [OrderLeadController::class, 'export']);
    Route::post('order-lead/export/detail/{uid}', [OrderLeadController::class, 'exportDetail']);

    // order lead
    Route::post('order-manual', [OrderManualController::class, 'listOrderLead']);
    Route::get('order-manual/{uid_lead}', [OrderManualController::class, 'detailOrderLead']);
    Route::post('order-manual/change-courier', [OrderManualController::class, 'changeCourier']);
    Route::post('order-manual/service/search-contact', [OrderManualController::class, 'getUserContact']);
    Route::post('order-manual/service/search-sales', [OrderManualController::class, 'getUserSales']);
    Route::get('order-manual/assign-warehouse/{uid_lead}', [OrderManualController::class, 'assignWarehouse']);
    Route::get('order-manual/billing/list/{uid_lead}', [OrderManualController::class, 'getListBilling']);
    Route::post('order-manual/billing', [OrderManualController::class, 'billing']);
    Route::post('order-manual/billing/verify', [OrderManualController::class, 'billingVerify']);
    Route::post('order-manual/delivery', [OrderManualController::class, 'setDelivery']);
    Route::get('order-manual/cancel/{uid_lead}', [OrderManualController::class, 'cancel']);
    Route::get('order-manual/closed/{uid_lead}', [OrderManualController::class, 'setClosed']);
    Route::post('order-manual/reminder/save', [OrderManualController::class, 'saveReminder']);
    Route::post('order-manual/reminder/update', [OrderManualController::class, 'updateReminder']);
    Route::get('order-manual/reminder/delete/{reminder_id}', [OrderManualController::class, 'deleteReminder']);
    Route::get('order-manual/uid/get', [OrderManualController::class, 'getUidLead']);
    Route::post('order-manual/form/save', [OrderManualController::class, 'saveOrderManual']);
    Route::post('order-manual/product-items', [OrderManualController::class, 'selectProductItems']);
    Route::post('order-manual/product-items/add', [OrderManualController::class, 'addProductItem']);
    Route::post('order-manual/product-items/delete', [OrderManualController::class, 'deleteProductItem']);
    Route::post('order-manual/product-items/add-qty', [OrderManualController::class, 'addQty']);
    Route::post('order-manual/product-items/remove-qty', [OrderManualController::class, 'removeQty']);
    Route::get('order-manual/product-need/{uid_lead}', [OrderManualController::class, 'getProductNeed']);
    Route::post('order-manual/shipping/save', [OrderManualController::class, 'saveOrderShipping']);
    Route::post('order-manual/update/kode-unik', [OrderManualController::class, 'deleteUniqueCode']);
    Route::post('order-manual/update/ongkir/{uid_lead}', [OrderManualController::class, 'updateOngkosKirim']);
    Route::post('order-manual/export', [OrderManualController::class, 'export']);
    Route::post('order-manual/export/detail/{uid}', [OrderManualController::class, 'exportDetail']);

    // freebies
    Route::post('freebies', [OrderFreeBiesController::class, 'listOrderLead']);
    Route::get('freebies/{uid_lead}', [OrderFreeBiesController::class, 'detailOrderLead']);
    Route::post('freebies/change-courier', [OrderFreeBiesController::class, 'changeCourier']);
    Route::post('freebies/service/search-contact', [OrderFreeBiesController::class, 'getUserContact']);
    Route::post('freebies/service/search-sales', [OrderFreeBiesController::class, 'getUserSales']);
    Route::get('freebies/assign-warehouse/{uid_lead}', [OrderFreeBiesController::class, 'assignWarehouse']);
    Route::post('freebies/billing', [OrderFreeBiesController::class, 'billing']);
    Route::post('freebies/billing/verify', [OrderFreeBiesController::class, 'billingVerify']);
    Route::post('freebies/delivery', [OrderFreeBiesController::class, 'setDelivery']);
    Route::get('freebies/cancel/{uid_lead}', [OrderFreeBiesController::class, 'cancel']);
    Route::get('freebies/closed/{uid_lead}', [OrderFreeBiesController::class, 'setClosed']);
    Route::post('freebies/reminder/save', [OrderFreeBiesController::class, 'saveReminder']);
    Route::post('freebies/reminder/update', [OrderFreeBiesController::class, 'updateReminder']);
    Route::get('freebies/reminder/delete/{reminder_id}', [OrderFreeBiesController::class, 'deleteReminder']);
    Route::get('freebies/uid/get', [OrderFreeBiesController::class, 'getUidLead']);
    Route::post('freebies/form/save', [OrderFreeBiesController::class, 'saveOrderManual']);
    Route::post('freebies/product-items', [OrderFreeBiesController::class, 'selectProductItems']);
    Route::post('freebies/product-items/add', [OrderFreeBiesController::class, 'addProductItem']);
    Route::post('freebies/product-items/delete', [OrderFreeBiesController::class, 'deleteProductItem']);
    Route::post('freebies/product-items/add-qty', [OrderFreeBiesController::class, 'addQty']);
    Route::post('freebies/product-items/remove-qty', [OrderFreeBiesController::class, 'removeQty']);
    Route::post('freebies/product-items/remove-price', [OrderFreeBiesController::class, 'updatePrice']);
    Route::get('freebies/product-need/{uid_lead}', [OrderFreeBiesController::class, 'getProductNeed']);
    Route::post('freebies/shipping/save', [OrderFreeBiesController::class, 'saveOrderShipping']);
    Route::post('freebies/update/kode-unik', [OrderFreeBiesController::class, 'deleteUniqueCode']);
    Route::post('freebies/update/ongkir/{uid_lead}', [OrderFreeBiesController::class, 'updateOngkosKirim']);
    Route::post('freebies/export', [OrderFreeBiesController::class, 'export']);
    Route::post('freebies/export/detail/{uid}', [OrderFreeBiesController::class, 'exportDetail']);

    // order submit gp
    Route::post('order/{type}/submit', [GpController::class, 'submitGp']);
    Route::post('order/submit/history', [GpController::class, 'listSubmitGp']);
    Route::post('order/submit/history/{submit_id}', [GpController::class, 'listSubmitGpDetail']);

    // dashboard
    Route::post('dashboard', [DashboardController::class, 'detailDashboard']);

    // agent management
    Route::get('province-list', [AgentManagementController::class, 'listProvince']);
    Route::get('city-list/{province_id}', [AgentManagementController::class, 'listCity']);
    Route::get('agent-list/{city_id}', [AgentManagementController::class, 'listAgent']);
    Route::post('agent-update', [AgentManagementController::class, 'updateAgent']);
    Route::post('agent/re-order', [AgentManagementController::class, 'reOrder']);

    // domain
    Route::get('agent/domain', [AgentDomainManagementController::class, 'listAgentDomain']);
    Route::post('agent/domain/list', [AgentDomainManagementController::class, 'listAgentByDomain']);
    Route::post('agent/domain/save', [AgentDomainManagementController::class, 'saveAgentDomain']);
    Route::post('agent/domain/delete', [AgentDomainManagementController::class, 'deleteAgentDomain']);
    Route::post('agent/domain/update', [AgentDomainManagementController::class, 'updateAgentDomain']);
    Route::post('agent/domain/toggle', [AgentDomainManagementController::class, 'toggleAgentDomain']);

    // menu
    Route::get('menu/list', [MenuController::class, 'loadMenu']);
    Route::post('menu/create', [MenuController::class, 'createMenu']);
    Route::post('menu/update/{menu_id}', [MenuController::class, 'updateMenu']);
    Route::post('menu/role/update/{menu_id}', [MenuController::class, 'updateMenuRole']);
    Route::delete('menu/delete/{menu_id}', [MenuController::class, 'deleteMenu']);
    Route::post('menu/order', [MenuController::class, 'orderMenu']);

    // Retur
    Route::post('case/return/list', [ReturnController::class, 'getListReturn']);
    Route::get('case/return/detail/{uid_retur}', [ReturnController::class, 'getReturnDetail']);
    Route::post('case/return/reject', [ReturnController::class, 'reject']);
    Route::post('case/return/approve', [ReturnController::class, 'approve']);

    // Refund
    Route::post('case/refund/list', [RefundController::class, 'getListrefund']);
    Route::get('case/refund/detail/{uid_retur}', [RefundController::class, 'getRefundnDetail']);
    Route::post('case/refund/reject', [RefundController::class, 'reject']);
    Route::post('case/refund/approve', [RefundController::class, 'approve']);

    // case
    Route::post('case/manual/list', [ManualController::class, 'getListManual']);
    Route::get('case/manual/detail/{uid_case}', [ManualController::class, 'getManualDetail']);
    Route::post('case/manual/save', [ManualController::class, 'createCase']);
    Route::post('case/manual/save/{uid_case}', [ManualController::class, 'updateCase']);

    // sales return
    Route::post('order/sales-return', [SalesReturnController::class, 'getListSalesReturn']);
    Route::get('order/sales-return/detail/{uid_return}', [SalesReturnController::class, 'getListSalesReturnDetail']);
    Route::post('order/sales-return/save', [SalesReturnController::class, 'saveSalesReturn']);
    Route::post('order/sales-return/product-items', [SalesReturnController::class, 'selectProductItems']);
    Route::post('order/sales-return/product-items/add', [SalesReturnController::class, 'addProductItem']);
    Route::post('order/sales-return/product-items/delete', [SalesReturnController::class, 'deleteProductItem']);
    Route::post('order/sales-return/product-items/add-qty', [SalesReturnController::class, 'addQty']);
    Route::post('order/sales-return/product-items/remove-qty', [SalesReturnController::class, 'removeQty']);
    Route::post('order/sales-return/data-order', [SalesReturnController::class, 'loadDataByOrderNumber']);
    Route::post('order/sales-return/billing', [SalesReturnController::class, 'addBilling']);
    Route::post('order/sales-return/billing/verify', [SalesReturnController::class, 'billingVerify']);
    Route::post('order/sales-return/save-resi', [SalesReturnController::class, 'saveResi']);
    Route::post('order/sales-return/assign-warehouse', [SalesReturnController::class, 'assignToWarehouse']);
    Route::post('order/sales-return/cancel', [SalesReturnController::class, 'cancel']);
    Route::post('order/sales-return/payment-proccess', [SalesReturnController::class, 'paymentProccess']);
    Route::post('order/sales-return/completed', [SalesReturnController::class, 'completed']);
    Route::post('order/sales-return/due-date', [SalesReturnController::class, 'getDueDate']);
    Route::post('order/sales-return/update/kode-unik', [SalesReturnController::class, 'deleteUniqueCode']);
    Route::post('order/sales-return/update/ongkir/{uid_retur}', [SalesReturnController::class, 'updateOngkosKirim']);
    Route::post('sales-return/export', [SalesReturnController::class, 'export']);
    Route::post('sales-return/export/detail/{uid}', [SalesReturnController::class, 'exportDetail']);



    // inventory
    Route::get('inventory/info/created', [InventoryController::class, 'getInfoCreated']);
    Route::get('inventory/item', [InventoryController::class, 'getProductCount']);
    Route::post('inventory/product/stock', [InventoryController::class, 'inventoryStock']);
    Route::get('inventory/product/detail/{inventory_id}', [InventoryController::class, 'inventoryStockDetail']);
    Route::post('inventory/product/stock/save', [InventoryController::class, 'inventoryStockCreate']);
    Route::post('inventory/product/transfer/save', [InventoryController::class, 'inventoryTransferCreate']);
    Route::post('inventory/product/transfer/save/{inventory_id}', [InventoryController::class, 'inventoryTransferUpdate']);
    Route::post('inventory/product/stock/update/{inventory_id}', [InventoryController::class, 'inventoryStockUpdate']);
    Route::post('inventory/product/stock/cancel/{inventory_id}', [InventoryController::class, 'inventoryStockCancel']);
    Route::post('inventory/product/stock/allocated/{inventory_id}', [InventoryController::class, 'inventoryStockAllocated']);
    Route::delete('inventory/product/stock/delete/{inventory_id}', [InventoryController::class, 'inventoryStockDelete']);
    Route::post('inventory/product/return/verify/{inventory_id}', [InventoryController::class, 'inventoryReturnVerify']);
    Route::post('inventory/product/return/received/{uid_inventory}', [InventoryController::class, 'inventoryReturnReceived']);
    Route::post('inventory/product/return/status/{inventory_item_id}', [InventoryController::class, 'updateStatusReceivedVendor']);
    Route::post('inventory/product/return/pre-received/{uid_inventory}', [InventoryController::class, 'inventoryReturnPreReceived']);
    Route::post('inventory/product/return/completed/{uid_inventory}', [InventoryController::class, 'inventoryReturnComplete']);
    Route::post('inventory/product/stock/export_received', [InventoryController::class, 'export_received']);
    Route::post('inventory/product/stock/export_transfer', [InventoryController::class, 'export_transfer']);
    Route::post('inventory/product/stock/export_return', [InventoryController::class, 'export_return']);

    // inventory return
    Route::post('inventory/product/return', [InventoryController::class, 'inventoryReturn']);
    Route::get('inventory/product/return/detail/{inventory_id}', [InventoryController::class, 'inventoryReturnDetail']);
    Route::post('inventory/product/return/save', [InventoryController::class, 'inventoryReturnCreate']);
    Route::post('inventory/product/return/update/{inventory_id}', [InventoryController::class, 'inventoryReturnUpdate']);
    Route::delete('inventory/product/return/delete/{inventory_id}', [InventoryController::class, 'inventoryReturnDelete']);

    // lead master
    Route::post('lead-master', [LeadController::class, 'listLead']);
    Route::get('lead-master/detail/{uid_lead}', [LeadController::class, 'detailLead']);
    Route::post('lead-master/create', [LeadController::class, 'createLead']);
    Route::post('lead-master/update/{uid_lead}', [LeadController::class, 'update']);
    Route::post('lead-master/activity/create', [LeadController::class, 'storeActivity']);
    Route::post('lead-master/activity/update/{activity_id}', [LeadController::class, 'updateActivity']);
    Route::delete('lead-master/activity/delete/{activity_id}', [LeadController::class, 'deleteActivity']);
    Route::post('lead-master/product-needs', [LeadController::class, 'selectProductItems']);
    Route::post('lead-master/product-needs/add', [LeadController::class, 'addProductItem']);
    Route::post('lead-master/product-needs/delete', [LeadController::class, 'deleteProductItem']);
    Route::post('lead-master/product-needs/add-qty', [LeadController::class, 'addQty']);
    Route::post('lead-master/product-needs/remove-qty', [LeadController::class, 'removeQty']);
    Route::post('lead-master/action/reject', [LeadController::class, 'reject']);
    Route::post('lead-master/action/approve', [LeadController::class, 'approve']);
    Route::post('lead-master/action/save-negotiation', [LeadController::class, 'saveNegotiation']);
    Route::post('lead-master/export', [LeadController::class, 'export']);

    Route::post('gp-customer/list', [GPCustomerController::class, 'customerList']);
    Route::post('gp-customer/create', [GPCustomerController::class, 'createCustomer']);
    Route::post('gp-customer/update/{customer_id}', [GPCustomerController::class, 'updateCustomer']);
    Route::delete('gp-customer/delete/{customer_id}', [GPCustomerController::class, 'deleteCustomer']);

    // agent location
    Route::get('domain', [AgentLocationController::class, 'listAgentDomain']);
    Route::get('district/{prov_id}', [AgentLocationController::class, 'listDistrictByProvince']);
    Route::get('subdistrict/{district_id}', [AgentLocationController::class, 'listSubdistrictByDistrict']);
    Route::get('user/province', [AgentLocationController::class, 'listProvinceByUser']);
    Route::get('user/subdistrict/{subdistrict_id}', [AgentLocationController::class, 'listUserBySubdistrict']);

    // product
    Route::prefix('product-management')->group(function () {
        // product
        Route::post('product', [ProductMasterController::class, 'listProductMaster']);
        Route::post('product/status/{product_id}', [ProductMasterController::class, 'updateStatusProductMaster']);
        Route::get('product/{product_id}', [ProductMasterController::class, 'getDetailProductMaster']);
        Route::post('product/save', [ProductMasterController::class, 'saveProductMaster']);
        Route::post('product/save/{product_id}', [ProductMasterController::class, 'updateProductMaster']);
        Route::post('product/set-stock/{product_id}', [ProductMasterController::class, 'updateStockProduct']);
        Route::delete('product/delete/{product_id}', [ProductMasterController::class, 'deleteProductMaster']);
        Route::delete('product/images/delete/{product_images_id}', [ProductMasterController::class, 'handleDeleteProductImages']);
        Route::post('product/export', [ProductMasterController::class, 'export']);

        // product variant
        Route::post('product-variant', [ProductVariantController::class, 'listProductVariant']);
        Route::post('product-variant/status/{product_variant_id}', [ProductVariantController::class, 'updateStatusProductVariant']);
        Route::get('product-variant/detail/{product_variant_id?}', [ProductVariantController::class, 'getDetailProductVariant']);
        Route::post('product-variant/save', [ProductVariantController::class, 'saveProductVariant']);
        Route::post('product-variant/save/{product_variant_id}', [ProductVariantController::class, 'updateProductVariant']);
        Route::post('product-variant/export', [ProductVariantController::class, 'export']);
        Route::post('product-variant/export-base-inventory', [ProductVariantController::class, 'exportBaseInventory']);
        Route::delete('product-variant/delete/{product_variant_id}', [ProductVariantController::class, 'deleteProductVariant']);

        // product margin bottom
        Route::post('margin-bottom', [ProductMarginBottom::class, 'listMarginBottom']);
        Route::get('margin-bottom/detail/{product_margin_id?}', [ProductMarginBottom::class, 'getDetailMarginBottom']);
        Route::post('margin-bottom/save', [ProductMarginBottom::class, 'saveMarginBottom']);
        Route::post('margin-bottom/save/{product_margin_id}', [ProductMarginBottom::class, 'updateMarginBottom']);
        Route::delete('margin-bottom/delete/{product_margin_id}', [ProductMarginBottom::class, 'deleteMarginBottom']);

        // product Comment Rating
        Route::post('comment-rating', [ProductCommentRatingController::class, 'listCommentRating']);

        // import
        Route::post('import/list', [ImportController::class, 'listImport']);
        Route::post('import/save', [ImportController::class, 'saveImport']);
        Route::post('import/convert', [ImportController::class, 'saveConvert']);
        Route::post('import/discard', [ImportController::class, 'discardImport']);

        // convert
        Route::post('convert/list', [ConvertController::class, 'listConvert']);
        Route::post('convert/detail/{convert_id}', [ConvertController::class, 'listConvertDetail']);
        Route::post('convert/export/{convert_id}', [ConvertController::class, 'export']);
        Route::post('convert/export/detail/{convert_id}', [ConvertController::class, 'exportConvert']);
    });

    //vendor
    Route::post('vendor/export', [ConvertController::class, 'exportVendor']);
    Route::post('po-receiving/export', [ConvertController::class, 'exportPoReceiving']);

    // stock movement
    Route::post('stock-movement', [StockMovementController::class, 'listStockMovement']);
    Route::post('stock-movement/export', [StockMovementController::class, 'export']);

    // purchase
    Route::prefix('purchase')->group(function () {
        // purchase order
        Route::post('purchase-order', [PurchaseOrderController::class, 'listPurchaseOrder']);
        Route::get('purchase-order/{purchase_order_id}', [PurchaseOrderController::class, 'detailPurchaseOrder']);
        Route::post('purchase-order/save', [PurchaseOrderController::class, 'savePurchaseOrder']);
        Route::post('purchase-order/save/{purchase_order_id}', [PurchaseOrderController::class, 'updatePurchaseOrder']);
        Route::delete('purchase-order/cancel/{purchase_order_id}', [PurchaseOrderController::class, 'cancelPurchaseOrder']);
        Route::post('purchase-order/reject/{purchase_order_id}', [PurchaseOrderController::class, 'rejectPurchaseOrder']);
        Route::post('purchase-order/approve/{purchase_order_id}', [PurchaseOrderController::class, 'approvePurchaseOrder']);
        Route::post('purchase-order/assign-warehouse/{purchase_order_id}', [PurchaseOrderController::class, 'assignToWarehouse']);
        Route::post('purchase-order/status/update/{purchase_order_id}', [PurchaseOrderController::class, 'updateStatusPurchaseOrder']);
        Route::post('purchase-order/billing/save/{purchase_order_id}', [PurchaseOrderController::class, 'billingSave']);
        Route::post('purchase-order/billing/approve/{purchase_billing_id}', [PurchaseOrderController::class, 'billingApprove']);
        Route::post('purchase-order/billing/reject/{purchase_billing_id}', [PurchaseOrderController::class, 'billingReject']);
        Route::post('purchase-order/complete/{purchase_billing_id}', [PurchaseOrderController::class, 'purchaseOrderComplete']);
        Route::post('purchase-order/product/update/{purchase_order_item_id}', [PurchaseOrderController::class, 'updateProductItem']);
        Route::delete('purchase-order/product/delete/{purchase_order_item_id}', [PurchaseOrderController::class, 'deleteProductItem']);
        Route::post('purchase-order/product/invoice', [PurchaseOrderController::class, 'invoiceProductItem']);
        Route::post('purchase-order/product/add/{purchase_order_id}', [PurchaseOrderController::class, 'addProductItem']);
        Route::post('purchase-order/export', [PurchaseOrderController::class, 'export']);

        // purchase requititionØØ
        Route::post('purchase-requitition', [PurchaseRequisitionController::class, 'listPurchaseRequitition']);
        Route::get('purchase-requitition/{purchase_requitition_id}', [PurchaseRequisitionController::class, 'detailPurchaseRequitition']);
        Route::post('purchase-requitition/save', [PurchaseRequisitionController::class, 'createRequitition']);
        Route::post('purchase-requitition/save/{purchase_requitition_id}', [PurchaseRequisitionController::class, 'updatePurchaseRequitition']);
        Route::delete('purchase-requitition/cancel/{purchase_requitition_id}', [PurchaseRequisitionController::class, 'cancelPurchaseRequitition']);
        Route::post('purchase-requitition/reject/{purchase_requitition_id}', [PurchaseRequisitionController::class, 'rejectPurchaseRequitition']);
        Route::post('purchase-requitition/approve/{purchase_requitition_id}', [PurchaseRequisitionController::class, 'approvePurchaseRequitition']);
        Route::post('purchase-requitition/approval/status/{approval_id}', [PurchaseRequisitionController::class, 'approvalVerification']);
        Route::post('purchase-requitition/complete/{purchase_requitition_id}', [PurchaseRequisitionController::class, 'purchaseOrderComplete']);
    });

    // setting
    Route::prefix('setting')->group(function () {
        // notification template
        Route::post('notification-template', [NotificationTemplateController::class, 'listNotificationTemplate']);
        Route::get('notification-template/{template_id}', [NotificationTemplateController::class, 'getDetailNotificationTemplate']);
        Route::post('notification-template/save', [NotificationTemplateController::class, 'saveNotificationTemplate']);
        Route::post('notification-template/save/{template_id}', [NotificationTemplateController::class, 'updateNotificationTemplate']);
        Route::delete('notification-template/delete/{template_id}', [NotificationTemplateController::class, 'deleteNotificationTemplate']);
    });

    // transaction
    Route::prefix('transaction')->group(function () {
        Route::post('list', [TransactionController::class, 'listTransaction']);
        Route::post('new-order', [TransactionController::class, 'createNewOrder']);
        Route::post('new-order/status', [TransactionController::class, 'updateStatusLink']);
        Route::post('bulk/print/invoice', [TransactionController::class, 'printInvoice']);
        Route::post('bulk/print/label', [TransactionController::class, 'printLabel']);
        Route::post('bulk/ready-to-ship', [TransactionController::class, 'readyToShip']);
        Route::post('track', [TransactionController::class, 'trackOrder']);
        Route::get('detail/{transaction_id}', [TransactionController::class, 'getTransactionDetail']);
        Route::get('detail/agent/{transaction_id}', [TransactionController::class, 'getTransactionDetailAgent']);
    });
});

Route::get('ajax/search/user', [AjaxController::class, 'searchUser']);

// lead master
Route::get('ajax/search/lead/contact', [AjaxController::class, 'searcContactFromLead']);
Route::get('ajax/search/lead/sales', [AjaxController::class, 'searcSalesFromLead']);

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('payment-notifications', [PaymentNotification::class, 'notifications'])->name('notification.payment');
Route::post('ginee-callback', [GineeWebhookController::class, 'webhook'])->name('ginee.callback');
Route::middleware('cors')->group(function () {
    Route::post('update-profile-photo', [UserController::class, 'updateProfilePhoto'])->name('user.update-profile-photo');
    Route::post('email-notification', [SendEmailController::class, 'sendMailNotificationApi'])->name('email-notification');

    Route::prefix('transaction')->group(function () {
        Route::post('confirm-payment', [ConfirmPaymentController::class, 'uploadPayment'])->name('transaction.confirm');
    });
});
