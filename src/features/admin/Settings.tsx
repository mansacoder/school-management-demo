import { toast } from 'sonner';
import { Moon, Sun, RefreshCw } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export default function AdminSettings() {
  const { theme, setTheme, resetDemo } = useAppStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 640 }}>
      <div>
        <h1 style={{ fontSize: 22, marginBottom: 4 }}>Settings</h1>
        <p style={{ margin: 0 }}>Configure school settings and preferences</p>
      </div>

      {/* School Profile */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div className="mps-logo-lg" />
          <div>
            <h3>MY PUBLIC SCHOOL</h3>
            <p style={{ margin: 0, fontSize: 13 }}>School Code: MPS-2025 · Affiliated: CBSE</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { label: 'School Name', value: 'MY PUBLIC SCHOOL' },
            { label: 'Academic Year', value: '2025–2026' },
            { label: 'Principal', value: 'Dr. Rajesh Sharma' },
            { label: 'Contact', value: '+91 98765 43210' },
            { label: 'Email', value: 'admin@mypublicschool.edu.in' },
            { label: 'Address', value: '1 School Road, Education City' },
          ].map(item => (
            <div key={item.label} className="input-group">
              <label className="input-label">{item.label}</label>
              <input className="input" value={item.value} readOnly style={{ background: 'var(--muted)' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div className="card" style={{ padding: 24 }}>
        <h4 style={{ marginBottom: 16 }}>Appearance</h4>
        <div style={{ display: 'flex', gap: 12 }}>
          {(['light', 'dark'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              style={{
                flex: 1,
                padding: '16px',
                border: `2px solid ${theme === t ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                background: t === 'dark' ? '#0B1311' : 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'var(--font)',
                transition: 'all 0.18s',
              }}
            >
              {t === 'light' ? <Sun size={24} color="#0B4F45" /> : <Moon size={24} color="#1A7A6E" />}
              <span style={{ fontSize: 13, fontWeight: 600, color: t === 'dark' ? 'white' : 'var(--text-primary)' }}>
                {t === 'light' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Demo Reset */}
      <div className="card" style={{ padding: 24, border: '1.5px solid var(--danger)' }}>
        <h4 style={{ color: 'var(--danger)', marginBottom: 8 }}>Danger Zone</h4>
        <p style={{ fontSize: 13, marginBottom: 16 }}>
          Reset all demo data to its initial state. This will clear all payments, notices, and attendance recorded during the demo.
        </p>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => {
            if (confirm('Reset all demo data? This cannot be undone.')) {
              resetDemo();
              toast.success('Demo data reset successfully!');
            }
          }}
        >
          <RefreshCw size={14} /> Reset Demo Data
        </button>
      </div>
    </div>
  );
}
