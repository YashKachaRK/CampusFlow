import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:5000/api/students';

export default function FacultyStudents() {
  const [students, setStudents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', course: 'Computer Science', year: '1st Year' })

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.email) return

    try {
      if (editId) {
        const response = await fetch(`${API_URL}/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        const updatedStudent = await response.json();
        setStudents(prev => prev.map(s => s.id === editId ? updatedStudent : s));
      } else {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        const newStudent = await response.json();
        setStudents(prev => [newStudent, ...prev]);
      }

      setShowForm(false)
      setEditId(null)
      setForm({ name: '', email: '', course: 'Computer Science', year: '1st Year' })
    } catch (error) {
      console.error("Error saving student:", error);
    }
  }

  const handleEdit = (student) => {
    setForm({ name: student.name, email: student.email, course: student.course || 'Computer Science', year: student.year || '1st Year' })
    setEditId(student.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to remove this student?')) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        setStudents(prev => prev.filter(s => s.id !== id));
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
        <button className="btn btn-primary" style={{ background: '#10b981', borderColor: '#10b981', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => {
          setShowForm(v => !v)
          if(!showForm) { 
            setEditId(null)
            setForm({ name: '', email: '', course: 'Computer Science', year: '1st Year' })
          }
        }}>
          {showForm ? '✕ Cancel' : '＋ Add New Student'}
        </button>
      </div>

      {showForm && (
        <div className="form-panel" style={{ borderColor: '#10b981', marginBottom: '1.5rem', padding: '1.5rem', border: '1px solid #10b981', borderRadius: '12px', background: 'var(--bg-card)' }}>
          <div style={{ fontWeight: 700, marginBottom: '0.9rem', color: '#10b981', fontSize: '1.1rem' }}>
            {editId ? '📝 Edit Student' : '🎓 Enrol Student'}
          </div>
          <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Full Name</label>
              <input className="form-input" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border)' }} value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email</label>
              <input type="email" className="form-input" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border)' }} value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
            </div>
          </div>
          <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Course</label>
              <select className="form-select" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border)' }} value={form.course} onChange={e => setForm(f => ({...f, course: e.target.value}))}>
                <option>Computer Science</option>
                <option>Information Tech</option>
                <option>Data Science</option>
                <option>Mechanical Eng</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Year</label>
              <select className="form-select" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border)' }} value={form.year} onChange={e => setForm(f => ({...f, year: e.target.value}))}>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>
          </div>
          <button className="btn" style={{ background: '#10b981', color: '#fff', border: 'none', marginTop: '1.5rem', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }} onClick={handleSave}>
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
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>Role</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>Course</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>Year</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No students found.</td></tr>
            ) : students.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{s.name}</td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{s.email}</td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'capitalize' }}>
                  {s.role || 'Student'}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ padding: '0.3rem 0.8rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: 20, fontSize: '0.8rem', fontWeight: 'bold' }}>{s.course}</span>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{s.year}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button className="btn btn-sm" style={{ marginRight: '0.5rem', background: 'transparent', border: '1px solid #10b981', color: '#10b981', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }} onClick={() => handleEdit(s)}>Edit</button>
                  <button className="btn btn-sm btn-danger" style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }} onClick={() => handleDelete(s.id)}>Del</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}