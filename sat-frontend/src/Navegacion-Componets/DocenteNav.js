import { Link } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";
import {
  logo,
  navStyle,
  ulStyle,
  linkStyle,
  logoutButtonStyle,
} from "./NavStyles";

function DocenteNav({ user, onLogout }) {
  return (
    <nav style={navStyle}>
      <div>
        <img src={logo} alt="Logo" style={{ height: "40px" }} />
      </div>
      <ul style={ulStyle}>
        <li>
          <Link style={linkStyle} to="/docente">
            Dashboard
          </Link>
        </li>
        <li>
          <span style={{ ...linkStyle, opacity: 0.7 }}>Proyectos</span>
        </li>
        <li>
          <span style={{ ...linkStyle, opacity: 0.7 }}>Módulos</span>
        </li>
        <li>
          <span style={{ ...linkStyle, opacity: 0.7 }}>Seguimiento</span>
        </li>
        {user && (
          <li>
            <span style={{ color: "#fff", marginRight: "1rem" }}>
              Prof. {user.user_name || user.nombres}
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

export default DocenteNav;