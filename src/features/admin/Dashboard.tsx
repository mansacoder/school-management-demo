import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { format, subDays, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import {
  Users, GraduationCap, TrendingUp, IndianRupee, AlertCircle,
  ArrowUpRight, ArrowDownRight, CheckCircle2, Clock, Plus, Download
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { students, teachers } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

const today = new Date();

function formatInr(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

function CountUp({ value, prefix = '' }: { value: number; prefix?: string }) {
  return <span>{prefix}{value.toLocaleString('en-IN')}</span>;
}

export default function AdminDashboard() {
  const { payments, invoices } = useAppStore();
  const navigate = useNavigate();
  const [chartRange, setChartRange] = useState<'7d' | '30d' | '12m'>('30d');

  // KPIs
  const kpis = useMemo(() => {
    const activeStudents = students.filter(s => s.status === 'active').length;
    const activeTeachers = teachers.filter(t => t.status === 'active').length;

    // Simulate attendance: 85% present today
    const todayAttendance = 87;

    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const thisMonthPayments = payments.filter(p =>
      isWithinInterval(new Date(p.paidAt), { start: monthStart, end: monthEnd })
    );
    const feesCollected = thisMonthPayments.reduce((s, p) => s + p.amount, 0);

    const pendingAmt = invoices
      .filter(inv => inv.status === 'due' || inv.status === 'overdue')
      .reduce((s, inv) => s + inv.amount + inv.lateFeeAmount, 0);

    return { activeStudents, activeTeachers, todayAttendance, feesCollected, pendingAmt };
  }, [payments, invoices]);

  // Chart data
  const chartData = useMemo(() => {
    if (chartRange === '7d') {
      return Array.from({ length: 7 }, (_, i) => {
        const d = subDays(today, 6 - i);
        const dayPayments = payments.filter(p => format(new Date(p.paidAt), 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd'));
        return {
          label: format(d, 'EEE'),
          amount: dayPayments.reduce((s, p) => s + p.amount, 0),
        };
      });
    }
    if (chartRange === '30d') {
      return Array.from({ length: 10 }, (_, i) => {
        const start = subDays(today, (9 - i) * 3 + 2);
        const end = subDays(today, (9 - i) * 3);
        const ps = payments.filter(p => {
          const d = new Date(p.paidAt);
          return d >= start && d <= end;
        });
        return {
          label: format(start, 'd MMM'),
          amount: ps.reduce((s, p) => s + p.amount, 0),
        };
      });
    }
    // 12m
    return Array.from({ length: 12 }, (_, i) => {
      const d = subMonths(today, 11 - i);
      const monthStr = format(d, 'yyyy-MM');
      const ps = payments.filter(p => p.paidAt.startsWith(monthStr));
      return {
        label: format(d, 'MMM'),
        amount: ps.reduce((s, p) => s + p.amount, 0),
      };
    });
  }, [payments, chartRange]);

  // Donut data
  const donutData = useMemo(() => {
    const paid = invoices.filter(i => i.status === 'paid').length;
    const due = invoices.filter(i => i.status === 'due').length;
    const overdue = invoices.filter(i => i.status === 'overdue').length;
    return [
      { name: 'Paid', value: paid, color: '#1F9D6B' },
      { name: 'Due', value: due, color: '#D9962B' },
      { name: 'Overdue', value: overdue, color: '#C8453B' },
    ];
  }, [invoices]);

  // Recent payments
  const recentPayments = useMemo(() => {
    return [...payments]
      .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime())
      .slice(0, 8)
      .map(p => {
        const student = students.find(s => s.id === p.studentId);
        return { ...p, studentName: student?.name || 'Unknown' };
      });
  }, [payments]);

  const kpiCards = [
    {
      label: 'Total Students',
      value: kpis.activeStudents,
      icon: Users,
      bg: 'var(--surface)',
      change: '+12',
      up: true,
    },
    {
      label: 'Total Teachers',
      value: kpis.activeTeachers,
      icon: GraduationCap,
      bg: 'var(--ink)',
      dark: true,
    },
    {
      label: "Today's Attendance",
      value: `${kpis.todayAttendance}%`,
      icon: TrendingUp,
      bg: 'var(--primary-soft)',
      accent: true,
    },
    {
      label: 'Fees Collected (Month)',
      value: formatInr(kpis.feesCollected),
      icon: IndianRupee,
      bg: 'var(--surface)',
      change: '+8%',
      up: true,
    },
    {
      label: 'Pending Fees',
      value: formatInr(kpis.pendingAmt),
      icon: AlertCircle,
      bg: '#FDE8E7',
      danger: true,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>Dashboard</h1>
          <p style={{ margin: 0 }}>{format(today, 'EEEE, d MMMM yyyy')} · Academic Year 2025–26</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/fees/collect')}>
            <IndianRupee size={14} /> Collect Fee
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/students')}>
            <Plus size={14} /> Add Student
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpiCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="kpi-card"
            style={{
              background: card.bg,
              padding: 20,
              border: card.dark || card.danger ? 'none' : '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, fontWeight: 600, opacity: card.dark ? 0.6 : 1, color: card.dark ? 'white' : card.danger ? 'var(--danger)' : card.accent ? 'var(--primary)' : 'var(--text-muted)' }}>
                {card.label}
              </span>
              <div style={{
                width: 36, height: 36,
                borderRadius: 10,
                background: card.dark ? 'rgba(255,255,255,0.1)' : card.danger ? 'rgba(200,69,59,0.15)' : card.accent ? 'var(--primary)' : 'var(--muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <card.icon size={18} color={card.dark ? 'white' : card.danger ? 'var(--danger)' : card.accent ? 'white' : 'var(--text-muted)'} />
              </div>
            </div>
            <div className="kpi-value" style={{ color: card.dark ? 'white' : card.danger ? 'var(--danger)' : 'var(--text-primary)' }}>
              <CountUp value={typeof card.value === 'number' ? card.value : 0} />
              {typeof card.value === 'string' ? card.value : ''}
            </div>
            {card.change && (
              <div className="kpi-change" style={{ color: card.up ? 'var(--success)' : 'var(--danger)' }}>
                {card.up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {card.change} vs last month
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Bar Chart */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ margin: 0 }}>Fee Collection</h3>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['7d', '30d', '12m'] as const).map(r => (
                <button
                  key={r}
                  className="btn btn-sm"
                  style={{
                    background: chartRange === r ? 'var(--primary)' : 'var(--muted)',
                    color: chartRange === r ? 'white' : 'var(--text-muted)',
                  }}
                  onClick={() => setChartRange(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                tickFormatter={v => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`}
              />
              <Tooltip
                formatter={(v: any) => [formatInr(Number(v) || 0), 'Collected']}
                contentStyle={{ fontFamily: 'Poppins', fontSize: 12, border: '1px solid var(--border)', borderRadius: 8 }}
              />
              <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 20 }}>Fee Status</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                dataKey="value"
                strokeWidth={0}
              >
                {donutData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: any, name: any) => [v, name]}
                contentStyle={{ fontFamily: 'Poppins', fontSize: 12, borderRadius: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {donutData.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{d.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '20px 24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0 }}>Recent Payments</h3>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/fees/transactions')}>
            View All →
          </button>
        </div>
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Receipt No.</th>
                <th>Student</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600, fontSize: 12, color: 'var(--text-muted)' }}>{p.receiptNo}</td>
                  <td style={{ fontWeight: 500 }}>{p.studentName}</td>
                  <td style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--success)' }}>
                    {formatInr(p.amount)}
                  </td>
                  <td>
                    <span className="chip chip-muted">{p.mode}</span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                    {format(new Date(p.paidAt), 'd MMM, h:mm a')}
                  </td>
                  <td>
                    <span className="chip chip-paid">
                      <CheckCircle2 size={10} /> Paid
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        {[
          { label: 'Add Fee Type', icon: Plus, path: '/admin/fees/types', color: 'var(--primary)' },
          { label: 'Collect Fee', icon: IndianRupee, path: '/admin/fees/collect', color: 'var(--success)' },
          { label: 'View Defaulters', icon: AlertCircle, path: '/admin/fees/pending', color: 'var(--danger)' },
          { label: 'Post Notice', icon: Clock, path: '/admin/notices', color: 'var(--accent)' },
          { label: 'Export Report', icon: Download, path: '/admin/fees/transactions', color: 'var(--text-secondary)' },
        ].map(action => (
          <button
            key={action.label}
            className="card"
            onClick={() => navigate(action.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              padding: '20px 16px',
              cursor: 'pointer',
              border: '1.5px solid var(--border)',
              background: 'var(--surface)',
              fontFamily: 'var(--font)',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = action.color)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <div style={{
              width: 44, height: 44,
              borderRadius: 12,
              background: `${action.color}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <action.icon size={20} color={action.color} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center' }}>
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
