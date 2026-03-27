import { useNavigate } from 'react-router-dom'

const features = [
  { icon: '✅', title: 'Task Manager',    desc: 'Add, prioritize, and track assignments with color-coded priorities.' },
  { icon: '📅', title: 'Smart Schedule',  desc: 'Organize events, exams, and workshops in a clean timeline view.' },
  { icon: '📢', title: 'Campus Notices',  desc: 'Never miss an announcement — categorized and filterable.' },
  { icon: '🏠', title: 'Live Dashboard',  desc: 'See your day at a glance: pending tasks, events, and urgent alerts.' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', overflowX: 'hidden' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.1rem 2.5rem',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(22,22,40,0.85)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
          }}>🎓</div>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, background: 'linear-gradient(90deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            CampusFlow
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button id="nav-login-btn" className="btn btn-secondary" onClick={() => navigate('/login')}>Log In</button>
          <button id="nav-signup-btn" className="btn btn-primary" onClick={() => navigate('/login')}>Get Started →</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '6rem 2rem 4rem', position: 'relative' }}>
        {/* Glow blobs */}
        <div style={{
          position: 'absolute', top: '10%', left: '20%', width: 400, height: 400,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '20%', right: '15%', width: 300, height: 300,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.35)',
            borderRadius: 20, padding: '0.35rem 1rem', fontSize: '0.78rem', color: '#a78bfa',
            marginBottom: '1.5rem', fontWeight: 600,
          }}>
            🚀 Built for students, by students
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1,
            marginBottom: '1.25rem', letterSpacing: '-1.5px',
          }}>
            Manage your campus life<br />
            <span style={{ background: 'linear-gradient(90deg, #a78bfa, #60a5fa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              all in one place
            </span>
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            CampusFlow helps students stay on top of tasks, schedule events, and never miss a notice — with a beautiful, distraction-free interface.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button id="hero-get-started" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }} onClick={() => navigate('/login')}>
              🚀 Get Started Free
            </button>
            {/* <button id="hero-dashboard-preview" className="btn btn-secondary" style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }} onClick={() => navigate('/dashboard')}>
              👀 Preview Dashboard
            </button> */}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Card */}
      <section style={{ padding: '0 2rem 4rem', maxWidth: 900, margin: '0 auto' }}>
        <div style={{
          border: '1px solid var(--border)', borderRadius: 20,
          background: 'var(--bg-secondary)',
          padding: '1.5rem',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
        }}>
          {/* Fake browser bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.5rem 0.75rem', background: 'var(--bg-card)', borderRadius: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
            <div style={{ flex: 1, background: 'var(--bg-primary)', borderRadius: 6, height: 22, display: 'flex', alignItems: 'center', paddingLeft: '0.75rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              🔒 campusflow.app/dashboard
            </div>
          </div>
          {/* Mini dashboard preview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
            {[
              { label: 'Total Tasks', value: '8', color: '#a78bfa' },
              { label: 'Pending',     value: '5', color: '#f59e0b' },
              { label: 'Events Today',value: '2', color: '#60a5fa' },
              { label: 'Urgent',      value: '3', color: '#ef4444' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--bg-card)', borderRadius: 10, padding: '0.75rem', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {['📌 Submit Math Assignment', '🔴 Physics Lab Report'].map(t => (
              <div key={t} style={{ flex: 1, background: 'var(--bg-card)', borderRadius: 8, padding: '0.6rem 0.85rem', border: '1px solid rgba(239,68,68,0.25)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '2rem 2rem 5rem', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Everything you need</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.9rem' }}>Four powerful modules designed around the student experience</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem' }}>
          {features.map((f, i) => (
            <div key={f.title} className="card animate-fade-in" style={{ animationDelay: `${i * 0.08}s`, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: '0.4rem' }}>{f.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '0 2rem 5rem', maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(59,130,246,0.15))',
          border: '1px solid rgba(124,58,237,0.3)', borderRadius: 20, padding: '3rem 2rem',
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Ready to flow? 🌊</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Join students who manage their campus life smarter.</p>
          <button id="cta-start-btn" className="btn btn-primary" style={{ padding: '0.75rem 2.5rem', fontSize: '1rem' }} onClick={() => navigate('/login')}>
            Start for Free →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '1.5rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
        <span>© 2026 CampusFlow · Made with ❤️ for students</span>
        <span>AI Hackathon 2026</span>
      </footer>
    </div>
  )
}
