import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { logo } from "./NavStyles";

import { FaCircleUser } from "react-icons/fa6";
import { FaBars } from "react-icons/fa";
import { MdHomeFilled, MdViewModule } from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { GiScrollUnfurled } from "react-icons/gi";
import { GrWorkshop } from "react-icons/gr";
import { FaUsersGear } from "react-icons/fa6";
import { GiTeacher } from "react-icons/gi";
import { PiStudentBold } from "react-icons/pi";
import { PiProjectorScreenChartFill } from "react-icons/pi";
import { IoLogOut } from "react-icons/io5";
import { logoutButtonStyle } from "./NavStyles";


function AdminNav({ user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
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

  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth <= 768;
      
      if (!isMobile) return; 
      
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 10) {
        setIsVisible(false);
        setCollapsed(false); // Cerrar el menú si está abierto
      } 
      // Si el scroll es hacia arriba, mostrar
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Ajustar el padding del body según el estado de la navegación
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // En móvil: padding-top solo cuando está cerrado y visible
      document.body.style.paddingTop = isVisible ? '80px' : '0';
      document.body.style.paddingLeft = '0';
    } else {
      // En desktop: padding-left fijo de 50px (solo cuando está minimizado)
      document.body.style.paddingTop = '0';
      document.body.style.paddingLeft = '50px';
    }

    // Limpiar los estilos al desmontar el componente
    return () => {
      document.body.style.paddingTop = '0';
      document.body.style.paddingLeft = '0';
    };
  }, [collapsed, isVisible]);

  // Detectar cambios de tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      
      if (isMobile) {
        document.body.style.paddingTop = isVisible ? '80px' : '0';
        document.body.style.paddingLeft = '0';
      } else {
        setIsVisible(true); // Siempre visible en desktop
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
        <li>
          <Link className="nav-link" to="/proyectos/admin" onClick={onNavLinkClick}>
            <PiProjectorScreenChartFill  className="nav-icon"/>
            <span className="nav-text">Proyectos</span>
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/admin/modulo" onClick={onNavLinkClick}>
            <MdViewModule  className="nav-icon"/>
            <span className="nav-text">Modulos</span>
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
              <span className="nav-text">Perfil {/**user.user_name*/} </span>
            </Link>
        </li>
        <li>
                                        <button style={logoutButtonStyle} onClick={onLogout}>
                                          <IoLogOut />
                                        </button>
        </li>
      </ul>
    </nav>
  );
}

export default AdminNav;