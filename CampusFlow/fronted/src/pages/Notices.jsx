import { useState } from 'react'

const SAMPLE = [
  {
    id: 1,
    title: '📌 Exam Timetable Released',
    description: 'The mid-semester examination timetable has been published on the college portal. Students are advised to check their subject-wise schedule and exam hall allocation.',
    date: '2026-03-26',
    category: 'Academic',
    important: true,
    fileName: 'MidtermSchedule-2026.pdf',
    fileUrl: '#'
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
]

const CAT_COLOR = {
  Academic:  '#7c3aed',
  Event:     '#14b8a6',
  General:   '#6b7280',
  Financial: '#f59e0b',
}

export default function Notices() {
  const [notices] = useState(SAMPLE)
  const [filter, setFilter] = useState('All')
  
  // Comments mapping by notice ID
  const [comments, setComments] = useState({
    1: [{ author: 'Dr. Smith (Faculty)', text: 'Please ensure you check your respective hall numbers properly.', time: '1 hr ago' }]
  })
  const [commentInput, setCommentInput] = useState({})

  const userRole = JSON.parse(localStorage.getItem('campusflow_user'))?.role || 'student'
  const userName = JSON.parse(localStorage.getItem('campusflow_user'))?.name || 'Student'

  const categories = ['All', ...new Set(SAMPLE.map(n => n.category))]
  const filtered   = filter === 'All' ? notices : notices.filter(n => n.category === filter)

  const handleCommentSubmit = (id) => {
    if (!commentInput[id]?.trim()) return
    const newComment = {
      author: `${userName} (${userRole})`,
      text: commentInput[id],
      time: 'Just now'
    }
    setComments(prev => ({
      ...prev,
      [id]: [...(prev[id] || []), newComment]
    }))
    setCommentInput(prev => ({ ...prev, [id]: '' }))
  }

  return (
    <div className="animate-fade-in pb-10">
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
        <div key={n.id} className="notice-card animate-fade-in" style={{ animationDelay: `${i * 0.05}s`, borderLeftColor: CAT_COLOR[n.category] || '#7c3aed', marginBottom: '1.5rem', display: 'block' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            <span className="notice-title" style={{ fontSize: '1.25rem' }}>{n.title}</span>
            {n.important && <span className="badge badge-high" style={{ fontSize: '0.7rem' }}>⚠ Important</span>}
            <span className="badge" style={{ background: `${CAT_COLOR[n.category]}20`, color: CAT_COLOR[n.category], border: `1px solid ${CAT_COLOR[n.category]}40`, fontSize: '0.7rem' }}>
              {n.category}
            </span>
          </div>

          <p className="notice-desc" style={{ fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            {n.description}
          </p>

          {/* Attachment Download */}
          {n.fileName && (
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(124,58,237,0.05)', borderRadius: 12, border: '1px solid rgba(124,58,237,0.2)', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📄</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)' }}>{n.fileName}</span>
                <a href={n.fileUrl || '#'} download={n.fileName} style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}>
                  📥 Download Document
                </a>
              </div>
            </div>
          )}

          <div className="notice-meta" style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            <span>📅 Published on {n.date} · Campus Administration</span>
          </div>

          {/* Discussion / Comments Section */}
          <div className="comments-section" style={{ background: 'var(--bg-card)' }}>
             <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>💬 Discussion ({comments[n.id]?.length || 0})</h4>
             
             {/* List comments */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
               {(comments[n.id] || []).map((c, idx) => (
                 <div key={idx} style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 8, fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <strong style={{ color: c.author.includes('Faculty') ? '#10b981' : 'var(--accent)' }}>{c.author}</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{c.time}</span>
                    </div>
                    <div style={{ color: 'var(--text-primary)', lineHeight: 1.4 }}>{c.text}</div>
                 </div>
               ))}
               {(!comments[n.id] || comments[n.id].length === 0) && (
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No comments yet. Be the first to ask a question!</div>
               )}
             </div>

             {/* Add Comment Input */}
             <div style={{ display: 'flex', gap: '0.5rem' }}>
               <input 
                 className="form-input" 
                 placeholder={`Reply as ${userName}...`}
                 value={commentInput[n.id] || ''}
                 onChange={e => setCommentInput({...commentInput, [n.id]: e.target.value})}
                 onKeyDown={e => e.key === 'Enter' && handleCommentSubmit(n.id)}
                 style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} 
               />
               <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={() => handleCommentSubmit(n.id)}>
                 Post
               </button>
             </div>
          </div>
        </div>
      ))}
    </div>
  )
}
