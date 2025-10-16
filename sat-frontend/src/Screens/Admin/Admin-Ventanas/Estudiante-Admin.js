import React, { useState, useEffect } from "react";
import { getEstudiantes, createEstudiante, updateEstudiante, deleteEstudiante } from "../../../API/Admin/Estudiante_admin";
import { EstudianteStyles } from "../../Components screens/Styles";

function AdminEstudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEstudiante, setEditingEstudiante] = useState(null);
  const [newEstudiante, setNewEstudiante] = useState({
    per_id: "",
    id_programa_academico: "",
    numero_matricula: "",
    fecha_inscripcion: "",
    estado: 1,
  });

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  const fetchEstudiantes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEstudiantes();
      setEstudiantes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEstudiante((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (estudiante) => {
    setEditingEstudiante(estudiante);
    setNewEstudiante({
      per_id: estudiante.per_id,
      id_programa_academico: estudiante.id_programa_academico,
      numero_matricula: estudiante.numero_matricula,
      fecha_inscripcion: estudiante.fecha_inscripcion,
      estado: estudiante.estado,
    });
  };

  const handleCancelEdit = () => {
    setEditingEstudiante(null);
    setNewEstudiante({
      per_id: "",
      id_programa_academico: "",
      numero_matricula: "",
      fecha_inscripcion: "",
      estado: 1,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de eliminar este estudiante?")) {
      try {
        await deleteEstudiante(id);
        fetchEstudiantes();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEstudiante) {
        await updateEstudiante(editingEstudiante.id, newEstudiante);
        setEditingEstudiante(null);
      } else {
        await createEstudiante(newEstudiante);
      }
      setNewEstudiante({
        per_id: "",
        id_programa_academico: "",
        numero_matricula: "",
        fecha_inscripcion: "",
        estado: 1,
      });
      fetchEstudiantes();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={EstudianteStyles.container}>
      <h2 style={EstudianteStyles.title}>Administración de Estudiantes</h2>

      {loading && <p style={EstudianteStyles.loadingText}>Cargando estudiantes...</p>}
      {error && <p style={EstudianteStyles.errorText}>Error: {error}</p>}

      {!loading && !error && (
        <>
          <div style={EstudianteStyles.tableContainer}>
            <table style={EstudianteStyles.table}>
              <thead style={EstudianteStyles.tableHead}>
                <tr>
                  <th style={EstudianteStyles.tableHeader}>ID</th>
                  <th style={EstudianteStyles.tableHeader}>Nombre Completo</th>
                  <th style={EstudianteStyles.tableHeader}>Matrícula</th>
                  <th style={EstudianteStyles.tableHeader}>Programa</th>
                  <th style={EstudianteStyles.tableHeader}>Fecha Inscripción</th>
                  <th style={EstudianteStyles.tableHeader}>Estado</th>
                  <th style={EstudianteStyles.tableHeader}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.length > 0 ? (
                  estudiantes.map((estudiante, index) => (
                    <tr
                      key={estudiante.id}
                      style={{
                        ...EstudianteStyles.tableRow,
                        ...(index % 2 === 0 ? EstudianteStyles.tableRowAlternate : {}),
                      }}
                    >
                      <td style={EstudianteStyles.tableCell}>{estudiante.id}</td>
                      <td style={EstudianteStyles.tableCellBold}>
                        {estudiante.nombres} {estudiante.apellidopat} {estudiante.apellidomat}
                      </td>
                      <td style={EstudianteStyles.tableCell}>{estudiante.numero_matricula}</td>
                      <td style={EstudianteStyles.tableCell}>{estudiante.nombre_programa}</td>
                      <td style={EstudianteStyles.tableCell}>{estudiante.fecha_inscripcion}</td>
                      <td style={EstudianteStyles.tableCell}>
                        <span
                          style={{
                            ...EstudianteStyles.statusBadge,
                            ...(estudiante.estado === 1
                              ? EstudianteStyles.statusActive
                              : EstudianteStyles.statusInactive),
                          }}
                        >
                          {estudiante.estado === 1 ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td style={EstudianteStyles.tableCell}>
                        <div style={EstudianteStyles.actionContainer}>
                          <button
                            onClick={() => handleEdit(estudiante)}
                            style={EstudianteStyles.editButton}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(estudiante.id)}
                            style={EstudianteStyles.deleteButton}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={EstudianteStyles.noDataText} colSpan="7">
                      No hay estudiantes registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={EstudianteStyles.formContainer}>
            <h3 style={EstudianteStyles.formTitle}>
              {editingEstudiante ? "Editar Estudiante" : "Agregar Nuevo Estudiante"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={EstudianteStyles.formGrid}>
                <div>
                  <label style={EstudianteStyles.formLabel}>ID Persona:</label>
                  <input
                    type="number"
                    name="per_id"
                    placeholder="ID Persona"
                    value={newEstudiante.per_id}
                    onChange={handleChange}
                    required
                    style={EstudianteStyles.formInput}
                  />
                </div>

                <div>
                  <label style={EstudianteStyles.formLabel}>ID Programa:</label>
                  <input
                    type="number"
                    name="id_programa_academico"
                    placeholder="ID Programa"
                    value={newEstudiante.id_programa_academico}
                    onChange={handleChange}
                    required
                    style={EstudianteStyles.formInput}
                  />
                </div>

                <div>
                  <label style={EstudianteStyles.formLabel}>Número Matrícula:</label>
                  <input
                    type="text"
                    name="numero_matricula"
                    placeholder="Número Matrícula"
                    value={newEstudiante.numero_matricula}
                    onChange={handleChange}
                    required
                    style={EstudianteStyles.formInput}
                  />
                </div>

                <div>
                  <label style={EstudianteStyles.formLabel}>Fecha Inscripción:</label>
                  <input
                    type="date"
                    name="fecha_inscripcion"
                    value={newEstudiante.fecha_inscripcion}
                    onChange={handleChange}
                    required
                    style={EstudianteStyles.formInput}
                  />
                </div>
              </div>

              <div style={EstudianteStyles.formButtonContainer}>
                <button
                  type="submit"
                  style={{
                    ...EstudianteStyles.submitButton,
                    ...(editingEstudiante
                      ? EstudianteStyles.submitButtonUpdate
                      : EstudianteStyles.submitButtonCreate),
                  }}
                >
                  {editingEstudiante ? "Actualizar Estudiante" : "Agregar Estudiante"}
                </button>

                {editingEstudiante && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    style={EstudianteStyles.cancelButton}
                  >
                    Cancelar Edición
                  </button>
                )}
              </div>
            </form>
          </div>

          <div style={EstudianteStyles.statsContainer}>
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
        </>
      )}
    </div>
  );
}

export default AdminEstudiantes;