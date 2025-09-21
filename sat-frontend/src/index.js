
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navegacion from "./Navegacion";

// Llamamos a las ventanas
import Bienvenida from "./Screens/Bienvenida";
import Admin from "./Screens/Admin/Admin";
import Docente from "./Screens/Users/Docente/Docente";
import Estudiante from "./Screens/Users/Estudiante/Estudiante";
import Login from "./Screens/Login/Login";

function Home() {
	return <div><h2>Bienvenido al sistema</h2></div>;
}

// creamos rutas
ReactDOM.createRoot(document.getElementById("Nav-model")).render(
	<React.StrictMode>
		<BrowserRouter>
			<Navegacion />
			<Routes>
				<Route path="/" element={<Bienvenida />} />
				<Route path="/Home" element={<Home />} />
				<Route path="/admin" element={<Admin />} />
				<Route path="/docente" element={<Docente />} />
				<Route path="/estudiante" element={<Estudiante />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);


