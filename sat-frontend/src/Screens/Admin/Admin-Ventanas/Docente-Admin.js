import React, { useState, useEffect } from "react";
import { getDocentes, createDocente, updateDocente, deleteDocente } from "../../../API/Admin/Docente_admin";
import { getAllPersonas } from "../../../API/Admin/Persona";
import { DocenteStyles } from "../../Components screens/Styles";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
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
    <div className="container">
      <h2 className="title">Administración de Docentes</h2>

      {loading && <p className="loadingText">Cargando docentes...</p>}
      {error && <p className="errorText">Error: {error}</p>}

      {!loading && !error && (
        <>
          <div className="tableContainer">
            <table className="table">
              <thead className="tableHead">
                <tr>
                  <th className="tableHeader">ID</th>
                  <th className="tableHeader">Nombre Completo</th>
                  <th className="tableHeader">Número Item</th>
                  <th className="tableHeader">Especialidad</th>
                  <th className="tableHeader">Tipo Contrato</th>
                  <th className="tableHeader">Estado</th>
                  <th className="tableHeader">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {docentes.length > 0 ? (
                  docentes.map((docente, index) => (
                    <tr
                      key={docente.id}
                      className={`tableRow ${index % 2 === 0 ? 'tableRowAlternate' : ''}`}
                    >
                      <td className="tableCell">{docente.id}</td>
                      <td className="tableCellBold">
                        {getPersonaName(docente.per_id)}
                      </td>
                      <td className="tableCell">{docente.numero_item}</td>
                      <td className="tableCell">{docente.especialidad}</td>
                      <td className="tableCell">
                        <span
                          className={`statusBadge ${docente.tipo_contrato === 'permanente' ? 'statusPermanente' : 'statusTemporal'}`}
                          
                        >
                          {docente.tipo_contrato}
                        </span>
                      </td>
                      <td className="tableCell">
                        <span
                          className={`statusBadge ${docente.estado === 1 ? 'statusActive' : 'statusInactive'}`}
                        >
                          {docente.estado ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="tableCell">
                        <div className="actionContainer">
                          <button
                          onClick={() => handleEdit(docente)}
                          className="editButton"
                        >
                          <AiFillEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(docente.id)}
                          className="deleteButton"
                        >
                          <AiFillDelete />
                        </button>
                       </div> 
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="noDataText" colSpan="7">
                      No hay docentes registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="formContainer">
            <h3 className="formTitle">
              {editingDocente ? "Editar Docente" : "Agregar Nuevo Docente"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="formGrid">
                <div>
                  <label className="formLabel">Persona:</label>
                  <select
                    name="per_id"
                    value={editingDocente ? editingDocente.per_id : newDocente.per_id}
                    onChange={handleChange}
                    required
                    className="formInput"
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
                  <label className="formLabel">Número de Item:</label>
                  <input
                    type="text"
                    name="numero_item"
                    placeholder="Ej: DOC001"
                    value={editingDocente ? editingDocente.numero_item : newDocente.numero_item}
                    onChange={handleChange}
                    required
                    className="formInput"
                  />
                </div>

                <div>
                  <label className="formLabel">Especialidad:</label>
                  <input
                    type="text"
                    name="especialidad"
                    placeholder="Ej: Matemáticas, Física, etc."
                    value={editingDocente ? editingDocente.especialidad : newDocente.especialidad}
                    onChange={handleChange}
                    required
                    className="formInput"
                  />
                </div>

                <div>
                  <label className="formLabel">Tipo de Contrato:</label>
                  <select
                    name="tipo_contrato"
                    value={
                      editingDocente ? editingDocente.tipo_contrato : newDocente.tipo_contrato
                    }
                    onChange={handleChange}
                    className="formInput"
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

              <div className="formButtonContainer">
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
                    className="cancelButton"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="statsContainer">
            <div className="statCard statCardTotal">
              <h4 className="statTitle statTitleTotal">
                Total Docentes
              </h4>
              <p className="statValue">{docentes.length}</p>
            </div>

            <div className="statCard statCardTipos">
              <h4 className="statTitle statTitleTipos">
                Docentes Activos
              </h4>
              <p className="statValue">{docentes.filter((d) => d.estado).length}</p>
            </div>

            <div className="statCard statCardPermanente">
              <h4 className="statTitle statTitlePermanente">
                Permanentes
              </h4>
              <p className="statValue">
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