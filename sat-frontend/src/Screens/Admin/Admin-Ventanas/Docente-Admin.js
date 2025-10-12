import React, { useState, useEffect } from "react";
import { getDocentes, createDocente, updateDocente, deleteDocente } from "../../../API/Admin/Docente_admin";
import { getAllPersonas } from "../../../API/Admin/Persona";

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
        getAllPersonas()
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
    const finalValue = type === 'checkbox' ? checked : value;
    
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
    const persona = personas.find(p => p.id === per_id);
    return persona ? `${persona.nombres} ${persona.apellidopat} ${persona.apellidomat}` : 'N/A';
  };

  const getAvailablePersonas = () => {
    const docentePersonIds = docentes
      .filter(d => editingDocente ? d.id !== editingDocente.id : true)
      .map(d => d.per_id);
    return personas.filter(p => !docentePersonIds.includes(p.id));
  };

  return (
    <div style={{ color: "#fff", minHeight: "100vh", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "20px", textAlign: "center", fontSize: "28px" }}>
        Administración de Docentes
      </h2>

      {loading && <p style={{ textAlign: "center", fontSize: "18px" }}>Cargando docentes...</p>}
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
                  <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Número Item</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Especialidad</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Tipo Contrato</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Estado</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "center" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {docentes.length > 0 ? (
                  docentes.map((docente, index) => (
                    <tr 
                      key={docente.id} 
                      style={{ 
                        borderBottom: "1px solid #555",
                        backgroundColor: index % 2 === 0 ? "rgba(255,255,255,0.05)" : "transparent"
                      }}
                    >
                      <td style={{ padding: "12px" }}>{docente.id}</td>
                      <td style={{ padding: "12px", fontWeight: "bold" }}>
                        {getPersonaName(docente.per_id)}
                      </td>
                      <td style={{ padding: "12px" }}>{docente.numero_item}</td>
                      <td style={{ padding: "12px" }}>{docente.especialidad}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          backgroundColor: docente.tipo_contrato === 'permanente' ? "#4CAF50" : "#FF9800",
                          color: "white",
                          fontSize: "12px"
                        }}>
                          {docente.tipo_contrato}
                        </span>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          backgroundColor: docente.estado ? "#4CAF50" : "#F44336",
                          color: "white",
                          fontSize: "12px"
                        }}>
                          {docente.estado ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <button
                          onClick={() => handleEdit(docente)}
                          style={{
                            padding: "6px 12px",
                            backgroundColor: "#2196F3",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginRight: "8px",
                            fontSize: "12px"
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(docente.id)}
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
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ padding: "20px", textAlign: "center", fontSize: "16px" }}>
                      No hay docentes registrados
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
              {editingDocente ? "Editar Docente" : "Agregar Nuevo Docente"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "15px",
                marginBottom: "20px"
              }}>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
                    Persona:
                  </label>
                  <select
                    name="per_id"
                    value={editingDocente ? editingDocente.per_id : newDocente.per_id}
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
                  <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
                    Número de Item:
                  </label>
                  <input
                    type="text"
                    name="numero_item"
                    placeholder="Ej: DOC001"
                    value={editingDocente ? editingDocente.numero_item : newDocente.numero_item}
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
                    Especialidad:
                  </label>
                  <input
                    type="text"
                    name="especialidad"
                    placeholder="Ej: Matemáticas, Física, etc."
                    value={editingDocente ? editingDocente.especialidad : newDocente.especialidad}
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
                    Tipo de Contrato:
                  </label>
                  <select
                    name="tipo_contrato"
                    value={editingDocente ? editingDocente.tipo_contrato : newDocente.tipo_contrato}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #555",
                      backgroundColor: "#222",
                      color: "#fff"
                    }}
                  >
                    <option value="permanente">Permanente</option>
                    <option value="temporal">Temporal</option>
                    <option value="interino">Interino</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "flex", alignItems: "center", fontSize: "14px" }}>
                  <input
                    type="checkbox"
                    name="estado"
                    checked={editingDocente ? editingDocente.estado : newDocente.estado}
                    onChange={handleChange}
                    style={{ marginRight: "8px", transform: "scale(1.2)" }}
                  />
                  Docente Activo
                </label>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  style={{
                    padding: "12px 24px",
                    backgroundColor: editingDocente ? "#FF9800" : "#4CAF50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "bold"
                  }}
                >
                  {editingDocente ? "Actualizar Docente" : "Agregar Docente"}
                </button>
                
                {editingDocente && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: "#757575",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "16px"
                    }}
                  >
                    Cancelar
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
              <h4 style={{ margin: "0 0 10px 0", color: "#4CAF50" }}>Total Docentes</h4>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>{docentes.length}</p>
            </div>
            
            <div style={{
              backgroundColor: "rgba(33, 150, 243, 0.2)",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#2196F3" }}>Docentes Activos</h4>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>
                {docentes.filter(d => d.estado).length}
              </p>
            </div>
            
            <div style={{
              backgroundColor: "rgba(255, 152, 0, 0.2)",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#FF9800" }}>Permanentes</h4>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>
                {docentes.filter(d => d.tipo_contrato === 'permanente').length}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DocenteAdmin;