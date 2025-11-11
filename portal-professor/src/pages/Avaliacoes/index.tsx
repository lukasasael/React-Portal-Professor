import { useState, useEffect } from "react";
import { AvaliacoesView } from "./AvaliacoesView";
import { TabelaAvaliacoes } from "./TabelaAvaliacoes";
import "./styles.css";
import type { Avaliacao } from "./types";

export default function Avaliacoes() {
  const [turmas, setTurmas] = useState<string[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [modoFormulario, setModoFormulario] = useState<"lista" | "form">("lista");
  const [avaliacaoAtual, setAvaliacaoAtual] = useState<Avaliacao | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("turmas");
    if (data) {
      try {
        const lista = JSON.parse(data);
        setTurmas(lista.map((t: any) => t.nome));
      } catch (err) {
        console.error("Erro ao parsear turmas", err);
      }
    }
  }, []);

  // 🧩 Corrige carregamento de IDs (garante que sejam números)
  useEffect(() => {
    const data = localStorage.getItem("avaliacoes");
    if (data) {
      try {
        const lista = JSON.parse(data).map((a: any) => ({
          ...a,
          id: Number(a.id),
        }));
        setAvaliacoes(lista);
      } catch (err) {
        console.error("Erro ao parsear avaliacoes", err);
        setAvaliacoes([]);
      }
    }
  }, []);

  const salvarAvaliacoes = (lista: Avaliacao[]) => {
    try {
      localStorage.setItem("avaliacoes", JSON.stringify(lista));
      setAvaliacoes(lista);
      window.dispatchEvent(new CustomEvent("avaliacoes:updated"));
    } catch (err) {
      console.error("Erro ao salvar avaliacoes", err);
    }
  };

  const handleAdicionar = () => {
    const nova: Avaliacao = {
      id: Date.now(),
      nome: `Avaliação ${avaliacoes.length + 1}`,
      data: new Date().toISOString().substring(0, 10),
      turma: turmas[0] || "",
      criterios: [
        { id: 1, nome: "Prova 1", peso: 40 },
        { id: 2, nome: "Trabalho", peso: 30 },
        { id: 3, nome: "Participação", peso: 30 },
      ],
    };
    setAvaliacaoAtual(nova);
    setModoFormulario("form");
  };

  const handleEditar = (id: number) => {
    console.log("[Avaliacoes] editar recebido:", id);
    const avaliacao = avaliacoes.find((a) => a.id === id);
    if (avaliacao) {
      if (!avaliacao.criterios) {
        avaliacao.criterios = [
          { id: 1, nome: "Prova 1", peso: 40 },
          { id: 2, nome: "Trabalho", peso: 30 },
          { id: 3, nome: "Participação", peso: 30 },
        ];
      }
      setAvaliacaoAtual({ ...avaliacao });
      setModoFormulario("form");
    }
  }

  const handleExcluir = (id: number) => {
  console.log("[Avaliacoes] excluir recebido:", id);

  const atual = JSON.parse(localStorage.getItem("avaliacoes") || "[]");
  const filtradas = atual.filter((a: any) => Number(a.id) !== Number(id));

  if (filtradas.length === atual.length) {
    return;
  } 
  localStorage.setItem("avaliacoes", JSON.stringify(filtradas));
  setAvaliacoes(filtradas);
  window.dispatchEvent(new Event("avaliacoes:updated"));
  };


  const handleSalvarFormulario = (avaliacaoAtualizada: Avaliacao) => {
    const novas = [
      ...avaliacoes.filter((a) => Number(a.id) !== Number(avaliacaoAtualizada.id)),
      avaliacaoAtualizada,
    ];
    salvarAvaliacoes(novas);
    setModoFormulario("lista");
  };

  const handleCancelar = () => setModoFormulario("lista");

  useEffect(() => {
    function atualizar() {
      const d = localStorage.getItem("avaliacoes");
      if (d) {
        setAvaliacoes(JSON.parse(d));
      }
    }
    window.addEventListener("avaliacoes:updated", atualizar);
    window.addEventListener("storage", atualizar);
    return () => {
      window.removeEventListener("avaliacoes:updated", atualizar);
      window.removeEventListener("storage", atualizar);
    };
  }, []);

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
