import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import AdminDashboard from '../pages/Home/admin/AdminDashboard';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/sign/login" replace />} />
      <Route path="/sign/login" element={<Login />} />
      <Route
        path="/sign/admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}


