import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';

// Componentes de médicos
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Componentes de admin
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import ProvinciasManager from './components/admin/ProvinciasManager';
import MunicipiosManager from './components/admin/MunicipiosManager';
import PoliclinicosManager from './components/admin/PoliclinicosManager';
import ConsultoriosManager from './components/admin/ConsultoriosManager';

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Router>
          <Routes>
            {/* Rutas de médicos */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Rutas de administrador */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/provincias"
              element={
                <AdminProtectedRoute>
                  <ProvinciasManager />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/municipios"
              element={
                <AdminProtectedRoute>
                  <MunicipiosManager />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/policlinicos"
              element={
                <AdminProtectedRoute>
                  <PoliclinicosManager />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/consultorios"
              element={
                <AdminProtectedRoute>
                  <ConsultoriosManager />
                </AdminProtectedRoute>
              }
            />

            {/* Redirecciones */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;