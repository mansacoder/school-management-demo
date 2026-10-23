import { useAuthStore } from '../../store/authStore';
import { classes, students as allStudents } from '../../data/mockData';
import { Phone, MessageSquare } from 'lucide-react';

export default function TeacherClasses() {
  const { user } = useAuthStore();
  const myClasses = classes.filter(c => user?.classIds?.includes(c.id));

  return (
    <div>
      <div className="app-bar">
        <div className="app-bar-title">My Classes</div>
        <div className="app-bar-subtitle">{myClasses.length} class(es) assigned</div>
      </div>

      <div style={{ padding: 16 }}>
        {myClasses.map(cls => {
          const classStudents = allStudents.filter(s => s.classId === cls.id && s.status === 'active');
          return (
            <div key={cls.id} style={{ marginBottom: 20 }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 12,
                padding: '12px 16px',
                background: 'var(--primary)',
                borderRadius: 'var(--radius-lg)',
                color: 'white',
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{cls.name} – Section {cls.section}</div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>{classStudents.length} students</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {classStudents.slice(0, 10).map(student => (
                  <div key={student.id} className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'var(--primary-soft)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, color: 'var(--primary)',
                      flexShrink: 0,
                    }}>
                      {student.name[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{student.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Roll {student.rollNo}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <a href={`tel:${student.phone}`} className="btn btn-ghost btn-icon btn-sm">
                        <Phone size={14} />
                      </a>
                      <a href={`https://wa.me/91${student.phone}`} target="_blank" rel="noreferrer" className="btn btn-ghost btn-icon btn-sm">
                        <MessageSquare size={14} />
                      </a>
                    </div>
                  </div>
                ))}
                {classStudents.length > 10 && (
                  <div style={{ padding: '10px', textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
                    +{classStudents.length - 10} more students
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
