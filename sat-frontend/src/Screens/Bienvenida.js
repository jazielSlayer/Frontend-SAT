import React, { useEffect, useRef } from "react";

function Bienvenida() {
	const mountRef = useRef(null);



			useEffect(() => {
				let renderer, scene, camera, cube, animationId;
				const mountNode = mountRef.current;


					// Cargar three.js dinámicamente
						import('three').then(THREE => {
							const width = 600;
							const height = 500;
							renderer = new THREE.WebGLRenderer({ alpha: true });
							renderer.setSize(width, height);
							renderer.setClearColor(0x000000, 0.2);
							mountNode.appendChild(renderer.domElement);

							scene = new THREE.Scene();
							camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
							camera.position.z = 7; // Alejar la cámara para un cubo más grande

							// Cubo grande
							const geometry = new THREE.BoxGeometry(3, 3, 3); // Tamaño del cubo aumentado
							const material = new THREE.MeshStandardMaterial({ color: 0x00ff99 });
							cube = new THREE.Mesh(geometry, material);
							scene.add(cube);

							const light = new THREE.PointLight(0xffffff, 1, 100);
							light.position.set(10, 10, 10);
							scene.add(light);

							function animateFrame() {
								animationId = requestAnimationFrame(animateFrame);
								cube.rotation.x += 0.01;
								cube.rotation.y += 0.01;
								renderer.render(scene, camera);
							}
							animateFrame();
						});

				return () => {
					if (renderer && renderer.domElement && mountNode) {
						mountNode.removeChild(renderer.domElement);
					}
					if (animationId) cancelAnimationFrame(animationId);
				};
			}, []);

		return (
				<div style={{ textAlign: 'center', marginTop: '3rem', position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
					{/* Canvas animado solo en el centro, no cubre la navegación */}
					<div
						ref={mountRef}
						style={{
							position: 'absolute',
							top: '120px', // debajo de la navegación
							left: '50%',
							transform: 'translateX(-50%)',
							width: '600px',
							height: '500px',
							zIndex: 0,
							pointerEvents: 'none', // permite clics a través del canvas
						}}
					/>
					<div style={{ position: 'relative', zIndex: 1 }}>
						<h1>¡Bienvenido al Sistema SAT!</h1>
						<p>Selecciona una opción en la barra de navegación para comenzar.</p>
						<img src="/logo192.png" alt="Logo" style={{ width: 120, margin: '2rem auto' }} />
					</div>
				</div>
		);
}

export default Bienvenida;
