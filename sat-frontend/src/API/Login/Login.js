// Este archivo contiene el proceso de login (API/Login/Login.js)
import { API_URL } from "../Api.js";

// Login de usuario
export const loginUser = async (credentials) => {
  try {
      const response = await fetch(`${API_URL}/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error ${response.status}`);
      }
      
      const data = await response.json();
      return data;
  } catch (error) {
      console.error("Error logging in:", error);
      throw error;
  }
};