import { useState, useEffect } from "react";
import "./index.css";

type Turma = {
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

  // 🔹 Atualiza automaticamente a quantidade de alunos por turma
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

  // ➕ Adicionar ou editar turma
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
    <div className="turmas-container">
      <h1>Gerenciar Turmas</h1>

      {/* 🔍 Filtro */}
      <input
        type="text"
        placeholder="Filtrar por nome da turma"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="filtro-input"
      />

      {/* 📋 Tabela */}
      <table className="turmas-tabela">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Capacidade</th>
            <th>Qtd. Alunos</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {turmasFiltradas.length === 0 ? (
            <tr>
              <td colSpan={4}>Nenhuma turma encontrada.</td>
            </tr>
          ) : (
            turmasFiltradas.map((t) => (
              <tr key={t.id}>
                <td>{t.nome}</td>
                <td>{t.capacidade}</td>
                <td>{t.qtdAlunos}</td>
                <td>
                  <button onClick={() => handleEditar(t)} className="btn-editar">
                    Editar
                  </button>
                  <button onClick={() => handleRemover(t.id)} className="btn-remover">
                    Remover
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 🧾 Formulário */}
      <form onSubmit={handleAddTurma} className="form-turma">
        <h2>{modoEdicao ? "Editar Turma" : "Adicionar Nova Turma"}</h2>

        <input
          type="text"
          placeholder="Nome"
          value={novaTurma.nome}
          onChange={(e) => setNovaTurma({ ...novaTurma, nome: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Capacidade"
          value={novaTurma.capacidade}
          onChange={(e) =>
            setNovaTurma({ ...novaTurma, capacidade: Number(e.target.value) })
          }
          required
        />
        <input
          type="number"
          placeholder="Qtd. de Alunos"
          value={novaTurma.qtdAlunos}
          onChange={(e) =>
            setNovaTurma({ ...novaTurma, qtdAlunos: Number(e.target.value) })
          }
          required
        />

        <button type="submit">
          {modoEdicao ? "Salvar Alterações" : "Adicionar"}
        </button>
      </form>
    </div>
  );
}
