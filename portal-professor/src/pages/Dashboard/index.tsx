import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { DashboardView } from "./DashboardView";
import "./styles.css";

export type DashboardData = {
  totalAlunos: number;
  totalTurmas: number;
  proximasAvaliacoes: { nome: string; data: string }[];
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [dados, setDados] = useState<DashboardData | null>(null);

  useEffect(() => {
    // 🧠 Simula uma chamada de API
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

  return <DashboardView user={user} dados={dados} onLogout={logout} />;
}
