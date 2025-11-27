import React, { useState } from 'react';
import { BookOpen, Users, ClipboardCheck, Calendar,  Bell } from 'lucide-react';


function Docente() {
  const [activeTab, setActiveTab] = useState('modulos');

  // Datos de ejemplo
  const docente = {
    nombre: "Dr. Juan Pérez",
    especialidad: "Ingeniería de Software",
    numeroItem: "DOC-001"
  };

  const modulos = [
    {
      id: 1,
      codigo: "MOD-001",
      nombre: "Desarrollo Web Avanzado",
      metodologia: "Scrum",
      duracion: "8 semanas",
      fechaInicio: "2025-01-15",
      fechaFin: "2025-03-10",
      estudiantes: 25
    },
    {
      id: 2,
      codigo: "MOD-002",
      nombre: "Base de Datos",
      metodologia: "Agile",
      duracion: "6 semanas",
      fechaInicio: "2025-02-01",
      fechaFin: "2025-03-15",
      estudiantes: 30
    }
  ];

  const estudiantes = [
    {
      id: 1,
      nombre: "María López",
      ru: "12345",
      programa: "Ingeniería de Sistemas",
      modulosCompletados: 8,
      modulosEnProgreso: 2,
      avanceTotal: 75
    },
    {
      id: 2,
      nombre: "Carlos Rodríguez",
      ru: "12346",
      programa: "Ingeniería Informática",
      modulosCompletados: 6,
      modulosEnProgreso: 3,
      avanceTotal: 60
    }
  ];

  const avances = [
    {
      id: 1,
      estudiante: "María López",
      modulo: "Desarrollo Web Avanzado",
      estado: "completado",
      fecha: "2025-11-20",
      responsable: "Dr. Juan Pérez"
    },
    {
      id: 2,
      estudiante: "Carlos Rodríguez",
      modulo: "Base de Datos",
      estado: "en progreso",
      fecha: "2025-11-25",
      responsable: "Dr. Juan Pérez"
    }
  ];

  const talleres = [
    {
      id: 1,
      titulo: "Taller de React",
      tipo: "Práctico",
      metodologia: "Scrum",
      duracion: "4 horas",
      fecha: "2025-12-01",
      resultado: "Pendiente"
    },
    {
      id: 2,
      titulo: "Taller de SQL",
      tipo: "Teórico-Práctico",
      metodologia: "Agile",
      duracion: "3 horas",
      fecha: "2025-11-28",
      resultado: "Completado"
    }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'modulos':
        return (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Mis Módulos</h2>
              <button className="btn btn-primary">
                Nuevo Módulo
              </button>
            </div>
            <div className="modulos-grid">
              {modulos.map(modulo => (
                <div key={modulo.id} className="modulo-card">
                  <div className="modulo-header">
                    <div>
                      <span className="modulo-codigo">{modulo.codigo}</span>
                      <h3 className="modulo-nombre">{modulo.nombre}</h3>
                    </div>
                    <span className="badge badge-blue">
                      {modulo.metodologia}
                    </span>
                  </div>
                  <div className="modulo-info">
                    <p><strong>Duración:</strong> {modulo.duracion}</p>
                    <p><strong>Inicio:</strong> {modulo.fechaInicio}</p>
                    <p><strong>Fin:</strong> {modulo.fechaFin}</p>
                    <p><strong>Estudiantes:</strong> {modulo.estudiantes}</p>
                  </div>
                  <button className="btn btn-secondary btn-block">
                    Ver Detalles
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'estudiantes':
        return (
          <div className="content-section">
            <h2 className="section-title">Mis Estudiantes</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>RU</th>
                    <th>Nombre</th>
                    <th>Programa</th>
                    <th>Completados</th>
                    <th>En Progreso</th>
                    <th>Avance</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantes.map(estudiante => (
                    <tr key={estudiante.id}>
                      <td>{estudiante.ru}</td>
                      <td className="font-medium">{estudiante.nombre}</td>
                      <td>{estudiante.programa}</td>
                      <td>{estudiante.modulosCompletados}</td>
                      <td>{estudiante.modulosEnProgreso}</td>
                      <td>
                        <div className="progress-container">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{width: `${estudiante.avanceTotal}%`}}
                            ></div>
                          </div>
                          <span className="progress-text">{estudiante.avanceTotal}%</span>
                        </div>
                      </td>
                      <td>
                        <button className="btn-link">
                          Ver Perfil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'avances':
        return (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Registro de Avances</h2>
              <button className="btn btn-success">
                Registrar Avance
              </button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th>Módulo</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Responsable</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {avances.map(avance => (
                    <tr key={avance.id}>
                      <td className="font-medium">{avance.estudiante}</td>
                      <td>{avance.modulo}</td>
                      <td>
                        <span className={`badge ${
                          avance.estado === 'completado' 
                            ? 'badge-green' 
                            : avance.estado === 'en progreso'
                            ? 'badge-yellow'
                            : 'badge-gray'
                        }`}>
                          {avance.estado}
                        </span>
                      </td>
                      <td>{avance.fecha}</td>
                      <td>{avance.responsable}</td>
                      <td>
                        <button className="btn-link mr-2">
                          Editar
                        </button>
                        <button className="btn-link text-red">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'talleres':
        return (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Talleres</h2>
              <button className="btn btn-purple">
                Programar Taller
              </button>
            </div>
            <div className="talleres-grid">
              {talleres.map(taller => (
                <div key={taller.id} className="taller-card">
                  <div className="taller-header">
                    <h3 className="taller-titulo">{taller.titulo}</h3>
                    <span className={`badge ${
                      taller.resultado === 'Completado'
                        ? 'badge-green'
                        : 'badge-orange'
                    }`}>
                      {taller.resultado}
                    </span>
                  </div>
                  <div className="taller-info">
                    <p><strong>Tipo:</strong> {taller.tipo}</p>
                    <p><strong>Metodología:</strong> {taller.metodologia}</p>
                    <p><strong>Duración:</strong> {taller.duracion}</p>
                    <p><strong>Fecha:</strong> {taller.fecha}</p>
                  </div>
                  <button className="btn btn-secondary btn-block">
                    Ver Detalles
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="docente-container">
      {/* Main Content */}
      <div className="docente-content">
        {/* Header */}
        <div className="docente-header">
          <div className="docente-header-content">
            <div>
              <h1 className="docente-title">Panel de Docente</h1>
              <p className="docente-subtitle">{docente.nombre} - {docente.especialidad}</p>
            </div>
            
            <div className="docente-header-actions">
              <button className="notification-btn">
                <Bell size={24} />
                <span className="notification-badge">3</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="docente-main">
          {/* Navigation Tabs */}
          <div className="docente-tabs">
            <button
              onClick={() => setActiveTab('modulos')}
              className={`tab-btn ${activeTab === 'modulos' ? 'active' : ''}`}
            >
              <BookOpen size={20} />
              <span>Mis Módulos</span>
            </button>
            
            <button
              onClick={() => setActiveTab('estudiantes')}
              className={`tab-btn ${activeTab === 'estudiantes' ? 'active' : ''}`}
            >
              <Users size={20} />
              <span>Estudiantes</span>
            </button>
            
            <button
              onClick={() => setActiveTab('avances')}
              className={`tab-btn ${activeTab === 'avances' ? 'active' : ''}`}
            >
              <ClipboardCheck size={20} />
              <span>Avances</span>
            </button>
            
            <button
              onClick={() => setActiveTab('talleres')}
              className={`tab-btn ${activeTab === 'talleres' ? 'active' : ''}`}
            >
              <Calendar size={20} />
              <span>Talleres</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-content">
                <div>
                  <p className="stat-label">Módulos Activos</p>
                  <p className="stat-value">2</p>
                </div>
                <div className="stat-icon blue">
                  <BookOpen size={24} />
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <div>
                  <p className="stat-label">Total Estudiantes</p>
                  <p className="stat-value">55</p>
                </div>
                <div className="stat-icon green">
                  <Users size={24} />
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <div>
                  <p className="stat-label">Avances Registrados</p>
                  <p className="stat-value">127</p>
                </div>
                <div className="stat-icon purple">
                  <ClipboardCheck size={24} />
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <div>
                  <p className="stat-label">Talleres Próximos</p>
                  <p className="stat-value">1</p>
                </div>
                <div className="stat-icon orange">
                  <Calendar size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Docente;