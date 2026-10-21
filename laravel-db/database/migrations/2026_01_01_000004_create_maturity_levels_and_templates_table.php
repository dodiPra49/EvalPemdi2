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
        // 5. Table maturity_levels (Level Kematangan tiap Indikator: Kurang, Cukup, Baik, Sangat Baik, Memuaskan)
        Schema::create('maturity_levels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('indicator_id')->constrained('indicators')->cascadeOnDelete();
            $table->tinyInteger('level_number'); // 1 s/d 5
            $table->string('level_name'); // Kurang/Merintis, Cukup/Membangun, Baik/Berkembang, Sangat Baik/Melembaga, Memuaskan/Unggul
            $table->decimal('score_range_min', 4, 2);
            $table->decimal('score_range_max', 4, 2);
            $table->longText('criteria_description'); // Teks Kriteria Kematangan lengkap dari Permenpan 8/2026
            $table->timestamps();

            $table->unique(['indicator_id', 'level_number']);
        });

        // 6. Table maturity_templates (Template File Bukti Dukung: DOCX / XLSX / PDF)
        Schema::create('maturity_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('indicator_id')->constrained('indicators')->cascadeOnDelete();
            $table->foreignId('maturity_level_id')->nullable()->constrained('maturity_levels')->nullOnDelete();
            $table->string('title');
            $table->enum('document_type', ['docx', 'xlsx', 'pdf'])->default('docx');
            $table->string('file_path');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maturity_templates');
        Schema::dropIfExists('maturity_levels');
    }
};
