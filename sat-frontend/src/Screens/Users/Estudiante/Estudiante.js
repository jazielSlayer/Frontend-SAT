import React, { useState } from 'react';
import { User, BookOpen, FileText, Clock, CheckCircle, AlertCircle, DollarSign, MessageSquare } from 'lucide-react';

function Estudiante() {
  // Datos simulados del estudiante (en producción vendrían de la API)
  const [studentData] = useState({
    nombre: "Lucke Skiwallker Dark",
    ru: "62629",
    programa: "Ingeniería de Sistemas",
    correo: "Luke@gmail.com"
  });

  const [proyecto] = useState({
    titulo: "Aplicación Móvil para Seguimiento de Avance Estudiantil",
    docente_guia: "Magneto",
    docente_revisor: "Pablito Picazo",
    calificacion: "100",
    calificacion2: "61.00",
    calificacion_final: "75.00",
    fecha_entrega: "2025-10-31",
    fecha_defensa: "2025-11-14",
    estado: "En desarrollo"
  });

  const [avances] = useState({
    total_modulos: 4,
    completados: 1,
    en_progreso: 2,
    pendientes: 1,
    porcentaje: 50
  });

  const [modulos] = useState([
    { id: 1, nombre: "PI Planning y Artefactos", estado: "completado", fecha: "2025-11-20" },
    { id: 2, nombre: "Lean Portfolio Management", estado: "en progreso", fecha: "2025-11-21" },
    { id: 3, nombre: "DevOps y Release on Demand", estado: "en progreso", fecha: "2025-11-23" },
    { id: 4, nombre: "Architectural Runway", estado: "pendiente", fecha: "-" }
  ]);

  const [observaciones] = useState([
    { id: 1, contenido: "Entrega el módulo en 2 días", autor: "ProfesorX", fecha: "2025-11-20" },
    { id: 2, contenido: "Participación activa en las sesiones de PI Planning simuladas.", autor: "ProfesorX", fecha: "2025-11-19" }
  ]);

  const [pagos] = useState({
    total_pagado: 1500,
    total_pendiente: 500,
    ultimo_pago: "2025-10-15"
  });

  const getEstadoColor = (estado) => {
    switch(estado.toLowerCase()) {
      case 'completado': return 'bg-green-100 text-green-800';
      case 'en progreso': return 'bg-yellow-100 text-yellow-800';
      case 'pendiente': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado) => {
    switch(estado.toLowerCase()) {
      case 'completado': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'en progreso': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'pendiente': return <AlertCircle className="w-5 h-5 text-gray-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{studentData.nombre}</h1>
                <p className="text-gray-300">RU: {studentData.ru}</p>
                <p className="text-sm text-gray-300">{studentData.programa}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-300">Correo</p>
              <p className="text-white">{studentData.correo}</p>
            </div>
          </div>
        </div>

        {/* Progreso General */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Progreso de Módulos
          </h2>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-300">Avance General</span>
              <span className="text-sm font-bold text-blue-600">{avances.porcentaje}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${avances.porcentaje}%` }}
              ></div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{avances.total_modulos}</p>
              <p className="text-sm text-gray-600">Total Módulos</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{avances.completados}</p>
              <p className="text-sm text-gray-600">Completados</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{avances.en_progreso}</p>
              <p className="text-sm text-gray-600">En Progreso</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-600">{avances.pendientes}</p>
              <p className="text-sm text-gray-600">Pendientes</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Proyecto de Grado */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Mi Proyecto de Grado
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-300">Título</p>
                <p className="font-medium text-white">{proyecto.titulo}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-300">Docente Guía</p>
                  <p className="font-medium text-white">{proyecto.docente_guia}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Docente Revisor</p>
                  <p className="font-medium text-white">{proyecto.docente_revisor}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Calificación 1</p>
                  <p className="text-xl font-bold text-blue-600">{proyecto.calificacion}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Calificación 2</p>
                  <p className="text-xl font-bold text-blue-600">{proyecto.calificacion2}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Final</p>
                  <p className="text-xl font-bold text-green-600">{proyecto.calificacion_final}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-300">Fecha Entrega</p>
                  <p className="font-medium text-white">{proyecto.fecha_entrega}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Fecha Defensa</p>
                  <p className="font-medium text-white">{proyecto.fecha_defensa}</p>
                </div>
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  {proyecto.estado}
                </span>
              </div>
            </div>
          </div>

          {/* Estado de Pagos */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-blue-600" />
              Estado de Pagos
            </h2>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Pagado</p>
                <p className="text-3xl font-bold text-green-600">Bs. {pagos.total_pagado}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Saldo Pendiente</p>
                <p className="text-3xl font-bold text-red-600">Bs. {pagos.total_pendiente}</p>
              </div>
              <div className="pt-2">
                <p className="text-sm text-gray-300">Último Pago</p>
                <p className="font-medium text-white">{pagos.ultimo_pago}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Módulos */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-semibold text-white mb-4">Mis Módulos</h2>
          <div className="space-y-3">
            {modulos.map((modulo) => (
              <div key={modulo.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  {getEstadoIcon(modulo.estado)}
                  <div>
                    <p className="font-medium text-white">{modulo.nombre}</p>
                    <p className="text-sm text-gray-300">Última actualización: {modulo.fecha}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(modulo.estado)}`}>
                  {modulo.estado}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Observaciones */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            Observaciones Recientes
          </h2>
          <div className="space-y-3">
            {observaciones.map((obs) => (
              <div key={obs.id} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-900 mb-2">{obs.contenido}</p>
                <div className="flex justify-between items-center text-sm">
                  <p className="text-gray-600">Por: <span className="font-medium">{obs.autor}</span></p>
                  <p className="text-gray-500">{obs.fecha}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Estudiante;