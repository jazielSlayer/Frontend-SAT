
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navegacion from "./Navegacion";

// Llamamos a las ventanas
import Bienvenida from "./Screens/Bienvenida";
import Admin from "./Screens/Admin/Admin";
import AdminEstudiantes from "./Screens/Admin/Admin-Ventanas/Estudiante-Admin";
import DocenteAdmin from "./Screens/Admin/Admin-Ventanas/Docente-Admin";
import Estudiante from "./Screens/Users/Estudiante/Estudiante";
import Docente from "./Screens/Users/Docente/Docente";
import Login from "./Screens/Login/Login";
import Register from "./Screens/Login/Register";



// Renderizar navegación y rutas bajo un solo BrowserRouter en root
createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<Navegacion />
			<Routes>
				<Route path="/" element={<Bienvenida />} />
				<Route path="/admin" element={<Admin />} />
				<Route path="/Estudiante-Admin" element={<AdminEstudiantes />} />
				<Route path="/docenteadmin" element={<DocenteAdmin />} />
				<Route path="/docente" element={<Docente />} />
				<Route path="/estudiante" element={<Estudiante />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);





