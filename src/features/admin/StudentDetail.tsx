import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, User, Calendar, BookOpen, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';
import { students, classes, parents } from '../../data/mockData';
import { useAppStore } from '../../store/appStore';

function formatInr(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoices } = useAppStore();

  const student = students.find(s => s.id === id);
  if (!student) return <div className="empty-state"><p>Student not found.</p></div>;

  const cls = classes.find(c => c.id === student.classId);
  const parent = parents.find(p => p.id === student.parentId);
  const studentInvoices = invoices.filter(inv => inv.studentId === student.id);
  const paidAmt = studentInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const dueAmt = studentInvoices.filter(i => i.status === 'due' || i.status === 'overdue').reduce((s, i) => s + i.amount + i.lateFeeAmount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <button className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back to Students
      </button>

      {/* Profile Header */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{
            width: 80, height: 80,
            borderRadius: 20,
            background: 'var(--primary-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 700, color: 'var(--primary)',
          }}>
            {student.name[0]}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ marginBottom: 4 }}>{student.name}</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="chip chip-primary">{cls?.name} {student.section}</span>
              <span className="chip chip-muted">Roll No. {student.rollNo}</span>
              <span className={`chip ${student.status === 'active' ? 'chip-paid' : 'chip-muted'}`}>{student.status}</span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginTop: 24 }}>
          {[
            { label: 'Date of Birth', value: format(new Date(student.dob), 'd MMM yyyy'), icon: Calendar },
            { label: 'Gender', value: student.gender === 'M' ? 'Male' : 'Female', icon: User },
            { label: 'Blood Group', value: student.bloodGroup || '—', icon: User },
            { label: 'Admission Date', value: format(new Date(student.admissionDate), 'd MMM yyyy'), icon: Calendar },
            { label: 'Phone', value: student.phone, icon: Phone },
            { label: 'Class Teacher', value: 'Mrs. Priya Sharma', icon: BookOpen },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'var(--muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <item.icon size={15} color="var(--text-muted)" />
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Parent Info */}
      {parent && (
        <div className="card" style={{ padding: 20 }}>
          <h4 style={{ marginBottom: 16 }}>Parent / Guardian</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'var(--muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700, color: 'var(--text-muted)',
            }}>{parent.name[0]}</div>
            <div>
              <div style={{ fontWeight: 600 }}>{parent.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{parent.phone} · {parent.email}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{parent.occupation}</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <a href={`tel:${parent.phone}`} className="btn btn-outline btn-sm">
                <Phone size={13} /> Call
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Fee Summary */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h4>Fee Ledger</h4>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/fees/collect')}>
            <IndianRupee size={13} /> Collect Fee
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
          {[
            { label: 'Total', value: paidAmt + dueAmt, color: 'var(--text-primary)', bg: 'var(--muted)' },
            { label: 'Paid', value: paidAmt, color: 'var(--success)', bg: '#E8F8F0' },
            { label: 'Due', value: dueAmt, color: 'var(--danger)', bg: '#FDE8E7' },
          ].map(item => (
            <div key={item.label} style={{ background: item.bg, borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: item.color, fontWeight: 600, opacity: 0.7 }}>{item.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: item.color, fontVariantNumeric: 'tabular-nums' }}>
                {formatInr(item.value)}
              </div>
            </div>
          ))}
        </div>

        {/* Invoice list */}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Fee Type</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {studentInvoices.slice(0, 12).map(inv => (
                <tr key={inv.id}>
                  <td style={{ fontSize: 12, fontWeight: 500 }}>{inv.month || '—'}</td>
                  <td style={{ fontSize: 12 }}>Monthly Tuition</td>
                  <td style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{formatInr(inv.amount)}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{inv.dueDate}</td>
                  <td>
                    <span className={`chip chip-${inv.status}`}>{inv.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
