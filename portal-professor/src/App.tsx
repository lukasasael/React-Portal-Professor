import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Alunos from "./pages/Alunos";
import Turmas from "./pages/Turmas";
import Avaliacoes from "./pages/Avaliacoes";
import { PrivateRoute } from "./routes/PrivateRoute";
import { Navbar } from "./components/Navbar"; // 👈 import aqui

export default function App() {
  return (
    <>
      <Navbar /> {/* 👈 aparece em todas as páginas logadas */}

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/alunos"
          element={
            <PrivateRoute>
              <Alunos />
            </PrivateRoute>
          }
        />
        <Route
          path="/turmas"
          element={
            <PrivateRoute>
              <Turmas />
            </PrivateRoute>
          }
        />
        <Route
          path="/avaliacoes"
          element={
            <PrivateRoute>
              <Avaliacoes />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}
