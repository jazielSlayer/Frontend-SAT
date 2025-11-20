import React, { useState, useEffect } from "react";
import { getDocentes, createDocente, updateDocente, deleteDocente } from "../../../API/Admin/Docente_admin";
import { getAllPersonas } from "../../../API/Admin/Persona";

import { AiFillDelete, AiFillEdit } from "react-icons/ai";

function DocenteAdmin() {
  const [docentes, setDocentes] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDocente, setEditingDocente] = useState(null);
  const [showModal, setShowModal] = useState(false);
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
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (docente) => {
    setEditingDocente(docente);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingDocente(null);
    setNewDocente({
      per_id: "",
      numero_item: "",
      especialidad: "",
      tipo_contrato: "permanente",
      estado: true,
    });
    setShowModal(true);
  };

  const handleCancelEdit = () => {
    setEditingDocente(null);
    setShowModal(false);
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
    <div className="containerTab">

      {/* ---------------- TÍTULO + BOTÓN A LA DERECHA ---------------- */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "20px",
        width: "100%"
      }}>
        <h2 style={{ 
          fontFamily: "'Poppins', 'Segoe UI', sans-serif",
          fontSize: "32px",
          fontWeight: "600",
          color: "#ffffffff",
          margin: 0,
          textAlign: "center",
          flex: 1,
          letterSpacing: "-0.5 px"
        }}>
          Administración de Docentes
        </h2>

        <button
          onClick={handleAdd}
          style={{
            padding: "10px 20px",
            backgroundColor: "#66bb6a",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          + Agregar Docente
        </button>
      </div>
      {/* --------------------------------------------------------------- */}

      {loading && <p className="loadingText">Cargando docentes...</p>}
      {error && <p className="errorText">Error: {error}</p>}

      {!loading && !error && (
        <>
          <div className="tableContainer">
            <table className="table">
              <thead className="tableHead">
                <tr>
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
                      className={`tableRow ${index % 2 === 0 ? "tableRowAlternate" : ""}`}
                    >
                      <td className="tableCellBold">
                        {getPersonaName(docente.per_id)}
                      </td>
                      <td className="tableCell">{docente.numero_item}</td>
                      <td className="tableCell">{docente.especialidad}</td>
                      <td className="tableCell">
                        <span
                          className={`statusBadge ${
                            docente.tipo_contrato === "permanente" ? "statusPermanente" : "statusTemporal"
                          }`}
                        >
                          {docente.tipo_contrato}
                        </span>
                      </td>
                      <td className="tableCell">
                        <span
                          className={`statusBadge ${
                            docente.estado === 1 ? "statusActive" : "statusInactive"
                          }`}
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
                    <td className="noDataText" colSpan="6">
                      No hay docentes registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="statsContainer">
            <div className="statCard statCardTotal">
              <h4 className="statTitle statTitleTotal">Total Docentes</h4>
              <p className="statValue">{docentes.length}</p>
            </div>

            <div className="statCard statCardTipos">
              <h4 className="statTitle statTitleTipos">Docentes Activos</h4>
              <p className="statValue">
                {docentes.filter((d) => d.estado).length}
              </p>
            </div>

            <div className="statCard statCardPermanente">
              <h4 className="statTitle statTitlePermanente">Permanentes</h4>
              <p className="statValue">
                {docentes.filter((d) => d.tipo_contrato === "permanente").length}
              </p>
            </div>
          </div>
        </>
      )}

      {/* ---------------------- MODAL ---------------------- */}
      {showModal && (
        <div className="modal-overlay-emergente" onClick={handleCancelEdit}>
          <div className="modal-emergente" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCancelEdit}>
              ×
            </button>

            <h3 className="modal-title">
              {editingDocente ? "Editar Docente" : "Nuevo Docente"}
            </h3>

            <form onSubmit={handleSubmit} className="modal-form">

              <div className="form-section">
                <h4 className="section-title">Datos personales</h4>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Persona:</label>
                    <select
                      name="per_id"
                      value={editingDocente ? editingDocente.per_id : newDocente.per_id}
                      onChange={handleChange}
                      required
                      className="form-input-modal"
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

                  <div className="form-group">
                    <label className="form-label">Número de Item:</label>
                    <input
                      type="text"
                      name="numero_item"
                      placeholder="Ej: DOC001"
                      value={editingDocente ? editingDocente.numero_item : newDocente.numero_item}
                      onChange={handleChange}
                      required
                      className="form-input-modal"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Especialidad:</label>
                    <input
                      type="text"
                      name="especialidad"
                      placeholder="Ej: Matemáticas, Física, etc."
                      value={editingDocente ? editingDocente.especialidad : newDocente.especialidad}
                      onChange={handleChange}
                      required
                      className="form-input-modal"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tipo de Contrato:</label>
                    <select
                      name="tipo_contrato"
                      value={editingDocente ? editingDocente.tipo_contrato : newDocente.tipo_contrato}
                      onChange={handleChange}
                      className="form-input-modal"
                    >
                      <option value="permanente">Permanente</option>
                      <option value="temporal">Temporal</option>
                      <option value="interino">Interino</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-checkbox">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="estado"
                      checked={editingDocente ? editingDocente.estado : newDocente.estado}
                      onChange={handleChange}
                      className="checkbox-input"
                    />
                    <span>Docente Activo</span>
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={handleCancelEdit} className="btn-cancel">
                  Cancelar
                </button>

                <button type="submit" className="btn-submit">
                  {editingDocente ? "Guardar" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------- ESTILOS (sin cambios excepto botón) ------------ */}
      <style jsx>{`
        .modal-overlay-emergente {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .modal-emergente {
          background: #0f133fff;
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
          width: 90%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          animation: slideDown 0.3s ease-out;
        }

        .modal-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: transparent;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #fff;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s ease;
          z-index: 10;
          line-height: 1;
        }

        .modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .modal-title {
          margin: 0;
          padding: 24px 30px;
          font-size: 20px;
          font-weight: 500;
          color: #fff;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px 8px 0 0;
          padding-right: 60px;
        }

        .modal-form {
          padding: 30px;
        }

        .form-section {
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 16px;
          font-weight: 500;
          color: #fff;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .form-row {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: #fff;
          margin-bottom: 8px;
        }

        .form-input-modal {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          font-size: 14px;
          transition: border-color 0.2s;
          box-sizing: border-box;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .form-input-modal:focus {
          outline: none;
          border-color: #64b5f6;
          box-shadow: 0 0 0 3px rgba(100, 181, 246, 0.2);
        }

        .form-input-modal option {
          background: #000000ff;
          color: #fff;
        }

        .form-group-checkbox {
          margin: 20px 0;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-size: 14px;
          color: #fff;
        }

        .checkbox-input {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-cancel {
          padding: 10px 24px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          background: transparent;
          color: #fff;
          transition: all 0.2s;
        }

        .btn-cancel:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .btn-submit {
          padding: 10px 24px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          background: #66bb6a;
          color: white;
          transition: all 0.2s;
        }

        .btn-submit:hover {
          background: #0ec3dbff;
          box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
        }

        .modal-emergente::-webkit-scrollbar {
          width: 6px;
        }

        .modal-emergente::-webkit-scrollbar-track {
          background: transparent;
        }

        .modal-emergente::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }

        .modal-emergente::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        @media (max-width: 768px) {
          .modal-emergente {
            width: 95%;
            max-height: 95vh;
          }

          .modal-title {
            padding: 20px;
            font-size: 18px;
          }

          .modal-form {
            padding: 20px;
          }

          .form-row {
            gap: 15px;
          }

          .modal-actions {
            flex-direction: column-reverse;
          }

          .btn-cancel,
          .btn-submit {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default DocenteAdmin;
