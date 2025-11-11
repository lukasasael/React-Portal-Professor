import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { DashboardView } from "./DashboardView";
import "./styles.css";

type Avaliacao = {
  id: number;
  nome: string;
  data: string;
  turma: string;
};

type DashboardData = {
  totalAlunos: number;
  totalTurmas: number;
  proximasAvaliacoes: Avaliacao[];
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [dados, setDados] = useState<DashboardData | null>(null);

  // 🔹 Função principal para carregar dados do localStorage
  function carregarDados() {
    try {
      const alunos = JSON.parse(localStorage.getItem("alunos") || "[]");
      const turmas = JSON.parse(localStorage.getItem("turmas") || "[]");
      const avaliacoes = JSON.parse(localStorage.getItem("avaliacoes") || "[]");

      // Ordenar por data e pegar as 3 próximas
      const proximas = avaliacoes
        .filter((a: Avaliacao) => new Date(a.data) >= new Date())
        .sort(
          (a: Avaliacao, b: Avaliacao) =>
            new Date(a.data).getTime() - new Date(b.data).getTime()
        )
        .slice(0, 3);

      setDados({
        totalAlunos: alunos.length,
        totalTurmas: turmas.length,
        proximasAvaliacoes: proximas,
      });
    } catch (err) {
      console.error("Erro ao carregar dados do dashboard:", err);
      setDados({
        totalAlunos: 0,
        totalTurmas: 0,
        proximasAvaliacoes: [],
      });
    }
  }

  // 🔁 Atualiza dados em tempo real
  useEffect(() => {
    carregarDados();

    // Ouve mudanças no localStorage e eventos personalizados
    const atualizar = () => carregarDados();
    window.addEventListener("storage", atualizar);
    window.addEventListener("avaliacoes:updated", atualizar);

    return () => {
      window.removeEventListener("storage", atualizar);
      window.removeEventListener("avaliacoes:updated", atualizar);
    };
  }, []);

  return <DashboardView user={user} dados={dados} onLogout={logout} />;
}
