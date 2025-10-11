// src/components/ParticleSystem.js
import { useEffect, useRef } from "react";

// Constantes movidas fuera del componente para evitar recreación
const PARTICLE_COUNT = 15; // Reducido para mejor rendimiento
const PARTICLE_SIZE = 6;

const ParticleSystem = () => {
  const particlesRef = useRef([]);

  useEffect(() => {
    const particles = [];
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    // Crear partículas como divs (igual que el original)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement("div");
      p.style.position = "fixed";
      p.style.width = `${PARTICLE_SIZE}px`;
      p.style.height = `${PARTICLE_SIZE}px`;
      p.style.borderRadius = "50%";
      // Inicialmente rojo (igual que el original)
      p.style.background = `rgb(255,0,0)`;
      p.style.pointerEvents = "none";
      p.style.zIndex = 0;
      p.style.left = `${mouse.x}px`;
      p.style.top = `${mouse.y}px`;
      p.style.opacity = 0.7;
      document.body.appendChild(p);
      // Guardar color phase para animar gradiente (igual que el original)
      particles.push({ el: p, x: mouse.x, y: mouse.y, colorPhase: i / PARTICLE_COUNT });
    }
    particlesRef.current = particles;

    // Seguir el mouse (igual que el original)
    function onMouseMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    window.addEventListener("mousemove", onMouseMove);

    // Animar partículas (lógica original restaurada)
    let animationId;
    function animateParticles(time) {
      let prev = { x: mouse.x, y: mouse.y };
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // Seguir suavemente al anterior (igual que el original)
        p.x += (prev.x - p.x) * 0.2;
        p.y += (prev.y - p.y) * 0.2;
        p.el.style.left = `${p.x - PARTICLE_SIZE / 2}px`;
        p.el.style.top = `${p.y - PARTICLE_SIZE / 2}px`;
        // Animar color de rojo a azul (lógica original)
        // Oscila entre 0 y 1 con el tiempo y la fase de la partícula
        const t = ((time || 0) / 1000 + p.colorPhase) % 1;
        const r = Math.round(255 * (1 - t));
        const g = 0;
        const b = Math.round(255 * t);
        p.el.style.background = `rgb(${r},${g},${b})`;
        prev = p;
      }
      animationId = requestAnimationFrame(animateParticles);
    }
    animateParticles();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      particles.forEach(p => document.body.removeChild(p.el));
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return null;
};

export default ParticleSystem;