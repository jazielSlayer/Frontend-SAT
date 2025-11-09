import React, { useState, useEffect } from 'react';
import {
  getAllProyectos,
  getProyectoById,
  createProyecto,
  updateProyecto,
  deleteProyecto,
  searchProyectos
} from '../../../API/Admin/Proyecto';


const ProyectosView = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modales
  const [showDetails, setShowDetails] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Datos
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchFilters, setSearchFilters] = useState({});

  // Cargar proyectos
  useEffect(() => {
    loadProyectos();
  }, []);

  const loadProyectos = async () => {
    try {
      setLoading(true);
      const data = await getAllProyectos();
      setProyectos(data);
    } catch (err) {
      setError('Error al cargar proyectos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // === ESTADÍSTICAS EN TIEMPO REAL ===
  const stats = {
    total: proyectos.length,
    calificados: proyectos.filter(p => p.calificacion).length,
    enCurso: proyectos.filter(p => !p.calificacion).length,
    retrasados: proyectos.filter(p => {
      if (!p.fecha_entrega) return false;
      const entrega = new Date(p.fecha_entrega);
      return entrega < new Date() && !p.calificacion;
    }).length
  };

  // Abrir modal de detalles
  const openDetails = async (id) => {
    try {
      const proyecto = await getProyectoById(id);
      setSelectedProyecto(proyecto);
      setShowDetails(true);
    } catch (err) {
      alert('Error al cargar detalles');
    }
  };

  // Crear
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createProyecto(formData);
      setShowCreate(false);
      setFormData({});
      loadProyectos();
      alert('Proyecto creado');
    } catch (err) {
      alert(err.message || 'Error al crear');
    }
  };

  // Editar
  const openEdit = () => {
    setFormData(selectedProyecto);
    setShowEdit(true);
    setShowDetails(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProyecto(selectedProyecto.id, formData);
      setShowEdit(false);
      setFormData({});
      loadProyectos();
      alert('Proyecto actualizado');
    } catch (err) {
      alert(err.message || 'Error al actualizar');
    }
  };

  // Eliminar
  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar este proyecto?')) return;
    try {
      await deleteProyecto(selectedProyecto.id);
      setShowDetails(false);
      loadProyectos();
      alert('Proyecto eliminado');
    } catch (err) {
      alert(err.message || 'Error al eliminar');
    }
  };

  // Búsqueda
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const result = await searchProyectos(searchFilters);
      setProyectos(result.data || result);
      setShowSearch(false);
    } catch (err) {
      alert('No se encontraron resultados');
    }
  };

  if (loading) return <div className="loading">Cargando proyectos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="proyectos-container">
      <header className="proyectos-header">
        <h1 style={{padding: 15}}>Proyectos de Grado</h1>
        <div className="header-actions" style={{padding: 15}}>
          <button className="btn-search" onClick={() => setShowSearch(true)}>
            Buscar
          </button>
          <button className="btn-create" onClick={() => setShowCreate(true)}>
            + Nuevo Proyecto
          </button>
        </div>
      </header>

      <div className="stats-container">
        <div className="stat-card stat-total">
          <h4 className="stat-title">Total Proyectos</h4>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card stat-completed">
          <h4 className="stat-title">Calificados</h4>
          <p className="stat-value">{stats.calificados}</p>
        </div>
        <div className="stat-card stat-pending">
          <h4 className="stat-title">En Curso</h4>
          <p className="stat-value">{stats.enCurso}</p>
        </div>
        <div className="stat-card stat-overdue">
          <h4 className="stat-title">Retrasados</h4>
          <p className="stat-value">{stats.retrasados}</p>
        </div>
      </div>

      

      {/* === GRID DE PROYECTOS === */}
      <div className="proyectos-grid">
        {proyectos.length === 0 ? (
          <p className="no-data">No hay proyectos registrados</p>
        ) : (
          proyectos.map((proyecto) => (
            <div
              key={proyecto.id}
              className="proyecto-card"
              onClick={() => openDetails(proyecto.id)}
            >
              <div className="card-header">
                <h3>{proyecto.titulo}</h3>
                <span className={`status ${proyecto.calificacion ? 'completed' : 'pending'}`}>
                  {proyecto.calificacion ? `Calif: ${proyecto.calificacion}` : 'En curso'}
                </span>
              </div>
              <div className="card-body">
                <p><strong>Estudiante:</strong> {proyecto.estudiante_nombres} {proyecto.estudiante_apellidopat}</p>
                <p><strong>Área:</strong> {proyecto.area_conocimiento}</p>
                <p><strong>Entrega:</strong> {proyecto.fecha_entrega || 'Sin fecha'}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* === MODAL DETALLES === */}
      {showDetails && selectedProyecto && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedProyecto.titulo}</h2>
            <div className="modal-grid">
              <div>
                <p><strong>ID:</strong> {selectedProyecto.id}</p>
                <p><strong>Estudiante:</strong> {selectedProyecto.estudiante_nombres} {selectedProyecto.estudiante_apellidopat} {selectedProyecto.estudiante_apellidomat}</p>
                <p><strong>Matrícula:</strong> {selectedProyecto.numero_matricula}</p>
                <p><strong>Guía:</strong> {selectedProyecto.guia_nombres} ({selectedProyecto.guia_numero_item})</p>
                <p><strong>Revisor:</strong> {selectedProyecto.revisor_nombres} ({selectedProyecto.revisor_numero_item})</p>
              </div>
              <div>
                <p><strong>Línea:</strong> {selectedProyecto.linea_investigacion}</p>
                <p><strong>Área:</strong> {selectedProyecto.area_conocimiento}</p>
                <p><strong>Calificación:</strong> {selectedProyecto.calificacion || 'Sin calificar'}</p>
                <p><strong>Entrega:</strong> {selectedProyecto.fecha_entrega}</p>
                <p><strong>Defensa:</strong> {selectedProyecto.fecha_defensa || 'No programada'}</p>
              </div>
            </div>
            {selectedProyecto.resumen && (
              <div className="resumen">
                <p><strong>Resumen:</strong></p>
                <p>{selectedProyecto.resumen}</p>
              </div>
            )}
            <div className="modal-actions">
              <button className="btn-edit" onClick={openEdit}>Editar</button>
              <button className="btn-delete" onClick={handleDelete}>Eliminar</button>
              <button className="btn-close" onClick={() => setShowDetails(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* === MODAL CREAR === */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Crear Proyecto</h2>
            <form onSubmit={handleCreate}>
              <input className='InputProyecto' placeholder="Título" onChange={(e) => setFormData({...formData, titulo: e.target.value})} required />
              <input className='InputProyecto' placeholder="Línea de investigación" onChange={(e) => setFormData({...formData, linea_investigacion: e.target.value})} required />
              <input className='InputProyecto' placeholder="Área de conocimiento" onChange={(e) => setFormData({...formData, area_conocimiento: e.target.value})} required />
              <input className='InputProyecto' placeholder="ID Estudiante" type="number" onChange={(e) => setFormData({...formData, id_estudiante: e.target.value})} required />
              <input className='InputProyecto' placeholder="ID Docente Guía" type="number" onChange={(e) => setFormData({...formData, id_docente_guia: e.target.value})} required />
              <input className='InputProyecto' placeholder="ID Docente Revisor" type="number" onChange={(e) => setFormData({...formData, id_docente_revisor: e.target.value})} required />
              <input className='InputProyecto' placeholder="Fecha entrega (YYYY-MM-DD)" onChange={(e) => setFormData({...formData, fecha_entrega: e.target.value})} required />
              <div className="modal-actions">
                <button type="submit" className="btn-create">Crear</button>
                <button type="button" className="btn-close" onClick={() => setShowCreate(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* === MODAL EDITAR === */}
      {showEdit && (
        <div className="modal-overlay" onClick={() => setShowEdit(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Editar Proyecto</h2>
            <form onSubmit={handleUpdate}>
              <input className='InputProyecto' value={formData.titulo || ''} onChange={(e) => setFormData({...formData, titulo: e.target.value})} required />
              <input className='InputProyecto' value={formData.linea_investigacion || ''} onChange={(e) => setFormData({...formData, linea_investigacion: e.target.value})} />
              <input className='InputProyecto' value={formData.area_conocimiento || ''} onChange={(e) => setFormData({...formData, area_conocimiento: e.target.value})} />
              <input className='InputProyecto' value={formData.calificacion || ''} onChange={(e) => setFormData({...formData, calificacion: e.target.value})} />
              <input  className='InputProyecto'value={formData.fecha_entrega || ''} onChange={(e) => setFormData({...formData, fecha_entrega: e.target.value})} />
              <div className="modal-actions">
                <button type="submit" className="btn-edit">Guardar</button>
                <button type="button" className="btn-close" onClick={() => setShowEdit(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* === MODAL BUSCAR === */}
      {showSearch && (
        <div className="modal-overlay" onClick={() => setShowSearch(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Buscar Proyectos</h2>
            <form onSubmit={handleSearch}>
              <input className='InputProyecto' placeholder="Título" onChange={(e) => setSearchFilters({...searchFilters, titulo: e.target.value})} />
              <input className='InputProyecto' placeholder="Área de conocimiento" onChange={(e) => setSearchFilters({...searchFilters, area_conocimiento: e.target.value})} />
              <input className='InputProyecto' placeholder="Estudiante" onChange={(e) => setSearchFilters({...searchFilters, estudiante: e.target.value})} />
              <div className="modal-actions">
                <button type="submit" className="btn-search">Buscar</button>
                <button type="button" className="btn-close" onClick={() => setShowSearch(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProyectosView;