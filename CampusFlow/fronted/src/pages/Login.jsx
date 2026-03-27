import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [tab, setTab]         = useState('login')   // 'login' | 'signup'
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'student' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError('') }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill in all required fields.'); return }
    if (tab === 'signup' && !form.name)  { setError('Please enter your full name.'); return }
    if (tab === 'signup' && form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    setLoading(true)
    // Simulate async auth
    setTimeout(() => {
      setLoading(false)
      const userData = { email: form.email, role: form.role, name: form.name || 'User' }
      localStorage.setItem('campusflow_user', JSON.stringify(userData))
      
      if (form.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/dashboard')
      }
    }, 1200)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Background glow */}
      <div style={{ position: 'absolute', top: '15%', left: '30%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '20%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '0.75rem', boxShadow: '0 0 30px rgba(124,58,237,0.4)' }}>
            🎓
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, background: 'linear-gradient(90deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
            CampusFlow
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>Your student life, organised.</div>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: '2rem', boxShadow: '0 24px 60px rgba(0,0,0,0.4)' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 10, padding: 4, marginBottom: '1.5rem' }}>
            {['login', 'signup'].map(t => (
              <button
                key={t}
                id={`tab-${t}`}
                onClick={() => { setTab(t); setError('') }}
                style={{
                  flex: 1, border: 'none', cursor: 'pointer', borderRadius: 8,
                  padding: '0.5rem', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s',
                  background: tab === t ? 'linear-gradient(135deg, #7c3aed, #3b82f6)' : 'transparent',
                  color: tab === t ? 'white' : 'var(--text-muted)',
                  boxShadow: tab === t ? '0 4px 12px rgba(124,58,237,0.35)' : 'none',
                }}
              >
                {t === 'login' ? '🔑 Log In' : '✨ Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name (signup only) */}
            {tab === 'signup' && (
              <div className="form-group animate-fade-in" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Full Name</label>
                <input id="auth-name" className="form-input" placeholder="e.g. Yash Kacha" value={form.name} onChange={e => set('name', e.target.value)} style={{ width: '100%' }} />
              </div>
            )}

            {/* Email */}
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Email Address</label>
              <input id="auth-email" type="email" className="form-input" placeholder="you@college.edu" value={form.email} onChange={e => set('email', e.target.value)} style={{ width: '100%' }} />
            </div>

            {/* Password */}
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                {tab === 'login' && (
                  <span style={{ fontSize: '0.72rem', color: '#a78bfa', cursor: 'pointer' }}>Forgot password?</span>
                )}
              </div>
              <input id="auth-password" type="password" className="form-input" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} style={{ width: '100%' }} />
            </div>

            {/* Confirm Password (signup only) */}
            {tab === 'signup' && (
              <div className="form-group animate-fade-in" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Confirm Password</label>
                <input id="auth-confirm-password" type="password" className="form-input" placeholder="••••••••" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} style={{ width: '100%' }} />
              </div>
            )}

            {/* Role */}
            <div className="form-group animate-fade-in" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Log in as / I am a...</label>
              <select id="auth-role" className="form-select" value={form.role} onChange={e => set('role', e.target.value)} style={{ width: '100%' }}>
                <option value="student">🎓 Student</option>
                <option value="admin">🛡️ Administrator</option>
              </select>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '0.6rem 0.85rem', fontSize: '0.8rem', color: '#ef4444', marginBottom: '1rem' }}>
                ⚠ {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="auth-submit-btn"
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.7rem', fontSize: '0.92rem', opacity: loading ? 0.8 : 1 }}
              disabled={loading}
            >
              {loading
                ? <span style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ width: 14, height: 14, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                    {tab === 'login' ? 'Logging in...' : 'Creating account...'}
                  </span>
                : tab === 'login' ? '🔑 Log In to Dashboard' : '✨ Create Account'
              }
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {tab === 'login'
              ? <>Don't have an account? <span id="switch-to-signup" onClick={() => setTab('signup')} style={{ color: '#a78bfa', cursor: 'pointer', fontWeight: 600 }}>Sign up</span></>
              : <>Already have an account? <span id="switch-to-login" onClick={() => setTab('login')} style={{ color: '#a78bfa', cursor: 'pointer', fontWeight: 600 }}>Log in</span></>
            }
          </div>
        </div>

        {/* Back to home */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <span id="back-to-home" onClick={() => navigate('/')} style={{ fontSize: '0.78rem', color: 'var(--text-muted)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            ← Back to Home
          </span>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
