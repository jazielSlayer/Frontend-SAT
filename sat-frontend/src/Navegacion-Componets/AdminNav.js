import { Link } from "react-router-dom";
import { logo } from "./NavStyles";
import { IoLogOut } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import { FaBars } from "react-icons/fa";
import { logoutButtonStyle } from "./NavStyles";

function AdminNav({ user, onLogout }) {
  const toggleMenu = () => {
    document.querySelector('.nav-list').classList.toggle('active');
  };

  return (
    <nav className="admin-nav">
      <div className="nav-logo">
        <img src={logo} alt="Logo" />
      </div>
      
      <button className="menu-toggle" onClick={toggleMenu}>
        <FaBars />
      </button>

      <ul className="nav-list">
        <li>
          <Link className="nav-link" to="/admin">
            Dashboard
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/docenteadmin">
            Docentes
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/Estudiante-Admin">
            Estudiantes
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/roles-admin">
            Roles
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/talleres">
            Talleres
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/usuarios">
            Usuarios
          </Link>
        </li>
      </ul>
      {/**sub Menu user */}
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
      
    </nav>
  );
}

export default AdminNav;