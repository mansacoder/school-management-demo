import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarCheck, BookOpen, Award, Clock,
  ChevronLeft, ChevronRight, CheckCircle2,
  Bus, QrCode, Send, X, FileText
} from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { toast } from 'sonner';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import {
  students as allStudents, classes, homework as allHomework,
  exams as allExams, timetable as allTimetable
} from '../../data/mockData';

export default function ParentAcademics() {
  const { user } = useAuthStore();
  const { attendanceRecords } = useAppStore();

  const myChildren = useMemo(() => {
    return allStudents.filter(s => user?.studentIds?.includes(s.id));
  }, [user]);

  const [selectedChildId, setSelectedChildId] = useState<string>(
    myChildren[0]?.id || 's-1'
  );

  const currentChild = myChildren.find(s => s.id === selectedChildId) || myChildren[0] || allStudents[0];
  const currentClass = classes.find(c => c.id === currentChild?.classId);

  // Tabs
  const [activeTab, setActiveTab] = useState<'attendance' | 'homework' | 'results' | 'timetable' | 'extras'>('attendance');

  // Attendance Calendar state
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  // Extras modals
  const [showIdCard, setShowIdCard] = useState(false);
  const [showBusTrack, setShowBusTrack] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveDays, setLeaveDays] = useState('1');

  // Homework completion mock state
  const [completedHw, setCompletedHw] = useState<Record<string, boolean>>({});

  // Child's attendance records
  const childAttendance = useMemo(() => {
    if (!currentChild) return [];
    return attendanceRecords.filter(r => r.studentId === currentChild.id);
  }, [attendanceRecords, currentChild]);

  // Attendance stats
  const attStats = useMemo(() => {
    const total = childAttendance.length || 1;
    const present = childAttendance.filter(r => r.status === 'present').length;
    const absent = childAttendance.filter(r => r.status === 'absent').length;
    const late = childAttendance.filter(r => r.status === 'late').length;
    const percentage = Math.round((present / total) * 100);
    return { total, present, absent, late, percentage };
  }, [childAttendance]);

  // Calendar dates
  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentMonthDate);
    const end = endOfMonth(currentMonthDate);
    return eachDayOfInterval({ start, end });
  }, [currentMonthDate]);

  // Homework for child's class
  const classHomework = useMemo(() => {
    if (!currentChild) return [];
    return allHomework.filter(h => h.classId === currentChild.classId);
  }, [currentChild]);

  // Exams & Results for child
  const upcomingExams = useMemo(() => {
    if (!currentChild) return [];
    return allExams.filter(e => e.classId === currentChild.classId);
  }, [currentChild]);

  // Result chart comparison data
  const resultChartData = useMemo(() => {
    return [
      { subject: 'Math', student: 88, classAvg: 74 },
      { subject: 'Science', student: 92, classAvg: 79 },
      { subject: 'English', student: 85, classAvg: 81 },
      { subject: 'Hindi', student: 78, classAvg: 72 },
      { subject: 'Social Sci', student: 90, classAvg: 76 },
    ];
  }, []);

  // Timetable
  const [selectedDay, setSelectedDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'>('Mon');
  const daySchedule = useMemo(() => {
    if (!currentChild) return [];
    return allTimetable
      .filter(t => t.classId === currentChild.classId && t.day === selectedDay)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [currentChild, selectedDay]);

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim()) {
      toast.error('Please enter a reason for leave');
      return;
    }
    toast.success(`Leave application for ${leaveDays} day(s) submitted to Class Teacher!`);
    setShowLeaveModal(false);
    setLeaveReason('');
  };

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* App Bar */}
      <div className="app-bar">
        <div className="app-bar-title">Academics</div>
        <div className="app-bar-subtitle">Performance, attendance & schedules</div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Child Switcher (if multiple) */}
        {myChildren.length > 1 && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {myChildren.map(c => {
              const isSelected = c.id === selectedChildId;
              const cls = classes.find(cl => cl.id === c.classId);
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedChildId(c.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-full)',
                    border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                    background: isSelected ? 'var(--primary)' : 'var(--surface)',
                    color: isSelected ? 'white' : 'var(--text-primary)',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{c.name}</span>
                  <span style={{
                    fontSize: 10,
                    opacity: 0.8,
                    background: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--muted)',
                    padding: '1px 6px',
                    borderRadius: 10
                  }}>
                    {cls?.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Child Summary Card */}
        <div className="card" style={{ padding: '16px', background: 'linear-gradient(135deg, var(--surface) 0%, var(--primary-soft) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'var(--primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 700
              }}>
                {currentChild?.name?.[0] || 'S'}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 16 }}>{currentChild?.name}</h3>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {currentClass?.name} - {currentClass?.section} · Roll No: {currentChild?.rollNo}
                </div>
              </div>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowIdCard(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--primary)', fontSize: 11 }}
            >
              <QrCode size={14} /> ID Card
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          background: 'var(--muted)',
          padding: 4,
          borderRadius: 'var(--radius-lg)',
          gap: 4
        }}>
          {[
            { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
            { id: 'homework', label: 'Homework', icon: BookOpen },
            { id: 'results', label: 'Results', icon: Award },
            { id: 'timetable', label: 'Timetable', icon: Clock },
            { id: 'extras', label: 'Services', icon: Bus },
          ].map(t => {
            const isActive = activeTab === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  padding: '8px 2px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: isActive ? 'var(--surface)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 10,
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── TAB 1: ATTENDANCE ── */}
        {activeTab === 'attendance' && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              <div className="card" style={{ padding: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>{attStats.percentage}%</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Overall</div>
              </div>
              <div className="card" style={{ padding: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--success)' }}>{attStats.present}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Present</div>
              </div>
              <div className="card" style={{ padding: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--danger)' }}>{attStats.absent}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Absent</div>
              </div>
              <div className="card" style={{ padding: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--warning)' }}>{attStats.late}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Late</div>
              </div>
            </div>

            {/* Month Calendar Card */}
            <div className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h4 style={{ margin: 0, fontSize: 14 }}>{format(currentMonthDate, 'MMMM yyyy')}</h4>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setCurrentMonthDate(d => subDays(startOfMonth(d), 1))}
                    style={{ padding: '4px 8px' }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setCurrentMonthDate(new Date())}
                    style={{ fontSize: 11, padding: '4px 8px' }}
                  >
                    Today
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setCurrentMonthDate(d => endOfMonth(d))}
                    style={{ padding: '4px 8px' }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Day headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center', marginBottom: 6 }}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <span key={i} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>{d}</span>
                ))}
              </div>

              {/* Calendar Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
                {daysInMonth.map((day, idx) => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const isCurrentMonth = isSameMonth(day, currentMonthDate);
                  const isToday = isSameDay(day, new Date());
                  const rec = childAttendance.find(a => a.date === dateStr);
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                  let bgColor = 'transparent';
                  let textColor = 'var(--text-primary)';
                  let dotColor = 'transparent';

                  if (rec) {
                    if (rec.status === 'present') dotColor = 'var(--success)';
                    else if (rec.status === 'absent') dotColor = 'var(--danger)';
                    else if (rec.status === 'late') dotColor = 'var(--warning)';
                  } else if (isWeekend) {
                    textColor = 'var(--text-muted)';
                  }

                  if (isToday) {
                    bgColor = 'var(--primary-soft)';
                    textColor = 'var(--primary)';
                  }

                  return (
                    <div
                      key={idx}
                      style={{
                        height: 38,
                        borderRadius: 8,
                        background: bgColor,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: isCurrentMonth ? 1 : 0.3,
                        fontSize: 12,
                        fontWeight: isToday ? 700 : 500,
                        color: textColor,
                        position: 'relative',
                        border: isToday ? '1px solid var(--primary)' : '1px solid transparent'
                      }}
                    >
                      <span>{format(day, 'd')}</span>
                      {dotColor !== 'transparent' && (
                        <span style={{
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          background: dotColor,
                          position: 'absolute',
                          bottom: 4
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 14, fontSize: 11, color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} /> Present
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)' }} /> Absent
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warning)' }} /> Late
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── TAB 2: HOMEWORK ── */}
        {activeTab === 'homework' && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Assigned Tasks ({classHomework.length})
              </span>
            </div>

            {classHomework.length === 0 ? (
              <div className="card" style={{ padding: 30, textAlign: 'center' }}>
                <CheckCircle2 size={36} color="var(--success)" style={{ margin: '0 auto 8px' }} />
                <h4 style={{ margin: '0 0 4px' }}>All caught up!</h4>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>No pending homework for {currentClass?.name}.</p>
              </div>
            ) : (
              classHomework.map(hw => {
                const isDone = completedHw[hw.id];
                return (
                  <div
                    key={hw.id}
                    className="card"
                    style={{
                      padding: 16,
                      borderLeft: `4px solid ${isDone ? 'var(--success)' : 'var(--accent)'}`,
                      opacity: isDone ? 0.75 : 1
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                      <div>
                        <span className="chip chip-muted" style={{ fontSize: 10, marginBottom: 6 }}>
                          {hw.subject}
                        </span>
                        <h4 style={{ margin: '4px 0', fontSize: 14, textDecoration: isDone ? 'line-through' : 'none' }}>
                          {hw.title}
                        </h4>
                      </div>
                      <button
                        onClick={() => {
                          setCompletedHw(prev => ({ ...prev, [hw.id]: !prev[hw.id] }));
                          if (!isDone) toast.success(`Marked "${hw.title}" as completed!`);
                        }}
                        style={{
                          background: isDone ? 'var(--success)' : 'var(--muted)',
                          color: isDone ? 'white' : 'var(--text-secondary)',
                          border: 'none',
                          borderRadius: 'var(--radius-full)',
                          padding: '4px 10px',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <CheckCircle2 size={13} /> {isDone ? 'Completed' : 'Mark Done'}
                      </button>
                    </div>

                    <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {hw.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                      <span>Due: <strong>{hw.dueDate}</strong></span>
                      <span>Assigned by Class Teacher</span>
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        )}

        {/* ── TAB 3: RESULTS & EXAMS ── */}
        {activeTab === 'results' && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Term 1 Card */}
            <div className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 14 }}>Term 1 Report Card</h4>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>Overall Grade: <strong style={{ color: 'var(--primary)' }}>A (86.6%)</strong></p>
                </div>
                <span className="chip chip-accent" style={{ fontSize: 11, fontWeight: 700 }}>Rank #4</span>
              </div>

              {/* Chart */}
              <div style={{ height: 180, width: '100%', marginBottom: 12 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={resultChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="subject" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, fontFamily: 'Poppins' }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="student" name="Student Score" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="classAvg" name="Class Average" fill="#C8A24A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Marks Table */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {resultChartData.map(res => (
                  <div key={res.subject} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: 'var(--muted)', borderRadius: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{res.subject}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{res.student}/100</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Avg: {res.classAvg}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Exam Schedule */}
            <div className="card" style={{ padding: 16 }}>
              <h4 style={{ margin: '0 0 10px', fontSize: 13, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Upcoming Term 2 Schedule
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {upcomingExams.map(ex => (
                  <div key={ex.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{ex.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Date: {ex.date} · Duration: {ex.duration} mins</div>
                    </div>
                    <span className="chip chip-due" style={{ fontSize: 10 }}>Max {ex.maxMarks}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── TAB 4: TIMETABLE ── */}
        {activeTab === 'timetable' && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Day Selector Chips */}
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
              {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const).map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${selectedDay === day ? 'var(--primary)' : 'var(--border)'}`,
                    background: selectedDay === day ? 'var(--primary)' : 'var(--surface)',
                    color: selectedDay === day ? 'white' : 'var(--text-primary)',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {day}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {daySchedule.map((p, i) => (
                <div
                  key={p.id}
                  className="card"
                  style={{
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                  }}
                >
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'var(--primary-soft)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{p.subject}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Classroom 102 · Period {i + 1}</div>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary)' }}>
                    {p.startTime} - {p.endTime}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── TAB 5: SERVICES / EXTRAS ── */}
        {activeTab === 'extras' && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Service Cards */}
            <div
              className="card"
              onClick={() => setShowBusTrack(true)}
              style={{
                padding: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: '#FFF5E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bus size={22} color="var(--accent)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>School Bus Tracking</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Route 12 · Bus No: DL-01-A-4421 · On Time</div>
              </div>
              <span className="chip chip-success" style={{ fontSize: 10 }}>Live</span>
            </div>

            <div
              className="card"
              onClick={() => setShowIdCard(true)}
              style={{
                padding: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'var(--primary-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <QrCode size={22} color="var(--primary)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Digital Student ID Card</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Official verifiable ID with student QR</div>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" />
            </div>

            <div
              className="card"
              onClick={() => setShowLeaveModal(true)}
              style={{
                padding: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: '#E8F8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileText size={22} color="var(--success)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Apply for Student Leave</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Submit absence notice directly to teacher</div>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" />
            </div>
          </motion.div>
        )}
      </div>

      {/* ── MODAL 1: DIGITAL ID CARD ── */}
      <AnimatePresence>
        {showIdCard && (
          <div className="bottom-sheet-overlay" onClick={() => setShowIdCard(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'var(--surface)',
                borderRadius: 'var(--radius-xl)',
                width: '90%',
                maxWidth: 340,
                padding: 24,
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                border: '2px solid var(--accent)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div className="mps-logo" />
                <button className="btn btn-ghost btn-sm" onClick={() => setShowIdCard(false)}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 26,
                  fontWeight: 700,
                  margin: '0 auto 10px',
                  border: '3px solid var(--accent)'
                }}>
                  {currentChild?.name?.[0] || 'S'}
                </div>
                <h3 style={{ margin: '0 0 2px', fontSize: 17 }}>{currentChild?.name}</h3>
                <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>
                  {currentClass?.name} - Section {currentClass?.section}
                </div>
              </div>

              <div style={{ background: 'var(--muted)', borderRadius: 12, padding: 12, marginBottom: 16, fontSize: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Roll Number:</span>
                  <strong>{currentChild?.rollNo}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Date of Birth:</span>
                  <strong>{currentChild?.dob}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Blood Group:</span>
                  <strong>{currentChild?.bloodGroup || 'B+'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Emergency Contact:</span>
                  <strong>{currentChild?.phone}</strong>
                </div>
              </div>

              {/* QR Code Mock */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 110,
                  height: 110,
                  margin: '0 auto 8px',
                  background: 'white',
                  padding: 8,
                  borderRadius: 12,
                  border: '1.5px dashed var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <QrCode size={90} color="var(--ink)" />
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                  Scan to verify MPS Student Credentials
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 2: BUS TRACKING ── */}
      <AnimatePresence>
        {showBusTrack && (
          <div className="bottom-sheet-overlay" onClick={() => setShowBusTrack(false)}>
            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              className="bottom-sheet"
              onClick={e => e.stopPropagation()}
            >
              <div className="bottom-sheet-handle" />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Bus size={20} color="var(--accent)" />
                  <h3 style={{ margin: 0, fontSize: 16 }}>Live Bus Tracking</h3>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowBusTrack(false)}>
                  <X size={18} />
                </button>
              </div>

              {/* Map Mock Simulation */}
              <div style={{
                height: 180,
                background: 'linear-gradient(135deg, #E4F0EC 0%, #FAF8F3 100%)',
                borderRadius: 'var(--radius-lg)',
                border: '1.5px solid var(--border)',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  position: 'absolute',
                  width: '80%',
                  height: 2,
                  background: 'var(--primary)',
                  top: '50%'
                }} />
                {/* Moving Bus Marker */}
                <motion.div
                  animate={{ x: [-80, 80] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  style={{
                    background: 'var(--accent)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    zIndex: 2
                  }}
                >
                  <Bus size={14} /> Bus 12 (En Route)
                </motion.div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Estimated Arrival at Stop:</span>
                  <strong style={{ color: 'var(--primary)' }}>03:45 PM (In 15 mins)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Designated Stop:</span>
                  <strong>Gandhi Nagar Sector 3</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Driver Contact:</span>
                  <strong>Mr. Ramesh (+91 98765 12345)</strong>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 3: LEAVE APPLICATION ── */}
      <AnimatePresence>
        {showLeaveModal && (
          <div className="bottom-sheet-overlay" onClick={() => setShowLeaveModal(false)}>
            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              className="bottom-sheet"
              onClick={e => e.stopPropagation()}
            >
              <div className="bottom-sheet-handle" />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ margin: 0, fontSize: 16 }}>Apply for Leave</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowLeaveModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleApplyLeave} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="input-group">
                  <label className="input-label">Student</label>
                  <input className="input" value={currentChild?.name} readOnly style={{ background: 'var(--muted)' }} />
                </div>
                <div className="input-group">
                  <label className="input-label">Number of Days</label>
                  <select className="input" value={leaveDays} onChange={e => setLeaveDays(e.target.value)}>
                    <option value="1">1 Day</option>
                    <option value="2">2 Days</option>
                    <option value="3">3 Days</option>
                    <option value="5">5 Days</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Reason for Absence</label>
                  <textarea
                    className="input"
                    rows={3}
                    placeholder="e.g. Fever and doctor appointment..."
                    value={leaveReason}
                    onChange={e => setLeaveReason(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: 6 }}>
                  <Send size={15} /> Submit Application
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
