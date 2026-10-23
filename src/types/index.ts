// ─── Core Entity Types ─────────────────────────────────────────────────────

export type Role = 'admin' | 'teacher' | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  phone?: string;
}

// ─── Student ───────────────────────────────────────────────────────────────

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  classId: string;
  section: string;
  parentId: string;
  dob: string;
  gender: 'M' | 'F';
  address: string;
  phone: string;
  photoUrl?: string;
  admissionDate: string;
  bloodGroup?: string;
  status: 'active' | 'inactive';
}

// ─── Teacher ───────────────────────────────────────────────────────────────

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  classIds: string[];
  qualification: string;
  joinDate: string;
  photoUrl?: string;
  designation: string;
  status: 'active' | 'inactive';
}

// ─── Parent ────────────────────────────────────────────────────────────────

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  studentIds: string[];
  occupation?: string;
  address?: string;
}

// ─── Class ─────────────────────────────────────────────────────────────────

export interface SchoolClass {
  id: string;
  name: string;
  section: string;
  classTeacherId: string;
  subjectIds: string[];
  capacity: number;
}

// ─── Attendance ────────────────────────────────────────────────────────────

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'holiday';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
  markedBy: string;
}

// ─── Fee Types ─────────────────────────────────────────────────────────────

export type FeeCategory =
  | 'Monthly'
  | 'Admission'
  | 'Exam'
  | 'Annual'
  | 'Transport'
  | 'Activity'
  | 'Uniform & Books'
  | 'Custom';

export type FeeFrequency =
  | 'Monthly'
  | 'Quarterly'
  | 'Yearly'
  | 'One-time'
  | 'Per exam';

export interface FeeType {
  id: string;
  name: string;
  category: FeeCategory;
  frequency: FeeFrequency;
  mandatory: boolean;
  lateFeeType: 'fixed' | 'percentage';
  lateFeeAmount: number;
  active: boolean;
  createdAt: string;
}

// ─── Fee Structure ─────────────────────────────────────────────────────────

export interface FeeStructureItem {
  feeTypeId: string;
  amount: number;
  dueDay: number;
}

export interface FeeStructure {
  id: string;
  classId: string;
  academicYear: string;
  items: FeeStructureItem[];
}

// ─── Fee Invoice ───────────────────────────────────────────────────────────

export type InvoiceStatus = 'paid' | 'due' | 'overdue' | 'waived';

export interface FeeInvoice {
  id: string;
  studentId: string;
  classId: string;
  feeTypeId: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  month?: string;
  academicYear: string;
  lateFeeAmount: number;
  discount: number;
}

// ─── Payment ───────────────────────────────────────────────────────────────

export type PaymentMode = 'Cash' | 'UPI' | 'Card' | 'Cheque' | 'Net Banking';

export interface Payment {
  id: string;
  receiptNo: string;
  studentId: string;
  invoiceIds: string[];
  amount: number;
  mode: PaymentMode;
  paidAt: string;
  collectedBy: string;
  notes?: string;
  discount: number;
  lateFeeWaived: boolean;
}

// ─── Notice ────────────────────────────────────────────────────────────────

export type NoticeCategory = 'General' | 'Holiday' | 'Fee' | 'Exam' | 'Urgent';
export type NoticeAudience = 'all' | 'class' | 'teachers';

export interface Notice {
  id: string;
  title: string;
  body: string;
  category: NoticeCategory;
  audience: NoticeAudience;
  targetClassIds?: string[];
  authorRole: 'admin' | 'teacher';
  authorId: string;
  authorName: string;
  pinned: boolean;
  createdAt: string;
  readBy: string[];
}

// ─── Homework ──────────────────────────────────────────────────────────────

export interface Homework {
  id: string;
  classId: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  assignedBy: string;
  createdAt: string;
}

// ─── Exam & Results ────────────────────────────────────────────────────────

export interface Exam {
  id: string;
  name: string;
  classId: string;
  subject: string;
  date: string;
  maxMarks: number;
  duration: number;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  marksObtained: number;
  grade: string;
}

// ─── Timetable ─────────────────────────────────────────────────────────────

export interface Period {
  id: string;
  classId: string;
  subject: string;
  teacherId: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
  startTime: string;
  endTime: string;
}

// ─── Event ─────────────────────────────────────────────────────────────────

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  description: string;
  type: 'Holiday' | 'Exam' | 'Activity' | 'Meeting' | 'Sports' | 'Cultural';
}

// ─── Auth Store ────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatarUrl?: string;
  teacherId?: string;
  classIds?: string[];
  parentId?: string;
  studentIds?: string[];
}

// ─── Dashboard KPIs ────────────────────────────────────────────────────────

export interface DashboardKPI {
  totalStudents: number;
  totalTeachers: number;
  todayAttendancePercent: number;
  feesCollectedThisMonth: number;
  pendingFees: number;
}
