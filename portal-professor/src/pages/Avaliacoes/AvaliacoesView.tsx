type Criterio = {
  id: number;
  nome: string;
  peso: number;
};

type AvaliacoesViewProps = {
  turmas: string[];
  turmaSelecionada: string;
  criterios: Criterio[];
  alerta: string;
  mensagemSalvo: string;
  onSelectTurma: (turma: string) => void;
  onPesoChange: (id: number, valor: number) => void;
  onNomeChange: (id: number, valor: string) => void;
  onAddCriterio: () => void;
  onRemover: (id: number) => void;
  onSalvar: () => void;
};

export function AvaliacoesView({
  turmas,
  turmaSelecionada,
  criterios,
  alerta,
  mensagemSalvo,
  onSelectTurma,
  onPesoChange,
  onNomeChange,
  onAddCriterio,
  onRemover,
  onSalvar,
}: AvaliacoesViewProps) {
  return (
    <div className="avaliacoes-container">
      <h1>Gerenciar Avaliações</h1>

      <div className="turma-seletor">
        <label>Turma:</label>
        <select
          value={turmaSelecionada}
          onChange={(e) => onSelectTurma(e.target.value)}
        >
          {turmas.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <table className="avaliacoes-tabela">
        <thead>
          <tr>
            <th>Critério</th>
            <th>Peso (%)</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {criterios.map((c) => (
            <tr key={c.id}>
              <td>
                <input
                  type="text"
                  value={c.nome}
                  onChange={(e) => onNomeChange(c.id, e.target.value)}
                  className="input-nome"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={c.peso}
                  onChange={(e) => onPesoChange(c.id, Number(e.target.value))}
                  min={0}
                  max={100}
                />
              </td>
              <td>
                <button onClick={() => onRemover(c.id)} className="btn-remover">
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {alerta && <p className="alerta">{alerta}</p>}
      {mensagemSalvo && <p className="salvo">{mensagemSalvo}</p>}

      <div className="acoes">
        <button onClick={onAddCriterio} className="btn-adicionar">
          ➕ Adicionar Critério
        </button>
        
      </div>

      <div className="acoes">
      <button onClick={onSalvar} className="btn-salvar">
          Salvar
        </button>
      </div>

      <div className="total">
        Soma total:{" "}
        <strong>{criterios.reduce((acc, c) => acc + c.peso, 0)}%</strong>
      </div>
    </div>
  );
}
