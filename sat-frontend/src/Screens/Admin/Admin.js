import React, { useEffect, useRef, useState } from "react";
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';
import { getDocentes } from "../../API/Admin/Docente_admin";

function Admin() {
  const gridRef = useRef(null);
  const gridContainerRef = useRef(null);
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch docentes
  useEffect(() => {
    console.log("Starting fetchDocentes...");
    const fetchDocentes = async () => {
      try {
        const data = await getDocentes();
        console.log("Docentes data:", data);
        setDocentes(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        console.error("Fetch docentes error:", err);
        setError(err.message || "Failed to fetch docentes");
        setLoading(false);
      }
    };
    fetchDocentes();
  }, []);

  // Initialize GridStack
  useEffect(() => {
    console.log("Checking grid container...");
    const gridContainer = gridContainerRef.current;
    if (!gridContainer) {
      console.error("Grid container not found in DOM");
      return;
    }

    console.log("Initializing GridStack...");
    try {
      // Initialize GridStack
      if (!gridRef.current) {
        gridRef.current = GridStack.init({
          cellHeight: 80,
          float: true,
          disableOneColumnMode: true,
          margin: 15,
          column: 12, // 12 column grid for better layout control
        }, gridContainer);
        console.log("GridStack initialized successfully");
      }

      const grid = gridRef.current;

      // Remove existing widgets
      console.log("Removing existing widgets...");
      grid.removeAll();

      // Add navigation widgets (top row - fixed position, not draggable)
      console.log("Adding navigation widgets...");
      
      // Dashboard widget - Navigation
      grid.addWidget({
        x: 0,
        y: 0,
        w: 2,
        h: 1,
        content: 'Dashboard',
        noResize: true,
        noMove: true,
        id: 'dashboard-nav'
      });

      // Docentes widget - Navigation
      grid.addWidget({
        x: 2,
        y: 0,
        w: 2,
        h: 1,
        content: 'Docentes',
        noResize: true,
        noMove: true,
        id: 'docentes-nav'
      });

      // Estudiantes widget - Navigation
      grid.addWidget({
        x: 4,
        y: 0,
        w: 2,
        h: 1,
        content: 'Estudiantes',
        noResize: true,
        noMove: true,
        id: 'estudiantes-nav'
      });

      // Spacer for future navigation widgets
      grid.addWidget({
        x: 6,
        y: 0,
        w: 6,
        h: 1,
        content: 'Espacio para más navegación',
        noResize: true,
        noMove: true,
        id: 'nav-spacer'
      });

      // Main content area - Graphics widget (large central area)
      grid.addWidget({
        x: 0,
        y: 1,
        w: 8,
        h: 4,
        content: '📊 Área destinada para gráficas',
        noResize: true,
        noMove: true,
        id: 'graphics-area'
      });

      // Side panel for additional widgets
      grid.addWidget({
        x: 8,
        y: 1,
        w: 4,
        h: 2,
        content: `Panel de Control ${docentes.length} ${loading ? 'Cargando...' : 'Activo'}`,
        noResize: true,
        noMove: true,
        id: 'control-panel'
      });

      // Additional widget space 1
      grid.addWidget({
        x: 8,
        y: 3,
        w: 4,
        h: 2,
        content: '➕Espacio para widget adicional',
        noResize: true,
        noMove: true,
        id: 'widget-space-1'
      });

      // Bottom row for more widgets
      grid.addWidget({
        x: 0,
        y: 5,
        w: 4,
        h: 2,
        content: '📈Métricas adicionales',
        noResize: true,
        noMove: true,
        id: 'metrics-widget'
      });

      grid.addWidget({
        x: 4,
        y: 5,
        w: 4,
        h: 2,
        content: '⚙️',
        noResize: true,
        noMove: true,
        id: 'settings-widget'
      });

      grid.addWidget({
        x: 8,
        y: 5,
        w: 4,
        h: 2,
        content: '📋',
        noResize: true,
        noMove: true,
        id: 'reports-widget'
      });

      // Cleanup
      return () => {
        console.log("Cleaning up GridStack...");
        if (gridRef.current) {
          gridRef.current.destroy(false);
          gridRef.current = null;
        }
      };
    } catch (error) {
      console.error("GridStack initialization error:", error);
    }
  }, [docentes, loading, error]);

  console.log("Rendering Admin component...");

  return (
    <div className="bg-gray-900 min-h-screen p-4">
      <h1 className="text-center text-3xl font-bold mb-6" style={{ color: "white", textShadow: "2px 2px 4px rgba(0, 0, 0, 1)" }}>
        Admin Panel
      </h1>
      <div
        ref={gridContainerRef}
        className="grid-stack bg-gray-700 rounded-lg"
        style={{ 
          minHeight: "700px", 
          color: "white", 
          background: "#0c0a877b", 
          borderRadius: "15px", 
          height: "85vh",
          padding: "10px"
        }}
      ></div>
    </div>
  );
}

export default Admin;