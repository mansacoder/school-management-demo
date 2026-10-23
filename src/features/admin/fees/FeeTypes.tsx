import { useState } from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAppStore } from '../../../store/appStore';
import type { FeeType, FeeCategory, FeeFrequency } from '../../../types';

const categories: FeeCategory[] = ['Monthly', 'Admission', 'Exam', 'Annual', 'Transport', 'Activity', 'Uniform & Books', 'Custom'];
const frequencies: FeeFrequency[] = ['Monthly', 'Quarterly', 'Yearly', 'One-time', 'Per exam'];

function FeeTypeModal({
  ft,
  onSave,
  onClose,
}: {
  ft?: FeeType;
  onSave: (data: Omit<FeeType, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(ft?.name || '');
  const [category, setCategory] = useState<FeeCategory>(ft?.category || 'Monthly');
  const [frequency, setFrequency] = useState<FeeFrequency>(ft?.frequency || 'Monthly');
  const [mandatory, setMandatory] = useState(ft?.mandatory ?? true);
  const [lateFeeType, setLateFeeType] = useState<'fixed' | 'percentage'>(ft?.lateFeeType || 'fixed');
  const [lateFeeAmount, setLateFeeAmount] = useState(ft?.lateFeeAmount ?? 50);
  const [active, setActive] = useState(ft?.active ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Name is required'); return; }
    onSave({ name, category, frequency, mandatory, lateFeeType, lateFeeAmount, active });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{ft ? 'Edit Fee Type' : 'Add Fee Type'}</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="input-group">
              <label className="input-label">Name *</label>
              <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Monthly Tuition Fee" required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="input-group">
                <label className="input-label">Category *</label>
                <select className="input" value={category} onChange={e => setCategory(e.target.value as FeeCategory)}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Frequency *</label>
                <select className="input" value={frequency} onChange={e => setFrequency(e.target.value as FeeFrequency)}>
                  {frequencies.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="input-group">
                <label className="input-label">Late Fee Type</label>
                <select className="input" value={lateFeeType} onChange={e => setLateFeeType(e.target.value as 'fixed' | 'percentage')}>
                  <option value="fixed">Fixed Amount (₹)</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Late Fee Amount</label>
                <input className="input" type="number" min="0" value={lateFeeAmount} onChange={e => setLateFeeAmount(Number(e.target.value))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
                <input type="checkbox" checked={mandatory} onChange={e => setMandatory(e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
                Mandatory
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
                <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
                Active
              </label>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {ft ? 'Save Changes' : 'Add Fee Type'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

const categoryColors: Record<FeeCategory, string> = {
  'Monthly': 'chip-primary',
  'Admission': 'chip-accent',
  'Exam': 'chip-due',
  'Annual': 'chip-muted',
  'Transport': 'chip-muted',
  'Activity': 'chip-muted',
  'Uniform & Books': 'chip-muted',
  'Custom': 'chip-muted',
};

export default function FeeTypes() {
  const { feeTypes, addFeeType, updateFeeType, deleteFeeType } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [editingFt, setEditingFt] = useState<FeeType | undefined>();

  const handleSave = (data: Omit<FeeType, 'id' | 'createdAt'>) => {
    if (editingFt) {
      updateFeeType(editingFt.id, data);
      toast.success('Fee type updated!');
    } else {
      addFeeType({
        id: `ft-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...data,
      });
      toast.success('Fee type added!');
    }
    setShowModal(false);
    setEditingFt(undefined);
  };

  const handleToggle = (id: string, active: boolean) => {
    updateFeeType(id, { active });
    toast.info(active ? 'Fee type activated' : 'Fee type deactivated');
  };

  const handleDelete = (id: string) => {
    deleteFeeType(id);
    toast.success('Fee type deleted');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, marginBottom: 4 }}>Fee Types</h1>
          <p style={{ margin: 0 }}>Define the types of fees before creating fee structures</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingFt(undefined); setShowModal(true); }}>
          <Plus size={16} /> Add Fee Type
        </button>
      </div>

      {/* Info Banner */}
      <div style={{
        background: 'var(--primary-soft)',
        border: '1px solid var(--primary)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        fontSize: 13,
        color: 'var(--primary)',
        fontWeight: 500,
      }}>
        <span>ℹ️</span>
        <span>Fee Types → Fee Structure → Collect Fee. Create fee types first, then assign amounts to classes.</span>
      </div>

      {/* List */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 'var(--radius-lg)' }}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Frequency</th>
                <th>Mandatory</th>
                <th>Late Fee</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feeTypes.map(ft => (
                <tr key={ft.id}>
                  <td style={{ fontWeight: 600 }}>{ft.name}</td>
                  <td><span className={`chip ${categoryColors[ft.category] || 'chip-muted'}`}>{ft.category}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{ft.frequency}</td>
                  <td>
                    <span className={`chip ${ft.mandatory ? 'chip-paid' : 'chip-muted'}`}>
                      {ft.mandatory ? 'Mandatory' : 'Optional'}
                    </span>
                  </td>
                  <td style={{ fontSize: 12 }}>
                    {ft.lateFeeAmount > 0
                      ? ft.lateFeeType === 'fixed' ? `₹${ft.lateFeeAmount}` : `${ft.lateFeeAmount}%`
                      : '—'}
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-icon btn-sm"
                      onClick={() => handleToggle(ft.id, !ft.active)}
                      title={ft.active ? 'Deactivate' : 'Activate'}
                    >
                      {ft.active
                        ? <ToggleRight size={20} color="var(--success)" />
                        : <ToggleLeft size={20} color="var(--text-muted)" />}
                    </button>
                  </td>
                  <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {format(new Date(ft.createdAt), 'd MMM yyyy')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={() => { setEditingFt(ft); setShowModal(true); }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={() => handleDelete(ft.id)}
                        style={{ color: 'var(--danger)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <FeeTypeModal
            ft={editingFt}
            onSave={handleSave}
            onClose={() => { setShowModal(false); setEditingFt(undefined); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
