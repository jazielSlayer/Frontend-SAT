import {  useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminNav from "./Navegacion-Componets/AdminNav";
import DocenteNav from "./Navegacion-Componets/DocenteNav";
import EstudianteNav from "./Navegacion-Componets/EstudianteNav";


function Navegacion() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
  const userData = localStorage.getItem("user");
  console.log("userData from localStorage:", userData);
  if (userData) {
    const parsedUser = JSON.parse(userData);
    console.log("Parsed user:", parsedUser);
    setUser(parsedUser);
  }
}, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  if (
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/register-step2" ||
    location.pathname === "/autenticacion-login"
  ) {
    return null;
  }

  const isAdminPath = [
    "/admin",
    "/Estudiante-Admin",
    "/docenteadmin",
    "/roles-admin",
    "/talleres",
    "/usuarios",
  ].includes(location.pathname);

  const isDocentePath = location.pathname === "/docente";
  const isEstudiantePath = location.pathname === "/estudiante";
 
  
  

  if (isAdminPath) {
    return <AdminNav user={user} onLogout={handleLogout} />;
  }

  if (isDocentePath) {
    return <DocenteNav user={user} onLogout={handleLogout} />;
  }

  if (isEstudiantePath) {
    return <EstudianteNav user={user} onLogout={handleLogout} />;
  }

  
}

export default Navegacion;