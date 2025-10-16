import React, { useState, useEffect } from "react";
import {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
  getAllPermissions,
  getPermissionsByRole,
  assignPermissionToRole,
  removePermissionFromRole,
  getUsersWithRoles,
  assignRoleToUser,
} from "../../../API/Admin/Roles";

import { styles } from "../../Components screens/Styles";

function RolesAdmin() {
  const [activeTab, setActiveTab] = useState("roles");
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(null);
  const [showUserRolesModal, setShowUserRolesModal] = useState(null);
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
      const [rolesData, permissionsData, usersData] = await Promise.all([
        getAllRoles(),
        getAllPermissions(),
        getUsersWithRoles(),
      ]);
      setRoles(rolesData || []);
      setPermissions(permissionsData || []);
      setUsers(usersData || []);

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

  const handleUserRoleToggle = async (userId, roleId) => {
    console.log("Toggling role - Input:", { userId, roleId });
    if (!userId || (roleId !== null && isNaN(roleId))) {
      setError("ID de usuario o rol inválido");
      return;
    }

    setOperationLoading(true);
    setError(null);
    try {
      const isAssigned = isRoleAssignedToUser(userId, roleId);
      await assignRoleToUser(userId, isAssigned ? null : roleId);
      const usersData = await getUsersWithRoles();
      setUsers(usersData);
    } catch (err) {
      const errorMessage = err.message || "Error al actualizar rol de usuario";
      if (err.message.includes("Usuario no encontrado")) {
        setError("El usuario no existe en la base de datos");
      } else if (err.message.includes("Rol no encontrado")) {
        setError("El rol seleccionado no existe");
      } else if (err.message.includes("Solicitud inválida")) {
        setError("Solicitud inválida: parámetros incorrectos");
      } else {
        setError(errorMessage);
      }
      console.error("Toggle error:", err);
    } finally {
      setOperationLoading(false);
    }
  };

  const getUserRoles = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (!user || !user.id_roles || !user.role_name) return [];
    return [{ id: user.id_roles, name: user.role_name }];
  };

  const isRoleAssignedToUser = (userId, roleId) => {
    const user = users.find((u) => u.id === userId);
    return user?.id_roles === roleId;
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

  const renderUserRolesModal = () => {
    if (!showUserRolesModal) return null;

    const user = users.find((u) => u.id === showUserRolesModal);
    console.log("Rendering modal - User:", user, "Roles:", roles);

    if (!user) {
      setError("Usuario no encontrado en la lista");
      setShowUserRolesModal(null);
      return null;
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">
              Rol para: {user?.user_name} ({user?.nombres} {user?.apellidopat})
            </h3>
            <button
              onClick={() => setShowUserRolesModal(null)}
              className="text-gray-400 hover:text-white text-3xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-gray-300 text-sm">
              Selecciona un rol para asignarlo al usuario. Cada usuario puede tener solo un rol asignado.
            </p>
            {error && (
              <div style={styles.errorMessage}>Error: {error}</div>
            )}

            <div className="grid gap-3">
              {roles.map((role) => (
                role.id && (
                  <label
                    key={role.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-700 rounded-lg cursor-pointer border border-gray-600"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isRoleAssignedToUser(showUserRolesModal, role.id)}
                        onChange={() => handleUserRoleToggle(showUserRolesModal, role.id)}
                        disabled={operationLoading}
                        className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-white font-medium">{role.name}</span>
                        <p className="text-gray-400 text-sm">
                          {role.descripcion || "Sin descripción"}
                        </p>
                        <p className="text-gray-400 text-sm">Ruta: {role.start_path}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          role.is_default
                            ? "bg-green-500/20 text-green-300"
                            : "bg-gray-500/20 text-gray-300"
                        }`}
                      >
                        {role.is_default ? "Por defecto" : "Opcional"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {(rolePermissions[role.id] || []).length} permisos
                      </span>
                    </div>
                  </label>
                )
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setShowUserRolesModal(null)}
              disabled={operationLoading}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderUsersTab = () => (
    <div className="space-y-6">
      <div style={styles.usersHeaderContainer}>
        <h3 style={styles.usersHeaderTitle}>Gestión de Usuarios y Roles</h3>
        <div style={styles.usersHeaderCount}>Total usuarios: {users.length}</div>
      </div>

      <div className="overflow-x-auto">
        <table style={styles.table}>
          <thead style={styles.tableHead}>
            <tr>
              <th style={styles.tableHeader}>Usuario</th>
              <th style={styles.tableHeader}>Email</th>
              <th style={styles.tableHeader}>Nombre Completo</th>
              <th style={styles.tableHeader}>Estado</th>
              <th style={styles.tableHeader}>Rol Actual</th>
              <th style={styles.tableHeaderCenter}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user.id}
                  style={{
                    ...styles.tableRow,
                    ...(index % 2 === 0 ? styles.tableRowAlternate : {}),
                  }}
                >
                  <td style={styles.tableCellBold}>{user.user_name}</td>
                  <td style={styles.tableCell}>{user.email || "Sin email"}</td>
                  <td style={styles.tableCell}>
                    {user.nombres} {user.apellidopat} {user.apellidomat || ""}
                  </td>
                  <td style={styles.tableCell}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        ...(user.status ? styles.statusActive : styles.statusInactive),
                      }}
                    >
                      {user.status ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    <div className="flex flex-wrap gap-1">
                      {getUserRoles(user.id).length > 0 ? (
                        getUserRoles(user.id).map((role) => (
                          <span key={role.id} style={styles.roleBadge}>
                            {role.name}
                          </span>
                        ))
                      ) : (
                        <span style={styles.noRoleText}>Sin rol</span>
                      )}
                    </div>
                  </td>
                  <td style={styles.tableCellCenter}>
                    <button
                      onClick={() => setShowUserRolesModal(user.id)}
                      disabled={operationLoading}
                      style={operationLoading ? styles.manageButtonDisabled : styles.manageButton}
                    >
                      Gestionar Rol
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={styles.noDataText} colSpan="6">
                  No hay usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={styles.statsContainer}>
        <div style={{ ...styles.statCard, ...styles.userStatCardUsers }}>
          <h4 style={{ ...styles.statTitle, ...styles.userStatTitleUsers }}>Usuarios Activos</h4>
          <p style={styles.statValue}>{users.filter((u) => u.status).length}</p>
        </div>
        <div style={{ ...styles.statCard, ...styles.userStatCardNoRole }}>
          <h4 style={{ ...styles.statTitle, ...styles.userStatTitleNoRole }}>Sin Rol</h4>
          <p style={styles.statValue}>{users.filter((u) => !u.id_roles).length}</p>
        </div>
        <div style={{ ...styles.statCard, ...styles.userStatCardWithRole }}>
          <h4 style={{ ...styles.statTitle, ...styles.userStatTitleWithRole }}>Con Rol Asignado</h4>
          <p style={styles.statValue}>{users.filter((u) => u.id_roles).length}</p>
        </div>
      </div>
    </div>
  );

  const renderPermissionsModal = () => {
    if (!showPermissionsModal) return null;

    const role = roles.find((r) => r.id === showPermissionsModal);
    const permissionCategories = getPermissionsByCategory();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">Permisos para: {role?.name}</h3>
            <button
              onClick={() => setShowPermissionsModal(null)}
              disabled={operationLoading}
              className="text-gray-400 hover:text-white text-3xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {error && (
              <div style={styles.errorMessage}>Error: {error}</div>
            )}

            {Object.entries(permissionCategories).map(([category, categoryPermissions]) => (
              <div key={category} className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4 capitalize">{category}</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categoryPermissions.map((permission) => (
                    <label
                      key={permission.id}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-600 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isPermissionAssigned(showPermissionsModal, permission.id)}
                        onChange={() =>
                          handlePermissionToggle(
                            showPermissionsModal,
                            permission.id,
                            isPermissionAssigned(showPermissionsModal, permission.id)
                          )
                        }
                        disabled={operationLoading}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-300 text-sm">
                        {permission.name.replace(category + ".", "")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setShowPermissionsModal(null)}
              disabled={operationLoading}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
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
      <div style={styles.tabContainer}>
        <div style={styles.tabWrapper}>
          <button
            onClick={() => setActiveTab("roles")}
            style={{
              ...styles.tabButton,
              ...(activeTab === "roles" ? styles.tabButtonActive : styles.tabButtonInactive),
            }}
          >
            Gestión de Roles
          </button>
          <button
            onClick={() => setActiveTab("users")}
            style={{
              ...styles.tabButton,
              ...(activeTab === "users" ? styles.tabButtonActive : styles.tabButtonInactive),
            }}
          >
            Usuarios y Roles
          </button>
        </div>
      </div>

      {loading && <p style={styles.loadingText}>Cargando datos...</p>}
      {error && <div style={styles.errorMessage}>Error: {error}</div>}

      {!loading && !error && (
        <div>
          {activeTab === "roles" && (
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
                              Gestionar ({(rolePermissions[role.id] || []).length})
                            </button>
                          </td>
                          <td style={styles.tableCellCenter}>
                            <button
                              onClick={() => handleEdit(role)}
                              disabled={operationLoading}
                              style={operationLoading ? styles.editButtonDisabled : styles.editButton}
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(role.id, role.name)}
                              disabled={operationLoading}
                              style={operationLoading ? styles.deleteButtonDisabled : styles.deleteButton}
                            >
                              Eliminar
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
            </div>
          )}

          {activeTab === "users" && renderUsersTab()}

          {renderPermissionsModal()}

          {renderUserRolesModal()}
        </div>
      )}
    </div>
  );
}

export default RolesAdmin;