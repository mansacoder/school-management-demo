import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail, Phone, MapPin, Briefcase,
  Moon, Sun, Globe, RefreshCw, LogOut, QrCode, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { students as allStudents, classes } from '../../data/mockData';

export default function ParentProfile() {
  const { user, logout } = useAuthStore();
  const { theme, setTheme, language, setLanguage, resetDemo } = useAppStore();
  const navigate = useNavigate();

  const [selectedStudentForQr, setSelectedStudentForQr] = useState<typeof allStudents[0] | null>(null);

  const myChildren = useMemo(() => {
    return allStudents.filter(s => user?.studentIds?.includes(s.id));
  }, [user]);

  const handleResetDemo = () => {
    if (window.confirm('Reset all demo data back to default?')) {
      resetDemo();
      toast.success('Demo data restored to initial state');
    }
  };

  const handleLogout = () => {
    logout();
    toast.info('Signed out successfully');
    navigate('/login');
  };

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* App Bar */}
      <div className="app-bar">
        <div className="app-bar-title">Parent Profile</div>
        <div className="app-bar-subtitle">Account, preferences & children details</div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Parent Card */}
        <div className="card" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'var(--primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            fontWeight: 700,
            margin: '0 auto 12px',
            border: '3px solid var(--accent)'
          }}>
            {user?.name?.[0] || 'P'}
          </div>
          <h3 style={{ margin: '0 0 4px', fontSize: 18 }}>{user?.name}</h3>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>
            Parent / Guardian · MY PUBLIC SCHOOL
          </p>
        </div>

        {/* Parent Details */}
        <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Contact Details
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={16} color="var(--text-muted)" />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Email</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{user?.email}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Phone size={16} color="var(--text-muted)" />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Phone</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>+91 {user?.phone}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={16} color="var(--text-muted)" />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Occupation</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Business Executive</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={16} color="var(--text-muted)" />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Address</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>12 Gandhi Marg, Model Town</div>
            </div>
          </div>
        </div>

        {/* Linked Children Details */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>
            Linked Children ({myChildren.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {myChildren.map(child => {
              const cls = classes.find(c => c.id === child.classId);
              return (
                <div key={child.id} className="card" style={{ padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: 'var(--primary-soft)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 14
                      }}>
                        {child.name[0]}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: 14 }}>{child.name}</h4>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {cls?.name} ({cls?.section}) · Roll {child.rollNo}
                        </span>
                      </div>
                    </div>

                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setSelectedStudentForQr(child)}
                      style={{ fontSize: 11, padding: '4px 10px' }}
                    >
                      <QrCode size={13} /> View ID
                    </button>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 8,
                    background: 'var(--muted)',
                    padding: 10,
                    borderRadius: 8,
                    fontSize: 11
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Blood Group: </span>
                      <strong>{child.bloodGroup || 'O+'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Gender: </span>
                      <strong>{child.gender === 'M' ? 'Male' : 'Female'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Date of Birth: </span>
                      <strong>{child.dob}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Admitted: </span>
                      <strong>{child.admissionDate}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Preferences: Theme & Language */}
        <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            App Preferences
          </div>

          {/* Theme Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {theme === 'light' ? <Sun size={18} color="var(--accent)" /> : <Moon size={18} color="var(--primary)" />}
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Theme Mode</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  Currently: {theme === 'light' ? 'Warm Ivory Light' : 'Deep Emerald Dark'}
                </div>
              </div>
            </div>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                const next = theme === 'light' ? 'dark' : 'light';
                setTheme(next);
                toast.success(`Switched to ${next} mode`);
              }}
            >
              Toggle
            </button>
          </div>

          {/* Language Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Globe size={18} color="var(--primary)" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>App Language</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {language === 'en' ? 'English (India)' : 'हिंदी (Hindi)'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                className={`btn btn-sm ${language === 'en' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => {
                  setLanguage('en');
                  toast.success('Language set to English');
                }}
                style={{ fontSize: 11, padding: '4px 10px' }}
              >
                EN
              </button>
              <button
                className={`btn btn-sm ${language === 'hi' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => {
                  setLanguage('hi');
                  toast.success('भाषा हिंदी में सेट की गई');
                }}
                style={{ fontSize: 11, padding: '4px 10px' }}
              >
                हिंदी
              </button>
            </div>
          </div>
        </div>

        {/* Demo Controls */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <RefreshCw size={18} color="var(--text-muted)" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Reset Demo Store</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Reload original sample records</div>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={handleResetDemo}>
              Reset
            </button>
          </div>
        </div>

        {/* Logout */}
        <button
          className="btn btn-danger"
          style={{ width: '100%', marginTop: 8 }}
          onClick={handleLogout}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* ID Card Modal */}
      <AnimatePresence>
        {selectedStudentForQr && (
          <div className="bottom-sheet-overlay" onClick={() => setSelectedStudentForQr(null)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'var(--surface)',
                borderRadius: 'var(--radius-xl)',
                width: '90%',
                maxWidth: 340,
                padding: 24,
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                border: '2px solid var(--accent)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div className="mps-logo" />
                <button className="btn btn-ghost btn-sm" onClick={() => setSelectedStudentForQr(null)}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 26,
                  fontWeight: 700,
                  margin: '0 auto 10px',
                  border: '3px solid var(--accent)'
                }}>
                  {selectedStudentForQr.name[0]}
                </div>
                <h3 style={{ margin: '0 0 2px', fontSize: 17 }}>{selectedStudentForQr.name}</h3>
                <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>
                  Roll No: {selectedStudentForQr.rollNo}
                </div>
              </div>

              <div style={{ background: 'var(--muted)', borderRadius: 12, padding: 12, marginBottom: 16, fontSize: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Blood Group:</span>
                  <strong>{selectedStudentForQr.bloodGroup || 'B+'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Parent:</span>
                  <strong>{user?.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Emergency No:</span>
                  <strong>{selectedStudentForQr.phone}</strong>
                </div>
              </div>

              {/* QR */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 100,
                  height: 100,
                  margin: '0 auto 8px',
                  background: 'white',
                  padding: 8,
                  borderRadius: 12,
                  border: '1.5px dashed var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <QrCode size={80} color="var(--ink)" />
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                  MY PUBLIC SCHOOL · Student Credential QR
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
