import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { CheckCircle2, XCircle, Clock, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { students as allStudents, classes } from '../../data/mockData';
import type { AttendanceStatus, AttendanceRecord } from '../../types';

const today = format(new Date(), 'yyyy-MM-dd');

const statusConfig = {
  present: { color: 'var(--success)', bg: '#E8F8F0', icon: CheckCircle2, label: 'P' },
  absent: { color: 'var(--danger)', bg: '#FDE8E7', icon: XCircle, label: 'A' },
  late: { color: 'var(--warning)', bg: '#FFF5E5', icon: Clock, label: 'L' },
  holiday: { color: 'var(--text-muted)', bg: 'var(--muted)', icon: Clock, label: 'H' },
} as const;

export default function TeacherAttendance() {
  const { user } = useAuthStore();
  const { addAttendance, attendanceRecords } = useAppStore();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [submitted, setSubmitted] = useState(false);

  const myClasses = classes.filter(c => user?.classIds?.includes(c.id));
  const cls = myClasses.length === 1 ? myClasses[0] : classes.find(c => c.id === selectedClass);
  const classStudents = cls ? allStudents.filter(s => s.classId === cls.id && s.status === 'active') : [];

  const todayRecords = attendanceRecords.filter(r => r.date === today && r.classId === cls?.id);
  const alreadyMarked = todayRecords.length > 0;

  const getStatus = (studentId: string): AttendanceStatus => {
    return attendance[studentId] || 'present';
  };

  const toggleStatus = (studentId: string) => {
    const current = getStatus(studentId);
    const next: AttendanceStatus = current === 'present' ? 'absent' : current === 'absent' ? 'late' : 'present';
    setAttendance(prev => ({ ...prev, [studentId]: next }));
  };

  const counts = classStudents.reduce((acc, s) => {
    const status = getStatus(s.id);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleSubmit = () => {
    if (!cls) return;
    const records: AttendanceRecord[] = classStudents.map(s => ({
      id: `att-${Date.now()}-${s.id}`,
      studentId: s.id,
      classId: cls.id,
      date: today,
      status: getStatus(s.id),
      markedBy: user?.teacherId || 't-1',
    }));
    addAttendance(records);
    setSubmitted(true);
    toast.success('Attendance marked successfully!');
  };

  // Class selector
  if (!cls) {
    return (
      <div>
        <div className="app-bar">
          <div className="app-bar-title">Attendance</div>
          <div className="app-bar-subtitle">{format(new Date(), 'EEEE, d MMM')}</div>
        </div>
        <div style={{ padding: 20 }}>
          <p style={{ marginBottom: 16, color: 'var(--text-secondary)', fontSize: 14 }}>Select a class to mark attendance</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {myClasses.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedClass(c.id)}
                style={{
                  padding: '16px 20px',
                  background: 'var(--surface)',
                  border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{c.name} – {c.section}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {allStudents.filter(s => s.classId === c.id && s.status === 'active').length} students
                  </div>
                </div>
                <div style={{ fontSize: 20 }}>→</div>
              </button>
            ))}
            {myClasses.length === 0 && (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No classes assigned</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (submitted || alreadyMarked) {
    return (
      <div>
        <div className="app-bar">
          <button onClick={() => { setSelectedClass(null); setSubmitted(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 4, color: 'var(--text-muted)', fontFamily: 'var(--font)', fontSize: 13 }}>
            ← Change Class
          </button>
          <div className="app-bar-title">{cls.name} – {cls.section}</div>
        </div>
        <div style={{ padding: 32, textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'var(--success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <Check size={40} color="white" />
          </motion.div>
          <h3>Attendance {alreadyMarked && !submitted ? 'Already Marked' : 'Submitted!'}</h3>
          <p style={{ margin: '8px 0 24px' }}>
            {format(new Date(), 'd MMMM yyyy')} · {cls.name} {cls.section}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ padding: '12px 20px', background: '#E8F8F0', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--success)' }}>{counts.present || 0}</div>
              <div style={{ fontSize: 11, color: 'var(--success)' }}>Present</div>
            </div>
            <div style={{ padding: '12px 20px', background: '#FDE8E7', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--danger)' }}>{counts.absent || 0}</div>
              <div style={{ fontSize: 11, color: 'var(--danger)' }}>Absent</div>
            </div>
            <div style={{ padding: '12px 20px', background: '#FFF5E5', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--warning)' }}>{counts.late || 0}</div>
              <div style={{ fontSize: 11, color: 'var(--warning)' }}>Late</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="app-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setSelectedClass(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontFamily: 'var(--font)', fontSize: 13, padding: 0 }}>
            ←
          </button>
          <div>
            <div className="app-bar-title">{cls.name} – Section {cls.section}</div>
            <div className="app-bar-subtitle">
              {format(new Date(), 'd MMM yyyy')} · {classStudents.length} students
            </div>
          </div>
        </div>

        {/* Live counter */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          {Object.entries(statusConfig).map(([status, config]) => (
            <div key={status} style={{ flex: 1, padding: '8px', background: config.bg, borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: config.color }}>{counts[status] || 0}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: config.color }}>{status}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '12px 16px 16px' }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
          Tap to cycle: Present → Absent → Late
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {classStudents.map((student, i) => {
            const status = getStatus(student.id);
            const config = statusConfig[status];
            return (
              <motion.button
                key={student.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => toggleStatus(student.id)}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 16px',
                  background: config.bg,
                  border: `1.5px solid ${config.color}30`,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font)',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'var(--surface)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: 'var(--text-primary)',
                  flexShrink: 0,
                }}>
                  {student.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{student.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Roll {student.rollNo}</div>
                </div>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: config.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: 'white',
                }}>
                  {config.label}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <div style={{
        position: 'fixed',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: 398,
        zIndex: 50,
      }}>
        <button
          className="btn btn-primary"
          style={{ width: '100%', fontSize: 15, padding: '14px' }}
          onClick={handleSubmit}
        >
          <Check size={18} />
          Submit Attendance ({classStudents.length} students)
        </button>
      </div>
    </div>
  );
}
