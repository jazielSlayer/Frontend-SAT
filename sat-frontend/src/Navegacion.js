import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminNav from "./Navegacion-Componets/AdminNav";
import DocenteNav from "./Navegacion-Componets/DocenteNav";
import EstudianteNav from "./Navegacion-Componets/EstudianteNav";
import { IoLogOut } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import {
  logo,
  navStyle,
  ulStyle,
  linkStyle,
  logoutButtonStyle,
} from "./Navegacion-Componets/NavStyles";

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
    location.pathname === "/register-step2"
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
  const isRoot = location.pathname === "/";
  
  const renderNavLinks = () => {
    console.log("Rendering nav links for role:", user?.role)
    switch (user.role) {
      case "Admin":
        return (
          <>
            <li>
              <Link style={linkStyle} to="/admin" >
                Panel Admin
              </Link>
            </li>
          </>
        );
      case "docente":
        return (
          <>
            <li>
              <Link style={linkStyle} to="/docente">
                Panel Docente
              </Link>
            </li>
            {/* Add more docente-specific links as defined in DocenteNav */}
          </>
        );
      case "estudiante":
        return (
          <>
            <li>
              <Link style={linkStyle} to="/estudiante">
                Panel Estudiante
              </Link>
            </li>
            {/* Add more estudiante-specific links as defined in EstudianteNav */}
          </>
        );
      default:
        return null;
    }
  };

  if (isAdminPath) {
    return <AdminNav user={user} onLogout={handleLogout} />;
  }

  if (isDocentePath) {
    return <DocenteNav user={user} onLogout={handleLogout} />;
  }

  if (isEstudiantePath) {
    return <EstudianteNav user={user} onLogout={handleLogout} />;
  }

  if (isRoot) {
    return (
      <nav style={navStyle}>
        <div>
          <img src={logo} alt="Logo" style={{ height: "40px" }} />
        </div>
        <ul style={{ ...ulStyle, justifyContent: "flex-end" }}>
          {user ? (
            <li class="open_submenu">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  const subMenu = document.querySelector('.submenu');
                  const openSubmenu = document.querySelector('.open_submenu')
                  subMenu.classList.toggle('show');
                  document.addEventListener('click', function(e) {
                    if (subMenu.classList.contains('show')
                    && !subMenu.contains(e.target)
                    && !openSubmenu.contains(e.target)){
                        subMenu.classList.remove('show');
                    }
                });
                  
                }}
              >
                <FaCircleUser style={{ fontSize: '40px' }}/>
              </button>
              <i class="fa-solid fa-chevron-down"></i>
              <div class="submenu">
                <ul>
                  <li>
                    <span style={{ color: '#fff', marginRight: '1rem' }}>
                      Bienvenido, {user.user_name || user.nombres}
                    </span>
                  </li>
                  {renderNavLinks()}
                  <li>
                    <button style={logoutButtonStyle} onClick={handleLogout}>
                      <IoLogOut />
                    </button>
                  </li>
                  
                </ul>
              </div>
            </li>
          ) : (
            <>
              <li>
                <Link style={linkStyle} to="/login">
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link style={linkStyle} to="/register">
                  Registrarse
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    );
  }

  
  return (
    <nav style={navStyle}>
      <div>
        <img src={logo} alt="Logo" style={{ height: "40px" }} />
      </div>
      <ul style={ulStyle}>
        <li>
          <Link style={linkStyle} to="/">
            Inicio
          </Link>
        </li>
        {user ? (
          <>
            <li>
              <span style={{ color: "#fff", marginRight: "1rem" }}>
                {user.user_name || user.nombres}
              </span>
            </li>
            <li>
              <button style={logoutButtonStyle} onClick={handleLogout}>
                <IoLogOut/>
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link style={linkStyle} to="/login">
              Iniciar Sesión
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navegacion;