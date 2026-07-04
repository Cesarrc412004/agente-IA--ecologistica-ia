import { useState } from 'react';
import ChatWidget from './components/ChatWidget';
import './styles.css';

export default function App() {
  return (
    <div className="app-container">
      {/* Barra de Navegación */}
      <nav className="navbar">
        <div className="logo">EcoLogística<span>S.A.</span></div>
        <div className="nav-links">
          <a href="#servicios">Servicios</a>
          <a href="#cobertura">Cobertura</a>
          <button className="btn-contacto">Plataforma</button>
        </div>
      </nav>

      {/* Sección Principal (Hero) */}
      <header className="hero">
        <div className="hero-content">
          <h1>Logística inteligente, <br />entregas sustentables.</h1>
          <p>Optimizamos tus cadenas de distribución y transporte con auditoría en tiempo real y el menor impacto ambiental.</p>
          <div className="hero-buttons">
            <button className="btn-primary">Cotizar Envío</button>
            <button className="btn-secondary">Saber más</button>
          </div>
        </div>
      </header>

      {/* El componente del Agente de IA (Flotante) */}
      <ChatWidget />
    </div>
  );
}