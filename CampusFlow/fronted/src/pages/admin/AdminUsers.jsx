import { useState } from 'react'

const SAMPLE = [
  { id: 1, name: 'Yash Kacha', email: 'yash@student.edu', department: 'Software Engineering', joined: '2026-01-15' },
  { id: 2, name: 'John Doe',   email: 'john@student.edu', department: 'Computer Science',    joined: '2026-02-10' },
  { id: 3, name: 'Jane Smith', email: 'jane@student.edu', department: 'Data Science',        joined: '2026-02-20' },
]

export default function AdminUsers() {
  const [users, setUsers] = useState(SAMPLE)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', department: '' })

  const addUser = () => {
    if (!form.name.trim() || !form.email.trim()) return
    setUsers(prev => [...prev, { id: Date.now(), ...form, joined: new Date().toISOString().split('T')[0] }])
    setForm({ name: '', email: '', department: '' })
    setShowForm(false)
  }

  const del = id => setUsers(prev => prev.filter(u => u.id !== id))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '➕ Register New Student'}
        </button>
      </div>

      {showForm && (
        <div className="form-panel animate-fade-in" style={{ borderColor: '#3b82f6' }}>
          <div style={{ fontWeight: 700, marginBottom: '0.9rem', color: '#60a5fa' }}>👤 Student Registration</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Yash Kacha" />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input className="form-input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="student@college.edu" />
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input className="form-input" value={form.department} onChange={e => setForm({...form, department: e.target.value})} placeholder="e.g. Computer Science" />
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: '1.25rem' }} onClick={addUser}>Register Student</button>
        </div>
      )}

      <div className="card animate-fade-in">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1rem' }}>
              <th style={{ padding: '1rem' }}>Student Name</th>
              <th style={{ padding: '1rem' }}>Department</th>
              <th style={{ padding: '1rem' }}>Date Joined</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 700 }}>{u.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                </td>
                <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{u.department}</td>
                <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{u.joined}</td>
                <td style={{ padding: '1rem' }}>
                  <button className="btn btn-danger btn-sm" onClick={() => del(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
