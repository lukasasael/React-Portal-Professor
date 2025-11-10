import { Aluno } from "./index";

type Props = {
  alunos: Aluno[];
  filtro: { nome: string; turma: string; status: string };
  novoAluno: Omit<Aluno, "id">;
  modoEdicao: number | null;
  turmas: { id: number; nome: string }[];
  onChangeFiltro: (f: { nome: string; turma: string; status: string }) => void;
  onChangeNovoAluno: (a: Omit<Aluno, "id">) => void;
  onAddAluno: (e: React.FormEvent) => void;
  onEditar: (aluno: Aluno) => void;
  onRemover: (id: number) => void;
};

export function AlunosView({
  alunos,
  filtro,
  novoAluno,
  modoEdicao,
  turmas,
  onChangeFiltro,
  onChangeNovoAluno,
  onAddAluno,
  onEditar,
  onRemover,
}: Props) {
  return (
    <div className="alunos-container">
      <h1>Gerenciar Alunos</h1>

      {/* 🔍 Filtros */}
      <div className="filtros">
        <input
          type="text"
          placeholder="Filtrar por nome"
          value={filtro.nome}
          onChange={(e) => onChangeFiltro({ ...filtro, nome: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filtrar por turma"
          value={filtro.turma}
          onChange={(e) => onChangeFiltro({ ...filtro, turma: e.target.value })}
        />
        <select
          value={filtro.status}
          onChange={(e) => onChangeFiltro({ ...filtro, status: e.target.value })}
        >
          <option value="">Todos</option>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>
      </div>

      {/* 📋 Tabela */}
      <div className="alunos-tabela-wrapper">
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
      {alunos.length === 0 ? (
        <tr>
          <td colSpan={5}>Nenhum aluno encontrado.</td>
        </tr>
      ) : (
        alunos.map((a) => (
          <tr key={a.id}>
            <td>{a.nome}</td>
            <td>{a.email}</td>
            <td>{a.turma}</td>
            <td>{a.status}</td>
            <td>
              <button onClick={() => onEditar(a)} className="btn-editar">
                Editar
              </button>
              <button onClick={() => onRemover(a.id)} className="btn-remover">
                Remover
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>


      {/* ➕ Formulário */}
      <form onSubmit={onAddAluno} className="form-novo-aluno">
        <h2>{modoEdicao ? "Editar Aluno" : "Adicionar Novo Aluno"}</h2>

        <input
          type="text"
          placeholder="Nome"
          value={novoAluno.nome}
          onChange={(e) =>
            onChangeNovoAluno({ ...novoAluno, nome: e.target.value })
          }
          required
        />

        <input
          type="email"
          placeholder="E-mail"
          value={novoAluno.email}
          onChange={(e) =>
            onChangeNovoAluno({ ...novoAluno, email: e.target.value })
          }
          required
        />

        {/* 🔽 Turmas disponíveis */}
        <select
          value={novoAluno.turma}
          onChange={(e) =>
            onChangeNovoAluno({ ...novoAluno, turma: e.target.value })
          }
          required
        >
          <option value="">Selecione uma turma</option>
          {turmas.map((t) => (
            <option key={t.id} value={t.nome}>
              {t.nome}
            </option>
          ))}
        </select>

        <select
          value={novoAluno.status}
          onChange={(e) =>
            onChangeNovoAluno({
              ...novoAluno,
              status: e.target.value as "Ativo" | "Inativo",
            })
          }
        >
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>

        <button type="submit">
          {modoEdicao ? "Salvar Alterações" : "Adicionar"}
        </button>
      </form>
    </div>
  );
}
