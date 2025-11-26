import React, { useState, useEffect } from "react";
import { AiFillEdit } from "react-icons/ai";
import { getEstudiantes, createEstudiante, updateEstudiante } from "../../../API/Admin/Estudiante_admin";
import { getAllPersonas } from "../../../API/Admin/Persona";
import { getAllProgramas } from "../../../API/Admin/Programa_Academico";
import { EstudianteStyles } from "../../Components screens/Styles";
import { styles } from "../../Components screens/Styles";

function AdminEstudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Búsqueda en selectores
  const [personaSearch, setPersonaSearch] = useState("");
  const [programaSearch, setProgramaSearch] = useState("");
  
  // Modales
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  
  // Datos
  const [editingEstudiante, setEditingEstudiante] = useState(null);
  const [formData, setFormData] = useState({
    per_id: "",
    id_programa_academico: "",
    ru: "",
    fecha_inscripcion: "",
    estado: 1,
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [estudiantesData, personasData, programasData] = await Promise.all([
        getEstudiantes(),
        getAllPersonas(),
        getAllProgramas()
      ]);
      setEstudiantes(estudiantesData);
      setPersonas(personasData);
      setProgramas(programasData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.per_id) {
      errors.per_id = "Debe seleccionar una persona";
    }
    if (!data.id_programa_academico) {
      errors.id_programa_academico = "Debe seleccionar un programa académico";
    }
    
    const ru = String(data.ru || "").trim();
    if (!ru) {
      errors.ru = "El número de matrícula es obligatorio";
    }
    
    if (!data.fecha_inscripcion) {
      errors.fecha_inscripcion = "La fecha de inscripción es obligatoria";
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const openCreate = () => {
    setFormData({
      per_id: "",
      id_programa_academico: "",
      ru: "",
      fecha_inscripcion: "",
      estado: 1,
    });
    setFormErrors({});
    setPersonaSearch("");
    setProgramaSearch("");
    setShowCreate(true);
  };

 const openEdit = (estudiante) => {
  setEditingEstudiante(estudiante);
  
  // Formatear la fecha correctamente
  let fechaFormateada = "";
  if (estudiante.fecha_inscripcion) {
    try {
      // Opción 1: Split simple
      fechaFormateada = estudiante.fecha_inscripcion.split('T')[0].split(' ')[0];
      
      // Opción 2: Usar Date (más seguro si viene en diferentes formatos)
      // const fecha = new Date(estudiante.fecha_inscripcion);
      // fechaFormateada = fecha.toISOString().split('T')[0];
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      fechaFormateada = "";
    }
  }
  
  setFormData({
    per_id: estudiante.per_id,
    id_programa_academico: estudiante.id_programa_academico,
    ru: estudiante.ru,
    fecha_inscripcion: fechaFormateada,
    estado: estudiante.estado,
  });
  setFormErrors({});
  setPersonaSearch("");
  setProgramaSearch("");
  setShowEdit(true);
};

  const handleCreate = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setOperationLoading(true);
    setError(null);
    try {
      await createEstudiante(formData);
      setShowCreate(false);
      setFormData({
        per_id: "",
        id_programa_academico: "",
        ru: "",
        fecha_inscripcion: "",
        estado: 1,
      });
      setPersonaSearch("");
      setProgramaSearch("");
      await fetchAllData();
      alert("Estudiante creado exitosamente");
    } catch (err) {
      setError(err.message || "Error al crear el estudiante");
      alert(err.message || "Error al crear el estudiante");
    } finally {
      setOperationLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setOperationLoading(true);
    setError(null);
    try {
      await updateEstudiante(editingEstudiante.id, formData);
      setShowEdit(false);
      setEditingEstudiante(null);
      setFormData({
        per_id: "",
        id_programa_academico: "",
        ru: "",
        fecha_inscripcion: "",
        estado: 1,
      });
      setPersonaSearch("");
      setProgramaSearch("");
      await fetchAllData();
      alert("Estudiante actualizado exitosamente");
    } catch (err) {
      setError(err.message || "Error al actualizar el estudiante");
      alert(err.message || "Error al actualizar el estudiante");
    } finally {
      setOperationLoading(false);
    }
  };

  // Filtrar personas por búsqueda
  const filteredPersonas = personas.filter(persona => {
    const search = personaSearch.toLowerCase();
    const nombreCompleto = `${persona.nombres} ${persona.apellidopat || ''} ${persona.apellidomat || ''}`.toLowerCase();
    const carnet = String(persona.carnet || "").toLowerCase();
    return nombreCompleto.includes(search) || carnet.includes(search);
  });

  // Filtrar programas por búsqueda
  const filteredProgramas = programas.filter(programa => {
    const search = programaSearch.toLowerCase();
    const nombre = (programa.nombre_programa || "").toLowerCase();
    const codigo = (programa.codigo || "").toLowerCase();
    return nombre.includes(search) || codigo.includes(search);
  });

  // Función para filtrar estudiantes por nombre y matrícula
  const filteredEstudiantes = estudiantes.filter((estudiante) => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${estudiante.nombres} ${estudiante.apellidopat} ${estudiante.apellidomat}`.toLowerCase();
    const registro = String(estudiante.ru || "").toLowerCase();
    
    return fullName.includes(searchLower) || registro.includes(searchLower);
  });

  return (
    <div className="proyectos-container">
      <header className="proyectos-header">
        <h2 style={EstudianteStyles.title}>Administración de Estudiantes</h2>
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
              placeholder="Buscar por nombre o ru..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`search-input ${isExpanded ? 'expanded' : ''}`}
            />
          </div>
          
          <button className="btn-create" onClick={openCreate}>+ Nuevo Estudiante</button>
        </div>
      </header>
      

      {loading && <p style={EstudianteStyles.loadingText}>Cargando estudiantes...</p>}
      {error && <div style={EstudianteStyles.errorMessage}>Error: {error}</div>}

      {!loading && !error && (
        <div>
          <div className="stats-container">
            <div style={{ ...EstudianteStyles.statCard, ...EstudianteStyles.statCardTotal }}>
              <h4 style={{ ...EstudianteStyles.statTitle, ...EstudianteStyles.statTitleTotal }}>
                Total Estudiantes
              </h4>
              <p style={EstudianteStyles.statValue}>{estudiantes.length}</p>
            </div>

            <div style={{ ...EstudianteStyles.statCard, ...EstudianteStyles.statCardActive }}>
              <h4 style={{ ...EstudianteStyles.statTitle, ...EstudianteStyles.statTitleActive }}>
                Estudiantes Activos
              </h4>
              <p style={EstudianteStyles.statValue}>
                {estudiantes.filter((e) => e.estado === 1).length}
              </p>
            </div>

            <div style={{ ...EstudianteStyles.statCard, ...EstudianteStyles.statCardInactive }}>
              <h4 style={{ ...EstudianteStyles.statTitle, ...EstudianteStyles.statTitleInactive }}>
                Inactivos
              </h4>
              <p style={EstudianteStyles.statValue}>
                {estudiantes.filter((e) => e.estado === 0).length}
              </p>
            </div>
          </div>

          

          <div style={EstudianteStyles.tableContainer}>
            <table style={EstudianteStyles.table}>
              <thead style={EstudianteStyles.tableHead}>
                <tr>
                  <th style={EstudianteStyles.tableHeader}>Nombre Completo</th>
                  <th style={EstudianteStyles.tableHeader}>R.U.</th>
                  <th style={EstudianteStyles.tableHeader}>Programa</th>
                  <th style={EstudianteStyles.tableHeader}>Fecha Inscripción</th>
                  <th style={EstudianteStyles.tableHeader}>Estado</th>
                  <th style={EstudianteStyles.tableHeaderCenter}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredEstudiantes.length > 0 ? (
                  filteredEstudiantes.map((estudiante, index) => (
                    <tr
                      key={estudiante.id}
                      style={{
                        ...EstudianteStyles.tableRow,
                        ...(index % 2 === 0 ? EstudianteStyles.tableRowAlternate : {}),
                      }}
                    >
                      <td style={EstudianteStyles.tableCellBold}>
                        {estudiante.nombres} {estudiante.apellidopat} {estudiante.apellidomat}
                      </td>
                      <td style={EstudianteStyles.tableCell}>{estudiante.ru}</td>
                      <td style={EstudianteStyles.tableCell}>{estudiante.nombre_programa}</td>
                      <td style={EstudianteStyles.tableCell}>{new Date(estudiante.fecha_inscripcion).toLocaleDateString('es-ES')}</td>
                      <td style={EstudianteStyles.tableCell}>
                        <span
                          style={{
                            ...EstudianteStyles.statusBadge,
                            ...(estudiante.estado === 1 ? EstudianteStyles.statusActive : EstudianteStyles.statusInactive),
                          }}
                        >
                          {estudiante.estado === 1 ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td style={EstudianteStyles.tableCellCenter}>
                        <button
                          onClick={() => openEdit(estudiante)}
                          disabled={operationLoading}
                          style={operationLoading ? styles.editButtonDisabled : styles.editButton}
                        >
                          <AiFillEdit />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={EstudianteStyles.noDataText} colSpan="6">
                      {searchTerm ? "No se encontraron resultados" : "No hay estudiantes registrados"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* MODAL CREAR */}
          {showCreate && (
            <div className="modal-overlay" onClick={() => setShowCreate(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Agregar Nuevo Estudiante</h2>
                <form onSubmit={handleCreate}>
                  {error && <div style={EstudianteStyles.errorMessage}>Error: {error}</div>}
                  
                  <div className="form-row">
                    {/* SELECTOR DE PERSONA */}
                    <div style={{ flex: 1 }}>
                      <label style={EstudianteStyles.formLabel}>Persona: *</label>
                      <input
                        className="InputProyecto"
                        type="text"
                        placeholder="Buscar persona por nombre o carnet..."
                        value={personaSearch}
                        onChange={(e) => setPersonaSearch(e.target.value)}
                        style={{ marginBottom: "8px" }}
                        disabled={operationLoading}
                      />
                      <select
                        className="InputProyecto"
                        name="per_id"
                        value={formData.per_id}
                        onChange={handleChange}
                        required
                        disabled={operationLoading}
                        style={{ 
                          maxHeight: "200px",
                          overflowY: "auto"
                        }}
                      >
                        <option value="">-- Seleccionar Persona --</option>
                        {filteredPersonas.map(persona => (
                          <option key={persona.id} value={persona.id}>
                            {persona.nombres} {persona.apellidopat} {persona.apellidomat || ''} - CI: {persona.carnet}
                          </option>
                        ))}
                      </select>
                      {formErrors.per_id && <p style={EstudianteStyles.formErrorText}>{formErrors.per_id}</p>}
                    </div>

                    {/* SELECTOR DE PROGRAMA */}
                    <div style={{ flex: 1 }}>
                      <label style={EstudianteStyles.formLabel}>Programa Académico: *</label>
                      <input
                        className="InputProyecto"
                        type="text"
                        placeholder="Buscar programa..."
                        value={programaSearch}
                        onChange={(e) => setProgramaSearch(e.target.value)}
                        style={{ marginBottom: "8px" }}
                        disabled={operationLoading}
                      />
                      <select
                        className="InputProyecto"
                        name="id_programa_academico"
                        value={formData.id_programa_academico}
                        onChange={handleChange}
                        required
                        disabled={operationLoading}
                        style={{ 
                          maxHeight: "200px",
                          overflowY: "auto"
                        }}
                      >
                        <option value="">-- Seleccionar Programa --</option>
                        {filteredProgramas.map(programa => (
                          <option key={programa.id} value={programa.id}>
                            {programa.codigo} - {programa.nombre_programa}
                          </option>
                        ))}
                      </select>
                      {formErrors.id_programa_academico && (
                        <p style={EstudianteStyles.formErrorText}>{formErrors.id_programa_academico}</p>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div>
                      <label style={EstudianteStyles.formLabel}>R.U *</label>
                      <input
                        className="InputProyecto"
                        type="text"
                        name="ru"
                        placeholder="Ej: 2024001"
                        value={formData.ru}
                        onChange={handleChange}
                        required
                        disabled={operationLoading}
                      />
                      {formErrors.ru && (
                        <p style={EstudianteStyles.formErrorText}>{formErrors.ru}</p>
                      )}
                    </div>

                    <div>
                      <label style={EstudianteStyles.formLabel}>Fecha Inscripción: *</label>
                      <input
                        className="InputProyecto"
                        type="date"
                        name="fecha_inscripcion"
                        value={formData.fecha_inscripcion}
                        onChange={handleChange}
                        required
                        disabled={operationLoading}
                      />
                      {formErrors.fecha_inscripcion && (
                        <p style={EstudianteStyles.formErrorText}>{formErrors.fecha_inscripcion}</p>
                      )}
                    </div>
                  </div>

                  <div className="form-full">
                    <label style={EstudianteStyles.formLabel}>Estado:</label>
                    <select
                      className="InputProyecto"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      disabled={operationLoading}
                    >
                      <option value={1}>Activo</option>
                      <option value={0}>Inactivo</option>
                    </select>
                  </div>

                  <div className="modal-actions">
                    <button
                      type="submit"
                      disabled={operationLoading}
                      className="btn-create"
                    >
                      {operationLoading ? "Procesando..." : "Crear Estudiante"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreate(false);
                        setPersonaSearch("");
                        setProgramaSearch("");
                      }}
                      disabled={operationLoading}
                      className="btn-close"
                    >
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
                <h2>Editar Estudiante</h2>
                <form onSubmit={handleUpdate}>
                  {error && <div style={EstudianteStyles.errorMessage}>Error: {error}</div>}
                  
                  <div className="form-row">
                    {/* SELECTOR DE PERSONA */}
                    <div style={{ flex: 1 }}>
                      <label style={EstudianteStyles.formLabel}>Persona: *</label>
                      <input
                        className="InputProyecto"
                        type="text"
                        placeholder="Buscar persona por nombre o carnet..."
                        value={personaSearch}
                        onChange={(e) => setPersonaSearch(e.target.value)}
                        style={{ marginBottom: "8px" }}
                        disabled={operationLoading}
                      />
                      <select
                        className="InputProyecto"
                        name="per_id"
                        value={formData.per_id}
                        onChange={handleChange}
                        required
                        disabled={operationLoading}
                        style={{ 
                          maxHeight: "200px",
                          overflowY: "auto"
                        }}
                      >
                        <option value="">-- Seleccionar Persona --</option>
                        {filteredPersonas.map(persona => (
                          <option key={persona.id} value={persona.id}>
                            {persona.nombres} {persona.apellidopat} {persona.apellidomat || ''} - CI: {persona.carnet}
                          </option>
                        ))}
                      </select>
                      {formErrors.per_id && <p style={EstudianteStyles.formErrorText}>{formErrors.per_id}</p>}
                    </div>

                    {/* SELECTOR DE PROGRAMA */}
                    <div style={{ flex: 1 }}>
                      <label style={EstudianteStyles.formLabel}>Programa Académico: *</label>
                      <input
                        className="InputProyecto"
                        type="text"
                        placeholder="Buscar programa..."
                        value={programaSearch}
                        onChange={(e) => setProgramaSearch(e.target.value)}
                        style={{ marginBottom: "8px" }}
                        disabled={operationLoading}
                      />
                      <select
                        className="InputProyecto"
                        name="id_programa_academico"
                        value={formData.id_programa_academico}
                        onChange={handleChange}
                        required
                        disabled={operationLoading}
                        style={{ 
                          maxHeight: "200px",
                          overflowY: "auto"
                        }}
                      >
                        <option value="">-- Seleccionar Programa --</option>
                        {filteredProgramas.map(programa => (
                          <option key={programa.id} value={programa.id}>
                            {programa.codigo} - {programa.nombre_programa}
                          </option>
                        ))}
                      </select>
                      {formErrors.id_programa_academico && (
                        <p style={EstudianteStyles.formErrorText}>{formErrors.id_programa_academico}</p>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div>
                      <label style={EstudianteStyles.formLabel}>R.U. *</label>
                      <input
                        className="InputProyecto"
                        type="text"
                        name="ru"
                        placeholder="Ej: 2024001"
                        value={formData.ru}
                        onChange={handleChange}
                        required
                        disabled={operationLoading}
                      />
                      {formErrors.ru && (
                        <p style={EstudianteStyles.formErrorText}>{formErrors.ru}</p>
                      )}
                    </div>

                    <div>
                      <label style={EstudianteStyles.formLabel}>Fecha Inscripción: *</label>
                      <input
                        className="InputProyecto"
                        type="date"
                        name="fecha_inscripcion"
                        value={formData.fecha_inscripcion}
                        onChange={handleChange}
                        required
                        disabled={operationLoading}
                      />
                      {formErrors.fecha_inscripcion && (
                        <p style={EstudianteStyles.formErrorText}>{formErrors.fecha_inscripcion}</p>
                      )}
                    </div>
                  </div>

                  <div className="form-full">
                    <label style={EstudianteStyles.formLabel}>Estado:</label>
                    <select
                      className="InputProyecto"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      disabled={operationLoading}
                    >
                      <option value={1}>Activo</option>
                      <option value={0}>Inactivo</option>
                    </select>
                  </div>

                  <div className="modal-actions">
                    <button
                      type="submit"
                      disabled={operationLoading}
                      className="btn-edit"
                    >
                      {operationLoading ? "Procesando..." : "Actualizar Estudiante"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEdit(false);
                        setPersonaSearch("");
                        setProgramaSearch("");
                      }}
                      disabled={operationLoading}
                      className="btn-close"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminEstudiantes;