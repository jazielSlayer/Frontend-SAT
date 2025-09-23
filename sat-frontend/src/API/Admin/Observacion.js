import { API_URL } from "../Api.js";

// Get all observation records
export async function getAllObservaciones() {
  try {
    const response = await fetch(`${API_URL}/observaciones`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching observaciones: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getAllObservaciones:', error);
    throw error;
  }
}

// Get a specific observation record by ID
export async function getObservacion(id) {
  try {
    const response = await fetch(`${API_URL}/observaciones/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Observacion not found');
      }
      throw new Error(`Error fetching observacion: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getObservacion:', error);
    throw error;
  }
}

// Create a new observation record
export async function createObservacion(data) {
  try {
    const response = await fetch(`${API_URL}/observaciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_estudiante: data.id_estudiante,
        contenido: data.contenido,
        autor: data.autor,
        fecha: data.fecha,
      }),
    });
    if (!response.ok) {
      throw new Error(`Error creating observacion: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in createObservacion:', error);
    throw error;
  }
}

// Update an observation record by ID
export async function updateObservacion(id, data) {
  try {
    const response = await fetch(`${API_URL}/observaciones/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_estudiante: data.id_estudiante,
        contenido: data.contenido,
        autor: data.autor,
        fecha: data.fecha,
      }),
    });
    if (!response.ok) {
      throw new Error(`Error updating observacion: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in updateObservacion:', error);
    throw error;
  }
}

// Delete an observation record by ID
export async function deleteObservacion(id) {
  try {
    const response = await fetch(`${API_URL}/observaciones/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error deleting observacion: ${response.statusText}`);
    }
    return { success: true };
  } catch (error) {
    console.error('Error in deleteObservacion:', error);
    throw error;
  }
}