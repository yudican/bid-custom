<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryProductStock extends Model
{
    use HasFactory;
    protected $fillable = [
        'uid_inventory',
        'reference_number',
        'warehouse_id',
        'destination_warehouse_id',
        'created_by',
        'vendor',
        'status',
        'received_date',
        'note',
        'received_by',
        'allocated_by',
        'inventory_type',
        'inventory_status',
        'product_id',
        'company_id'
    ];

    protected $appends = [
        'created_on',
        'product_name',
        'created_by_name',
        'received_by_name',
        'allocated_by_name',
        'warehouse_name',
        'warehouse_destination_name',
        'company_name',
        'total_qty',
        'selected_po'
    ];

    public function items()
    {
        return $this->hasMany(InventoryItem::class, 'uid_inventory', 'uid_inventory');
    }

    // inventory detail item
    public function detailItems()
    {
        return $this->hasMany(InventoryDetailItem::class, 'uid_inventory', 'uid_inventory');
    }

    public function historyAllocations()
    {
        return $this->hasMany(StockAllocationHistory::class, 'uid_inventory', 'uid_inventory');
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

    public function getProductNameAttribute()
    {
        $product = Product::find($this->product_id);
        return $product ? $product->name : '-';
    }

    public function getCreatedOnAttribute()
    {
        return $this->created_at->format('d M Y');
    }

    public function getCreatedByNameAttribute()
    {
        $user = User::find($this->created_by);
        return $user ? $user->name : '-';
    }

    public function getReceivedByNameAttribute()
    {
        $user = User::find($this->received_by);
        return $user ? $user->name : '-';
    }

    public function getAllocatedByNameAttribute()
    {
        $user = User::find($this->allocated_by);
        return $user ? $user->name : '-';
    }

    public function getWarehouseNameAttribute()
    {
        $warehouse = Warehouse::find($this->warehouse_id);
        return $warehouse ? $warehouse->name : '-';
    }
    public function getWarehouseDestinationNameAttribute()
    {
        $warehouse = Warehouse::find($this->destination_warehouse_id);
        return $warehouse ? $warehouse->name : '-';
    }

    public function getCompanyNameAttribute()
    {
        $company = PurchaseOrder::where('po_number', $this->reference_number)->first();
        return $company ? $company->company_name : '-';
    }

    public function getTotalQtyAttribute()
    {
        $total = 0;
        foreach ($this->items as $item) {
            $total += $item->qty;
        }
        return $total;
    }

    public function getSelectedPoAttribute()
    {
        $purchase = PurchaseOrder::with(['items'])->where('po_number', $this->reference_number)->first();
        if ($purchase) {
            return $purchase;
        }

        return null;
    }
}
