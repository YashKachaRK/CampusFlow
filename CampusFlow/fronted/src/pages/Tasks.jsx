import { useState } from 'react'

const PRIORITY_BADGE = {
  high:   <span className="badge badge-high">🔴 High</span>,
  medium: <span className="badge badge-medium">🟡 Medium</span>,
  low:    <span className="badge badge-low">🟢 Low</span>,
}

const SAMPLE = [
  { id: 1, title: 'Submit Math Assignment', subject: 'Mathematics', priority: 'high',   done: false },
  { id: 2, title: 'Read Chapter 5 - OS',    subject: 'OS',          priority: 'medium', done: false },
  { id: 3, title: 'Prepare DSA Notes',      subject: 'DSA',         priority: 'low',    done: true  },
  { id: 4, title: 'Physics Lab Report',     subject: 'Physics',     priority: 'high',   done: false },
]

export default function Tasks() {
  const [tasks, setTasks]         = useState(SAMPLE)
  const [filter, setFilter]       = useState('all')
  const [form, setForm]           = useState({ title: '', subject: '', priority: 'medium' })
  const [showForm, setShowForm]   = useState(false)

  const addTask = () => {
    if (!form.title.trim()) return
    setTasks(prev => [...prev, { id: Date.now(), ...form, done: false }])
    setForm({ title: '', subject: '', priority: 'medium' })
    setShowForm(false)
  }

  const toggle = id => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const del    = id => setTasks(prev => prev.filter(t => t.id !== id))

  const filtered = tasks.filter(t => {
    if (filter === 'all')      return true
    if (filter === 'pending')  return !t.done
    if (filter === 'done')     return t.done
    return t.priority === filter
  })

  const counts = {
    total:   tasks.length,
    pending: tasks.filter(t => !t.done).length,
    done:    tasks.filter(t => t.done).length,
    high:    tasks.filter(t => t.priority === 'high' && !t.done).length,
  }

  return (
    <div>
      {/* Mini Stats */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {[
          { key: 'all',     label: `All (${counts.total})`,         color: '#a78bfa' },
          { key: 'pending', label: `Pending (${counts.pending})`,   color: '#f59e0b' },
          { key: 'done',    label: `Done (${counts.done})`,         color: '#22c55e' },
          { key: 'high',    label: `🔴 Urgent (${counts.high})`,    color: '#ef4444' },
        ].map(f => (
          <button
            key={f.key}
            id={`filter-${f.key}`}
            className="btn btn-secondary"
            onClick={() => setFilter(f.key)}
            style={filter === f.key ? { borderColor: f.color, color: f.color, background: `${f.color}15` } : {}}
          >
            {f.label}
          </button>
        ))}
        <button id="add-task-btn" className="btn btn-primary" style={{ marginLeft: 'auto' }} onClick={() => setShowForm(v => !v)}>
          {showForm ? '✕ Cancel' : '＋ Add Task'}
        </button>
      </div>

      {/* Add Task Form */}
      {showForm && (
        <div className="form-panel animate-fade-in">
          <div style={{ fontWeight: 700, marginBottom: '0.9rem', color: 'var(--text-primary)' }}>➕ New Task</div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Task Title *</label>
              <input
                id="task-title-input"
                className="form-input"
                placeholder="e.g. Submit Physics Lab Report"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && addTask()}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                id="task-subject-input"
                className="form-input"
                placeholder="e.g. Physics"
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              />
            </div>
            <div className="form-group" style={{ flex: 0, minWidth: 130 }}>
              <label className="form-label">Priority</label>
              <select
                id="task-priority-select"
                className="form-select"
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
          </div>
          <button id="submit-task-btn" className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={addTask}>
            ✔ Add Task
          </button>
        </div>
      )}

      {/* Task List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-text">No tasks here. Add a new one!</div>
        </div>
      ) : (
        filtered.map((t, i) => (
          <div key={t.id} className={`task-item animate-fade-in${t.done ? ' completed' : ''}`} style={{ animationDelay: `${i * 0.04}s` }}>
            {/* Checkbox */}
            <button
              id={`check-${t.id}`}
              className={`task-checkbox${t.done ? ' checked' : ''}`}
              onClick={() => toggle(t.id)}
              title="Toggle complete"
            >
              {t.done && <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: 900 }}>✓</span>}
            </button>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div className="task-title">{t.title}</div>
              {t.subject && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>📚 {t.subject}</div>}
            </div>

            {/* Priority */}
            {PRIORITY_BADGE[t.priority]}

            {/* Delete */}
            <div className="task-actions">
              <button id={`delete-${t.id}`} className="btn btn-danger btn-sm" onClick={() => del(t.id)} title="Delete task">🗑</button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
