  import { useState } from 'react'

const SAMPLE = [
  {
    id: 1,
    title: '📌 Exam Timetable Released',
    description: 'The mid-semester examination timetable has been published on the college portal. Students are advised to check their subject-wise schedule and exam hall allocation.',
    date: '2026-03-26',
    category: 'Academic',
    important: true,
  },
  {
    id: 2,
    title: '🎉 AI Hackathon Registration Open',
    description: 'AI Hackathon 2026 registrations are now OPEN! Team size: 2-4 members. Last date to register: March 31, 2026. Winners get cash prizes + internship offers.',
    date: '2026-03-25',
    category: 'Event',
    important: false,
  },
  {
    id: 3,
    title: '🛑 Library Closed for Maintenance',
    description: 'The central library will remain closed from March 28 to March 30 for annual book cataloguing and system upgrades. Online resources remain accessible.',
    date: '2026-03-24',
    category: 'General',
    important: false,
  },
  {
    id: 4,
    title: '🏆 Scholarship Application Deadline',
    description: 'Last date to apply for the Merit-cum-Means scholarship is April 5. Submit applications to the office with all required documents. No extensions will be granted.',
    date: '2026-03-22',
    category: 'Financial',
    important: true,
  },
]

const CAT_COLOR = {
  Academic:  '#7c3aed',
  Event:     '#14b8a6',
  General:   '#6b7280',
  Financial: '#f59e0b',
}

export default function Notices() {
  const [notices]      = useState(SAMPLE)
  const [filter, setFilter]     = useState('All')

  const categories = ['All', ...new Set(SAMPLE.map(n => n.category))]
  const filtered   = filter === 'All' ? notices : notices.filter(n => n.category === filter)

  return (
    <div>
      {/* Category Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button
            key={c}
            id={`notice-filter-${c}`}
            className="btn btn-secondary btn-sm"
            onClick={() => setFilter(c)}
            style={filter === c ? { borderColor: '#a78bfa', color: '#a78bfa', background: 'rgba(167,139,250,0.1)' } : {}}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Notice Cards */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-text">No notices in this category.</div>
        </div>
      ) : filtered.map((n, i) => (
        <div key={n.id} className="notice-card animate-fade-in" style={{ animationDelay: `${i * 0.05}s`, borderLeftColor: CAT_COLOR[n.category] || '#7c3aed' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                <span className="notice-title">{n.title}</span>
                {n.important && <span className="badge badge-high" style={{ fontSize: '0.67rem' }}>⚠ Important</span>}
                <span className="badge" style={{ background: `${CAT_COLOR[n.category]}20`, color: CAT_COLOR[n.category], border: `1px solid ${CAT_COLOR[n.category]}40`, fontSize: '0.67rem' }}>
                  {n.category}
                </span>
                <span style={{ fontSize: '0.67rem', color: 'var(--text-muted)', fontWeight: 600 }}>🏷 Official Notice</span>
              </div>
              <div className="notice-desc">{n.description}</div>

              {/* Attachment Display */}
              {n.attachment && (
                <div style={{ marginTop: '0.85rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', gap: '0.85rem', animation: 'fadeInUp 0.3s ease' }}>
                  {n.attachment.type === 'image' ? (
                    <img src={n.attachment.data} alt="Attachment" style={{ width: 100, height: 100, borderRadius: 8, objectFit: 'cover', cursor: 'zoom-in', transition: 'transform 0.2s' }} onClick={() => window.open(n.attachment.data)} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ fontSize: '1.8rem' }}>📄</span>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{n.attachment.name}</span>
                        <a href={n.attachment.data} download={n.attachment.name} style={{ fontSize: '0.72rem', color: '#60a5fa', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}>
                          📥 Download Document (PDF)
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="notice-meta">
                <span>📅 Published on {n.date} · Campus Administration</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
