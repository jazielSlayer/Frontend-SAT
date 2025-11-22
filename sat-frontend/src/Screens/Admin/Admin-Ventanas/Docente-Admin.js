import React, { useState, useEffect } from "react";
import { getDocentes, createDocente, updateDocente, deleteDocente } from "../../../API/Admin/Docente_admin";
import { getAllPersonas } from "../../../API/Admin/Persona";
import { styles } from "../../Components screens/Styles";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

function DocenteAdmin() {
  const [docentes, setDocentes] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingDocente, setEditingDocente] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newDocente, setNewDocente] = useState({
    per_id: "",
    numero_item: "",
    especialidad: "",
    tipo_contrato: "permanente",
    estado: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [docentesData, personasData] = await Promise.all([
        getDocentes(),
        getAllPersonas(),
      ]);
      setDocentes(docentesData);
      setPersonas(personasData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;

    if (editingDocente) {
      setEditingDocente((prev) => ({ ...prev, [name]: finalValue }));
    } else {
      setNewDocente((prev) => ({ ...prev, [name]: finalValue }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOperationLoading(true);
    setError(null);
    try {
      if (editingDocente) {
        await updateDocente(editingDocente.id, editingDocente);
        alert("Docente actualizado exitosamente");
      } else {
        await createDocente(newDocente);
        alert("Docente creado exitosamente");
      }
      setShowModal(false);
      setEditingDocente(null);
      setNewDocente({
        per_id: "",
        numero_item: "",
        especialidad: "",
        tipo_contrato: "permanente",
        estado: true,
      });
      await fetchData();
    } catch (err) {
      setError(err.message);
      alert(err.message || "Error al procesar la operación");
    } finally {
      setOperationLoading(false);
    }
  };

  const handleEdit = (docente) => {
    setEditingDocente(docente);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingDocente(null);
    setNewDocente({
      per_id: "",
      numero_item: "",
      especialidad: "",
      tipo_contrato: "permanente",
      estado: true,
    });
    setShowModal(true);
  };

  const handleCancelEdit = () => {
    setEditingDocente(null);
    setShowModal(false);
  };

  const handleDelete = async (id, docenteName) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar a ${docenteName}? Esta acción no se puede deshacer.`)) {
      setOperationLoading(true);
      setError(null);
      try {
        await deleteDocente(id);
        alert("Docente eliminado exitosamente");
        await fetchData();
      } catch (err) {
        setError(err.message);
        alert(err.message || "Error al eliminar el docente");
      } finally {
        setOperationLoading(false);
      }
    }
  };

  const getPersonaName = (per_id) => {
    const persona = personas.find((p) => p.id === per_id);
    return persona ? `${persona.nombres} ${persona.apellidopat} ${persona.apellidomat}` : "N/A";
  };

  const getAvailablePersonas = () => {
    const docentePersonIds = docentes
      .filter((d) => (editingDocente ? d.id !== editingDocente.id : true))
      .map((d) => d.per_id);
    return personas.filter((p) => !docentePersonIds.includes(p.id));
  };

  return (
    <div className="proyectos-container">
      <header className="proyectos-header">
        <h2 style={styles.title}>Administración de Docentes</h2>
        <div className="header-actions" style={{ padding: 15 }}>
          <button className="btn-create" onClick={handleAdd}>
            + Nuevo Docente
          </button>
        </div>
      </header>

      {loading && <p className="loading">Cargando docentes...</p>}
      {error && <div className="error">Error: {error}</div>}

      {!loading && !error && (
        <>
          {/* ESTADÍSTICAS ARRIBA */}
          <div className="statsContainer" style={{ marginBottom: '30px' }}>
            <div className="statCard statCardTotal">
              <h4 className="statTitle statTitleTotal">Total Docentes</h4>
              <p className="statValue">{docentes.length}</p>
            </div>

            <div className="statCard statCardTipos">
              <h4 className="statTitle statTitleTipos">Docentes Activos</h4>
              <p className="statValue">
                {docentes.filter((d) => d.estado).length}
              </p>
            </div>

            <div className="statCard statCardPermanente">
              <h4 className="statTitle statTitlePermanente">Permanentes</h4>
              <p className="statValue">
                {docentes.filter((d) => d.tipo_contrato === "permanente").length}
              </p>
            </div>
          </div>

          {/* TABLA DE DATOS */}
          <div className="tableContainer">
            <table className="table">
              <thead className="tableHead">
                <tr>
                  <th style={styles.tableHeader}>Nombre Completo</th>
                  <th style={styles.tableHeader}>Número Item</th>
                  <th style={styles.tableHeader}>Especialidad</th>
                  <th style={styles.tableHeader}>Tipo Contrato</th>
                  <th style={styles.tableHeader}>Estado</th>
                  <th style={styles.tableHeaderCenter}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {docentes.length > 0 ? (
                  docentes.map((docente, index) => (
                    <tr
                      key={docente.id}
                      style={{
                        ...styles.tableRow,
                        ...(index % 2 === 0 ? styles.tableRowAlternate : {}),
                      }}
                    >
                      <td style={styles.tableCellBold}>
                        {getPersonaName(docente.per_id)}
                      </td>
                      <td style={styles.tableCell}>{docente.numero_item}</td>
                      <td style={styles.tableCell}>{docente.especialidad}</td>
                      <td style={styles.tableCell}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            ...(docente.tipo_contrato === "permanente" 
                              ? styles.statusDefault 
                              : styles.statusNotDefault),
                          }}
                        >
                          {docente.tipo_contrato}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            ...(docente.estado 
                              ? styles.statusDefault 
                              : styles.statusNotDefault),
                          }}
                        >
                          {docente.estado ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td style={styles.tableCellCenter}>
                        <button
                          onClick={() => handleEdit(docente)}
                          disabled={operationLoading}
                          style={operationLoading ? styles.editButtonDisabled : styles.editButton}
                        >
                          <AiFillEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(docente.id, getPersonaName(docente.per_id))}
                          disabled={operationLoading}
                          style={operationLoading ? styles.deleteButtonDisabled : styles.deleteButton}
                        >
                          <AiFillDelete />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={styles.noDataText} colSpan="6">
                      No hay docentes registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* MODAL CREAR/EDITAR */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingDocente ? "Editar Docente" : "Agregar Nuevo Docente"}</h2>
            
            <form onSubmit={handleSubmit}>
              {error && <div style={styles.errorMessage}>Error: {error}</div>}

              <div className="form-row">
                <div>
                  <label style={styles.formLabel}>Persona:</label>
                  <select
                    className="InputProyecto"
                    name="per_id"
                    value={editingDocente ? editingDocente.per_id : newDocente.per_id}
                    onChange={handleChange}
                    required
                    disabled={operationLoading}
                  >
                    <option value="">Seleccionar Persona</option>
                    {editingDocente && (
                      <option value={editingDocente.per_id}>
                        {getPersonaName(editingDocente.per_id)} (Actual)
                      </option>
                    )}
                    {getAvailablePersonas().map((persona) => (
                      <option key={persona.id} value={persona.id}>
                        {persona.nombres} {persona.apellidopat} {persona.apellidomat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={styles.formLabel}>Número de Item:</label>
                  <input
                    className="InputProyecto"
                    type="text"
                    name="numero_item"
                    placeholder="Ej: DOC001"
                    value={editingDocente ? editingDocente.numero_item : newDocente.numero_item}
                    onChange={handleChange}
                    required
                    disabled={operationLoading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label style={styles.formLabel}>Especialidad:</label>
                  <input
                    className="InputProyecto"
                    type="text"
                    name="especialidad"
                    placeholder="Ej: Matemáticas, Física, etc."
                    value={editingDocente ? editingDocente.especialidad : newDocente.especialidad}
                    onChange={handleChange}
                    required
                    disabled={operationLoading}
                  />
                </div>

                <div>
                  <label style={styles.formLabel}>Tipo de Contrato:</label>
                  <select
                    className="InputProyecto"
                    name="tipo_contrato"
                    value={editingDocente ? editingDocente.tipo_contrato : newDocente.tipo_contrato}
                    onChange={handleChange}
                    disabled={operationLoading}
                  >
                    <option value="permanente">Permanente</option>
                    <option value="temporal">Temporal</option>
                    <option value="interino">Interino</option>
                  </select>
                </div>
              </div>

              <div className="form-full">
                <label style={styles.formCheckboxLabel}>
                  <input
                    type="checkbox"
                    name="estado"
                    checked={editingDocente ? editingDocente.estado : newDocente.estado}
                    onChange={handleChange}
                    disabled={operationLoading}
                    style={styles.formCheckbox}
                  />
                  Docente Activo
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  disabled={operationLoading}
                  className={editingDocente ? "btn-edit" : "btn-create"}
                >
                  {operationLoading ? "Procesando..." : (editingDocente ? "Actualizar Docente" : "Crear Docente")}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
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
  );
}

export default DocenteAdmin;
