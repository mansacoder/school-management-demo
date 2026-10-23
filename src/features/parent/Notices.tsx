import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, CheckCircle2, X } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import type { Notice, NoticeCategory } from '../../types';

const categoryColors: Record<NoticeCategory, string> = {
  General: 'chip-muted',
  Holiday: 'chip-primary',
  Fee: 'chip-due',
  Exam: 'chip-accent',
  Urgent: 'chip-urgent',
};

export default function ParentNotices() {
  const { user } = useAuthStore();
  const { notices, markNoticeRead } = useAppStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const userId = user?.id || '';

  // Filter & Search
  const filteredNotices = useMemo(() => {
    return notices
      .filter(n => {
        // Search
        const matchSearch =
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.body.toLowerCase().includes(search.toLowerCase()) ||
          n.authorName.toLowerCase().includes(search.toLowerCase());

        // Category / Author Filter
        let matchFilter = true;
        if (filter === 'unread') {
          matchFilter = !n.readBy.includes(userId);
        } else if (filter === 'admin') {
          matchFilter = n.authorRole === 'admin';
        } else if (filter === 'teachers') {
          matchFilter = n.authorRole === 'teacher';
        } else if (filter === 'urgent') {
          matchFilter = n.category === 'Urgent' || n.pinned;
        } else if (filter === 'fee') {
          matchFilter = n.category === 'Fee';
        } else if (filter === 'exam') {
          matchFilter = n.category === 'Exam';
        }

        return matchSearch && matchFilter;
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        if (a.category === 'Urgent' && b.category !== 'Urgent') return -1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [notices, search, filter, userId]);

  const unreadCount = notices.filter(n => !n.readBy.includes(userId)).length;

  const handleOpenNotice = (n: Notice) => {
    setSelectedNotice(n);
    if (!n.readBy.includes(userId)) {
      markNoticeRead(n.id, userId);
    }
  };

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* App Bar */}
      <div className="app-bar">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="app-bar-title">Notice Board</div>
            <div className="app-bar-subtitle">Circulars from School & Teachers</div>
          </div>
          {unreadCount > 0 && (
            <span style={{
              background: 'var(--danger)',
              color: 'white',
              fontSize: 11,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 20
            }}>
              {unreadCount} unread
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Search */}
        <div className="search-bar">
          <Search size={16} />
          <input
            placeholder="Search circulars, announcements..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {[
            { id: 'all', label: 'All Notices' },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'urgent', label: 'Urgent & Pinned' },
            { id: 'admin', label: 'From Admin' },
            { id: 'teachers', label: 'From Teachers' },
            { id: 'fee', label: 'Fee Circulars' },
            { id: 'exam', label: 'Exams' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                border: `1px solid ${filter === f.id ? 'var(--primary)' : 'var(--border)'}`,
                background: filter === f.id ? 'var(--primary)' : 'var(--surface)',
                color: filter === f.id ? 'white' : 'var(--text-secondary)',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notice List */}
        {filteredNotices.length === 0 ? (
          <div className="card" style={{ padding: 36, textAlign: 'center' }}>
            <Bell size={40} color="var(--text-muted)" style={{ margin: '0 auto 10px', opacity: 0.5 }} />
            <h4 style={{ margin: '0 0 6px' }}>No notices found</h4>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>
              {search ? 'Try adjusting your search criteria.' : 'You have no notices in this category.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredNotices.map(notice => {
              const isUnread = !notice.readBy.includes(userId);
              return (
                <div
                  key={notice.id}
                  onClick={() => handleOpenNotice(notice)}
                  className={`card ${notice.pinned ? 'notice-pinned' : ''}`}
                  style={{
                    padding: '16px',
                    cursor: 'pointer',
                    position: 'relative',
                    borderLeft: notice.pinned
                      ? '4px solid var(--accent)'
                      : notice.category === 'Urgent'
                      ? '4px solid var(--danger)'
                      : '1px solid var(--border)'
                  }}
                >
                  {/* Top Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, gap: 6, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className={`chip ${categoryColors[notice.category]}`} style={{ fontSize: 10 }}>
                        {notice.category}
                      </span>
                      {notice.pinned && (
                        <span className="chip chip-accent" style={{ fontSize: 9 }}>
                          📌 Pinned
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {/* Author Chip */}
                      <span style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: notice.authorRole === 'admin' ? 'var(--primary)' : 'var(--text-secondary)',
                        background: notice.authorRole === 'admin' ? 'var(--primary-soft)' : 'var(--muted)',
                        padding: '2px 8px',
                        borderRadius: 10
                      }}>
                        {notice.authorRole === 'admin' ? '🏛️ Admin' : `👩‍🏫 ${notice.authorName}`}
                      </span>

                      {/* Unread indicator */}
                      {isUnread && (
                        <span style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: 'var(--danger)'
                        }} />
                      )}
                    </div>
                  </div>

                  <h4 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {notice.title}
                  </h4>

                  <p style={{
                    margin: '0 0 10px',
                    fontSize: 12,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {notice.body}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--text-muted)' }}>
                    <span>{format(new Date(notice.createdAt), 'dd MMM yyyy, hh:mm a')}</span>
                    <span>{formatDistanceToNow(new Date(notice.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full Notice Bottom Sheet */}
      <AnimatePresence>
        {selectedNotice && (
          <div className="bottom-sheet-overlay" onClick={() => setSelectedNotice(null)}>
            <motion.div
              initial={{ y: 250, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 250, opacity: 0 }}
              className="bottom-sheet"
              onClick={e => e.stopPropagation()}
            >
              <div className="bottom-sheet-handle" />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span className={`chip ${categoryColors[selectedNotice.category]}`} style={{ fontSize: 11 }}>
                    {selectedNotice.category}
                  </span>
                  {selectedNotice.pinned && (
                    <span className="chip chip-accent" style={{ fontSize: 10 }}>📌 Pinned</span>
                  )}
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setSelectedNotice(null)}>
                  <X size={18} />
                </button>
              </div>

              <h2 style={{ fontSize: 18, marginBottom: 8, lineHeight: 1.3 }}>{selectedNotice.title}</h2>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                background: 'var(--muted)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 16,
                fontSize: 12
              }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: selectedNotice.authorRole === 'admin' ? 'var(--primary)' : 'var(--accent)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700
                }}>
                  {selectedNotice.authorRole === 'admin' ? 'M' : 'T'}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{selectedNotice.authorName}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    {selectedNotice.authorRole === 'admin' ? 'School Administration' : 'Class Teacher'} · {format(new Date(selectedNotice.createdAt), 'dd MMMM yyyy, hh:mm a')}
                  </div>
                </div>
              </div>

              <div style={{
                fontSize: 13,
                lineHeight: 1.7,
                color: 'var(--text-primary)',
                whiteSpace: 'pre-line',
                marginBottom: 20
              }}>
                {selectedNotice.body}
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => setSelectedNotice(null)}
              >
                <CheckCircle2 size={16} /> Acknowledged
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
