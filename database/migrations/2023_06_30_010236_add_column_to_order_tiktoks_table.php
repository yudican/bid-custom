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
        Schema::table('order_tiktoks', function (Blueprint $table) {
            $table->string('total_amount')->nullable();
            $table->string('shipping_fee')->nullable();
            $table->string('order_status')->nullable();
            $table->text('full_address')->nullable();
            $table->string('city')->nullable();
            $table->string('district')->nullable();
            $table->string('region')->nullable();
            $table->string('state')->nullable();
            $table->string('town')->nullable();
            $table->string('zipcode')->nullable();
            $table->string('buyer_name')->nullable();
            $table->string('buyer_phone')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('order_tiktoks', function (Blueprint $table) {
            $table->dropColumn('total_amount');
            $table->dropColumn('shipping_fee');
            $table->dropColumn('order_status');
            $table->dropColumn('full_address');
            $table->dropColumn('city');
            $table->dropColumn('district');
            $table->dropColumn('region');
            $table->dropColumn('state');
            $table->dropColumn('town');
            $table->dropColumn('zipcode');
            $table->dropColumn('buyer_name');
            $table->dropColumn('buyer_phone');
        });
    }
};
