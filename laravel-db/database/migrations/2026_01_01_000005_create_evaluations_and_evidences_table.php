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
        // 7. Table evaluations (Header Penilaian Mandiri Instansi per Tahun)
        Schema::create('evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_unit_id')->constrained('work_units')->cascadeOnDelete();
            $table->foreignId('evaluator_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->integer('year');
            $table->decimal('final_index_pemdi', 4, 2)->default(0.00);
            $table->string('predicate')->nullable(); // Kurang, Cukup, Baik, Sangat Baik, Memuaskan
            $table->enum('status', ['draft', 'submitted', 'verified'])->default('draft');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['work_unit_id', 'year']);
        });

        // 8. Table evaluation_details (Jawaban Per Indikator: Pilihan Level & Catatan)
        Schema::create('evaluation_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evaluation_id')->constrained('evaluations')->cascadeOnDelete();
            $table->foreignId('indicator_id')->constrained('indicators')->cascadeOnDelete();
            $table->foreignId('selected_level_id')->nullable()->constrained('maturity_levels')->nullOnDelete();
            $table->decimal('assessed_score', 4, 2)->default(1.00);
            $table->longText('explanation_notes')->nullable();
            $table->timestamps();

            $table->unique(['evaluation_id', 'indicator_id']);
        });

        // 9. Table evidence_files (Upload File Bukti Dukung Pengguna)
        Schema::create('evidence_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evaluation_detail_id')->constrained('evaluation_details')->cascadeOnDelete();
            $table->string('original_name');
            $table->string('stored_name');
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('file_size')->default(0);
            $table->string('file_url');
            $table->text('description')->nullable();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evidence_files');
        Schema::dropIfExists('evaluation_details');
        Schema::dropIfExists('evaluations');
    }
};
