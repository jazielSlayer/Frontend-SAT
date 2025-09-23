import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProyectoEstudiante, getPagoEstudiante } from "../../../API/Estudiante/Estudiante.js";

function Estudiante() {
  const { id } = useParams(); // Get student ID from URL
  const [estudiante, setEstudiante] = useState(null);
  const [proyectos, setProyectos] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEstudianteData = async () => {
      try {
        setLoading(true);
        // Assuming estudiante data is part of the proyecto or pago response, or you have a separate endpoint
        // If there's a specific endpoint for estudiante details, it should be added to Api.js
        const proyectosData = await getProyectoEstudiante(id);
        const pagosData = await getPagoEstudiante(id);
        setProyectos(proyectosData);
        setPagos(pagosData);
        // Mock estudiante data; replace with actual estudiante fetch if available
        setEstudiante({ id, nombre: "Estudiante Ejemplo" }); // Adjust based on actual estudiante data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEstudianteData();
  }, [id]);

  if (loading) return <div className="text-center mt-8">Cargando...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">Error: {error}</div>;
  if (!estudiante) return <div className="text-center mt-8">No se encontró el estudiante</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Información del Estudiante</h2>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold">Detalles</h3>
        <p><strong>ID:</strong> {estudiante.id}</p>
        <p><strong>Nombre:</strong> {estudiante.nombre}</p>
        {/* Add more estudiante fields as available from API */}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold">Proyectos</h3>
        {proyectos.length > 0 ? (
          <ul className="list-disc pl-5">
            {proyectos.map((proyecto) => (
              <li key={proyecto.id} className="my-2">
                <strong>{proyecto.nombre || "Proyecto sin nombre"}</strong>
                {/* Add more proyecto fields as available */}
                <p>Descripción: {proyecto.descripcion || "Sin descripción"}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay proyectos registrados.</p>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold">Pagos</h3>
        {pagos.length > 0 ? (
          <ul className="list-disc pl-5">
            {pagos.map((pago) => (
              <li key={pago.id} className="my-2">
                <strong>Monto:</strong> {pago.monto || "Sin monto"} <br />
                <strong>Fecha:</strong> {pago.fecha || "Sin fecha"}
                {/* Add more pago fields as available */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay pagos registrados.</p>
        )}
      </div>
    </div>
  );
}

export default Estudiante;