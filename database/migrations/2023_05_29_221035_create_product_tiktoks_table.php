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
        Schema::create('product_tiktoks', function (Blueprint $table) {
            $table->id();
            $table->string('tiktok_product_id')->nullable();
            $table->string('name')->nullable();
            $table->string('sku_id')->nullable();
            $table->string('currency')->nullable();
            $table->double('price')->nullable();
            $table->string('seller_sku')->nullable();
            $table->string('status')->nullable();
            $table->string('create_time')->nullable();
            $table->string('update_time')->nullable();
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
        Schema::dropIfExists('product_tiktoks');
    }
};
