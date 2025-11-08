import { useAuth } from "../../contexts/AuthContext";
import "./index.css";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Bem-vindo, {user?.name || "Professor"} 👋</h1>
        <button onClick={logout} className="logout-button">
          Sair
        </button>
      </header>

      <main className="dashboard-content">
        <div className="card">
          <h2>Alunos</h2>
          <p>Total: 0 (dados simulados)</p>
        </div>

        <div className="card">
          <h2>Turmas</h2>
          <p>Total: 0 (dados simulados)</p>
        </div>

        <div className="card">
          <h2>Próximas Avaliações</h2>
          <p>Nenhuma avaliação marcada</p>
        </div>
      </main>
    </div>
  );
}
