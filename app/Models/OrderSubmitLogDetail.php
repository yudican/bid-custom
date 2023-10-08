<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderSubmitLogDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_submit_log_id',
        'order_id',
        'status',
        'error_message',
    ];

    protected $appends = [
        'order',
        'extended_price',
        'discount_amount',
        'tax_amount',
        'misc_amount',
        'freight',
    ];

    public function orderSubmitLog()
    {
        return $this->belongsTo(OrderSubmitLog::class);
    }

    /**
     * Get the order that owns the OrderSubmitLogDetail
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function order()
    {
        $type_si = $this->orderSubmitLog->type_si;

        if ($type_si == 'order-lead') {
            return $this->belongsTo(OrderLead::class, 'order_id');
        }
        return $this->belongsTo(OrderManual::class, 'order_id');
    }


    public function getOrderAttribute()
    {
        $type_si = $this->orderSubmitLog->type_si;

        if ($type_si == 'order-lead') {
            return OrderLead::find($this->order_id);
        }
        return OrderManual::find($this->order_id);
    }

    public function getExtendedPriceAttribute()
    {
        $total = 0;
        if ($this->order) {
            foreach ($this->order->productNeeds as $key => $product) {
                $total += $product->price_product * $product->qty;
            }
            return $total / $this->orderSubmitLog->vat;
        }

        return 0;
    }

    public function getDiscountAmountAttribute()
    {
        if ($this->order) {
            return $this->order->discount_amount;
        }
        return 0;
    }

    public function getTaxAmountAttribute()
    {
        $tax =  $this->orderSubmitLog->tax;

        if ($this->order) {
            if ($tax > 0) {
                $total = 0;
                $tax_amount = $tax / 100;
                foreach ($this->order->productNeeds as $key => $product) {
                    $total += $product->price_product * $product->qty;
                }
                return $total * $tax_amount;
            }

            $total = 0;
            foreach ($this->order->productNeeds as $key => $product) {
                $total += $product->price_product * $product->qty;
            }

            return $total;
        }


        return 0;
    }

    public function getMiscAmountAttribute()
    {
        return 0;
    }

    public function getFreightAttribute()
    {
        if ($this->order) {
            return $this->order->ongkir;
        }

        return 0;
    }
}
