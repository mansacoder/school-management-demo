import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import { IndianRupee, BookOpen, CalendarCheck, Bell, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { students as allStudents, classes, events, homework } from '../../data/mockData';
import type { Notice, NoticeCategory } from '../../types';

function formatInr(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

const categoryColors: Record<NoticeCategory, string> = {
  General: 'chip-muted',
  Holiday: 'chip-primary',
  Fee: 'chip-due',
  Exam: 'chip-accent',
  Urgent: 'chip-urgent',
};

function NoticeBox({ notices, userId, onViewAll }: {
  notices: Notice[];
  userId: string;
  onViewAll: () => void;
}) {
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const { markNoticeRead } = useAppStore();

  const sorted = [...notices].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (a.category === 'Urgent' && b.category !== 'Urgent') return -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const unread = notices.filter(n => !n.readBy.includes(userId));

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={16} color="var(--text-muted)" />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Notices
            </span>
            {unread.length > 0 && (
              <span style={{
                background: 'var(--danger)',
                color: 'white',
                fontSize: 10,
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: 10,
              }}>
                {unread.length}
              </span>
            )}
          </div>
          <button
            onClick={onViewAll}
            style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}
          >
            View all →
          </button>
        </div>

        <div className="notice-box">
          {sorted.slice(0, 3).map((notice, i) => {
            const isUnread = !notice.readBy.includes(userId);
            return (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`notice-item ${notice.pinned ? 'notice-pinned' : ''}`}
                onClick={() => {
                  setSelectedNotice(notice);
                  markNoticeRead(notice.id, userId);
                }}
              >
                <div style={{ display: 'flex', gap: 8, marginBottom: 5, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span className={`chip ${categoryColors[notice.category]}`} style={{ fontSize: 10 }}>
                    {notice.category}
                  </span>
                  {notice.pinned && (
                    <span className="chip chip-accent" style={{ fontSize: 9 }}>📌 Pinned</span>
                  )}
                  {/* Author chip */}
                  <span className={`chip ${notice.authorRole === 'admin' ? 'chip-primary' : 'chip-muted'}`} style={{ fontSize: 10 }}>
                    {notice.authorRole === 'admin' ? '🏫 Admin' : `👩‍🏫 ${notice.authorName}`}
                  </span>
                  {isUnread && (
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)', marginLeft: 2 }} />
                  )}
                </div>
                <div style={{ fontWeight: isUnread ? 700 : 600, fontSize: 13, marginBottom: 3 }}>
                  {notice.title}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 5 }}>
                  {notice.body.slice(0, 70)}{notice.body.length > 70 ? '...' : ''}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {formatDistanceToNow(new Date(notice.createdAt), { addSuffix: true })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Notice Detail Sheet */}
      {selectedNotice && (
        <>
          <div className="sheet-overlay" onClick={() => setSelectedNotice(null)} />
          <motion.div className="sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}>
            <div className="sheet-handle" />
            <div className="sheet-header">
              <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                <span className={`chip ${categoryColors[selectedNotice.category]}`}>{selectedNotice.category}</span>
                {selectedNotice.pinned && <span className="chip chip-accent">📌 Pinned</span>}
                <span className={`chip ${selectedNotice.authorRole === 'admin' ? 'chip-primary' : 'chip-muted'}`}>
                  {selectedNotice.authorRole === 'admin' ? '🏫 MY PUBLIC SCHOOL' : `👩‍🏫 ${selectedNotice.authorName} · Class Teacher`}
                </span>
              </div>
              <h4>{selectedNotice.title}</h4>
            </div>
            <div className="sheet-body">
              <p style={{ lineHeight: 1.8, fontSize: 14 }}>{selectedNotice.body}</p>
              <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                {format(new Date(selectedNotice.createdAt), 'd MMMM yyyy, h:mm a')}
              </div>
              <button className="btn btn-ghost" style={{ marginTop: 20, width: '100%' }} onClick={() => setSelectedNotice(null)}>
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}

export default function ParentHome() {
  const { user } = useAuthStore();
  const { notices, invoices } = useAppStore();
  const navigate = useNavigate();
  const [selectedChildIdx, setSelectedChildIdx] = useState(0);

  const myStudents = allStudents.filter(s => user?.studentIds?.includes(s.id));
  const selectedChild = myStudents[selectedChildIdx];
  const childClass = selectedChild ? classes.find(c => c.id === selectedChild.classId) : null;

  // Dues for selected child
  const childDues = invoices.filter(inv =>
    inv.studentId === selectedChild?.id && (inv.status === 'due' || inv.status === 'overdue')
  );
  const dueAmount = childDues.reduce((s, inv) => s + inv.amount + inv.lateFeeAmount, 0);

  // Notices relevant to parent
  const parentNotices = notices.filter(n => {
    if (n.audience === 'teachers') return false;
    if (n.audience === 'all') return true;
    if (n.audience === 'class' && selectedChild && n.targetClassIds?.includes(selectedChild.classId)) return true;
    return false;
  });

  // Attendance: simulate (85% present)
  const attendancePercent = 87;

  // Today's homework
  const todayHomework = homework.filter(hw =>
    selectedChild && hw.classId === selectedChild.classId
  ).slice(0, 2);

  // Upcoming events
  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .slice(0, 3);

  return (
    <div>
      {/* App Bar */}
      <div className="app-bar" style={{ background: 'var(--primary)', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>MY PUBLIC SCHOOL</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'white', lineHeight: 1.3 }}>
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'} 👋
            </div>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700, color: 'white',
          }}>
            {user?.name?.[0] || 'P'}
          </div>
        </div>

        {/* Child Switcher */}
        {myStudents.length > 1 && (
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {myStudents.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setSelectedChildIdx(i)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  background: i === selectedChildIdx ? 'white' : 'rgba(255,255,255,0.2)',
                  color: i === selectedChildIdx ? 'var(--primary)' : 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: 'var(--font)',
                  transition: 'all 0.18s',
                }}
              >
                {s.name.split(' ')[0]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Notice Box — TOP REQUIREMENT */}
        <NoticeBox
          notices={parentNotices}
          userId={user?.id || ''}
          onViewAll={() => navigate('/parent/notices')}
        />

        {/* Child Status Row */}
        {selectedChild && (
          <div style={{ marginBottom: 20 }}>
            <div className="card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'var(--primary-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 700, color: 'var(--primary)',
                flexShrink: 0,
              }}>
                {selectedChild.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{selectedChild.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {childClass?.name} {selectedChild.section} · Roll {selectedChild.rollNo}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--success)' }}>{attendancePercent}%</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Attendance</div>
              </div>
            </div>
          </div>
        )}

        {/* Fee Due Card */}
        {dueAmount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: 20 }}
          >
            <div style={{
              background: 'linear-gradient(135deg, var(--danger) 0%, #E55B51 100%)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'white',
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.8 }}>FEE DUE</div>
                <div style={{ fontSize: 24, fontWeight: 700, fontVariantNumeric: 'tabular-nums', margin: '4px 0' }}>
                  {formatInr(dueAmount)}
                </div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>{childDues.length} pending payment(s)</div>
              </div>
              <button
                className="btn"
                style={{ background: 'white', color: 'var(--danger)', fontWeight: 700 }}
                onClick={() => navigate('/parent/fees')}
              >
                Pay Now
              </button>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Quick Access
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {[
              { icon: IndianRupee, label: 'Fees', path: '/parent/fees', color: 'var(--success)' },
              { icon: GraduationCap, label: 'Academics', path: '/parent/academics', color: 'var(--primary)' },
              { icon: Bell, label: 'Notices', path: '/parent/notices', color: 'var(--accent)' },
              { icon: CalendarCheck, label: 'Events', path: '/parent/academics', color: 'var(--text-secondary)' },
            ].map(action => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                style={{
                  padding: '12px 8px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  cursor: 'pointer', fontFamily: 'var(--font)',
                }}
              >
                <action.icon size={20} color={action.color} />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Today's Homework */}
        {todayHomework.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Homework Due Soon
            </div>
            {todayHomework.map(hw => (
              <div key={hw.id} className="card" style={{ padding: '14px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'var(--accent-soft)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <BookOpen size={16} color="var(--accent)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{hw.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{hw.subject} · Due {hw.dueDate}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Upcoming Events
            </div>
            {upcomingEvents.map(event => (
              <div key={event.id} className="card" style={{ padding: '12px 16px', marginBottom: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'var(--ink)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  color: 'white', flexShrink: 0,
                }}>
                  <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>{format(new Date(event.date), 'd')}</div>
                  <div style={{ fontSize: 9, fontWeight: 600, opacity: 0.7 }}>{format(new Date(event.date), 'MMM')}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{event.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{event.type}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
