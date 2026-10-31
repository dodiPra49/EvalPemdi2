// API client service for EVAL-PEMDI
const API_BASE_URL = typeof window === 'undefined'
  ? (process.env.INTERNAL_API_URL || 'http://express-api:5000/api/v1')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1');

// Helper to get auth header
function getAuthHeaders(isFormData = false) {
  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('evalpemdi_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

export const api = {
  // ================= AUTH =================
  async getWorkUnitsForLogin() {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/work-units`);
      if (!res.ok) throw new Error('Network error');
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.warn('Menggunakan fallback data unit kerja:', err);
      return [
        { id: 2, code: 'DISKOMINFO-01', name: 'Dinas Komunikasi, Informatika, dan Statistik', category: 'Daerah', pic: 'Kepala Dinas Kominfo' },
        { id: 1, code: 'SETDA-01', name: 'Sekretariat Daerah', category: 'Daerah', pic: 'Sekretaris Daerah' },
        { id: 3, code: 'BAPPEDA-01', name: 'Badan Perencanaan Pembangunan Daerah (BAPPEDA)', category: 'Daerah', pic: 'Kepala Bappeda' },
        { id: 4, code: 'INSPEKTORAT-01', name: 'Inspektorat Daerah', category: 'Daerah', pic: 'Inspektur Daerah' },
        { id: 5, code: 'DISDUKCAPIL-01', name: 'Dinas Kependudukan dan Pencatatan Sipil', category: 'Daerah', pic: 'Kepala Disdukcapil' },
        { id: 6, code: 'BKPSDM-01', name: 'Badan Kepegawaian dan Pengembangan SDM (BKPSDM)', category: 'Daerah', pic: 'Kepala BKPSDM' },
      ];
    }
  },

  async login(credentials, passwordParam) {
    let body = {};
    if (typeof credentials === 'object' && credentials !== null) {
      body = credentials;
    } else {
      body = { email: credentials, password: passwordParam };
    }

    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const json = await res.json();
    if (!res.ok || json.status !== 'success') {
      throw new Error(json.message || 'Login gagal');
    }
    if (typeof window !== 'undefined' && json.token) {
      localStorage.setItem('evalpemdi_token', json.token);
      localStorage.setItem('evalpemdi_user', JSON.stringify(json.user));
    }
    return json;
  },

  async getMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok || json.status !== 'success') {
      throw new Error(json.message || 'Gagal memverifikasi pengguna');
    }
    return json.user;
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('evalpemdi_token');
      localStorage.removeItem('evalpemdi_user');
    }
  },

  // ================= MASTER DATA =================
  async getAspects() {
    const res = await fetch(`${API_BASE_URL}/master/aspects`);
    const json = await res.json();
    return json.data || [];
  },

  async getIndicators(params = null) {
    let url = `${API_BASE_URL}/master/indicators`;
    if (params) {
      const query = new URLSearchParams(params).toString();
      url += `?${query}`;
    }
    const res = await fetch(url);
    const json = await res.json();
    return json.data || [];
  },

  async getUsers() {
    const res = await fetch(`${API_BASE_URL}/master/users`);
    const json = await res.json();
    return json.data || [];
  },

  async createUser(userData) {
    const res = await fetch(`${API_BASE_URL}/master/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    const json = await res.json();
    if (!res.ok || json.status !== 'success') {
      throw new Error(json.message || 'Gagal menambah pengguna');
    }
    return json;
  },

  async updateUser(id, userData) {
    const res = await fetch(`${API_BASE_URL}/master/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    const json = await res.json();
    if (!res.ok || json.status !== 'success') {
      throw new Error(json.message || 'Gagal memperbarui pengguna');
    }
    return json;
  },

  async deleteUser(id) {
    const res = await fetch(`${API_BASE_URL}/master/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok || json.status !== 'success') {
      throw new Error(json.message || 'Gagal menghapus pengguna');
    }
    return json;
  },

  async getWorkUnits() {
    const res = await fetch(`${API_BASE_URL}/master/work-units`);
    const json = await res.json();
    return json.data || [];
  },

  async createWorkUnit(unitData) {
    const res = await fetch(`${API_BASE_URL}/master/work-units`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(unitData)
    });
    const json = await res.json();
    if (!res.ok || json.status !== 'success') {
      throw new Error(json.message || 'Gagal menambah unit kerja');
    }
    return json;
  },

  async updateWorkUnit(id, unitData) {
    const res = await fetch(`${API_BASE_URL}/master/work-units/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(unitData)
    });
    const json = await res.json();
    if (!res.ok || json.status !== 'success') {
      throw new Error(json.message || 'Gagal memperbarui unit kerja');
    }
    return json;
  },

  async deleteWorkUnit(id) {
    const res = await fetch(`${API_BASE_URL}/master/work-units/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok || json.status !== 'success') {
      throw new Error(json.message || 'Gagal menghapus unit kerja');
    }
    return json;
  },

  async getTemplates() {
    const res = await fetch(`${API_BASE_URL}/master/templates`);
    const json = await res.json();
    return json.data || [];
  },

  async createTemplate(tplData) {
    const res = await fetch(`${API_BASE_URL}/master/templates`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(tplData)
    });
    const json = await res.json();
    if (!res.ok || json.status !== 'success') {
      throw new Error(json.message || 'Gagal menyimpan template');
    }
    return json;
  },

  async deleteTemplate(id) {
    const res = await fetch(`${API_BASE_URL}/master/templates/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok || json.status !== 'success') {
      throw new Error(json.message || 'Gagal menghapus template');
    }
    return json;
  },

  // ================= EVALUASI & EVIDENCE =================
  async getCurrentEvaluation(workUnitId = 1, year = 2026) {
    const res = await fetch(`${API_BASE_URL}/evaluations/current?work_unit_id=${workUnitId}&year=${year}`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    return json.data || { evaluation: {}, answers: {}, uploadedFiles: {} };
  },

  async saveDraft(workUnitId, year, answers) {
    const res = await fetch(`${API_BASE_URL}/evaluations/save-draft`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ work_unit_id: workUnitId, year, answers })
    });
    const json = await res.json();
    if (!res.ok || json.status !== 'success') {
      throw new Error(json.message || 'Gagal menyimpan draf');
    }
    return json;
  },

  async submitEvaluation(workUnitId, year) {
    const res = await fetch(`${API_BASE_URL}/evaluations/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ work_unit_id: workUnitId, year })
    });
    const json = await res.json();
    if (!res.ok || json.status !== 'success') {
      throw new Error(json.message || 'Gagal mengirim evaluasi');
    }
    return json;
  },

  async uploadEvidence(formData) {
    const res = await fetch(`${API_BASE_URL}/evaluations/upload-evidence`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: formData
    });
    const json = await res.json();
    if (!res.ok || json.status !== 'success') {
      throw new Error(json.message || 'Gagal mengunggah berkas bukti');
    }
    return json;
  },

  async deleteEvidence(id) {
    const res = await fetch(`${API_BASE_URL}/evaluations/evidence/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok || json.status !== 'success') {
      throw new Error(json.message || 'Gagal menghapus berkas');
    }
    return json;
  },

  async getDashboardSummary() {
    const res = await fetch(`${API_BASE_URL}/evaluations/dashboard-summary`);
    const json = await res.json();
    return json.data || {};
  }
};
