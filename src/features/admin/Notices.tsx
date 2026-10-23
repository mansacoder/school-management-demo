import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, Trash2, Edit2, Pin, Eye } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';
import type { Notice, NoticeCategory, NoticeAudience } from '../../types';
import { classes } from '../../data/mockData';

const categoryColors: Record<NoticeCategory, string> = {
  General: 'chip-muted',
  Holiday: 'chip-primary',
  Fee: 'chip-due',
  Exam: 'chip-accent',
  Urgent: 'chip-urgent',
};

function NoticeForm({
  notice,
  onSave,
  onClose,
}: {
  notice?: Notice;
  onSave: (data: Partial<Notice>) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(notice?.title || '');
  const [body, setBody] = useState(notice?.body || '');
  const [category, setCategory] = useState<NoticeCategory>(notice?.category || 'General');
  const [audience, setAudience] = useState<NoticeAudience>(notice?.audience || 'all');
  const [targetClassIds, setTargetClassIds] = useState<string[]>(notice?.targetClassIds || []);
  const [pinned, setPinned] = useState(notice?.pinned || false);

  // Live preview for parent
  const preview = { title, body, category, audience, pinned, authorName: 'MY PUBLIC SCHOOL', createdAt: new Date().toISOString() };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) { toast.error('Title and message are required'); return; }
    onSave({ title, body, category, audience, targetClassIds, pinned });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal"
        style={{ maxWidth: 700 }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{notice ? 'Edit Notice' : 'Create Notice'}</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="input-group">
                <label className="input-label">Title *</label>
                <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Notice title..." required />
              </div>
              <div className="input-group">
                <label className="input-label">Message *</label>
                <textarea
                  className="input"
                  rows={5}
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  placeholder="Write your notice here..."
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-group">
                  <label className="input-label">Category</label>
                  <select className="input" value={category} onChange={e => setCategory(e.target.value as NoticeCategory)}>
                    {(['General', 'Holiday', 'Fee', 'Exam', 'Urgent'] as NoticeCategory[]).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Audience</label>
                  <select className="input" value={audience} onChange={e => setAudience(e.target.value as NoticeAudience)}>
                    <option value="all">All Parents</option>
                    <option value="class">Specific Class(es)</option>
                    <option value="teachers">Teachers Only</option>
                  </select>
                </div>
              </div>
              {audience === 'class' && (
                <div className="input-group">
                  <label className="input-label">Target Classes</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {classes.map(c => (
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
              )}
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
                <input type="checkbox" checked={pinned} onChange={e => setPinned(e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} />
                Pin this notice (appears first with gold accent)
              </label>
            </div>

            {/* Live Preview */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                Preview (Parent App)
              </div>
              <div style={{
                border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: 14,
                background: 'var(--muted)',
              }}>
                <div style={{ borderLeft: preview.pinned ? '3px solid var(--accent)' : 'none', paddingLeft: preview.pinned ? 10 : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <span className={`chip ${categoryColors[preview.category]}`} style={{ fontSize: 10 }}>
                      {preview.category}
                    </span>
                    {preview.pinned && <span className="chip chip-accent" style={{ fontSize: 10 }}>📌 Pinned</span>}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                    {preview.title || 'Notice Title'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.5 }}>
                    {preview.body ? preview.body.slice(0, 80) + (preview.body.length > 80 ? '...' : '') : 'Message preview...'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>just now</span>
                    <span className="chip chip-primary" style={{ fontSize: 9 }}>Admin</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {notice ? 'Save Changes' : 'Publish Notice'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminNotices() {
  const { notices, addNotice, updateNotice, deleteNotice } = useAppStore();
  const { user } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | undefined>();
  const [viewingNotice, setViewingNotice] = useState<Notice | undefined>();

  const handleSave = (data: Partial<Notice>) => {
    if (editingNotice) {
      updateNotice(editingNotice.id, data);
      toast.success('Notice updated!');
    } else {
      addNotice({
        id: `n-${Date.now()}`,
        ...data,
        authorRole: 'admin',
        authorId: user?.id || 'admin-1',
        authorName: 'MY PUBLIC SCHOOL',
        readBy: [],
        createdAt: new Date().toISOString(),
      } as Notice);
      toast.success('Notice published! Parents can see it now.', { duration: 3000 });
    }
    setShowForm(false);
    setEditingNotice(undefined);
  };

  const sorted = [...notices].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, marginBottom: 4 }}>Notices</h1>
          <p style={{ margin: 0 }}>{notices.length} notices · {notices.filter(n => n.pinned).length} pinned</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingNotice(undefined); setShowForm(true); }}>
          <Plus size={16} /> Create Notice
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sorted.map(notice => (
          <div
            key={notice.id}
            className="card"
            style={{
              padding: '16px 20px',
              borderLeft: notice.pinned ? '3px solid var(--accent)' : undefined,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span className={`chip ${categoryColors[notice.category]}`}>{notice.category}</span>
                  {notice.pinned && <span className="chip chip-accent">📌 Pinned</span>}
                  <span className="chip chip-muted">
                    {notice.audience === 'all' ? 'All Parents' : notice.audience === 'class' ? 'Class(es)' : 'Teachers'}
                  </span>
                  <span className={`chip ${notice.authorRole === 'admin' ? 'chip-primary' : 'chip-muted'}`}>
                    {notice.authorRole === 'admin' ? '🏫 Admin' : `👩‍🏫 ${notice.authorName}`}
                  </span>
                </div>
                <h4 style={{ marginBottom: 6 }}>{notice.title}</h4>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>
                  {notice.body.slice(0, 120)}{notice.body.length > 120 ? '...' : ''}
                </p>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                  {formatDistanceToNow(new Date(notice.createdAt), { addSuffix: true })} ·
                  {format(new Date(notice.createdAt), ' d MMM yyyy')}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setViewingNotice(notice)} title="View">
                  <Eye size={14} />
                </button>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => updateNotice(notice.id, { pinned: !notice.pinned })} title="Toggle pin">
                  <Pin size={14} color={notice.pinned ? 'var(--accent)' : undefined} />
                </button>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => { setEditingNotice(notice); setShowForm(true); }} title="Edit">
                  <Edit2 size={14} />
                </button>
                <button
                  className="btn btn-ghost btn-icon btn-sm"
                  style={{ color: 'var(--danger)' }}
                  onClick={() => { deleteNotice(notice.id); toast.info('Notice deleted'); }}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Notice Modal */}
      <AnimatePresence>
        {viewingNotice && (
          <div className="modal-overlay" onClick={() => setViewingNotice(undefined)}>
            <motion.div className="modal" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                    <span className={`chip ${categoryColors[viewingNotice.category]}`}>{viewingNotice.category}</span>
                    {viewingNotice.pinned && <span className="chip chip-accent">📌 Pinned</span>}
                  </div>
                  <h3>{viewingNotice.title}</h3>
                </div>
                <button className="btn btn-ghost btn-icon" onClick={() => setViewingNotice(undefined)}>✕</button>
              </div>
              <div className="modal-body">
                <p style={{ lineHeight: 1.8 }}>{viewingNotice.body}</p>
                <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                  By: {viewingNotice.authorName} · {format(new Date(viewingNotice.createdAt), 'd MMMM yyyy, h:mm a')}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showForm && (
          <NoticeForm
            notice={editingNotice}
            onSave={handleSave}
            onClose={() => { setShowForm(false); setEditingNotice(undefined); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
