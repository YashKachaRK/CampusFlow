import { useState } from 'react'

const INITIAL_NOTICES = [
  { id: 1, title: 'Final Year Project Submissions', date: '2026-03-25', content: 'All final year students must submit their project proposals by next week.' },
  { id: 2, title: 'Lab Maintenance', date: '2026-03-26', content: 'Computer Lab 3 will be closed for maintenance tomorrow between 2pm and 5pm.' },
]

export default function FacultyNotices() {
  const [notices, setNotices] = useState(INITIAL_NOTICES)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', content: '' })

  const handlePost = () => {
    if (!form.title || !form.content) return
    const newNotice = {
      id: Date.now(),
      title: form.title,
      content: form.content,
      date: new Date().toISOString().split('T')[0]
    }
    setNotices([newNotice, ...notices])
    setForm({ title: '', content: '' })
    setShowForm(false)
  }

  const handleDelete = (id) => {
    setNotices(notices.filter(n => n.id !== id))
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
        <button className="btn" style={{ background: '#10b981', color: '#fff', border: 'none' }} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '＋ Post New Notice'}
        </button>
      </div>

      {showForm && (
        <div className="form-panel" style={{ borderColor: '#10b981', marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 700, marginBottom: '0.9rem', color: '#10b981' }}>📝 Create Notice</div>
          <div className="form-group">
            <label className="form-label">Notice Title</label>
            <input className="form-input" placeholder="e.g. Exam Schedule Update" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </div>
          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label className="form-label">Notice Content</label>
            <textarea className="form-input" placeholder="Type the announcement here..." rows="4" style={{ resize: 'vertical' }} value={form.content} onChange={e => setForm({...form, content: e.target.value})}></textarea>
          </div>
          <button className="btn" style={{ background: '#10b981', color: '#fff', border: 'none', marginTop: '1rem', width: '100%' }} onClick={handlePost}>
            📢 Post to Students
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {notices.map(notice => (
          <div key={notice.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, marginBottom: '0.25rem' }}>POSTED ON {notice.date}</div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{notice.title}</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {notice.content}
              </p>
            </div>
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(notice.id)}>🗑 Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
