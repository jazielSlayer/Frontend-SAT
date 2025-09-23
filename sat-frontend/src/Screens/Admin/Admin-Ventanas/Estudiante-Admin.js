import React, { useState, useEffect } from "react";
import { getEstudiantes, createEstudiante } from "../../../API/Admin/Estudiante_admin";

function AdminEstudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newEstudiante, setNewEstudiante] = useState({
    per_id: "",
    id_programa_academico: "",
    numero_matricula: "",
    fecha_inscripcion: "",
    estado: 1,
  });

  // Obtener estudiantes al cargar
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEstudiante(newEstudiante);
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
    <div style={{  color: "#fff", minHeight: "100vh", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Administración de Estudiantes</h2>

      {loading && <p>Cargando estudiantes...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
            <thead style={{ backgroundColor: "#333" }}>
              <tr>
                <th style={{ padding: "10px", borderBottom: "2px solid #555" }}>ID</th>
                <th style={{ padding: "10px", borderBottom: "2px solid #555" }}>Nombre Completo</th>
                <th style={{ padding: "10px", borderBottom: "2px solid #555" }}>Matrícula</th>
                <th style={{ padding: "10px", borderBottom: "2px solid #555" }}>Programa</th>
                <th style={{ padding: "10px", borderBottom: "2px solid #555" }}>Fecha Inscripción</th>
                <th style={{ padding: "10px", borderBottom: "2px solid #555" }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.length > 0 ? (
                estudiantes.map((estudiante) => (
                  <tr key={estudiante.id} style={{ borderBottom: "1px solid #555" }}>
                    <td style={{ padding: "10px" }}>{estudiante.id}</td>
                    <td style={{ padding: "10px" }}>
                      {estudiante.nombres} {estudiante.apellidopat} {estudiante.apellidomat}
                    </td>
                    <td style={{ padding: "10px" }}>{estudiante.numero_matricula}</td>
                    <td style={{ padding: "10px" }}>{estudiante.nombre_programa}</td>
                    <td style={{ padding: "10px" }}>{estudiante.fecha_inscripcion}</td>
                    <td style={{ padding: "10px" }}>{estudiante.estado === 1 ? "Activo" : "Inactivo"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: "10px" }}>No hay estudiantes</td>
                </tr>
              )}
            </tbody>
          </table>

          <h3 style={{ marginTop: "30px" }}>Agregar Nuevo Estudiante</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
            <input
              type="number"
              name="per_id"
              placeholder="ID Persona"
              value={newEstudiante.per_id}
              onChange={handleChange}
              required
              style={{ padding: "8px", marginRight: "10px", borderRadius: "4px", border: "1px solid #555" }}
            />
            <input
              type="number"
              name="id_programa_academico"
              placeholder="ID Programa"
              value={newEstudiante.id_programa_academico}
              onChange={handleChange}
              required
              style={{ padding: "8px", marginRight: "10px", borderRadius: "4px", border: "1px solid #555" }}
            />
            <input
              type="text"
              name="numero_matricula"
              placeholder="Número Matrícula"
              value={newEstudiante.numero_matricula}
              onChange={handleChange}
              required
              style={{ padding: "8px", marginRight: "10px", borderRadius: "4px", border: "1px solid #555" }}
            />
            <input
              type="date"
              name="fecha_inscripcion"
              value={newEstudiante.fecha_inscripcion}
              onChange={handleChange}
              required
              style={{ padding: "8px", marginRight: "10px", borderRadius: "4px", border: "1px solid #555" }}
            />
            <select
              name="estado"
              value={newEstudiante.estado}
              onChange={handleChange}
              style={{ padding: "8px", marginRight: "10px", borderRadius: "4px", border: "1px solid #555" }}
            >
              <option value={1}>Activo</option>
              <option value={0}>Inactivo</option>
            </select>
            <button
              type="submit"
              style={{ padding: "8px 16px", backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              Agregar
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default AdminEstudiantes;
