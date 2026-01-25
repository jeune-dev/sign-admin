import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Inscription from '../pages/auth/Inscription';
import Dashboard_Client from '../pages/auth/Dashboard_Client';



export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Inscription" element={<Inscription />} />
      <Route path="/Dashboard_Client" element={<Dashboard_Client />} />


    </Routes>
  );
}
