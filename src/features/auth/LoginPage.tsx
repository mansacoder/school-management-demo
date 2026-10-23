import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import type { AuthUser } from '../../types';
import { Shield, GraduationCap, Users } from 'lucide-react';

const demoAccounts: AuthUser[] = [
  {
    id: 'admin-1',
    name: 'Dr. Rajesh Sharma',
    email: 'admin@mypublicschool.edu.in',
    role: 'admin',
    phone: '9876543210',
  },
  {
    id: 'teacher-demo',
    name: 'Mrs. Priya Sharma',
    email: 'priya.sharma@mypublicschool.edu.in',
    role: 'teacher',
    phone: '9876543211',
    teacherId: 't-1',
    classIds: ['c-nur', 'c-nur-b'],
  },
  {
    id: 'parent-demo',
    name: 'Mr. Ramesh Sharma',
    email: 'ramesh.sharma@gmail.com',
    role: 'parent',
    phone: '9876543212',
    parentId: 'p-1',
    studentIds: ['s-1', 's-2'],
  },
];

const roleCards = [
  {
    account: demoAccounts[0],
    icon: Shield,
    title: 'Admin',
    subtitle: 'Dashboard, Fees, Students, Teachers',
    gradient: 'linear-gradient(135deg, #0B4F45 0%, #1A7A6E 100%)',
    badge: 'Desktop',
  },
  {
    account: demoAccounts[1],
    icon: GraduationCap,
    title: 'Teacher',
    subtitle: 'Attendance, Classes, Notices',
    gradient: 'linear-gradient(135deg, #C8A24A 0%, #E8C374 100%)',
    badge: 'Mobile PWA',
  },
  {
    account: demoAccounts[2],
    icon: Users,
    title: 'Parent',
    subtitle: 'Fees, Notices, Academics',
    gradient: 'linear-gradient(135deg, #14201D 0%, #2D4A44 100%)',
    badge: 'Mobile PWA',
  },
];

export default function LoginPage() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = (account: AuthUser) => {
    login(account);
    navigate(`/${account.role}`);
  };

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(11,79,69,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(200,162,74,0.08) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 480, position: 'relative' }}
      >
        {/* Logo + School Name */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}
          >
            <div className="mps-logo-lg" style={{
              boxShadow: '0 8px 32px rgba(11,79,69,0.3)',
            }}>
              MPS
            </div>
          </motion.div>

          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
            MY PUBLIC SCHOOL
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            School Management Portal · Academic Year 2025–26
          </p>

          {/* Demo Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 12,
            padding: '4px 14px',
            background: 'var(--accent-soft)',
            border: '1px solid var(--accent)',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--accent)',
          }}>
            <div style={{ width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%' }} />
            LIVE DEMO — One-tap login
          </div>
        </div>

        {/* Role Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {roleCards.map((card, i) => (
            <motion.button
              key={card.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLogin(card.account)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '18px 20px',
                background: 'var(--surface)',
                border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s ease',
                width: '100%',
                fontFamily: 'var(--font)',
              }}
            >
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: card.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <card.icon size={24} color="white" />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {card.title}
                  </span>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 10,
                    background: 'var(--muted)',
                    color: 'var(--text-muted)',
                  }}>
                    {card.badge}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{card.subtitle}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  {card.account.name} · {card.account.email}
                </div>
              </div>

              <div style={{
                padding: '6px 14px',
                background: 'var(--primary)',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                color: 'white',
                flexShrink: 0,
              }}>
                Login →
              </div>
            </motion.button>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: 28, fontSize: 12, color: 'var(--text-muted)' }}>
          Frontend-only demo · All data is mock · No real credentials required
        </p>
      </motion.div>
    </div>
  );
}
