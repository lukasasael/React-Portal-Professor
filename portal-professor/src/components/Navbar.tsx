import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { NavbarView } from "./NavbarView";
import "./styles.css";

export function Navbar() {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();

  // 🔒 Oculta navbar se não estiver logado
  if (!token) return null;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <NavbarView
      userName={user?.name || "Professor"}
      onLogout={handleLogout}
    />
  );
}
