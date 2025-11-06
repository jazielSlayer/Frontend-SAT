// ruta para proyectos modulos y seguiemiento, inicio
//DocenteNav
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { logo } from "./NavStyles";

import { FaCircleUser } from "react-icons/fa6";
import { FaBars } from "react-icons/fa";
import { MdHomeFilled } from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";


function DocenteNav({ user, onLogout }) {
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

  // Detectar scroll para ocultar/mostrar navegación en móvil
  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth <= 768;
      
      if (!isMobile) return; // Solo funciona en móvil
      
      const currentScrollY = window.scrollY;
      
      // Si el scroll es hacia abajo y ha pasado de 10px, ocultar
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
          <Link className="nav-link" to="/docente" onClick={onNavLinkClick}>
            <MdHomeFilled className="nav-icon" />
            <span className="nav-text">proyectos</span>
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/docente" onClick={onNavLinkClick}>
            <FaUserTie className="nav-icon" />
            <span className="nav-text">modulos </span>
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/docente" onClick={onNavLinkClick}>
            <PiStudentFill className="nav-icon" />
            <span className="nav-text">seguiemiento</span>
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

export default DocenteNav;