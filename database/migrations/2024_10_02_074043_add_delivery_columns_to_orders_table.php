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
        Schema::table('orders', function (Blueprint $table) {
            $table->float('delivery_fee')->nullable();
            $table->string('delivery_type')->nullable();
            $table->integer('econt_city_id')->nullable();
            $table->integer('econt_office_id')->nullable();
            $table->integer('econt_street_id')->nullable();
            $table->string('econt_street_number')->nullable();
            $table->string('econt_entrance')->nullable();
            $table->string('econt_floor')->nullable();
            $table->string('econt_apartment_number')->nullable();
            $table->string('econt_label')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('delivery_fee');
            $table->dropColumn('delivery_type');
            $table->dropColumn('econt_city_id');
            $table->dropColumn('econt_office_id');
            $table->dropColumn('econt_street_id');
            $table->dropColumn('econt_street_number');
            $table->dropColumn('econt_entrance');
            $table->dropColumn('econt_floor');
            $table->dropColumn('econt_apartment_number');
            $table->dropColumn('econt_label');
        });
    }
};
