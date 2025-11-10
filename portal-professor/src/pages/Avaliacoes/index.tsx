import { useState, useEffect } from "react";
import { AvaliacoesView } from "./AvaliacoesView";
import { TabelaAvaliacoes } from "./TabelaAvaliacoes";
import "./styles.css";

type Criterio = {
  id: number;
  nome: string;
  peso: number;
};

type Avaliacao = {
  id: number;
  nome: string;
  data: string;
  turma: string;
  criterios: Criterio[];
};

export default function Avaliacoes() {
  const [turmas, setTurmas] = useState<string[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [modoFormulario, setModoFormulario] = useState<"lista" | "form">("lista");
  const [avaliacaoAtual, setAvaliacaoAtual] = useState<Avaliacao | null>(null);

  // Carrega turmas
  useEffect(() => {
    const data = localStorage.getItem("turmas");
    if (data) {
      const lista = JSON.parse(data);
      setTurmas(lista.map((t: any) => t.nome));
    }
  }, []);

  // Carrega avaliações
  useEffect(() => {
    const data = localStorage.getItem("avaliacoes");
    if (data) {
      setAvaliacoes(JSON.parse(data));
    }
  }, []);

  // Salva avaliações
  const salvarAvaliacoes = (lista: Avaliacao[]) => {
    localStorage.setItem("avaliacoes", JSON.stringify(lista));
    setAvaliacoes(lista);
  };

  // Adicionar nova avaliação
  const handleAdicionar = () => {
    setAvaliacaoAtual({
      id: Date.now(),
      nome: `Avaliação ${avaliacoes.length + 1}`,
      data: new Date().toISOString().substring(0, 10),
      turma: turmas[0] || "",
      criterios: [
        { id: 1, nome: "Prova 1", peso: 40 },
        { id: 2, nome: "Trabalho", peso: 30 },
        { id: 3, nome: "Participação", peso: 30 },
      ],
    });
    setModoFormulario("form");
  };

  // Editar avaliação existente
  // Editar avaliação existente
const handleEditar = (id: number) => {
  const avaliacao = avaliacoes.find((a) => a.id === id);
  if (avaliacao) {
    // 🩹 Garante que sempre exista um array de critérios
    if (!avaliacao.criterios) {
      avaliacao.criterios = [
        { id: 1, nome: "Prova 1", peso: 40 },
        { id: 2, nome: "Trabalho", peso: 30 },
        { id: 3, nome: "Participação", peso: 30 },
      ];
    }

    setAvaliacaoAtual(avaliacao);
    setModoFormulario("form");
  }
};


  // Excluir avaliação
  const handleExcluir = (id: number) => {
    if (window.confirm("Deseja realmente excluir esta avaliação?")) {
      const novas = avaliacoes.filter((a) => a.id !== id);
      salvarAvaliacoes(novas);
    }
  };

  // Salvar dados do formulário
  const handleSalvarFormulario = (avaliacaoAtualizada: Avaliacao) => {
    const existentes = avaliacoes.filter((a) => a.id !== avaliacaoAtualizada.id);
    const novas = [...existentes, avaliacaoAtualizada];
    salvarAvaliacoes(novas);
    setModoFormulario("lista");
  };

  // Cancelar e voltar
  const handleCancelar = () => setModoFormulario("lista");

  return (
    <div className="avaliacoes-container">
      {modoFormulario === "lista" ? (
        <TabelaAvaliacoes
          avaliacoes={avaliacoes}
          onAdicionar={handleAdicionar}
          onEditar={handleEditar}
          onExcluir={handleExcluir}
        />
      ) : avaliacaoAtual ? (
        <AvaliacoesView
          turmas={turmas}
          avaliacao={avaliacaoAtual}
          onSalvar={handleSalvarFormulario}
          onCancelar={handleCancelar}
        />
      ) : null}
    </div>
  );
}
