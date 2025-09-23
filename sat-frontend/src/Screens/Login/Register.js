import React, { useState } from "react";
import { Link } from "react-router-dom"; // Importar Link
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    // Aquí puedes llamar a tu API de registro
    console.log("Email:", email);
    console.log("Password:", password);
    alert("Usuario registrado exitosamente");
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.title}>Registro</h2>
        <p style={styles.subtitle}>Crea tu nueva cuenta</p>
        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Registrarse
          </button>
        </form>
        <p style={styles.loginText}>
          ¿Ya tienes una cuenta?{" "}
            <Link to="/login" style={styles.registerLink}>
                      iniciarsecion
            </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  formWrapper: {
    backgroundColor: "rgba(0, 0, 0, 0.7)", // negro semi-transparente
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "350px",
  },
  title: {
    color: "#fff",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#f0f0f0",
    marginBottom: "20px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  input: {
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
  },
  button: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#950707ff",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
  loginText: {
    color: "#fff",
    marginTop: "15px",
    fontSize: "14px",
  },
  loginLink: {
    color: "#950707ff",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Register;
