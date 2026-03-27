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
  const [form, setForm]         = useState({ title: '', subject: '', priority: 'medium', date: '' })
  const [showForm, setShowForm] = useState(false)

  const addTask = () => {
    if (!form.title.trim()) return
    setTasks(prev => [...prev, { id: Date.now(), ...form, done: false }])
    setForm({ title: '', subject: '', priority: 'medium', date: '' })
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

              {/* Priority */}
              {PRIORITY_BADGE[t.priority]}

              {/* Delete */}
              <button id={`delete-${t.id}`} className="btn btn-danger btn-sm" onClick={() => del(t.id)} title="Delete task">🗑</button>
            </div>
          )
        })
      )}
    </div>
  )
}
