<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('academic_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_month_id')->constrained()->cascadeOnDelete();
            $table->string('date_string')->nullable();
            $table->string('name');
            $table->string('description')->nullable();
            $table->boolean('is_committee_program')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_activities');
    }
};
