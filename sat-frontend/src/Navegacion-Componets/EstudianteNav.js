import { Link } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";
import {
  logo,
  navStyle,
  ulStyle,
  linkStyle,
  logoutButtonStyle,
} from "./NavStyles";

function EstudianteNav({ user, onLogout }) {
  return (
    <nav style={navStyle}>
      <div>
        <img src={logo} alt="Logo" style={{ height: "40px" }} />
      </div>
      <ul style={ulStyle}>
        <li>
          <Link style={linkStyle} to="/estudiante">
            Dashboard
          </Link>
        </li>
        <li>
          <Link style={{ ...linkStyle, opacity: 0.7 }} to="/estudiante">
            Mis Proyectos
          </Link>
        </li>
        <li>
          <Link style={{ ...linkStyle, opacity: 0.7 }} to="/estudiante">
            Módulos
          </Link>
        </li>
        <li>
          <Link style={{ ...linkStyle, opacity: 0.7 }} to="/estudiante">
            Pagos
          </Link>
        </li>
        {user && (
          <li>
            <span style={{ color: "#fff", marginRight: "1rem" }}>
              {user.user_name || user.nombres}
            </span>
            <button style={logoutButtonStyle} onClick={onLogout}>
              <IoLogOut />
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default EstudianteNav;