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
        // 3. Table aspects (7 Aspek Evaluasi Pemdi Permenpan RB 8/2026)
        Schema::create('aspects', function (Blueprint $table) {
            $table->id();
            $table->string('code', 20)->unique();
            $table->string('name');
            $table->decimal('weight', 5, 2); // e.g. 10.00, 15.00, 25.00
            $table->integer('order_index')->default(1);
            $table->timestamps();
        });

        // 4. Table indicators (20 Indikator Evaluasi Pemdi)
        Schema::create('indicators', function (Blueprint $table) {
            $table->id();
            $table->foreignId('aspect_id')->constrained('aspects')->cascadeOnDelete();
            $table->integer('indicator_number')->unique();
            $table->string('name');
            $table->decimal('weight', 5, 2); // e.g. 5.00, 4.00, 3.00, 10.00, 15.00
            $table->text('description')->nullable();
            $table->text('supervisor_agency')->nullable(); // Instansi Pembina (KemenPANRB, BSSN, Komdigi, Bappenas, dll)
            $table->text('responsible_functions')->nullable(); // Peran Fungsi di Instansi
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('indicators');
        Schema::dropIfExists('aspects');
    }
};
