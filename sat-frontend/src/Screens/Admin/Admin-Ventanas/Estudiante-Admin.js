import React, { useState, useEffect } from "react";
import { getEstudiantes, createEstudiante, updateEstudiante, deleteEstudiante } from "../../../API/Admin/Estudiante_admin";

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
    if (window.confirm('¿Está seguro de eliminar este estudiante?')) {
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
    <div style={{ color: "#fff", minHeight: "100vh", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "20px", textAlign: "center", fontSize: "28px" }}>
        Administración de Estudiantes
      </h2>

      {loading && <p style={{ textAlign: "center", fontSize: "18px" }}>Cargando estudiantes...</p>}
      {error && <p style={{ color: "red", textAlign: "center", fontSize: "16px" }}>Error: {error}</p>}

      {!loading && !error && (
        <>
          <div style={{ overflowX: "auto", marginBottom: "30px" }}>
            <table style={{ 
              width: "100%", 
              borderCollapse: "collapse", 
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              borderRadius: "8px",
              overflow: "hidden"
            }}>
              <thead style={{ backgroundColor: "#333" }}>
                <tr>
                  <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>ID</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Nombre Completo</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Matrícula</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Programa</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Fecha Inscripción</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Estado</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.length > 0 ? (
                  estudiantes.map((estudiante, index) => (
                    <tr 
                      key={estudiante.id}
                      style={{ 
                        borderBottom: "1px solid #555",
                        backgroundColor: index % 2 === 0 ? "rgba(255,255,255,0.05)" : "transparent"
                      }}
                    >
                      <td style={{ padding: "12px" }}>{estudiante.id}</td>
                      <td style={{ padding: "12px", fontWeight: "bold" }}>
                        {estudiante.nombres} {estudiante.apellidopat} {estudiante.apellidomat}
                      </td>
                      <td style={{ padding: "12px" }}>{estudiante.numero_matricula}</td>
                      <td style={{ padding: "12px" }}>{estudiante.nombre_programa}</td>
                      <td style={{ padding: "12px" }}>{estudiante.fecha_inscripcion}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          backgroundColor: estudiante.estado === 1 ? "#4CAF50" : "#F44336",
                          color: "white",
                          fontSize: "12px"
                        }}>
                          {estudiante.estado === 1 ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => handleEdit(estudiante)}
                            style={{
                              padding: "6px 12px",
                              backgroundColor: "#2196F3",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px"
                            }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(estudiante.id)}
                            style={{
                              padding: "6px 12px",
                              backgroundColor: "#F44336",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px"
                            }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ padding: "20px", textAlign: "center", fontSize: "16px" }}>
                      No hay estudiantes registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            padding: "25px",
            borderRadius: "8px",
            marginTop: "20px"
          }}>
            <h3 style={{ marginBottom: "20px", fontSize: "22px" }}>
              {editingEstudiante ? "Editar Estudiante" : "Agregar Nuevo Estudiante"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "15px",
                marginBottom: "20px"
              }}>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
                    ID Persona:
                  </label>
                  <input
                    type="number"
                    name="per_id"
                    placeholder="ID Persona"
                    value={newEstudiante.per_id}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #555",
                      backgroundColor: "#222",
                      color: "#fff"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
                    ID Programa:
                  </label>
                  <input
                    type="number"
                    name="id_programa_academico"
                    placeholder="ID Programa"
                    value={newEstudiante.id_programa_academico}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #555",
                      backgroundColor: "#222",
                      color: "#fff"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
                    Número Matrícula:
                  </label>
                  <input
                    type="text"
                    name="numero_matricula"
                    placeholder="Número Matrícula"
                    value={newEstudiante.numero_matricula}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #555",
                      backgroundColor: "#222",
                      color: "#fff"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
                    Fecha Inscripción:
                  </label>
                  <input
                    type="date"
                    name="fecha_inscripcion"
                    value={newEstudiante.fecha_inscripcion}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #555",
                      backgroundColor: "#222",
                      color: "#fff"
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#4CAF50",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold"
                }}
              >
                Agregar Estudiante
              </button>
           <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button
                  type="submit"
                  style={{
                    padding: "12px 24px",
                    backgroundColor: editingEstudiante ? "#2196F3" : "#4CAF50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "bold"
                  }}
                >
                  {editingEstudiante ? "Actualizar Estudiante" : "Agregar Estudiante"}
                </button>

                {editingEstudiante && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: "#F44336",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: "bold"
                    }}
                  >
                    Cancelar Edición
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Estadísticas */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
            marginTop: "30px"
          }}>
            <div style={{
              backgroundColor: "rgba(76, 175, 80, 0.2)",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#4CAF50" }}>Total Estudiantes</h4>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>{estudiantes.length}</p>
            </div>
            
            <div style={{
              backgroundColor: "rgba(33, 150, 243, 0.2)",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#2196F3" }}>Estudiantes Activos</h4>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>
                {estudiantes.filter(e => e.estado === 1).length}
              </p>
            </div>
            
            <div style={{
              backgroundColor: "rgba(255, 152, 0, 0.2)",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#FF9800" }}>Inactivos</h4>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>
                {estudiantes.filter(e => e.estado === 0).length}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminEstudiantes;
