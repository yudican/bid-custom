<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionDetail extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $appends = ['rating', 'comment'];
    /**
     * Get the product that owns the TransactionDetail
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function product()
    {
        return $this->belongsTo(Product::class)->whereNull('deleted_at');
    }

    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id')->whereNull('deleted_at');
    }

    /**
     * Get the transaction that owns the TransactionDetail
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    /**
     * Get the transaction that owns the TransactionDetail
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function transaction_agents()
    {
        return $this->belongsTo(TransactionAgent::class);
    }

    public function getRatingAttribute()
    {
        $comment = CommentRating::whereHas('transaction', function ($query) {
            return $query->whereHas('transactionDetail');
        });
        if ($comment->first()) {
            return number_format($comment->avg('rate'), 1);
        }
        return 0;
    }

    public function getCommentAttribute()
    {
        $comment = CommentRating::whereHas('transaction', function ($query) {
            return $query->whereHas('transactionDetail');
        });
        if ($comment->first()) {
            return $comment->first()->comment;
        }
        return '';
    }

    /**
     * Get the variant that owns the TransactionDetail
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }
}
