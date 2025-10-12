import { API_URL } from "../Api.js";

// Obtenemos todos los datos del proyecto
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

// Obtenemos el dato de proyecto por ID
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

// Creamos un nuevo proyecto
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

// Actualizamos un nuevo proyecto
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

// Eliminamos un proyecto por ID
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

// Obtenemos el proyecto de un estudiante
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

// Otenemos el proyecto del docente
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