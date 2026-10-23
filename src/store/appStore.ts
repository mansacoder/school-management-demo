import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Notice, FeeType, FeeStructure, FeeInvoice, Payment, AttendanceRecord } from '../types';
import {
  notices as seedNotices,
  feeTypes as seedFeeTypes,
  feeStructures as seedFeeStructures,
  invoices as seedInvoices,
  payments as seedPayments,
  attendanceRecords as seedAttendance,
} from '../data/mockData';

interface AppState {
  notices: Notice[];
  feeTypes: FeeType[];
  feeStructures: FeeStructure[];
  invoices: FeeInvoice[];
  payments: Payment[];
  attendanceRecords: AttendanceRecord[];
  theme: 'light' | 'dark';
  language: 'en' | 'hi';
  initialized: boolean;
  // Actions
  addNotice: (notice: Notice) => void;
  updateNotice: (id: string, updates: Partial<Notice>) => void;
  deleteNotice: (id: string) => void;
  markNoticeRead: (noticeId: string, userId: string) => void;
  addFeeType: (ft: FeeType) => void;
  updateFeeType: (id: string, updates: Partial<FeeType>) => void;
  deleteFeeType: (id: string) => void;
  updateFeeStructure: (fs: FeeStructure) => void;
  addPayment: (payment: Payment, paidInvoiceIds: string[]) => void;
  updateInvoice: (id: string, updates: Partial<FeeInvoice>) => void;
  addAttendance: (records: AttendanceRecord[]) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: 'en' | 'hi') => void;
  resetDemo: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      notices: seedNotices,
      feeTypes: seedFeeTypes,
      feeStructures: seedFeeStructures,
      invoices: seedInvoices,
      payments: seedPayments,
      attendanceRecords: seedAttendance,
      theme: 'light',
      language: 'en',
      initialized: true,

      addNotice: (notice) =>
        set((s) => ({ notices: [notice, ...s.notices] })),
      updateNotice: (id, updates) =>
        set((s) => ({ notices: s.notices.map(n => n.id === id ? { ...n, ...updates } : n) })),
      deleteNotice: (id) =>
        set((s) => ({ notices: s.notices.filter(n => n.id !== id) })),
      markNoticeRead: (noticeId, userId) =>
        set((s) => ({
          notices: s.notices.map(n =>
            n.id === noticeId && !n.readBy.includes(userId)
              ? { ...n, readBy: [...n.readBy, userId] }
              : n
          ),
        })),
      addFeeType: (ft) =>
        set((s) => ({ feeTypes: [...s.feeTypes, ft] })),
      updateFeeType: (id, updates) =>
        set((s) => ({ feeTypes: s.feeTypes.map(ft => ft.id === id ? { ...ft, ...updates } : ft) })),
      deleteFeeType: (id) =>
        set((s) => ({ feeTypes: s.feeTypes.filter(ft => ft.id !== id) })),
      updateFeeStructure: (fs) =>
        set((s) => ({
          feeStructures: s.feeStructures.some(f => f.id === fs.id)
            ? s.feeStructures.map(f => f.id === fs.id ? fs : f)
            : [...s.feeStructures, fs],
        })),
      addPayment: (payment, paidInvoiceIds) =>
        set((s) => ({
          payments: [payment, ...s.payments],
          invoices: s.invoices.map(inv =>
            paidInvoiceIds.includes(inv.id) ? { ...inv, status: 'paid' } : inv
          ),
        })),
      updateInvoice: (id, updates) =>
        set((s) => ({ invoices: s.invoices.map(inv => inv.id === id ? { ...inv, ...updates } : inv) })),
      addAttendance: (records) =>
        set((s) => {
          const existingIds = new Set(s.attendanceRecords.map(a => `${a.studentId}-${a.date}`));
          const newRecords = records.filter(r => !existingIds.has(`${r.studentId}-${r.date}`));
          const updated = s.attendanceRecords.map(a => {
            const match = records.find(r => r.studentId === a.studentId && r.date === a.date);
            return match ? match : a;
          });
          return { attendanceRecords: [...updated, ...newRecords] };
        }),
      setTheme: (theme) => set({ theme }),
      setLanguage: (lang) => set({ language: lang }),
      resetDemo: () =>
        set({
          notices: seedNotices,
          feeTypes: seedFeeTypes,
          feeStructures: seedFeeStructures,
          invoices: seedInvoices,
          payments: seedPayments,
          attendanceRecords: seedAttendance,
        }),
    }),
    {
      name: 'mps-app-store',
      partialize: (state) => ({
        notices: state.notices,
        feeTypes: state.feeTypes,
        feeStructures: state.feeStructures,
        invoices: state.invoices,
        payments: state.payments,
        attendanceRecords: state.attendanceRecords,
        theme: state.theme,
        language: state.language,
      }),
    }
  )
);
