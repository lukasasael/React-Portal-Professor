import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { fakeLogin } from "../services/api"; // ✅ função que consulta o json-server

type User = {
  id: number;
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const navigate = useNavigate();

  // 🧠 Aqui está a sequência: chama API → guarda token → redireciona
  async function login(email: string, password: string) {
    try {
      const response = await fakeLogin(email, password); // 1️⃣ Chamada à API

      setUser(response.user);
      setToken(response.token);

      // 2️⃣ Guarda o token no localStorage
      localStorage.setItem("token", response.token);

      // 3️⃣ Redireciona pro dashboard
      navigate("/dashboard");
    } catch (err) {
      alert("E-mail ou senha incorretos ou problema de conexão.");
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
