import { useState } from 'react'

const INITIAL_STUDENTS = [
  { id: 1, name: 'John Doe', email: 'john@college.edu', course: 'Computer Science', year: '3rd Year' },
  { id: 2, name: 'Jane Smith', email: 'jane@college.edu', course: 'Information Tech', year: '2nd Year' },
  { id: 3, name: 'Sam Wilson', email: 'sam@college.edu', course: 'Data Science', year: '1st Year' },
]

export default function FacultyStudents() {
  const [students, setStudents] = useState(INITIAL_STUDENTS)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', course: 'Computer Science', year: '1st Year' })

  const handleSave = () => {
    if (!form.name || !form.email) return

    if (editId) {
      setStudents(prev => prev.map(s => s.id === editId ? { ...form, id: editId } : s))
    } else {
      setStudents(prev => [...prev, { ...form, id: Date.now() }])
    }

    setShowForm(false)
    setEditId(null)
    setForm({ name: '', email: '', course: 'Computer Science', year: '1st Year' })
  }

  const handleEdit = (student) => {
    setForm({ name: student.name, email: student.email, course: student.course, year: student.year })
    setEditId(student.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to remove this student?')) {
      setStudents(prev => prev.filter(s => s.id !== id))
    }
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
        <button className="btn btn-primary" style={{ background: '#10b981', borderColor: '#10b981' }} onClick={() => {
          setShowForm(v => !v)
          if(showForm) {
            setEditId(null)
            setForm({ name: '', email: '', course: 'Computer Science', year: '1st Year' })
          }
        }}>
          {showForm ? '✕ Cancel' : '＋ Add New Student'}
        </button>
      </div>

      {showForm && (
        <div className="form-panel" style={{ borderColor: '#10b981', marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 700, marginBottom: '0.9rem', color: '#10b981' }}>
            {editId ? '📝 Edit Student' : '🎓 Enrol Student'}
          </div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
            </div>
          </div>
          <div className="form-row" style={{ marginTop: '0.75rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Course</label>
              <select className="form-select" value={form.course} onChange={e => setForm(f => ({...f, course: e.target.value}))}>
                <option>Computer Science</option>
                <option>Information Tech</option>
                <option>Data Science</option>
                <option>Mechanical Eng</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Year</label>
              <select className="form-select" value={form.year} onChange={e => setForm(f => ({...f, year: e.target.value}))}>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>
          </div>
          <button className="btn" style={{ background: '#10b981', color: '#fff', border: 'none', marginTop: '1rem' }} onClick={handleSave}>
            ✔ {editId ? 'Update Student Details' : 'Save Student'}
          </button>
        </div>
      )}

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>Name</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>Email</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>Course</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>Year</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No students found.</td></tr>
            ) : students.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{s.name}</td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{s.email}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ padding: '0.2rem 0.6rem', background: '#3b82f620', color: '#3b82f6', borderRadius: 20, fontSize: '0.8rem' }}>{s.course}</span>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{s.year}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button className="btn btn-sm" style={{ marginRight: '0.5rem', background: 'transparent', border: '1px solid #10b981', color: '#10b981' }} onClick={() => handleEdit(s)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.id)}>Del</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
