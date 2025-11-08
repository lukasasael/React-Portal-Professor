import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type User = {
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
      // Simulação de API — substitua por uma chamada real (ex: axios.post)
      if (email === "admin@teste.com" && password === "123456") {
        const fakeToken = "fake-jwt-token";
        const fakeUser = { email, name: "Administrador" };

        setUser(fakeUser);
        setToken(fakeToken);
        localStorage.setItem("token", fakeToken);
        navigate("/dashboard");
      } else {
        throw new Error("Credenciais inválidas");
      }
    } catch (err) {
      alert("Erro ao fazer login: " + (err as Error).message);
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

// Hook personalizado para usar o contexto com segurança
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
