import { useEffect, useState } from "react";
import { AlunosView } from "./AlunosView";
import "./styles.css";

export type Aluno = {
  id: number;
  nome: string;
  email: string;
  turma: string;
  status: "Ativo" | "Inativo";
};

export default function Alunos() {
  // 🔹 1. Carregar alunos do localStorage
  const [alunos, setAlunos] = useState<Aluno[]>(() => {
    const data = localStorage.getItem("alunos");
    return data
      ? JSON.parse(data)
      : [
          { id: 1, nome: "Maria Silva", email: "maria@escola.com", turma: "1A", status: "Ativo" },
          { id: 2, nome: "João Santos", email: "joao@escola.com", turma: "2B", status: "Inativo" },
          { id: 3, nome: "Ana Lima", email: "ana@escola.com", turma: "1A", status: "Ativo" },
        ];
  });

  useEffect(() => {
    localStorage.setItem("alunos", JSON.stringify(alunos));
  }, [alunos]);

  const [filtro, setFiltro] = useState({ nome: "", turma: "", status: "" });
  const [novoAluno, setNovoAluno] = useState<Omit<Aluno, "id">>({
    nome: "",
    email: "",
    turma: "",
    status: "Ativo",
  });
  const [modoEdicao, setModoEdicao] = useState<number | null>(null);

  // 📘 Filtragem dinâmica
  const alunosFiltrados = alunos.filter((a) => {
    return (
      a.nome.toLowerCase().includes(filtro.nome.toLowerCase()) &&
      a.turma.toLowerCase().includes(filtro.turma.toLowerCase()) &&
      (filtro.status === "" || a.status === filtro.status)
    );
  });

  // ➕ Adicionar / Editar
  function handleAddAluno(e: React.FormEvent) {
    e.preventDefault();
    if (!novoAluno.nome || !novoAluno.email || !novoAluno.turma) return;

    if (modoEdicao) {
      setAlunos((prev) =>
        prev.map((a) => (a.id === modoEdicao ? { ...a, ...novoAluno } : a))
      );
      setModoEdicao(null);
    } else {
      const novo = { ...novoAluno, id: Date.now() };
      setAlunos((prev) => [...prev, novo]);
    }

    setNovoAluno({ nome: "", email: "", turma: "", status: "Ativo" });
  }

  // 🧹 Remover aluno
  function handleRemover(id: number) {
    setAlunos((prev) => prev.filter((a) => a.id !== id));
  }

  // ✏️ Editar aluno
  function handleEditar(aluno: Aluno) {
    setNovoAluno(aluno);
    setModoEdicao(aluno.id);
  }

  return (
    <AlunosView
      alunos={alunosFiltrados}
      filtro={filtro}
      novoAluno={novoAluno}
      modoEdicao={modoEdicao}
      onChangeFiltro={setFiltro}
      onChangeNovoAluno={setNovoAluno}
      onAddAluno={handleAddAluno}
      onEditar={handleEditar}
      onRemover={handleRemover}
    />
  );
}
