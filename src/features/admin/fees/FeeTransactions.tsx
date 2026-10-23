import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Download, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../../store/appStore';
import { students } from '../../../data/mockData';

function formatInr(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export default function FeeTransactions() {
  const { payments } = useAppStore();
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState('all');

  const enriched = useMemo(() => {
    return payments.map(p => {
      const student = students.find(s => s.id === p.studentId);
      return { ...p, studentName: student?.name || 'Unknown', studentRoll: student?.rollNo || '' };
    });
  }, [payments]);

  const filtered = useMemo(() => {
    return enriched.filter(p => {
      const matchSearch = p.studentName.toLowerCase().includes(search.toLowerCase()) ||
        p.receiptNo.toLowerCase().includes(search.toLowerCase());
      const matchMode = modeFilter === 'all' || p.mode === modeFilter;
      return matchSearch && matchMode;
    }).sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime());
  }, [enriched, search, modeFilter]);

  const total = filtered.reduce((s, p) => s + p.amount, 0);

  const handleExportCSV = () => {
    const rows = [
      ['Receipt No', 'Student', 'Amount', 'Mode', 'Date'],
      ...filtered.map(p => [p.receiptNo, p.studentName, p.amount, p.mode, format(new Date(p.paidAt), 'dd/MM/yyyy')]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MPS-Transactions-${format(new Date(), 'yyyyMMdd')}.csv`;
    a.click();
    toast.success('CSV exported!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, marginBottom: 4 }}>Transactions</h1>
          <p style={{ margin: 0 }}>{filtered.length} transactions · {formatInr(total)} collected</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={handleExportCSV}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Summary Chips */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {(['Cash', 'UPI', 'Card', 'Cheque', 'Net Banking'] as const).map(mode => {
          const count = payments.filter(p => p.mode === mode).length;
          const amt = payments.filter(p => p.mode === mode).reduce((s, p) => s + p.amount, 0);
          return (
            <div key={mode} className="card" style={{ padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>{mode}</span>
              <span style={{ fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{formatInr(amt)}</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{count} txns</span>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '14px 16px', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input" style={{ paddingLeft: 36 }} placeholder="Search receipt or student..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input" style={{ width: 140 }} value={modeFilter} onChange={e => setModeFilter(e.target.value)}>
          <option value="all">All Modes</option>
          <option value="Cash">Cash</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
          <option value="Cheque">Cheque</option>
          <option value="Net Banking">Net Banking</option>
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 'var(--radius-lg)' }}>
          <table>
            <thead>
              <tr>
                <th>Receipt No.</th>
                <th>Student</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Date & Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 100).map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600, fontSize: 12, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                    {p.receiptNo}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{p.studentName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.studentRoll}</div>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--success)', fontVariantNumeric: 'tabular-nums', fontSize: 14 }}>
                    {formatInr(p.amount)}
                  </td>
                  <td><span className="chip chip-muted">{p.mode}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {format(new Date(p.paidAt), 'd MMM yyyy, h:mm a')}
                  </td>
                  <td><span className="chip chip-paid">✓ Paid</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
