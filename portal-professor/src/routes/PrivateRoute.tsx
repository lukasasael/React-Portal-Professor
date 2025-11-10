import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { JSX } from "react/jsx-runtime";

type Props = {
  children: JSX.Element;
};

export function PrivateRoute({ children }: Props) {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p style={{ textAlign: "center" }}>Carregando...</p>;

  if (!token && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
