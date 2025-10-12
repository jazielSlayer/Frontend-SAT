import React, { useEffect, useState } from "react";
import { getAllTalleres, getTaller, createTaller, updateTaller, deleteTaller } from "../../../API/Admin/Taller";
import { getAllMetodologias } from "../../../API/Admin/Metodologia.js";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [talleresData, metodologiasData] = await Promise.all([
          getAllTalleres(),
          getAllMetodologias(),
        ]);
        console.log("Talleres Data:", talleresData);
        console.log("Metodologias Data:", metodologiasData);
        
        // Manejar diferentes estructuras de respuesta
        const talleresArray = Array.isArray(talleresData) ? talleresData : (talleresData?.data || []);
        const metodologiasArray = Array.isArray(metodologiasData) ? metodologiasData : (metodologiasData?.data || []);
        
        setTalleres(talleresArray);
        setMetodologias(metodologiasArray);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        titulo: formData.titulo,
        id_metodologia: parseInt(formData.id_metodologia),
        tipo_taller: formData.tipo_taller,
        evaluacion_final: formData.evaluacion_final || null,
        duracion: formData.duracion || null,
        resultado: formData.resultado || null,
        fecha_realizacion: formData.fecha_realizacion,
      };

      if (editingTaller) {
        await updateTaller(editingTaller.id, dataToSend);
      } else {
        await createTaller(dataToSend);
      }
      const talleresData = await getAllTalleres();
      setTalleres(talleresData.data || []);
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

  const handleEdit = async (id) => {
    try {
      const tallerData = await getTaller(id);
      setFormData(tallerData.data);
      setEditingTaller(tallerData.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingTaller(null);
    setFormData({
      titulo: "",
      id_metodologia: "",
      tipo_taller: "",
      evaluacion_final: "",
      duracion: "",
      resultado: "",
      fecha_realizacion: "",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este taller?")) {
      try {
        await deleteTaller(id);
        const talleresData = await getAllTalleres();
        setTalleres(talleresData.data || []);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const uniqueTipos = [...new Set(talleres.map(t => t.tipo_taller).filter(Boolean))];

  const getMetodologiaNombre = (id) => {
    const metodologia = metodologias.find(m => m.id === id);
    return metodologia ? metodologia.nombre : id;
  };

  return (
    <div style={{ color: "#fff", minHeight: "100vh", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "20px", textAlign: "center", fontSize: "28px" }}>
        Gestión de Talleres
      </h2>

      {loading && <p style={{ textAlign: "center", fontSize: "18px" }}>Cargando talleres...</p>}
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
                  <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Título</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Metodología</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Tipo</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Evaluación</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Duración</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Resultado</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Fecha</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {talleres.length > 0 ? (
                  talleres.map((taller, index) => (
                    <tr 
                      key={taller.id}
                      style={{ 
                        borderBottom: "1px solid #555",
                        backgroundColor: index % 2 === 0 ? "rgba(255,255,255,0.05)" : "transparent"
                      }}
                    >
                      <td style={{ padding: "12px" }}>{taller.id}</td>
                      <td style={{ padding: "12px", fontWeight: "bold" }}>{taller.titulo}</td>
                      <td style={{ padding: "12px" }}>{getMetodologiaNombre(taller.id_metodologia)}</td>
                      <td style={{ padding: "12px" }}>{taller.tipo_taller}</td>
                      <td style={{ padding: "12px" }}>{taller.evaluacion_final || "-"}</td>
                      <td style={{ padding: "12px" }}>{taller.duracion || "-"}</td>
                      <td style={{ padding: "12px" }}>{taller.resultado || "-"}</td>
                      <td style={{ padding: "12px" }}>{taller.fecha_realizacion}</td>
                      <td style={{ padding: "12px" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => handleEdit(taller.id)}
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
                            onClick={() => handleDelete(taller.id)}
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
                    <td colSpan="9" style={{ padding: "20px", textAlign: "center", fontSize: "16px" }}>
                      No hay talleres registrados
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
              {editingTaller ? "Editar Taller" : "Agregar Nuevo Taller"}
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
                    Título:
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    placeholder="Título"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #555",
                      backgroundColor: "#222",
                      color: "#fff",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
                    Metodología:
                  </label>
                  <select
                    name="id_metodologia"
                    value={formData.id_metodologia}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #555",
                      backgroundColor: "#222",
                      color: "#fff",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="">Selecciona Metodología</option>
                    {metodologias.length > 0 ? (
                      metodologias.map(m => (
                        <option key={m.id} value={m.id}>{m.nombre}</option>
                      ))
                    ) : (
                      <option disabled>No hay metodologías disponibles</option>
                    )}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
                    Tipo de Taller:
                  </label>
                  <select
                    name="tipo_taller"
                    value={formData.tipo_taller}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #555",
                      backgroundColor: "#222",
                      color: "#fff",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="">Selecciona Tipo</option>
                    <option value="Teórico">Teórico</option>
                    <option value="Práctico">Práctico</option>
                    <option value="Mixto">Mixto</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
                    Evaluación Final:
                  </label>
                  <input
                    type="text"
                    name="evaluacion_final"
                    placeholder="Evaluación Final"
                    value={formData.evaluacion_final}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #555",
                      backgroundColor: "#222",
                      color: "#fff",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
                    Duración:
                  </label>
                  <input
                    type="text"
                    name="duracion"
                    placeholder="Duración"
                    value={formData.duracion}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #555",
                      backgroundColor: "#222",
                      color: "#fff",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
                    Resultado:
                  </label>
                  <input
                    type="text"
                    name="resultado"
                    placeholder="Resultado"
                    value={formData.resultado}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #555",
                      backgroundColor: "#222",
                      color: "#fff",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
                    Fecha de Realización:
                  </label>
                  <input
                    type="date"
                    name="fecha_realizacion"
                    value={formData.fecha_realizacion}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #555",
                      backgroundColor: "#222",
                      color: "#fff",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  style={{
                    padding: "12px 24px",
                    backgroundColor: editingTaller ? "#2196F3" : "#4CAF50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "bold"
                  }}
                >
                  {editingTaller ? "Actualizar Taller" : "Agregar Taller"}
                </button>
                {editingTaller && (
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
              <h4 style={{ margin: "0 0 10px 0", color: "#4CAF50" }}>Total Talleres</h4>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>{talleres.length}</p>
            </div>
            <div style={{
              backgroundColor: "rgba(33, 150, 243, 0.2)",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#2196F3" }}>Tipos Únicos</h4>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>{uniqueTipos.length}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Talleres;