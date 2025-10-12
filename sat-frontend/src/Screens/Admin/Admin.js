import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Chart } from 'chart.js/auto';
import { getDocentes } from "../../API/Admin/Docente_admin";
import { getEstudiantes } from "../../API/Admin/Estudiante_admin";
import { getAllTalleres } from "../../API/Admin/Taller.js";
import { getUserCount } from "../../API/Admin/Users_Admin.js";
import { getAllMetodologias } from "../../API/Admin/Metodologia.js";
import { getAllModulos } from "../../API/Admin/Modulo.js";

function Admin() {
  const [docentes, setDocentes] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [talleres, setTalleres] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [metodologias, setMetodologias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const [docentesData, estudiantesData, modulosData, talleresData, usersCount, metodologiasData] = await Promise.all([
        getDocentes(),
        getEstudiantes(),
        getAllModulos(),
        getAllTalleres(),
        getUserCount(),
        getAllMetodologias()
      ]);

      setDocentes(docentesData);
      setEstudiantes(estudiantesData);
      setModulos(modulosData);
      setTalleres(talleresData.data || []);
      setUserCount(usersCount);
      setMetodologias(metodologiasData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoize chart initialization
  const initializeCharts = useCallback(() => {
    if (loading) return;

    // Cleanup existing charts
    ['userDistribution', 'talleresChart', 'metodologiasChart'].forEach(id => {
      const chart = Chart.getChart(id);
      if (chart) {
        chart.destroy();
      }
    });

    const talleresArray = Array.isArray(talleres) ? talleres : [];

    // User Distribution Chart
    const userCtx = document.getElementById('userDistribution');
    if (userCtx) {
      new Chart(userCtx, {
        type: 'doughnut',
        data: {
          labels: ['Estudiantes', 'Docentes'],
          datasets: [{
            data: [estudiantes.length, docentes.length],
            backgroundColor: ['#4CAF50', '#2196F3']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { 
                color: '#fff',
                padding: 10
              }
            }
          }
        }
      });
    }

    // Talleres Chart - Bar chart by tipo_taller with detailed tooltips
    const talleresCtx = document.getElementById('talleresChart');
    if (talleresCtx) {
      const tipos = ['Teórico', 'Práctico', 'Mixto'];
      const data = tipos.map(tipo => talleresArray.filter(t => t.tipo_taller === tipo).length);

      new Chart(talleresCtx, {
        type: 'bar',
        data: {
          labels: tipos,
          datasets: [{
            label: 'Número de Talleres',
            data: data,
            backgroundColor: ['#FFA726', '#66BB6A', '#42A5F5'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { color: '#fff' }
            },
            tooltip: {
              callbacks: {
                afterBody: function(tooltipItems) {
                  const idx = tooltipItems[0].dataIndex;
                  const tipo = tipos[idx];
                  const filtered = talleresArray.filter(t => t.tipo_taller === tipo);
                  return filtered.map(t => 
                    `\n- Título: ${t.titulo || t.nombre || '-'} \n  ID Metodología: ${t.id_metodologia || '-'} \n  Evaluación: ${t.evaluacion_final || '-'} \n  Duración: ${t.duracion || '-'} \n  Resultado: ${t.resultado || '-'} \n  Fecha: ${t.fecha_realizacion ? new Date(t.fecha_realizacion).toLocaleDateString() : '-'}`
                  ).join('\n');
                }
              }
            }
          },
          scales: {
            y: { 
              beginAtZero: true,
              ticks: { color: '#fff' }
            },
            x: { 
              ticks: { color: '#fff' }
            }
          }
        }
      });
    }

    // Metodologias Chart
    const metodologiasCtx = document.getElementById('metodologiasChart');
    if (metodologiasCtx) {
      new Chart(metodologiasCtx, {
        type: 'bar',
        data: {
          labels: metodologias.map(m => m.nombre),
          datasets: [{
            label: 'Número de Metodologías',
            data: metodologias.map(m => m.numero_modulos),
            backgroundColor: '#7d0f0fff',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { color: '#fff' }
            },
            tooltip: {
              callbacks: {
                afterBody: function(tooltipItems) {
                  const idx = tooltipItems[0].dataIndex;
                  const metodologia = metodologias[idx];
                  return [
                    `Descripción: ${metodologia.descripcion}`,
                    `Objetivos: ${metodologia.objetivos}`,
                    `Inicio: ${new Date(metodologia.fecha_inicio).toLocaleDateString()}`,
                    `Fin: ${new Date(metodologia.fecha_finalizacion).toLocaleDateString()}`
                  ];
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#fff' }
            },
            x: {
              ticks: { color: '#fff' }
            }
          }
        }
      });
    }
  }, [loading, estudiantes.length, docentes.length, talleres, metodologias]);

  // Add this useEffect after the initializeCharts definition
  useEffect(() => {
    if (!loading) {
      initializeCharts();
    }
    // Cleanup function
    return () => {
      ['userDistribution', 'talleresChart', 'metodologiasChart'].forEach(id => {
        const chart = Chart.getChart(id);
        if (chart) {
          chart.destroy();
        }
      });
    };
  }, [initializeCharts, loading]);

  // Memoize components
  const StatWidget = useMemo(() => ({ title, value, description, bgColor }) => (
    <div style={{
      padding: '5px',
      background: bgColor,
      borderRadius: '10px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h3 style={{ color: '#fff', marginBottom: '15px', fontSize: '18px' }}>{title}</h3>
      <p style={{ fontSize: '32px', color: '#fff', margin: '10px 0' }}>{value}</p>
      <p style={{ color: '#aaa', fontSize: '14px' }}>{description}</p>
    </div>
  ), []);

  const ChartWidget = useMemo(() => ({ title, id, bgColor, customHeight, customWidth }) => (
    <div style={{
      padding: '30px',
      background: bgColor,
      borderRadius: '10px',
      width: customWidth || '92%',
      height: customHeight || '350px'
    }}>
      <h3 style={{ color: '#fff', marginBottom: '15px' }}>{title}</h3>
      <div style={{ 
        width: '100%',
        height: customHeight ? `${parseInt(customHeight) - 80}px` : '220px',
        position: 'relative'
      }}>
        <canvas id={id} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  ), []);

  // Memoize grid layout
  const renderGrid = useMemo(() => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridAutoRows: 'minmax(100px, auto)',
      gap: '20px',
      padding: '20px',
      borderRadius: '15px',
    }}>
      {/* Stats Widgets */}
      <StatWidget
        title="Usuarios"
        value={userCount}
        description="Total de usuarios registrados"
        bgColor="rgba(4, 22, 70, 0.55)"
      />
      <StatWidget
        title="Estudiantes"
        value={estudiantes.length}
        description="Estudiantes activos"
        bgColor="rgba(4, 22, 70, 0.55)"
      />
      <StatWidget
        title="Docentes"
        value={docentes.length}
        description="Docentes registrados"
        bgColor="rgba(4, 22, 70, 0.55)"
      />
      <StatWidget
        title="Módulos"
        value={modulos.length}
        description="Módulos activos"
        bgColor="rgba(4, 22, 70, 0.55)"
      />

      {/* Chart Widgets with updated spans */}
      <div style={{ gridColumn: 'span 2' }}>
        <ChartWidget
          title="Distribución de Usuarios"
          id="userDistribution"
          bgColor="rgba(41, 98, 255, 0.2)"
        />
      </div>
      <div style={{ gridColumn: 'span 2' }}>
        <ChartWidget
          title="Distribución de Talleres por Tipo"
          id="talleresChart"
          bgColor="rgba(255, 152, 0, 0.2)"
        />
      </div>
      <div style={{ 
        gridColumn: 'span 4',
        minHeight: '500px' // Increased container height
      }}>
        <ChartWidget
          title="Metodologías"
          id="metodologiasChart"
          bgColor="rgba(153, 0, 8, 0.36)"
          customHeight="450px"
          customWidth="96%"
        />
      </div>
    </div>
  ), [userCount, estudiantes.length, docentes.length, modulos.length]);

  return (
    <div className="bg-gray-900 min-h-screen p-4">
      <h1 className="text-center text-3xl font-bold mb-6" style={{ color: "white", textShadow: "2px 2px 4px rgba(0, 0, 0, 1)" }}>
        Panel de Administración
      </h1>
      
      {error && (
        <div style={{ 
          backgroundColor: "rgba(244, 67, 54, 0.2)", 
          color: "#fff", 
          padding: "15px", 
          borderRadius: "8px",
          marginBottom: "20px",
          textAlign: "center"
        }}>
          Error: {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", color: "#fff", padding: "20px" }}>
          Cargando...
        </div>
      ) : renderGrid}
    </div>
  );
}

export default React.memo(Admin);