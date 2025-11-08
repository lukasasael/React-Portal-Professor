import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Alunos from "./pages/Alunos";
import Turmas from "./pages/Turmas";
import Avaliacoes from "./pages/Avaliacoes";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alunos" element={<Alunos />} />
        <Route path="/turmas" element={<Turmas />} />
        <Route path="/avaliacoes" element={<Avaliacoes />} />
        <Route path="*" element={<h2>Página não encontrada</h2>} />
      </Routes>
    </div>
  );
}

export default App;