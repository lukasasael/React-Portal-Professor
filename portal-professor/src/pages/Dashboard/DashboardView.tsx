type Props = {
  user: { name: string; email: string } | null;
  dados: {
    totalAlunos: number;
    totalTurmas: number;
    proximasAvaliacoes: { nome: string; data: string }[];
  } | null;
  onLogout: () => void;
};

export function DashboardView({ user, dados, onLogout }: Props) {
  if (!dados) {
    return (
      <div className="dashboard-loading">
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Bem-vindo, {user?.name || "Professor"} 👋</h1>
        <button onClick={onLogout} className="logout-button">
          Sair
        </button>
      </header>

      <main className="dashboard-content">
        <div className="card destaque">
          <h2>Total de Alunos</h2>
          <p>{dados.totalAlunos}</p>
        </div>

        <div className="card destaque">
          <h2>Total de Turmas</h2>
          <p>{dados.totalTurmas}</p>
        </div>

        <div className="card avaliacoes">
          <h2>Próximas Avaliações</h2>
          <ul>
            {dados.proximasAvaliacoes.map((av, i) => (
              <li key={i}>
                <strong>{av.nome}</strong> –{" "}
                {new Date(av.data).toLocaleDateString("pt-BR")}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
