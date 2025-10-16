import React, { useState, useEffect } from "react";
import { getDocentes, createDocente, updateDocente, deleteDocente } from "../../../API/Admin/Docente_admin";
import { getAllPersonas } from "../../../API/Admin/Persona";
import { DocenteStyles } from "../../Components screens/Styles";
function DocenteAdmin() {
  const [docentes, setDocentes] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDocente, setEditingDocente] = useState(null);
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
    try {
      if (editingDocente) {
        await updateDocente(editingDocente.id, editingDocente);
        setEditingDocente(null);
      } else {
        await createDocente(newDocente);
        setNewDocente({
          per_id: "",
          numero_item: "",
          especialidad: "",
          tipo_contrato: "permanente",
          estado: true,
        });
      }
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (docente) => {
    setEditingDocente(docente);
  };

  const handleCancelEdit = () => {
    setEditingDocente(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este docente?")) {
      try {
        await deleteDocente(id);
        fetchData();
      } catch (err) {
        setError(err.message);
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
    <div style={DocenteStyles.container}>
      <h2 style={DocenteStyles.title}>Administración de Docentes</h2>

      {loading && <p style={DocenteStyles.loadingText}>Cargando docentes...</p>}
      {error && <p style={DocenteStyles.errorText}>Error: {error}</p>}

      {!loading && !error && (
        <>
          <div style={DocenteStyles.tableContainer}>
            <table style={DocenteStyles.table}>
              <thead style={DocenteStyles.tableHead}>
                <tr>
                  <th style={DocenteStyles.tableHeader}>ID</th>
                  <th style={DocenteStyles.tableHeader}>Nombre Completo</th>
                  <th style={DocenteStyles.tableHeader}>Número Item</th>
                  <th style={DocenteStyles.tableHeader}>Especialidad</th>
                  <th style={DocenteStyles.tableHeader}>Tipo Contrato</th>
                  <th style={DocenteStyles.tableHeader}>Estado</th>
                  <th style={DocenteStyles.tableHeaderCenter}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {docentes.length > 0 ? (
                  docentes.map((docente, index) => (
                    <tr
                      key={docente.id}
                      style={{
                        ...DocenteStyles.tableRow,
                        ...(index % 2 === 0 ? DocenteStyles.tableRowAlternate : {}),
                      }}
                    >
                      <td style={DocenteStyles.tableCell}>{docente.id}</td>
                      <td style={DocenteStyles.tableCellBold}>
                        {getPersonaName(docente.per_id)}
                      </td>
                      <td style={DocenteStyles.tableCell}>{docente.numero_item}</td>
                      <td style={DocenteStyles.tableCell}>{docente.especialidad}</td>
                      <td style={DocenteStyles.tableCell}>
                        <span
                          style={{
                            ...DocenteStyles.statusBadge,
                            ...(docente.tipo_contrato === "permanente"
                              ? DocenteStyles.statusPermanente
                              : DocenteStyles.statusTemporal),
                          }}
                        >
                          {docente.tipo_contrato}
                        </span>
                      </td>
                      <td style={DocenteStyles.tableCell}>
                        <span
                          style={{
                            ...DocenteStyles.statusBadge,
                            ...(docente.estado
                              ? DocenteStyles.statusActive
                              : DocenteStyles.statusInactive),
                          }}
                        >
                          {docente.estado ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td style={DocenteStyles.tableCellCenter}>
                        <button
                          onClick={() => handleEdit(docente)}
                          style={DocenteStyles.editButton}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(docente.id)}
                          style={DocenteStyles.deleteButton}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={DocenteStyles.noDataText} colSpan="7">
                      No hay docentes registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={DocenteStyles.formContainer}>
            <h3 style={DocenteStyles.formTitle}>
              {editingDocente ? "Editar Docente" : "Agregar Nuevo Docente"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={DocenteStyles.formGrid}>
                <div>
                  <label style={DocenteStyles.formLabel}>Persona:</label>
                  <select
                    name="per_id"
                    value={editingDocente ? editingDocente.per_id : newDocente.per_id}
                    onChange={handleChange}
                    required
                    style={DocenteStyles.formInput}
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
                  <label style={DocenteStyles.formLabel}>Número de Item:</label>
                  <input
                    type="text"
                    name="numero_item"
                    placeholder="Ej: DOC001"
                    value={editingDocente ? editingDocente.numero_item : newDocente.numero_item}
                    onChange={handleChange}
                    required
                    style={DocenteStyles.formInput}
                  />
                </div>

                <div>
                  <label style={DocenteStyles.formLabel}>Especialidad:</label>
                  <input
                    type="text"
                    name="especialidad"
                    placeholder="Ej: Matemáticas, Física, etc."
                    value={editingDocente ? editingDocente.especialidad : newDocente.especialidad}
                    onChange={handleChange}
                    required
                    style={DocenteStyles.formInput}
                  />
                </div>

                <div>
                  <label style={DocenteStyles.formLabel}>Tipo de Contrato:</label>
                  <select
                    name="tipo_contrato"
                    value={
                      editingDocente ? editingDocente.tipo_contrato : newDocente.tipo_contrato
                    }
                    onChange={handleChange}
                    style={DocenteStyles.formInput}
                  >
                    <option value="permanente">Permanente</option>
                    <option value="temporal">Temporal</option>
                    <option value="interino">Interino</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={DocenteStyles.formCheckboxLabel}>
                  <input
                    type="checkbox"
                    name="estado"
                    checked={editingDocente ? editingDocente.estado : newDocente.estado}
                    onChange={handleChange}
                    style={DocenteStyles.formCheckbox}
                  />
                  Docente Activo
                </label>
              </div>

              <div style={DocenteStyles.formButtonContainer}>
                <button
                  type="submit"
                  style={{
                    ...DocenteStyles.submitButton,
                    ...(editingDocente
                      ? DocenteStyles.submitButtonUpdate
                      : DocenteStyles.submitButtonCreate),
                  }}
                >
                  {editingDocente ? "Actualizar Docente" : "Agregar Docente"}
                </button>

                {editingDocente && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    style={DocenteStyles.cancelButton}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div style={DocenteStyles.statsContainer}>
            <div style={{ ...DocenteStyles.statCard, ...DocenteStyles.statCardTotal }}>
              <h4 style={{ ...DocenteStyles.statTitle, ...DocenteStyles.statTitleTotal }}>
                Total Docentes
              </h4>
              <p style={DocenteStyles.statValue}>{docentes.length}</p>
            </div>

            <div style={{ ...DocenteStyles.statCard, ...DocenteStyles.statCardActive }}>
              <h4 style={{ ...DocenteStyles.statTitle, ...DocenteStyles.statTitleActive }}>
                Docentes Activos
              </h4>
              <p style={DocenteStyles.statValue}>{docentes.filter((d) => d.estado).length}</p>
            </div>

            <div style={{ ...DocenteStyles.statCard, ...DocenteStyles.statCardPermanente }}>
              <h4 style={{ ...DocenteStyles.statTitle, ...DocenteStyles.statTitlePermanente }}>
                Permanentes
              </h4>
              <p style={DocenteStyles.statValue}>
                {docentes.filter((d) => d.tipo_contrato === "permanente").length}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DocenteAdmin;