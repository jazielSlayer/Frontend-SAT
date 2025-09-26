// sat-frontend/src/API/Admin/Roles.js
import { API_URL } from "../Api.js";

// ========== ROLES ==========

// Get all roles
export async function getAllRoles() {
  try {
    const response = await fetch(`${API_URL}/roles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching roles: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getAllRoles:', error);
    throw error;
  }
}

// Get a specific role by ID
export async function getRole(id) {
  try {
    const response = await fetch(`${API_URL}/roles/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Role not found');
      }
      throw new Error(`Error fetching role: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getRole:', error);
    throw error;
  }
}

// Create a new role
export async function createRole(data) {
  try {
    const response = await fetch(`${API_URL}/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        start_path: data.start_path,
        is_default: data.is_default || false,
        guard_name: data.guard_name || 'web',
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error creating role: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in createRole:', error);
    throw error;
  }
}

// Update a role by ID
export async function updateRole(id, data) {
  try {
    const response = await fetch(`${API_URL}/roles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        start_path: data.start_path,
        is_default: data.is_default,
        guard_name: data.guard_name || 'web',
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error updating role: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in updateRole:', error);
    throw error;
  }
}

// Delete a role by ID
export async function deleteRole(id) {
  try {
    const response = await fetch(`${API_URL}/roles/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error deleting role: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in deleteRole:', error);
    throw error;
  }
}

// ========== PERMISSIONS ==========

// Get all permissions
export async function getAllPermissions() {
  try {
    const response = await fetch(`${API_URL}/permissions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching permissions: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getAllPermissions:', error);
    throw error;
  }
}

// Get permissions for a specific role
export async function getPermissionsByRole(roleId) {
  try {
    const response = await fetch(`${API_URL}/roles/${roleId}/permissions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching permissions for role: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getPermissionsByRole:', error);
    throw error;
  }
}

// Assign a permission to a role
export async function assignPermissionToRole(roleId, permissionId) {
  try {
    const response = await fetch(`${API_URL}/roles/${roleId}/permissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        permission_id: permissionId,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error assigning permission to role: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in assignPermissionToRole:', error);
    throw error;
  }
}

// Remove a permission from a role
export async function removePermissionFromRole(roleId, permissionId) {
  try {
    const response = await fetch(`${API_URL}/roles/${roleId}/permissions`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        permission_id: permissionId,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error removing permission from role: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in removePermissionFromRole:', error);
    throw error;
  }
}

// ========== USER ROLES ==========

// Get users with their roles
export async function getUsersWithRoles() {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching users: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getUsersWithRoles:', error);
    throw error;
  }
}

// Assign a role to a user (this would need to be implemented in your backend)
export async function assignRoleToUser(userId, roleId) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role_id: roleId,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error assigning role to user: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in assignRoleToUser:', error);
    throw error;
  }
}

// Remove a role from a user (this would need to be implemented in your backend)
export async function removeRoleFromUser(userId, roleId) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/roles`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role_id: roleId,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error removing role from user: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in removeRoleFromUser:', error);
    throw error;
  }
}