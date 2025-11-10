import React from "react";

type Avaliacao = {
  id: number;
  nome: string;
  data: string;
  turma: string;
};

type Props = {
  avaliacoes: Avaliacao[];
  onAdicionar: () => void;
  onEditar: (id: number) => void;
  onExcluir: (id: number) => void;
};

export function TabelaAvaliacoes({ avaliacoes, onAdicionar, onEditar, onExcluir }: Props) {
    function formatarData(dataISO: string) {
        if (!dataISO) return "";
        const [ano, mes, dia] = dataISO.split("-");
        return `${dia}/${mes}/${ano}`;
    }

    return (
    <div>
      <h1>📘 Lista de Avaliações</h1>

      <button onClick={onAdicionar} className="btn-adicionar">
        ➕ Adicionar Avaliação
      </button>

      <table className="avaliacoes-tabela">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Data</th>
            <th>Turma</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {avaliacoes.length === 0 ? (
            <tr>
              <td colSpan={4}>Nenhuma avaliação cadastrada.</td>
            </tr>
          ) : (
            avaliacoes.map((a) => (
              <tr key={a.id}>
                <td>{a.nome}</td>
                <td>{formatarData(a.data)}</td>
                <td>{a.turma}</td>
                <td>
                  <button onClick={() => onEditar(a.id)} className="btn-editar">
                    Editar
                  </button>
                  <button onClick={() => onExcluir(a.id)} className="btn-remover">
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
