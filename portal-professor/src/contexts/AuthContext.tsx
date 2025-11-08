import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { fakeLogin } from "../services/api";

type User = {
  id: number;
  email: string;
  name?: string;
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

  async function login(email: string, password: string) {
    try {      
      const response = await fakeLogin(email, password);

      setUser(response.user);
      setToken(response.token);

      localStorage.setItem("token", response.token);

      navigate("/dashboard");
    } catch (err) {
      alert("Credenciais inválidas ou erro de conexão com a API.");
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
