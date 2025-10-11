import React, { useEffect, useState } from "react";
import { getAllTalleres, getTaller, createTaller, updateTaller, deleteTaller } from "../../../API/Admin/Taller";
import { getAllMetodologias } from "../../../API/Admin/Metodologia.js"; // Asumiendo que el archivo proporcionado está en este path

function Talleres() {
  const [talleres, setTalleres] = useState([]);
  const [metodologias, setMetodologias] = useState([]);
  const [editingTaller, setEditingTaller] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    id_metodologia: "",
    tipo_taller: "",
    evaluacion_final: "",
    duracion: "",
    resultado: "",
    fecha_realizacion: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all talleres and metodologias on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [talleresData, metodologiasData] = await Promise.all([
          getAllTalleres(),
          getAllMetodologias(),
        ]);
        setTalleres(talleresData.data || []);
        setMetodologias(metodologiasData.data || []); // Asumiendo que devuelve { data: [] }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission for create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTaller) {
        // Update
        await updateTaller(editingTaller.id, formData);
      } else {
        // Create
        await createTaller(formData);
      }
      // Refresh list
      const talleresData = await getAllTalleres();
      setTalleres(talleresData.data || []);
      // Reset form
      setFormData({
        titulo: "",
        id_metodologia: "",
        tipo_taller: "",
        evaluacion_final: "",
        duracion: "",
        resultado: "",
        fecha_realizacion: "",
      });
      setEditingTaller(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle edit button click
  const handleEdit = async (id) => {
    try {
      const tallerData = await getTaller(id);
      setFormData(tallerData.data); // Asumiendo que devuelve { data: {} }
      setEditingTaller(tallerData.data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este taller?")) {
      try {
        await deleteTaller(id);
        // Refresh list
        const talleresData = await getAllTalleres();
        setTalleres(talleresData.data || []);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Get unique types
  const uniqueTipos = [...new Set(talleres.map(t => t.tipo_taller).filter(Boolean))];

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestión de Talleres</h1>

      {/* Form for add/edit */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="titulo"
          placeholder="Título"
          value={formData.titulo}
          onChange={handleInputChange}
          required
          style={{ marginRight: "10px" }}
        />
        <select
          name="id_metodologia"
          value={formData.id_metodologia}
          onChange={handleInputChange}
          required
          style={{ marginRight: "10px" }}
        >
          <option value="">Selecciona Metodología</option>
          {metodologias.map(m => (
            <option key={m.id} value={m.id}>{m.nombre}</option>
          ))}
        </select>
        <select
          name="tipo_taller"
          value={formData.tipo_taller}
          onChange={handleInputChange}
          required
          style={{ marginRight: "10px" }}
        >
          <option value="">Selecciona Tipo</option>
          <option value="Teórico">Teórico</option>
          <option value="Práctico">Práctico</option>
          <option value="Mixto">Mixto</option>
        </select>
        <input
          type="text"
          name="evaluacion_final"
          placeholder="Evaluación Final"
          value={formData.evaluacion_final}
          onChange={handleInputChange}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          name="duracion"
          placeholder="Duración"
          value={formData.duracion}
          onChange={handleInputChange}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          name="resultado"
          placeholder="Resultado"
          value={formData.resultado}
          onChange={handleInputChange}
          style={{ marginRight: "10px" }}
        />
        <input
          type="date"
          name="fecha_realizacion"
          value={formData.fecha_realizacion}
          onChange={handleInputChange}
          required
          style={{ marginRight: "10px" }}
        />
        <button type="submit">{editingTaller ? "Actualizar" : "Agregar"}</button>
        {editingTaller && (
          <button type="button" onClick={() => setEditingTaller(null)} style={{ marginLeft: "10px" }}>
            Cancelar
          </button>
        )}
      </form>

      {/* Unique types */}
      <h2>Tipos de Talleres Registrados</h2>
      <ul>
        {uniqueTipos.length > 0 ? (
          uniqueTipos.map((tipo, index) => <li key={index}>{tipo}</li>)
        ) : (
          <p>No hay tipos registrados.</p>
        )}
      </ul>

      {/* Table of talleres */}
      <h2>Talleres Registrados</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>ID</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Título</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Metodología</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Tipo</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Evaluación</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Duración</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Resultado</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Fecha</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {talleres.map((taller) => (
            <tr key={taller.id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{taller.id}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{taller.titulo}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{taller.metodologia_nombre || taller.id_metodologia}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{taller.tipo_taller}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{taller.evaluacion_final || "-"}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{taller.duracion || "-"}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{taller.resultado || "-"}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{taller.fecha_realizacion}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <button onClick={() => handleEdit(taller.id)} style={{ marginRight: "5px" }}>Editar</button>
                <button onClick={() => handleDelete(taller.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Talleres;