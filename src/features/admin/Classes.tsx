import { classes, students, teachers } from '../../data/mockData';

export default function AdminClasses() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, marginBottom: 4 }}>Classes & Sections</h1>
        <p style={{ margin: 0 }}>{classes.length} sections across Nursery – Class 10</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
        {classes.map(cls => {
          const classStudents = students.filter(s => s.classId === cls.id && s.status === 'active');
          const classTeacher = teachers.find(t => t.id === cls.classTeacherId);
          return (
            <div key={cls.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: 'var(--ink)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, color: 'white',
                }}>
                  {cls.name.replace('Class ', '')}
                  {cls.section}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>{classStudents.length}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>STUDENTS</div>
                </div>
              </div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
                {cls.name} – Section {cls.section}
              </div>
              {classTeacher && (
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  CT: {classTeacher.name}
                </div>
              )}
              <div style={{ marginTop: 10, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {cls.subjectIds.slice(0, 4).map(subj => (
                  <span key={subj} className="chip chip-muted" style={{ fontSize: 10 }}>{subj}</span>
                ))}
                {cls.subjectIds.length > 4 && (
                  <span className="chip chip-muted" style={{ fontSize: 10 }}>+{cls.subjectIds.length - 4}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
