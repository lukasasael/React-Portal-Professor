import { useEffect, useState } from "react";

type Criterio = { id: number; nome: string; peso: number };
type Avaliacao = {
  id: number;
  nome: string;
  data: string;
  turma: string;
  criterios: Criterio[];
};

type Props = {
  turmas: string[];
  avaliacao: Avaliacao;
  onSalvar: (avaliacao: Avaliacao) => void;
  onCancelar: () => void;
};

export function AvaliacoesView({ turmas, avaliacao, onSalvar, onCancelar }: Props) {
  const [nome, setNome] = useState(avaliacao.nome);
  const [data, setData] = useState(avaliacao.data);
  const [turma, setTurma] = useState(avaliacao.turma);
  const [alerta, setAlerta] = useState("");
  const [criterios, setCriterios] = useState(avaliacao.criterios || []);


  useEffect(() => {
    const soma = criterios.reduce((acc, c) => acc + c.peso, 0);
    if (soma > 100) setAlerta(`⚠️ Soma dos pesos excede 100% (${soma}%)`);
    else if (soma < 100) setAlerta(`ℹ️ Soma dos pesos é menor que 100% (${soma}%)`);
    else setAlerta("");
  }, [criterios]);

  const handleSalvar = () => {
    onSalvar({ ...avaliacao, nome, data, turma, criterios });
  };

  return (
    <div>
      <h2>✏️ Editar Avaliação</h2>

      <div className="turma-seletor">
        <label>Nome:</label>
        <input value={nome} onChange={(e) => setNome(e.target.value)} />

        <label>Data:</label>
        <input type="date" value={data} onChange={(e) => setData(e.target.value)} />

        <label>Turma:</label>
        <select value={turma} onChange={(e) => setTurma(e.target.value)}>
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
                  value={c.nome}
                  onChange={(e) =>
                    setCriterios((prev) =>
                      prev.map((x) => (x.id === c.id ? { ...x, nome: e.target.value } : x))
                    )
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={c.peso}
                  onChange={(e) =>
                    setCriterios((prev) =>
                      prev.map((x) =>
                        x.id === c.id ? { ...x, peso: Number(e.target.value) } : x
                      )
                    )
                  }
                />
              </td>
              <td>
                <button
                  className="btn-remover"
                  onClick={() => setCriterios((prev) => prev.filter((x) => x.id !== c.id))}
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {alerta && <p className="alerta">{alerta}</p>}

      <div className="acoes">
        <button onClick={() => setCriterios([...criterios, { id: Date.now(), nome: "Novo", peso: 0 }])}>
          ➕ Adicionar Critério
        </button>
      </div>

      <div className="acoes">
        <button onClick={handleSalvar} className="btn-salvar">
          Salvar Avaliação
        </button>
        <button onClick={onCancelar} className="btn-cancelar">
          Cancelar
        </button>
      </div>
    </div>
  );
}
