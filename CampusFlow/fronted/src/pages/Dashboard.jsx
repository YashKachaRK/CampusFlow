import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const INITIAL_TASKS = [
  { id: 1, title: 'Submit Math Assignment', priority: 'high',   done: false, subject: 'Mathematics' },
  { id: 2, title: 'Read Chapter 5 - OS',    priority: 'medium', done: false, subject: 'OS' },
  { id: 3, title: 'Prepare DSA Notes',      priority: 'low',    done: true,  subject: 'DSA' },
]

const INITIAL_EVENTS = [
  { id: 1, title: 'Workshop: React Basics', date: '2026-03-28', time: '10:00 AM' },
  { id: 2, title: 'Mid-Semester Exam',      date: '2026-03-30', time: '09:00 AM' },
]

const INITIAL_NOTICES = [
  { id: 1, title: '📌 Exam Timetable Released', description: 'The mid-semester examination timetable has been published. Check the portal for subject-wise schedule.', date: '2026-03-26' },
  { id: 2, title: '🎉 Hackathon Registration Open', description: 'AI Hackathon 2026 registrations are now open. Team size: 2-4. Last date: March 31.', date: '2026-03-25' },
]

function StatCard({ icon, iconBg, value, label, delay }) {
  return (
    <div className={`summary-card animate-fade-in animate-delay-${delay}`}>
      <div className="summary-icon" style={{ background: iconBg }}>{icon}</div>
      <div>
        <div className="summary-value gradient-text">{value}</div>
        <div className="summary-label">{label}</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const tasks   = INITIAL_TASKS
  const events  = INITIAL_EVENTS
  const notices = INITIAL_NOTICES

  const total   = tasks.length
  const pending = tasks.filter(t => !t.done).length
  const urgent  = tasks.filter(t => t.priority === 'high' && !t.done).length
  const todayEvents = events.filter(e => e.date === '2026-03-27').length

  const urgentTasks = tasks.filter(t => t.priority === 'high' && !t.done)
  const recentNotice = notices[0]

  return (
    <div>
      {/* Summary Cards */}
      <div className="summary-grid">
        <StatCard delay={1} icon="📋" iconBg="linear-gradient(135deg,rgba(124,58,237,0.3),rgba(124,58,237,0.1))" value={total}      label="Total Tasks" />
        <StatCard delay={2} icon="⏳" iconBg="linear-gradient(135deg,rgba(245,158,11,0.3),rgba(245,158,11,0.1))" value={pending}    label="Pending Tasks" />
        <StatCard delay={3} icon="📅" iconBg="linear-gradient(135deg,rgba(59,130,246,0.3),rgba(59,130,246,0.1))"  value={todayEvents} label="Events Today" />
        <StatCard delay={4} icon="🔴" iconBg="linear-gradient(135deg,rgba(239,68,68,0.3),rgba(239,68,68,0.1))"   value={urgent}     label="Urgent Tasks" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

        {/* Urgent Tasks */}
        <div className="card animate-fade-in animate-delay-2">
          <div className="section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="urgent-indicator" />
              <span className="section-title">Urgent Tasks</span>
            </div>
            <button id="dash-view-all-tasks" className="btn btn-secondary btn-sm" onClick={() => navigate('/tasks')}>View All</button>
          </div>
          {urgentTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎉</div>
              <div className="empty-text">No urgent tasks right now!</div>
            </div>
          ) : urgentTasks.map(t => (
            <div key={t.id} className="task-item">
              <div className="urgent-indicator" />
              <div className="task-title">{t.title}</div>
              <span className="badge badge-high">🔴 High</span>
            </div>
          ))}
        </div>

        {/* Upcoming Events */}
        <div className="card animate-fade-in animate-delay-3">
          <div className="section-header">
            <span className="section-title">📅 Upcoming Events</span>
            <button id="dash-view-all-events" className="btn btn-secondary btn-sm" onClick={() => navigate('/schedule')}>View All</button>
          </div>
          {events.slice(0, 3).map(e => {
            const d = new Date(e.date)
            return (
              <div key={e.id} className="event-item" style={{ padding: '0.7rem', marginBottom: '0.5rem' }}>
                <div className="event-date-badge">
                  <div className="event-day">{d.getDate()}</div>
                  <div className="event-month">{d.toLocaleString('en', { month: 'short' })}</div>
                </div>
                <div>
                  <div className="event-title">{e.title}</div>
                  <div className="event-time">🕐 {e.time}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Latest Notice */}
        <div className="card animate-fade-in animate-delay-4" style={{ gridColumn: '1 / -1' }}>
          <div className="section-header">
            <span className="section-title">📢 Latest Notice</span>
            <button id="dash-view-all-notices" className="btn btn-secondary btn-sm" onClick={() => navigate('/notices')}>All Notices</button>
          </div>
          {recentNotice && (
            <div className="notice-card" style={{ marginBottom: 0 }}>
              <div className="notice-title">{recentNotice.title}</div>
              <div className="notice-desc">{recentNotice.description}</div>
              <div className="notice-meta">
                <span>📅 {recentNotice.date}</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
