import { Turma } from "./index";

type Props = {
  turmas: Turma[];
  filtro: string;
  novaTurma: Omit<Turma, "id">;
  modoEdicao: number | null;
  onChangeFiltro: (valor: string) => void;
  onChangeNovaTurma: (t: Omit<Turma, "id">) => void;
  onAddTurma: (e: React.FormEvent) => void;
  onEditar: (t: Turma) => void;
  onRemover: (id: number) => void;
};

export function TurmasView({
  turmas,
  filtro,
  novaTurma,
  modoEdicao,
  onChangeFiltro,
  onChangeNovaTurma,
  onAddTurma,
  onEditar,
  onRemover,
}: Props) {
  return (
    <div className="turmas-container">
      <h1>Gerenciar Turmas</h1>

      {/* 🔍 Filtro */}
      <input
        type="text"
        placeholder="Filtrar por nome da turma"
        value={filtro}
        onChange={(e) => onChangeFiltro(e.target.value)}
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
          {turmas.length === 0 ? (
            <tr>
              <td colSpan={4}>Nenhuma turma encontrada.</td>
            </tr>
          ) : (
            turmas.map((t) => (
              <tr key={t.id}>
                <td>{t.nome}</td>
                <td>{t.capacidade}</td>
                <td>{t.qtdAlunos}</td>
                <td>
                  <button onClick={() => onEditar(t)} className="btn-editar">
                    Editar
                  </button>
                  <button
                    onClick={() => onRemover(t.id)}
                    className="btn-remover"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 🧾 Formulário */}
      <form onSubmit={onAddTurma} className="form-turma">
        <h2>{modoEdicao ? "Editar Turma" : "Adicionar Nova Turma"}</h2>

        <input
          type="text"
          placeholder="Nome"
          value={novaTurma.nome}
          onChange={(e) =>
            onChangeNovaTurma({ ...novaTurma, nome: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Capacidade"
          value={novaTurma.capacidade}
          onChange={(e) =>
            onChangeNovaTurma({
              ...novaTurma,
              capacidade: Number(e.target.value),
            })
          }
          required
        />
        <input
          type="number"
          placeholder="Qtd. de Alunos"
          value={novaTurma.qtdAlunos}
          onChange={(e) =>
            onChangeNovaTurma({
              ...novaTurma,
              qtdAlunos: Number(e.target.value),
            })
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
