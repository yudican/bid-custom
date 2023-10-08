<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseRequitition extends Model
{
    use HasFactory;

    protected $fillable = [
        'uid_requitition',
        'brand_id',
        'project_name',
        'request_by_name',
        'request_by_email',
        'request_by_division',
        'request_date',
        'request_note',
        'request_status',
        'pr_number',
        'vendor_code',
        'vendor_name',
        'payment_term_id',
        'company_account_id',
        'received_by',
        'received_address'
    ];

    protected $appends = [
        'subtotal',
        'total',
        'total_tax',
        'brand_name',
        'payment_term_name',
        'company_account_name',
        'received_by_name',
        'received_role_id',
        'approval_count',
        'verified_by_name',
        'approved_by_name',
        'excecuted_by_name',
    ];

    public function items()
    {
        return $this->hasMany(PurchaseRequititionItem::class);
    }

    public function paymentTerm()
    {
        return $this->belongsTo(PaymentTerm::class);
    }

    /**
     * Get all of the approvalLeads for the PurchaseRequitition
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function approvalLeads()
    {
        return $this->hasMany(PurchaseRequititionApproval::class);
    }

    public function getPaymentTermNameAttribute()
    {
        $payment_term = PaymentTerm::find($this->payment_term_id);
        return $payment_term ? $payment_term->name : '-';
    }

    public function getBrandNameAttribute()
    {
        $brand = Brand::find($this->brand_id);
        return $brand ? $brand->name : '-';
    }

    public function getReceivedRoleIdAttribute()
    {
        $user = User::find($this->received_by);
        return $user ? $user->role?->id : null;
    }

    public function getReceivedByNameAttribute()
    {
        $user = User::find($this->received_by);
        return $user ? $user->name : '-';
    }

    public function getTotalAttribute()
    {
        $total = 0;
        foreach ($this->items as $key => $item) {
            $total += $item->item_subtotal;
        }
        return $total;
    }

    public function getTotalTaxAttribute()
    {
        $total = 0;
        foreach ($this->items as $key => $item) {
            if ($item->item_tax > 0) {
                $total = $item->item_tax;
            }
        }
        return $total;
    }

    public function getSubtotalAttribute()
    {
        $total = 0;
        foreach ($this->items as $key => $item) {
            $total += $item->item_qty * $item->item_price;
        }
        return $total;
    }

    public function getCompanyAccountNameAttribute()
    {
        $company_account = CompanyAccount::find($this->company_account_id);
        return $company_account ? $company_account->account_name : '-';
    }

    public function getApprovalCountAttribute()
    {
        return $this->approvalLeads()->where('status', 1)->count();
    }

    public function getVerifiedByNameAttribute()
    {
        $purchase = PurchaseRequititionApproval::where('purchase_requitition_id', $this->id)->where('label', 'Verified By')->first();
        return $purchase ? $purchase->user_name : '-';
    }

    public function getApprovedByNameAttribute()
    {
        $purchase = PurchaseRequititionApproval::where('purchase_requitition_id', $this->id)->where('label', 'Approved By')->first();
        return $purchase ? $purchase->user_name : '-';
    }

    public function getExcecutedByNameAttribute()
    {
        $purchase = PurchaseRequititionApproval::where('purchase_requitition_id', $this->id)->where('label', 'Excecuted By')->first();
        return $purchase ? $purchase->user_name : '-';
    }
}
