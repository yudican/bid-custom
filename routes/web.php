<?php

use App\Http\Controllers\Api\V1\Prospect\ProspectController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Callback\PopaketCallback;
use App\Http\Controllers\Invoice\InvoiceController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\PrintController;
use App\Http\Controllers\GracePeriodController;
use App\Http\Controllers\Spa\AgentDomainManagementController;
use App\Http\Controllers\Spa\AgentManagementController;
use App\Http\Controllers\Spa\Auth\LoginController;
use App\Http\Controllers\Spa\Auth\RegisterController;
use App\Http\Controllers\Spa\Case\ManualController;
use App\Http\Controllers\Spa\Case\RefundController;
use App\Http\Controllers\Spa\Case\ReturnController;
use App\Http\Controllers\Spa\CheckoutAgent;
use App\Http\Controllers\Spa\ContactController as SpaContactController;
use App\Http\Controllers\Spa\DashboardController;
use App\Http\Controllers\Spa\GenieController;
use App\Http\Controllers\Spa\GPCustomerController;
use App\Http\Controllers\Spa\GPSubmissionController;
use App\Http\Controllers\Spa\InventoryController as SpaInventoryController;
use App\Http\Controllers\Spa\LeadController;
use App\Http\Controllers\Spa\TicketController;
use App\Http\Controllers\Spa\MappingProductController;
use App\Http\Controllers\Spa\MappingSettlementController;
use App\Http\Controllers\Spa\MappingOrderController;
use App\Http\Controllers\Spa\MappingWarehouseController;
use App\Http\Controllers\Spa\ProfileController;
use App\Http\Controllers\Spa\Master\BannerController as MasterBannerController;
use App\Http\Controllers\Spa\Master\BrandController;
use App\Http\Controllers\Spa\Master\CategoryController as MasterCategoryController;
use App\Http\Controllers\Spa\Master\LogisticController as MasterLogisticController;
use App\Http\Controllers\Spa\Master\MasterPointController as MasterMasterPointController;
use App\Http\Controllers\Spa\Master\PackageController as MasterPackageController;
use App\Http\Controllers\Spa\Master\PaymentMethodController as MasterPaymentMethodController;
use App\Http\Controllers\Spa\Master\VariantController as MasterVariantController;
use App\Http\Controllers\Spa\Master\VoucherController as MasterVoucherController;
use App\Http\Controllers\Spa\Master\PaymentTermController as MasterPaymentTermController;
use App\Http\Controllers\Spa\Master\MasterTaxController as MasterMasterTaxController;
use App\Http\Controllers\Spa\Master\SkuController as MasterSkuController;
use App\Http\Controllers\Spa\Master\WarehouseController as MasterWarehouseController;
use App\Http\Controllers\Spa\Master\MasterDiscountController as MasterMasterDiscountController;
use App\Http\Controllers\Spa\Master\TypeCaseController as MasterTypeCaseController;
use App\Http\Controllers\Spa\Master\CategoryCaseController as MasterCategoryCaseController;
use App\Http\Controllers\Spa\Master\CompanyAccountController;
use App\Http\Controllers\Spa\Master\StatusCaseController as MasterStatusCaseController;
use App\Http\Controllers\Spa\Master\PriorityCaseController as MasterPriorityCaseController;
use App\Http\Controllers\Spa\Master\SourceCaseController as MasterSourceCaseController;
use App\Http\Controllers\Spa\Master\LevelController as MasterLevelController;
use App\Http\Controllers\Spa\Master\MasterOngkirController;
use App\Http\Controllers\Spa\Master\ProductAdditionalController;
use App\Http\Controllers\Spa\Master\SalesChannelController;
use App\Http\Controllers\Spa\MenuController;
use App\Http\Controllers\Spa\Order\GpController;
use App\Http\Controllers\Spa\Order\OrderFreeBiesController;
use App\Http\Controllers\Spa\Order\SalesReturnController as OrderSalesReturnController;
use App\Http\Controllers\Spa\OrderLeadController as SpaOrderLeadController;
use App\Http\Controllers\Spa\OrderManualController as SpaOrderManualController;
use App\Http\Controllers\Spa\ProductManagement\ConvertController;
use App\Http\Controllers\Spa\ProductManagement\ImportController;
use App\Http\Controllers\Spa\ProductManagement\ProductCommentRatingController;
use App\Http\Controllers\Spa\ProductManagement\ProductMarginBottom;
use App\Http\Controllers\Spa\ProductManagement\ProductMasterController;
use App\Http\Controllers\Spa\ProductManagement\ProductVariantController as ProductManagementProductVariantController;
use App\Http\Controllers\Spa\Purchase\PurchaseOrderController;
use App\Http\Controllers\Spa\Purchase\PurchaseRequisitionController;
use App\Http\Controllers\Spa\StockMovementController;
use App\Http\Controllers\Spa\Setting\NotificationTemplateController as SettingNotificationTemplateController;
use App\Http\Controllers\Spa\TransactionController as SpaTransactionController;
use App\Http\Controllers\Spa\TransAgentController;
use App\Http\Controllers\Spa\TiktokController;
use App\Http\Controllers\Webhook\WebhookController;
use App\Http\Livewire\Auth\PasswordReset;
use App\Http\Livewire\CrudGenerator;
use App\Http\Livewire\Dashboard;
use App\Http\Livewire\DashboardAgent;
use App\Http\Livewire\DashboardLead;
// use App\Http\Livewire\Master\CategoryController;
// use App\Http\Livewire\Master\ProductController;
use App\Http\Livewire\Settings\Menu;
use App\Http\Livewire\UserManagement\Permission;
use App\Http\Livewire\UserManagement\PermissionRole;
use App\Http\Livewire\UserManagement\Role;
use App\Http\Livewire\UserManagement\User;
use App\Http\Livewire\CategoryController;
use App\Http\Livewire\Transaction\TransactionController;
use App\Http\Livewire\VariantController;
use App\Http\Livewire\DetailVariantController;
use App\Http\Livewire\Master\PaymentMethodController;
use App\Http\Livewire\ProductController;
use App\Http\Livewire\PackageController;
use App\Http\Livewire\ProductVariantController;
use App\Http\Livewire\BannerController;
use App\Http\Livewire\CompanyController;
use App\Http\Livewire\LevelController;
// use App\Http\Livewire\Master\BrandController;
use App\Http\Livewire\Master\VoucherController;
use App\Http\Livewire\UserDataController;
use App\Http\Livewire\PriceController;
use App\Http\Livewire\WarehouseController;
use App\Http\Livewire\ShippingMethodController;
use App\Http\Livewire\MasterPointController;
use App\Http\Livewire\BusinessEntityController;
use App\Http\Livewire\Setting\NotificationTemplateController;
use App\Http\Livewire\SettingDescriptionController;
use App\Http\Livewire\CommentRatingController;
use App\Http\Livewire\NotificationController;
use App\Http\Livewire\Setting\GeneralSettingController;
use App\Http\Livewire\ContactController;
use App\Http\Livewire\LeadMasterController;
use App\Http\Livewire\MarginBottomController;
use App\Http\Livewire\FaqCategoryController;
use App\Http\Livewire\FaqContentController;
use App\Http\Livewire\FaqSubmenuController;
use App\Http\Livewire\OrderLeadController;
use App\Http\Livewire\OrderManualController;
use App\Http\Livewire\PaymentTermController;
use App\Http\Livewire\MasterTaxController;
use App\Http\Livewire\MasterDiscountController;
use App\Http\Livewire\TypeCaseController;
use App\Http\Livewire\CategoryCaseController;
use App\Http\Livewire\StatusCaseController;
use App\Http\Livewire\PriorityCaseController;
use App\Http\Livewire\SourceCaseController;
use App\Http\Livewire\CaseController;
use App\Http\Livewire\SkuMasterController;
use App\Http\Livewire\RefundMasterController;
use App\Http\Livewire\ReturMasterController;
use App\Http\Livewire\SalesReturnController;
use Illuminate\Support\Facades\Route;

//agent
use App\Http\Livewire\Agent\ProductController as ProductAgent;
use App\Http\Livewire\Agent\CartController;
use App\Http\Livewire\Agent\OrderController;
use App\Http\Livewire\Agent\TransactionSuccess;
use App\Http\Livewire\AgentManagement\AgentDetailController;
use App\Http\Livewire\AgentManagement\DomainController;
use App\Http\Livewire\InventoryController;
use App\Http\Livewire\Master\LogisticController;
use App\Http\Livewire\Master\LogisticRateController;
use App\Http\Livewire\Product\ListConvert;
use App\Http\Livewire\Product\ProductSKUConvert;
use App\Http\Livewire\Product\ProductSkuImport;
use App\Http\Livewire\Shipping\ShippingVoucher;
use App\Http\Livewire\Transaction\TransactionReportController;
use App\Models\SalesChannel;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Spa Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::group(['middleware' => ['auth:sanctum', 'user.authorization']], function () {
    Route::get('genie/dashboard', [GenieController::class, 'index'])->name('spa.genie.dashboard');
    Route::get('genie/order/list', [GenieController::class, 'index'])->name('spa.genie.index');
    Route::get('genie/order/detail/{orderId?}', [GenieController::class, 'index'])->name('spa.genie.detail');

    // contact
    Route::get('contact/list', [SpaContactController::class, 'index'])->name('spa.contact.index');
    Route::get('contact/create', [SpaContactController::class, 'index'])->name('spa.contact.create');
    Route::get('contact/detail/{user_id?}', [SpaContactController::class, 'index'])->name('spa.contact.detail');
    Route::get('contact/update/{user_id?}', [SpaContactController::class, 'index'])->name('spa.contact.update');

    // transaction agent
    Route::get('trans-agent/all-trans', [TransAgentController::class, 'index'])->name('spa.transAgent.index');
    Route::get('trans-agent/waiting-payment', [TransAgentController::class, 'index'])->name('spa.transAgent.waiting-payment');
    Route::get('trans-agent/confirmation', [TransAgentController::class, 'index'])->name('spa.transAgent.confimation');
    Route::get('trans-agent/new-transaction', [TransAgentController::class, 'index'])->name('spa.transAgent.new-transaction');
    Route::get('trans-agent/warehouse', [TransAgentController::class, 'index'])->name('spa.transAgent.warehouse');
    Route::get('trans-agent/ready-product', [TransAgentController::class, 'index'])->name('spa.transAgent.ready-product');
    Route::get('trans-agent/delivery', [TransAgentController::class, 'index'])->name('spa.transAgent.delivery');
    Route::get('trans-agent/order-accepted', [TransAgentController::class, 'index'])->name('spa.transAgent.order-accepted');
    Route::get('trans-agent/history', [TransAgentController::class, 'index'])->name('spa.transAgent.history');
    Route::get('trans-agent/detail/{id}', [TransAgentController::class, 'index'])->name('spa.transAgent.detail');

    // checkout agent
    Route::get('cart/list', [CheckoutAgent::class, 'index'])->name('spa.cart.index');

    // order lead
    Route::get('order/order-lead', [SpaOrderLeadController::class, 'index'])->name('spa.order-lead.index');
    Route::get('order/order-lead/{uid_lead}', [SpaOrderLeadController::class, 'index'])->name('spa.order-lead.detail');

    // prospect
    Route::get('prospect', [ProspectController::class, 'home'])->name('spa.prospect.index');
    Route::get('prospect/detail/{prospect_id}', [ProspectController::class, 'home'])->name('spa.prospect.detail');
    Route::get('prospect/form/{prospect_id?}', [ProspectController::class, 'home'])->name('spa.prospect.form');
   
    // order online
    Route::get('order-online', [ProspectController::class, 'home'])->name('spa.order-online.index');
    Route::get('order-online/detail/{order_online_id}', [ProspectController::class, 'home'])->name('spa.order-online.detail');
    Route::get('order-online/form/{order_online_id?}', [ProspectController::class, 'home'])->name('spa.order-online.form');

    // order lead manual
    Route::get('order/manual/order-lead', [SpaOrderManualController::class, 'index'])->name('spa.order-lead-manual.index');
    Route::get('order/manual/order-lead/detail/{uid_lead}', [SpaOrderManualController::class, 'index'])->name('spa.order-lead-manual.detail');
    Route::get('order/manual/order-lead/form/{uid_lead}', [SpaOrderManualController::class, 'index'])->name('spa.order-lead-manual.form');

    // order lead manual
    Route::get('order/freebies', [OrderFreeBiesController::class, 'index'])->name('spa.freebies.index');
    Route::get('order/freebies/detail/{uid_lead}', [OrderFreeBiesController::class, 'index'])->name('spa.freebies.detail');
    Route::get('order/freebies/form/{uid_lead}', [OrderFreeBiesController::class, 'index'])->name('spa.freebies.form');

    // order submit
    Route::get('order/submit/history', [GpController::class, 'submitIndex'])->name('spa.submit-history.index');
    Route::get('order/submit/history/{submit_id}', [GpController::class, 'submitIndex'])->name('spa.submit-history-detail.index');

    // dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // agent management
    Route::get('/agent/list', [AgentManagementController::class, 'index'])->name('spa.agent-management.index');
    Route::get('/agent/domain', [AgentDomainManagementController::class, 'index'])->name('spa.agent-domain.index');

    // menu
    Route::get('/menu', [MenuController::class, 'index'])->name('spa.menu.index');

    // case section
    // return
    Route::get('case/return', [ReturnController::class, 'index'])->name('spa.return.index');
    Route::get('case/return/{uid_retur}', [ReturnController::class, 'index'])->name('spa.return.detail');

    // refund
    Route::get('case/refund', [RefundController::class, 'index'])->name('spa.refund.index');
    Route::get('case/refund/{uid_refund}', [RefundController::class, 'index'])->name('spa.refund.detail');

    // manual
    Route::get('case/manual', [ManualController::class, 'index'])->name('spa.manual.index');
    Route::get('case/manual/{uid_case}', [ManualController::class, 'index'])->name('spa.manual.detail');
    Route::get('case/manual/form/{uid_case?}', [ManualController::class, 'index'])->name('spa.manual.form');
    Route::get('case/manual/detail/{uid_case?}', [ManualController::class, 'index'])->name('spa.manual-page.detail');

    // sales return
    Route::get('order/sales-return', [OrderSalesReturnController::class, 'index'])->name('spa.sales-return.index');
    Route::get('order/sales-return/form/{uid_return?}', [OrderSalesReturnController::class, 'index'])->name('spa.sales-return.form');
    Route::get('order/sales-return/detail/{uid_return?}', [OrderSalesReturnController::class, 'index'])->name('spa.sales-return.detail');

    Route::get('inventory-new', [SpaInventoryController::class, 'index'])->name('spa.inventory.index');
    Route::get('inventory-new/inventory-product-stock', [SpaInventoryController::class, 'index'])->name('spa.inventory.product.index');
    Route::get('inventory-new/inventory-product-stock/form', [SpaInventoryController::class, 'index'])->name('spa.inventory.product.add');
    Route::get('inventory-new/inventory-product-stock/detail/{inventory_id}', [SpaInventoryController::class, 'index'])->name('spa.inventory.product.update');
    Route::get('inventory-new/inventory-product-transfer/form', [SpaInventoryController::class, 'index'])->name('spa.inventory.product.transfer.form');
    Route::get('inventory-new/inventory-product-transfer/form/{inventory_id}', [SpaInventoryController::class, 'index'])->name('spa.inventory.product.transfer');
    Route::get('inventory-new/inventory-product-transfer/detail/{inventory_id}', [SpaInventoryController::class, 'index'])->name('spa.inventory.product.transfer.detail');
    Route::get('inventory-new/inventory-product-transfer', [SpaInventoryController::class, 'index'])->name('spa.inventory.product.transfer.index');
    Route::get('inventory-new/inventory-product-return/form/{inventory_id}', [SpaInventoryController::class, 'index'])->name('spa.inventory.product.return');
    Route::get('inventory-new/inventory-product-return/detail/{inventory_id}', [SpaInventoryController::class, 'index'])->name('spa.inventory.product.return.detail');
    Route::get('inventory-new/inventory-product-return', [SpaInventoryController::class, 'index'])->name('spa.inventory.product.return.index');

    Route::get('lead-master', [LeadController::class, 'index'])->name('spa.lead-master.index');
    Route::get('lead-master/detail/{uid_lead}', [LeadController::class, 'index'])->name('spa.lead-master.detail');
    Route::get('lead-master/form/{uid_lead?}', [LeadController::class, 'index'])->name('spa.lead-master.form');

    Route::get('ticket', [TicketController::class, 'index'])->name('spa.ticket-master.index');
    Route::get('ticket/detail/{id}', [TicketController::class, 'index'])->name('spa.ticket-master.detail');
    Route::get('tiktok', [TiktokController::class, 'index'])->name('spa.tiktok-master.index');

    Route::get('mapping/product', [MappingProductController::class, 'index'])->name('spa.mapping-product.index');
    Route::get('mapping/settlement', [MappingSettlementController::class, 'index'])->name('spa.mapping-settlement.index');
    Route::get('mapping/order', [MappingOrderController::class, 'index'])->name('spa.mapping-order.index');
    Route::get('mapping/order/export', [MappingOrderController::class, 'generatePDF'])->name('spa.mapping-warehouse.export');
    Route::get('mapping/order/detail/{id}', [MappingOrderController::class, 'index'])->name('spa.mapping-order.detail');
    Route::get('mapping/warehouse', [MappingWarehouseController::class, 'index'])->name('spa.mapping-warehouse.index');

    Route::get('profile', [ProfileController::class, 'index'])->name('spa.profile');

    Route::get('gp-submission', [GPSubmissionController::class, 'index'])->name('spa.gp.index');
    Route::get('gp-submission/list/detail/{list_id}', [GPSubmissionController::class, 'index'])->name('spa.gp.detail');
    Route::get('gp-submission/export/{item_id}', [GPSubmissionController::class, 'exportConvert'])->name('spa.gp.export');

    Route::get('gp-customer', [GPCustomerController::class, 'index'])->name('spa.gp-customer.index');

    // master data
    // brand
    Route::get('master/brand', [BrandController::class, 'index'])->name('spa.master-brand.index');
    Route::get('master/brand/form/{brand_id?}', [BrandController::class, 'index'])->name('spa.master-brand-form.index');

    // company account
    Route::get('master/company-account', [CompanyAccountController::class, 'index'])->name('spa.master-company-account.index');
    Route::get('master/company-account/form/{company_account_id?}', [CompanyAccountController::class, 'index'])->name('spa.master-company-account-form.index');

    // banner
    Route::get('master/banner', [MasterBannerController::class, 'index'])->name('spa.master-banner.index');
    Route::get('master/banner/form/{banner_id?}', [MasterBannerController::class, 'index'])->name('spa.master-banner-form.index');

    // category
    Route::get('master/category', [MasterCategoryController::class, 'index'])->name('spa.master-category.index');
    Route::get('master/category/form/{category_id?}', [MasterCategoryController::class, 'index'])->name('spa.master-category-form.index');

    // point
    Route::get('master/point', [MasterMasterPointController::class, 'index'])->name('spa.master-point.index');
    Route::get('master/point/form/{master_point_id?}', [MasterMasterPointController::class, 'index'])->name('spa.master-point-form.index');

    // package
    Route::get('master/package', [MasterPackageController::class, 'index'])->name('spa.master-package.index');
    Route::get('master/package/form/{package_id?}', [MasterPackageController::class, 'index'])->name('spa.master-package-form.index');


    // payment-method
    Route::get('master/payment-method', [MasterPaymentMethodController::class, 'index'])->name('spa.master-payment-method.index');
    Route::get('master/payment-method/form/{payment_method_id?}', [MasterPaymentMethodController::class, 'index'])->name('spa.master-payment-method-form.index');

    // shiping-method
    Route::get('master/shipping-method/logistic', [MasterLogisticController::class, 'index'])->name('spa.master-shipping-method.index');
    Route::get('master/shipping-method/offline/logistic', [MasterLogisticController::class, 'index'])->name('spa.master-shipping-method-offline.index');

    // variant
    Route::get('master/variant', [MasterVariantController::class, 'index'])->name('spa.master-variant.index');
    Route::get('master/variant/form/{payment_method_id?}', [MasterVariantController::class, 'index'])->name('spa.master-variant-form.index');

    // voucher
    Route::get('master/voucher', [MasterVoucherController::class, 'index'])->name('spa.master-voucher.index');
    Route::get('master/voucher/form/{payment_method_id?}', [MasterVoucherController::class, 'index'])->name('spa.master-voucher-form.index');

    // payment term
    Route::get('master/payment-term', [MasterPaymentTermController::class, 'index'])->name('spa.master-payment-term.index');
    Route::get('master/payment-term/form/{payment_method_id?}', [MasterPaymentTermController::class, 'index'])->name('spa.master-payment-term-form.index');

    // master tax
    Route::get('master/master-tax', [MasterMasterTaxController::class, 'index'])->name('spa.master-master-tax.index');
    Route::get('master/master-tax/form/{master_tax_id?}', [MasterMasterTaxController::class, 'index'])->name('spa.master-master-tax-form.index');

    // sku
    Route::get('master/sku', [MasterSkuController::class, 'index'])->name('spa.master-sku.index');
    Route::get('master/sku/form/{sku_id?}', [MasterSkuController::class, 'index'])->name('spa.master-sku-form.index');

    // warehouse
    Route::get('master/warehouse', [MasterSkuController::class, 'index'])->name('spa.master-warehouse.index');
    Route::get('master/warehouse/form/{warehouse_id?}', [MasterSkuController::class, 'index'])->name('spa.master-warehouse-form.index');

    // master discount
    Route::get('master/master-discount', [MasterMasterDiscountController::class, 'index'])->name('spa.master-master-discount.index');
    Route::get('master/master-discount/form/{master_discount_id?}', [MasterMasterDiscountController::class, 'index'])->name('spa.master-master-discount-form.index');

    // type case
    Route::get('master/type-case', [MasterTypeCaseController::class, 'index'])->name('spa.master-type-case.index');
    Route::get('master/type-case/form/{type_case_id?}', [MasterTypeCaseController::class, 'index'])->name('spa.master-type-case-form.index');

    // category type case
    Route::get('master/category-type-case', [MasterCategoryCaseController::class, 'index'])->name('spa.master-category-type-case.index');
    Route::get('master/category-type-case/form/{category_type_case_id?}', [MasterCategoryCaseController::class, 'index'])->name('spa.master-category-type-case-form.index');

    // status case
    Route::get('master/status-case', [MasterStatusCaseController::class, 'index'])->name('spa.master-status-case.index');
    Route::get('master/status-case/form/{status_case_id?}', [MasterStatusCaseController::class, 'index'])->name('spa.master-status-case-form.index');

    // priority case
    Route::get('master/priority-case', [MasterPriorityCaseController::class, 'index'])->name('spa.master-priority-case.index');
    Route::get('master/priority-case/form/{priority_case_id?}', [MasterPriorityCaseController::class, 'index'])->name('spa.master-priority-case-form.index');

    // source case
    Route::get('master/source-case', [MasterSourceCaseController::class, 'index'])->name('spa.master-source-case.index');
    Route::get('master/source-case/form/{source_case_id?}', [MasterSourceCaseController::class, 'index'])->name('spa.master-source-case-form.index');

    // level 
    Route::get('master/level', [MasterSourceCaseController::class, 'index'])->name('spa.master-level.index');
    Route::get('master/level/form/{source_case_id?}', [MasterSourceCaseController::class, 'index'])->name('spa.master-level-form.index');

    // pengemasan 
    Route::get('master/pengemasan', [ProductAdditionalController::class, 'index'])->name('spa.master-pengemasan.index');
    Route::get('master/pengemasan/form/{product_additional_id?}', [ProductAdditionalController::class, 'index'])->name('spa.master-pengemasan-form.index');

    // perlengkapan 
    Route::get('master/perlengkapan', [ProductAdditionalController::class, 'index'])->name('spa.master-perlengkapan.index');
    Route::get('master/perlengkapan/form/{product_additional_id?}', [ProductAdditionalController::class, 'index'])->name('spa.master-perlengkapan-form.index');

    // sales-channel 
    Route::get('master/sales-channel', [SalesChannelController::class, 'index'])->name('spa.master-sales-channel.index');
    Route::get('master/sales-channel/form/{sales_channel_id?}', [SalesChannelController::class, 'index'])->name('spa.master-sales-channel-form.index');

    // ongkir 
    Route::get('master/ongkir', [MasterOngkirController::class, 'index'])->name('spa.master-ongkir.index');
    Route::get('master/ongkir/form/{sales_channel_id?}', [MasterOngkirController::class, 'index'])->name('spa.master-ongkir-form.index');

    // product management 
    Route::prefix('product-management')->group(function () {
        // product master
        Route::get('product', [ProductMasterController::class, 'index'])->name('spa.product-master.index');
        Route::get('product/form/{product_id?}', [ProductMasterController::class, 'index'])->name('spa.product-master-form.index');
        Route::get('product/stock-allocation/{product_id?}', [ProductMasterController::class, 'index'])->name('spa.product-master-stock.index');

        // product variant
        Route::get('product-variant', [ProductManagementProductVariantController::class, 'index'])->name('spa.product-variant.index');
        Route::get('product-variant/form/{product_id?}', [ProductManagementProductVariantController::class, 'index'])->name('spa.product-variant-form.index');

        // product variant
        Route::get('margin-bottom', [ProductMarginBottom::class, 'index'])->name('spa.margin-bottom.index');
        Route::get('margin-bottom/form/{product_id?}', [ProductMarginBottom::class, 'index'])->name('spa.margin-bottom-form.index');

        // product comment & rating
        Route::get('comment-rating', [ProductCommentRatingController::class, 'index'])->name('spa.comment-rating.index');

        // import product
        Route::get('import-product', [ImportController::class, 'index'])->name('spa.import-product.index');

        // convert product
        Route::get('convert-product', [ConvertController::class, 'index'])->name('spa.convert-product.index');
        Route::get('convert-product/detail/{convert_id}', [ConvertController::class, 'index'])->name('spa.convert-product-detail.index');
    });

    // setting 
    Route::prefix('setting')->group(function () {
        // template notification
        Route::get('notification-template', [SettingNotificationTemplateController::class, 'index'])->name('spa.setting-notification-template.index');
        Route::get('notification-template/form/{template_id?}', [SettingNotificationTemplateController::class, 'index'])->name('spa.setting-notification-template.form');
    });

    // purchase order
    Route::get('purchase/purchase-order', [PurchaseOrderController::class, 'index'])->name('spa.purchase-purchase-order.index');
    Route::get('purchase/purchase-order/form/{purchase_order_id?}', [PurchaseOrderController::class, 'index'])->name('spa.purchase-purchase-order-form.index');
    Route::get('purchase/purchase-order/detail/{purchase_order_id?}', [PurchaseOrderController::class, 'index'])->name('spa.purchase-purchase-order-form.detail');
    Route::get('purchase/purchase-order/print/{purchase_order_id?}', [PurchaseOrderController::class, 'exportPdf'])->name('spa.purchase-purchase-order-export.index');

    // purchase requisition
    Route::get('purchase/purchase-requisition', [PurchaseRequisitionController::class, 'index'])->name('spa.purchase-purchase-requisition.index');
    Route::get('purchase/purchase-requisition/form/{purchase_requisition_id?}', [PurchaseRequisitionController::class, 'index'])->name('spa.purchase-purchase-requisition-form.index');
    Route::get('purchase/purchase-requisition/detail/{purchase_requisition_id?}', [PurchaseRequisitionController::class, 'index'])->name('spa.purchase-purchase-requisition-form.detail');
    Route::get('purchase/purchase-requisition/print/{purchase_requisition_id}', [PurchaseRequisitionController::class, 'exportPdf'])->name('spa.purchase-purchase-requisition-export.index');

    // stock movemant
    Route::get('stock-movement', [StockMovementController::class, 'index'])->name('spa.stock-movement.index');

    // transaction
    Route::get('transaction/waiting-payment', [SpaTransactionController::class, 'index'])->name('spa.transaction.waiting-payment');
    Route::get('transaction/waiting-confirmation', [SpaTransactionController::class, 'index'])->name('spa.transaction.waiting-confirmation');
    Route::get('transaction/confirm-payment', [SpaTransactionController::class, 'index'])->name('spa.transaction.confirm-payment');
    Route::get('transaction/on-process', [SpaTransactionController::class, 'index'])->name('spa.transaction.on-process');
    Route::get('transaction/ready-to-ship', [SpaTransactionController::class, 'index'])->name('spa.transaction.ready-to-ship');
    Route::get('transaction/on-delivery', [SpaTransactionController::class, 'index'])->name('spa.transaction.on-delivery');
    Route::get('transaction/delivered', [SpaTransactionController::class, 'index'])->name('spa.transaction.delivered');
    Route::get('transaction/cancelled', [SpaTransactionController::class, 'index'])->name('spa.transaction.cancelled');
    Route::get('transaction/new-order', [SpaTransactionController::class, 'index'])->name('spa.transaction.new-order');

    // agent
    Route::get('transaction/agent/waiting-payment', [SpaTransactionController::class, 'index'])->name('spa.transaction.agent.waiting-payment');
    Route::get('transaction/agent/waiting-confirmation', [SpaTransactionController::class, 'index'])->name('spa.transaction.agent.waiting-confirmation');
    Route::get('transaction/agent/confirm-payment', [SpaTransactionController::class, 'index'])->name('spa.transaction.agent.confirm-payment');
    Route::get('transaction/agent/on-process', [SpaTransactionController::class, 'index'])->name('spa.transaction.agent.on-process');
    Route::get('transaction/agent/ready-to-ship', [SpaTransactionController::class, 'index'])->name('spa.transaction.agent.ready-to-ship');
    Route::get('transaction/agent/on-delivery', [SpaTransactionController::class, 'index'])->name('spa.transaction.agent.on-delivery');
    Route::get('transaction/agent/delivered', [SpaTransactionController::class, 'index'])->name('spa.transaction.agent.delivered');
    Route::get('transaction/agent/cancelled', [SpaTransactionController::class, 'index'])->name('spa.transaction.agent.cancelled');
    Route::get('transaction/agent/{transaction_id}', [SpaTransactionController::class, 'index'])->name('spa.transaction.agent.detail');

    // transaction agent2
    Route::get('transaction/agent', [PurchaseRequisitionController::class, 'index'])->name('spa.transaction-agent.index');
    // Route::get('transaction/agent/{transaction_id}', [PurchaseRequisitionController::class, 'index'])->name('spa.transaction-agent.detail');
});
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect('login/dashboard');
});
Route::get('logout-user', function () {
    Artisan::call('cache:clear');
    Artisan::call('view:clear');
    Artisan::call('route:clear');
})->name('logout.user');

Route::get('/debug-sentry', function () {
    throw new Exception('My first Sentry error!');
});

// callback
Route::prefix('callback')->group(function () {
    Route::post('popaket-tracking', [PopaketCallback::class, 'getCallbackTracking'])->name('callback.popaket.tracking');
    Route::post('popaket-resi', [PopaketCallback::class, 'getCallbackAwb'])->name('callback.popaket.resi');
});
// callback
Route::prefix('product')->group(function () {
    Route::get('import', ProductSkuImport::class)->name('product.import');
    Route::get('convert', ListConvert::class)->name('product.convert.list');
    Route::get('convert/detail/{id}', ProductSKUConvert::class)->name('product.convert');
});

Route::get('login/dashboard', [LoginController::class, 'index'])->name('dashboard.login');
Route::get('agent/register', [RegisterController::class, 'index'])->name('dashboard.register');

Route::post('login', [AuthController::class, 'login'])->name('admin.login');
Route::post('forgot-password', [AuthController::class, 'forgotPassword'])->name('admin.forgot.password');
Route::get('/auth/reset-password/{token?}', PasswordReset::class)->name('reset.password');
Route::get('/transaction-list/report', ReportController::class)->name('transaction.report');
Route::get('/invoice/{transaction_id}', [InvoiceController::class, 'printInvoice'])->name('invoice.print');
Route::get('/invoice/{transaction_id}', [InvoiceController::class, 'printInvoiceTiktok'])->name('invoice.print.tiktok');
Route::get('/label/{transaction_id}', [InvoiceController::class, 'printLabelTiktok'])->name('label.print.tiktok');
Route::get('/invoice/agent/{transaction_id}', [InvoiceController::class, 'printInvoiceAgent'])->name('invoice.print.agent');
Route::get('/print/{transaction_id}', [InvoiceController::class, 'printPdf'])->name('invoice.pdf');
Route::get('/bulk/{transaction_id}', [InvoiceController::class, 'printBulkStructInvoice'])->name('invoice.bulk.pdf');
Route::get('/invoice/struct/{transaction_id}', [InvoiceController::class, 'printStructInvoice'])->name('invoice.struct.print');
Route::get('/invoice-agent/struct/{transaction_id}', [InvoiceController::class, 'printStructInvoice'])->name('invoice.struct.print.agent');
Route::group(['middleware' => ['auth:sanctum', 'verified', 'user.authorization']], function () {
    // Crud Generator Route
    Route::get('/crud-generator', CrudGenerator::class)->name('crud.generator');

    Route::prefix('/site-management')->group(function () {
        Route::get('/permission', Permission::class)->name('permission');
        Route::get('/permission-role/{role_id}', PermissionRole::class)->name('permission.role');
        Route::get('/role', Role::class)->name('role');

        Route::get('/menu', Menu::class)->name('menu');
    });

    // App Route
    // Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard-agent', DashboardAgent::class)->name('dashboard.agent');
    Route::get('/dashboard-lead', DashboardLead::class)->name('dashboard.lead');

    // Master data
    Route::prefix('/master')->group(function () {
        // Route::get('/brand', BrandController::class)->name('brand');
        Route::get('/company', CompanyController::class)->name('company');
        // Route::get('/category', CategoryController::class)->name('category');
        // Route::get('/variant', VariantController::class)->name('variant');
        Route::get('/detail-variant', DetailVariantController::class)->name('detail-variant');
        Route::get('/product', ProductController::class)->name('product');
        // Route::get('/voucher', VoucherController::class)->name('voucher');
        // Route::get('/package', PackageController::class)->name('package');
        // Route::get('/payment-method', PaymentMethodController::class)->name('payment-method');
        // Route::get('/banner', BannerController::class)->name('banner');
        // Route::get('/level', LevelController::class)->name('level');
        Route::get('/business-entity', BusinessEntityController::class)->name('business-entity');
        // Route::get('/shipping-method', ShippingMethodController::class)->name('shipping-method');
        Route::get('/logistic', LogisticController::class)->name('logistic');
        Route::get('/logistic-rate-service', LogisticRateController::class)->name('logistic.rate.service');
        // Route::get('/point', MasterPointController::class)->name('master-point');
        Route::get('/lead', LeadMasterController::class)->name('lead-master');
        // Route::get('/payment-term', PaymentTermController::class)->name('payment-term');
        // Route::get('/tax', MasterTaxController::class)->name('tax');
        // Route::get('/discount', MasterDiscountController::class)->name('discount');
        // Route::get('/sku-master', SkuMasterController::class)->name('sku-master');
        Route::get('/refund', RefundMasterController::class)->name('refund-master');
        Route::get('/retur', ReturMasterController::class)->name('retur-master');
        Route::get('/sales-return', SalesReturnController::class)->name('sr-master');
        //cases
        // Route::get('/type-case', TypeCaseController::class)->name('type-case');
        // Route::get('/category-case', CategoryCaseController::class)->name('category-case');
        // Route::get('/status-case', StatusCaseController::class)->name('status-case');
        // Route::get('/priority-case', PriorityCaseController::class)->name('priority-case');
        // Route::get('/source-case', SourceCaseController::class)->name('source-case');
        Route::get('/case', CaseController::class)->name('cases');
    });

    Route::get('/order-lead', OrderLeadController::class)->name('order-lead');
    Route::get('/order-manual', OrderManualController::class)->name('order-manual');
    // Route::get('/warehouse', WarehouseController::class)->name('warehouse');

    Route::get('/shipping-voucher', ShippingVoucher::class)->name('shipping-voucher');

    Route::prefix('/transactions')->group(function () {
        Route::group([], function () {
            Route::get('/lists', TransactionController::class)->name('transaction.list');
            Route::get('/report', TransactionReportController::class)->name('transaction.report.data');
            // role finance
            Route::get('/waiting-confirm', TransactionController::class)->name('transaction.waiting-confirm');
            Route::get('/confirm-payment', TransactionController::class)->name('transaction.confirm-payment');
            // role warehouse
            Route::get('/process', TransactionController::class)->name('transaction.process');
            Route::get('/delivery', TransactionController::class)->name('transaction.delivery');
            Route::get('/delivered', TransactionController::class)->name('transaction.delivered');
            Route::get('/on-process', TransactionController::class)->name('transaction.on-process');
            Route::get('/history', TransactionController::class)->name('transaction.history');
            Route::get('/siap-dikirim', TransactionController::class)->name('transaction.siap-dikirim');
            // role admin
            Route::get('/waiting-payment', TransactionController::class)->name('transaction.waiting-payment');
            Route::get('/approve-finance', TransactionController::class)->name('transaction.approve-finance');
            Route::get('/admin-process', TransactionController::class)->name('transaction.admin-process');
        });

        // agent proccess
        Route::prefix('/agent-proccess')->group(function () {
            Route::get('/lists', TransactionController::class)->name('transaction.agent-proccess.list');
            // role finance
            Route::get('/waiting-confirm', TransactionController::class)->name('transaction.agent-proccess.waiting-confirm');
            Route::get('/confirm-payment', TransactionController::class)->name('transaction.agent-proccess.confirm-payment');
            // role warehouse
            Route::get('/process', TransactionController::class)->name('transaction.agent-proccess.process');
            Route::get('/delivery', TransactionController::class)->name('transaction.agent-proccess.delivery');
            Route::get('/delivered', TransactionController::class)->name('transaction.agent-proccess.delivered');
            Route::get('/on-process', TransactionController::class)->name('transaction.agent-proccess.on-process');
            Route::get('/history', TransactionController::class)->name('transaction.agent-proccess.history');
            Route::get('/siap-dikirim', TransactionController::class)->name('transaction.agent-proccess.siap-dikirim');
            // role admin
            Route::get('/waiting-payment', TransactionController::class)->name('transaction.agent-proccess.waiting-payment');
            Route::get('/approve-finance', TransactionController::class)->name('transaction.agent-proccess.approve-finance');
            Route::get('/admin-process', TransactionController::class)->name('transaction.agent-proccess.admin-process');
        });


        Route::prefix('/agent')->group(function () {
            // agent role
            Route::get('/waiting-agent', TransactionController::class)->name('transaction.waiting-agent');
            Route::get('/approve-agent', TransactionController::class)->name('transaction.approve-agent');
            Route::get('/proccess-agent', TransactionController::class)->name('transaction.agent-process');
            Route::get('/history-agent', TransactionController::class)->name('transaction.agent-history');
        });
    });

    Route::prefix('/product')->group(function () {
        Route::get('/variant', ProductVariantController::class)->name('product-variant');
        Route::get('/price', PriceController::class)->name('price');
        Route::get('/agent', ProductAgent::class)->name('product-agent');
        Route::get('/comment-rating', CommentRatingController::class)->name('comment-rating');
    });

    Route::prefix('/notification')->group(function () {
        Route::get('/notification', NotificationController::class)->name('notification');
        Route::get('/notification/read-all', [NotificationController::class, 'readAllNotif'])->name('notification.read-all');
    });
    // Route::get('/profile', [ContactController::class, 'profile'])->name('profile');
    Route::prefix('/agent-management')->group(function () {
        Route::get('/all', AgentDetailController::class)->name('agent.all');
        Route::get('/domain', DomainController::class)->name('domain.all');
    });

    // role agent
    Route::get('/cart', CartController::class)->name('cart');
    Route::get('/transaction/{transaction_id?}', TransactionSuccess::class)->name('transaction.detail');
    Route::get('/order', OrderController::class)->name('order');
    Route::get('/contact', ContactController::class)->name('contact');

    Route::get('/user-management', UserDataController::class)->name('customer-management');

    Route::group(['prefix' => 'setting'], function () {
        // Route::get('/notification-template', NotificationTemplateController::class)->name('notification.template');
        Route::get('/general-setting', GeneralSettingController::class)->name('general.setting');
        Route::get('/setting-description', SettingDescriptionController::class)->name('setting-description');
        Route::get('/user', User::class)->name('user');
    });

    Route::get('/inventory', InventoryController::class)->name('inventory');

    Route::get('/margin-bottom', MarginBottomController::class)->name('margin-bottom');

    Route::get('/faq-submenu', FaqSubmenuController::class)->name('faq-submenu');
    Route::get('/faq-category', FaqCategoryController::class)->name('faq-category');
    Route::get('/faq-content', FaqContentController::class)->name('faq-content');
    file: ///519bba57-ec11-4ca8-ade5-50783b8216d3

    Route::get('/print/sj/{uid_lead}', [PrintController::class, 'printSj'])->name('print.sj');
    Route::get('/print/so/{uid_lead}', [PrintController::class, 'printSo'])->name('print.so');
    Route::get('/print/sr/{uid_retur}', [PrintController::class, 'printSr'])->name('print.sr');
    Route::get('/print/si/{uid_retur}', [PrintController::class, 'printSi'])->name('print.si');
    Route::get('/print/spr/{uid_inventory}', [PrintController::class, 'printSpr'])->name('print.spr');
    // Route::get('/print/invoice', [PrintController::class, 'printSr'])->name('print.invoice');
    Route::get('/print/invoice/{uid_retur}', [PrintController::class, 'printInvoice'])->name('print.invoice');

    Route::get('/check_duedate', [GracePeriodController::class, 'check_duedate'])->name('check_duedate');
});

Route::group(['prefix' => 'webhook'], function () {
    Route::post('/run-artisan', [WebhookController::class, 'runScript'])->name('webhook.run.artisan');
    Route::post('/assign-to-warehouse', [WebhookController::class, 'assignToWarehouse'])->name('webhook.assigntowarehouse');
});

Route::get('/logout', function () {
    return redirect('/login/dashboard');
});
