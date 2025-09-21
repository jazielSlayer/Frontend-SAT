
import { Link } from "react-router-dom";

function Navegacion() {
	return (
		<nav style={{ background: '#222', padding: '1rem' }}>
			<ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', margin: 0, padding: 0 }}>
				<li><Link style={{ color: '#fff', textDecoration: 'none' }} to="/">Bienvenida</Link></li>
				<li><Link style={{ color: '#fff', textDecoration: 'none' }} to="/admin">Admin</Link></li>
				<li><Link style={{ color: '#fff', textDecoration: 'none' }} to="/docente">Docente</Link></li>
				<li><Link style={{ color: '#fff', textDecoration: 'none' }} to="/estudiante">Estudiante</Link></li>
				<li><Link style={{ color: '#fff', textDecoration: 'none' }} to="/login">Login</Link></li>
			</ul>
		</nav>
	);
}

export default Navegacion;
