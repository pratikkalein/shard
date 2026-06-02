import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
            <polygon points="24,2 44,14 44,34 24,46 4,34 4,14" fill="none" stroke="#7c3aed" strokeWidth="1.5" />
            <polygon points="24,2 44,14 24,18" fill="#7c3aed" opacity="0.6" />
            <polygon points="24,2 4,14 24,18" fill="#a78bfa" opacity="0.4" />
            <polygon points="4,14 24,18 4,34" fill="#7c3aed" opacity="0.25" />
            <polygon points="44,14 24,18 44,34" fill="#a78bfa" opacity="0.2" />
            <polygon points="24,18 4,34 24,46 44,34" fill="#7c3aed" opacity="0.35" />
          </svg>
        </div>
        <h1 className="login-title">Sign in to Shard</h1>
        <p className="login-subtitle">Only the owner can access these canvases</p>
        <LoginForm />
      </div>
    </main>
  );
}
