import { useState, useEffect } from "react";
import "./index.css";

type Criterio = {
  id: number;
  nome: string;
  peso: number;
};

export default function Avaliacoes() {
  const [turmas, setTurmas] = useState<string[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>("");
  const [criterios, setCriterios] = useState<Criterio[]>([]);
  const [alerta, setAlerta] = useState("");
  const [mensagemSalvo, setMensagemSalvo] = useState("");

  // 🔹 Carrega turmas
  useEffect(() => {
    const data = localStorage.getItem("turmas");
    if (data) {
      const lista = JSON.parse(data);
      setTurmas(lista.map((t: any) => t.nome));
      setTurmaSelecionada(lista[0]?.nome || "");
    }
  }, []);

  // 🔹 Carrega critérios por turma
  useEffect(() => {
    if (!turmaSelecionada) return;

    const data = localStorage.getItem("avaliacoesPorTurma");
    const avaliacoes = data ? JSON.parse(data) : {};
    setCriterios(
      avaliacoes[turmaSelecionada] || [
        { id: 1, nome: "Prova 1", peso: 40 },
        { id: 2, nome: "Trabalho", peso: 30 },
        { id: 3, nome: "Participação", peso: 30 },
      ]
    );
  }, [turmaSelecionada]);

  // 🔹 Verifica soma dos pesos e salva
  useEffect(() => {
    if (!turmaSelecionada) return;

    const soma = criterios.reduce((acc, c) => acc + c.peso, 0);

    if (soma > 100) setAlerta(`⚠️ Soma dos pesos excede 100% (${soma}%)`);
    else if (soma < 100) setAlerta(`ℹ️ Soma dos pesos é menor que 100% (${soma}%)`);
    else setAlerta("");

    const data = localStorage.getItem("avaliacoesPorTurma");
    const avaliacoes = data ? JSON.parse(data) : {};
    avaliacoes[turmaSelecionada] = criterios;
    localStorage.setItem("avaliacoesPorTurma", JSON.stringify(avaliacoes));
  }, [criterios, turmaSelecionada]);

  // ✏️ Atualiza peso
  function handlePesoChange(id: number, valor: number) {
    setCriterios((prev) =>
      prev.map((c) => (c.id === id ? { ...c, peso: valor } : c))
    );
  }

  // ✏️ Atualiza nome
  function handleNomeChange(id: number, valor: string) {
    setCriterios((prev) =>
      prev.map((c) => (c.id === id ? { ...c, nome: valor } : c))
    );
  }

  // ➕ Novo critério
  function handleAddCriterio() {
    setCriterios((prev) => [
      ...prev,
      { id: Date.now(), nome: `Novo Critério ${prev.length + 1}`, peso: 0 },
    ]);
  }

  // 🗑️ Remover
  function handleRemover(id: number) {
    setCriterios((prev) => prev.filter((c) => c.id !== id));
  }

  // 💾 Salvar manualmente e atualizar
  function handleSalvar() {
    const data = localStorage.getItem("avaliacoesPorTurma");
    const avaliacoes = data ? JSON.parse(data) : {};
    avaliacoes[turmaSelecionada] = criterios;
    localStorage.setItem("avaliacoesPorTurma", JSON.stringify(avaliacoes));

    setMensagemSalvo("✅ Dados salvos com sucesso!");
    setTimeout(() => setMensagemSalvo(""), 2500);

    // Recarrega a página
    setTimeout(() => {
      window.location.reload();
    }, 800);
  }

  return (
    <div className="avaliacoes-container">
      <h1>Gerenciar Avaliações</h1>

      {/* 🔽 Seleção de turma */}
      <div className="turma-seletor">
        <label>Turma:</label>
        <select
          value={turmaSelecionada}
          onChange={(e) => setTurmaSelecionada(e.target.value)}
        >
          {turmas.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* 📋 Tabela */}
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
                  onChange={(e) => handleNomeChange(c.id, e.target.value)}
                  className="input-nome"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={c.peso}
                  onChange={(e) => handlePesoChange(c.id, Number(e.target.value))}
                  min={0}
                  max={100}
                />
              </td>
              <td>
                <button onClick={() => handleRemover(c.id)} className="btn-remover">
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
        <button onClick={handleAddCriterio} className="btn-adicionar">
          ➕ Adicionar Critério
        </button>
      </div>

      <div className="acoes">
      <button onClick={handleSalvar} className="btn-salvar">
          Salvar
        </button>
      </div>

      <div className="total">
        Soma total: <strong>{criterios.reduce((acc, c) => acc + c.peso, 0)}%</strong>
      </div>
    </div>
  );
}
