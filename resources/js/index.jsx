import React, { lazy, Suspense } from "react"
import "moment/locale/id"
import { ThemeSwitcherProvider } from "react-css-theme-switcher"
import ReactDOM from "react-dom/client"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import LoadingFallback from "./components/LoadingFallback"
import Login from "./Pages/Auth/Login"
import Register from "./Pages/Auth/Register"
import CaseManual from "./Pages/CaseManual/CaseManual"
import CaseManualDetail from "./Pages/CaseManual/CaseManualDetail"
import CaseManualForm from "./Pages/CaseManual/CaseManualForm"
import DashboardGinee from "./Pages/Genie/DashboardGinee"
import GpCustomer from "./Pages/GpCustomer/GpCustomer"
import GpSubmissionList from "./Pages/GpSubmission/GpSubmissionList"
import GpSubmissionListDetail from "./Pages/GpSubmission/GpSubmissionListDetail"
import InventoryProductReturnDetail from "./Pages/Inventory/InventoryProductReturnDetail"
import ProductTransferForm from "./Pages/Inventory/ProductTransfer/ProductTransferForm"
import BannerList from "./Pages/Master/Banner/BannerList"
import FormBanner from "./Pages/Master/Banner/FormBanner"
import BrandList from "./Pages/Master/Brand/BrandList"
import FormBrand from "./Pages/Master/Brand/FormBrand"
import CategoryList from "./Pages/Master/Category/CategoryList"
import FormCategory from "./Pages/Master/Category/FormCategory"
import CategoryTypeCaseForm from "./Pages/Master/CategoryTypeCase/CategoryTypeCaseForm"
import CategoryTypeCaseList from "./Pages/Master/CategoryTypeCase/CategoryTypeCaseList"
import CompanyAccountForm from "./Pages/Master/CompanyAccount/CompanyAccountForm"
import CompanyAccountList from "./Pages/Master/CompanyAccount/CompanyAccountList"
import LevelForm from "./Pages/Master/Level/LevelForm"
import LevelList from "./Pages/Master/Level/LevelList"
import LogisticList from "./Pages/Master/Logistic/LogisticList"
import MasterDiscountForm from "./Pages/Master/MasterDiscount/MasterDiscountForm"
import MasterDiscountList from "./Pages/Master/MasterDiscount/MasterDiscountList"
import MasterTaxForm from "./Pages/Master/MasterTax/MasterTaxForm"
import MasterTaxList from "./Pages/Master/MasterTax/MasterTaxList"
import OfflineLogisticList from "./Pages/Master/OfflineLogistic/OfflineLogisticList"
import PackageForm from "./Pages/Master/Package/PackageForm"
import PackageList from "./Pages/Master/Package/PackageList"
import FormPaymentMethod from "./Pages/Master/PaymentMethod/FormPaymentMethod"
import PaymentMethodList from "./Pages/Master/PaymentMethod/PaymentMethodList"
import PaymentTermForm from "./Pages/Master/PaymentTerm/PaymentTermForm"
import PaymentTermList from "./Pages/Master/PaymentTerm/PaymentTermList"
import PointForm from "./Pages/Master/Point/PointForm"
import PointList from "./Pages/Master/Point/PointList"
import PriorityCaseForm from "./Pages/Master/PriorityCase/PriorityCaseForm"
import PriorityCaseList from "./Pages/Master/PriorityCase/PriorityCaseList"
import ProductAdditionalForm from "./Pages/Master/ProductAdditional/ProductAdditionalForm"
import ProductAdditionalList from "./Pages/Master/ProductAdditional/ProductAdditionalList"
import SalesChannelForm from "./Pages/Master/SalesChannel/SalesChannelForm"
import SalesChannelList from "./Pages/Master/SalesChannel/SalesChannelList"
import SkuForm from "./Pages/Master/Sku/SkuForm"
import SkuList from "./Pages/Master/Sku/SkuList"
import TicketList from "./Pages/Ticket/TicketList"
import TiktokList from "./Pages/Tiktok/TiktokList"
import MappingProductList from "./Pages/MappingProduct/MappingProductList"
import MappingSettlementList from "./Pages/MappingSettlement/MappingSettlementList"
import MappingOrderList from "./Pages/MappingOrder/MappingOrderList"
import MappingWarehouseList from "./Pages/MappingWarehouse/MappingWarehouseList"
import ProfileList from "./Pages/Profile/ProfileList"
import SourceCaseForm from "./Pages/Master/SourceCase/SourceCaseForm"
import SourceCaseList from "./Pages/Master/SourceCase/SourceCaseList"
import StatusCaseForm from "./Pages/Master/StatusCase/StatusCaseForm"
import StatusCaseList from "./Pages/Master/StatusCase/StatusCaseList"
import TypeCaseForm from "./Pages/Master/TypeCase/TypeCaseForm"
import TypeCaseList from "./Pages/Master/TypeCase/TypeCaseList"
import VariantForm from "./Pages/Master/Variant/VariantForm"
import VariantList from "./Pages/Master/Variant/VariantList"
import FormVoucher from "./Pages/Master/Voucher/FormVoucher"
import VoucherList from "./Pages/Master/Voucher/VoucherList"
import WarehouseForm from "./Pages/Master/Warehouse/WarehouseForm"
import MasterWarehouseList from "./Pages/Master/Warehouse/WarehouseList"
import OrderFreebiesDetail from "./Pages/OrderFreebies/OrderFreebiesDetail"
import OrderFreebiesForm from "./Pages/OrderFreebies/OrderFreebiesForm"
import OrderFreebiesList from "./Pages/OrderFreebies/OrderFreebiesList"
import ConvertProductDetailList from "./Pages/ProductManagement/ConvertProduct/ConvertProductDetailList"
import ConvertProductList from "./Pages/ProductManagement/ConvertProduct/ConvertProductList"
import ImportProductConvertList from "./Pages/ProductManagement/ImportProductConvert/ImportProductConvertList"
import ProductCommentRatingList from "./Pages/ProductManagement/ProductCommentRating/ProductCommentRatingList"
import ProductMarginBottomForm from "./Pages/ProductManagement/ProductMarginBottom/ProductMarginBottomForm"
import ProductMarginBottomList from "./Pages/ProductManagement/ProductMarginBottom/ProductMarginBottomList"
import ProductMasterForm from "./Pages/ProductManagement/ProductMaster/ProductMasterForm"
import ProductMasterList from "./Pages/ProductManagement/ProductMaster/ProductMasterList"
import ProductStockAllocation from "./Pages/ProductManagement/ProductMaster/ProductStockAllocation"
import ProductVariantForm from "./Pages/ProductManagement/ProductVariant/ProductVariantForm"
import ProductVariantList from "./Pages/ProductManagement/ProductVariant/ProductVariantList"
import PurchaseOrder from "./Pages/Purchase/PurchaseOrder"
import PurchaseOrderDetail from "./Pages/Purchase/PurchaseOrderDetail"
import PurchaseOrderForm from "./Pages/Purchase/PurchaseOrderForm"
import PurchaseRequisition from "./Pages/Purchase/PurchaseRequisition"
import PurchaseRequisitionDetail from "./Pages/Purchase/PurchaseRequisitionDetail"
import PurchaseRequisitionForm from "./Pages/Purchase/PurchaseRequisitionForm"
import StockMovement from "./Pages/StockMovement/StockMovement"
import NotificationTemplateForm from "./Pages/Setting/NotificationTemplate/NotificationTemplateForm"
import NotificationTemplateList from "./Pages/Setting/NotificationTemplate/NotificationTemplateList"
import TransactionList from "./Pages/Transaction/Transaction/TransactionList"
import TransactionDetail from "./Pages/Transaction/Transaction/TransactionDetail"
import OrdeSubmitList from "./Pages/OrderSubmit/OrdeSubmitList"
import OrdeSubmitListDetail from "./Pages/OrderSubmit/OrdeSubmitListDetail"
import TransactionDetailNewOrder from "./Pages/Transaction/Transaction/TransactionDetailNewOrder"
import OngkirList from "./Pages/Master/MasterOngkir/OngkirList"
import OngkirForm from "./Pages/Master/MasterOngkir/OngkirForm"
import ProspectList from "./Pages/Prospect/ProspectList"
import ProspectDetail from "./Pages/Prospect/ProspectDetail"
import ProspectForm from "./Pages/Prospect/ProspectForm"
import OrderOnlineList from "./Pages/OrderOnline/OrderOnlineList"
import OrderOnlineForm from "./Pages/OrderOnline/OrderOnlineForm"
// import AgentList from "./Pages/AgentManagement/AgentList";
const AgentList = lazy(() => import("./Pages/AgentManagement/AgentList"))
// import DomainAgent from "./Pages/AgentManagement/DomainAgent";
const DomainAgent = lazy(() => import("./Pages/AgentManagement/DomainAgent"))
// import CaseRefund from "./Pages/CaseRefund/CaseRefund";
const CaseRefund = lazy(() => import("./Pages/CaseRefund/CaseRefund"))
// import CaseRefundDetail from "./Pages/CaseRefund/CaseRefundDetail";
const CaseRefundDetail = lazy(() =>
  import("./Pages/CaseRefund/CaseRefundDetail")
)
// import CaseReturn from "./Pages/CaseReturn/CaseReturn";
const CaseReturn = lazy(() => import("./Pages/CaseReturn/CaseReturn"))
// import CaseReturnDetail from "./Pages/CaseReturn/CaseReturnDetail";
const CaseReturnDetail = lazy(() =>
  import("./Pages/CaseReturn/CaseReturnDetail")
)
// import CartList from "./Pages/CheckoutAgent/CartList";
const CartList = lazy(() => import("./Pages/CheckoutAgent/CartList"))
// import ContactList from "./Pages/Contact/ContactList";
const ContactList = lazy(() => import("./Pages/Contact/ContactList"))
// import DetailContact from "./Pages/Contact/DetailContact";
const DetailContact = lazy(() => import("./Pages/Contact/DetailContact"))
// import FormContact from "./Pages/Contact/FormContact";
const FormContact = lazy(() => import("./Pages/Contact/FormContact"))
// import Dashboard from "./Pages/Dashboard/Dashboard";
const Dashboard = lazy(() => import("./Pages/Dashboard/Dashboard"))
// import OrderList from "./Pages/Genie/OrderList";
const OrderList = lazy(() => import("./Pages/Genie/OrderList"))
// import OrderListDetail from "./Pages/Genie/OrderListDetail";
const OrderListDetail = lazy(() => import("./Pages/Genie/OrderListDetail"))
// import Inventory from "./Pages/Inventory/Inventory";
const Inventory = lazy(() => import("./Pages/Inventory/Inventory"))
// import InventoryAddProducts from "./Pages/Inventory/InventoryAddProducts";
const InventoryAddProducts = lazy(() =>
  import("./Pages/Inventory/InventoryAddProducts")
)
// import InventoryProductReturn from "./Pages/Inventory/InventoryProductReturn";
const InventoryProductReturn = lazy(() =>
  import("./Pages/Inventory/InventoryProductReturn")
)
// import InventoryProductReturnForm from "./Pages/Inventory/InventoryProductReturnForm";
const InventoryProductReturnForm = lazy(() =>
  import("./Pages/Inventory/InventoryProductReturnForm")
)
// import InventoryProductStock from "./Pages/Inventory/InventoryProductStock";
const InventoryProductStock = lazy(() =>
  import("./Pages/Inventory/InventoryProductStock")
)
// import LeadMasterDetail from "./Pages/LeadMaster/LeadMasterDetail";
const LeadMasterDetail = lazy(() =>
  import("./Pages/LeadMaster/LeadMasterDetail")
)

const TicketDetail = lazy(() => import("./Pages/Ticket/TicketDetail"))

const MappingProductDetail = lazy(() =>
  import("./Pages/MappingProduct/MappingProductDetail")
)
const MappingWarehouseDetail = lazy(() =>
  import("./Pages/MappingWarehouse/MappingWarehouseDetail")
)
const MappingSettlementDetail = lazy(() =>
  import("./Pages/MappingSettlement/MappingSettlementDetail")
)
const MappingOrderDetail = lazy(() =>
  import("./Pages/MappingOrder/MappingOrderDetail")
)
// import LeadMasterForm from "./Pages/LeadMaster/LeadMasterForm";
const LeadMasterForm = lazy(() => import("./Pages/LeadMaster/LeadMasterForm"))
// import LeadMasterList from "./Pages/LeadMaster/LeadMasterList";
const LeadMasterList = lazy(() => import("./Pages/LeadMaster/LeadMasterList"))
// import MenuPages from "./Pages/Menu/Menu";
const MenuPages = lazy(() => import("./Pages/Menu/Menu"))
// import OrderLeadDetail from "./Pages/OrderLead/OrderLeadDetail";
const OrderLeadDetail = lazy(() => import("./Pages/OrderLead/OrderLeadDetail"))
// import OrderLeadList from "./Pages/OrderLead/OrderLeadList";
const OrderLeadList = lazy(() => import("./Pages/OrderLead/OrderLeadList"))
// import OrderManualLeadDetail from "./Pages/OrderManual/OrderManualLeadDetail";
const OrderManualLeadDetail = lazy(() =>
  import("./Pages/OrderManual/OrderManualLeadDetail")
)
// import OrderManualLeadForm from "./Pages/OrderManual/OrderManualLeadForm";
const OrderManualLeadForm = lazy(() =>
  import("./Pages/OrderManual/OrderManualLeadForm")
)
// import OrderManualLeadList from "./Pages/OrderManual/OrderManualLeadList";
const OrderManualLeadList = lazy(() =>
  import("./Pages/OrderManual/OrderManualLeadList")
)
// import SalesReturnDetail from "./Pages/SalesReturn/SalesReturnDetail";
const SalesReturnDetail = lazy(() =>
  import("./Pages/SalesReturn/SalesReturnDetail")
)
// import SalesReturnForm from "./Pages/SalesReturn/SalesReturnForm";
const SalesReturnForm = lazy(() =>
  import("./Pages/SalesReturn/SalesReturnForm")
)
// import SalesReturnList from "./Pages/SalesReturn/SalesReturnList";
const SalesReturnList = lazy(() =>
  import("./Pages/SalesReturn/SalesReturnList")
)
// import AgentWaitingList from "./Pages/TransAgent/AgentWaitingList";
const AgentWaitingList = lazy(() =>
  import("./Pages/TransAgent/AgentWaitingList")
)
// import AllTransList from "./Pages/TransAgent/AllTransList";
const AllTransList = lazy(() => import("./Pages/TransAgent/AllTransList"))
// import ConfirmationList from "./Pages/TransAgent/ConfirmationList";
const ConfirmationList = lazy(() =>
  import("./Pages/TransAgent/ConfirmationList")
)
// import DeliveryList from "./Pages/TransAgent/DeliveryList";
const DeliveryList = lazy(() => import("./Pages/TransAgent/DeliveryList"))
// import DetailTransAgent from "./Pages/TransAgent/DetailTransAgent";
const DetailTransAgent = lazy(() =>
  import("./Pages/TransAgent/DetailTransAgent")
)
// import HistoryList from "./Pages/TransAgent/HistoryList";
const HistoryList = lazy(() => import("./Pages/TransAgent/HistoryList"))
// import NewTransactionList from "./Pages/TransAgent/NewTransactionList";
const NewTransactionList = lazy(() =>
  import("./Pages/TransAgent/NewTransactionList")
)
// import OrderAcceptedList from "./Pages/TransAgent/OrderAcceptedList";
const OrderAcceptedList = lazy(() =>
  import("./Pages/TransAgent/OrderAcceptedList")
)
// import ReadyProductList from "./Pages/TransAgent/ReadyProductList";
const ReadyProductList = lazy(() =>
  import("./Pages/TransAgent/ReadyProductList")
)
// import WarehouseList from "./Pages/TransAgent/WarehouseList";
const WarehouseList = lazy(() => import("./Pages/TransAgent/WarehouseList"))

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* auth */}
            <Route path="/" element={<ContactList />} />
            <Route path="/login/dashboard" element={<Login />} />
            <Route path="/agent/register" element={<Register />} />

            {/* start contact */}
            <Route path="/contact/list" element={<ContactList />} />
            <Route path="/contact/create" element={<FormContact />} />
            <Route
              path="/contact/detail/:user_id"
              element={<DetailContact />}
            />
            <Route path="/contact/update/:user_id" element={<FormContact />} />
            {/* end contact */}
            {/* start Trans Agent */}
            <Route path="/trans-agent/all-trans" element={<AllTransList />} />
            <Route
              path="/trans-agent/waiting-payment"
              element={<AgentWaitingList />}
            />
            <Route
              path="/trans-agent/confirmation"
              element={<ConfirmationList />}
            />
            <Route
              path="/trans-agent/new-transaction"
              element={<NewTransactionList />}
            />
            <Route path="/trans-agent/warehouse" element={<WarehouseList />} />
            <Route
              path="/trans-agent/ready-product"
              element={<ReadyProductList />}
            />
            <Route path="/trans-agent/delivery" element={<DeliveryList />} />
            <Route
              path="/trans-agent/order-accepted"
              element={<OrderAcceptedList />}
            />
            <Route path="/trans-agent/history" element={<HistoryList />} />
            <Route
              path="/trans-agent/detail/:id"
              element={<DetailTransAgent />}
            />
            {/* end Trans Agent */}

            {/* start genie */}
            <Route path="/genie/dashboard" element={<DashboardGinee />} />
            <Route path="/genie/order/list" element={<OrderList />} />
            <Route
              path="/genie/order/detail/:orderId"
              element={<OrderListDetail />}
            />

            {/* checkout agent */}
            <Route path="/cart/list" element={<CartList />} />

            {/* order lead */}
            <Route path="/order/order-lead" element={<OrderLeadList />} />
            <Route
              path="/order/order-lead/:uid_lead"
              element={<OrderLeadDetail />}
            />

            {/* order lead manual*/}
            <Route
              path="/order/manual/order-lead"
              element={<OrderManualLeadList />}
            />
            <Route
              path="/order/manual/order-lead/detail/:uid_lead"
              element={<OrderManualLeadDetail />}
            />
            <Route
              path="/order/manual/order-lead/form/:uid_lead"
              element={<OrderManualLeadForm />}
            />

            {/* prospect */}
            <Route path="/prospect" element={<ProspectList />} />
            <Route
              path="/prospect/detail/:prospect_id"
              element={<ProspectForm />}
            />
            <Route path="/prospect/form" element={<ProspectForm />} />

            {/* order online */}
            <Route path="/order-online" element={<OrderOnlineList />} />
            <Route
              path="/order-online/detail/:order_online_id"
              element={<OrderOnlineForm />}
            />
            <Route path="/order-online/form" element={<OrderOnlineForm />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* agent list */}
            <Route path="/agent/list" element={<AgentList />} />
            <Route path="/agent/domain" element={<DomainAgent />} />

            {/* menu */}
            <Route path="/menu" element={<MenuPages />} />

            {/* case return */}
            <Route path="/case/return" element={<CaseReturn />} />
            <Route
              path="/case/return/:uid_retur"
              element={<CaseReturnDetail />}
            />

            {/* case refund */}
            <Route path="/case/refund" element={<CaseRefund />} />
            <Route
              path="/case/refund/:uid_refund"
              element={<CaseRefundDetail />}
            />

            {/* case refund */}
            <Route path="/case/manual" element={<CaseManual />} />
            <Route path="/case/manual/form">
              <Route path=":uid_case" element={<CaseManualForm />} />
              <Route path="" element={<CaseManualForm />} />
            </Route>
            <Route
              path="/case/manual/detail/:uid_case"
              element={<CaseManualDetail />}
            />

            {/* freebies */}
            <Route path="/order/freebies" element={<OrderFreebiesList />} />
            <Route path="/order/freebies/form">
              <Route path=":uid_lead" element={<OrderFreebiesForm />} />
              <Route path="" element={<OrderFreebiesForm />} />
            </Route>
            <Route
              path="/order/freebies/detail/:uid_lead"
              element={<OrderFreebiesDetail />}
            />

            {/* order submit id */}
            <Route path="/order/submit/history" element={<OrdeSubmitList />} />
            <Route
              path="/order/submit/history/:submit_id"
              element={<OrdeSubmitListDetail />}
            />

            {/* sales return */}
            <Route path="/order/sales-return" element={<SalesReturnList />} />
            <Route
              path="/order/sales-return/detail/:uid_retur"
              element={<SalesReturnDetail />}
            />
            <Route path="/order/sales-return/form">
              <Route path=":uid_return" element={<SalesReturnForm />} />
              <Route path="" element={<SalesReturnForm />} />
            </Route>

            {/* inventory */}
            <Route path="/inventory-new" element={<Inventory />} />
            <Route
              path="/inventory-new/inventory-product-return"
              element={<InventoryProductReturn />}
            />
            <Route path="/inventory-new/inventory-product-return/form">
              <Route
                path=":inventory_id"
                element={<InventoryProductReturnForm />}
              />
              <Route path="" element={<InventoryProductReturnForm />} />
            </Route>
            <Route
              path="/inventory-new/inventory-product-return/detail/:inventory_id"
              element={<InventoryProductReturnDetail />}
            />

            {/* product stock form */}
            <Route
              path="/inventory-new/inventory-product-stock"
              element={<InventoryProductStock />}
            />
            <Route path="/inventory-new/inventory-product-stock/detail">
              <Route path=":inventory_id" element={<InventoryAddProducts />} />
              <Route path="" element={<InventoryAddProducts />} />
            </Route>

            {/* product transfer */}
            <Route
              path="/inventory-new/inventory-product-transfer"
              element={<InventoryProductStock type={"transfer"} />}
            />
            <Route path="/inventory-new/inventory-product-transfer/detail">
              <Route path=":inventory_id" element={<ProductTransferForm />} />
              <Route path="" element={<ProductTransferForm />} />
            </Route>
            <Route path="/inventory-new/inventory-product-transfer/form">
              <Route path=":inventory_id" element={<ProductTransferForm />} />
              <Route path="" element={<ProductTransferForm />} />
            </Route>

            {/* product return */}
            <Route path="/inventory-new/inventory-product-return/form">
              <Route
                path=":inventory_id"
                element={<InventoryProductReturnForm />}
              />
              <Route path="" element={<InventoryProductReturnForm />} />
            </Route>

            {/* lead master */}

            <Route path="/lead-master" element={<LeadMasterList />} />
            <Route
              path="/lead-master/detail/:uid_lead"
              element={<LeadMasterDetail />}
            />
            <Route path="/lead-master/form">
              <Route path=":uid_lead" element={<LeadMasterForm />} />
              <Route path="" element={<LeadMasterForm />} />
            </Route>
            <Route path="/gp-submission" element={<GpSubmissionList />} />
            <Route
              path="/gp-submission/list/detail/:list_id"
              element={<GpSubmissionListDetail />}
            />
            <Route path="/gp-customer" element={<GpCustomer />} />

            {/* master data */}
            <Route path="/master/brand" element={<BrandList />} />
            <Route path="/master/brand/form" element={<FormBrand />} />
            <Route
              path="/master/brand/form/:brand_id"
              element={<FormBrand />}
            />

            {/* master master/company-account */}
            <Route
              path="/master/company-account"
              element={<CompanyAccountList />}
            />
            <Route
              path="/master/company-account/form"
              element={<CompanyAccountForm />}
            />
            <Route
              path="/master/company-account/form/:company_account_id"
              element={<CompanyAccountForm />}
            />

            {/* master data banner */}
            <Route path="/master/banner" element={<BannerList />} />
            <Route path="/master/banner/form" element={<FormBanner />} />
            <Route
              path="/master/banner/form/:banner_id"
              element={<FormBanner />}
            />

            {/* master data category */}
            <Route path="/master/category" element={<CategoryList />} />
            <Route path="/master/category/form" element={<FormCategory />} />
            <Route
              path="/master/category/form/:category_id"
              element={<FormCategory />}
            />

            {/* master data point */}
            <Route path="/master/point" element={<PointList />} />
            <Route path="/master/point/form" element={<PointForm />} />
            <Route
              path="/master/point/form/:master_point_id"
              element={<PointForm />}
            />

            {/* master data PACKAGE */}
            <Route path="/master/package" element={<PackageList />} />
            <Route path="/master/package/form" element={<PackageForm />} />
            <Route
              path="/master/package/form/:package_id"
              element={<PackageForm />}
            />

            {/* master data Payment Method */}
            <Route
              path="/master/payment-method"
              element={<PaymentMethodList />}
            />
            <Route
              path="/master/payment-method/form"
              element={<FormPaymentMethod />}
            />
            <Route
              path="/master/payment-method/form/:payment_method_id"
              element={<FormPaymentMethod />}
            />

            {/* shipping method */}
            <Route
              path="/master/shipping-method/logistic"
              element={<LogisticList />}
            />
            <Route
              path="/master/shipping-method/offline/logistic"
              element={<OfflineLogisticList />}
            />

            {/* master data Variant */}
            <Route path="/master/variant" element={<VariantList />} />
            <Route path="/master/variant/form" element={<VariantForm />} />
            <Route
              path="/master/variant/form/:variant_id"
              element={<VariantForm />}
            />
            {/* master data voucher */}
            <Route path="/master/voucher" element={<VoucherList />} />
            <Route path="/master/voucher/form" element={<FormVoucher />} />
            <Route
              path="/master/voucher/form/:voucher_id"
              element={<FormVoucher />}
            />

            {/* master data payment term */}
            <Route path="/master/payment-term" element={<PaymentTermList />} />
            <Route
              path="/master/payment-term/form"
              element={<PaymentTermForm />}
            />
            <Route
              path="/master/payment-term/form/:payment_term_id"
              element={<PaymentTermForm />}
            />
            {/* master data master tax */}
            <Route path="/master/master-tax" element={<MasterTaxList />} />
            <Route path="/master/master-tax/form" element={<MasterTaxForm />} />
            <Route
              path="/master/master-tax/form/:master_tax_id"
              element={<MasterTaxForm />}
            />
            {/* master data sku */}
            <Route path="/master/sku" element={<SkuList />} />
            <Route path="/master/sku/form" element={<SkuForm />} />
            <Route path="/master/sku/form/:sku_id" element={<SkuForm />} />
            {/* ticket master */}
            <Route path="/ticket" element={<TicketList />} />
            <Route path="/ticket/detail/:id" element={<TicketDetail />} />
            {/* tiktok master */}
            <Route path="/tiktok" element={<TiktokList />} />
            {/* mapping tiktok */}
            <Route path="/mapping/product" element={<MappingProductList />} />
            <Route
              path="/mapping/product/detail/:id"
              element={<MappingProductDetail />}
            />
            <Route
              path="/mapping/settlement"
              element={<MappingSettlementList />}
            />
            <Route
              path="/mapping/settlement/detail/:id"
              element={<MappingSettlementDetail />}
            />
            <Route path="/mapping/order" element={<MappingOrderList />} />
            <Route
              path="/mapping/order/detail/:id"
              element={<MappingOrderDetail />}
            />
            <Route
              path="/mapping/warehouse"
              element={<MappingWarehouseList />}
            />
            <Route
              path="/mapping/warehouse/detail/:id"
              element={<MappingWarehouseDetail />}
            />
            {/* profile */}
            <Route path="/profile" element={<ProfileList />} />
            {/* master data warehouse */}
            <Route path="/master/warehouse" element={<MasterWarehouseList />} />
            <Route path="/master/warehouse/form" element={<WarehouseForm />} />
            <Route
              path="/master/warehouse/form/:warehouse_id"
              element={<WarehouseForm />}
            />
            {/* master data master discount */}
            <Route
              path="/master/master-discount"
              element={<MasterDiscountList />}
            />
            <Route
              path="/master/master-discount/form"
              element={<MasterDiscountForm />}
            />
            <Route
              path="/master/master-discount/form/:master_discount_id"
              element={<MasterDiscountForm />}
            />
            {/* master data type case */}
            <Route path="/master/type-case" element={<TypeCaseList />} />
            <Route path="/master/type-case/form" element={<TypeCaseForm />} />
            <Route
              path="/master/type-case/form/:type_case_id"
              element={<TypeCaseForm />}
            />
            {/* master data category type case */}
            <Route
              path="/master/category-type-case"
              element={<CategoryTypeCaseList />}
            />
            <Route
              path="/master/category-type-case/form"
              element={<CategoryTypeCaseForm />}
            />
            <Route
              path="/master/category-type-case/form/:category_type_case_id"
              element={<CategoryTypeCaseForm />}
            />
            {/* master data status case */}
            <Route path="/master/status-case" element={<StatusCaseList />} />
            <Route
              path="/master/status-case/form"
              element={<StatusCaseForm />}
            />
            <Route
              path="/master/status-case/form/:status_case_id"
              element={<StatusCaseForm />}
            />
            {/* master data priority case */}
            <Route
              path="/master/priority-case"
              element={<PriorityCaseList />}
            />
            <Route
              path="/master/priority-case/form"
              element={<PriorityCaseForm />}
            />
            <Route
              path="/master/priority-case/form/:priority_case_id"
              element={<PriorityCaseForm />}
            />
            {/* master data source case */}
            <Route path="/master/source-case" element={<SourceCaseList />} />
            <Route
              path="/master/source-case/form"
              element={<SourceCaseForm />}
            />
            <Route
              path="/master/source-case/form/:source_case_id"
              element={<SourceCaseForm />}
            />
            {/* master data level */}
            <Route path="/master/level" element={<LevelList />} />
            <Route path="/master/level/form" element={<LevelForm />} />
            <Route
              path="/master/level/form/:level_id"
              element={<LevelForm />}
            />

            {/* master pengemasan */}
            <Route
              path="/master/pengemasan"
              element={<ProductAdditionalList type="pengemasan" />}
            />
            <Route
              path="/master/pengemasan/form"
              element={<ProductAdditionalForm type="pengemasan" />}
            />
            <Route
              path="/master/pengemasan/form/:product_additional_id"
              element={<ProductAdditionalForm type="pengemasan" />}
            />

            {/* master perlengkapan */}
            <Route
              path="/master/perlengkapan"
              element={<ProductAdditionalList type="perlengkapan" />}
            />
            <Route
              path="/master/perlengkapan/form"
              element={<ProductAdditionalForm type="perlengkapan" />}
            />
            <Route
              path="/master/perlengkapan/form/:product_additional_id"
              element={<ProductAdditionalForm type="perlengkapan" />}
            />

            {/* master sales-channel */}
            <Route
              path="/master/sales-channel"
              element={<SalesChannelList />}
            />
            <Route
              path="/master/sales-channel/form"
              element={<SalesChannelForm />}
            />
            <Route
              path="/master/sales-channel/form/:sales_channel_id"
              element={<SalesChannelForm />}
            />

            {/* master ongkir */}
            <Route path="/master/ongkir" element={<OngkirList />} />
            <Route path="/master/ongkir/form" element={<OngkirForm />} />
            <Route
              path="/master/ongkir/form/:master_ongkir_id"
              element={<OngkirForm />}
            />

            {/* product */}
            <Route path="/product-management">
              <Route
                path="/product-management/product"
                element={<ProductMasterList />}
              />
              <Route
                path="/product-management/product/form"
                element={<ProductMasterForm />}
              />
              <Route
                path="/product-management/product/form/:product_id"
                element={<ProductMasterForm />}
              />
              <Route
                path="/product-management/product/stock-allocation/:product_id"
                element={<ProductStockAllocation />}
              />
            </Route>

            {/* product */}
            <Route path="/product-management">
              <Route
                path="/product-management/product-variant"
                element={<ProductVariantList />}
              />
              <Route
                path="/product-management/product-variant/form"
                element={<ProductVariantForm />}
              />
              <Route
                path="/product-management/product-variant/form/:product_variant_id"
                element={<ProductVariantForm />}
              />
            </Route>

            {/* product margin */}
            <Route path="/product-management">
              <Route
                path="/product-management/margin-bottom"
                element={<ProductMarginBottomList />}
              />
              <Route
                path="/product-management/margin-bottom/form"
                element={<ProductMarginBottomForm />}
              />
              <Route
                path="/product-management/margin-bottom/form/:product_margin_id"
                element={<ProductMarginBottomForm />}
              />
            </Route>

            {/* comment rating */}
            <Route path="/product-management">
              <Route
                path="/product-management/comment-rating"
                element={<ProductCommentRatingList />}
              />
            </Route>

            {/* import */}
            <Route path="/product-management">
              <Route
                path="/product-management/import-product"
                element={<ImportProductConvertList />}
              />
            </Route>

            {/* convert */}
            <Route path="/product-management">
              <Route
                path="/product-management/convert-product"
                element={<ConvertProductList />}
              />
            </Route>
            <Route path="/product-management">
              <Route
                path="/product-management/convert-product/detail/:convert_id"
                element={<ConvertProductDetailList />}
              />
            </Route>

            {/* setting */}
            {/* template notification */}
            <Route
              path="/setting/notification-template"
              element={<NotificationTemplateList />}
            />
            <Route
              path="/setting/notification-template/form"
              element={<NotificationTemplateForm />}
            />
            <Route
              path="/setting/notification-template/form/:template_id"
              element={<NotificationTemplateForm />}
            />

            {/* purchase order */}
            <Route path="/purchase">
              <Route
                path="/purchase/purchase-order"
                element={<PurchaseOrder />}
              />
              <Route
                path="/purchase/purchase-order/form"
                element={<PurchaseOrderForm />}
              />
              <Route
                path="/purchase/purchase-order/form/:purchase_order_id"
                element={<PurchaseOrderForm />}
              />
              <Route
                path="/purchase/purchase-order/detail/:purchase_order_id"
                element={<PurchaseOrderDetail />}
              />
            </Route>

            {/* purchase requisition */}
            <Route path="/purchase">
              <Route
                path="/purchase/purchase-requisition"
                element={<PurchaseRequisition />}
              />
              <Route
                path="/purchase/purchase-requisition/form"
                element={<PurchaseRequisitionForm />}
              />
              <Route
                path="/purchase/purchase-requisition/form/:purchase_requisition_id"
                element={<PurchaseRequisitionForm />}
              />
              <Route
                path="/purchase/purchase-requisition/detail/:purchase_requisition_id"
                element={<PurchaseRequisitionDetail />}
              />
            </Route>

            {/* stock movement */}
            <Route path="/">
              <Route path="/stock-movement" element={<StockMovement />} />
            </Route>

            {/* transaction */}
            <Route path="/transaction">
              {/* customer */}
              <Route
                path="/transaction/waiting-payment"
                element={<TransactionList stage={"waiting-payment"} />}
              />
              <Route
                path="/transaction/waiting-confirmation"
                element={<TransactionList stage={"waiting-confirmation"} />}
              />
              <Route
                path="/transaction/confirm-payment"
                element={<TransactionList stage={"confirm-payment"} />}
              />
              <Route
                path="/transaction/on-process"
                element={<TransactionList stage={"on-process"} />}
              />
              <Route
                path="/transaction/ready-to-ship"
                element={<TransactionList stage={"ready-to-ship"} />}
              />
              <Route
                path="/transaction/on-delivery"
                element={<TransactionList stage={"on-delivery"} />}
              />
              <Route
                path="/transaction/delivered"
                element={<TransactionList stage={"delivered"} />}
              />
              <Route
                path="/transaction/cancelled"
                element={<TransactionList stage={"cancelled"} />}
              />
              <Route
                path="/transaction/new-order"
                element={<TransactionList stage={"new-order"} />}
              />

              {/* agent */}
              <Route
                path="/transaction/agent/waiting-payment"
                element={
                  <TransactionList stage={"waiting-payment"} type={"agent"} />
                }
              />
              <Route
                path="/transaction/agent/waiting-confirmation"
                element={
                  <TransactionList
                    stage={"waiting-confirmation"}
                    type={"agent"}
                  />
                }
              />
              <Route
                path="/transaction/agent/confirm-payment"
                element={
                  <TransactionList stage={"confirm-payment"} type={"agent"} />
                }
              />
              <Route
                path="/transaction/agent/on-process"
                element={
                  <TransactionList stage={"on-process"} type={"agent"} />
                }
              />
              <Route
                path="/transaction/agent/ready-to-ship"
                element={
                  <TransactionList stage={"ready-to-ship"} type={"agent"} />
                }
              />
              <Route
                path="/transaction/agent/on-delivery"
                element={
                  <TransactionList stage={"on-delivery"} type={"agent"} />
                }
              />
              <Route
                path="/transaction/agent/delivered"
                element={<TransactionList stage={"delivered"} type={"agent"} />}
              />
              <Route
                path="/transaction/agent/cancelled"
                element={<TransactionList stage={"cancelled"} type={"agent"} />}
              />
              <Route
                path="/transaction/detail/:transaction_id"
                element={<TransactionDetail type={"customer"} />}
              />
              <Route
                path="/transaction/detail/new-order/:transaction_id"
                element={<TransactionDetailNewOrder type={"customer"} />}
              />
              <Route
                path="/transaction/detail/agent/:transaction_id"
                element={<TransactionDetail type={"agent"} />}
              />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </div>
  )
}

const themes = {
  dark: "/../../assets/css/dark-theme.css",
  light: "/../../assets/css/light-theme.css",
}

if (document.getElementById("spa-index")) {
  const contactRoot = ReactDOM.createRoot(document.getElementById("spa-index"))
  contactRoot.render(
    <React.StrictMode>
      <ThemeSwitcherProvider
        themeMap={themes}
        defaultTheme={localStorage.getItem("theme")}
      >
        <App />
      </ThemeSwitcherProvider>
    </React.StrictMode>
  )
}
