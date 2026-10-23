import type {
  Student,
  Teacher,
  Parent,
  SchoolClass,
  FeeType,
  FeeStructure,
  FeeInvoice,
  Payment,
  Notice,
  Homework,
  Exam,
  ExamResult,
  Period,
  SchoolEvent,
  AttendanceRecord,
} from '../types';
import { format, subDays, addDays, subMonths } from 'date-fns';

const today = new Date();

// ─── Classes ───────────────────────────────────────────────────────────────

export const classes: SchoolClass[] = [
  { id: 'c-nur', name: 'Nursery', section: 'A', classTeacherId: 't-1', subjectIds: ['English', 'Math', 'Hindi'], capacity: 30 },
  { id: 'c-nur-b', name: 'Nursery', section: 'B', classTeacherId: 't-2', subjectIds: ['English', 'Math', 'Hindi'], capacity: 30 },
  { id: 'c-1a', name: 'Class 1', section: 'A', classTeacherId: 't-3', subjectIds: ['English', 'Math', 'Hindi', 'EVS'], capacity: 35 },
  { id: 'c-1b', name: 'Class 1', section: 'B', classTeacherId: 't-4', subjectIds: ['English', 'Math', 'Hindi', 'EVS'], capacity: 35 },
  { id: 'c-2a', name: 'Class 2', section: 'A', classTeacherId: 't-5', subjectIds: ['English', 'Math', 'Hindi', 'EVS'], capacity: 35 },
  { id: 'c-2b', name: 'Class 2', section: 'B', classTeacherId: 't-6', subjectIds: ['English', 'Math', 'Hindi', 'EVS'], capacity: 35 },
  { id: 'c-3a', name: 'Class 3', section: 'A', classTeacherId: 't-7', subjectIds: ['English', 'Math', 'Hindi', 'Science', 'Social Science'], capacity: 35 },
  { id: 'c-3b', name: 'Class 3', section: 'B', classTeacherId: 't-8', subjectIds: ['English', 'Math', 'Hindi', 'Science', 'Social Science'], capacity: 35 },
  { id: 'c-4a', name: 'Class 4', section: 'A', classTeacherId: 't-9', subjectIds: ['English', 'Math', 'Hindi', 'Science', 'Social Science'], capacity: 35 },
  { id: 'c-4b', name: 'Class 4', section: 'B', classTeacherId: 't-10', subjectIds: ['English', 'Math', 'Hindi', 'Science', 'Social Science'], capacity: 35 },
  { id: 'c-5a', name: 'Class 5', section: 'A', classTeacherId: 't-11', subjectIds: ['English', 'Math', 'Hindi', 'Science', 'Social Science', 'Computer'], capacity: 40 },
  { id: 'c-5b', name: 'Class 5', section: 'B', classTeacherId: 't-12', subjectIds: ['English', 'Math', 'Hindi', 'Science', 'Social Science', 'Computer'], capacity: 40 },
  { id: 'c-6a', name: 'Class 6', section: 'A', classTeacherId: 't-13', subjectIds: ['English', 'Math', 'Hindi', 'Science', 'Social Science', 'Computer'], capacity: 40 },
  { id: 'c-6b', name: 'Class 6', section: 'B', classTeacherId: 't-14', subjectIds: ['English', 'Math', 'Hindi', 'Science', 'Social Science', 'Computer'], capacity: 40 },
  { id: 'c-7a', name: 'Class 7', section: 'A', classTeacherId: 't-15', subjectIds: ['English', 'Math', 'Hindi', 'Science', 'Social Science', 'Sanskrit', 'Computer'], capacity: 40 },
  { id: 'c-7b', name: 'Class 7', section: 'B', classTeacherId: 't-16', subjectIds: ['English', 'Math', 'Hindi', 'Science', 'Social Science', 'Sanskrit', 'Computer'], capacity: 40 },
  { id: 'c-8a', name: 'Class 8', section: 'A', classTeacherId: 't-17', subjectIds: ['English', 'Math', 'Hindi', 'Science', 'Social Science', 'Sanskrit', 'Computer'], capacity: 40 },
  { id: 'c-8b', name: 'Class 8', section: 'B', classTeacherId: 't-18', subjectIds: ['English', 'Math', 'Hindi', 'Science', 'Social Science', 'Sanskrit', 'Computer'], capacity: 40 },
  { id: 'c-9a', name: 'Class 9', section: 'A', classTeacherId: 't-19', subjectIds: ['English', 'Math', 'Hindi', 'Science', 'Social Science', 'Sanskrit', 'IT'], capacity: 45 },
  { id: 'c-9b', name: 'Class 9', section: 'B', classTeacherId: 't-20', subjectIds: ['English', 'Math', 'Hindi', 'Science', 'Social Science', 'Sanskrit', 'IT'], capacity: 45 },
  { id: 'c-10a', name: 'Class 10', section: 'A', classTeacherId: 't-21', subjectIds: ['English', 'Math', 'Hindi', 'Science', 'Social Science', 'IT'], capacity: 45 },
  { id: 'c-10b', name: 'Class 10', section: 'B', classTeacherId: 't-22', subjectIds: ['English', 'Math', 'Hindi', 'Science', 'Social Science', 'IT'], capacity: 45 },
];

// ─── Teachers ──────────────────────────────────────────────────────────────

const teacherNames = [
  'Mrs. Priya Sharma', 'Mr. Rajesh Kumar', 'Mrs. Sunita Verma', 'Mr. Amit Gupta',
  'Mrs. Kavita Singh', 'Mr. Deepak Yadav', 'Mrs. Anita Patel', 'Mr. Suresh Mishra',
  'Mrs. Rekha Joshi', 'Mr. Vikram Tiwari', 'Mrs. Meena Agarwal', 'Mr. Ashok Srivastava',
  'Mrs. Pooja Saxena', 'Mr. Manoj Pandey', 'Mrs. Ritu Gupta', 'Mr. Sanjeev Rawat',
  'Mrs. Nisha Sharma', 'Mr. Ajay Chauhan', 'Mrs. Seema Rani', 'Mr. Rajeev Nair',
  'Mrs. Usha Iyer', 'Mr. Venkat Rao', 'Mrs. Lalita Dubey', 'Mr. Pradeep Shukla',
  'Mrs. Annu Mehta',
];

const subjects = ['English', 'Mathematics', 'Hindi', 'Science', 'Social Science', 'Sanskrit', 'Computer Science', 'Physical Education', 'EVS', 'IT'];

export const teachers: Teacher[] = teacherNames.map((name, i) => ({
  id: `t-${i + 1}`,
  name,
  email: `${name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 10)}@mypublicschool.edu.in`,
  phone: `98${String(10000000 + i * 1234567).slice(0, 8)}`,
  subject: subjects[i % subjects.length],
  classIds: classes.filter((_, ci) => ci === i || ci === i + 1).map(c => c.id).slice(0, 2),
  qualification: ['B.Ed, M.A.', 'B.Ed, M.Sc.', 'B.Ed, M.Com.', 'Ph.D', 'M.Ed.'][i % 5],
  joinDate: format(subDays(today, (i + 1) * 180), 'yyyy-MM-dd'),
  designation: i === 0 ? 'Principal' : i < 3 ? 'Vice Principal' : 'PGT',
  status: 'active',
}));

// ─── Parents ───────────────────────────────────────────────────────────────

const parentNames = [
  'Mr. Ramesh Sharma', 'Mrs. Sita Devi', 'Mr. Anil Kumar', 'Mrs. Geeta Rani',
  'Mr. Suresh Gupta', 'Mrs. Pushpa Verma', 'Mr. Mahesh Yadav', 'Mrs. Kamla Singh',
  'Mr. Naresh Patel', 'Mrs. Sushma Mishra', 'Mr. Dinesh Tiwari', 'Mrs. Radha Agarwal',
  'Mr. Kamlesh Joshi', 'Mrs. Urmila Saxena', 'Mr. Rajendra Pandey', 'Mrs. Savita Rawat',
  'Mr. Umesh Chauhan', 'Mrs. Shanta Dubey', 'Mr. Rakesh Nair', 'Mrs. Vijaya Mehta',
  'Mr. Harish Iyer', 'Mrs. Sunanda Rao', 'Mr. Girijesh Shukla', 'Mrs. Parvati Srivastava',
  'Mr. Bharat Gupta', 'Mrs. Laxmi Sharma', 'Mr. Gopal Verma', 'Mrs. Maya Yadav',
  'Mr. Shyam Kumar', 'Mrs. Sarita Singh',
];

export const parents: Parent[] = parentNames.map((name, i) => ({
  id: `p-${i + 1}`,
  name,
  email: `${name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 10)}${i}@gmail.com`,
  phone: `97${String(10000000 + i * 9876543).slice(0, 8)}`,
  studentIds: [`s-${i * 10 + 1}`, `s-${i * 10 + 2}`].filter((_, j) => j === 0 || Math.random() > 0.5),
  occupation: ['Business', 'Service', 'Farmer', 'Doctor', 'Engineer', 'Teacher'][i % 6],
  address: `${i + 1} Gandhi Nagar, Near ${['Main Market', 'Bus Stand', 'Post Office', 'Hospital'][i % 4]}`,
}));

// ─── Students ──────────────────────────────────────────────────────────────

const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Reyansh', 'Ayaan', 'Atharv', 'Dhruv', 'Kabir', 'Ananya', 'Diya', 'Advika', 'Anika', 'Kiara', 'Myra', 'Saanvi', 'Avni', 'Pari', 'Navya', 'Ishaan', 'Shaurya', 'Rohan', 'Aryan', 'Riya', 'Priya', 'Sanya', 'Neha', 'Tanvi', 'Komal'];
const lastNames = ['Sharma', 'Gupta', 'Kumar', 'Singh', 'Verma', 'Yadav', 'Mishra', 'Tiwari', 'Patel', 'Joshi', 'Saxena', 'Agarwal', 'Mehta', 'Rawat', 'Pandey'];

const studentStatuses: Array<'active' | 'inactive'> = ['active', 'active', 'active', 'active', 'inactive'];

let studentCounter = 0;
export const students: Student[] = classes.flatMap((cls) => {
  const count = Math.min(cls.capacity - 5, 25);
  return Array.from({ length: count }, (_, i) => {
    studentCounter++;
    const idx = studentCounter;
    const fn = firstNames[idx % firstNames.length];
    const ln = lastNames[idx % lastNames.length];
    const parentIdx = Math.floor((idx - 1) / 10);
    return {
      id: `s-${idx}`,
      name: `${fn} ${ln}`,
      rollNo: `${cls.name.replace('Class ', '').replace(' ', '')}${cls.section}${String(i + 1).padStart(2, '0')}`,
      classId: cls.id,
      section: cls.section,
      parentId: parents[parentIdx % parents.length].id,
      dob: format(subDays(today, (8 + Math.floor(idx / 30)) * 365 + (idx * 17) % 300), 'yyyy-MM-dd'),
      gender: idx % 2 === 0 ? 'M' : 'F',
      address: `${idx} MG Road, Sector ${idx % 5 + 1}`,
      phone: `96${String(10000000 + idx * 1111111).slice(0, 8)}`,
      admissionDate: format(subDays(today, (idx % 3 + 1) * 365), 'yyyy-MM-dd'),
      bloodGroup: ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-'][idx % 6],
      status: studentStatuses[idx % studentStatuses.length],
    };
  });
});

// ─── Fee Types ─────────────────────────────────────────────────────────────

export const feeTypes: FeeType[] = [
  { id: 'ft-1', name: 'Monthly Tuition Fee', category: 'Monthly', frequency: 'Monthly', mandatory: true, lateFeeType: 'fixed', lateFeeAmount: 50, active: true, createdAt: format(subMonths(today, 6), 'yyyy-MM-dd') },
  { id: 'ft-2', name: 'Admission Fee', category: 'Admission', frequency: 'One-time', mandatory: true, lateFeeType: 'fixed', lateFeeAmount: 0, active: true, createdAt: format(subMonths(today, 6), 'yyyy-MM-dd') },
  { id: 'ft-3', name: 'Exam Fee (Term 1)', category: 'Exam', frequency: 'Per exam', mandatory: true, lateFeeType: 'fixed', lateFeeAmount: 25, active: true, createdAt: format(subMonths(today, 6), 'yyyy-MM-dd') },
  { id: 'ft-4', name: 'Exam Fee (Term 2)', category: 'Exam', frequency: 'Per exam', mandatory: true, lateFeeType: 'fixed', lateFeeAmount: 25, active: true, createdAt: format(subMonths(today, 5), 'yyyy-MM-dd') },
  { id: 'ft-5', name: 'Annual Charges', category: 'Annual', frequency: 'Yearly', mandatory: true, lateFeeType: 'percentage', lateFeeAmount: 2, active: true, createdAt: format(subMonths(today, 6), 'yyyy-MM-dd') },
  { id: 'ft-6', name: 'Transport Fee', category: 'Transport', frequency: 'Monthly', mandatory: false, lateFeeType: 'fixed', lateFeeAmount: 30, active: true, createdAt: format(subMonths(today, 6), 'yyyy-MM-dd') },
  { id: 'ft-7', name: 'Activity Fee', category: 'Activity', frequency: 'Quarterly', mandatory: false, lateFeeType: 'fixed', lateFeeAmount: 20, active: true, createdAt: format(subMonths(today, 3), 'yyyy-MM-dd') },
  { id: 'ft-8', name: 'Uniform & Books', category: 'Uniform & Books', frequency: 'One-time', mandatory: false, lateFeeType: 'fixed', lateFeeAmount: 0, active: true, createdAt: format(subMonths(today, 6), 'yyyy-MM-dd') },
];

// ─── Fee Structure (amounts per class) ─────────────────────────────────────

const classFeeAmounts: Record<string, number> = {
  'c-nur': 800, 'c-nur-b': 800,
  'c-1a': 900, 'c-1b': 900,
  'c-2a': 900, 'c-2b': 900,
  'c-3a': 1000, 'c-3b': 1000,
  'c-4a': 1000, 'c-4b': 1000,
  'c-5a': 1200, 'c-5b': 1200,
  'c-6a': 1200, 'c-6b': 1200,
  'c-7a': 1400, 'c-7b': 1400,
  'c-8a': 1400, 'c-8b': 1400,
  'c-9a': 1600, 'c-9b': 1600,
  'c-10a': 1800, 'c-10b': 1800,
};

export const feeStructures: FeeStructure[] = classes.map((cls) => ({
  id: `fs-${cls.id}`,
  classId: cls.id,
  academicYear: '2025-26',
  items: [
    { feeTypeId: 'ft-1', amount: classFeeAmounts[cls.id] || 1000, dueDay: 10 },
    { feeTypeId: 'ft-2', amount: (classFeeAmounts[cls.id] || 1000) * 5, dueDay: 1 },
    { feeTypeId: 'ft-3', amount: 500, dueDay: 15 },
    { feeTypeId: 'ft-4', amount: 500, dueDay: 15 },
    { feeTypeId: 'ft-5', amount: (classFeeAmounts[cls.id] || 1000) * 2, dueDay: 5 },
    { feeTypeId: 'ft-6', amount: 400, dueDay: 10 },
  ],
}));

// ─── Fee Invoices (12 months, mixed statuses) ──────────────────────────────

const months = Array.from({ length: 12 }, (_, i) => {
  const d = subMonths(today, 11 - i);
  return format(d, 'yyyy-MM');
});

const statusWeights: Array<InvoiceStatus> = [];
for (let i = 0; i < 70; i++) statusWeights.push('paid');
for (let i = 0; i < 20; i++) statusWeights.push('due');
for (let i = 0; i < 10; i++) statusWeights.push('overdue');

type InvoiceStatus = 'paid' | 'due' | 'overdue' | 'waived';

let invoiceCounter = 0;
export const invoices: FeeInvoice[] = students.slice(0, 100).flatMap((student) => {
  const structure = feeStructures.find(fs => fs.classId === student.classId);
  if (!structure) return [];

  return months.flatMap((month, mi) => {
    const tuitionItem = structure.items.find(i => i.feeTypeId === 'ft-1');
    if (!tuitionItem) return [];
    invoiceCounter++;
    const statusIdx = (invoiceCounter * 7 + mi * 3) % statusWeights.length;
    const isPastMonth = mi < 9;
    const status: InvoiceStatus = isPastMonth ? statusWeights[statusIdx] : mi === 9 ? (invoiceCounter % 3 === 0 ? 'overdue' : 'due') : 'due';
    const dueDate = `${month}-${String(tuitionItem.dueDay).padStart(2, '0')}`;

    return [{
      id: `inv-${invoiceCounter}`,
      studentId: student.id,
      classId: student.classId,
      feeTypeId: 'ft-1',
      amount: tuitionItem.amount,
      dueDate,
      status,
      month,
      academicYear: '2025-26',
      lateFeeAmount: status === 'overdue' ? 50 : 0,
      discount: 0,
    }];
  });
});

// ─── Payments ──────────────────────────────────────────────────────────────

let paymentCounter = 0;
export const payments: Payment[] = invoices
  .filter(inv => inv.status === 'paid')
  .slice(0, 200)
  .map((inv, i) => {
    paymentCounter++;
    const modes: Payment['mode'][] = ['Cash', 'UPI', 'Card', 'Cheque', 'Net Banking'];
    return {
      id: `pay-${paymentCounter}`,
      receiptNo: `MPS/2025-26/${String(1000 + paymentCounter).padStart(4, '0')}`,
      studentId: inv.studentId,
      invoiceIds: [inv.id],
      amount: inv.amount,
      mode: modes[i % modes.length],
      paidAt: format(subDays(today, (200 - i) * 0.5), "yyyy-MM-dd'T'HH:mm:ss"),
      collectedBy: 'admin-1',
      discount: 0,
      lateFeeWaived: false,
    };
  });

// ─── Notices ───────────────────────────────────────────────────────────────

export const notices: Notice[] = [
  {
    id: 'n-1',
    title: 'School Reopening After Diwali Break',
    body: 'Dear Parents, the school will reopen on Monday, 4th November 2025 after the Diwali vacation. All students are expected to be in school uniform. Kindly ensure timely arrival.',
    category: 'Holiday',
    audience: 'all',
    authorRole: 'admin',
    authorId: 'admin-1',
    authorName: 'MY PUBLIC SCHOOL',
    pinned: true,
    createdAt: format(subDays(today, 3), "yyyy-MM-dd'T'10:00:00"),
    readBy: [],
  },
  {
    id: 'n-2',
    title: 'Term 2 Examination Schedule Released',
    body: 'The Term 2 examination schedule has been released. Examinations will be conducted from 15th November to 28th November 2025. Admit cards will be distributed one week prior. Detailed schedule is available on the school website.',
    category: 'Exam',
    audience: 'all',
    authorRole: 'admin',
    authorId: 'admin-1',
    authorName: 'MY PUBLIC SCHOOL',
    pinned: true,
    createdAt: format(subDays(today, 5), "yyyy-MM-dd'T'09:00:00"),
    readBy: [],
  },
  {
    id: 'n-3',
    title: 'October Fee Due Reminder',
    body: 'This is a gentle reminder that the October tuition fee is due by 10th October. Kindly pay at the school counter or via UPI (Google Pay/PhonePe). Late fee of ₹50 will be charged after the due date.',
    category: 'Fee',
    audience: 'all',
    authorRole: 'admin',
    authorId: 'admin-1',
    authorName: 'MY PUBLIC SCHOOL',
    pinned: false,
    createdAt: format(subDays(today, 8), "yyyy-MM-dd'T'11:00:00"),
    readBy: [],
  },
  {
    id: 'n-4',
    title: 'Mathematics Assignment Due Tomorrow',
    body: 'Dear Parents of Class 5A students, please remind your children that the Mathematics assignment on Chapter 7 (Fractions) is due tomorrow. Students who have not submitted their work from last week should also submit it.',
    category: 'General',
    audience: 'class',
    targetClassIds: ['c-5a'],
    authorRole: 'teacher',
    authorId: 't-11',
    authorName: 'Mrs. Meena Agarwal',
    pinned: false,
    createdAt: format(subDays(today, 1), "yyyy-MM-dd'T'14:30:00"),
    readBy: [],
  },
  {
    id: 'n-5',
    title: 'PTM Scheduled for 10th November',
    body: 'Parent-Teacher Meeting (PTM) is scheduled for Sunday, 10th November 2025 from 9 AM to 1 PM. Attendance is mandatory for all parents. Kindly bring the previous report card and your ward\'s diary.',
    category: 'General',
    audience: 'all',
    authorRole: 'admin',
    authorId: 'admin-1',
    authorName: 'MY PUBLIC SCHOOL',
    pinned: false,
    createdAt: format(subDays(today, 10), "yyyy-MM-dd'T'15:00:00"),
    readBy: [],
  },
  {
    id: 'n-6',
    title: 'Class 7B Science Project Submission',
    body: 'Students of Class 7B, please ensure your science project on "Renewable Energy Sources" is completed and ready for submission by this Friday. The model should be clearly labeled with student name, roll number, and class.',
    category: 'General',
    audience: 'class',
    targetClassIds: ['c-7b'],
    authorRole: 'teacher',
    authorId: 't-16',
    authorName: 'Mr. Sanjeev Rawat',
    pinned: false,
    createdAt: format(subDays(today, 2), "yyyy-MM-dd'T'16:00:00"),
    readBy: [],
  },
  {
    id: 'n-7',
    title: 'Annual Sports Day - 20th November',
    body: 'We are pleased to announce the Annual Sports Day on 20th November 2025. Students interested in participating in athletic events, team sports, and cultural activities should register with their class teacher by 5th November.',
    category: 'General',
    audience: 'all',
    authorRole: 'admin',
    authorId: 'admin-1',
    authorName: 'MY PUBLIC SCHOOL',
    pinned: false,
    createdAt: format(subDays(today, 7), "yyyy-MM-dd'T'09:30:00"),
    readBy: [],
  },
  {
    id: 'n-8',
    title: 'Urgent: Please Update Emergency Contact',
    body: 'All parents are requested to update their emergency contact details in the school records. Please visit the administrative office or contact your class teacher. This is mandatory for school safety protocols.',
    category: 'Urgent',
    audience: 'all',
    authorRole: 'admin',
    authorId: 'admin-1',
    authorName: 'MY PUBLIC SCHOOL',
    pinned: true,
    createdAt: format(subDays(today, 4), "yyyy-MM-dd'T'08:00:00"),
    readBy: [],
  },
  {
    id: 'n-9',
    title: 'Hindi Diwas Celebration',
    body: 'Hindi Diwas will be celebrated on 14th September. Students are encouraged to participate in essay writing, poem recitation, and debate competitions. Register with your Hindi teacher by 10th September.',
    category: 'General',
    audience: 'all',
    authorRole: 'admin',
    authorId: 'admin-1',
    authorName: 'MY PUBLIC SCHOOL',
    pinned: false,
    createdAt: format(subDays(today, 15), "yyyy-MM-dd'T'10:00:00"),
    readBy: [],
  },
  {
    id: 'n-10',
    title: 'Class 9A Extra Math Classes',
    body: 'Dear Parents of Class 9A, extra Mathematics classes for Board exam preparation will be held every Saturday from 8 AM to 10 AM starting next week. Attendance is highly recommended for all students.',
    category: 'General',
    audience: 'class',
    targetClassIds: ['c-9a'],
    authorRole: 'teacher',
    authorId: 't-19',
    authorName: 'Mrs. Seema Rani',
    pinned: false,
    createdAt: format(subDays(today, 6), "yyyy-MM-dd'T'17:00:00"),
    readBy: [],
  },
  {
    id: 'n-11',
    title: 'Winter Uniform from November',
    body: 'Students are required to wear winter uniform from 1st November onwards. Winter uniform includes the school blazer, full pants/salwar, and tie. The dress code will be strictly enforced.',
    category: 'General',
    audience: 'all',
    authorRole: 'admin',
    authorId: 'admin-1',
    authorName: 'MY PUBLIC SCHOOL',
    pinned: false,
    createdAt: format(subDays(today, 12), "yyyy-MM-dd'T'09:00:00"),
    readBy: [],
  },
  {
    id: 'n-12',
    title: 'Class 3B Picnic Permission Slip',
    body: 'A picnic to Nehru Park is planned for Class 3B on 28th October. Parents must sign and return the permission slip by 22nd October. The picnic fee of ₹150 should be paid along with the permission slip.',
    category: 'General',
    audience: 'class',
    targetClassIds: ['c-3b'],
    authorRole: 'teacher',
    authorId: 't-8',
    authorName: 'Mr. Suresh Mishra',
    pinned: false,
    createdAt: format(subDays(today, 9), "yyyy-MM-dd'T'12:00:00"),
    readBy: [],
  },
];

// ─── Attendance (60 days) ───────────────────────────────────────────────────

let attCounter = 0;
export const attendanceRecords: AttendanceRecord[] = students.slice(0, 50).flatMap((student) =>
  Array.from({ length: 30 }, (_, i) => {
    const date = subDays(today, i + 1);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return null; // skip weekends
    attCounter++;
    const rand = (attCounter * 13 + i * 7) % 100;
    const status: AttendanceRecord['status'] = rand < 85 ? 'present' : rand < 93 ? 'absent' : 'late';
    return {
      id: `att-${attCounter}`,
      studentId: student.id,
      classId: student.classId,
      date: format(date, 'yyyy-MM-dd'),
      status,
      markedBy: 't-1',
    };
  }).filter(Boolean) as AttendanceRecord[]
);

// ─── Homework ──────────────────────────────────────────────────────────────

export const homework: Homework[] = [
  { id: 'hw-1', classId: 'c-5a', subject: 'Mathematics', title: 'Chapter 7 - Fractions Exercise', description: 'Complete Ex. 7.1 and 7.2 from NCERT textbook. Show full working for all problems.', dueDate: format(addDays(today, 1), 'yyyy-MM-dd'), assignedBy: 't-11', createdAt: format(subDays(today, 1), "yyyy-MM-dd'T'14:30:00") },
  { id: 'hw-2', classId: 'c-5a', subject: 'English', title: 'Write a paragraph on My School', description: 'Write 150-200 words about your school. Focus on the facilities and what you enjoy most.', dueDate: format(addDays(today, 2), 'yyyy-MM-dd'), assignedBy: 't-3', createdAt: format(subDays(today, 1), "yyyy-MM-dd'T'10:00:00") },
  { id: 'hw-3', classId: 'c-7b', subject: 'Science', title: 'Renewable Energy Project', description: 'Prepare a working model or poster on any form of renewable energy. Label all parts clearly.', dueDate: format(addDays(today, 3), 'yyyy-MM-dd'), assignedBy: 't-16', createdAt: format(subDays(today, 2), "yyyy-MM-dd'T'16:00:00") },
  { id: 'hw-4', classId: 'c-9a', subject: 'Mathematics', title: 'Trigonometry Practice Sheet', description: 'Solve all problems from the practice sheet distributed in class. Show working.', dueDate: format(addDays(today, 1), 'yyyy-MM-dd'), assignedBy: 't-19', createdAt: format(subDays(today, 1), "yyyy-MM-dd'T'12:00:00") },
  { id: 'hw-5', classId: 'c-3b', subject: 'Hindi', title: 'पाठ 5 - प्रश्न उत्तर', description: 'पाठ 5 के सभी प्रश्नों के उत्तर अपनी उत्तर पुस्तिका में लिखें।', dueDate: format(addDays(today, 2), 'yyyy-MM-dd'), assignedBy: 't-8', createdAt: format(subDays(today, 1), "yyyy-MM-dd'T'11:00:00") },
];

// ─── Exams ─────────────────────────────────────────────────────────────────

export const exams: Exam[] = [
  { id: 'exam-1', name: 'Term 2 - Mathematics', classId: 'c-5a', subject: 'Mathematics', date: format(addDays(today, 24), 'yyyy-MM-dd'), maxMarks: 100, duration: 180 },
  { id: 'exam-2', name: 'Term 2 - Science', classId: 'c-5a', subject: 'Science', date: format(addDays(today, 26), 'yyyy-MM-dd'), maxMarks: 100, duration: 180 },
  { id: 'exam-3', name: 'Term 2 - English', classId: 'c-5a', subject: 'English', date: format(addDays(today, 28), 'yyyy-MM-dd'), maxMarks: 100, duration: 180 },
  { id: 'exam-4', name: 'Term 2 - Hindi', classId: 'c-5a', subject: 'Hindi', date: format(addDays(today, 30), 'yyyy-MM-dd'), maxMarks: 100, duration: 180 },
  { id: 'exam-5', name: 'Term 1 - Mathematics', classId: 'c-5a', subject: 'Mathematics', date: format(subDays(today, 45), 'yyyy-MM-dd'), maxMarks: 100, duration: 180 },
];

export const examResults: ExamResult[] = students.slice(0, 30).map((student, i) => ({
  id: `res-${i + 1}`,
  examId: 'exam-5',
  studentId: student.id,
  marksObtained: 45 + ((i * 17 + 13) % 56),
  grade: ['A+', 'A', 'B+', 'B', 'C'][Math.floor(i / 6)],
}));

// ─── Timetable ─────────────────────────────────────────────────────────────

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const periods = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];
const classSubjects = ['English', 'Mathematics', 'Hindi', 'Science', 'Social Science', 'Computer'];

let periodCounter = 0;
export const timetable: Period[] = classes.slice(0, 4).flatMap((cls) =>
  days.flatMap((day) =>
    periods.slice(0, 6).map((start, pi) => {
      periodCounter++;
      return {
        id: `p-${periodCounter}`,
        classId: cls.id,
        subject: classSubjects[pi % classSubjects.length],
        teacherId: teachers[pi % teachers.length].id,
        day,
        startTime: start,
        endTime: periods[pi + 1] || '15:00',
      };
    })
  )
);

// ─── Events ────────────────────────────────────────────────────────────────

export const events: SchoolEvent[] = [
  { id: 'ev-1', title: 'Diwali Break', date: format(subDays(today, 10), 'yyyy-MM-dd'), endDate: format(subDays(today, 3), 'yyyy-MM-dd'), description: 'School holiday for Diwali celebrations.', type: 'Holiday' },
  { id: 'ev-2', title: 'PTM', date: format(addDays(today, 18), 'yyyy-MM-dd'), description: 'Parent-Teacher Meeting for all classes.', type: 'Meeting' },
  { id: 'ev-3', title: 'Annual Sports Day', date: format(addDays(today, 29), 'yyyy-MM-dd'), description: 'Annual Sports Day and prize distribution.', type: 'Sports' },
  { id: 'ev-4', title: 'Term 2 Exams Begin', date: format(addDays(today, 24), 'yyyy-MM-dd'), endDate: format(addDays(today, 37), 'yyyy-MM-dd'), description: 'Term 2 examinations for Classes 1–10.', type: 'Exam' },
  { id: 'ev-5', title: 'Republic Day Celebration', date: format(addDays(today, 65), 'yyyy-MM-dd'), description: 'Republic Day flag hoisting and cultural program.', type: 'Cultural' },
  { id: 'ev-6', title: 'Winter Break', date: format(addDays(today, 70), 'yyyy-MM-dd'), endDate: format(addDays(today, 84), 'yyyy-MM-dd'), description: 'Annual winter vacation.', type: 'Holiday' },
];
