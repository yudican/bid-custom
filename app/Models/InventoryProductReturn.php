<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryProductReturn extends Model
{
    use HasFactory;
    protected $fillable = [
        'uid_inventory',
        'nomor_sr',
        'transaction_channel',
        'barcode',
        'expired_date',
        'warehouse_id',
        'created_by',
        'vendor',
        'status',
        'received_date',
        'note',
        'company_account_id',
        'rejected_reason',
        'company_id',
        'case_type',
        'case_title'
    ];

    protected $appends = [
        'created_on',
        'created_by_name',
        'total_qty',
        'warehouse_name',
        'company_account_name',
        'qty_received',
        'qty_pre_received',
    ];

    public function items()
    {
        return $this->hasMany(InventoryItem::class, 'uid_inventory', 'uid_inventory')->where('type', 'return');
    }

    public function itemPreReceived()
    {
        return $this->hasMany(InventoryItem::class, 'uid_inventory', 'uid_inventory')->where('type', 'return-prcved');
    }

    public function itemReceived()
    {
        return $this->hasMany(InventoryItem::class, 'uid_inventory', 'uid_inventory')->where('type', 'return-received');
    }


    /**
     * Get the warehouse that owns the InventoryProductStock
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    /**
     * Get the userCreated that owns the InventoryProductStock
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function userCreated()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getCreatedOnAttribute()
    {
        return $this->created_at->format('d M Y');
    }

    public function getCreatedByNameAttribute()
    {
        return $this->userCreated->name;
    }

    public function getTotalQtyAttribute()
    {
        return $this->items()->sum('qty');
    }

    public function getWarehouseNameAttribute()
    {
        $warehouse = Warehouse::find($this->warehouse_id);

        return $warehouse->name ?? '-';
    }

    public function getCompanyAccountNameAttribute()
    {
        $companyAccount = CompanyAccount::find($this->company_account_id);

        return $companyAccount->account_name ?? '-';
    }

    public function getQtyReceivedAttribute()
    {
        return $this->itemReceived()->sum('qty_diterima');
    }

    public function getQtyPreReceivedAttribute()
    {
        return $this->itemPreReceived()->sum('qty_diterima');
    }
}
