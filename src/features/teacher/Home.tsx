import { format } from 'date-fns';
import { BookOpen, ClipboardCheck, Bell, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { timetable, homework, classes } from '../../data/mockData';

const today = new Date();
const todayDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][today.getDay()];

export default function TeacherHome() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { notices } = useAppStore();

  const myClasses = classes.filter(c => user?.classIds?.includes(c.id));
  const todayPeriods = timetable.filter(p => p.day === todayDay && user?.classIds?.includes(p.classId));
  const currentHour = today.getHours();
  const unreadNotices = notices.filter(n => !n.readBy.includes(user?.id || '')).length;

  return (
    <div>
      {/* App Bar */}
      <div className="app-bar">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="app-bar-title">Hello, {user?.name?.split(' ')[1] || 'Teacher'} 👋</div>
            <div className="app-bar-subtitle">{format(today, 'EEEE, d MMMM yyyy')}</div>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700, color: 'white',
          }}>
            {user?.name?.[0] || 'T'}
          </div>
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Stats Row */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="card" style={{ flex: 1, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Assigned Classes</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>{myClasses.length}</div>
          </div>
          <div className="card" style={{ flex: 1, padding: '12px 14px', cursor: 'pointer' }} onClick={() => navigate('/teacher/notices')}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Unread Notices</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: unreadNotices > 0 ? 'var(--accent)' : 'var(--text-primary)' }}>
              {unreadNotices}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Quick Actions
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {[
              { icon: ClipboardCheck, label: 'Mark Attendance', color: 'var(--primary)', bg: 'var(--primary-soft)', onClick: () => navigate('/teacher/attendance') },
              { icon: Plus, label: 'Add Homework', color: 'var(--accent)', bg: 'var(--accent-soft)', onClick: () => navigate('/teacher/classes') },
              { icon: Bell, label: 'Post Notice', color: '#1F9D6B', bg: '#E8F8F0', onClick: () => navigate('/teacher/notices') },
              { icon: BookOpen, label: 'Classes & Students', color: 'var(--text-secondary)', bg: 'var(--muted)', onClick: () => navigate('/teacher/classes') },
            ].map(action => (
              <button
                key={action.label}
                onClick={action.onClick}
                style={{
                  padding: '16px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 8,
                  cursor: 'pointer',
                  fontFamily: 'var(--font)',
                  textAlign: 'left',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: action.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <action.icon size={18} color={action.color} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Today's Schedule
          </div>
          {todayPeriods.length === 0 ? (
            <div className="card" style={{ padding: 24, textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>No classes scheduled today</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {todayPeriods.map(period => {
                const startHour = parseInt(period.startTime.split(':')[0]);
                const isNow = startHour === currentHour;
                const isPast = startHour < currentHour;
                const cls = classes.find(c => c.id === period.classId);
                return (
                  <div
                    key={period.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '14px 16px',
                      background: isNow ? 'var(--primary)' : 'var(--surface)',
                      border: `1px solid ${isNow ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-md)',
                      opacity: isPast && !isNow ? 0.5 : 1,
                    }}
                  >
                    <div style={{ textAlign: 'center', minWidth: 44 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isNow ? 'white' : 'var(--text-primary)' }}>
                        {period.startTime}
                      </div>
                      <div style={{ fontSize: 10, color: isNow ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>
                        {period.endTime}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: isNow ? 'white' : 'var(--text-primary)' }}>
                        {period.subject}
                      </div>
                      <div style={{ fontSize: 11, color: isNow ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>
                        {cls?.name} {cls?.section}
                      </div>
                    </div>
                    {isNow && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'white', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 20 }}>
                        NOW
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pending Homework */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Recent Homework
          </div>
          {homework.slice(0, 3).map(hw => (
            <div key={hw.id} className="card" style={{ padding: '14px 16px', marginBottom: 8 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{hw.title}</div>
              <div style={{ display: 'flex', gap: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                <span>{hw.subject}</span>
                <span>·</span>
                <span>Due {hw.dueDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
