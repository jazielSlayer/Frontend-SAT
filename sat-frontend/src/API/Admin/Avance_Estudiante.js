import { API_URL } from "../Api.js";

// Get all student progress records
export async function getAllAvances() {
  try {
    const response = await fetch(`${API_URL}/avances`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching avances: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getAllAvances:', error);
    throw error;
  }
}

// Get a specific student progress record by ID
export async function getAvance(id) {
  try {
    const response = await fetch(`${API_URL}/avances/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Avance not found');
      }
      throw new Error(`Error fetching avance: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getAvance:', error);
    throw error;
  }
}

// Create a new student progress record
export async function createAvance(data) {
  try {
    const response = await fetch(`${API_URL}/avances`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_estudiante: data.id_estudiante,
        id_modulo: data.id_modulo,
        responsable: data.responsable,
        fecha: data.fecha,
        estado: data.estado,
      }),
    });
    if (!response.ok) {
      throw new Error(`Error creating avance: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in createAvance:', error);
    throw error;
  }
}

// Update a student progress record by ID
export async function updateAvance(id, data) {
  try {
    const response = await fetch(`${API_URL}/avances/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_estudiante: data.id_estudiante,
        id_modulo: data.id_modulo,
        responsable: data.responsable,
        fecha: data.fecha,
        estado: data.estado,
      }),
    });
    if (!response.ok) {
      throw new Error(`Error updating avance: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in updateAvance:', error);
    throw error;
  }
}

// Delete a student progress record by ID
export async function deleteAvance(id) {
  try {
    const response = await fetch(`${API_URL}/avances/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error deleting avance: ${response.statusText}`);
    }
    return { success: true };
  } catch (error) {
    console.error('Error in deleteAvance:', error);
    throw error;
  }
}

// Get student progress records by student ID
export async function getAvanceEstudiante(id_estudiante) {
  try {
    const response = await fetch(`${API_URL}/avance/estudiante/${id_estudiante}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching avances for estudiante: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getAvanceEstudiante:', error);
    throw error;
  }
}