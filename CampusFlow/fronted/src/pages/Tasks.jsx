import { useState } from 'react'

const PRIORITY_BADGE = {
  high:   <span className="badge badge-high">🔴 High</span>,
  medium: <span className="badge badge-medium">🟡 Medium</span>,
  low:    <span className="badge badge-low">🟢 Low</span>,
}

const SAMPLE = [
  { id: 1, title: 'Submit Math Assignment', subject: 'Mathematics', priority: 'high',   done: false, date: '2026-03-28' },
  { id: 2, title: 'Read Chapter 5 - OS',    subject: 'OS',          priority: 'medium', done: false, date: '2026-03-29' },
  { id: 3, title: 'Prepare DSA Notes',      subject: 'DSA',         priority: 'low',    done: true,  date: '2026-03-27' },
  { id: 4, title: 'Physics Lab Report',     subject: 'Physics',     priority: 'high',   done: false, date: '2026-03-30' },
]

function formatDate(str) {
  if (!str) return ''
  const d = new Date(str)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function isOverdue(dateStr, done) {
  if (!dateStr || done) return false
  return new Date(dateStr) < new Date('2026-03-27')
}

export default function Tasks() {
  const [tasks, setTasks]       = useState(SAMPLE)
  const [filter, setFilter]     = useState('all')
  const [dateFilter, setDateFilter] = useState('')   // YYYY-MM-DD string
  const [form, setForm]         = useState({ title: '', subject: '', priority: 'medium', date: '', file: null })
  const [showForm, setShowForm] = useState(false)
  const [viewingTask, setViewingTask] = useState(null)

  const addTask = () => {
    if (!form.title.trim()) return
    const fileUrl = form.file ? URL.createObjectURL(form.file) : null;
    setTasks(prev => [...prev, { id: Date.now(), ...form, fileName: form.file ? form.file.name : null, fileUrl, done: false }])
    setForm({ title: '', subject: '', priority: 'medium', date: '', file: null })
    setShowForm(false)
  }

  const toggle = id => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const del    = id => setTasks(prev => prev.filter(t => t.id !== id))

  // counts (before date filter, for tab badges)
  const counts = {
    total:   tasks.length,
    pending: tasks.filter(t => !t.done).length,
    done:    tasks.filter(t => t.done).length,
    high:    tasks.filter(t => t.priority === 'high' && !t.done).length,
  }

  // apply priority/status filter first, then date filter
  const filtered = tasks
    .filter(t => {
      if (filter === 'pending') return !t.done
      if (filter === 'done')    return t.done
      if (filter === 'high')    return t.priority === 'high' && !t.done
      return true
    })
    .filter(t => !dateFilter || t.date === dateFilter)

  return (
    <div>
      {/* Status Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
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

        {/* Date Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: 'auto' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>📅 Date:</span>
          <input
            id="date-filter-input"
            type="date"
            className="form-input"
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', width: 155 }}
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          />
          {dateFilter && (
            <button
              id="clear-date-filter"
              className="btn btn-secondary btn-sm"
              onClick={() => setDateFilter('')}
              title="Clear date filter"
            >✕</button>
          )}
        </div>

        <button id="add-task-btn" className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
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
          </div>
          <div className="form-row" style={{ marginTop: '0.75rem' }}>
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
            <div className="form-group" style={{ flex: 0, minWidth: 160 }}>
              <label className="form-label">Due Date</label>
              <input
                id="task-date-input"
                type="date"
                className="form-input"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Attachment (optional)</label>
              <input
                id="task-file-input"
                type="file"
                className="form-input"
                onChange={e => setForm(f => ({ ...f, file: e.target.files[0] || null }))}
                style={{ padding: '0.35rem', fontSize: '0.8rem', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
          <button id="submit-task-btn" className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={addTask}>
            ✔ Add Task
          </button>
        </div>
      )}

      {/* Active Date Filter Indicator */}
      {dateFilter && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.8rem', color: '#60a5fa' }}>
          <span>📅 Showing tasks for: <strong>{formatDate(dateFilter)}</strong></span>
          <button className="btn btn-secondary btn-sm" onClick={() => setDateFilter('')}>Clear</button>
        </div>
      )}

      {/* Task List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-text">No tasks found. Try a different filter or add a new one!</div>
        </div>
      ) : (
        filtered.map((t, i) => {
          const overdue = isOverdue(t.date, t.done)
          return (
            <div
              key={t.id}
              className={`task-item animate-fade-in${t.done ? ' completed' : ''}`}
              style={{
                animationDelay: `${i * 0.04}s`,
                borderLeft: overdue ? '3px solid var(--red)' : undefined,
              }}
            >
              {/* Checkbox */}
              <button
                id={`check-${t.id}`}
                className={`task-checkbox${t.done ? ' checked' : ''}`}
                onClick={() => toggle(t.id)}
                title="Toggle complete"
              >
                {t.done && <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: 900 }}>✓</span>}
              </button>

              {/* Title */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="task-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {t.title}
                </div>
                {overdue && !t.done && (
                  <div style={{ fontSize: '0.68rem', color: 'var(--red)', fontWeight: 600, marginTop: 2 }}>⚠ Overdue</div>
                )}
              </div>

              {/* Subject badge */}
              {t.subject && (
                <span style={{
                  fontSize: '0.72rem', fontWeight: 600, color: '#60a5fa',
                  background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)',
                  borderRadius: 20, padding: '0.15rem 0.55rem', whiteSpace: 'nowrap', flexShrink: 0,
                }}>
                  📚 {t.subject}
                </span>
              )}

              {/* Due date */}
              {t.date && (
                <span style={{
                  fontSize: '0.72rem', color: overdue ? 'var(--red)' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', gap: '0.25rem',
                  whiteSpace: 'nowrap', flexShrink: 0,
                }}>
                  📅 {formatDate(t.date)}
                </span>
              )}

              {/* Attachment */}
              {t.fileName && (
                <span style={{
                  fontSize: '0.72rem', color: '#a78bfa',
                  display: 'flex', alignItems: 'center', gap: '0.25rem',
                  whiteSpace: 'nowrap', flexShrink: 0, background: 'rgba(124,58,237,0.1)', padding: '0.15rem 0.5rem', borderRadius: 20
                }} title={t.fileName}>
                  📎 {t.fileName.length > 15 ? t.fileName.slice(0, 15) + '...' : t.fileName}
                </span>
              )}

              {/* Priority */}
              {PRIORITY_BADGE[t.priority]}

              {/* View & Delete Actions */}
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.6rem' }} onClick={() => setViewingTask(t)} title="View details">👁️</button>
                <button id={`delete-${t.id}`} className="btn btn-danger btn-sm" onClick={() => del(t.id)} title="Delete task">🗑</button>
              </div>
            </div>
          )
        })
      )}

      {/* View Task Modal */}
      {viewingTask && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
          <div className="animate-fade-in" style={{
            background: 'var(--bg-card)', padding: '2rem', borderRadius: 16,
            width: '90%', maxWidth: 500, border: '1px solid var(--border)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)', position: 'relative'
          }}>
            <button
              onClick={() => setViewingTask(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
            >✕</button>
            <h2 style={{ marginTop: 0, marginBottom: '0.5rem', fontWeight: 700, fontSize: '1.4rem' }}>{viewingTask.title}</h2>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', alignItems: 'center' }}>
              {PRIORITY_BADGE[viewingTask.priority]}
              <span className={`badge ${viewingTask.done ? 'badge-low' : 'badge-medium'}`}>
                {viewingTask.done ? '✓ Completed' : '⏳ Pending'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', background: 'var(--bg-secondary)', padding: '1.2rem', borderRadius: 12 }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Subject</span>
                <div style={{ fontWeight: 500 }}>{viewingTask.subject || '—'}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Due Date</span>
                  <div style={{ fontWeight: 500, color: isOverdue(viewingTask.date, viewingTask.done) ? 'var(--red)' : 'inherit' }}>
                    {viewingTask.date ? formatDate(viewingTask.date) : 'No due date'}
                  </div>
                </div>
                {viewingTask.fileName && (
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Attachment</span>
                    <div style={{ fontWeight: 500, color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      {viewingTask.fileUrl ? (
                        <a href={viewingTask.fileUrl} download={viewingTask.fileName} style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', background: 'rgba(124,58,237,0.1)', padding: '0.2rem 0.6rem', borderRadius: 20 }}>
                           {viewingTask.fileName}
                        </a>
                      ) : (
                        <span>📎 {viewingTask.fileName}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
               <button className="btn btn-primary" onClick={() => setViewingTask(null)}>Close Details</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
