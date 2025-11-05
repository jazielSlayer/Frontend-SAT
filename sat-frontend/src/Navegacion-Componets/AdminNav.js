import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { logo } from "./NavStyles";

import { FaCircleUser } from "react-icons/fa6";
import { FaBars } from "react-icons/fa";


function AdminNav({ user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const navRef = useRef(null);

  const toggleMenu = () => {
    setCollapsed((s) => !s);
  };


  // Cierra el menú si se hace click fuera del nav
  useEffect(() => {
    function handleDocumentClick(e) {
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target) && collapsed) {
        setCollapsed(false);
      }
    }

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [collapsed]);

  const onNavLinkClick = () => {
    // cierra el menú al clicar una opción
    setCollapsed(false);
  };

  return (
    <nav ref={navRef} className={`admin-nav ${collapsed ? "nav-collapsed" : ""}`}>
      <div className="nav-header">
        <div className="nav-logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="nav-controls">
          <button className="menu-toggle" onClick={(e) => { e.stopPropagation(); toggleMenu(); }}>
            <FaBars />
          </button>
          {user && (
            <li className="open_submenu">
              <Link className="nav-link" to="/AdminUser" onClick={(e) => { e.stopPropagation(); onNavLinkClick(); }}>
                <FaCircleUser style={{ fontSize: "40px" }} />
              </Link>
            </li>
          )}
        </div>
      </div>

      <ul className="nav-list" onClick={(e) => e.stopPropagation()}>
        <li>
          <Link className="nav-link" to="/admin" onClick={onNavLinkClick}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/docenteadmin" onClick={onNavLinkClick}>
            Docentes
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/Estudiante-Admin" onClick={onNavLinkClick}>
            Estudiantes
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/roles-admin" onClick={onNavLinkClick}>
            Roles
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/talleres" onClick={onNavLinkClick}>
            Talleres
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/usuarios" onClick={onNavLinkClick}>
            Usuarios
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default AdminNav;
