import { useState, useEffect } from "react";
import { AvaliacoesView } from "./AvaliacoesView";
import "./styles.css";

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

  // Carrega turmas
  useEffect(() => {
    const data = localStorage.getItem("turmas");
    if (data) {
      const lista = JSON.parse(data);
      setTurmas(lista.map((t: any) => t.nome));
      setTurmaSelecionada(lista[0]?.nome || "");
    }
  }, []);

  // Carrega critérios por turma
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

  // Atualiza soma dos pesos e salva
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

  // Funções
  const handlePesoChange = (id: number, valor: number) =>
    setCriterios((prev) => prev.map((c) => (c.id === id ? { ...c, peso: valor } : c)));

  const handleNomeChange = (id: number, valor: string) =>
    setCriterios((prev) => prev.map((c) => (c.id === id ? { ...c, nome: valor } : c)));

  const handleAddCriterio = () =>
    setCriterios((prev) => [
      ...prev,
      { id: Date.now(), nome: `Novo Critério ${prev.length + 1}`, peso: 0 },
    ]);

  const handleRemover = (id: number) =>
    setCriterios((prev) => prev.filter((c) => c.id !== id));

  const handleSalvar = () => {
    const data = localStorage.getItem("avaliacoesPorTurma");
    const avaliacoes = data ? JSON.parse(data) : {};
    avaliacoes[turmaSelecionada] = criterios;
    localStorage.setItem("avaliacoesPorTurma", JSON.stringify(avaliacoes));

    setMensagemSalvo("✅ Dados salvos com sucesso!");
    setTimeout(() => setMensagemSalvo(""), 2500);
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <AvaliacoesView
      turmas={turmas}
      turmaSelecionada={turmaSelecionada}
      criterios={criterios}
      alerta={alerta}
      mensagemSalvo={mensagemSalvo}
      onSelectTurma={setTurmaSelecionada}
      onPesoChange={handlePesoChange}
      onNomeChange={handleNomeChange}
      onAddCriterio={handleAddCriterio}
      onRemover={handleRemover}
      onSalvar={handleSalvar}
    />
  );
}
