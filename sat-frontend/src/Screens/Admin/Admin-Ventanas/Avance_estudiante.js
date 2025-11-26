import React, { useState, useEffect } from 'react';
import {
  getAvancesProcentaje,
  createAvance,
  updateAvance,
} from '../../../API/Admin/Avance_Estudiante.js';
import { getEstudiantes } from '../../../API/Admin/Estudiante_admin.js';

const AvancesEstudiantesView = () => {
  const [avancesResumen, setAvancesResumen] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modales
  const [showDetails, setShowDetails] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [formData, setFormData] = useState({
    id_estudiante: "",
    id_modulo: "",
    responsable: "",
    fecha: new Date().toISOString().split('T')[0],
    estado: "pendiente"
  });

  // Búsqueda en select
  const [estSearch, setEstSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Usa getAvancesProcentaje() del archivo Avance_Estudiante.js
      const [resumenData, estudiantesData] = await Promise.all([
        getAvancesProcentaje(), // ← Esta función viene de tu API
        getEstudiantes()
      ]);
      
      // La respuesta de getAvancesProcentaje() es: { success: true, data: [...], total_estudiantes: N }
      console.log('Datos de resumen:', resumenData); // Para debug
      setAvancesResumen(resumenData.data || []);
      setEstudiantes(estudiantesData || []);
    } catch (err) {
      setError('Error al cargar datos de avances');
      console.error('Error detallado:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAvances = avancesResumen.filter(av => {
    const search = searchTerm.toLowerCase();
    const nombre = (av.nombre_completo || "").toLowerCase();
    const ru = (av.ru || "").toString();
    
    return nombre.includes(search) || ru.includes(search);
  });

  // Estadísticas globales
  const stats = {
    totalEstudiantes: avancesResumen.length,
    promedioAvance: avancesResumen.length > 0 
      ? (avancesResumen.reduce((sum, est) => sum + parseFloat(est.porcentaje_avance || 0), 0) / avancesResumen.length).toFixed(1)
      : 0,
    estudiantesCompletados: avancesResumen.filter(e => parseFloat(e.porcentaje_avance) === 100).length,
    estudiantesEnProgreso: avancesResumen.filter(e => parseFloat(e.porcentaje_avance) > 0 && parseFloat(e.porcentaje_avance) < 100).length
  };

  const openDetails = (estudiante) => {
    setSelectedEstudiante(estudiante);
    setShowDetails(true);
  };

  const openEdit = () => {
    setFormData({
      id_estudiante: selectedEstudiante.id_estudiante || "",
      id_modulo: "",
      responsable: "",
      fecha: new Date().toISOString().split('T')[0],
      estado: "pendiente"
    });
    setShowEdit(true);
    setShowDetails(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createAvance(formData);
      setShowCreate(false);
      setFormData({ 
        id_estudiante: "", 
        id_modulo: "", 
        responsable: "", 
        fecha: new Date().toISOString().split('T')[0], 
        estado: "pendiente"
      });
      setEstSearch("");
      loadData();
      alert("Avance registrado exitosamente");
    } catch (err) {
      alert(err.message || "Error al crear avance");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateAvance(selectedEstudiante.id_estudiante, formData);
      setShowEdit(false);
      loadData();
      alert("Avance actualizado");
    } catch (err) {
      alert(err.message || "Error al actualizar");
    }
  };

  const getProgressColor = (porcentaje) => {
    const pct = parseFloat(porcentaje);
    if (pct >= 75) return "#34d399"; // Verde
    if (pct >= 50) return "#fbbf24"; // Amarillo
    if (pct >= 25) return "#fb923c"; // Naranja
    return "#ef4444"; // Rojo
  };

  if (loading) return <div className="loading">Cargando avances...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="proyectos-container">
      <header className="proyectos-header">
        <h1 style={{ padding: 15 }}>Avances de Estudiantes</h1>
        <div className="header-actions" style={{ padding: 15 }}>
          <button className="btn-create" onClick={() => setShowCreate(true)}>
            + Registrar Avance
          </button>
        </div>
      </header>

      {/* BUSCADOR */}
      <div style={{ marginBottom: "20px", padding: "0 15px" }}>
        <input
          type="text"
          placeholder="Buscar por nombre o RU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="InputProyecto"
          style={{ width: "100%", maxWidth: "500px", padding: "12px 16px", fontSize: "14px" }}
        />
      </div>

      {/* ESTADÍSTICAS */}
      <div className="stats-container">
        <div className="stat-card stat-total">
          <h4>Total Estudiantes</h4>
          <p>{stats.totalEstudiantes}</p>
        </div>
        <div className="stat-card stat-completed">
          <h4>Promedio General</h4>
          <p>{stats.promedioAvance}%</p>
        </div>
        <div className="stat-card stat-pending">
          <h4>Completados (100%)</h4>
          <p>{stats.estudiantesCompletados}</p>
        </div>
        <div className="stat-card stat-overdue">
          <h4>En Progreso</h4>
          <p>{stats.estudiantesEnProgreso}</p>
        </div>
      </div>

      {/* GRID DE TARJETAS POR ESTUDIANTE */}
      <div className="proyectos-grid">
        {filteredAvances.length === 0 ? (
          <div className="no-data full-width">
            {searchTerm === "" ? "No hay estudiantes con avances registrados" : `No se encontraron estudiantes para "${searchTerm}"`}
          </div>
        ) : (
          filteredAvances.map((estudiante) => {
            const porcentaje = parseFloat(estudiante.porcentaje_avance || 0);
            const progressColor = getProgressColor(porcentaje);
            
            return (
              <div key={estudiante.id_estudiante} className="proyecto-card" onClick={() => openDetails(estudiante)}>
                <div className="card-header">
                  <h3>{estudiante.nombre_completo}</h3>
                  <span className="status" style={{ 
                    backgroundColor: progressColor + "30", 
                    color: progressColor,
                    fontWeight: "bold"
                  }}>
                    {porcentaje.toFixed(1)}%
                  </span>
                </div>
                
                {/* Barra de progreso */}
                <div style={{ 
                  width: "100%", 
                  height: "8px", 
                  backgroundColor: "#e5e7eb", 
                  borderRadius: "4px",
                  margin: "12px 0",
                  overflow: "hidden"
                }}>
                  <div style={{
                    width: `${porcentaje}%`,
                    height: "100%",
                    backgroundColor: progressColor,
                    transition: "width 0.3s ease"
                  }}></div>
                </div>

                <div className="card-body">
                  <p><strong>RU:</strong> {estudiante.ru || "—"}</p>
                  <p><strong>Total Módulos:</strong> {estudiante.total_modulos || 0}</p>
                  <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                    <span style={{ fontSize: "12px", color: "#34d399" }}>
                      ✓ {estudiante.modulos_completados || 0} completados
                    </span>
                    <span style={{ fontSize: "12px", color: "#fbbf24" }}>
                      ⟳ {estudiante.modulos_en_progreso || 0} en progreso
                    </span>
                    <span style={{ fontSize: "12px", color: "#ef4444" }}>
                      ○ {estudiante.modulos_pendientes || 0} pendientes
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL DETALLES */}
      {showDetails && selectedEstudiante && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Detalles - {selectedEstudiante.nombre_completo}</h2>
            
            {/* Contenedor principal con gráfico circular */}
            <div style={{ 
              display: "flex", 
              gap: "30px", 
              alignItems: "center",
              marginTop: "20px",
              marginBottom: "20px",
              flexWrap: "wrap"
            }}>
              {/* GRÁFICO CIRCULAR */}
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center",
                minWidth: "200px"
              }}>
                <svg width="180" height="180" style={{ transform: "rotate(-90deg)" }}>
                  {/* Círculo de fondo */}
                  <circle
                    cx="90"
                    cy="90"
                    r="70"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="16"
                  />
                  {/* Círculo de progreso */}
                  <circle
                    cx="90"
                    cy="90"
                    r="70"
                    fill="none"
                    stroke={getProgressColor(selectedEstudiante.porcentaje_avance)}
                    strokeWidth="16"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - parseFloat(selectedEstudiante.porcentaje_avance) / 100)}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.5s ease" }}
                  />
                  {/* Texto central */}
                  <text
                    x="90"
                    y="90"
                    textAnchor="middle"
                    dy="8"
                    fontSize="32"
                    fontWeight="bold"
                    fill={getProgressColor(selectedEstudiante.porcentaje_avance)}
                    style={{ transform: "rotate(90deg)", transformOrigin: "90px 90px" }}
                  >
                    {parseFloat(selectedEstudiante.porcentaje_avance).toFixed(1)}%
                  </text>
                </svg>
                <p style={{ 
                  marginTop: "12px", 
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#6b7280"
                }}>
                  Progreso General
                </p>
              </div>

              {/* INFORMACIÓN DEL ESTUDIANTE */}
              <div style={{ flex: 1, minWidth: "250px" }}>
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "#374151" }}>
                    Información Personal
                  </h3>
                  <p style={{ marginBottom: "8px" }}><strong>RU:</strong> {selectedEstudiante.ru || "—"}</p>
                  <p style={{ marginBottom: "8px" }}><strong>Email:</strong> {selectedEstudiante.correo || "—"}</p>
                  <p style={{ marginBottom: "8px" }}><strong>Teléfono:</strong> {selectedEstudiante.telefono || "—"}</p>
                </div>

                {/* <div>
                  <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "#374151" }}>
                    Estadísticas de Módulos
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      backgroundColor: "#062544ff",
                      borderRadius: "6px"
                    }}>
                      <span>Total Módulos:</span>
                      <strong>{selectedEstudiante.total_modulos || 0}</strong>
                    </div>
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      backgroundColor: "#0c277eff",
                      borderRadius: "6px"
                    }}>
                      <span>✓ Completados:</span>
                      <strong style={{ color: "#34d399" }}>{selectedEstudiante.modulos_completados || 0}</strong>
                    </div>
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      backgroundColor: "#150b89ff",
                      borderRadius: "6px"
                    }}>
                      <span>⟳ En Progreso:</span>
                      <strong style={{ color: "#fbbf24" }}>{selectedEstudiante.modulos_en_progreso || 0}</strong>
                    </div>
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      backgroundColor: "#130d93ff",
                      borderRadius: "6px"
                    }}>
                      <span>○ Pendientes:</span>
                      <strong style={{ color: "#ef4444" }}>{selectedEstudiante.modulos_pendientes || 0}</strong>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-edit" onClick={openEdit}>Agregar Avance</button>
              <button className="btn-close" onClick={() => setShowDetails(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAR */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Registrar Nuevo Avance</h2>
            <form onSubmit={handleCreate}>
              <div className="form-full">
                <input
                  type="text"
                  placeholder="Buscar estudiante..."
                  value={estSearch}
                  onChange={(e) => setEstSearch(e.target.value)}
                  className="InputProyecto"
                  style={{ marginBottom: "10px" }}
                />
                <select 
                  className="InputProyecto" 
                  value={formData.id_estudiante} 
                  onChange={(e) => setFormData({...formData, id_estudiante: e.target.value})}
                  required
                >
                  <option value="">Seleccionar estudiante</option>
                  {estudiantes
                    .filter(e => `${e.nombres} ${e.apellidopat} ${e.apellidomat} ${e.ru || ''}`
                      .toLowerCase()
                      .includes(estSearch.toLowerCase()))
                    .map(est => (
                      <option key={est.id} value={est.id}>
                        {est.nombres} {est.apellidopat} {est.apellidomat || ''} - RU: {est.ru}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-row">
                <input 
                  className="InputProyecto" 
                  placeholder="ID Módulo" 
                  value={formData.id_modulo} 
                  onChange={(e) => setFormData({...formData, id_modulo: e.target.value})} 
                  required 
                />
                <input 
                  className="InputProyecto" 
                  placeholder="Responsable" 
                  value={formData.responsable} 
                  onChange={(e) => setFormData({...formData, responsable: e.target.value})} 
                />
              </div>

              <div className="form-row">
                <input 
                  className="InputProyecto" 
                  type="date" 
                  value={formData.fecha} 
                  onChange={(e) => setFormData({...formData, fecha: e.target.value})} 
                  required 
                />
                <select 
                  className="InputProyecto" 
                  value={formData.estado} 
                  onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  required
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en progreso">En progreso</option>
                  <option value="completado">Completado</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-create">Registrar Avance</button>
                <button type="button" className="btn-close" onClick={() => {
                  setShowCreate(false);
                  setEstSearch("");
                  setFormData({ 
                    id_estudiante: "", 
                    id_modulo: "", 
                    responsable: "", 
                    fecha: new Date().toISOString().split('T')[0], 
                    estado: "pendiente"
                  });
                }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR (Agregar avance a estudiante seleccionado) */}
      {showEdit && (
        <div className="modal-overlay" onClick={() => setShowEdit(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Agregar Avance - {selectedEstudiante?.nombre_completo}</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-row">
                <input 
                  className="InputProyecto" 
                  placeholder="ID Módulo"
                  value={formData.id_modulo} 
                  onChange={(e) => setFormData({...formData, id_modulo: e.target.value})} 
                  required 
                />
                <input 
                  className="InputProyecto" 
                  placeholder="Responsable"
                  value={formData.responsable} 
                  onChange={(e) => setFormData({...formData, responsable: e.target.value})} 
                />
              </div>

              <div className="form-row">
                <input 
                  className="InputProyecto" 
                  type="date" 
                  value={formData.fecha} 
                  onChange={(e) => setFormData({...formData, fecha: e.target.value})} 
                  required 
                />
                <select 
                  className="InputProyecto" 
                  value={formData.estado} 
                  onChange={(e) => setFormData({...formData, estado: e.target.value})} 
                  required
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en progreso">En progreso</option>
                  <option value="completado">Completado</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-edit">Guardar Avance</button>
                <button type="button" className="btn-close" onClick={() => setShowEdit(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvancesEstudiantesView;