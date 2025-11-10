import { useState, useEffect } from "react";
import { TurmasView } from "./TurmasView";
import "./styles.css";

export type Turma = {
  id: number;
  nome: string;
  capacidade: number;
  qtdAlunos: number;
};

export default function Turmas() {
  // 🔹 Carrega turmas salvas ou cria mock inicial
  const [turmas, setTurmas] = useState<Turma[]>(() => {
    const data = localStorage.getItem("turmas");
    return data
      ? JSON.parse(data)
      : [
          { id: 1, nome: "1A", capacidade: 30, qtdAlunos: 0 },
          { id: 2, nome: "2B", capacidade: 35, qtdAlunos: 0 },
        ];
  });

  // 🔹 Salva no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("turmas", JSON.stringify(turmas));
  }, [turmas]);

  // 🔹 Atualiza automaticamente a quantidade de alunos
  useEffect(() => {
    const dataAlunos = localStorage.getItem("alunos");
    if (!dataAlunos) return;

    const alunos = JSON.parse(dataAlunos);
    const turmasAtualizadas = turmas.map((t) => {
      const qtd = alunos.filter((a: any) => a.turma === t.nome).length;
      return { ...t, qtdAlunos: qtd };
    });

    setTurmas(turmasAtualizadas);
  }, []);

  // 🔹 Atualiza quando houver mudança em "alunos" no localStorage
  useEffect(() => {
    function syncTurmas() {
      const dataAlunos = localStorage.getItem("alunos");
      if (!dataAlunos) return;

      const alunos = JSON.parse(dataAlunos);
      setTurmas((prev) =>
        prev.map((t) => ({
          ...t,
          qtdAlunos: alunos.filter((a: any) => a.turma === t.nome).length,
        }))
      );
    }

    window.addEventListener("storage", syncTurmas);
    return () => window.removeEventListener("storage", syncTurmas);
  }, []);

  const [filtro, setFiltro] = useState("");
  const [novaTurma, setNovaTurma] = useState<Omit<Turma, "id">>({
    nome: "",
    capacidade: 0,
    qtdAlunos: 0,
  });
  const [modoEdicao, setModoEdicao] = useState<number | null>(null);

  const turmasFiltradas = turmas.filter((t) =>
    t.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  // ➕ Adicionar / Editar
  function handleAddTurma(e: React.FormEvent) {
    e.preventDefault();
    if (!novaTurma.nome) return;

    if (modoEdicao) {
      setTurmas((prev) =>
        prev.map((t) => (t.id === modoEdicao ? { ...t, ...novaTurma } : t))
      );
      setModoEdicao(null);
    } else {
      const nova = { ...novaTurma, id: Date.now() };
      setTurmas((prev) => [...prev, nova]);
    }

    setNovaTurma({ nome: "", capacidade: 0, qtdAlunos: 0 });
  }

  // 🧹 Remover turma
  function handleRemover(id: number) {
    setTurmas((prev) => prev.filter((t) => t.id !== id));
  }

  // ✏️ Editar turma
  function handleEditar(turma: Turma) {
    setNovaTurma(turma);
    setModoEdicao(turma.id);
  }

  return (
    <TurmasView
      turmas={turmasFiltradas}
      filtro={filtro}
      novaTurma={novaTurma}
      modoEdicao={modoEdicao}
      onChangeFiltro={setFiltro}
      onChangeNovaTurma={setNovaTurma}
      onAddTurma={handleAddTurma}
      onEditar={handleEditar}
      onRemover={handleRemover}
    />
  );
}
