import React, { useState, useEffect } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
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
    <div className="bg-gray-900 min-h-screen p-4 " style={{color: "white"}}>
      <h2 className="title">Administración de Estudiantes</h2>

      {loading && <p className="loadingText">Cargando estudiantes...</p>}
      {error && <p className="errorText">Error: {error}</p>}

      {!loading && !error && (
        <>
          <div className="tableContainer">
            <table className="table">
              <thead className="tableHead">
                <tr>
                  <th className="tableHeader">ID</th>
                  <th className="tableHeader">Nombre Completo</th>
                  <th className="tableHeader">Matrícula</th>
                  <th className="tableHeader">Programa</th>
                  <th className="tableHeader">Fecha Inscripción</th>
                  <th className="tableHeader">Estado</th>
                  <th className="tableHeader">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.length > 0 ? (
                  estudiantes.map((estudiante, index) => (
                    <tr
                      key={estudiante.id}
                      className={`tableRow ${index % 2 === 0 ? "tableRowAlternate" : ""}`}
                    >
                      <td className="tableCell">{estudiante.id}</td>
                      <td className="tableCellBold">
                        {estudiante.nombres} {estudiante.apellidopat} {estudiante.apellidomat}
                      </td>
                      <td className="tableCell">{estudiante.numero_matricula}</td>
                      <td className="tableCell">{estudiante.nombre_programa}</td>
                      <td className="tableCell">{estudiante.fecha_inscripcion}</td>
                      <td className="tableCell">
                        <span
                          className={`statusBadge ${estudiante.estado === 1 ? 'statusActive' : 'statusInactive'}`}
                          
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
                            <AiFillEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(estudiante.id)}
                            style={EstudianteStyles.deleteButton}
                          >
                            <AiFillDelete />
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