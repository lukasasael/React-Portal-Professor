import axios from "axios";

export async function fakeLogin(email: string, password: string) {
  try {
    // Faz requisição GET simulando autenticação
    const response = await axios.get("http://localhost:5500/users", {
      params: { email, password },
    });

    // Se encontrar o usuário, retorna o token fake e os dados
    if (response.data.length > 0) {
      const user = response.data[0];
      return {
        token: "fake-jwt-token-123",
        user,
      };
    } else {
      throw new Error("Credenciais inválidas");
    }
  } catch (err) {
    throw new Error("Erro de conexão com a API");
  }
}
