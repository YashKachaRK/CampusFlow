import { useState } from 'react'

const CAT_COLOR = {
  Academic:  '#7c3aed',
  Event:     '#14b8a6',
  General:   '#6b7280',
  Financial: '#f59e0b',
}

const SAMPLE = [
  { id: 1, title: '📌 Exam Timetable Released', description: 'Check the portal for subject-wise schedule.', date: '2026-03-26', category: 'Academic', important: true },
  { id: 2, title: '🎉 AI Hackathon 2026', description: 'Registrations are now open.', date: '2026-03-25', category: 'Event', important: false },
]

export default function AdminNotices() {
  const [notices, setNotices] = useState(SAMPLE)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [form, setForm] = useState({ title: '', description: '', category: 'Academic', important: false, attachment: null })

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setForm(f => ({
        ...f,
        attachment: {
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'pdf',
          data: reader.result
        }
      }))
    }
    reader.readAsDataURL(file)
  }

  const addNotice = () => {
    if (!form.title.trim()) return
    setNotices(prev => [{ id: Date.now(), ...form, date: new Date().toISOString().split('T')[0] }, ...prev])
    setForm({ title: '', description: '', category: 'Academic', important: false, attachment: null })
    setShowForm(false)
  }

  const del = id => setNotices(prev => prev.filter(n => n.id !== id))

  const filteredNotices = notices.filter(n =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
          <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
          <input
            type="text"
            className="form-input"
            placeholder="Search notices..."
            style={{ paddingLeft: '2.25rem', width: '100%' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '➕ Post Official Notice'}
        </button>
      </div>

      {showForm && (
        <div className="form-panel animate-fade-in" style={{ borderColor: '#7c3aed' }}>
          <div style={{ fontWeight: 700, marginBottom: '0.9rem', color: '#a78bfa' }}>📢 Post Official Notice</div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Title *</label>
              <input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Notice title..." />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {Object.keys(CAT_COLOR).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Detailed description..." />
          </div>

          {/* File Upload Section */}
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Attach File (Image/PDF)</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
            />
            {form.attachment && (
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {form.attachment.type === 'image' ? (
                  <img src={form.attachment.data} alt="Preview" style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '1.2rem' }}>📄</span>
                )}
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{form.attachment.name}</span>
                <button
                  className="btn btn-danger btn-sm"
                  style={{ padding: '0.1rem 0.3rem', fontSize: '0.6rem' }}
                  onClick={() => setForm({...form, attachment: null})}
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
            <input type="checkbox" checked={form.important} onChange={e => setForm({...form, important: e.target.checked})} />
            <span style={{ fontSize: '0.85rem' }}>Mark as Important (⚠)</span>
            <button className="btn btn-primary" style={{ marginLeft: 'auto' }} onClick={addNotice}>Post Notice</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredNotices.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <div className="empty-text">No notices found matching "{searchTerm}"</div>
          </div>
        ) : (
          filteredNotices.map(n => (
            <div key={n.id} className="notice-card" style={{ borderLeft: `4px solid ${CAT_COLOR[n.category]}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span className="notice-title">{n.title}</span>
                    {n.important && <span className="badge badge-high">⚠ Important</span>}
                    <span className="badge" style={{ background: `${CAT_COLOR[n.category]}20`, color: CAT_COLOR[n.category] }}>{n.category}</span>
                  </div>
                  <div className="notice-desc" style={{ maxWidth: 600 }}>{n.description}</div>

                {/* Attachment Display */}
                {n.attachment && (
                  <div style={{ marginTop: '0.75rem', padding: '0.65rem', background: 'var(--bg-primary)', borderRadius: 10, border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                    {n.attachment.type === 'image' ? (
                      <img src={n.attachment.data} alt="Attachment" style={{ width: 80, height: 80, borderRadius: 6, objectFit: 'cover', cursor: 'pointer' }} onClick={() => window.open(n.attachment.data)} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>📄</span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{n.attachment.name}</span>
                          <a href={n.attachment.data} download={n.attachment.name} style={{ fontSize: '0.7rem', color: '#60a5fa', textDecoration: 'none' }}>⬇ Download PDF</a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="notice-meta" style={{ marginTop: '0.75rem' }}>Posted on: {n.date} · Posted by Admin</div>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => del(n.id)}>🗑 Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
