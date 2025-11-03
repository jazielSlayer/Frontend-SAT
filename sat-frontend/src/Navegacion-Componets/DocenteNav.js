import { Link } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";
import {
  logo,
  navStyle,
  ulStyle,
  linkStyle,
  logoutButtonStyle,
  LogoStyles,
} from "./NavStyles";
import { FaCircleUser } from "react-icons/fa6";

function DocenteNav({ user, onLogout }) {
  return (
    <nav style={navStyle}>
      <div>
        <img src={logo} alt="Logo" style={LogoStyles} />
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
                          <li>
                            <button style={logoutButtonStyle} onClick={onLogout}>
                              <IoLogOut />
                            </button>
                          </li>
                        </ul>
                      </div>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default DocenteNav;