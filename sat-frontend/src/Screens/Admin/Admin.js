
import React, { useEffect, useState } from "react";
import { getUsers } from "../../API/Admin/Users_Admin";	

function Admin() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		getUsers()
			.then((data) => {
				setUsers(data);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, []);

	return (
		<div>
			<h2>Pantalla de Administrador</h2>
			<p>Bienvenido, Administrador.</p>
			{loading && <div>Cargando usuarios...</div>}
			{error && <div style={{color: 'red'}}>Error: {error}</div>}
			{!loading && !error && (
				<table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
					<thead>
						<tr>
							<th>ID</th>
							<th>User Name</th>
							<th>Per ID</th>
							<th>Status</th>
							<th>Email</th>
							<th>Email Verified At</th>
							<th>Password</th>
							<th>Remember Token</th>
							<th>Created At</th>
							<th>Updated At</th>
						</tr>
					</thead>
					<tbody>
						{Array.isArray(users) && users.length > 0 ? (
							users.map((user, idx) => (
								<tr key={user.id || idx}>
									<td>{user.id}</td>
									<td>{user.user_name}</td>
									<td>{user.per_id}</td>
									<td>{user.status}</td>
									<td>{user.email}</td>
									<td>{user.email_verified_at}</td>
									<td>{user.password}</td>
									<td>{user.remember_token}</td>
									<td>{user.created_at}</td>
									<td>{user.updated_at}</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="10">No hay usuarios</td>
							</tr>
						)}
					</tbody>
				</table>
			)}
		</div>
	);
}

export default Admin;
