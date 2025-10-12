import { Link } from "react-router-dom";
import {logo, navStyle,ulStyle, linkStyle, logoutButtonStyle,} from "./NavStyles";

function AdminNav({ user, onLogout }) {
  return (
    <nav style={navStyle}>
      <div>
        <img src={logo} alt="Logo" style={{ height: "40px" }} />
      </div>
      <ul style={ulStyle}>
        <li>
          <Link style={linkStyle} to="/admin">
            Dashboard
          </Link>
        </li>
        <li>
          <Link style={linkStyle} to="/docenteadmin">
            Docentes
          </Link>
        </li>
        <li>
          <Link style={linkStyle} to="/Estudiante-Admin">
            Estudiantes
          </Link>
        </li>
        <li>
          <Link style={linkStyle} to="/roles-admin">
            Roles
          </Link>
        </li>
        <li>
          <Link style={linkStyle} to="/talleres">
            Talleres
          </Link>
        </li>
        {user && (
          <li>
            <span style={{ color: "#fff", marginRight: "1rem" }}>
              Bienvenido, {user.user_name || user.nombres}
            </span>
            <button style={logoutButtonStyle} onClick={onLogout}>
              Cerrar Sesión
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default AdminNav;