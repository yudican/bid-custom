<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('settlement_tiktoks', function (Blueprint $table) {
            $table->id();
            $table->string('tiktok_settlement_id')->nullable();
            $table->string('order_id')->nullable();
            $table->string('fee_type')->nullable();
            $table->string('currency')->nullable();
            $table->string('flat_fee')->nullable();
            $table->string('platform_promotion')->nullable();
            $table->string('sales_fee')->nullable();
            $table->string('settlement_amount')->nullable();
            $table->string('settlement_time')->nullable();
            $table->string('sfp_service_fee')->nullable();
            $table->string('subtotal_after_seller_discounts')->nullable();
            $table->string('user_pay')->nullable();
            $table->string('vat')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('settlement_tiktoks');
    }
};
