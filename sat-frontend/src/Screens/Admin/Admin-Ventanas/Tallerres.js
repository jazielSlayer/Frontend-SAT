import React, { useState, useEffect } from 'react';
import {
  getAllTalleres,
  getTaller,
  createTaller,
  updateTaller,
  //deleteTaller
} from '../../../API/Admin/Taller';
import { getAllMetodologias } from '../../../API/Admin/Metodologia.js';

const Talleres = () => {
  const [talleres, setTalleres] = useState([]);
  const [metodologias, setMetodologias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const getMetodologiaNombre = (id) => {
    const metodologia = metodologias.find(m => m.id === id);
    return metodologia ? metodologia.nombre : 'Desconocida';
  };

  const filteredTalleres = talleres.filter((taller) => {
    const searchLower = searchTerm.toLowerCase();
    const titulo = (taller.titulo || "").toLowerCase();
    const tipoTaller = (taller.tipo_taller || "").toLowerCase();
    const metodologiaNombre = getMetodologiaNombre(taller.id_metodologia).toLowerCase();
    const resultado = (taller.resultado || "").toLowerCase();
    
    return titulo.includes(searchLower) || 
           tipoTaller.includes(searchLower) || 
           metodologiaNombre.includes(searchLower) ||
           resultado.includes(searchLower);
  });

  // Modales
  const [showDetails, setShowDetails] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // Datos
  const [selectedTaller, setSelectedTaller] = useState(null);
  const [formData, setFormData] = useState({});

  // === CARGAR DATOS INICIALES ===
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [talleresData, metodologiasData] = await Promise.all([
          getAllTalleres(),
          getAllMetodologias()
        ]);
        const talleresArray = Array.isArray(talleresData) ? talleresData : (talleresData?.data || []);
        const metodologiasArray = Array.isArray(metodologiasData) ? metodologiasData : (metodologiasData?.data || []);
        setTalleres(talleresArray);
        setMetodologias(metodologiasArray);
      } catch (err) {
        setError('Error al cargar datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  

  const uniqueTipos = [...new Set(talleres.map(t => t.tipo_taller).filter(Boolean))];

  const stats = {
    total: talleres.length,
    tiposUnicos: uniqueTipos.length,
    metodologias: metodologias.length,
    evaluados: talleres.filter(t => t.evaluacion_final).length,
  };

  // === HANDLERS ===
  const loadTalleres = async () => {
    try {
      const data = await getAllTalleres();
      const talleresArray = Array.isArray(data) ? data : (data?.data || []);
      setTalleres(talleresArray);
    } catch (err) {
      console.error(err);
    }
  };

  const openDetails = async (id) => {
    try {
      const tallerResponse = await getTaller(id);
      const taller = tallerResponse.data || tallerResponse;
      setSelectedTaller(taller);
      setShowDetails(true);
    } catch (err) {
      alert('Error al cargar detalles');
    }
  };

  const openEdit = () => {
    setFormData({
      ...selectedTaller,
      id_metodologia: selectedTaller.id_metodologia,
      fecha_realizacion: selectedTaller.fecha_realizacion?.split('T')[0] || '',
    });
    setShowEdit(true);
    setShowDetails(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createTaller(formData);
      setShowCreate(false);
      setFormData({});
      await loadTalleres();
      alert('Taller creado');
    } catch (err) {
      alert(err.message || 'Error al crear');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateTaller(selectedTaller.id, formData);
      setShowEdit(false);
      setFormData({});
      await loadTalleres();
      alert('Taller actualizado');
    } catch (err) {
      alert(err.message || 'Error al actualizar');
    }
  };

 /* const handleDelete = async () => {
    if (!window.confirm('¿Eliminar este taller?')) return;
    try {
      await deleteTaller(selectedTaller.id);
      setShowDetails(false);
      await loadTalleres();
      alert('Taller eliminado');
    } catch (err) {
      alert(err.message || 'Error al eliminar');
    }
  }; */

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="proyectos-container">
      <header className="proyectos-header">
        <h1 >Gestión de Talleres</h1>
        <div className="header-actions" >
          <div className="search-container">
            <button 
              className="search-toggle-btn"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label="Toggle search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
            
            <input
              type="text"
              placeholder="Buscar por título, tipo, metodología o resultado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`search-input ${isExpanded ? 'expanded' : ''}`}
            />
          </div>
          <button className="btn-create" onClick={() => setShowCreate(true)}>+ Nuevo Taller</button>
        </div>
      </header>
      
      <div className="stats-container">
        <div className="stat-card stat-total"><h4>Total Talleres</h4><p>{stats.total}</p></div>
        <div className="stat-card stat-completed"><h4>Tipos Únicos</h4><p>{stats.tiposUnicos}</p></div>
        <div className="stat-card stat-pending"><h4>Metodologías</h4><p>{stats.metodologias}</p></div>
        <div className="stat-card stat-overdue"><h4>Evaluados</h4><p>{stats.evaluados}</p></div>
      </div>
      <div className="proyectos-grid">
        {filteredTalleres.length === 0 ? (
          <div className="no-data full-width">
            {searchTerm === "" 
              ? "No hay talleres registrados" 
              : `No se encontraron talleres que coincidan con "${searchTerm}"`
            }
          </div>
        ) : (
          filteredTalleres.map((taller) => (
            <div 
              key={taller.id} 
              className="proyecto-card" 
              onClick={() => openDetails(taller.id)}
            >
              <div className="card-header">
                <h3>{taller.titulo}</h3>
                <span className={`status ${taller.evaluacion_final ? 'completed' : 'pending'}`}>
                  {taller.evaluacion_final ? ` ${taller.evaluacion_final}` : 'Pendiente'}
                </span>
              </div>
              <div className="card-body">
                <p><strong>Tipo:</strong> {taller.tipo_taller}</p>
                <p><strong>Metodología:</strong> {getMetodologiaNombre(taller.id_metodologia)}</p>
                <p><strong>Fecha:</strong> {new Date(taller.fecha_realizacion).toLocaleDateString('es-ES')}</p>
              </div>
            </div>
          ))
        )}
      </div>
      {/* MODAL DETALLES */}
      {showDetails && selectedTaller && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{selectedTaller.titulo}</h2>
            <div className="modal-grid">
              <div>
                <p><strong>Tipo:</strong> {selectedTaller.tipo_taller}</p>
                <p><strong>Metodología:</strong> {getMetodologiaNombre(selectedTaller.id_metodologia)}</p>
                <p><strong>Duración:</strong> {selectedTaller.duracion || 'No especificada'}</p>
              </div>
              <div>
                <p><strong>Resultado:</strong> {selectedTaller.resultado || 'Pendiente'}</p>
                <p><strong>Evaluación Final:</strong> {selectedTaller.evaluacion_final || 'Sin evaluar'}</p>
                <p><strong>Fecha de Realización:</strong> {new Date(selectedTaller.fecha_realizacion).toLocaleDateString('es-ES')}</p>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-edit" onClick={openEdit}>Editar</button>
              { /*<button className="btn-delete" onClick={handleDelete}>Eliminar</button> */}
              <button className="btn-close" onClick={() => setShowDetails(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAR */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Crear Taller</h2>
            <form onSubmit={handleCreate}>
              <div className="form-full">
                <input className="InputProyecto" placeholder="Título" onChange={e => setFormData({...formData, titulo: e.target.value})} required />
              </div>

              <div className="form-row">
                <select className="InputProyecto" onChange={e => setFormData({...formData, id_metodologia: e.target.value})} required>
                  <option value="">Seleccione metodología</option>
                  {metodologias.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
                <select className="InputProyecto" onChange={e => setFormData({...formData, tipo_taller: e.target.value})} required>
                  <option value="">Seleccione tipo</option>
                  <option value="Teórico">Teórico</option>
                  <option value="Práctico">Práctico</option>
                  <option value="Mixto">Mixto</option>
                </select>
              </div>

              <div className="form-row form-row-3">
                <input className="InputProyecto" type="date" placeholder="Fecha de realización" onChange={e => setFormData({...formData, fecha_realizacion: e.target.value})} required />
                <input className="InputProyecto" placeholder="Duración (ej: 4 horas)" onChange={e => setFormData({...formData, duracion: e.target.value})} />
                <input className="InputProyecto" placeholder="Resultado" onChange={e => setFormData({...formData, resultado: e.target.value})} />
                <input className="InputProyecto" placeholder="Evaluación final" onChange={e => setFormData({...formData, evaluacion_final: e.target.value})} />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-create">Crear</button>
                <button type="button" className="btn-close" onClick={() => setShowCreate(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {showEdit && (
        <div className="modal-overlay" onClick={() => setShowEdit(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Editar Taller</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-full">
                <input className="InputProyecto" value={formData.titulo || ''} onChange={e => setFormData({...formData, titulo: e.target.value})} required />
              </div>

              <div className="form-row">
                <select className="InputProyecto" value={formData.id_metodologia || ''} onChange={e => setFormData({...formData, id_metodologia: e.target.value})} required>
                  <option value="">Seleccione metodología</option>
                  {metodologias.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
                <select className="InputProyecto" value={formData.tipo_taller || ''} onChange={e => setFormData({...formData, tipo_taller: e.target.value})} required>
                  <option value="">Seleccione tipo</option>
                  <option value="Teórico">Teórico</option>
                  <option value="Práctico">Práctico</option>
                  <option value="Mixto">Mixto</option>
                </select>
              </div>

              <div className="form-row form-row-3">
                <input className="InputProyecto" type="date" value={formData.fecha_realizacion || ''} onChange={e => setFormData({...formData, fecha_realizacion: e.target.value})} required />
                <input className="InputProyecto" value={formData.duracion || ''} onChange={e => setFormData({...formData, duracion: e.target.value})} />
                <input className="InputProyecto" value={formData.resultado || ''} onChange={e => setFormData({...formData, resultado: e.target.value})} />
                <input className="InputProyecto" value={formData.evaluacion_final || ''} onChange={e => setFormData({...formData, evaluacion_final: e.target.value})} />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-edit">Guardar Cambios</button>
                <button type="button" className="btn-close" onClick={() => setShowEdit(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Talleres;