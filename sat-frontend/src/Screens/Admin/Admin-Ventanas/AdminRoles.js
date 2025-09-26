// sat-frontend/src/Screens/Admin/Admin-Ventanas/Roles-Admin.js
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
  removeRoleFromUser
} from "../../../API/Admin/Roles";

function RolesAdmin() {
  const [activeTab, setActiveTab] = useState('roles');
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(null);
  const [showUserRolesModal, setShowUserRolesModal] = useState(null);
  const [newRole, setNewRole] = useState({
    name: "",
    start_path: "",
    is_default: false,
    guard_name: "web",
  });

  // Cargar datos iniciales
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
        getUsersWithRoles()
      ]);
      setRoles(rolesData);
      setPermissions(permissionsData);
      setUsers(usersData);
      
      // Cargar permisos para cada rol
      const rolePermsMap = {};
      for (const role of rolesData) {
        try {
          const rolePerms = await getPermissionsByRole(role.id);
          rolePermsMap[role.id] = rolePerms;
        } catch (err) {
          console.warn(`Error loading permissions for role ${role.id}:`, err);
          rolePermsMap[role.id] = [];
        }
      }
      setRolePermissions(rolePermsMap);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;
    
    if (editingRole) {
      setEditingRole((prev) => ({ ...prev, [name]: finalValue }));
    } else {
      setNewRole((prev) => ({ ...prev, [name]: finalValue }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await updateRole(editingRole.id, editingRole);
        setEditingRole(null);
      } else {
        await createRole(newRole);
        setNewRole({
          name: "",
          start_path: "",
          is_default: false,
          guard_name: "web",
        });
      }
      fetchAllData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
  };

  const handleCancelEdit = () => {
    setEditingRole(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este rol? Esta acción no se puede deshacer.")) {
      try {
        await deleteRole(id);
        fetchAllData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handlePermissionToggle = async (roleId, permissionId, isAssigned) => {
    try {
      if (isAssigned) {
        await removePermissionFromRole(roleId, permissionId);
      } else {
        await assignPermissionToRole(roleId, permissionId);
      }
      
      // Recargar permisos del rol
      const rolePerms = await getPermissionsByRole(roleId);
      setRolePermissions(prev => ({
        ...prev,
        [roleId]: rolePerms
      }));
    } catch (err) {
      alert('Error al actualizar permisos: ' + err.message);
    }
  };

  const isPermissionAssigned = (roleId, permissionId) => {
    const rolePerms = rolePermissions[roleId] || [];
    return rolePerms.some(perm => perm.id === permissionId);
  };

  const handleUserRoleToggle = async (userId, roleId, isAssigned) => {
    try {
      if (isAssigned) {
        await removeRoleFromUser(userId, roleId);
      } else {
        await assignRoleToUser(userId, roleId);
      }
      
      // Recargar datos de usuarios
      const usersData = await getUsersWithRoles();
      setUsers(usersData);
    } catch (err) {
      alert('Error al actualizar roles de usuario: ' + err.message);
    }
  };

  const getUserRoles = (userId) => {
    const user = users.find(u => u.id === userId);
    return user?.roles || [];
  };

  const isRoleAssignedToUser = (userId, roleId) => {
    const userRoles = getUserRoles(userId);
    return userRoles.some(role => role.id === roleId);
  };

  const getPermissionsByCategory = () => {
    const categories = {};
    permissions.forEach(permission => {
      const category = permission.name.split('.')[0];
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(permission);
    });
    return categories;
  };

  const renderUserRolesModal = () => {
    if (!showUserRolesModal) return null;

    const user = users.find(u => u.id === showUserRolesModal);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">
              Roles para: {user?.user_name} ({user?.nombres} {user?.apellidopat})
            </h3>
            <button
              onClick={() => setShowUserRolesModal(null)}
              className="text-gray-400 hover:text-white text-3xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-gray-300 mb-4">
              Selecciona los roles que quieres asignar a este usuario:
            </p>
            
            <div className="grid gap-3">
              {roles.map((role) => (
                <label
                  key={role.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-700 rounded-lg cursor-pointer border border-gray-600"
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isRoleAssignedToUser(showUserRolesModal, role.id)}
                      onChange={(e) => handleUserRoleToggle(
                        showUserRolesModal,
                        role.id,
                        !e.target.checked
                      )}
                      className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-white font-medium">{role.name}</span>
                      <p className="text-gray-400 text-sm">Ruta: {role.start_path}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      role.is_default ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                    }`}>
                      {role.is_default ? 'Por defecto' : 'Opcional'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {(rolePermissions[role.id] || []).length} permisos
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setShowUserRolesModal(null)}
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
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">Gestión de Usuarios y Roles</h3>
        <div className="text-sm text-gray-300">
          Total usuarios: {users.length}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table style={{ 
          width: "100%", 
          borderCollapse: "collapse", 
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          borderRadius: "8px",
          overflow: "hidden"
        }}>
          <thead style={{ backgroundColor: "#333" }}>
            <tr>
              <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Usuario</th>
              <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Email</th>
              <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Nombre Completo</th>
              <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Estado</th>
              <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Roles Actuales</th>
              <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr 
                  key={user.id} 
                  style={{ 
                    borderBottom: "1px solid #555",
                    backgroundColor: index % 2 === 0 ? "rgba(255,255,255,0.05)" : "transparent"
                  }}
                >
                  <td style={{ padding: "12px", fontWeight: "bold" }}>{user.user_name}</td>
                  <td style={{ padding: "12px" }}>{user.email || 'Sin email'}</td>
                  <td style={{ padding: "12px" }}>
                    {user.nombres} {user.apellidopat} {user.apellidomat}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor: user.status ? "#4CAF50" : "#F44336",
                      color: "white",
                      fontSize: "12px"
                    }}>
                      {user.status ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div className="flex flex-wrap gap-1">
                      {getUserRoles(user.id).length > 0 ? (
                        getUserRoles(user.id).map((role) => (
                          <span
                            key={role.id}
                            style={{
                              padding: "2px 6px",
                              borderRadius: "4px",
                              backgroundColor: "#2196F3",
                              color: "white",
                              fontSize: "11px"
                            }}
                          >
                            {role.name}
                          </span>
                        ))
                      ) : (
                        <span style={{ color: "#999", fontSize: "12px" }}>Sin roles</span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <button
                      onClick={() => setShowUserRolesModal(user.id)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#9C27B0",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      Gestionar Roles
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: "20px", textAlign: "center", fontSize: "16px" }}>
                  No hay usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Estadísticas de usuarios */}
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
          <h4 style={{ margin: "0 0 10px 0", color: "#4CAF50" }}>Usuarios Activos</h4>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>
            {users.filter(u => u.status).length}
          </p>
        </div>
        
        <div style={{
          backgroundColor: "rgba(255, 152, 0, 0.2)",
          padding: "20px",
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <h4 style={{ margin: "0 0 10px 0", color: "#FF9800" }}>Sin Roles</h4>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>
            {users.filter(u => getUserRoles(u.id).length === 0).length}
          </p>
        </div>
        
        <div style={{
          backgroundColor: "rgba(156, 39, 176, 0.2)",
          padding: "20px",
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <h4 style={{ margin: "0 0 10px 0", color: "#9C27B0" }}>Con Múltiples Roles</h4>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>
            {users.filter(u => getUserRoles(u.id).length > 1).length}
          </p>
        </div>
      </div>
    </div>
  );

  const renderPermissionsModal = () => {
    if (!showPermissionsModal) return null;

    const role = roles.find(r => r.id === showPermissionsModal);
    const permissionCategories = getPermissionsByCategory();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">
              Permisos para: {role?.name}
            </h3>
            <button
              onClick={() => setShowPermissionsModal(null)}
              className="text-gray-400 hover:text-white text-3xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {Object.entries(permissionCategories).map(([category, categoryPermissions]) => (
              <div key={category} className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4 capitalize">
                  {category}
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categoryPermissions.map((permission) => (
                    <label
                      key={permission.id}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-600 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isPermissionAssigned(showPermissionsModal, permission.id)}
                        onChange={(e) => handlePermissionToggle(
                          showPermissionsModal,
                          permission.id,
                          e.target.checked
                        )}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-300 text-sm">
                        {permission.name.replace(category + '.', '')}
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
    <div style={{ color: "#fff", minHeight: "100vh", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "30px", textAlign: "center", fontSize: "28px" }}>
        Administración de Roles y Permisos
      </h2>

      {/* Sistema de Tabs */}
      <div style={{ marginBottom: "30px" }}>
        <div style={{
          display: "flex",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          borderRadius: "8px",
          padding: "4px"
        }}>
          <button
            onClick={() => setActiveTab('roles')}
            style={{
              flex: 1,
              padding: "12px 24px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: activeTab === 'roles' ? "#2196F3" : "transparent",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            🛡️ Gestión de Roles
          </button>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              flex: 1,
              padding: "12px 24px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: activeTab === 'users' ? "#2196F3" : "transparent",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            👥 Usuarios y Roles
          </button>
        </div>
      </div>

      {loading && <p style={{ textAlign: "center", fontSize: "18px" }}>Cargando datos...</p>}
      {error && (
        <div style={{ 
          backgroundColor: "rgba(244, 67, 54, 0.1)", 
          border: "1px solid #f44336", 
          color: "#f44336", 
          padding: "12px", 
          borderRadius: "8px", 
          marginBottom: "20px",
          textAlign: "center"
        }}>
          Error: {error}
        </div>
      )}

      {!loading && !error && (
        <div>
          {/* Contenido según el tab activo */}
          {activeTab === 'roles' && (
            <div>
              {/* Tabla de Roles */}
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
                  <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Nombre</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Ruta Inicial</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Guard</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Por Defecto</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "left" }}>Permisos</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #555", textAlign: "center" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {roles.length > 0 ? (
                  roles.map((role, index) => (
                    <tr 
                      key={role.id} 
                      style={{ 
                        borderBottom: "1px solid #555",
                        backgroundColor: index % 2 === 0 ? "rgba(255,255,255,0.05)" : "transparent"
                      }}
                    >
                      <td style={{ padding: "12px" }}>{role.id}</td>
                      <td style={{ padding: "12px", fontWeight: "bold" }}>{role.name}</td>
                      <td style={{ padding: "12px" }}>
                        <code style={{ 
                          backgroundColor: "rgba(255,255,255,0.1)", 
                          padding: "2px 6px", 
                          borderRadius: "4px" 
                        }}>
                          {role.start_path}
                        </code>
                      </td>
                      <td style={{ padding: "12px" }}>{role.guard_name}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          backgroundColor: role.is_default ? "#4CAF50" : "#757575",
                          color: "white",
                          fontSize: "12px"
                        }}>
                          {role.is_default ? "Sí" : "No"}
                        </span>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <button
                          onClick={() => setShowPermissionsModal(role.id)}
                          style={{
                            padding: "6px 12px",
                            backgroundColor: "#9C27B0",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px"
                          }}
                        >
                          Gestionar ({(rolePermissions[role.id] || []).length})
                        </button>
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <button
                          onClick={() => handleEdit(role)}
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
                          onClick={() => handleDelete(role.id)}
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
                      No hay roles registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Formulario de Agregar/Editar Rol */}
          <div style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            padding: "25px",
            borderRadius: "8px",
            marginTop: "20px"
          }}>
            <h3 style={{ marginBottom: "20px", fontSize: "22px" }}>
              {editingRole ? "Editar Rol" : "Agregar Nuevo Rol"}
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
                    Nombre del Rol:
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Ej: Administrador, Docente, Estudiante"
                    value={editingRole ? editingRole.name : newRole.name}
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
                    Ruta Inicial:
                  </label>
                  <input
                    type="text"
                    name="start_path"
                    placeholder="Ej: /admin, /docente, /estudiante"
                    value={editingRole ? editingRole.start_path : newRole.start_path}
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
                    Guard Name:
                  </label>
                  <select
                    name="guard_name"
                    value={editingRole ? editingRole.guard_name : newRole.guard_name}
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
                    <option value="web">Web</option>
                    <option value="api">API</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "flex", alignItems: "center", fontSize: "14px" }}>
                  <input
                    type="checkbox"
                    name="is_default"
                    checked={editingRole ? editingRole.is_default : newRole.is_default}
                    onChange={handleChange}
                    style={{ marginRight: "8px", transform: "scale(1.2)" }}
                  />
                  Rol por defecto para nuevos usuarios
                </label>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  style={{
                    padding: "12px 24px",
                    backgroundColor: editingRole ? "#FF9800" : "#4CAF50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "bold"
                  }}
                >
                  {editingRole ? "Actualizar Rol" : "Crear Rol"}
                </button>
                
                {editingRole && (
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

          {/* Estadísticas */}
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
              <h4 style={{ margin: "0 0 10px 0", color: "#4CAF50" }}>Total Roles</h4>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>{roles.length}</p>
            </div>
            
            <div style={{
              backgroundColor: "rgba(33, 150, 243, 0.2)",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#2196F3" }}>Total Permisos</h4>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>
                {permissions.length}
              </p>
            </div>
            
            <div style={{
              backgroundColor: "rgba(156, 39, 176, 0.2)",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#9C27B0" }}>Roles por Defecto</h4>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>
                {roles.filter(r => r.is_default).length}
              </p>
            </div>
          </div>
        </div>
          )}

          {activeTab === 'users' && renderUsersTab()}

          {/* Modal de Permisos */}
          {renderPermissionsModal()}
          
          {/* Modal de Roles de Usuario */}
          {renderUserRolesModal()}
        </div>
      )}
    </div>
  );
}

export default RolesAdmin;