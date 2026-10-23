import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Search, MessageSquare, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../../store/appStore';
import { students, classes } from '../../../data/mockData';

function formatInr(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export default function PendingFees() {
  const { invoices } = useAppStore();
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<string[]>([]);

  const pendingData = useMemo(() => {
    const pendingInvoices = invoices.filter(inv => inv.status === 'due' || inv.status === 'overdue');

    // Group by student
    const byStudent = new Map<string, typeof pendingInvoices>();
    pendingInvoices.forEach(inv => {
      const existing = byStudent.get(inv.studentId) || [];
      byStudent.set(inv.studentId, [...existing, inv]);
    });

    return Array.from(byStudent.entries()).map(([studentId, invs]) => {
      const student = students.find(s => s.id === studentId);
      if (!student) return null;
      const cls = classes.find(c => c.id === student.classId);
      const total = invs.reduce((s, inv) => s + inv.amount + inv.lateFeeAmount, 0);
      const overdue = invs.filter(i => i.status === 'overdue');
      return { student, cls, invoices: invs, total, hasOverdue: overdue.length > 0 };
    }).filter(Boolean) as NonNullable<ReturnType<typeof Array.from<Map<string, typeof pendingInvoices>['entries']['prototype']['value']>>>;
  }, [invoices]);

  const filtered = useMemo(() => {
    return pendingData.filter(d => {
      const matchSearch = d.student.name.toLowerCase().includes(search.toLowerCase()) ||
        d.student.rollNo.toLowerCase().includes(search.toLowerCase());
      const matchClass = classFilter === 'all' || d.student.classId === classFilter;
      const matchStatus = statusFilter === 'all' || (statusFilter === 'overdue' ? d.hasOverdue : !d.hasOverdue);
      return matchSearch && matchClass && matchStatus;
    });
  }, [pendingData, search, classFilter, statusFilter]);

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const sendReminder = () => {
    toast.success(`Reminder sent to ${selected.length} parents via WhatsApp & SMS!`);
    setSelected([]);
  };

  const totalPending = filtered.reduce((s, d) => s + d.total, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, marginBottom: 4 }}>Pending Fees / Defaulters</h1>
          <p style={{ margin: 0 }}>
            {filtered.length} students · {formatInr(totalPending)} total pending
          </p>
        </div>
        {selected.length > 0 && (
          <button className="btn btn-primary" onClick={sendReminder}>
            <MessageSquare size={14} /> Send Reminder ({selected.length})
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '14px 16px', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input" style={{ paddingLeft: 36 }} placeholder="Search student..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input" style={{ width: 160 }} value={classFilter} onChange={e => setClassFilter(e.target.value)}>
          <option value="all">All Classes</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name} {c.section}</option>)}
        </select>
        <select className="input" style={{ width: 120 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="overdue">Overdue</option>
          <option value="due">Due</option>
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 'var(--radius-lg)' }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input type="checkbox" onChange={e => setSelected(e.target.checked ? filtered.map(d => d.student.id) : [])} />
                </th>
                <th>Student</th>
                <th>Class</th>
                <th>Dues</th>
                <th>Total Pending</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.student.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(d.student.id)}
                      onChange={() => toggleSelect(d.student.id)}
                    />
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {d.hasOverdue && <AlertTriangle size={14} color="var(--danger)" />}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{d.student.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Roll {d.student.rollNo}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="chip chip-primary">{d.cls?.name} {d.student.section}</span></td>
                  <td style={{ fontSize: 12 }}>{d.invoices.length} item(s)</td>
                  <td style={{ fontWeight: 700, color: d.hasOverdue ? 'var(--danger)' : 'var(--warning)', fontVariantNumeric: 'tabular-nums' }}>
                    {formatInr(d.total)}
                  </td>
                  <td>
                    <span className={`chip chip-${d.hasOverdue ? 'overdue' : 'due'}`}>
                      {d.hasOverdue ? 'Overdue' : 'Due'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        toast.success(`Reminder sent to ${d.student.name}'s parent!`);
                      }}
                    >
                      <MessageSquare size={13} /> Remind
                    </button>
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
