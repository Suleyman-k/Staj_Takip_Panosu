import { useState, useEffect } from 'react';
import './App.css';

const COLUMNS = [
  { id: 'applied', title: '📤 Başvuruldu' },
  { id: 'assessment', title: '💻 Teknik Test / İK' },
  { id: 'interview', title: '🎯 Mülakat' },
  { id: 'offer', title: '🏆 Teklif / Sonuç' }
];

const INITIAL_DATA = [
  {
    id: '1',
    company: 'TUSAŞ',
    position: 'Yazılım Mühendisi Stajyeri',
    workType: 'Ofis',
    status: 'interview',
    techStack: ['Java', 'OOP', 'SQL'],
    date: '2026-10-25',
    notes: 'Teknik mülakatta OOP prensipleri sorulacak.'
  },
  {
    id: '2',
    company: 'HAVELSAN',
    position: 'Yapay Zeka & Veri Analizi Stajyeri',
    workType: 'Hibrit',
    status: 'assessment',
    techStack: ['Python', 'Machine Learning', 'Git'],
    date: '2026-10-28',
    notes: 'Online kodlama testi tamamlandı, sonuç bekleniyor.'
  },
  {
    id: '3',
    company: 'ASELSAN',
    position: 'Frontend Geliştirici Stajyeri',
    workType: 'Remote',
    status: 'applied',
    techStack: ['React', 'JavaScript', 'CSS'],
    date: '2026-10-30',
    notes: 'Kariyer portalı üzerinden özgeçmiş yüklendi.'
  }
];

function App() {
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('career_crm_applications');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    workType: 'Hibrit',
    status: 'applied',
    techStack: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterWorkType, setFilterWorkType] = useState('Tümü');

  useEffect(() => {
    localStorage.setItem('career_crm_applications', JSON.stringify(applications));
  }, [applications]);

  const handleAddApplication = (e) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.position.trim()) return;

    const newApp = {
      id: Date.now().toString(),
      company: formData.company.trim(),
      position: formData.position.trim(),
      workType: formData.workType,
      status: formData.status,
      techStack: formData.techStack
        ? formData.techStack.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      date: formData.date,
      notes: formData.notes.trim()
    };

    setApplications([newApp, ...applications]);
    setFormData({
      company: '',
      position: '',
      workType: 'Hibrit',
      status: 'applied',
      techStack: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const moveCard = (id, direction) => {
    const statusOrder = COLUMNS.map((c) => c.id);
    setApplications(
      applications.map((app) => {
        if (app.id !== id) return app;
        const currentIndex = statusOrder.indexOf(app.status);
        const nextIndex = currentIndex + direction;
        if (nextIndex < 0 || nextIndex >= statusOrder.length) return app;
        return { ...app, status: statusOrder[nextIndex] };
      })
    );
  };

  const deleteCard = (id) => {
    setApplications(applications.filter((app) => app.id !== id));
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.techStack.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterWorkType === 'Tümü' || app.workType === filterWorkType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="app-container">
      <header className="header">
        <div>
          <h1>🚀 Staj & İş Başvurusu Takip Panosu</h1>
          <p>Yapay Zeka Destekli Kariyer ve Başvuru Yönetim Sistemi (LocalStorage)</p>
        </div>
      </header>

      {/* İstatistik Özeti */}
      <section className="stats-grid">
        <div className="stat-card">
          <span className="stat-title">Toplam Başvuru</span>
          <span className="stat-value">{applications.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">Teknik Test / İK</span>
          <span className="stat-value" style={{ color: '#fbbf24' }}>
            {applications.filter((a) => a.status === 'assessment').length}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-title">Aktif Mülakat</span>
          <span className="stat-value" style={{ color: '#60a5fa' }}>
            {applications.filter((a) => a.status === 'interview').length}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-title">Teklif / Kabul</span>
          <span className="stat-value" style={{ color: '#34d399' }}>
            {applications.filter((a) => a.status === 'offer').length}
          </span>
        </div>
      </section>

      {/* Yeni Başvuru Formu */}
      <section className="panel">
        <h2 className="panel-title">➕ Yeni Başvuru Ekle</h2>
        <form onSubmit={handleAddApplication}>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Şirket Adı (ör. TUSAŞ)"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Pozisyon (ör. Yazılım Stajyeri)"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              required
            />
            <select
              value={formData.workType}
              onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
            >
              <option value="Ofis">Ofis</option>
              <option value="Hibrit">Hibrit</option>
              <option value="Remote">Remote</option>
            </select>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              {COLUMNS.map((col) => (
                <option key={col.id} value={col.id}>{col.title}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Teknolojiler (Java, React, SQL)"
              value={formData.techStack}
              onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="Kısa not (ör. Mülakat tarihi, referans bilgisi...)"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
            <button type="submit" className="btn">Kaydet</button>
          </div>
        </form>
      </section>

      {/* Arama ve Filtreleme */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="🔍 Şirket, pozisyon veya teknoloji ara (ör. Java, React)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filterWorkType} onChange={(e) => setFilterWorkType(e.target.value)}>
          <option value="Tümü">Tüm Çalışma Modelleri</option>
          <option value="Ofis">Sadece Ofis</option>
          <option value="Hibrit">Sadece Hibrit</option>
          <option value="Remote">Sadece Remote</option>
        </select>
      </div>

      {/* Kanban Panosu */}
      <main className="kanban-board">
        {COLUMNS.map((col, colIndex) => {
          const colApps = filteredApps.filter((app) => app.status === col.id);
          return (
            <div key={col.id} className="kanban-column">
              <div className="column-header">
                <span className="column-title">{col.title}</span>
                <span className="column-count">{colApps.length}</span>
              </div>

              {colApps.length === 0 ? (
                <div className="empty-state">Bu aşamada kayıt yok</div>
              ) : (
                colApps.map((app) => (
                  <div key={app.id} className="job-card">
                    <div className="card-top">
                      <span className="company-name">{app.company}</span>
                      <span className={`badge badge-${app.workType}`}>{app.workType}</span>
                    </div>
                    <div className="position-name">{app.position}</div>

                    {app.techStack.length > 0 && (
                      <div className="tech-tags">
                        {app.techStack.map((tech, idx) => (
                          <span key={idx} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                    )}

                    {app.notes && <div className="card-notes">{app.notes}</div>}

                    <div className="card-footer">
                      <span>📅 {app.date}</span>
                      <div className="card-actions">
                        {colIndex > 0 && (
                          <button
                            className="action-btn"
                            onClick={() => moveCard(app.id, -1)}
                            title="Önceki Aşamaya Taşı"
                          >
                            ◀
                          </button>
                        )}
                        {colIndex < COLUMNS.length - 1 && (
                          <button
                            className="action-btn"
                            onClick={() => moveCard(app.id, 1)}
                            title="Sonraki Aşamaya Taşı"
                          >
                            ▶
                          </button>
                        )}
                        <button
                          className="action-btn delete-btn"
                          onClick={() => deleteCard(app.id)}
                          title="Sil"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}

export default App;