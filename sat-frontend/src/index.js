
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navegacion from "./Navegacion";

// Llamamos a las ventanas
import Bienvenida from "./Screens/Bienvenida";
import Admin from "./Screens/Admin/Admin";
import Docente from "./Screens/Users/Docente/Docente";
import Estudiante from "./Screens/Users/Estudiante/Estudiante";
import Login from "./Screens/Login/Login";



// Renderizar navegación y rutas bajo un solo BrowserRouter en root
createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<Navegacion />
			<Routes>
				<Route path="/" element={<Bienvenida />} />
				<Route path="/admin" element={<Admin />} />
				<Route path="/docente" element={<Docente />} />
				<Route path="/estudiante" element={<Estudiante />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);


