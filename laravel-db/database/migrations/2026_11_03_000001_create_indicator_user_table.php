<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('indicator_user', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('indicator_id')->constrained()->cascadeOnDelete();
            $table->primary(['user_id', 'indicator_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('indicator_user');
    }
};
