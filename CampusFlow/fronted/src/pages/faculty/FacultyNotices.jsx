import { useState, useEffect } from 'react';
import axios from 'axios';



export default function FacultyNotices() {
  const [notices, setNotices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', file: null });

  const fetchNotices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notices');
      setNotices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handlePost = async () => {
    if (!form.title || !form.content) return;

    let fileData = null;
    if (form.file) {
      fileData = {
        file_name: form.file.name,
        file_url: URL.createObjectURL(form.file)
      };
    }

    try {
      const res = await axios.post('http://localhost:5000/api/notices', {
        title: form.title,
        description: form.content,
        ...fileData,
        faculty_id: 1 // dynamic faculty id
      });
      setNotices([res.data, ...notices]);
      setForm({ title: '', content: '', file: null });
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notices/${id}`);
      setNotices(notices.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
        <button className="btn" style={{ background: '#10b981', color: '#fff', border: 'none' }} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '＋ Post New Notice'}
        </button>
      </div>

      {showForm && (
        <div className="form-panel" style={{ borderColor: '#10b981', marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 700, marginBottom: '0.9rem', color: '#10b981' }}>📝 Create Notice</div>
          <div className="form-group">
            <label className="form-label">Notice Title</label>
            <input className="form-input" placeholder="e.g. Exam Schedule Update" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </div>
          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label className="form-label">Notice Content</label>
            <textarea className="form-input" placeholder="Type the announcement here..." rows="4" style={{ resize: 'vertical' }} value={form.content} onChange={e => setForm({...form, content: e.target.value})}></textarea>
          </div>
          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label className="form-label">Attachment (Notes / PDF)</label>
            <input type="file" className="form-input" style={{ padding: '0.4rem', background: 'var(--bg-secondary)' }} onChange={e => setForm({...form, file: e.target.files[0] || null})} />
          </div>
          <button className="btn" style={{ background: '#10b981', color: '#fff', border: 'none', marginTop: '1rem', width: '100%' }} onClick={handlePost}>
            📢 Post to Students
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {notices.map(notice => (
          <div key={notice.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, marginBottom: '0.25rem' }}>POSTED ON {notice.date}</div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{notice.title}</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {notice.content}
              </p>
              {notice.fileName && (
                <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: '#10b98115', borderRadius: 8, display: 'inline-block' }}>
                  <a href={notice.fileUrl} download={notice.fileName} style={{ color: '#10b981', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    📎 {notice.fileName}
                  </a>
                </div>
              )}
            </div>
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(notice.id)}>🗑 Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
