import { useEffect, useState } from "react";
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

  // 🔹 Atualiza quantidade de alunos por turma
  function atualizarQtdAlunos() {
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

  // 🔹 Carrega alunos ao montar
  useEffect(() => {
    atualizarQtdAlunos();
  }, []);

  // 🔹 Atualiza automaticamente se alunos forem alterados
  useEffect(() => {
    window.addEventListener("storage", atualizarQtdAlunos);
    return () => window.removeEventListener("storage", atualizarQtdAlunos);
  }, []);

  // 🔹 Salva turmas sempre que mudar
  useEffect(() => {
    localStorage.setItem("turmas", JSON.stringify(turmas));
  }, [turmas]);

  const [filtro, setFiltro] = useState("");
  const [novaTurma, setNovaTurma] = useState<Omit<Turma, "id" | "qtdAlunos">>({
    nome: "",
    capacidade: 0,
  });
  const [modoEdicao, setModoEdicao] = useState<number | null>(null);

  const turmasFiltradas = turmas.filter((t) =>
    t.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  // ➕ Adicionar ou editar turma
  function handleAddTurma(e: React.FormEvent) {
    e.preventDefault();
    if (!novaTurma.nome) return;

    if (modoEdicao) {
      setTurmas((prev) =>
        prev.map((t) =>
          t.id === modoEdicao ? { ...t, nome: novaTurma.nome, capacidade: novaTurma.capacidade } : t
        )
      );
      setModoEdicao(null);
    } else {
      const nova = { ...novaTurma, id: Date.now(), qtdAlunos: 0 };
      setTurmas((prev) => [...prev, nova]);
    }

    setNovaTurma({ nome: "", capacidade: 0 });
  }

  // 🧹 Remover turma
  function handleRemover(id: number) {
    setTurmas((prev) => prev.filter((t) => t.id !== id));
  }

  // ✏️ Editar turma
  function handleEditar(turma: Turma) {
    setNovaTurma({ nome: turma.nome, capacidade: turma.capacidade });
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
