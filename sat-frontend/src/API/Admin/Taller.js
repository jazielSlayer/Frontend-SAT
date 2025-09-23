import { API_URL } from "../Api.js";

// Get all workshop records
export async function getAllTalleres() {
  try {
    const response = await fetch(`${API_URL}/talleres`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching talleres: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getAllTalleres:', error);
    throw error;
  }
}

// Get a specific workshop record by ID
export async function getTaller(id) {
  try {
    const response = await fetch(`${API_URL}/talleres/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Taller not found');
      }
      throw new Error(`Error fetching taller: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getTaller:', error);
    throw error;
  }
}

// Create a new workshop record
export async function createTaller(data) {
  try {
    const response = await fetch(`${API_URL}/talleres`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: data.nombre,
        id_docente: data.id_docente,
        id_programa_academico: data.id_programa_academico,
        descripcion: data.descripcion,
        fecha_inicio: data.fecha_inicio,
        fecha_finalizacion: data.fecha_finalizacion,
        estado: data.estado,
      }),
    });
    if (!response.ok) {
      throw new Error(`Error creating taller: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in createTaller:', error);
    throw error;
  }
}

// Update a workshop record by ID
export async function updateTaller(id, data) {
  try {
    const response = await fetch(`${API_URL}/talleres/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: data.nombre,
        id_docente: data.id_docente,
        id_programa_academico: data.id_programa_academico,
        descripcion: data.descripcion,
        fecha_inicio: data.fecha_inicio,
        fecha_finalizacion: data.fecha_finalizacion,
        estado: data.estado,
      }),
    });
    if (!response.ok) {
      throw new Error(`Error updating taller: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in updateTaller:', error);
    throw error;
  }
}

// Delete a workshop record by ID
export async function deleteTaller(id) {
  try {
    const response = await fetch(`${API_URL}/talleres/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error deleting taller: ${response.statusText}`);
    }
    return { success: true };
  } catch (error) {
    console.error('Error in deleteTaller:', error);
    throw error;
  }
}