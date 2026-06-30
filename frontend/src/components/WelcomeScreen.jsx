import React, { useState } from 'react';
import logisticVideo from '../assets/0630.mp4'; 

function WelcomeScreen({ onEnter }) {
  // 'menu' será la pantalla principal con los 3 botones principales
  const [view, setView] = useState('menu');

  return (
    <div className="welcome-wrapper">
      {/* Fondo de Video Nativo */}
      <video className="video-background" autoPlay loop muted playsInline>
        <source src={logisticVideo} type="video/mp4" />
        Tu navegador no soporta videos en HTML5.
      </video>
      <div className="video-overlay-darken" />
      
      {/* Contenedor central perfectamente enfocado */}
      <div className="welcome-central-container">
        
        {/* VISTA PRINCIPAL (EL MENÚ) */}
        {view === 'menu' && (
          <div className="tab-pane fade-in">
            <h1>ChapaTuRuta 📍</h1>
            <span className="subtitle">TP2 - COMPLEJIDAD ALGORÍTMICA</span>
            <p>
              Calculamos la ruta más eficiente sobre la red vial real usando Dijkstra. 
              Ingresa al mapa interactivo para comenzar a optimizar.
            </p>
            
            {/* Bloque de botones en vertical */}
            <div className="welcome-buttons-group">
              <button className="btn-main btn-blue" onClick={onEnter}>
                EMPEZAR OPTIMIZACIÓN →
              </button>
              <button className="btn-secondary btn-blue-outline" onClick={() => setView('informacion')}>
                INFORMACIÓN DEL PROYECTO
              </button>
              <button className="btn-secondary btn-blue-outline" onClick={() => setView('creditos')}>
                CRÉDITOS
              </button>
            </div>
          </div>
        )}

        {/* VISTA DE INFORMACIÓN */}
        {view === 'informacion' && (
          <div className="tab-pane fade-in long-content">
            <h2>Optimización de Rutas Urbanas</h2>
            <p className="info-text">
              Este sistema carga un grafo real de Lima (nodos.csv y aristas.csv) y utiliza el algoritmo de Dijkstra para calcular el camino más corto entre dos puntos seleccionados en el mapa. El backend en Python procesa la complejidad matemática en tiempo real.
            </p>
            <ul className="info-list">
              <li>📍 Uso de la red vial de Lima real</li>
              <li>⚡ Implementación de Dijkstra desde cero</li>
              <li>🗺️ Visualización interactiva con Leaflet.js</li>
            </ul>
            <button className="btn-back" onClick={() => setView('menu')}>
              ← VOLVER AL INICIO
            </button>
          </div>
        )}

        {/* VISTA DE CRÉDITOS */}
        {view === 'creditos' && (
          <div className="tab-pane fade-in">
            <h2>Créditos del Proyecto</h2>
            <p className="info-text">Desarrollado como Proyecto Académico para el curso de Complejidad.</p>
            
            <div className="credits-box">
              <h3>Equipo de Desarrollo</h3>
              <ul className="creators-list">
                <li> López Monroy, Rodrigo Alfredo </li>
                <li> Aguirre Ramos, Eduardo Manuel </li>
                <li> Bernal Torres, Carlos Alberto </li>
              </ul>
              <h3>Profesor del Curso</h3>
              <p className="instructor">Abraham Sopla Maslucán</p>
            </div>
            <p className="university">Universidad de Ciencias Aplicadas (UPC)</p>
            
            <button className="btn-back" onClick={() => setView('menu')}>
              ← VOLVER AL INICIO
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default WelcomeScreen;