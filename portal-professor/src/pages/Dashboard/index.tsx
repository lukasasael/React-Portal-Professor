import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./index.css";

type DashboardData = {
  totalAlunos: number;
  totalTurmas: number;
  proximasAvaliacoes: { nome: string; data: string }[];
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [dados, setDados] = useState<DashboardData | null>(null);

  useEffect(() => {
    // 🧠 Simula uma chamada de API (dados fake)
    setTimeout(() => {
      setDados({
        totalAlunos: 42,
        totalTurmas: 5,
        proximasAvaliacoes: [
          { nome: "Prova 1 - Matemática", data: "2025-11-12" },
          { nome: "Trabalho - História", data: "2025-11-15" },
          { nome: "Participação - Inglês", data: "2025-11-18" },
        ],
      });
    }, 800);
  }, []);

  if (!dados) {
    return (
      <div className="dashboard-loading">
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Bem-vindo, {user?.name || "Professor"} 👋</h1>
        <button onClick={logout} className="logout-button">
          Sair
        </button>
      </header>

      <main className="dashboard-content">
        <div className="card destaque">
          <h2>Total de Alunos</h2>
          <p>{dados.totalAlunos}</p>
        </div>

        <div className="card destaque">
          <h2>Total de Turmas</h2>
          <p>{dados.totalTurmas}</p>
        </div>

        <div className="card avaliacoes">
          <h2>Próximas Avaliações</h2>
          <ul>
            {dados.proximasAvaliacoes.map((av, i) => (
              <li key={i}>
                <strong>{av.nome}</strong> – {new Date(av.data).toLocaleDateString("pt-BR")}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
