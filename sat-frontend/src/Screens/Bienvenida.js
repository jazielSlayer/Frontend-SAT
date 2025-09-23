import React, { useEffect, useRef } from "react";

const PARTICLE_COUNT = 20;
const PARTICLE_SIZE = 8; // Más pequeñas

function Bienvenida() {
	const containerRef = useRef(null);
	const particlesRef = useRef([]);

	useEffect(() => {
		const particles = [];
		let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

		// Crear partículas como divs
		for (let i = 0; i < PARTICLE_COUNT; i++) {
			const p = document.createElement("div");
			p.style.position = "fixed";
			p.style.width = `${PARTICLE_SIZE}px`;
			p.style.height = `${PARTICLE_SIZE}px`;
			p.style.borderRadius = "50%";
			// Inicialmente rojo
			p.style.background = `rgb(255,0,0)`;
			p.style.pointerEvents = "none";
			p.style.zIndex = 0;
			p.style.left = `${mouse.x}px`;
			p.style.top = `${mouse.y}px`;
			p.style.opacity = 0.7;
			document.body.appendChild(p);
			// Guardar color phase para animar gradiente
			particles.push({ el: p, x: mouse.x, y: mouse.y, colorPhase: i / PARTICLE_COUNT });
		}
		particlesRef.current = particles;

		// Seguir el mouse
		function onMouseMove(e) {
			mouse.x = e.clientX;
			mouse.y = e.clientY;
		}
		window.addEventListener("mousemove", onMouseMove);

		// Animar partículas
		let animationId;
		function animateParticles(time) {
			let prev = { x: mouse.x, y: mouse.y };
			for (let i = 0; i < particles.length; i++) {
				const p = particles[i];
				// Seguir suavemente al anterior
				p.x += (prev.x - p.x) * 0.2;
				p.y += (prev.y - p.y) * 0.2;
				p.el.style.left = `${p.x - PARTICLE_SIZE / 2}px`;
				p.el.style.top = `${p.y - PARTICLE_SIZE / 2}px`;
				// Animar color de rojo a azul
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

	return (
		<div ref={containerRef} style={{ textAlign: 'center', marginTop: '3rem', position: 'relative', minHeight: '100vh', overflow: 'hidden', justifyContent: "flex-end" }}>
			<div style={{ position: 'relative', zIndex: 1, justifyContent: "flex-start" }}>
				<h1 style={{ color: 'white' }}>¡Bienvenido al Sistema SAT!</h1>
				<p style={{ color: 'white' }}>Selecciona una opción en la barra de navegación para comenzar.</p>
				<img src="/Splash-screen3.png" alt="Logo" style={{ width: 120, margin: '2rem auto' }} />
			</div>
		</div>
	);
}

export default Bienvenida;