import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Search, CheckCircle2, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { useAppStore } from '../../../store/appStore';
import { students, classes } from '../../../data/mockData';
import type { Payment, PaymentMode } from '../../../types';

function formatInr(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

type PayStep = 'search' | 'select' | 'pay' | 'success';

export default function CollectFee() {
  const { invoices, feeTypes, addPayment } = useAppStore();
  const [step, setStep] = useState<PayStep>('search');
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<typeof students[0] | null>(null);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);
  const [mode, setMode] = useState<PaymentMode>('Cash');
  const [discount, setDiscount] = useState(0);
  const [receipt, setReceipt] = useState<Payment | null>(null);

  const searchResults = useMemo(() => {
    if (search.length < 2) return [];
    return students.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 6);
  }, [search]);

  const studentInvoices = useMemo(() => {
    if (!selectedStudent) return [];
    return invoices.filter(inv => inv.studentId === selectedStudent.id && (inv.status === 'due' || inv.status === 'overdue'));
  }, [invoices, selectedStudent]);

  const selectedInvoices = studentInvoices.filter(inv => selectedInvoiceIds.includes(inv.id));
  const totalAmount = selectedInvoices.reduce((s, inv) => s + inv.amount + inv.lateFeeAmount, 0) - discount;

  const toggleInvoice = (id: string) => {
    setSelectedInvoiceIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    setSelectedInvoiceIds(studentInvoices.map(inv => inv.id));
  };

  const handleCollect = () => {
    if (!selectedStudent || selectedInvoiceIds.length === 0) return;
    const payment: Payment = {
      id: `pay-${Date.now()}`,
      receiptNo: `MPS/2025-26/${String(Date.now()).slice(-4)}`,
      studentId: selectedStudent.id,
      invoiceIds: selectedInvoiceIds,
      amount: Math.max(0, totalAmount),
      mode,
      paidAt: new Date().toISOString(),
      collectedBy: 'admin-1',
      discount,
      lateFeeWaived: false,
    };
    addPayment(payment, selectedInvoiceIds);
    setReceipt(payment);
    setStep('success');
    toast.success('Fee collected successfully!');
  };

  const handleReset = () => {
    setStep('search');
    setSearch('');
    setSelectedStudent(null);
    setSelectedInvoiceIds([]);
    setDiscount(0);
    setReceipt(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, marginBottom: 4 }}>Collect Fee</h1>
        <p style={{ margin: 0 }}>Search student → Select dues → Choose mode → Collect</p>
      </div>

      {/* Progress Steps */}
      <div style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
        {['Search', 'Select Dues', 'Payment', 'Done'].map((s, i) => {
          const steps: PayStep[] = ['search', 'select', 'pay', 'success'];
          const current = steps.indexOf(step);
          const isDone = i < current;
          const isActive = i === current;
          return (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < 3 ? 1 : 'none' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}>
                <div style={{
                  width: 32, height: 32,
                  borderRadius: '50%',
                  background: isDone ? 'var(--success)' : isActive ? 'var(--primary)' : 'var(--muted)',
                  color: isDone || isActive ? 'white' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                  transition: 'all 0.3s',
                }}>
                  {isDone ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: isActive ? 'var(--primary)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {s}
                </span>
              </div>
              {i < 3 && (
                <div style={{
                  flex: 1,
                  height: 2,
                  background: isDone ? 'var(--success)' : 'var(--border)',
                  margin: '0 8px',
                  marginBottom: 20,
                  transition: 'background 0.3s',
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step: Search */}
      {step === 'search' && (
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Search Student</h3>
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="input"
              style={{ paddingLeft: 42, fontSize: 15 }}
              placeholder="Type student name or roll number..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          {searchResults.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {searchResults.map(s => {
                const cls = classes.find(c => c.id === s.classId);
                const dues = invoices.filter(inv => inv.studentId === s.id && (inv.status === 'due' || inv.status === 'overdue'));
                return (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedStudent(s); setStep('select'); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '14px 16px',
                      background: 'var(--muted)',
                      border: '1.5px solid transparent',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'var(--font)',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: 'var(--primary-soft)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, fontWeight: 700, color: 'var(--primary)',
                      flexShrink: 0,
                    }}>
                      {s.name[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {cls?.name} {s.section} · Roll {s.rollNo}
                      </div>
                    </div>
                    {dues.length > 0 && (
                      <span className="chip chip-overdue">
                        {dues.length} due
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
          {search.length >= 2 && searchResults.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No students found</p>
          )}
        </div>
      )}

      {/* Step: Select Dues */}
      {step === 'select' && selectedStudent && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3>{selectedStudent.name}</h3>
              <p style={{ margin: 0, fontSize: 12 }}>
                {classes.find(c => c.id === selectedStudent.classId)?.name} · Roll {selectedStudent.rollNo}
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={handleReset}>← Change</button>
          </div>

          {studentInvoices.length === 0 ? (
            <div className="empty-state">
              <CheckCircle2 size={48} color="var(--success)" />
              <h4>No Dues!</h4>
              <p>This student has no pending fees.</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {studentInvoices.length} outstanding fee(s)
                </span>
                <button className="btn btn-ghost btn-sm" onClick={selectAll}>Select All</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {studentInvoices.map(inv => {
                  const ft = feeTypes.find(f => f.id === inv.feeTypeId);
                  const isSelected = selectedInvoiceIds.includes(inv.id);
                  return (
                    <div
                      key={inv.id}
                      onClick={() => toggleInvoice(inv.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '14px 16px',
                        background: isSelected ? 'var(--primary-soft)' : 'var(--muted)',
                        border: `1.5px solid ${isSelected ? 'var(--primary)' : 'transparent'}`,
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%',
                        border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--text-muted)'}`,
                        background: isSelected ? 'var(--primary)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                        flexShrink: 0,
                      }}>
                        {isSelected && <CheckCircle2 size={12} color="white" />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{ft?.name || 'Fee'}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {inv.month || inv.dueDate} · Due {inv.dueDate}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, fontSize: 15, fontVariantNumeric: 'tabular-nums' }}>
                          {formatInr(inv.amount)}
                        </div>
                        {inv.lateFeeAmount > 0 && (
                          <div style={{ fontSize: 11, color: 'var(--danger)' }}>+{formatInr(inv.lateFeeAmount)} late</div>
                        )}
                        <span className={`chip chip-${inv.status}`}>{inv.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedInvoiceIds.length > 0 && (
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setStep('pay')}>
                  Proceed to Pay · {formatInr(totalAmount)} →
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Step: Payment */}
      {step === 'pay' && selectedStudent && (
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 20 }}>Payment Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Mode */}
            <div className="input-group">
              <label className="input-label">Payment Mode</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(['Cash', 'UPI', 'Card', 'Cheque', 'Net Banking'] as PaymentMode[]).map(m => (
                  <button
                    key={m}
                    className={`btn ${mode === m ? 'btn-primary' : 'btn-outline'} btn-sm`}
                    onClick={() => setMode(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Discount */}
            <div className="input-group">
              <label className="input-label">Discount (₹)</label>
              <input
                className="input"
                type="number"
                min="0"
                value={discount}
                onChange={e => setDiscount(Number(e.target.value))}
                style={{ maxWidth: 200 }}
              />
            </div>

            {/* Summary */}
            <div style={{ background: 'var(--muted)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Summary</div>
              {selectedInvoices.map(inv => {
                const ft = feeTypes.find(f => f.id === inv.feeTypeId);
                return (
                  <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                    <span>{ft?.name} {inv.month ? `(${inv.month})` : ''}</span>
                    <span style={{ fontWeight: 600 }}>{formatInr(inv.amount)}</span>
                  </div>
                );
              })}
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--success)', marginBottom: 6 }}>
                  <span>Discount</span>
                  <span>−{formatInr(discount)}</span>
                </div>
              )}
              <div className="divider" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700 }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>{formatInr(totalAmount)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost" onClick={() => setStep('select')} style={{ flex: 1 }}>← Back</button>
              <button className="btn btn-primary" onClick={handleCollect} style={{ flex: 2 }}>
                Collect {formatInr(totalAmount)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step: Success */}
      {step === 'success' && receipt && selectedStudent && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card"
          style={{ padding: 40, textAlign: 'center' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'var(--success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <CheckCircle2 size={40} color="white" />
          </motion.div>
          <h2>Payment Collected!</h2>
          <p>Receipt No: <strong>{receipt.receiptNo}</strong></p>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--primary)', margin: '16px 0', fontVariantNumeric: 'tabular-nums' }}>
            {formatInr(receipt.amount)}
          </div>
          <p style={{ fontSize: 12 }}>
            {selectedStudent.name} · {format(new Date(receipt.paidAt), 'd MMM yyyy, h:mm a')} · {receipt.mode}
          </p>

          {/* Receipt Preview */}
          <div style={{
            margin: '20px auto',
            maxWidth: 360,
            padding: 20,
            background: 'var(--muted)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'left',
            fontSize: 12,
          }}>
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--primary)' }}>MY PUBLIC SCHOOL</div>
              <div style={{ color: 'var(--text-muted)' }}>Fee Receipt</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11 }}>
              <span style={{ color: 'var(--text-muted)' }}>Receipt No.</span>
              <span style={{ fontWeight: 600 }}>{receipt.receiptNo}</span>
              <span style={{ color: 'var(--text-muted)' }}>Student</span>
              <span style={{ fontWeight: 600 }}>{selectedStudent.name}</span>
              <span style={{ color: 'var(--text-muted)' }}>Date</span>
              <span>{format(new Date(receipt.paidAt), 'd MMM yyyy')}</span>
              <span style={{ color: 'var(--text-muted)' }}>Mode</span>
              <span>{receipt.mode}</span>
              <span style={{ color: 'var(--text-muted)' }}>Amount</span>
              <span style={{ fontWeight: 700, color: 'var(--success)' }}>{formatInr(receipt.amount)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={() => window.print()}>
              <Printer size={15} /> Print Receipt
            </button>
            <button className="btn btn-primary" onClick={handleReset}>
              Collect Another
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
