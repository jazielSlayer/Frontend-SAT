import { API_URL } from "../Api.js";

// Get all project records
export async function getAllProyectos() {
  try {
    const response = await fetch(`${API_URL}/proyectos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching proyectos: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getAllProyectos:', error);
    throw error;
  }
}

// Get a specific project record by ID
export async function getProyecto(id) {
  try {
    const response = await fetch(`${API_URL}/proyectos/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Proyecto not found');
      }
      throw new Error(`Error fetching proyecto: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getProyecto:', error);
    throw error;
  }
}

// Create a new project record
export async function createProyecto(data) {
  try {
    const response = await fetch(`${API_URL}/proyectos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_estudiante: data.id_estudiante,
        id_docente: data.id_docente,
        id_taller: data.id_taller,
        nombre_proyecto: data.nombre_proyecto,
        descripcion: data.descripcion,
        fecha_inicio: data.fecha_inicio,
        fecha_finalizacion: data.fecha_finalizacion,
        estado: data.estado,
      }),
    });
    if (!response.ok) {
      throw new Error(`Error creating proyecto: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in createProyecto:', error);
    throw error;
  }
}

// Update a project record by ID
export async function updateProyecto(id, data) {
  try {
    const response = await fetch(`${API_URL}/proyectos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_estudiante: data.id_estudiante,
        id_docente: data.id_docente,
        id_taller: data.id_taller,
        nombre_proyecto: data.nombre_proyecto,
        descripcion: data.descripcion,
        fecha_inicio: data.fecha_inicio,
        fecha_finalizacion: data.fecha_finalizacion,
        estado: data.estado,
      }),
    });
    if (!response.ok) {
      throw new Error(`Error updating proyecto: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in updateProyecto:', error);
    throw error;
  }
}

// Delete a project record by ID
export async function deleteProyecto(id) {
  try {
    const response = await fetch(`${API_URL}/proyectos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error deleting proyecto: ${response.statusText}`);
    }
    return { success: true };
  } catch (error) {
    console.error('Error in deleteProyecto:', error);
    throw error;
  }
}

// Get project records by student ID
export async function getProyectoEstudiante(id_estudiante) {
  try {
    const response = await fetch(`${API_URL}/proyectos/estudiante/${id_estudiante}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching proyectos for estudiante: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getProyectoEstudiante:', error);
    throw error;
  }
}

// Get project records by teacher ID
export async function getProyectoDocente(id_docente) {
  try {
    const response = await fetch(`${API_URL}/proyectos/docente/${id_docente}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching proyectos for docente: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getProyectoDocente:', error);
    throw error;
  }
}