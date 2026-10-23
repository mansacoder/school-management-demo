import { teachers, classes } from '../../data/mockData';
import { Phone, Mail, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminTeachers() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, marginBottom: 4 }}>Teachers</h1>
        <p style={{ margin: 0 }}>{teachers.length} staff members</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {teachers.map(t => {
          const teacherClasses = classes.filter(c => t.classIds.includes(c.id));
          return (
            <div key={t.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: 'var(--primary-soft)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 700, color: 'var(--primary)',
                  flexShrink: 0,
                }}>
                  {t.name.split(' ').slice(-1)[0][0]}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.designation}</div>
                </div>
                <span className={`chip ${t.status === 'active' ? 'chip-paid' : 'chip-muted'}`} style={{ marginLeft: 'auto' }}>
                  {t.status}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: 'var(--text-secondary)' }}>
                  <BookOpen size={13} color="var(--text-muted)" />
                  {t.subject} · {t.qualification}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: 'var(--text-secondary)' }}>
                  <Phone size={13} color="var(--text-muted)" />
                  {t.phone}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: 'var(--text-secondary)', wordBreak: 'break-all' }}>
                  <Mail size={13} color="var(--text-muted)" />
                  {t.email}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  Joined: {format(new Date(t.joinDate), 'd MMM yyyy')}
                </div>
              </div>

              {teacherClasses.length > 0 && (
                <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {teacherClasses.map(c => (
                    <span key={c.id} className="chip chip-primary" style={{ fontSize: 10 }}>
                      {c.name} {c.section}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
