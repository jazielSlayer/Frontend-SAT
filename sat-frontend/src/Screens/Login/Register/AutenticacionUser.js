import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { sendAuthCode, verifyAuthCode } from "../../../API/Verficacion/Verificacion"; // Ajusta la ruta según tu estructura

function AutenticacionUser() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { personaId, correo, nombres } = location.state || {};

  useEffect(() => {
    if (!personaId || !correo) {
      navigate("/register");
      return;
    }

    const sendInitialCode = async () => {
      setLoading(true);
      try {
        await sendAuthCode(correo);
        setSuccess(`Código de autenticación enviado a ${correo}`);
      } catch (err) {
        setError("Error al enviar el código de autenticación: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    sendInitialCode();
  }, [personaId, correo, navigate]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setCode(value);
      setError("");
      setSuccess("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || resendLoading) return;
    setLoading(true);
    setError("");
    setSuccess("");

    if (!/^\d{6}$/.test(code)) {
      setError("El código debe ser de 6 dígitos numéricos");
      setLoading(false);
      return;
    }

    try {
      await verifyAuthCode(correo, code);
      setSuccess("Código verificado correctamente. Continúa con el registro.");

      navigate("/register-step3", {
        state: { personaId, correo, nombres },
      });
    } catch (err) {
      setError("Error al verificar el código: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (loading || resendLoading) return;
    setResendLoading(true);
    setError("");
    setSuccess("");

    try {
      await sendAuthCode(correo);
      setSuccess(`Código de autenticación reenviado a ${correo}`);
    } catch (err) {
      setError("Error al reenviar el código: " + err.message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.title}>Registro - Paso 2</h2>
        <p style={styles.subtitle}>
          Verifica tu correo electrónico para {nombres}
        </p>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="code"
            placeholder="Código de autenticación (6 dígitos)"
            value={code}
            onChange={handleChange}
            style={styles.input}
            required
            maxLength="6"
            inputMode="numeric"
            pattern="\d{6}"
          />
          <button
            type="submit"
            style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
            disabled={loading}
          >
            {loading ? "Verificando..." : "Verificar Código"}
          </button>
          <button
            type="button"
            onClick={handleResendCode}
            style={
              resendLoading
                ? { ...styles.resendButton, ...styles.buttonDisabled }
                : styles.resendButton
            }
            disabled={resendLoading}
          >
            {resendLoading ? "Enviando..." : "Reenviar Código"}
          </button>
        </form>

        <p style={styles.registerText}>
          <Link to="/register" style={styles.registerLink}>
            ← Volver al paso anterior
          </Link>
          {" | "}
          <Link to="/login" style={styles.registerLink}>
            Iniciar sesión
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
    minHeight: "100vh",
    padding: "20px",
  },
  formWrapper: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "400px",
    maxWidth: "90vw",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  title: {
    color: "#fff",
    marginBottom: "10px",
    fontSize: "28px",
    fontWeight: "bold",
  },
  subtitle: {
    color: "#f0f0f0",
    marginBottom: "25px",
    textAlign: "center",
    fontSize: "16px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    gap: "15px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.2)",
    outline: "none",
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: "16px",
    transition: "all 0.3s ease",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#950707ff",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "16px",
    marginTop: "10px",
  },
  resendButton: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.2)",
    backgroundColor: "transparent",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "16px",
    marginTop: "10px",
  },
  buttonDisabled: {
    backgroundColor: "#666",
    cursor: "not-allowed",
  },
  registerText: {
    color: "#fff",
    marginTop: "20px",
    fontSize: "14px",
    textAlign: "center",
  },
  registerLink: {
    color: "#6c63ff",
    textDecoration: "underline",
    fontWeight: "bold",
  },
  error: {
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    border: "1px solid #f44336",
    color: "#f44336",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "15px",
    textAlign: "center",
    width: "100%",
  },
  success: {
    backgroundColor: "rgba(46, 125, 50, 0.1)",
    border: "1px solid #2e7d32",
    color: "#2e7d32",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "15px",
    textAlign: "center",
    width: "100%",
  },
};

export default AutenticacionUser;