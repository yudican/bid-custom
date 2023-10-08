<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class ProductNeed extends Model
{
    use HasFactory;
    protected $fillable = [
        'uid_lead', 'product_id', 'price', 'qty', 'status', 'tax_id', 'discount_id', 'description', 'user_created', 'user_updated', 'price_type'
    ];
    protected $appends = ['tax_amount', 'discount_amount', 'total', 'margin_price', 'price_product', 'subtotal', 'discount_percent', 'tax_percentage', 'ppn', 'role', 'prices', 'price_nego', 'u_of_m', 'product_name', 'final_price', 'disabled_discount', 'disabled_price_nego'];
    /**
     * Get the product that owns the ProductNeed
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function product()
    {
        return $this->belongsTo(ProductVariant::class, 'product_id');
    }

    // lead master
    /**
     * Get the leadMaster that owns the ProductNeed
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function leadMaster()
    {
        return $this->belongsTo(LeadMaster::class, 'uid_lead', 'uid_lead');
    }

    /**
     * Get the orderLead that owns the ProductNeed
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function orderLead()
    {
        return $this->belongsTo(OrderLead::class, 'uid_lead', 'uid_lead');
    }

    public function discount()
    {
        return $this->belongsTo(MasterDiscount::class, 'discount_id');
    }

    public function tax()
    {
        return $this->belongsTo(MasterTax::class, 'tax_id');
    }

    public function getProductNameAttribute()
    {
        $product = ProductVariant::find($this->product_id);
        if ($product) {
            return $product->name;
        }
        return '-';
    }

    public function getRoleAttribute()
    {
        $order = OrderLead::where('uid_lead', $this->uid_lead)->first();
        if (!$order) {
            $order = OrderManual::where('uid_lead', $this->uid_lead)->first();
        }

        if (!$order) {
            $order = LeadMaster::where('uid_lead', $this->uid_lead)->first();
        }

        if ($order?->contact) {
            $user = User::find($order->contact);
            if ($user && $user->role) {
                return $user->role->role_type;
            }
        }

        return 'mitra';
    }

    public function getPriceProductAttribute()
    {
        if ($this->price_type == 'manual') {
            return $this->price;
        }


        if ($this->product) {
            $price = $this->product->getPrice($this->role)['final_price'];
            // if ($this->price > 0) {
            //     $price = $this->price;
            // }
            return $price;
        }
        return 0;
    }

    public function getPricesAttribute()
    {
        if ($this->price_type == 'manual') {
            return [
                'basic_price' => $this->price,
                'final_price' => $this->price,
            ];
        }
        if ($this->product) {
            $price = $this->product->getPrice($this->role);
            return $price;
        }
        return [
            'basic_price' => 0,
            'final_price' => 0,
        ];
    }

    public function getDiscountAmountAttribute()
    {
        $curr_price = $this->price > 0 ? $this->price : $this->price_product;
        $qty = $this->qty;
        if ($this->discount) {
            if ($this->discount->percentage > 0) {
                $discount = $this->discount->percentage / 100;
                return round(($curr_price * $qty) * $discount);
            }
        }

        return 0;
    }

    public function getTaxAmountAttribute()
    {
        $curr_price = $this->price > 0 ? $this->price : $this->price_product;
        $qty = $this->price > 0 ? 1 : $this->qty;
        if ($this->tax) {
            if ($this->tax->tax_percentage > 0) {
                if ($this->discount_amount > 0) {
                    $tax = $this->tax->tax_percentage / 100;
                    $price = ($curr_price * $qty) - $this->discount_amount;
                    return round($price * $tax);
                } else {
                    $tax = $this->tax->tax_percentage / 100;
                    return round($curr_price * $qty * $tax);
                }
            }
        }

        return 0;
    }

    public function getTotalAttribute()
    {
        if ($this->price > 0) {
            $curr_price = $this->price;
            $price = $curr_price;
            return round(($price - $this->discount_amount) + $this->tax_amount);
        }

        $curr_price = $this->price_product;
        $price = $curr_price * $this->qty;
        return round(($price - $this->discount_amount) + $this->tax_amount);
    }

    public function getPriceNegoAttribute()
    {
        if ($this->discount_amount > 0) {
            if ($this->product) {
                $price = $this->price_product * $this->qty;
                $final_price  = $price + $this->tax_amount - $this->discount_amount;
                return round($final_price);
            }
        }

        return $this->price ?? 0;
    }

    public function getFinalPriceAttribute()
    {
        if ($this->discount_amount > 0) {
            if ($this->product) {
                $price = $this->price_product * $this->qty;
                $final_price  = $price + $this->tax_amount - $this->discount_amount;
                return round($final_price);
            }
        }

        if ($this->price > 0) {
            return $this->price + $this->tax_amount;
        }

        return $this->price_product * $this->qty;
    }

    public function getSubtotalAttribute()
    {
        if ($this->price > 0) {
            $curr_price = $this->price;
            return $curr_price;
        }
        $curr_price = $this->price_product;
        return $curr_price * $this->qty;
    }

    public function getMarginPriceAttribute()
    {
        $price = $this->product?->margin_price;

        return $price * $this->qty;
    }

    public function getDiscountPercentAttribute()
    {
        if ($this->discount) {
            return round($this->discount->percentage / 100);
        }

        return 0;
    }

    public function getTaxPercentageAttribute()
    {
        if ($this->tax) {
            return round($this->tax->tax_percentage / 100);
        }

        return 0;
    }

    public function getPpnAttribute()
    {
        if ($this->tax) {
            return $this->tax->tax_percentage;
        }

        return 0;
    }

    public function getUOfMAttribute()
    {
        $sku = SkuMaster::where('sku', $this->product?->sku)->first();

        return $sku?->package_name ?? '-';
    }

    public function getDisabledDiscountAttribute()
    {
        if ($this->price > 0) {
            return true;
        }

        return false;
    }

    public function getDisabledPriceNegoAttribute()
    {
        if ($this->discount_amount > 0) {
            return true;
        }

        return false;
    }
}
