import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import { FaCircleUser, FaBars, FaUserTie, FaUsersGear, FaChevronDown } from "react-icons/fa6";
import { MdHomeFilled, MdViewModule } from "react-icons/md";
import { PiStudentFill, PiStudentBold, PiProjectorScreenChartFill } from "react-icons/pi";
import { GiScrollUnfurled, GiTeacher } from "react-icons/gi";
import { GrWorkshop } from "react-icons/gr";
import { IoLogOut } from "react-icons/io5";
import logo from "./Config/logousb.png"



function AdminNav({ user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const navRef = useRef(null);

  const toggleMenu = () => {
    setCollapsed((s) => !s);
  };

  const toggleSubmenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSubmenuOpen((s) => !s);
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

  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth <= 768;
      
      if (!isMobile) return; 
      
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 10) {
        setIsVisible(false);
        setCollapsed(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      document.body.style.paddingTop = isVisible ? '80px' : '0';
      document.body.style.paddingLeft = '0';
    } else {
      document.body.style.paddingTop = '0';
      document.body.style.paddingLeft = '50px';
    }

    return () => {
      document.body.style.paddingTop = '0';
      document.body.style.paddingLeft = '0';
    };
  }, [collapsed, isVisible]);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      
      if (isMobile) {
        document.body.style.paddingTop = isVisible ? '80px' : '0';
        document.body.style.paddingLeft = '0';
      } else {
        setIsVisible(true);
        document.body.style.paddingTop = '0';
        document.body.style.paddingLeft = '50px';
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [collapsed, isVisible]);

  const onNavLinkClick = () => {
    setCollapsed(false);
  };

  return (
    <>
      
      <nav 
        ref={navRef} 
        className={`admin-nav ${collapsed ? "nav-collapsed" : ""} ${!isVisible ? "nav-hidden" : ""}`}
      >
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

          {/* Submenú de Gestión */}
          <li>
            <button 
              className={`nav-submenu-trigger ${submenuOpen ? 'active' : ''}`}
              onClick={toggleSubmenu}
            >
              <div className="submenu-trigger-content">
                <FaUsersGear className="nav-icon" />
                <span className="nav-text">Gestión</span>
              </div>
              <FaChevronDown className="submenu-chevron" />
            </button>
            <ul className={`nav-submenu ${submenuOpen ? 'open' : ''}`}>
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
                <Link className="nav-link" to="/usuarios" onClick={onNavLinkClick}>
                  <FaUsersGear className="nav-icon"/>
                  <span className="nav-text">Usuarios</span>
                </Link>
              </li>
              <li>
                <Link className="nav-link" to="/admin/persona" onClick={onNavLinkClick}>
                  <FaUsersGear className="nav-icon"/>
                  <span className="nav-text">Persona</span>
                </Link>
              </li>
              <li>
                <Link className="nav-link" to="/roles-admin" onClick={onNavLinkClick}>
                  <GiScrollUnfurled className="nav-icon" />
                  <span className="nav-text">Roles</span>
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <Link className="nav-link" to="/talleres" onClick={onNavLinkClick}>
              <GrWorkshop className="nav-icon" />
              <span className="nav-text">Talleres</span>
            </Link>
          </li>
          <li>
            <Link className="nav-link" to="/proyectos/admin" onClick={onNavLinkClick}>
              <PiProjectorScreenChartFill className="nav-icon"/>
              <span className="nav-text">Proyectos</span>
            </Link>
          </li>
          <li>
            <Link className="nav-link" to="/admin/modulo" onClick={onNavLinkClick}>
              <MdViewModule className="nav-icon"/>
              <span className="nav-text">Modulos</span>
            </Link>
          </li>
          <li>
            <Link className="nav-link" to="/admin/metodologia" onClick={onNavLinkClick}>
              <MdViewModule className="nav-icon"/>
              <span className="nav-text">Metodologia</span>
            </Link>
          </li>
          <li>
            <Link className="nav-link" to="/estudiante-view" onClick={onNavLinkClick}>
              <PiStudentBold className="nav-icon"/>
              <span className="nav-text">Estudiante</span>
            </Link>
          </li>
          <li>
            <Link className="nav-link" to="/docente-view" onClick={onNavLinkClick}>
              <GiTeacher className="nav-icon"/>
              <span className="nav-text">Docente</span>
            </Link>
          </li>
          <li className="open_submenu user-icon-wrapper">
            <Link className="nav-link user-link" to="/AdminUser" onClick={(e) => { e.stopPropagation(); onNavLinkClick(); }}>
              <FaCircleUser className="nav-icon" />
              <span className="nav-text">Perfil</span>
            </Link>
          </li>
          <li>
            <button 
              className="logoutButtonStyle" 
              onClick={onLogout}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(185, 11, 11, 0.53)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <IoLogOut />
              <span className="nav-text" style={{marginLeft: '0.75rem'}}>Cerrar sesion</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default AdminNav;