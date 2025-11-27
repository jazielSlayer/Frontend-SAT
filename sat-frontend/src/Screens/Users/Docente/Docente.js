import React, { useState } from 'react';
import { BookOpen, Users, FileText, Bell, Calendar, Award, Search, Plus, RefreshCw, LogOut, BarChart3, CheckCircle, Clock, AlertCircle } from 'lucide-react';

function Docente() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewObservation, setShowNewObservation] = useState(false);
  const [observationForm, setObservationForm] = useState({
    estudiante: '',
    fecha: '',
    contenido: ''
  });

  // Datos simulados del docente
  const [docenteData] = useState({
    nombre: "Dr. Carlos Mendoza",
    especialidad: "Ingeniería de Software",
    numero_item: "DOC-001"
  });

  // Datos simulados
  const [proyectos] = useState([
    {
      id: 1,
      titulo: "Sistema de Gestión Académica",
      estudiante: "Juan Pérez López",
      rol: "guia",
      calificacion: 85,
      fecha_entrega: "2025-12-15",
      fecha_defensa: "2025-12-20",
      estado: "En revisión"
    },
    {
      id: 2,
      titulo: "App Móvil para Control de Inventarios",
      estudiante: "María González",
      rol: "revisor",
      calificacion: 92,
      fecha_entrega: "2025-12-10",
      fecha_defensa: "2025-12-18",
      estado: "Aprobado"
    }
  ]);

  const [modulos] = useState([
    {
      id: 1,
      codigo: "MOD-001",
      nombre: "Metodologías Ágiles",
      duracion: "8 semanas",
      estudiantes_inscritos: 25,
      fecha_inicio: "2025-09-01",
      fecha_fin: "2025-10-26"
    },
    {
      id: 2,
      codigo: "MOD-002",
      nombre: "Desarrollo Web Avanzado",
      duracion: "10 semanas",
      estudiantes_inscritos: 30,
      fecha_inicio: "2025-09-15",
      fecha_fin: "2025-11-23"
    }
  ]);

  const [avances] = useState([
    {
      id: 1,
      estudiante: "Ana Martínez",
      modulo: "Metodologías Ágiles",
      estado: "completado",
      fecha: "2025-11-20",
      progreso: 100
    },
    {
      id: 2,
      estudiante: "Pedro Sánchez",
      modulo: "Desarrollo Web Avanzado",
      estado: "en progreso",
      fecha: "2025-11-22",
      progreso: 65
    },
    {
      id: 3,
      estudiante: "Laura Torres",
      modulo: "Metodologías Ágiles",
      estado: "pendiente",
      fecha: "2025-11-15",
      progreso: 30
    }
  ]);

  const [observaciones] = useState([
    {
      id: 1,
      estudiante: "Juan Pérez",
      contenido: "Excelente avance en el proyecto. Recomendar implementar pruebas unitarias.",
      fecha: "2025-11-20",
      autor: "Dr. Carlos Mendoza"
    },
    {
      id: 2,
      estudiante: "María González",
      contenido: "Necesita mejorar la documentación técnica del proyecto.",
      fecha: "2025-11-19",
      autor: "Dr. Carlos Mendoza"
    }
  ]);

  const getEstadoColor = (estado) => {
    switch(estado?.toLowerCase()) {
      case 'completado': return 'bg-green-100 text-green-800 border-green-300';
      case 'en progreso': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'pendiente': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'aprobado': return 'bg-green-100 text-green-800 border-green-300';
      case 'en revisión': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getEstadoIcon = (estado) => {
    switch(estado?.toLowerCase()) {
      case 'completado':
      case 'aprobado':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'en progreso':
      case 'en revisión':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'pendiente':
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleObservationSubmit = () => {
    console.log('Observación guardada:', observationForm);
    setObservationForm({ estudiante: '', fecha: '', contenido: '' });
    setShowNewObservation(false);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold opacity-90">Proyectos</h3>
            <FileText className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{proyectos.length}</p>
          <p className="text-sm opacity-80">Asignados</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold opacity-90">Módulos</h3>
            <BookOpen className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{modulos.length}</p>
          <p className="text-sm opacity-80">Activos</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold opacity-90">Estudiantes</h3>
            <Users className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{avances.length}</p>
          <p className="text-sm opacity-80">Con seguimiento</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold opacity-90">Observaciones</h3>
            <Bell className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{observaciones.length}</p>
          <p className="text-sm opacity-80">Registradas</p>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setActiveTab('seguimiento')}
            className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg text-white transition-all duration-200 transform hover:scale-105"
          >
            <BarChart3 className="w-6 h-6 mx-auto mb-2" />
            <div className="font-medium">Ver Avances</div>
          </button>
          <button 
            onClick={() => { setActiveTab('seguimiento'); setShowNewObservation(true); }}
            className="bg-green-600 hover:bg-green-700 p-4 rounded-lg text-white transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-6 h-6 mx-auto mb-2" />
            <div className="font-medium">Nueva Observación</div>
          </button>
          <button 
            onClick={() => setActiveTab('proyectos')}
            className="bg-purple-600 hover:bg-purple-700 p-4 rounded-lg text-white transition-all duration-200 transform hover:scale-105"
          >
            <FileText className="w-6 h-6 mx-auto mb-2" />
            <div className="font-medium">Revisar Proyectos</div>
          </button>
        </div>
      </div>

      {/* Actividad Reciente y Próximas Defensas */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            {avances.slice(0, 5).map((avance) => (
              <div key={avance.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{avance.estudiante}</p>
                  <p className="text-gray-600 text-sm">{avance.modulo}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(avance.estado)}`}>
                  {avance.estado}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Próximas Defensas</h3>
          <div className="space-y-3">
            {proyectos.filter(p => p.fecha_defensa).map((proyecto) => (
              <div key={proyecto.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-gray-900 font-medium">{proyecto.titulo}</p>
                <p className="text-gray-600 text-sm">{proyecto.estudiante}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <p className="text-blue-600 text-sm font-medium">{proyecto.fecha_defensa}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProyectos = () => (
    <div className="space-y-6">
      {proyectos.map((proyecto) => (
        <div key={proyecto.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h4 className="text-xl font-bold text-gray-900 mb-2">{proyecto.titulo}</h4>
              <p className="text-gray-600">Estudiante: {proyecto.estudiante}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getEstadoColor(proyecto.estado)}`}>
                {proyecto.estado}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                proyecto.rol === 'guia' ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-purple-100 text-purple-800 border-purple-300'
              } border`}>
                {proyecto.rol === 'guia' ? 'Docente Guía' : 'Docente Revisor'}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Calificación</p>
                <p className="font-semibold text-gray-900">{proyecto.calificacion}/100</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Entrega</p>
                <p className="font-semibold text-gray-900">{proyecto.fecha_entrega}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Defensa</p>
                <p className="font-semibold text-gray-900">{proyecto.fecha_defensa}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              Ver Detalles
            </button>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
              Calificar
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderModulos = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modulos.map((modulo) => (
        <div key={modulo.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-xl font-bold text-gray-900">{modulo.nombre}</h4>
              <p className="text-gray-500 font-mono text-sm">{modulo.codigo}</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {modulo.duracion}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{modulo.estudiantes_inscritos} estudiantes</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700 text-sm">{modulo.fecha_inicio} - {modulo.fecha_fin}</span>
            </div>
          </div>

          <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
            Ver Estudiantes
          </button>
        </div>
      ))}
    </div>
  );

  const renderSeguimiento = () => (
    <div className="space-y-6">
      {/* Formulario Nueva Observación */}
      {showNewObservation && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h4 className="text-xl font-semibold text-gray-900 mb-4">Nueva Observación</h4>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Estudiante</label>
                <select 
                  value={observationForm.estudiante}
                  onChange={(e) => setObservationForm({...observationForm, estudiante: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar estudiante</option>
                  <option value="1">Juan Pérez</option>
                  <option value="2">María González</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Fecha</label>
                <input 
                  type="date"
                  value={observationForm.fecha}
                  onChange={(e) => setObservationForm({...observationForm, fecha: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Observación</label>
              <textarea 
                rows={4}
                value={observationForm.contenido}
                onChange={(e) => setObservationForm({...observationForm, contenido: e.target.value})}
                placeholder="Escriba su observación..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleObservationSubmit}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Guardar
              </button>
              <button 
                onClick={() => setShowNewObservation(false)}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de Avances */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h4 className="text-xl font-semibold text-gray-900 mb-4">Avances de Estudiantes</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Estudiante</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Módulo</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Progreso</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Estado</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {avances.map((avance) => (
                <tr key={avance.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{avance.estudiante}</td>
                  <td className="py-3 px-4 text-gray-700">{avance.modulo}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{width: `${avance.progreso}%`}}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{avance.progreso}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1 ${getEstadoColor(avance.estado)}`}>
                      {getEstadoIcon(avance.estado)}
                      {avance.estado}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{avance.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Observaciones */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h4 className="text-xl font-semibold text-gray-900 mb-4">Observaciones Recientes</h4>
        <div className="space-y-4">
          {observaciones.map((obs) => (
            <div key={obs.id} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-semibold text-gray-900">{obs.estudiante}</h5>
                <span className="text-sm text-gray-500">{obs.fecha}</span>
              </div>
              <p className="text-gray-700 mb-2">{obs.contenido}</p>
              <p className="text-xs text-gray-500">Por: {obs.autor}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">{docenteData.nombre}</h1>
          <p className="text-sm text-gray-500">{docenteData.especialidad}</p>
          <p className="text-xs text-gray-400 mt-1">{docenteData.numero_item}</p>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'proyectos', label: 'Proyectos', icon: FileText },
            { id: 'modulos', label: 'Módulos', icon: BookOpen },
            { id: 'seguimiento', label: 'Seguimiento', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchTerm('');
                  setShowNewObservation(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-200 space-y-2">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
            <RefreshCw className="w-5 h-5" />
            <span>Actualizar</span>
          </button>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {activeTab === 'dashboard' ? 'Dashboard' :
                 activeTab === 'proyectos' ? 'Proyectos Asignados' :
                 activeTab === 'modulos' ? 'Módulos a Cargo' :
                 'Seguimiento de Estudiantes'}
              </h1>
              <p className="text-gray-300 mt-1">Gestiona tus actividades académicas</p>
            </div>
            {activeTab !== 'dashboard' && (
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="transition-all duration-300">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'proyectos' && renderProyectos()}
            {activeTab === 'modulos' && renderModulos()}
            {activeTab === 'seguimiento' && renderSeguimiento()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Docente;