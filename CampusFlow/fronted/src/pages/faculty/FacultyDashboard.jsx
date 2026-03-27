import React, { useState, useEffect } from 'react'

const API_URL = 'http://localhost:5000/api/dashboard/faculty';

export default function FacultyDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    activeClasses: 0,
    totalNotices: 0,
    upcomingEvents: 0
  });

  const [loading, setLoading] = useState(true);

  // Fetch live stats from the database
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Map the fetched data to your styling array
  const stats = [
    { title: 'Total Students', value: dashboardData.totalStudents, icon: '👥', color: '#3b82f6' },
    { title: 'Active Classes', value: dashboardData.activeClasses, icon: '🏫', color: '#10b981' },
    { title: 'New Notices', value: dashboardData.totalNotices, icon: '📢', color: '#f59e0b' },
    { title: 'Upcoming Events', value: dashboardData.upcomingEvents, icon: '📅', color: '#8b5cf6' },
  ]

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map((s, i) => (
           <div key={i} className="stat-card" style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 12, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'transform 0.2s', cursor: 'default' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${s.color}20`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{s.title}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                  {loading ? '...' : s.value}
                </div>
              </div>
           </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 12, border: '1px solid var(--border)' }}>
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>Welcome to the Faculty Portal</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          From here you can manage all your students, create new notices for your classes, schedule events, and manage your weekly timetable. Use the sidebar to navigate to different sections.
        </p>
      </div>
      
      {/* Optional: Add hover effect style for the cards */}
      <style>{`
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  )
}