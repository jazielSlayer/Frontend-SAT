import React, { useEffect, useRef } from "react";
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';

function Admin() {
  const gridRef = useRef(null);
  const gridContainerRef = useRef(null);

  useEffect(() => {
    const gridContainer = gridContainerRef.current;
    if (!gridContainer) {
      console.error("El contenedor grid-stack no se encontró en el DOM.");
      return;
    }

    try {
      // Inicializar GridStack solo si no está inicializado
      if (!gridRef.current) {
        gridRef.current = GridStack.init({
          cellHeight: 100,
          float: true,
          disableOneColumnMode: true,
        }, gridContainer);
      }

      const grid = gridRef.current;

      // Remover todos los widgets existentes
      grid.removeAll();

      // Agregar widgets con colores únicos
      grid.addWidget({ x: 0, y: 0, w: 2, h: 1, content: 'Dashboard' });
      grid.addWidget({ x: 3, y: 0, w: 2, h: 1, content: 'Configuración' });
      grid.addWidget({ x: 6, y: 0, w: 2, h: 1, content: 'Users' });

      // Limpieza al desmontar
      
    } catch (error) {
      console.error("Error al inicializar GridStack:", error);
    }
  }, []); // Ejecuta solo al montar

  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "20px", color: "white" }}>Admin Panel</h1>
      <div ref={gridContainerRef} className="grid-stack" style={{ minHeight: "1000px", color: "white" }}></div>
    </div>
  );
}

export default Admin;