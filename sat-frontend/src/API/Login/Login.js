//Este archivo contiene el proceso de login
import { API_URL } from "../Api.js";


// Login de usuario
export async function loginUser(credentials) {
	const res = await fetch(`${API_URL}/users/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(credentials),
	});
	if (!res.ok) throw new Error("Error al iniciar sesión");
	return res.json();
}
