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
        Schema::create('inventory_detail_items', function (Blueprint $table) {
            $table->id();
            $table->string('uid_inventory');
            $table->foreignId('product_id');
            $table->foreignId('from_warehouse_id')->nullable();
            $table->foreignId('to_warehouse_id')->nullable();
            $table->string('sku')->nullable();
            $table->string('u_of_m')->nullable();
            $table->integer('qty')->nullable();
            $table->integer('qty_alocation')->nullable();
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
        Schema::dropIfExists('inventory_detail_items');
    }
};
