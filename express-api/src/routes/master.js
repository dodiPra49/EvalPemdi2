const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { authenticateToken, requireRole } = require('../middlewares/auth');

// ==========================================
// 1. ASPEK & INDIKATOR (Permenpan RB 8/2026)
// ==========================================

// GET /api/v1/master/aspects
router.get('/aspects', async (req, res) => {
  try {
    const [aspects] = await pool.query(
      `SELECT id, code, name, weight, order_index FROM aspects ORDER BY order_index ASC`
    );
    res.json({ status: 'success', data: aspects });
  } catch (error) {
    console.error('[MASTER ASPECTS ERROR]', error);
    res.status(500).json({ status: 'error', message: 'Gagal memuat data aspek.' });
  }
});

// GET /api/v1/master/indicators
router.get('/indicators', async (req, res) => {
  try {
    const { unit_code, unit, unit_id } = req.query;

    let targetIndicator = null;
    const isBkpsdmQuery = (unit_code && unit_code.toUpperCase().includes('BKPSDM')) ||
                          (unit && unit.toUpperCase().includes('BKPSDM')) ||
                          (unit && unit.toLowerCase().includes('kepegawaian'));

    if (isBkpsdmQuery) {
      targetIndicator = 3;
    } else if (unit_id) {
      const [uRows] = await pool.query('SELECT code, name FROM work_units WHERE id = ?', [unit_id]);
      if (uRows.length > 0) {
        const u = uRows[0];
        if (u.code?.toUpperCase().includes('BKPSDM') || u.name?.toUpperCase().includes('BKPSDM') || u.name?.toLowerCase().includes('kepegawaian')) {
          targetIndicator = 3;
        }
      }
    }

    let queryStr = `
      SELECT i.id, i.indicator_number, i.aspect_id, i.name, i.weight,
             i.description, i.supervisor_agency, i.responsible_functions,
             a.name AS aspect_name
      FROM indicators i
      JOIN aspects a ON i.aspect_id = a.id
    `;
    const params = [];
    if (targetIndicator) {
      queryStr += ` WHERE i.indicator_number = ?`;
      params.push(targetIndicator);
    }
    queryStr += ` ORDER BY i.indicator_number ASC`;

    // 1. Ambil Indikator (semua atau difilter khusus unit kerja)
    const [indicators] = await pool.query(queryStr, params);

    // 2. Ambil seluruh Level Kematangan
    const [levels] = await pool.query(
      `SELECT id, indicator_id, level_number, level_name, score_range_max, criteria_description
       FROM maturity_levels
       ORDER BY indicator_id ASC, level_number ASC`
    );

    // 3. Ambil seluruh Master Template Dokumen Bukti Dukung
    const [templates] = await pool.query(
      `SELECT id, indicator_id, maturity_level_id, title, document_type, file_path
       FROM maturity_templates
       ORDER BY indicator_id ASC, id ASC`
    );

    // Grouping structure untuk Frontend
    const formatted = indicators.map((ind) => {
      const indLevels = levels.filter((l) => l.indicator_id === ind.id);
      const levelsMap = {};

      indLevels.forEach((lvl) => {
        const lvlTemplates = templates
          .filter((t) => t.indicator_id === ind.id && (t.maturity_level_id === lvl.id || !t.maturity_level_id))
          .map((t) => ({
            id: t.id,
            title: t.title,
            type: t.document_type,
            file: t.file_path
          }));

        levelsMap[lvl.level_number] = {
          id: lvl.id,
          name: lvl.level_name,
          score: parseFloat(lvl.score_range_max) || parseFloat(lvl.level_number),
          criteria: lvl.criteria_description,
          templates: lvlTemplates
        };
      });

      return {
        id: ind.id,
        number: ind.indicator_number,
        aspectId: ind.aspect_id,
        aspectName: ind.aspect_name,
        name: ind.name,
        weight: parseFloat(ind.weight),
        description: ind.description,
        supervisor: ind.supervisor_agency,
        roles: ind.responsible_functions,
        levels: levelsMap
      };
    });

    res.json({ status: 'success', data: formatted });
  } catch (error) {
    console.error('[MASTER INDICATORS ERROR]', error);
    res.status(500).json({ status: 'error', message: 'Gagal memuat data indikator dan kriteria.' });
  }
});

// ==========================================
// 2. MASTER PENGGUNA (USERS)
// ==========================================

// GET /api/v1/master/users
router.get('/users', async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT u.id, u.name, u.nip, u.email, u.role, u.status, u.work_unit_id,
              w.name AS unit_name, w.code AS unit_code
       FROM users u
       LEFT JOIN work_units w ON u.work_unit_id = w.id
       ORDER BY u.id ASC`
    );

    const formatted = users.map(u => ({
      id: u.id,
      name: u.name,
      nip: u.nip || '-',
      email: u.email,
      role: u.role,
      roleLabel: u.role.replace('_', ' ').toUpperCase(),
      unit: u.unit_name || 'Sekretariat Daerah',
      unit_id: u.work_unit_id,
      status: u.status
    }));

    res.json({ status: 'success', data: formatted });
  } catch (error) {
    console.error('[MASTER USERS ERROR]', error);
    res.status(500).json({ status: 'error', message: 'Gagal memuat daftar pengguna.' });
  }
});

// POST /api/v1/master/users
router.post('/users', async (req, res) => {
  try {
    const { name, nip, email, password, role, unit_id, status } = req.body;

    if (!name || !email) {
      return res.status(400).json({ status: 'error', message: 'Nama dan email wajib diisi.' });
    }

    // Check duplicate email
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ status: 'error', message: 'Email sudah terdaftar.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'password123', salt);

    const [result] = await pool.query(
      `INSERT INTO users (name, nip, email, password, role, work_unit_id, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, nip || null, email, hashedPassword, role || 'pelaksana_entri', unit_id || 1, status || 'active']
    );

    res.status(201).json({
      status: 'success',
      message: 'Pengguna baru berhasil ditambahkan.',
      data: { id: result.insertId, name, email, role }
    });
  } catch (error) {
    console.error('[ADD USER ERROR]', error);
    res.status(500).json({ status: 'error', message: 'Gagal menambahkan pengguna baru.' });
  }
});

// PUT /api/v1/master/users/:id
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nip, email, role, unit_id, status, password } = req.body;

    let query = `UPDATE users SET name = ?, nip = ?, email = ?, role = ?, work_unit_id = ?, status = ?, updated_at = NOW()`;
    const params = [name, nip || null, email, role, unit_id || 1, status || 'active'];

    if (password && password.trim().length > 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      query += `, password = ?`;
      params.push(hashedPassword);
    }

    query += ` WHERE id = ?`;
    params.push(id);

    await pool.query(query, params);
    res.json({ status: 'success', message: 'Data pengguna berhasil diperbarui.' });
  } catch (error) {
    console.error('[UPDATE USER ERROR]', error);
    res.status(500).json({ status: 'error', message: 'Gagal memperbarui data pengguna.' });
  }
});

// DELETE /api/v1/master/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ status: 'success', message: 'Pengguna berhasil dihapus.' });
  } catch (error) {
    console.error('[DELETE USER ERROR]', error);
    res.status(500).json({ status: 'error', message: 'Gagal menghapus pengguna.' });
  }
});

// ==========================================
// 3. MASTER UNIT KERJA / OPD (WORK UNITS)
// ==========================================

// GET /api/v1/master/work-units
router.get('/work-units', async (req, res) => {
  try {
    const [units] = await pool.query(
      `SELECT w.id, w.code, w.name, w.category, w.pic_name, w.pic_contact,
              (SELECT COUNT(*) FROM users u WHERE u.work_unit_id = w.id) AS users_count,
              (SELECT e.final_index_pemdi FROM evaluations e WHERE e.work_unit_id = w.id AND e.year = 2026 LIMIT 1) AS final_index,
              (SELECT e.status FROM evaluations e WHERE e.work_unit_id = w.id AND e.year = 2026 LIMIT 1) AS eval_status,
              (SELECT COUNT(DISTINCT ed.indicator_id) 
               FROM evaluation_details ed 
               JOIN evaluations e ON ed.evaluation_id = e.id 
               WHERE e.work_unit_id = w.id AND e.year = 2026) AS answered_count
       FROM work_units w
       ORDER BY w.id ASC`
    );

    const formatted = units.map(u => {
      const answered = u.answered_count || 0;
      const progressPercent = Math.min(100, Math.round((answered / 20) * 100));

      return {
        id: u.id,
        code: u.code,
        name: u.name,
        category: u.category,
        pic: u.pic_name || 'Belum Ditentukan',
        contact: u.pic_contact || 'kontak@pemdi.go.id',
        usersCount: u.users_count || 0,
        progress: progressPercent,
        finalIndex: u.final_index ? parseFloat(u.final_index).toFixed(2) : '0.00',
        evalStatus: u.eval_status || 'draft'
      };
    });

    res.json({ status: 'success', data: formatted });
  } catch (error) {
    console.error('[MASTER WORK UNITS ERROR]', error);
    res.status(500).json({ status: 'error', message: 'Gagal memuat data perangkat daerah.' });
  }
});

// POST /api/v1/master/work-units
router.post('/work-units', async (req, res) => {
  try {
    const { code, name, category, pic, contact } = req.body;

    if (!code || !name) {
      return res.status(400).json({ status: 'error', message: 'Kode dan nama unit kerja wajib diisi.' });
    }

    const [result] = await pool.query(
      `INSERT INTO work_units (code, name, category, pic_name, pic_contact, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [code.toUpperCase(), name, category || 'Daerah', pic || null, contact || null]
    );

    res.status(201).json({
      status: 'success',
      message: 'Perangkat daerah baru berhasil ditambahkan.',
      data: { id: result.insertId, code, name }
    });
  } catch (error) {
    console.error('[ADD WORK UNIT ERROR]', error);
    res.status(500).json({ status: 'error', message: 'Gagal menambahkan unit kerja.' });
  }
});

// PUT /api/v1/master/work-units/:id
router.put('/work-units/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, category, pic, contact } = req.body;

    await pool.query(
      `UPDATE work_units 
       SET code = ?, name = ?, category = ?, pic_name = ?, pic_contact = ?, updated_at = NOW()
       WHERE id = ?`,
      [code.toUpperCase(), name, category, pic, contact, id]
    );

    res.json({ status: 'success', message: 'Data perangkat daerah berhasil diperbarui.' });
  } catch (error) {
    console.error('[UPDATE WORK UNIT ERROR]', error);
    res.status(500).json({ status: 'error', message: 'Gagal memperbarui unit kerja.' });
  }
});

// DELETE /api/v1/master/work-units/:id
router.delete('/work-units/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM work_units WHERE id = ?', [id]);
    res.json({ status: 'success', message: 'Perangkat daerah berhasil dihapus.' });
  } catch (error) {
    console.error('[DELETE WORK UNIT ERROR]', error);
    res.status(500).json({ status: 'error', message: 'Gagal menghapus unit kerja.' });
  }
});

// ==========================================
// 4. MASTER TEMPLATES BUKTI DUKUNG
// ==========================================

// GET /api/v1/master/templates
router.get('/templates', async (req, res) => {
  try {
    const [templates] = await pool.query(
      `SELECT mt.id, mt.indicator_id, mt.maturity_level_id, mt.title,
              mt.document_type, mt.file_path, mt.created_at,
              i.indicator_number, i.name AS indicator_name,
              ml.level_name
       FROM maturity_templates mt
       JOIN indicators i ON mt.indicator_id = i.id
       LEFT JOIN maturity_levels ml ON mt.maturity_level_id = ml.id
       ORDER BY i.indicator_number ASC, mt.id ASC`
    );

    const formatted = templates.map(t => ({
      id: t.id,
      indicatorId: t.indicator_id,
      indicatorNumber: t.indicator_number,
      indicatorName: t.indicator_name,
      levelName: t.level_name || 'Semua Level Kematangan',
      title: t.title,
      type: t.document_type,
      file: t.file_path,
      updatedAt: t.created_at ? new Date(t.created_at).toISOString().substring(0, 10) : '2026-10-21'
    }));

    res.json({ status: 'success', data: formatted });
  } catch (error) {
    console.error('[MASTER TEMPLATES ERROR]', error);
    res.status(500).json({ status: 'error', message: 'Gagal memuat template bukti dukung.' });
  }
});

// POST /api/v1/master/templates
router.post('/templates', async (req, res) => {
  try {
    const { indicatorNumber, levelName, title, type } = req.body;

    if (!indicatorNumber || !title) {
      return res.status(400).json({ status: 'error', message: 'Indikator dan judul template wajib diisi.' });
    }

    // Cari indicator_id
    const [indRows] = await pool.query('SELECT id FROM indicators WHERE indicator_number = ?', [indicatorNumber]);
    if (indRows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Indikator tidak ditemukan.' });
    }
    const indicatorId = indRows[0].id;

    // Cari maturity_level_id jika ada
    let maturityLevelId = null;
    if (levelName) {
      const [lvlRows] = await pool.query(
        'SELECT id FROM maturity_levels WHERE indicator_id = ? AND level_name LIKE ? LIMIT 1',
        [indicatorId, `%${levelName.split(' ')[0]}%`]
      );
      if (lvlRows.length > 0) {
        maturityLevelId = lvlRows[0].id;
      }
    }

    const fileName = `${title.toUpperCase().replace(/[^A-Z0-9]/g, '_')}.${type || 'docx'}`;

    const [result] = await pool.query(
      `INSERT INTO maturity_templates (indicator_id, maturity_level_id, title, document_type, file_path, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [indicatorId, maturityLevelId, title, type || 'docx', fileName]
    );

    res.status(201).json({
      status: 'success',
      message: 'Master template berhasil disimpan.',
      data: { id: result.insertId, title, file: fileName }
    });
  } catch (error) {
    console.error('[ADD TEMPLATE ERROR]', error);
    res.status(500).json({ status: 'error', message: 'Gagal menyimpan template bukti dukung.' });
  }
});

// DELETE /api/v1/master/templates/:id
router.delete('/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM maturity_templates WHERE id = ?', [id]);
    res.json({ status: 'success', message: 'Master template berhasil dihapus.' });
  } catch (error) {
    console.error('[DELETE TEMPLATE ERROR]', error);
    res.status(500).json({ status: 'error', message: 'Gagal menghapus master template.' });
  }
});

module.exports = router;
