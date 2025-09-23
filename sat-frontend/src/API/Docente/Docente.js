//Este archivo contiene los procesos que realiza el docente
import { API_URL } from "../Api.js";

// Obtener proyecto(s) de un docente por su ID
export async function getProyectoDocente(id_docente) {
    const res = await fetch(`${API_URL}/proyectos/docente/${id_docente}`);
    if (!res.ok) throw new Error("Error al obtener el/los proyecto(s) del docente");
    return res.json();
}

// Obtener un docente por ID
export async function getDocente(id) {
    const res = await fetch(`${API_URL}/docentes/${id}`);
    if (!res.ok) throw new Error("Error al obtener el docente");
    return res.json();
}

// Crear un nuevo docente
export async function createDocente(docente) {
    const res = await fetch(`${API_URL}/docentes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(docente),
    });
    if (!res.ok) throw new Error("Error al crear el docente");
    return res.json();
}

// Actualizar un docente
export async function updateDocente(id, docente) {
    const res = await fetch(`${API_URL}/docentes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(docente),
    });
    if (!res.ok) throw new Error("Error al actualizar el docente");
    return res.json();
}


// Obtener un usuario por ID
export async function getUser(id) {
    const res = await fetch(`${API_URL}/users/${id}`);
    if (!res.ok) throw new Error("Error al obtener el usuario");
    return res.json();
}

// Crear un nuevo usuario
export async function saveUser(user) {
    const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error("Error al guardar el usuario");
    return res.json();
}




