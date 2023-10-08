<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderManual extends Model
{
    //use Uuid;
    use HasFactory;

    //public $incrementing = false;

    protected $fillable = ['uid_lead', 'title', 'contact', 'sales', 'customer_need', 'user_created', 'user_updated', 'payment_term', 'brand_id', 'status', 'type_customer', 'warehouse_id', 'order_number', 'invoice_number', 'reference_number', 'shipping_type', 'address_id', 'notes', 'courier', 'status_penagihan', 'status_pengiriman', 'status_invoice', 'due_date', 'kode_unik', 'temp_kode_unik', 'ongkir', 'company_id', 'type', 'status_submit', 'attachment', 'print_status', 'resi_status'];

    protected $dates = [];
    protected $appends = ['amount', 'subtotal', 'tax_amount', 'discount_amount', 'contact_name', 'contact_name_only', 'sales_name', 'payment_term_name', 'created_by_name', 'selected_address', 'amount_billing_approved', 'amount_deposite', 'company_name', 'contact_uid', 'attachment_url', 'warehouse_name'];

    /**
     * Get the contact that owns the LeadMaster
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function contactUser()
    {
        return $this->belongsTo(User::class, 'contact');
    }

    public function getContactUidAttribute()
    {
        $user = User::find($this->contact);
        return $user ? $user->uid : null;
    }

    /**
     * Get the sales that owns the LeadMaster
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function salesUser()
    {
        return $this->belongsTo(User::class, 'sales');
    }

    /**
     * Get the sales that owns the LeadMaster
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function addressUser()
    {
        return $this->belongsTo(AddressUser::class, 'address_id');
    }

    /**
     * Get the sales that owns the LeadMaster
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function createUser()
    {
        return $this->belongsTo(User::class, 'user_created');
    }
    /**
     * Get the sales that owns the LeadMaster
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function courierUser()
    {
        return $this->belongsTo(User::class, 'courier');
    }

    /**
     * Get the brand that owns the LeadMaster
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    /**
     * Get all of the leadActivities for the LeadMaster
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function leadActivities()
    {
        return $this->hasMany(LeadActivity::class, 'uid_lead', 'uid_lead');
    }

    /**
     * Get all of the logPrintOrders for the OrderLead
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function logPrintOrders()
    {
        return $this->hasMany(LogPrintOrder::class, 'uid_lead', 'uid_lead');
    }

    /**
     * Get all of the reminders for the LeadMaster
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function reminders()
    {
        return $this->hasMany(LeadReminder::class, 'uid_lead', 'uid_lead');
    }

    /**
     * Get all of the leadActivities for the LeadMaster
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'contact');
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id');
    }

    public function paymentTerm()
    {
        return $this->belongsTo(PaymentTerm::class, 'payment_term');
    }


    public function negotiations()
    {
        return $this->hasMany(LeadNegotiation::class, 'uid_lead', 'uid_lead');
    }

    /**
     * Get all of the billings for the OrderLead
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function billings()
    {
        return $this->hasMany(LeadBilling::class, 'uid_lead', 'uid_lead');
    }

    /**
     * Get all of the productNeeds for the LeadMaster
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function productNeeds()
    {
        return $this->hasMany(ProductNeed::class, 'uid_lead', 'uid_lead');
    }

    /**
     * Get all of the orderDeposites for the OrderLead
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function orderDeposites()
    {
        return $this->hasMany(OrderDeposit::class, 'uid_lead', 'uid_lead')->where('order_type', 'manual')->where('contact', $this->contact);
    }

    public function getAmountDepositeAttribute()
    {
        $total = 0;
        foreach ($this->orderDeposites as $key => $value) {
            $total += $value->amount;
        }
        return $total;
    }

    public function getAmountAttribute()
    {
        $total = 0;
        foreach ($this->productNeeds as $key => $value) {
            $total += $value->total;
        }
        return $total + $this->kode_unik + $this->ongkir;
    }

    public function getTaxAmountAttribute()
    {
        $tax = 0;
        foreach ($this->productNeeds as $key => $value) {
            $tax += $value->tax_amount;
        }
        return $tax;
    }

    public function getDiscountAmountAttribute()
    {
        $discount = 0;
        foreach ($this->productNeeds as $key => $value) {
            $discount += $value->discount_amount;
        }
        return $discount;
    }

    public function getTotalPriceAttribute()
    {
        $total = 0;
        foreach ($this->productNeeds as $key => $value) {
            $total += $value->total;
        }
        return $total;
    }

    public function getContactNameAttribute()
    {
        $user = User::find($this->contact);
        return $user ? $user->name . ' - ' . $user->role->role_name : '-';
    }

    public function getContactNameOnlyAttribute()
    {
        $user = User::find($this->contact);
        return $user ? $user->name : '-';
    }

    public function getCompanyNameAttribute()
    {
        $user = CompanyAccount::find($this->company_id);
        return $user ? $user->account_name : '-';
    }

    public function getSalesNameAttribute()
    {
        $user = User::find($this->sales);
        return $user ? $user->name : '-';
    }

    public function getPaymentTermNameAttribute()
    {
        $payment_term = PaymentTerm::find($this->payment_term);
        return $payment_term ? $payment_term->name : '-';
    }

    public function getCreatedByNameAttribute()
    {
        $user = User::find($this->user_created);
        return $user ? $user->name : '-';
    }

    public function getSelectedAddressAttribute()
    {
        $address = $this->contactUser()->first()?->addressUsers()?->where('is_default', 1)->first();
        return $address ? $address->alamat_detail : '-';
    }

    public function getSubtotalAttribute()
    {
        $total = 0;
        foreach ($this->productNeeds as $key => $value) {
            $total += $value->subtotal;
        }
        return $total;
    }

    public function getAmountBillingApprovedAttribute()
    {
        return $this->billings()->where('status', 1)->sum('total_transfer') ?? 0;
    }

    /**
     * Get the orderShipping associated with the OrderLead
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function orderShipping()
    {
        return $this->hasOne(OrderShipping::class, 'uid_lead', 'uid_lead')->where('order_type', 'manual');
    }

    public function getAttachmentUrlAttribute()
    {
        return $this->attachment ? getImage($this->attachment) : null;
    }


    public function getWarehouseNameAttribute()
    {
        $warehouse = Warehouse::find($this->warehouse_id);

        return $warehouse ? $warehouse->name : '-';
    }
}
