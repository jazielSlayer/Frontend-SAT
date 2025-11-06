import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { logo } from "./NavStyles";

import { FaCircleUser } from "react-icons/fa6";
import { FaBars } from "react-icons/fa";
import { MdHomeFilled } from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { GiScrollUnfurled } from "react-icons/gi";
import { GrWorkshop } from "react-icons/gr";
import { FaUsersGear } from "react-icons/fa6";

function AdminNav({ user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const navRef = useRef(null);

  const toggleMenu = () => {
    setCollapsed((s) => !s);
  };

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
        </div>
      </div>

      <ul className="nav-list" onClick={(e) => e.stopPropagation()}>
        <li>
          <Link className="nav-link" to="/admin" onClick={onNavLinkClick}>
            <MdHomeFilled className="nav-icon" />
            <span className="nav-text">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/docenteadmin" onClick={onNavLinkClick}>
            <FaUserTie className="nav-icon" />
            <span className="nav-text">Docentes</span>
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/Estudiante-Admin" onClick={onNavLinkClick}>
            <PiStudentFill className="nav-icon" />
            <span className="nav-text">Estudiantes</span>
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/roles-admin" onClick={onNavLinkClick}>
            <GiScrollUnfurled className="nav-icon" />
            <span className="nav-text">Roles</span>
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/talleres" onClick={onNavLinkClick}>
            <GrWorkshop className="nav-icon" />
            <span className="nav-text">Talleres</span>
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/usuarios" onClick={onNavLinkClick}>
            <FaUsersGear className="nav-icon"/>
            <span className="nav-text">Usuarios</span>
          </Link>
        </li>
        <li className="open_submenu user-icon-wrapper">
            <Link className="nav-link user-link" to="/AdminUser" onClick={(e) => { e.stopPropagation(); onNavLinkClick(); }}>
              <FaCircleUser className="nav-icon" />
              <span className="nav-text">Perfil {user.user_name || user.nombres} </span>
            </Link>
        </li>
      </ul>
    </nav>
  );
}

export default AdminNav;