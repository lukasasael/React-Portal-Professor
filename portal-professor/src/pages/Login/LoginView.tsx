type Props = {
    email: string;
    password: string;
    loading: boolean;
    error: string;
    onChangeEmail: (v: string) => void;
    onChangePassword: (v: string) => void;
    onSubmit: (e: React.FormEvent) => void;
  };
  
  export function LoginView({
    email,
    password,
    loading,
    error,
    onChangeEmail,
    onChangePassword,
    onSubmit,
  }: Props) {
    return (
      <div className="login-container">
        <h2>Portal do Professor</h2>
        <form onSubmit={onSubmit} className="login-form">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => onChangeEmail(e.target.value)}
            className="login-input"
            required
          />
  
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => onChangePassword(e.target.value)}
            className="login-input"
            required
          />
  
          {error && <p className="login-error">{error}</p>}
  
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    );
  }
  