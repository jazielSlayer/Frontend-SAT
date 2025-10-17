import React, { useEffect, useState } from "react";
import { getAllTalleres, getTaller, createTaller, updateTaller, deleteTaller } from "../../../API/Admin/Taller";
import { getAllMetodologias } from "../../../API/Admin/Metodologia.js";
import { TallerStyles } from "../../Components screens/Styles.js";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
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
    <div style={TallerStyles.container}>
      <h2 style={TallerStyles.title}>Gestión de Talleres</h2>

      {loading && <p style={TallerStyles.loadingText}>Cargando talleres...</p>}
      {error && <p style={TallerStyles.errorText}>Error: {error}</p>}

      {!loading && !error && (
        <>
          <div style={TallerStyles.tableContainer}>
            <table style={TallerStyles.table}>
              <thead style={TallerStyles.tableHead}>
                <tr>
                  <th style={TallerStyles.tableHeader}>ID</th>
                  <th style={TallerStyles.tableHeader}>Título</th>
                  <th style={TallerStyles.tableHeader}>Metodología</th>
                  <th style={TallerStyles.tableHeader}>Tipo</th>
                  <th style={TallerStyles.tableHeader}>Evaluación</th>
                  <th style={TallerStyles.tableHeader}>Duración</th>
                  <th style={TallerStyles.tableHeader}>Resultado</th>
                  <th style={TallerStyles.tableHeader}>Fecha</th>
                  <th style={TallerStyles.tableHeader}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {talleres.length > 0 ? (
                  talleres.map((taller, index) => (
                    <tr
                      key={taller.id}
                      style={{
                        ...TallerStyles.tableRow,
                        ...(index % 2 === 0 ? TallerStyles.tableRowAlternate : {}),
                      }}
                    >
                      <td style={TallerStyles.tableCell}>{taller.id}</td>
                      <td style={TallerStyles.tableCellBold}>{taller.titulo}</td>
                      <td style={TallerStyles.tableCell}>{getMetodologiaNombre(taller.id_metodologia)}</td>
                      <td style={TallerStyles.tableCell}>{taller.tipo_taller}</td>
                      <td style={TallerStyles.tableCell}>{taller.evaluacion_final || "-"}</td>
                      <td style={TallerStyles.tableCell}>{taller.duracion || "-"}</td>
                      <td style={TallerStyles.tableCell}>{taller.resultado || "-"}</td>
                      <td style={TallerStyles.tableCell}>{taller.fecha_realizacion}</td>
                      <td style={TallerStyles.tableCell}>
                        <div style={TallerStyles.actionContainer}>
                          <button
                            onClick={() => handleEdit(taller.id)}
                            style={TallerStyles.editButton}
                          >
                            <AiFillEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(taller.id)}
                            style={TallerStyles.deleteButton}
                          >
                            <AiFillDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={TallerStyles.noDataText} colSpan="9">
                      No hay talleres registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={TallerStyles.formContainer}>
            <h3 style={TallerStyles.formTitle}>
              {editingTaller ? "Editar Taller" : "Agregar Nuevo Taller"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={TallerStyles.formGrid}>
                <div>
                  <label style={TallerStyles.formLabel}>Título:</label>
                  <input
                    type="text"
                    name="titulo"
                    placeholder="Título"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    required
                    style={TallerStyles.formInput}
                  />
                </div>
                <div>
                  <label style={TallerStyles.formLabel}>Metodología:</label>
                  <select
                    name="id_metodologia"
                    value={formData.id_metodologia}
                    onChange={handleInputChange}
                    required
                    style={TallerStyles.formInput}
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
                  <label style={TallerStyles.formLabel}>Tipo de Taller:</label>
                  <select
                    name="tipo_taller"
                    value={formData.tipo_taller}
                    onChange={handleInputChange}
                    required
                    style={TallerStyles.formInput}
                  >
                    <option value="">Selecciona Tipo</option>
                    <option value="Teórico">Teórico</option>
                    <option value="Práctico">Práctico</option>
                    <option value="Mixto">Mixto</option>
                  </select>
                </div>
                <div>
                  <label style={TallerStyles.formLabel}>Evaluación Final:</label>
                  <input
                    type="text"
                    name="evaluacion_final"
                    placeholder="Evaluación Final"
                    value={formData.evaluacion_final}
                    onChange={handleInputChange}
                    style={TallerStyles.formInput}
                  />
                </div>
                <div>
                  <label style={TallerStyles.formLabel}>Duración:</label>
                  <input
                    type="text"
                    name="duracion"
                    placeholder="Duración"
                    value={formData.duracion}
                    onChange={handleInputChange}
                    style={TallerStyles.formInput}
                  />
                </div>
                <div>
                  <label style={TallerStyles.formLabel}>Resultado:</label>
                  <input
                    type="text"
                    name="resultado"
                    placeholder="Resultado"
                    value={formData.resultado}
                    onChange={handleInputChange}
                    style={TallerStyles.formInput}
                  />
                </div>
                <div>
                  <label style={TallerStyles.formLabel}>Fecha de Realización:</label>
                  <input
                    type="date"
                    name="fecha_realizacion"
                    value={formData.fecha_realizacion}
                    onChange={handleInputChange}
                    required
                    style={TallerStyles.formInput}
                  />
                </div>
              </div>
              <div style={TallerStyles.formButtonContainer}>
                <button
                  type="submit"
                  style={{
                    ...TallerStyles.submitButton,
                    ...(editingTaller ? TallerStyles.submitButtonUpdate : TallerStyles.submitButtonCreate),
                  }}
                >
                  {editingTaller ? "Actualizar Taller" : "Agregar Taller"}
                </button>
                {editingTaller && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    style={TallerStyles.cancelButton}
                  >
                    Cancelar Edición
                  </button>
                )}
              </div>
            </form>
          </div>

          <div style={TallerStyles.statsContainer}>
            <div style={{ ...TallerStyles.statCard, ...TallerStyles.statCardTotal }}>
              <h4 style={{ ...TallerStyles.statTitle, ...TallerStyles.statTitleTotal }}>
                Total Talleres
              </h4>
              <p style={TallerStyles.statValue}>{talleres.length}</p>
            </div>
            <div style={{ ...TallerStyles.statCard, ...TallerStyles.statCardTipos }}>
              <h4 style={{ ...TallerStyles.statTitle, ...TallerStyles.statTitleTipos }}>
                Tipos Únicos
              </h4>
              <p style={TallerStyles.statValue}>{uniqueTipos.length}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Talleres;