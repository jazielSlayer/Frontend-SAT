import { API_URL } from "../Api.js";

// Get all academic program records
export async function getAllProgramas() {
  try {
    const response = await fetch(`${API_URL}/programas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching programas: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getAllProgramas:', error);
    throw error;
  }
}

// Get a specific academic program record by ID
export async function getPrograma(id) {
  try {
    const response = await fetch(`${API_URL}/programas/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Programa not found');
      }
      throw new Error(`Error fetching programa: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getPrograma:', error);
    throw error;
  }
}

// Create a new academic program record
export async function createPrograma(data) {
  try {
    const response = await fetch(`${API_URL}/programas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        codigo: data.codigo,
        nombre_programa: data.nombre_programa,
        modalidad: data.modalidad,
        facultad: data.facultad,
        nivel: data.nivel,
        estado: data.estado,
      }),
    });
    if (!response.ok) {
      throw new Error(`Error creating programa: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in createPrograma:', error);
    throw error;
  }
}

// Update an academic program record by ID
export async function updatePrograma(id, data) {
  try {
    const response = await fetch(`${API_URL}/programas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        codigo: data.codigo,
        nombre_programa: data.nombre_programa,
        modalidad: data.modalidad,
        facultad: data.facultad,
        nivel: data.nivel,
        estado: data.estado,
      }),
    });
    if (!response.ok) {
      throw new Error(`Error updating programa: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in updatePrograma:', error);
    throw error;
  }
}

// Delete an academic program record by ID
export async function deletePrograma(id) {
  try {
    const response = await fetch(`${API_URL}/programas/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error deleting programa: ${response.statusText}`);
    }
    return { success: true };
  } catch (error) {
    console.error('Error in deletePrograma:', error);
    throw error;
  }
}