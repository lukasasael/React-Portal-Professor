import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { DashboardView } from "./DashboardView";
import "./styles.css";

type DashboardData = {
  totalAlunos: number;
  totalTurmas: number;
  proximasAvaliacoes: { nome: string; data: string }[];
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [dados, setDados] = useState<DashboardData | null>(null);

  // 🔹 Carrega dados do localStorage
  function carregarDados() {
    const alunos = JSON.parse(localStorage.getItem("alunos") || "[]");
    const turmas = JSON.parse(localStorage.getItem("turmas") || "[]");

    setDados({
      totalAlunos: alunos.length,
      totalTurmas: turmas.length,
      proximasAvaliacoes: [
        { nome: "Prova 1 - Matemática", data: "2025-11-12" },
        { nome: "Trabalho - História", data: "2025-11-15" },
        { nome: "Participação - Inglês", data: "2025-11-18" },
      ],
    });
  }

  useEffect(() => {
    carregarDados();
    // Atualiza automaticamente caso localStorage mude (ex: aluno adicionado)
    window.addEventListener("storage", carregarDados);
    return () => window.removeEventListener("storage", carregarDados);
  }, []);

  return (
    <DashboardView user={user} dados={dados} onLogout={logout} />
  );
}
