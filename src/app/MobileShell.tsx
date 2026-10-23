import { Outlet, NavLink } from 'react-router-dom';
import {
  Home, IndianRupee, BookOpen, Bell, User,
  ClipboardCheck, BookMarked
} from 'lucide-react';

const teacherTabs = [
  { to: '/teacher/home', icon: Home, label: 'Home' },
  { to: '/teacher/attendance', icon: ClipboardCheck, label: 'Attendance' },
  { to: '/teacher/classes', icon: BookMarked, label: 'Classes' },
  { to: '/teacher/notices', icon: Bell, label: 'Notices' },
  { to: '/teacher/profile', icon: User, label: 'Profile' },
];

const parentTabs = [
  { to: '/parent/home', icon: Home, label: 'Home' },
  { to: '/parent/fees', icon: IndianRupee, label: 'Fees' },
  { to: '/parent/academics', icon: BookOpen, label: 'Academics' },
  { to: '/parent/notices', icon: Bell, label: 'Notices' },
  { to: '/parent/profile', icon: User, label: 'Profile' },
];

interface Props {
  role: 'teacher' | 'parent';
}

export default function MobileShell({ role }: Props) {
  const tabs = role === 'teacher' ? teacherTabs : parentTabs;

  return (
    <>
      {/* Background for desktop centering */}
      <div style={{
        minHeight: '100dvh',
        background: 'var(--bg)',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div className="mobile-frame">
          <div className="mobile-content">
            <Outlet />
          </div>

          {/* Bottom Navigation */}
          <nav className="bottom-nav">
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
              >
                {({ isActive }) => (
                  <>
                    <div className="nav-indicator">
                      <tab.icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span className="nav-label">{tab.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
