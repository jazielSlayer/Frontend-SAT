import { Link, useLocation } from "react-router-dom";

const logo = "/logousb.png"; // Ruta relativa al public folder

function Navegacion() {
  const location = useLocation();

  // No mostrar la barra en /login o /register
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const navStyle = {
    background: "#07053b8e",
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
  };

  // Rutas admin / estudiante-admin
  if (location.pathname === "/admin" || location.pathname === "/Estudiante-Admin") {
    return (
      <nav style={navStyle}>
        <div>
          <img src={logo} alt="Logo" style={{ height: "40px" }} />
        </div>
        <ul style={ulStyle}>
          <li><Link style={linkStyle} to="/admin">Admin</Link></li>
          <li><Link style={linkStyle} to="/docente">Docente</Link></li>
          <li><Link style={linkStyle} to="/Estudiante-Admin">Estudiante</Link></li>
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
          <li><Link style={linkStyle} to="/login">Login</Link></li>
          <li><Link style={linkStyle} to="/register">Register</Link></li>
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
        <li><Link style={linkStyle} to="/">Bienvenida</Link></li>
        <li><Link style={linkStyle} to="/admin">Admin</Link></li>
        <li><Link style={linkStyle} to="/docente">Docente</Link></li>
        <li><Link style={linkStyle} to="/estudiante">Estudiante</Link></li>
        <li><Link style={linkStyle} to="/login">Login</Link></li>
      </ul>
    </nav>
  );
}

export default Navegacion;
