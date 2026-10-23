import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAppStore } from './store/appStore';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

// Auth
import LoginPage from './features/auth/LoginPage';

// Admin
import AdminLayout from './app/AdminLayout';
import AdminDashboard from './features/admin/Dashboard';
import AdminStudents from './features/admin/Students';
import StudentDetail from './features/admin/StudentDetail';
import AdminTeachers from './features/admin/Teachers';
import AdminClasses from './features/admin/Classes';
import AdminNotices from './features/admin/Notices';
import AdminSettings from './features/admin/Settings';
import FeeTypes from './features/admin/fees/FeeTypes';
import FeeStructure from './features/admin/fees/FeeStructure';
import CollectFee from './features/admin/fees/CollectFee';
import PendingFees from './features/admin/fees/PendingFees';
import FeeTransactions from './features/admin/fees/FeeTransactions';

// Teacher
import MobileShell from './app/MobileShell';
import TeacherHome from './features/teacher/Home';
import TeacherAttendance from './features/teacher/Attendance';
import TeacherClasses from './features/teacher/Classes';
import TeacherNotices from './features/teacher/Notices';
import TeacherProfile from './features/teacher/Profile';

// Parent
import ParentHome from './features/parent/Home';
import ParentFees from './features/parent/Fees';
import ParentAcademics from './features/parent/Academics';
import ParentNotices from './features/parent/Notices';
import ParentProfile from './features/parent/Profile';

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const user = useAuthStore(s => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const theme = useAppStore(s => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          style: { fontFamily: 'Poppins, sans-serif', fontSize: '13px' },
        }}
      />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="students/:id" element={<StudentDetail />} />
          <Route path="teachers" element={<AdminTeachers />} />
          <Route path="classes" element={<AdminClasses />} />
          <Route path="notices" element={<AdminNotices />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="fees/types" element={<FeeTypes />} />
          <Route path="fees/structure" element={<FeeStructure />} />
          <Route path="fees/collect" element={<CollectFee />} />
          <Route path="fees/pending" element={<PendingFees />} />
          <Route path="fees/transactions" element={<FeeTransactions />} />
        </Route>

        {/* Teacher Routes */}
        <Route path="/teacher" element={<ProtectedRoute role="teacher"><MobileShell role="teacher" /></ProtectedRoute>}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<TeacherHome />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="classes" element={<TeacherClasses />} />
          <Route path="notices" element={<TeacherNotices />} />
          <Route path="profile" element={<TeacherProfile />} />
        </Route>

        {/* Parent Routes */}
        <Route path="/parent" element={<ProtectedRoute role="parent"><MobileShell role="parent" /></ProtectedRoute>}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<ParentHome />} />
          <Route path="fees" element={<ParentFees />} />
          <Route path="academics" element={<ParentAcademics />} />
          <Route path="notices" element={<ParentNotices />} />
          <Route path="profile" element={<ParentProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
