import { API_URL } from "../Api.js";

// Get all audit history records
export async function getAllHistoriales() {
  try {
    const response = await fetch(`${API_URL}/historiales`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching historiales: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getAllHistoriales:', error);
    throw error;
  }
}

// Get a specific audit history record by ID
export async function getHistorial(id) {
  try {
    const response = await fetch(`${API_URL}/historiales/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Historial not found');
      }
      throw new Error(`Error fetching historial: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getHistorial:', error);
    throw error;
  }
}

// Create a new audit history record
export async function createHistorial(data) {
  try {
    const response = await fetch(`${API_URL}/historiales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entidad_afectada: data.entidad_afectada,
        descripcion_operacion: data.descripcion_operacion,
        fecha_operacion: data.fecha_operacion,
        usuario: data.usuario,
      }),
    });
    if (!response.ok) {
      throw new Error(`Error creating historial: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in createHistorial:', error);
    throw error;
  }
}

// Update an audit history record by ID
export async function updateHistorial(id, data) {
  try {
    const response = await fetch(`${API_URL}/historiales/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entidad_afectada: data.entidad_afectada,
        descripcion_operacion: data.descripcion_operacion,
        fecha_operacion: data.fecha_operacion,
        usuario: data.usuario,
      }),
    });
    if (!response.ok) {
      throw new Error(`Error updating historial: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in updateHistorial:', error);
    throw error;
  }
}

// Delete an audit history record by ID
export async function deleteHistorial(id) {
  try {
    const response = await fetch(`${API_URL}/historiales/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error deleting historial: ${response.statusText}`);
    }
    return { success: true };
  } catch (error) {
    console.error('Error in deleteHistorial:', error);
    throw error;
  }
}