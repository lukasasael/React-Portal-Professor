import { NavLink } from "react-router-dom";

type Props = {
  userName: string;
  onLogout: () => void;
};

export function NavbarView({ userName, onLogout }: Props) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-logo">📘 Portal do Professor</span>
      </div>

      <div className="navbar-links">
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
          Dashboard
        </NavLink>
        <NavLink to="/alunos" className={({ isActive }) => (isActive ? "active" : "")}>
          Alunos
        </NavLink>
        <NavLink to="/turmas" className={({ isActive }) => (isActive ? "active" : "")}>
          Turmas
        </NavLink>
        <NavLink to="/avaliacoes" className={({ isActive }) => (isActive ? "active" : "")}>
          Avaliações
        </NavLink>
      </div>

      <div className="navbar-right">
        <span className="navbar-user">{userName}</span>
        <button onClick={onLogout} className="logout-btn">
          Sair
        </button>
      </div>
    </nav>
  );
}
