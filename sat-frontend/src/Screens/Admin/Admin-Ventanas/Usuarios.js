import React, { useEffect, useState } from "react";
import { getUser, saveUser, updateUser, deleteUser  } from "../../../API/Admin/Users_Admin";
import { getUsersWithRoles, getAllRoles, assignRoleToUser } from "../../../API/Admin/Roles.js";
import { TallerStyles } from "../../Components screens/Styles.js";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { MdManageAccounts } from "react-icons/md"
import { buildPDFAdmin } from "../../../API/Admin/PDFs.js";


function Usuarios() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showUserRolesModal, setShowUserRolesModal] = useState(null);
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    nombres: "",
    apellidopat: "",
    apellidomat: "",
    carnet: "",
    id_roles: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, rolesData] = await Promise.all([
          getUsersWithRoles(),
          getAllRoles(),
        ]);
        console.log("Users Data:", usersData);
        console.log("Roles Data:", rolesData);

        const usersArray = Array.isArray(usersData) ? usersData : (usersData?.data || []);
        const rolesArray = Array.isArray(rolesData) ? rolesData : (rolesData?.data || []);

        setUsers(usersArray);
        setRoles(rolesArray);
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
        user_name: formData.user_name,
        email: formData.email,
        nombres: formData.nombres,
        apellidopat: formData.apellidopat || null,
        apellidomat: formData.apellidomat || null,
        carnet: formData.carnet || null,
        id_roles: parseInt(formData.id_roles) || null,
      };

      if (editingUser) {
        await updateUser(editingUser.id, dataToSend);
      } else {
        await saveUser(dataToSend);
      }
      const usersData = await getUsersWithRoles();
      setUsers(Array.isArray(usersData) ? usersData : (usersData?.data || []));
      setFormData({
        user_name: "",
        email: "",
        nombres: "",
        apellidopat: "",
        apellidomat: "",
        carnet: "",
        id_roles: "",
      });
      setEditingUser(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = async (id) => {
    try {
      const userData = await getUser(id);
      setFormData({
        user_name: userData.user_name || "",
        email: userData.email || "",
        nombres: userData.nombres || "",
        apellidopat: userData.apellidopat || "",
        apellidomat: userData.apellidomat || "",
        carnet: userData.carnet || "",
        id_roles: userData.id_roles || "",
      });
      setEditingUser(userData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setFormData({
      user_name: "",
      email: "",
      nombres: "",
      apellidopat: "",
      apellidomat: "",
      carnet: "",
      id_roles: "",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await deleteUser(id);
        const usersData = await getUsersWithRoles();
        setUsers(Array.isArray(usersData) ? usersData : (usersData?.data || []));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleUserRoleToggle = async (userId, roleId) => {
    setOperationLoading(true);
    setError(null);
    try {
      await assignRoleToUser(userId, roleId);
      const usersData = await getUsersWithRoles();
      setUsers(Array.isArray(usersData) ? usersData : (usersData?.data || []));
      setShowUserRolesModal(null);
    } catch (err) {
      setError(err.message || "Error al asignar rol");
    } finally {
      setOperationLoading(false);
    }
  };

  const isRoleAssignedToUser = (userId, roleId) => {
    const user = users.find((u) => u.id === userId);
    return user?.id_roles === roleId;
  };

  const uniqueRoles = [...new Set(users.map((u) => u.id_roles).filter(Boolean))];

  const renderUserRolesModal = () => {
    if (!showUserRolesModal) return null;

    const user = users.find((u) => u.id === showUserRolesModal);
    if (!user) {
      setError("Usuario no encontrado");
      setShowUserRolesModal(null);
      return null;
    }

    return (
      <div style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "16px",
      }}>
        <div style={{
          backgroundColor: "#2d3748",
          borderRadius: "12px",
          padding: "24px",
          maxWidth: "800px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}>
            <h3 style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#ffffff",
            }}>
              Asignar Rol a: {user.user_name} ({user.nombres} {user.apellidopat})
            </h3>
            <button
              onClick={() => setShowUserRolesModal(null)}
              style={{
                color: "#a0aec0",
                fontSize: "24px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          {error && <p className="errorText">Error: {error}</p>}

          <div style={{ marginBottom: "24px" }}>
            <p style={{ color: "#e2e8f0", fontSize: "14px" }}>
              Selecciona un rol para asignarlo al usuario. Solo se puede asignar un rol por usuario.
            </p>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            {roles.map((role) => (
              <label
                key={role.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid #4a5568",
                  cursor: "pointer",
                  backgroundColor: isRoleAssignedToUser(showUserRolesModal, role.id) ? "#4a5568" : "transparent",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <input
                    type="checkbox"
                    checked={isRoleAssignedToUser(showUserRolesModal, role.id)}
                    onChange={() => handleUserRoleToggle(showUserRolesModal, role.id)}
                    disabled={operationLoading}
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#2d3748",
                      borderColor: "#4a5568",
                      borderRadius: "4px",
                    }}
                  />
                  <div>
                    <span style={{ color: "#ffffff", fontWeight: "medium" }}>{role.name}</span>
                    <p style={{ color: "#a0aec0", fontSize: "12px" }}>
                      {role.descripcion || "Sin descripción"}
                    </p>
                    <p style={{ color: "#a0aec0", fontSize: "12px" }}>Ruta: {role.start_path}</p>
                  </div>
                </div>
                <span style={{
                  padding: "4px 8px",
                  borderRadius: "9999px",
                  fontSize: "12px",
                  fontWeight: "medium",
                  backgroundColor: role.is_default ? "rgba(34, 197, 94, 0.2)" : "rgba(107, 114, 128, 0.2)",
                  color: role.is_default ? "#34d399" : "#a0aec0",
                }}>
                  {role.is_default ? "Por defecto" : "Opcional"}
                </span>
              </label>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
            <button
              onClick={() => setShowUserRolesModal(null)}
              disabled={operationLoading}
              style={{
                ...TallerStyles.cancelButton,
                ...(operationLoading ? { opacity: 0.5, cursor: "not-allowed" } : {}),
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 min-h-screen p-4 " style={{color: "white"}}>
      <h2 className="title">Gestión de Usuarios</h2>

      {loading && <p className="loadingText">Cargando usuarios...</p>}
      {error && <p className="errorText">Error: {error}</p>}

      {!loading && !error && (
        <>
        <div className="stats-container">
            <div style={{ ...TallerStyles.statCard, ...TallerStyles.statCardTotal }}>
              <h4 style={{ ...TallerStyles.statTitle, ...TallerStyles.statTitleTotal }}>
                Total Usuarios
              </h4>
              <p className="statValue">{users.length}</p>
            </div>
            <div style={{ ...TallerStyles.statCard, ...TallerStyles.statCardTipos }}>
              <h4 style={{ ...TallerStyles.statTitle, ...TallerStyles.statTitleTipos }}>
                Roles Únicos
              </h4>
              <p className="statValue">{uniqueRoles.length}</p>
            </div>
          </div>
          <div className="formContainer">
            <button style={{...TallerStyles.cancelButton,...(operationLoading ? { opacity: 0.5, cursor: "not-allowed" } : {}),}} 
                onClick={buildPDFAdmin}
                >
                  PDF
            </button>
          </div>
          
          <div className="tableContainer">
            <table className="table">
              <thead className="tableHead">
                <tr>
                  <th className="tableHeader">Usuario</th>
                  <th className="tableHeader">Nombre</th>
                  <th className="tableHeader">Apellido Paterno</th>
                  <th className="tableHeader">Apellido Materno</th>
                  <th className="tableHeader">Rol</th>
                  <th className="tableHeader">Email</th>
                  <th className="tableHeader">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr
                      key={user.id}
                      style={{
                        ...TallerStyles.tableRow,
                        ...(index % 2 === 0 ? TallerStyles.tableRowAlternate : {}),
                      }}
                    >
                      <td className="tableCellBold">{user.user_name}</td>
                      <td className="tableCell">{user.nombres}</td>
                      <td className="tableCell">{user.apellidopat || "-"}</td>
                      <td className="tableCell">{user.apellidomat || "-"}</td>
                      <td className="tableCell">{user.role_name || "-"}</td>
                      <td className="tableCell">{user.email}</td>
                      <td className="tableCell">
                        <div className="actionContainer">
                          <button
                            onClick={() => handleEdit(user.id)}
                            className="editButton"
                          >
                            <AiFillEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="deleteButton"
                          >
                            <AiFillDelete />
                          </button>
                          <button
                            onClick={() => setShowUserRolesModal(user.id)}
                            className="editButton"
                          >
                            <MdManageAccounts />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="noDataText" colSpan="8">
                      No hay usuarios registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="formContainer">
            <h3 className="formTitle">
              {editingUser ? "Editar Usuario" : "Agregar Nuevo Usuario"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="formGrid">
                <div>
                  <label className="formLabel">Nombre de Usuario:</label>
                  <input
                    type="text"
                    name="user_name"
                    placeholder="Nombre de usuario"
                    value={formData.user_name}
                    onChange={handleInputChange}
                    required
                    className="formInput"
                  />
                </div>
                <div>
                  <label className="formLabel">Email:</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="formInput"
                  />
                </div>
                <div>
                  <label className="formLabel">Nombres:</label>
                  <input
                    type="text"
                    name="nombres"
                    placeholder="Nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    required
                    className="formInput"
                  />
                </div>
                <div>
                  <label className="formLabel">Apellido Paterno:</label>
                  <input
                    type="text"
                    name="apellidopat"
                    placeholder="Apellido Paterno"
                    value={formData.apellidopat}
                    onChange={handleInputChange}
                    className="formInput"
                  />
                </div>
                <div>
                  <label className="formLabel">Apellido Materno:</label>
                  <input
                    type="text"
                    name="apellidomat"
                    placeholder="Apellido Materno"
                    value={formData.apellidomat}
                    onChange={handleInputChange}
                    className="formInput"
                  />
                </div>
                <div>
                  <label className="formLabel">Carnet:</label>
                  <input
                    type="text"
                    name="carnet"
                    placeholder="Carnet"
                    value={formData.carnet}
                    onChange={handleInputChange}
                    className="formInput"
                  />
                </div>
                <div>
                  <label className="formLabel">Rol:</label>
                  <select
                    name="id_roles"
                    value={formData.id_roles}
                    onChange={handleInputChange}
                    required
                    className="formInput"
                  >
                    <option value="">Selecciona Rol</option>
                    {roles.length > 0 ? (
                      roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No hay roles disponibles</option>
                    )}
                  </select>
                </div>
              </div>
              <div className="formButtonContainer">
                <button
                  type="submit"
                  className={`submitButton ${
                    editingUser ? "submitButtonUpdate" : "submitButtonCreate"
                  }`}
                >
                  {editingUser ? "Actualizar Usuario" : "Agregar Usuario"}
                </button>
                
                {editingUser && (
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
          
          

          {renderUserRolesModal()}
        </>
      )}
    </div>
  );
}

export default Usuarios;