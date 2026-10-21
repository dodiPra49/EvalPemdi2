const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../config/db');

// Setup storage path
const storageDir = path.join(__dirname, '../../storage/evidences');
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, storageDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'evidence-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 30 * 1024 * 1024 } // 30 MB max
});

// Helper: Calculate Permenpan 8/2026 Predicate
function getPredicate(index) {
  const num = parseFloat(index);
  if (num > 4.00) return 'Memuaskan / Unggul (Leading)';
  if (num > 3.50) return 'Sangat Baik / Melembaga (Embedded)';
  if (num > 2.50) return 'Baik / Berkembang (Developing)';
  if (num > 1.50) return 'Cukup / Membangun (Emerging)';
  return 'Kurang / Merintis';
}

// ==========================================
// 1. GET EVALUASI AKTIF / REALTIME
// ==========================================
// GET /api/v1/evaluations/current?work_unit_id=1&year=2026
router.get('/current', async (req, res) => {
  try {
    const workUnitId = parseInt(req.query.work_unit_id || '1', 10);
    const year = parseInt(req.query.year || '2026', 10);

    // 1. Dapatkan atau buat header evaluasi tahun ini
    let [evalRows] = await pool.query(
      `SELECT e.*, w.name AS unit_name, w.code AS unit_code
       FROM evaluations e
       JOIN work_units w ON e.work_unit_id = w.id
       WHERE e.work_unit_id = ? AND e.year = ? LIMIT 1`,
      [workUnitId, year]
    );

    let evaluation = null;
    if (evalRows.length === 0) {
      // Buat inisialisasi draft evaluasi untuk OPD ini
      const [insertRes] = await pool.query(
        `INSERT INTO evaluations (work_unit_id, year, final_index_pemdi, predicate, status, created_at, updated_at)
         VALUES (?, ?, 3.00, 'Baik / Berkembang (Developing)', 'draft', NOW(), NOW())`,
        [workUnitId, year]
      );

      const [newRows] = await pool.query(
        `SELECT e.*, w.name AS unit_name, w.code AS unit_code
         FROM evaluations e
         JOIN work_units w ON e.work_unit_id = w.id
         WHERE e.id = ?`,
        [insertRes.insertId]
      );
      evaluation = newRows[0];
    } else {
      evaluation = evalRows[0];
    }

    // 2. Ambil seluruh rincian jawaban (evaluation_details)
    const [details] = await pool.query(
      `SELECT ed.id, ed.evaluation_id, ed.indicator_id, ed.selected_level_id,
              ed.assessed_score, ed.explanation_notes,
              i.indicator_number, ml.level_number
       FROM evaluation_details ed
       JOIN indicators i ON ed.indicator_id = i.id
       LEFT JOIN maturity_levels ml ON ed.selected_level_id = ml.id
       WHERE ed.evaluation_id = ?`,
      [evaluation.id]
    );

    // 3. Ambil seluruh berkas bukti dukung (evidence_files)
    const [evidences] = await pool.query(
      `SELECT ef.id, ef.evaluation_detail_id, ef.original_name, ef.stored_name,
              ef.file_size, ef.file_url, ef.description, ef.created_at,
              u.name AS uploader_name, ed.indicator_id, i.indicator_number
       FROM evidence_files ef
       JOIN evaluation_details ed ON ef.evaluation_detail_id = ed.id
       JOIN indicators i ON ed.indicator_id = i.id
       LEFT JOIN users u ON ef.uploaded_by = u.id
       WHERE ed.evaluation_id = ?`,
      [evaluation.id]
    );

    // Format map answers { [indicator_number]: { level, notes } }
    const answersMap = {};
    details.forEach((d) => {
      answersMap[d.indicator_number] = {
        level: d.level_number || Math.round(parseFloat(d.assessed_score)) || 3,
        notes: d.explanation_notes || ''
      };
    });

    // Format map evidences { [indicator_number]: [ fileObj ] }
    const evidencesMap = {};
    evidences.forEach((ev) => {
      if (!evidencesMap[ev.indicator_number]) {
        evidencesMap[ev.indicator_number] = [];
      }
      const sizeMB = (ev.file_size / (1024 * 1024)).toFixed(2);
      evidencesMap[ev.indicator_number].push({
        id: ev.id,
        name: ev.original_name,
        size: `${sizeMB} MB`,
        uploadedAt: new Date(ev.created_at).toISOString().replace('T', ' ').substring(0, 16),
        uploader: ev.uploader_name || 'Operator Diskominfo',
        description: ev.description || 'Bukti dukung pemenuhan indikator',
        url: ev.file_url
      });
    });

    res.json({
      status: 'success',
      data: {
        evaluation: {
          id: evaluation.id,
          workUnitId: evaluation.work_unit_id,
          workUnitName: evaluation.unit_name,
          year: evaluation.year,
          finalIndex: parseFloat(evaluation.final_index_pemdi).toFixed(2),
          predicate: evaluation.predicate || getPredicate(evaluation.final_index_pemdi),
          status: evaluation.status
        },
        answers: answersMap,
        uploadedFiles: evidencesMap
      }
    });
  } catch (error) {
    console.error('[GET EVALUATION CURRENT ERROR]', error);
    res.status(500).json({ status: 'error', message: 'Gagal memuat status evaluasi saat ini.' });
  }
});

// ==========================================
// 2. SIMPAN DRAF PENILAIAN MANDIRI
// ==========================================
// POST /api/v1/evaluations/save-draft
router.post('/save-draft', async (req, res) => {
  try {
    const { work_unit_id, year, answers } = req.body;
    const targetUnitId = parseInt(work_unit_id || '1', 10);
    const targetYear = parseInt(year || '2026', 10);

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ status: 'error', message: 'Data jawaban penilaian tidak valid.' });
    }

    // 1. Cari atau buat evaluation header
    let [evalRows] = await pool.query(
      `SELECT id FROM evaluations WHERE work_unit_id = ? AND year = ? LIMIT 1`,
      [targetUnitId, targetYear]
    );

    let evaluationId = null;
    if (evalRows.length === 0) {
      const [insertRes] = await pool.query(
        `INSERT INTO evaluations (work_unit_id, year, status, created_at, updated_at)
         VALUES (?, ?, 'draft', NOW(), NOW())`,
        [targetUnitId, targetYear]
      );
      evaluationId = insertRes.insertId;
    } else {
      evaluationId = evalRows[0].id;
    }

    // 2. Ambil seluruh indikator dan bobotnya
    const [indicators] = await pool.query(`SELECT id, indicator_number, weight FROM indicators`);
    const [levels] = await pool.query(`SELECT id, indicator_id, level_number FROM maturity_levels`);

    let totalWeightedScore = 0;

    // 3. Loop simpan evaluation_details
    for (const ind of indicators) {
      const userAns = answers[ind.indicator_number] || { level: 3, notes: '' };
      const selectedLevelNum = parseInt(userAns.level || 3, 10);
      const userNotes = userAns.notes || '';

      const matchedLevel = levels.find(
        (l) => l.indicator_id === ind.id && l.level_number === selectedLevelNum
      );
      const levelId = matchedLevel ? matchedLevel.id : null;

      // Hitung bobot per indikator
      totalWeightedScore += (parseFloat(ind.weight) / 100.0) * selectedLevelNum;

      // Upsert evaluation_details
      await pool.query(
        `INSERT INTO evaluation_details 
          (evaluation_id, indicator_id, selected_level_id, assessed_score, explanation_notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE
          selected_level_id = VALUES(selected_level_id),
          assessed_score = VALUES(assessed_score),
          explanation_notes = VALUES(explanation_notes),
          updated_at = NOW()`,
        [evaluationId, ind.id, levelId, selectedLevelNum, userNotes]
      );
    }

    const finalIndex = totalWeightedScore.toFixed(2);
    const predicate = getPredicate(finalIndex);

    // 4. Update index dan predikat pada evaluation header
    await pool.query(
      `UPDATE evaluations 
       SET final_index_pemdi = ?, predicate = ?, status = 'draft', updated_at = NOW()
       WHERE id = ?`,
      [finalIndex, predicate, evaluationId]
    );

    res.json({
      status: 'success',
      message: 'Draf penilaian mandiri berhasil disimpan ke basis data.',
      data: {
        evaluationId,
        finalIndex,
        predicate
      }
    });
  } catch (error) {
    console.error('[SAVE DRAFT ERROR]', error);
    res.status(500).json({ status: 'error', message: 'Gagal menyimpan draf penilaian mandiri.' });
  }
});

// ==========================================
// 3. KIRIM EVALUASI MANDIRI (SUBMIT)
// ==========================================
// POST /api/v1/evaluations/submit
router.post('/submit', async (req, res) => {
  try {
    const { work_unit_id, year } = req.body;
    const targetUnitId = parseInt(work_unit_id || '1', 10);
    const targetYear = parseInt(year || '2026', 10);

    await pool.query(
      `UPDATE evaluations 
       SET status = 'submitted', updated_at = NOW()
       WHERE work_unit_id = ? AND year = ?`,
      [targetUnitId, targetYear]
    );

    res.json({
      status: 'success',
      message: 'Hasil penilaian mandiri berhasil dikirim ke Koordinator Pemdi untuk verifikasi dokumen.'
    });
  } catch (error) {
    console.error('[SUBMIT EVALUATION ERROR]', error);
    res.status(500).json({ status: 'error', message: 'Gagal mengirim evaluasi.' });
  }
});

// ==========================================
// 4. UPLOAD BUKTI DUKUNG
// ==========================================
// POST /api/v1/evaluations/upload-evidence
router.post('/upload-evidence', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'File dokumen bukti dukung wajib diunggah.' });
    }

    const indicatorNumber = parseInt(req.body.indicator_number || '1', 10);
    const description = req.body.description || 'Bukti dukung pemenuhan indikator';
    const workUnitId = parseInt(req.body.work_unit_id || '1', 10);
    const year = parseInt(req.body.year || '2026', 10);
    const userId = parseInt(req.body.user_id || '4', 10); // default operator user

    // 1. Dapatkan evaluation_id
    let [evalRows] = await pool.query(
      'SELECT id FROM evaluations WHERE work_unit_id = ? AND year = ? LIMIT 1',
      [workUnitId, year]
    );

    let evaluationId = null;
    if (evalRows.length === 0) {
      const [insertRes] = await pool.query(
        'INSERT INTO evaluations (work_unit_id, year, status, created_at, updated_at) VALUES (?, ?, "draft", NOW(), NOW())',
        [workUnitId, year]
      );
      evaluationId = insertRes.insertId;
    } else {
      evaluationId = evalRows[0].id;
    }

    // 2. Dapatkan indicator_id
    const [indRows] = await pool.query(
      'SELECT id FROM indicators WHERE indicator_number = ? LIMIT 1',
      [indicatorNumber]
    );
    if (indRows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Indikator tidak ditemukan.' });
    }
    const indicatorId = indRows[0].id;

    // 3. Dapatkan atau buat evaluation_detail
    let [detailRows] = await pool.query(
      'SELECT id FROM evaluation_details WHERE evaluation_id = ? AND indicator_id = ? LIMIT 1',
      [evaluationId, indicatorId]
    );

    let detailId = null;
    if (detailRows.length === 0) {
      const [insertDetail] = await pool.query(
        `INSERT INTO evaluation_details (evaluation_id, indicator_id, assessed_score, created_at, updated_at)
         VALUES (?, ?, 3.00, NOW(), NOW())`,
        [evaluationId, indicatorId]
      );
      detailId = insertDetail.insertId;
    } else {
      detailId = detailRows[0].id;
    }

    // 4. Simpan ke evidence_files
    const fileUrl = `/storage/evidences/${req.file.filename}`;
    const [insertEv] = await pool.query(
      `INSERT INTO evidence_files 
        (evaluation_detail_id, original_name, stored_name, mime_type, file_size, file_url, description, uploaded_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [detailId, req.file.originalname, req.file.filename, req.file.mimetype, req.file.size, fileUrl, description, userId]
    );

    const sizeMB = (req.file.size / (1024 * 1024)).toFixed(2);
    res.status(201).json({
      status: 'success',
      message: 'Berkas bukti dukung berhasil diunggah.',
      data: {
        id: insertEv.insertId,
        indicatorNumber,
        name: req.file.originalname,
        size: `${sizeMB} MB`,
        uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        uploader: 'Operator Dinas Kominfo',
        description,
        url: fileUrl
      }
    });
  } catch (error) {
    console.error('[UPLOAD EVIDENCE ERROR]', error);
    res.status(500).json({ status: 'error', message: 'Gagal mengunggah berkas bukti dukung.' });
  }
});

// ==========================================
// 5. HAPUS BUKTI DUKUNG
// ==========================================
// DELETE /api/v1/evaluations/evidence/:id
router.delete('/evidence/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query('SELECT stored_name FROM evidence_files WHERE id = ?', [id]);
    if (rows.length > 0) {
      const filePath = path.join(storageDir, rows[0].stored_name);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await pool.query('DELETE FROM evidence_files WHERE id = ?', [id]);
    res.json({ status: 'success', message: 'Berkas bukti dukung berhasil dihapus.' });
  } catch (error) {
    console.error('[DELETE EVIDENCE ERROR]', error);
    res.status(500).json({ status: 'error', message: 'Gagal menghapus berkas bukti dukung.' });
  }
});

// ==========================================
// 6. DASHBOARD SUMMARY UNTUK ADMIN
// ==========================================
// GET /api/v1/evaluations/dashboard-summary
router.get('/dashboard-summary', async (req, res) => {
  try {
    const [[opdCount]] = await pool.query('SELECT COUNT(*) AS total FROM work_units');
    const [[userCount]] = await pool.query('SELECT COUNT(*) AS total FROM users');
    const [[evCount]] = await pool.query('SELECT COUNT(*) AS total FROM evidence_files');
    const [[avgScore]] = await pool.query(
      'SELECT AVG(final_index_pemdi) AS avg_index FROM evaluations WHERE year = 2026'
    );

    // Ambil rincian progres tiap OPD
    const [unitList] = await pool.query(
      `SELECT w.id, w.code, w.name, w.pic_name,
              e.final_index_pemdi, e.status AS eval_status,
              (SELECT COUNT(DISTINCT ed.indicator_id) 
               FROM evaluation_details ed 
               JOIN evaluations ev ON ed.evaluation_id = ev.id 
               WHERE ev.work_unit_id = w.id AND ev.year = 2026) AS answered_count
       FROM work_units w
       LEFT JOIN evaluations e ON e.work_unit_id = w.id AND e.year = 2026
       ORDER BY w.id ASC`
    );

    const formattedUnits = unitList.map((u) => {
      const answered = u.answered_count || 0;
      const progress = Math.min(100, Math.round((answered / 20) * 100));

      return {
        id: u.id,
        code: u.code,
        name: u.name,
        pic: u.pic_name || 'Kepala Unit',
        progress,
        status: progress === 100 ? 'Siap Verifikasi' : 'Dalam Proses',
        finalIndex: u.final_index_pemdi ? parseFloat(u.final_index_pemdi).toFixed(2) : '0.00'
      };
    });

    const averageIndex = avgScore.avg_index ? parseFloat(avgScore.avg_index).toFixed(2) : '3.25';

    res.json({
      status: 'success',
      data: {
        totalOpd: `${opdCount.total} OPD`,
        totalUsers: `${userCount.total} User`,
        totalEvidences: `${evCount.total} Berkas`,
        averageIndex: averageIndex,
        predicate: getPredicate(averageIndex),
        units: formattedUnits
      }
    });
  } catch (error) {
    console.error('[DASHBOARD SUMMARY ERROR]', error);
    res.status(500).json({ status: 'error', message: 'Gagal memuat ringkasan dashboard.' });
  }
});

module.exports = router;
