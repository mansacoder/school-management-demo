import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { CheckCircle2, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { students as allStudents, classes } from '../../data/mockData';
import type { PaymentMode } from '../../types';

function formatInr(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

type PayStep = 'list' | 'select' | 'pay' | 'success';

export default function ParentFees() {
  const { user } = useAuthStore();
  const { invoices, payments, feeTypes, addPayment } = useAppStore();
  const [step, setStep] = useState<PayStep>('list');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [payMode, setPayMode] = useState<PaymentMode>('UPI');
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState<ReturnType<typeof addPayment> | null>(null);

  const myStudents = allStudents.filter(s => user?.studentIds?.includes(s.id));
  const [selectedChildIdx] = useState(0);
  const selectedChild = myStudents[selectedChildIdx];

  const childInvoices = useMemo(() =>
    invoices.filter(inv => inv.studentId === selectedChild?.id),
    [invoices, selectedChild]
  );

  const paidAmount = childInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const dueAmount = childInvoices.filter(i => i.status === 'due' || i.status === 'overdue').reduce((s, i) => s + i.amount + i.lateFeeAmount, 0);
  const totalAmount = paidAmount + dueAmount;

  const dueInvoices = childInvoices.filter(i => i.status === 'due' || i.status === 'overdue');

  const donutData = [
    { name: 'Paid', value: paidAmount, color: '#1F9D6B' },
    { name: 'Due', value: dueAmount, color: '#C8453B' },
  ];

  const selectedInvoices = dueInvoices.filter(i => selectedIds.includes(i.id));
  const payAmount = selectedInvoices.reduce((s, i) => s + i.amount + i.lateFeeAmount, 0);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handlePayNow = async () => {
    setProcessing(true);
    // Simulate processing delay
    await new Promise(r => setTimeout(r, 2000));

    const payment = {
      id: `pay-${Date.now()}`,
      receiptNo: `MPS/2025-26/${String(Date.now()).slice(-4)}`,
      studentId: selectedChild.id,
      invoiceIds: selectedIds,
      amount: payAmount,
      mode: payMode,
      paidAt: new Date().toISOString(),
      collectedBy: user?.id || 'parent',
      discount: 0,
      lateFeeWaived: false,
    };
    addPayment(payment, selectedIds);
    setProcessing(false);
    setReceipt(payment as any);
    setStep('success');
    toast.success('Payment successful!');
  };

  if (step === 'success' && receipt) {
    return (
      <div>
        <div className="app-bar">
          <div className="app-bar-title">Payment Success</div>
        </div>
        <div style={{ padding: 24, textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 180, delay: 0.1 }}
            style={{
              width: 88, height: 88, borderRadius: '50%',
              background: 'var(--success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 0 0 16px rgba(31,157,107,0.12)',
            }}
          >
            <CheckCircle2 size={44} color="white" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2>Payment Done!</h2>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--success)', margin: '12px 0', fontVariantNumeric: 'tabular-nums' }}>
              {formatInr(payAmount)}
            </div>
            <p style={{ fontSize: 13, margin: '0 0 24px' }}>
              via {payMode} · {format(new Date(), 'd MMM yyyy, h:mm a')}
            </p>
          </motion.div>

          {/* Receipt */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              background: 'var(--muted)',
              borderRadius: 'var(--radius-lg)',
              padding: 20,
              textAlign: 'left',
              marginBottom: 24,
            }}
          >
            {/* School Header */}
            <div style={{ textAlign: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px dashed var(--border)' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--primary)' }}>MY PUBLIC SCHOOL</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Official Fee Receipt</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
              <span style={{ color: 'var(--text-muted)' }}>Receipt No.</span>
              <span style={{ fontWeight: 600, textAlign: 'right' }}>MPS/2025-26/{String(Date.now()).slice(-4)}</span>
              <span style={{ color: 'var(--text-muted)' }}>Student</span>
              <span style={{ fontWeight: 600, textAlign: 'right' }}>{selectedChild.name}</span>
              <span style={{ color: 'var(--text-muted)' }}>Class</span>
              <span style={{ fontWeight: 600, textAlign: 'right' }}>
                {classes.find(c => c.id === selectedChild.classId)?.name}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>Date</span>
              <span style={{ textAlign: 'right' }}>{format(new Date(), 'd MMM yyyy')}</span>
              <span style={{ color: 'var(--text-muted)' }}>Mode</span>
              <span style={{ textAlign: 'right' }}>{payMode}</span>
            </div>

            <div style={{ margin: '12px 0', borderTop: '1px dashed var(--border)', paddingTop: 12 }}>
              {selectedInvoices.map(inv => {
                const ft = feeTypes.find(f => f.id === inv.feeTypeId);
                return (
                  <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                    <span>{ft?.name} {inv.month ? `(${inv.month})` : ''}</span>
                    <span style={{ fontWeight: 600 }}>{formatInr(inv.amount)}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ borderTop: '2px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Total Paid</span>
              <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--success)', fontVariantNumeric: 'tabular-nums' }}>
                {formatInr(payAmount)}
              </span>
            </div>
          </motion.div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => window.print()}>
              <Printer size={14} /> Print
            </button>
            <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => { setStep('list'); setSelectedIds([]); }}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'pay') {
    return (
      <div>
        <div className="app-bar">
          <button onClick={() => setStep('select')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 4, color: 'var(--text-muted)', fontFamily: 'var(--font)', fontSize: 13 }}>
            ← Back
          </button>
          <div className="app-bar-title">Pay Fees</div>
        </div>
        <div style={{ padding: 20 }}>
          {/* Amount */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, #1A7A6E 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 20px',
            color: 'white',
            textAlign: 'center',
            marginBottom: 20,
          }}>
            <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 4 }}>Total Amount</div>
            <div style={{ fontSize: 36, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{formatInr(payAmount)}</div>
            <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>{selectedInvoices.length} fee item(s)</div>
          </div>

          {/* Payment Mode */}
          <div className="input-group" style={{ marginBottom: 20 }}>
            <label className="input-label">Payment Mode</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {(['UPI', 'Card', 'Net Banking'] as PaymentMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setPayMode(m)}
                  style={{
                    padding: '12px 8px',
                    border: `2px solid ${payMode === m ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-md)',
                    background: payMode === m ? 'var(--primary-soft)' : 'var(--surface)',
                    color: payMode === m ? 'var(--primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: 'var(--font)',
                    transition: 'all 0.15s',
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* UPI hint */}
          {payMode === 'UPI' && (
            <div style={{
              background: 'var(--muted)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              marginBottom: 20,
              fontSize: 13,
              color: 'var(--text-secondary)',
            }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>UPI Payment</div>
              <div>Pay to: <strong>mypublicschool@ybl</strong></div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                This is a demo. Click Pay Now to simulate payment.
              </div>
            </div>
          )}

          <button
            className="btn btn-primary"
            style={{ width: '100%', fontSize: 16, padding: '16px', position: 'relative' }}
            onClick={handlePayNow}
            disabled={processing}
          >
            {processing ? (
              <span>Processing...</span>
            ) : (
              <>Pay {formatInr(payAmount)}</>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="app-bar">
        <div className="app-bar-title">Fees</div>
        <div className="app-bar-subtitle">{selectedChild?.name}</div>
      </div>

      <div style={{ padding: 16 }}>
        {/* Summary Ring */}
        <div className="card" style={{ padding: 20, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 100, height: 100, flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} innerRadius={30} outerRadius={45} dataKey="value" strokeWidth={0}>
                  {donutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL FEES</div>
            <div style={{ fontSize: 22, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{formatInr(totalAmount)}</div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--success)' }}>{formatInr(paidAmount)}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Paid</div>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--danger)' }}>{formatInr(dueAmount)}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Due</div>
              </div>
            </div>
          </div>
        </div>

        {/* Due Invoices */}
        {dueInvoices.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Pending Fees
            </div>
            {dueInvoices.map(inv => {
              const ft = feeTypes.find(f => f.id === inv.feeTypeId);
              const isSelected = selectedIds.includes(inv.id);
              return (
                <div
                  key={inv.id}
                  onClick={() => toggleSelect(inv.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 16px',
                    background: isSelected ? 'var(--primary-soft)' : 'var(--surface)',
                    border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    marginBottom: 8,
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--text-muted)'}`,
                    background: isSelected ? 'var(--primary)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {isSelected && <CheckCircle2 size={12} color="white" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{ft?.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {inv.month || inv.dueDate} · Due {inv.dueDate}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>
                      {formatInr(inv.amount)}
                    </div>
                    <span className={`chip chip-${inv.status}`} style={{ fontSize: 10 }}>{inv.status}</span>
                  </div>
                </div>
              );
            })}

            {selectedIds.length > 0 && (
              <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 8, fontSize: 15, padding: '14px' }}
                onClick={() => setStep('pay')}
              >
                Pay Now · {formatInr(payAmount)}
              </button>
            )}
          </div>
        )}

        {/* Payment History */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Payment History
          </div>
          {payments
            .filter(p => p.studentId === selectedChild?.id)
            .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime())
            .slice(0, 6)
            .map(p => (
              <div key={p.id} className="card" style={{ padding: '12px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: '#E8F8F0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CheckCircle2 size={18} color="var(--success)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{p.receiptNo}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {format(new Date(p.paidAt), 'd MMM yyyy')} · {p.mode}
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--success)', fontVariantNumeric: 'tabular-nums' }}>
                  {formatInr(p.amount)}
                </div>
              </div>
            ))}

          {payments.filter(p => p.studentId === selectedChild?.id).length === 0 && (
            <div className="empty-state" style={{ padding: 32 }}>
              <p style={{ color: 'var(--text-muted)' }}>No payment history yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
