import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { useNavigate } from 'react-router-dom';
import { LogOut, Moon, Sun, BookOpen, GraduationCap, Phone, Mail } from 'lucide-react';

export default function TeacherProfile() {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useAppStore();
  const navigate = useNavigate();

  return (
    <div>
      <div className="app-bar">
        <div className="app-bar-title">Profile</div>
      </div>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Avatar */}
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 700, color: 'white',
            margin: '0 auto 12px',
          }}>
            {user?.name?.[0] || 'T'}
          </div>
          <h3 style={{ marginBottom: 4 }}>{user?.name}</h3>
          <p style={{ margin: 0, fontSize: 13 }}>Class Teacher · MY PUBLIC SCHOOL</p>
        </div>

        {/* Details */}
        <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { icon: Mail, label: 'Email', value: user?.email },
            { icon: Phone, label: 'Phone', value: user?.phone },
            { icon: GraduationCap, label: 'Role', value: 'Class Teacher' },
            { icon: BookOpen, label: 'School', value: 'MY PUBLIC SCHOOL' },
          ].map(item => item.value && (
            <div key={item.label} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'var(--muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <item.icon size={16} color="var(--text-muted)" />
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Theme */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              {theme === 'light' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </span>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
              Switch
            </button>
          </div>
        </div>

        {/* Logout */}
        <button
          className="btn btn-danger"
          style={{ width: '100%', marginTop: 8 }}
          onClick={() => { logout(); navigate('/login'); }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}
