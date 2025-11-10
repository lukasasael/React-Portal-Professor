import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { LoginView } from "./LoginView";
import { useNavigate } from "react-router-dom"; // 👈 adicione
import "./styles.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate(); // 👈 adicionei isso
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password);

      if (success) {
        navigate("/dashboard"); // 👈 redireciona após login bem-sucedido
      } else {
        setError("E-mail ou senha incorretos.");
      }
    } catch {
      setError("E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoginView
      email={email}
      password={password}
      loading={loading}
      error={error}
      onChangeEmail={setEmail}
      onChangePassword={setPassword}
      onSubmit={handleSubmit}
    />
  );
}
