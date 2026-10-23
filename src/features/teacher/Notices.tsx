import { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import type { Notice, NoticeCategory } from '../../types';
import { classes } from '../../data/mockData';

const categoryColors: Record<NoticeCategory, string> = {
  General: 'chip-muted',
  Holiday: 'chip-primary',
  Fee: 'chip-due',
  Exam: 'chip-accent',
  Urgent: 'chip-urgent',
};

export default function TeacherNotices() {
  const { user } = useAuthStore();
  const { notices, addNotice, markNoticeRead } = useAppStore();
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('General');
  const [targetClassIds, setTargetClassIds] = useState<string[]>(user?.classIds || []);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const myClasses = classes.filter(c => user?.classIds?.includes(c.id));

  // Show all relevant notices
  const relevantNotices = notices.filter(n =>
    n.audience === 'all' ||
    n.audience === 'teachers' ||
    (n.audience === 'class' && n.targetClassIds?.some(id => user?.classIds?.includes(id))) ||
    n.authorId === user?.id
  ).sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const unread = relevantNotices.filter(n => !n.readBy.includes(user?.id || ''));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) { toast.error('Fill all fields'); return; }
    addNotice({
      id: `n-${Date.now()}`,
      title,
      body,
      category,
      audience: 'class',
      targetClassIds,
      authorRole: 'teacher',
      authorId: user?.id || 'teacher-demo',
      authorName: user?.name || 'Teacher',
      pinned: false,
      createdAt: new Date().toISOString(),
      readBy: [],
    });
    toast.success('Notice posted! Parents can see it now.');
    setTitle('');
    setBody('');
    setShowCreate(false);
  };

  const openNotice = (notice: Notice) => {
    setSelectedNotice(notice);
    if (user?.id) markNoticeRead(notice.id, user.id);
  };

  return (
    <div>
      <div className="app-bar">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="app-bar-title">Notices</div>
            {unread.length > 0 && (
              <div className="app-bar-subtitle">{unread.length} unread</div>
            )}
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>
            <Plus size={15} /> Post
          </button>
        </div>
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {relevantNotices.map(notice => {
          const isUnread = !notice.readBy.includes(user?.id || '');
          return (
            <div
              key={notice.id}
              className="card"
              onClick={() => openNotice(notice)}
              style={{
                padding: '14px 16px',
                cursor: 'pointer',
                borderLeft: notice.pinned ? '3px solid var(--accent)' : undefined,
                opacity: isUnread ? 1 : 0.75,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span className={`chip ${categoryColors[notice.category]}`} style={{ fontSize: 10 }}>
                      {notice.category}
                    </span>
                    <span className={`chip ${notice.authorRole === 'admin' ? 'chip-primary' : 'chip-muted'}`} style={{ fontSize: 10 }}>
                      {notice.authorRole === 'admin' ? '🏫 Admin' : `👩‍🏫 ${notice.authorName}`}
                    </span>
                  </div>
                  <div style={{ fontWeight: isUnread ? 700 : 600, fontSize: 13, marginBottom: 4 }}>{notice.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                    {notice.body.slice(0, 60)}...
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {formatDistanceToNow(new Date(notice.createdAt), { addSuffix: true })}
                  </div>
                </div>
                {isUnread && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: 4 }} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Notice Sheet */}
      <AnimatePresence>
        {showCreate && (
          <>
            <motion.div className="sheet-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreate(false)} />
            <motion.div className="sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30 }}>
              <div className="sheet-handle" />
              <div className="sheet-header">
                <h4>Post Notice to Parents</h4>
              </div>
              <div className="sheet-body">
                <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="input-group">
                    <label className="input-label">Title</label>
                    <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Notice title..." required />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Message</label>
                    <textarea className="input" rows={4} value={body} onChange={e => setBody(e.target.value)} placeholder="Write message..." required style={{ resize: 'none' }} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Category</label>
                    <select className="input" value={category} onChange={e => setCategory(e.target.value as NoticeCategory)}>
                      {(['General', 'Exam', 'Urgent'] as NoticeCategory[]).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Target Classes</label>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {myClasses.map(c => (
                        <button
                          type="button"
                          key={c.id}
                          className={`btn btn-sm ${targetClassIds.includes(c.id) ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => setTargetClassIds(prev => prev.includes(c.id) ? prev.filter(id => id !== c.id) : [...prev, c.id])}
                        >
                          {c.name} {c.section}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="button" className="btn btn-ghost" onClick={() => setShowCreate(false)} style={{ flex: 1 }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Post Notice</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}

        {/* View Notice */}
        {selectedNotice && (
          <>
            <motion.div className="sheet-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedNotice(null)} />
            <motion.div className="sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30 }}>
              <div className="sheet-handle" />
              <div className="sheet-header">
                <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span className={`chip ${categoryColors[selectedNotice.category]}`}>{selectedNotice.category}</span>
                  {selectedNotice.pinned && <span className="chip chip-accent">📌 Pinned</span>}
                </div>
                <h4>{selectedNotice.title}</h4>
              </div>
              <div className="sheet-body">
                <p style={{ lineHeight: 1.8, fontSize: 14 }}>{selectedNotice.body}</p>
                <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                  By: {selectedNotice.authorName} · {format(new Date(selectedNotice.createdAt), 'd MMMM yyyy')}
                </div>
                <button className="btn btn-ghost" style={{ marginTop: 16, width: '100%' }} onClick={() => setSelectedNotice(null)}>
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
