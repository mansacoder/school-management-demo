import { useState } from 'react';
import { toast } from 'sonner';
import { Save, Copy } from 'lucide-react';
import { useAppStore } from '../../../store/appStore';
import { classes } from '../../../data/mockData';

function formatInr(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export default function FeeStructurePage() {
  const { feeTypes, feeStructures, updateFeeStructure } = useAppStore();
  const [selectedClass, setSelectedClass] = useState(classes[0].id);
  const [amounts, setAmounts] = useState<Record<string, number>>({});

  const cls = classes.find(c => c.id === selectedClass);
  const structure = feeStructures.find(fs => fs.classId === selectedClass);
  const activeFeeTypes = feeTypes.filter(ft => ft.active);

  const getAmount = (feeTypeId: string) => {
    if (amounts[feeTypeId] !== undefined) return amounts[feeTypeId];
    const item = structure?.items.find(i => i.feeTypeId === feeTypeId);
    return item?.amount || 0;
  };

  const setAmount = (feeTypeId: string, val: number) => {
    setAmounts(prev => ({ ...prev, [feeTypeId]: val }));
  };

  const handleSave = () => {
    const items = activeFeeTypes.map(ft => ({
      feeTypeId: ft.id,
      amount: getAmount(ft.id),
      dueDay: 10,
    }));

    updateFeeStructure({
      id: structure?.id || `fs-${selectedClass}`,
      classId: selectedClass,
      academicYear: '2025-26',
      items,
    });

    setAmounts({});
    toast.success(`Fee structure saved for ${cls?.name} ${cls?.section}!`);
  };

  const handleCopyFrom = (fromClassId: string) => {
    const fromStructure = feeStructures.find(fs => fs.classId === fromClassId);
    if (!fromStructure) return;
    const newAmounts: Record<string, number> = {};
    fromStructure.items.forEach(item => { newAmounts[item.feeTypeId] = item.amount; });
    setAmounts(newAmounts);
    toast.info('Structure copied! Review and save.');
  };

  const totalAnnual = activeFeeTypes.reduce((sum, ft) => {
    const amt = getAmount(ft.id);
    if (ft.frequency === 'Monthly') return sum + amt * 12;
    if (ft.frequency === 'Quarterly') return sum + amt * 4;
    if (ft.frequency === 'Yearly' || ft.frequency === 'One-time') return sum + amt;
    return sum + amt;
  }, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, marginBottom: 4 }}>Fee Structure</h1>
          <p style={{ margin: 0 }}>Set fee amounts per class for each fee type</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Class Selector */}
        <div className="card" style={{ padding: 16, width: 200, flexShrink: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Select Class
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {classes.map(c => (
              <button
                key={c.id}
                onClick={() => { setSelectedClass(c.id); setAmounts({}); }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font)',
                  fontSize: 13,
                  fontWeight: selectedClass === c.id ? 600 : 400,
                  background: selectedClass === c.id ? 'var(--primary-soft)' : 'transparent',
                  color: selectedClass === c.id ? 'var(--primary)' : 'var(--text-secondary)',
                  transition: 'all 0.15s',
                }}
              >
                {c.name} – {c.section}
              </button>
            ))}
          </div>
        </div>

        {/* Structure Editor */}
        <div style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
              <h3>
                {cls?.name} – Section {cls?.section}
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400, marginLeft: 8 }}>
                  AY 2025–26
                </span>
              </h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <select
                  className="input btn-sm"
                  style={{ width: 'auto' }}
                  onChange={e => { if (e.target.value) handleCopyFrom(e.target.value); e.target.value = ''; }}
                  defaultValue=""
                >
                  <option value="" disabled><Copy size={12} /> Copy from class</option>
                  {classes.filter(c => c.id !== selectedClass).map(c => (
                    <option key={c.id} value={c.id}>{c.name} {c.section}</option>
                  ))}
                </select>
                <button className="btn btn-primary btn-sm" onClick={handleSave}>
                  <Save size={14} /> Save Structure
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {activeFeeTypes.map(ft => (
                <div
                  key={ft.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '12px 16px',
                    background: 'var(--muted)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{ft.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {ft.category} · {ft.frequency}
                      {ft.mandatory ? '' : ' · Optional'}
                    </div>
                  </div>
                  <div style={{ position: 'relative', width: 140 }}>
                    <span style={{
                      position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                      fontSize: 14, fontWeight: 600, color: 'var(--text-muted)',
                    }}>₹</span>
                    <input
                      className="input"
                      type="number"
                      min="0"
                      value={getAmount(ft.id)}
                      onChange={e => setAmount(ft.id, Number(e.target.value))}
                      style={{ paddingLeft: 28, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{
              marginTop: 16,
              padding: '14px 16px',
              background: 'var(--ink)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                Est. Annual Fee (per student)
              </span>
              <span style={{ fontSize: 20, fontWeight: 700, color: 'white', fontVariantNumeric: 'tabular-nums' }}>
                {formatInr(totalAnnual)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
