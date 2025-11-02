import React, { createContext, useContext, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Navegacion from "./Navegacion";
import ProtectedRoute from "./ProtectedRout";


import Admin from "./Screens/Admin/Admin";
import AdminEstudiantes from "./Screens/Admin/Admin-Ventanas/Estudiante-Admin";
import DocenteAdmin from "./Screens/Admin/Admin-Ventanas/Docente-Admin";
import Estudiante from "./Screens/Users/Estudiante/Estudiante";
import Docente from "./Screens/Users/Docente/Docente";
import Login from "./Screens/Login/Login";
import RegisterPersona from "./Screens/Login/Register/RegisterPersona";
import RegisterUsuario from "./Screens/Login/Register/RegisterUsuario";
import RolesAdmin from "./Screens/Admin/Admin-Ventanas/AdminRoles";
import Talleres from "./Screens/Admin/Admin-Ventanas/Tallerres";
import AutenticacionUser from "./Screens/Login/Register/AutenticacionUser";
import Usuarios from "./Screens/Admin/Admin-Ventanas/Usuarios";
import AutenticacionLogin from "./Screens/Login/LoginAuth";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Navegacion />
        <Routes>
          <Route path="/" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Estudiante-Admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminEstudiantes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/docenteadmin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DocenteAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/docente"
              element={
                <ProtectedRoute requiredRole="docente">
                  <Docente />
                </ProtectedRoute>
              }
            />
            <Route
              path="/estudiante"
              element={
                <ProtectedRoute requiredRole="estudiante">
                  <Estudiante />
                </ProtectedRoute>
              }
            />
            <Route
              path="/usuarios"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Usuarios />
                </ProtectedRoute>
              }
            />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<RegisterPersona />} />
  <Route path="/autenticacion-login" element={<AutenticacionLogin />} />
  <Route path="/register-step2" element={<AutenticacionUser />} />
  <Route path="/register-step3" element={<RegisterUsuario />} />
  <Route
    path="/roles-admin"
    element={
      <ProtectedRoute requiredRole="admin">
        <RolesAdmin />
      </ProtectedRoute>
    }
  />
  <Route
    path="/talleres"
    element={
      <ProtectedRoute requiredRole="admin">
        <Talleres />
      </ProtectedRoute>
    }
  />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);