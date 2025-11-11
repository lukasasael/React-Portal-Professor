export type Criterio = {
  id: number;
  nome: string;
  peso: number;
};

export type Avaliacao = {
  id: number;
  nome: string;
  data: string;
  turma: string;
  criterios: Criterio[];
};
