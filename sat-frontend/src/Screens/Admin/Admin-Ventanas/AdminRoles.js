import React, { useState, useEffect } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { MdManageHistory } from "react-icons/md";
import {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
  getAllPermissions,
  getPermissionsByRole,
  assignPermissionToRole,
  removePermissionFromRole,
} from "../../../API/Admin/Roles";
import { styles } from "../../Components screens/Styles";

function RolesAdmin() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(null);
  const [newRole, setNewRole] = useState({
    name: "",
    descripcion: "",
    start_path: "",
    is_default: false,
    guard_name: "web",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [rolesData, permissionsData] = await Promise.all([
        getAllRoles(),
        getAllPermissions(),
      ]);
      setRoles(rolesData || []);
      setPermissions(permissionsData || []);

      const rolePermsMap = {};
      for (const role of rolesData || []) {
        try {
          const rolePerms = await getPermissionsByRole(role.id);
          rolePermsMap[role.id] = rolePerms;
        } catch (err) {
          console.warn(`Error al cargar permisos para el rol ${role.id}:`, err);
          rolePermsMap[role.id] = [];
        }
      }
      setRolePermissions(rolePermsMap);
    } catch (err) {
      setError(err.message || "Error al cargar datos");
      console.error("Fetch all data error:", err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.name.trim()) {
      errors.name = "El nombre del rol es obligatorio";
    }
    if (!data.start_path.trim()) {
      errors.start_path = "La ruta inicial es obligatoria";
    }
    if (!data.guard_name) {
      errors.guard_name = "El guard name es obligatorio";
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;

    if (editingRole) {
      setEditingRole((prev) => ({ ...prev, [name]: finalValue }));
    } else {
      setNewRole((prev) => ({ ...prev, [name]: finalValue }));
    }
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentRole = editingRole || newRole;
    const errors = validateForm(currentRole);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setOperationLoading(true);
    setError(null);
    try {
      if (editingRole) {
        await updateRole(editingRole.id, editingRole);
        setEditingRole(null);
      } else {
        await createRole(newRole);
        setNewRole({
          name: "",
          descripcion: "",
          start_path: "",
          is_default: false,
          guard_name: "web",
        });
      }
      await fetchAllData();
    } catch (err) {
      setError(err.message || "Error al procesar el rol");
    } finally {
      setOperationLoading(false);
    }
  };

  const handleEdit = (role) => {
    setEditingRole({ ...role });
    setFormErrors({});
  };

  const handleCancelEdit = () => {
    setEditingRole(null);
    setFormErrors({});
  };

  const handleDelete = async (id, roleName) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el rol "${roleName}"? Esta acción no se puede deshacer.`)) {
      setOperationLoading(true);
      setError(null);
      try {
        await deleteRole(id);
        await fetchAllData();
      } catch (err) {
        setError(err.message || "Error al eliminar el rol");
      } finally {
        setOperationLoading(false);
      }
    }
  };

  const handlePermissionToggle = async (roleId, permissionId, isAssigned) => {
    setOperationLoading(true);
    setError(null);
    try {
      if (isAssigned) {
        await removePermissionFromRole(roleId, permissionId);
      } else {
        await assignPermissionToRole(roleId, permissionId);
      }

      const rolePerms = await getPermissionsByRole(roleId);
      setRolePermissions((prev) => ({
        ...prev,
        [roleId]: rolePerms,
      }));
    } catch (err) {
      setError(err.message || "Error al actualizar permisos");
    } finally {
      setOperationLoading(false);
    }
  };

  const isPermissionAssigned = (roleId, permissionId) => {
    const rolePerms = rolePermissions[roleId] || [];
    return rolePerms.some((perm) => perm.id === permissionId);
  };

  const getPermissionsByCategory = () => {
    const categories = {};
    permissions.forEach((permission) => {
      const category = permission.name.split(".")[0];
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(permission);
    });
    return categories;
  };

  const renderPermissionsModal = () => {
    if (!showPermissionsModal) return null;

    const role = roles.find((r) => r.id === showPermissionsModal);
    if (!role) {
      setError("Rol no encontrado");
      setShowPermissionsModal(null);
      return null;
    }

    const permissionCategories = getPermissionsByCategory();

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
              Asignar Permisos a: {role.name}
            </h3>
            <button
              onClick={() => setShowPermissionsModal(null)}
              style={{
                color: "#a0aec0",
                fontSize: "24px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          {error && <p style={styles.errorMessage}>Error: {error}</p>}

          <div style={{ marginBottom: "24px" }}>
            <p style={{ color: "#e2e8f0", fontSize: "14px" }}>
              Selecciona los permisos para asignarlos al rol. Puedes asignar múltiples permisos.
            </p>
          </div>

          <div style={{ display: "grid", gap: "24px" }}>
            {Object.entries(permissionCategories).map(([category, categoryPermissions]) => (
              <div key={category} style={{
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid #4a5568",
              }}>
                <h4 style={{
                  fontSize: "18px",
                  fontWeight: "medium",
                  color: "#ffffff",
                  marginBottom: "16px",
                  textTransform: "capitalize",
                }}>
                  {category}
                </h4>
                <div style={{ display: "grid", gap: "12px" }}>
                  {categoryPermissions.map((permission) => (
                    <label
                      key={permission.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "12px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        backgroundColor: isPermissionAssigned(showPermissionsModal, permission.id) ? "#4a5568" : "transparent",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isPermissionAssigned(showPermissionsModal, permission.id)}
                        onChange={() => handlePermissionToggle(showPermissionsModal, permission.id, isPermissionAssigned(showPermissionsModal, permission.id))}
                        disabled={operationLoading}
                        style={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: "#2d3748",
                          borderColor: "#4a5568",
                          borderRadius: "4px",
                          marginRight: "12px",
                        }}
                      />
                      <span style={{ color: "#ffffff", fontSize: "14px" }}>
                        {permission.name.replace(category + ".", "")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
            <button
              onClick={() => setShowPermissionsModal(null)}
              disabled={operationLoading}
              style={{
                ...styles.cancelButton,
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
    <div style={styles.container}>
      <h2 style={styles.title}>Administración de Roles y Permisos</h2>

      {loading && <p style={styles.loadingText}>Cargando datos...</p>}
      {error && <div style={styles.errorMessage}>Error: {error}</div>}

      {!loading && !error && (
        <div>
          <div style={styles.rolesTableContainer}>
            <table style={styles.table}>
              <thead style={styles.tableHead}>
                <tr>
                  <th style={styles.tableHeader}>ID</th>
                  <th style={styles.tableHeader}>Nombre</th>
                  <th style={styles.tableHeader}>Descripción</th>
                  <th style={styles.tableHeader}>Ruta Inicial</th>
                  <th style={styles.tableHeader}>Guard</th>
                  <th style={styles.tableHeader}>Por Defecto</th>
                  <th style={styles.tableHeader}>Permisos</th>
                  <th style={styles.tableHeaderCenter}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {roles.length > 0 ? (
                  roles.map((role, index) => (
                    <tr
                      key={role.id}
                      style={{
                        ...styles.tableRow,
                        ...(index % 2 === 0 ? styles.tableRowAlternate : {}),
                      }}
                    >
                      <td style={styles.tableCell}>{role.id}</td>
                      <td style={styles.tableCellBold}>{role.name}</td>
                      <td style={styles.tableCell}>{role.descripcion || "Sin descripción"}</td>
                      <td style={styles.tableCell}>
                        <code style={styles.code}>{role.start_path}</code>
                      </td>
                      <td style={styles.tableCell}>{role.guard_name}</td>
                      <td style={styles.tableCell}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            ...(role.is_default ? styles.statusDefault : styles.statusNotDefault),
                          }}
                        >
                          {role.is_default ? "Sí" : "No"}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <button
                          onClick={() => setShowPermissionsModal(role.id)}
                          disabled={operationLoading}
                          style={operationLoading ? styles.manageButtonDisabled : styles.manageButton}
                        >
                          <MdManageHistory /> ({(rolePermissions[role.id] || []).length})
                        </button>
                      </td>
                      <td style={styles.tableCellCenter}>
                        <button
                          onClick={() => handleEdit(role)}
                          disabled={operationLoading}
                          style={operationLoading ? styles.editButtonDisabled : styles.editButton}
                        >
                          <AiFillEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(role.id, role.name)}
                          disabled={operationLoading}
                          style={operationLoading ? styles.deleteButtonDisabled : styles.deleteButton}
                        >
                          <AiFillDelete />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={styles.noDataText} colSpan="8">
                      No hay roles registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={styles.formContainer}>
            <h3 style={styles.formTitle}>{editingRole ? "Editar Rol" : "Agregar Nuevo Rol"}</h3>
            <form onSubmit={handleSubmit}>
              {error && <div style={styles.errorMessage}>Error: {error}</div>}
              <div style={styles.formGrid}>
                <div>
                  <label style={styles.formLabel}>Nombre del Rol:</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Ej: Administrador, Docente, Estudiante"
                    value={editingRole ? editingRole.name : newRole.name}
                    onChange={handleChange}
                    required
                    disabled={operationLoading}
                    style={formErrors.name ? styles.formInputError : styles.formInput}
                  />
                  {formErrors.name && <p style={styles.formErrorText}>{formErrors.name}</p>}
                </div>

                <div>
                  <label style={styles.formLabel}>Descripción:</label>
                  <input
                    type="text"
                    name="descripcion"
                    placeholder="Ej: Rol con acceso completo al sistema"
                    value={editingRole ? editingRole.descripcion || "" : newRole.descripcion}
                    onChange={handleChange}
                    disabled={operationLoading}
                    style={styles.formInput}
                  />
                </div>

                <div>
                  <label style={styles.formLabel}>Ruta Inicial:</label>
                  <input
                    type="text"
                    name="start_path"
                    placeholder="Ej: /admin, /docente, /estudiante"
                    value={editingRole ? editingRole.start_path : newRole.start_path}
                    onChange={handleChange}
                    required
                    disabled={operationLoading}
                    style={formErrors.start_path ? styles.formInputError : styles.formInput}
                  />
                  {formErrors.start_path && (
                    <p style={styles.formErrorText}>{formErrors.start_path}</p>
                  )}
                </div>

                <div>
                  <label style={styles.formLabel}>Guard Name:</label>
                  <select
                    name="guard_name"
                    value={editingRole ? editingRole.guard_name : newRole.guard_name}
                    onChange={handleChange}
                    disabled={operationLoading}
                    style={formErrors.guard_name ? styles.formInputError : styles.formInput}
                  >
                    <option value="web">Web</option>
                    <option value="api">API</option>
                  </select>
                  {formErrors.guard_name && (
                    <p style={styles.formErrorText}>{formErrors.guard_name}</p>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={styles.formCheckboxLabel}>
                  <input
                    type="checkbox"
                    name="is_default"
                    checked={editingRole ? editingRole.is_default : newRole.is_default}
                    onChange={handleChange}
                    disabled={operationLoading}
                    style={styles.formCheckbox}
                  />
                  Rol por defecto para nuevos usuarios
                </label>
              </div>

              <div style={styles.formButtonContainer}>
                <button
                  type="submit"
                  disabled={operationLoading}
                  style={{
                    ...styles.submitButton,
                    ...(editingRole ? styles.submitButtonUpdate : styles.submitButtonCreate),
                    ...(operationLoading ? styles.submitButtonDisabled : {}),
                  }}
                >
                  {operationLoading
                    ? "Procesando..."
                    : editingRole
                    ? "Actualizar Rol"
                    : "Crear Rol"}
                </button>

                {editingRole && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={operationLoading}
                    style={operationLoading ? styles.cancelButtonDisabled : styles.cancelButton}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div style={styles.statsContainer}>
            <div style={{ ...styles.statCard, ...styles.statCardRoles }}>
              <h4 style={{ ...styles.statTitle, ...styles.statTitleRoles }}>Total Roles</h4>
              <p style={styles.statValue}>{roles.length}</p>
            </div>
            <div style={{ ...styles.statCard, ...styles.statCardPermissions }}>
              <h4 style={{ ...styles.statTitle, ...styles.statTitlePermissions }}>
                Total Permisos
              </h4>
              <p style={styles.statValue}>{permissions.length}</p>
            </div>
            <div style={{ ...styles.statCard, ...styles.statCardDefaultRoles }}>
              <h4 style={{ ...styles.statTitle, ...styles.statTitleDefaultRoles }}>
                Roles por Defecto
              </h4>
              <p style={styles.statValue}>{roles.filter((r) => r.is_default).length}</p>
            </div>
          </div>

          {renderPermissionsModal()}
        </div>
      )}
    </div>
  );
}

export default RolesAdmin;