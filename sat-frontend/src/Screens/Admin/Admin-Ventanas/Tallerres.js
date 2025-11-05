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
    <div className="bg-gray-900 min-h-screen p-4 " style={{color: "white"}}>
      <h2 className="title">Gestión de Talleres</h2>

      {loading && <p className="loadingText">Cargando talleres...</p>}
      {error && <p className="errorText">Error: {error}</p>}

      {!loading && !error && (
        <>
          <div className="tableContainer">
            <table className="table">
              <thead className="tableHead">
                <tr>
                  <th className="tableHeader">ID</th>
                  <th className="tableHeader">Título</th>
                  <th className="tableHeader">Metodología</th>
                  <th className="tableHeader">Tipo</th>
                  <th className="tableHeader">Evaluación</th>
                  <th className="tableHeader">Duración</th>
                  <th className="tableHeader">Resultado</th>
                  <th className="tableHeader">Fecha</th>
                  <th className="tableHeader">Acciones</th>
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
                      <td className="tableCell">{taller.id}</td>
                      <td className="tableCellBold">{taller.titulo}</td>
                      <td className="tableCell">{getMetodologiaNombre(taller.id_metodologia)}</td>
                      <td className="tableCell">{taller.tipo_taller}</td>
                      <td className="tableCell">{taller.evaluacion_final || "-"}</td>
                      <td className="tableCell">{taller.duracion || "-"}</td>
                      <td className="tableCell">{taller.resultado || "-"}</td>
                      <td className="tableCell">{taller.fecha_realizacion}</td>
                      <td className="tableCell">
                        <div className="actionContainer">
                          <button
                            onClick={() => handleEdit(taller.id)}
                            className="editButton"
                          >
                            <AiFillEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(taller.id)}
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
                    <td className="noDataText" colSpan="9">
                      No hay talleres registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="formContainer">
            <h3 className="formTitle">
              {editingTaller ? "Editar Taller" : "Agregar Nuevo Taller"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="formGrid">
                <div>
                  <label className="formLabel">Título:</label>
                  <input
                    type="text"
                    name="titulo"
                    placeholder="Título"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    required
                    className="formInput"
                  />
                </div>
                <div>
                  <label className="formLabel">Metodología:</label>
                  <select
                    name="id_metodologia"
                    value={formData.id_metodologia}
                    onChange={handleInputChange}
                    required
                    className="formInput"
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
                  <label className="formLabel">Tipo de Taller:</label>
                  <select
                    name="tipo_taller"
                    value={formData.tipo_taller}
                    onChange={handleInputChange}
                    required
                    className="formInput"
                  >
                    <option value="">Selecciona Tipo</option>
                    <option value="Teórico">Teórico</option>
                    <option value="Práctico">Práctico</option>
                    <option value="Mixto">Mixto</option>
                  </select>
                </div>
                <div>
                  <label className="formLabel">Evaluación Final:</label>
                  <input
                    type="text"
                    name="evaluacion_final"
                    placeholder="Evaluación Final"
                    value={formData.evaluacion_final}
                    onChange={handleInputChange}
                    className="formInput"
                  />
                </div>
                <div>
                  <label className="formLabel">Duración:</label>
                  <input
                    type="text"
                    name="duracion"
                    placeholder="Duración"
                    value={formData.duracion}
                    onChange={handleInputChange}
                    className="formInput"
                  />
                </div>
                <div>
                  <label className="formLabel">Resultado:</label>
                  <input
                    type="text"
                    name="resultado"
                    placeholder="Resultado"
                    value={formData.resultado}
                    onChange={handleInputChange}
                    className="formInput"
                  />
                </div>
                <div>
                  <label className="formLabel">Fecha de Realización:</label>
                  <input
                    type="date"
                    name="fecha_realizacion"
                    value={formData.fecha_realizacion}
                    onChange={handleInputChange}
                    required
                    className="formInput"
                  />
                </div>
              </div>
              <div className="formButtonContainer">
                <button
                  type="submit"
                  className={`submitButton ${
                    editingTaller ? "submitButtonUpdate" : "submitButtonCreate"
                  }`}
                >
                  {editingTaller ? "Actualizar Taller" : "Agregar Taller"}
                </button>
                {editingTaller && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="cancelButton"
                  >
                    Cancelar Edición
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="statsContainer">
            <div className={`statCard statCardTotal`}>
              <h4 className={`statTitle statTitleTotal`}>
                Total Talleres
              </h4>
              <p className="statValue">{talleres.length}</p>
            </div>
            <div className={`statCard statCardTipos`}>
              <h4 className={`statTitle statTitleTipos`}>
                Tipos Únicos
              </h4>
              <p className={`statValue`}>{uniqueTipos.length}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Talleres;