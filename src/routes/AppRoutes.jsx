import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Dashboard_Admin from '../pages/auth/Dashboard_Admin';



export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Dashboard_Admin" element={<Dashboard_Admin />} />


    </Routes>
  );
}


