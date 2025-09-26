import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const logo = "/logousb.png"; // Ruta relativa al public folder

function Navegacion() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar si hay un usuario logueado
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  // No mostrar la barra en /login, /register o /register-step2
  if (location.pathname === "/login" || 
      location.pathname === "/register" || 
      location.pathname === "/register-step2") {
    return null;
  }

  const navStyle = {
    background: "#07053b8e",
    borderRadius: "8px",
    padding: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const ulStyle = {
    display: "flex",
    gap: "1rem",
    listStyle: "none",
    margin: 0,
    padding: 0,
  };

  const linkStyle = {
    color: "#fff",
    textDecoration: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    transition: "background-color 0.3s"
  };

  const buttonStyle = {
    ...linkStyle,
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "inherit",
    fontFamily: "inherit"
  };

  const logoutButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#dc3545",
    color: "#fff"
  };

  // Rutas admin / estudiante-admin / docente-admin
  if (location.pathname === "/admin" || 
      location.pathname === "/Estudiante-Admin" || 
      location.pathname === "/docenteadmin" ||
      location.pathname === "/roles-admin") {
    return (
      <nav style={navStyle}>
        <div>
          <img src={logo} alt="Logo" style={{ height: "40px" }} />
        </div>
        <ul style={ulStyle}>
          <li><Link style={linkStyle} to="/admin">Dashboard</Link></li>
          <li><Link style={linkStyle} to="/docenteadmin">Docentes</Link></li>
          <li><Link style={linkStyle} to="/Estudiante-Admin">Estudiantes</Link></li>
          <li><Link style={linkStyle} to="/roles-admin">Roles</Link></li>
          {user && (
            <li>
              <span style={{color: "#fff", marginRight: "1rem"}}>
                Bienvenido, {user.user_name || user.nombres}
              </span>
              <button style={logoutButtonStyle} onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </li>
          )}
        </ul>
      </nav>
    );
  }

  // Ruta docente
  if (location.pathname === "/docente") {
    return (
      <nav style={navStyle}>
        <div>
          <img src={logo} alt="Logo" style={{ height: "40px" }} />
        </div>
        <ul style={ulStyle}>
          <li><Link style={linkStyle} to="/docente">Dashboard</Link></li>
          <li><span style={{...linkStyle, opacity: 0.7}}>Proyectos</span></li>
          <li><span style={{...linkStyle, opacity: 0.7}}>Módulos</span></li>
          <li><span style={{...linkStyle, opacity: 0.7}}>Seguimiento</span></li>
          {user && (
            <li>
              <span style={{color: "#fff", marginRight: "1rem"}}>
                Prof. {user.user_name || user.nombres}
              </span>
              <button style={logoutButtonStyle} onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </li>
          )}
        </ul>
      </nav>
    );
  }

  // Ruta estudiante
  if (location.pathname === "/estudiante") {
    return (
      <nav style={navStyle}>
        <div>
          <img src={logo} alt="Logo" style={{ height: "40px" }} />
        </div>
        <ul style={ulStyle}>
          <li><Link style={linkStyle} to="/estudiante">Dashboard</Link></li>
          <li><Link style={{...linkStyle, opacity: 0.7}} to="/estudiante">Mis Proyectos</Link></li>
          <li><Link style={{...linkStyle, opacity: 0.7}} to="/estudiante">Módulos</Link></li>
          <li><Link style={{...linkStyle, opacity: 0.7}} to="/estudiante">Pagos</Link></li>
          {user && (
            <li>
              <span style={{color: "#fff", marginRight: "1rem"}}>
                {user.user_name || user.nombres}
              </span>
              <button style={logoutButtonStyle} onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </li>
          )}
        </ul>
      </nav>
    );
  }

  // Ruta raíz
  if (location.pathname === "/") {
    return (
      <nav style={navStyle}>
        <div>
          <img src={logo} alt="Logo" style={{ height: "40px" }} />
        </div>
        <ul style={{ ...ulStyle, justifyContent: "flex-end" }}>
          {user ? (
            <>
              <li>
                <span style={{color: "#fff", marginRight: "1rem"}}>
                  Bienvenido, {user.user_name || user.nombres}
                </span>
              </li>
              <li>
                <button style={logoutButtonStyle} onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link style={linkStyle} to="/login">Iniciar Sesión</Link></li>
              <li><Link style={linkStyle} to="/register">Registrarse</Link></li>
            </>
          )}
        </ul>
      </nav>
    );
  }

  // Barra para otras rutas
  return (
    <nav style={navStyle}>
      <div>
        <img src={logo} alt="Logo" style={{ height: "40px" }} />
      </div>
      <ul style={ulStyle}>
        <li><Link style={linkStyle} to="/">Inicio</Link></li>
        {user ? (
          <>
            <li>
              <span style={{color: "#fff", marginRight: "1rem"}}>
                {user.user_name || user.nombres}
              </span>
            </li>
            <li>
              <button style={logoutButtonStyle} onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </li>
          </>
        ) : (
          <li><Link style={linkStyle} to="/login">Iniciar Sesión</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default Navegacion;