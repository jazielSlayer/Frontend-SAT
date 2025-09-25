//Este archivo contiene el proceso de login
import { API_URL } from "../Api.js";

// Login de usuario
export const loginUser = async (credentials) => {
  try {
      const response = await fetch(`${API_URL}/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
      });
      const data = await response.json();
      return data;
  } catch (error) {
      console.error("Error logging in:", error);
      throw error;
  }
};