import { useEffect, useState } from "react";
import "./index.css";

type Aluno = {
  id: number;
  nome: string;
  email: string;
  turma: string;
  status: "Ativo" | "Inativo";
};

export default function Alunos() {
  // 🔹 1. Carregar alunos salvos no localStorage ao iniciar
  const [alunos, setAlunos] = useState<Aluno[]>(() => {
    const data = localStorage.getItem("alunos");
    return data ? JSON.parse(data) : [
      { id: 1, nome: "Maria Silva", email: "maria@escola.com", turma: "1A", status: "Ativo" },
      { id: 2, nome: "João Santos", email: "joao@escola.com", turma: "2B", status: "Inativo" },
      { id: 3, nome: "Ana Lima", email: "ana@escola.com", turma: "1A", status: "Ativo" },
    ];
  });

  // 🔹 2. Sempre que alunos mudar, salvar no localStorage
  useEffect(() => {
    localStorage.setItem("alunos", JSON.stringify(alunos));
  }, [alunos]);
  

  const [filtro, setFiltro] = useState({ nome: "", turma: "", status: "" });
  const [novoAluno, setNovoAluno] = useState<Omit<Aluno, "id">>({ nome: "", email: "", turma: "", status: "Ativo" });
  const [modoEdicao, setModoEdicao] = useState<number | null>(null);

  // 📘 Filtragem dinâmica
  const alunosFiltrados = alunos.filter((a) => {
    return (
      a.nome.toLowerCase().includes(filtro.nome.toLowerCase()) &&
      a.turma.toLowerCase().includes(filtro.turma.toLowerCase()) &&
      (filtro.status === "" || a.status === filtro.status)
    );
  });

  function handleAddAluno(e: React.FormEvent) {
    e.preventDefault();
    if (!novoAluno.nome || !novoAluno.email || !novoAluno.turma) return;
  
    if (modoEdicao) {
      // editar aluno existente
      setAlunos((prev) =>
        prev.map((a) => (a.id === modoEdicao ? { ...a, ...novoAluno } : a))
      );
      setModoEdicao(null);
    } else {
      // criar novo aluno
      const novo = { ...novoAluno, id: Date.now() };
      setAlunos((prev) => [...prev, novo]);
    }
  
    // limpar formulário
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
    <div className="alunos-container">
      <h1>Gerenciar Alunos</h1>

      {/* 🔍 Filtros */}
      <div className="filtros">
        <input
          type="text"
          placeholder="Filtrar por nome"
          value={filtro.nome}
          onChange={(e) => setFiltro({ ...filtro, nome: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filtrar por turma"
          value={filtro.turma}
          onChange={(e) => setFiltro({ ...filtro, turma: e.target.value })}
        />
        <select
          value={filtro.status}
          onChange={(e) => setFiltro({ ...filtro, status: e.target.value })}
        >
          <option value="">Todos</option>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>
      </div>

      {/* 📋 Tabela */}
      <table className="alunos-tabela">
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Turma</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {alunosFiltrados.length === 0 ? (
            <tr>
              <td colSpan={5}>Nenhum aluno encontrado.</td>
            </tr>
          ) : (
            alunosFiltrados.map((a) => (
              <tr key={a.id}>
                <td>{a.nome}</td>
                <td>{a.email}</td>
                <td>{a.turma}</td>
                <td>{a.status}</td>
                <td>
                  <button onClick={() => handleEditar(a)} className="btn-editar">Editar</button>
                  <button onClick={() => handleRemover(a.id)} className="btn-remover">Remover</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ➕ Formulário */}
      <form onSubmit={handleAddAluno} className="form-novo-aluno">
        <h2>{modoEdicao ? "Editar Aluno" : "Adicionar Novo Aluno"}</h2>

        <input
          type="text"
          placeholder="Nome"
          value={novoAluno.nome}
          onChange={(e) => setNovoAluno({ ...novoAluno, nome: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          value={novoAluno.email}
          onChange={(e) => setNovoAluno({ ...novoAluno, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Turma"
          value={novoAluno.turma}
          onChange={(e) => setNovoAluno({ ...novoAluno, turma: e.target.value })}
          required
        />
        <select
          value={novoAluno.status}
          onChange={(e) => setNovoAluno({ ...novoAluno, status: e.target.value as "Ativo" | "Inativo" })}
        >
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>

        <button type="submit">{modoEdicao ? "Salvar Alterações" : "Adicionar"}</button>
      </form>
    </div>
  );
}
