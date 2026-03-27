import { useState, useEffect } from 'react'
import axios from 'axios'

const CAT_COLOR = {
  Academic:  '#7c3aed',
  Event:     '#14b8a6',
  General:   '#6b7280',
  Financial: '#f59e0b',
}

export default function Notices() {
  const [notices, setNotices] = useState([])
  const [filter, setFilter] = useState('All')
  // const [comments, setComments] = useState({})
  // const [commentInput, setCommentInput] = useState({})
  const [selectedNotice, setSelectedNotice] = useState(null)
  const [editForm, setEditForm] = useState(null)

  const userRole = JSON.parse(localStorage.getItem('campusflow_user'))?.role || 'student'
  //const userName = JSON.parse(localStorage.getItem('campusflow_user'))?.name || 'Student'

  // Fetch notices
  const fetchNotices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notices')
      setNotices(res.data)
    } catch (err) {
      console.error('Failed to fetch notices:', err)
    }
  }

  useEffect(() => { fetchNotices() }, [])

  const categories = ['All', ...new Set(notices.map(n => n.category))]
  const filtered = filter === 'All' ? notices : notices.filter(n => n.category === filter)

  // Comment handling
  // const handleCommentSubmit = (id) => {
  //   if (!commentInput[id]?.trim()) return
  //   const newComment = { author: `${userName} (${userRole})`, text: commentInput[id], time: 'Just now' }
  //   setComments(prev => ({ ...prev, [id]: [...(prev[id] || []), newComment] }))
  //   setCommentInput(prev => ({ ...prev, [id]: '' }))
  // }

  // Update Notice
  const handleUpdateNotice = async (id) => {
    try {
      const updated = await axios.put(`http://localhost:5000/api/notices/${id}`, editForm)
      setNotices(prev => prev.map(n => n.id === id ? updated.data : n))
      setEditForm(null)
      setSelectedNotice(null)
    } catch (err) {
      console.error('Update failed:', err)
    }
  }

  return (
    <div className="animate-fade-in pb-10">

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button key={c} className="btn btn-secondary btn-sm"
                  onClick={() => setFilter(c)}
                  style={filter === c ? { borderColor: '#a78bfa', color: '#a78bfa', background: 'rgba(167,139,250,0.1)' } : {}}>
            {c}
          </button>
        ))}
      </div>

      {/* Notices */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-text">No notices in this category.</div>
        </div>
      ) : filtered.map((n, i) => (
        <div key={n.id} className="notice-card animate-fade-in" style={{ animationDelay: `${i * 0.05}s`, borderLeftColor: CAT_COLOR[n.category] || '#7c3aed', marginBottom: '1.5rem', display: 'block' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            <span className="notice-title" style={{ fontSize: '1.25rem', cursor: 'pointer' }}
                  onClick={() => setSelectedNotice(n)}>
              {n.title}
            </span>
            {n.important && <span className="badge badge-high" style={{ fontSize: '0.7rem' }}>⚠ Important</span>}
            <span className="badge" style={{ background: `${CAT_COLOR[n.category]}20`, color: CAT_COLOR[n.category], border: `1px solid ${CAT_COLOR[n.category]}40`, fontSize: '0.7rem' }}>
              {n.category}
            </span>
          </div>

          {/* Description */}
          <p style={{ fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            {n.description}
          </p>

          {/* Attachments */}
          {n.file_name && (
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(124,58,237,0.05)', borderRadius: 12, border: '1px solid rgba(124,58,237,0.2)', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📄</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)' }}>{n.file_name}</span>
                <a href={n.file_url || '#'} download={n.file_name} style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 600 }}>📥 Download</a>
              </div>
            </div>
          )}

          <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            <span>📅 Published on {new Date(n.created_at || n.date).toLocaleDateString()} · Campus Administration</span>
          </div>

          {/* Faculty Edit Option */}
          {userRole === 'faculty' && (
            <button className="btn btn-sm btn-warning" onClick={() => setEditForm(n)}>
              ✏ Edit Notice
            </button>
          )}
        </div>
      ))}

      {/* View Notice Modal */}
      {selectedNotice && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedNotice.title}</h3>
            <p>{selectedNotice.description}</p>
            {selectedNotice.file_name && <a href={selectedNotice.file_url} download={selectedNotice.file_name}>📥 Download Attachment</a>}
            <button onClick={() => setSelectedNotice(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Edit Notice Modal */}
      {editForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Notice</h3>
            <input type="text" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} />
            <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})}></textarea>
            <select value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}>
              {Object.keys(CAT_COLOR).map(c => <option key={c}>{c}</option>)}
            </select>
            <label>
              Important:
              <input type="checkbox" checked={editForm.important} onChange={e => setEditForm({...editForm, important: e.target.checked})} />
            </label>
            <button className="btn btn-primary" onClick={() => handleUpdateNotice(editForm.id)}>Save Changes</button>
            <button className="btn btn-secondary" onClick={() => setEditForm(null)}>Cancel</button>
          </div>
        </div>
      )}

    </div>
  )
}