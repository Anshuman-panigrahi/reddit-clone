import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background blobs */}
      <div className="blob blob-1" aria-hidden="true"></div>
      <div className="blob blob-2" aria-hidden="true"></div>

      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <svg className="reddit-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="10" fill="#FF4500"/>
            <path d="M16.67 10a1.46 1.46 0 00-2.47-1 7.12 7.12 0 00-3.85-1.23l.65-3.07 2.13.45a1 1 0 101.07-1.04 1 1 0 00-.96.68l-2.38-.5a.27.27 0 00-.32.2l-.73 3.43a7.14 7.14 0 00-3.83 1.23 1.46 1.46 0 10-1.61 2.39 2.87 2.87 0 000 .44c0 2.24 2.61 4.06 5.83 4.06s5.83-1.82 5.83-4.06a2.87 2.87 0 000-.44 1.46 1.46 0 00.55-1.54zM7.27 11a1 1 0 111 1 1 1 0 01-1-1zm5.58 2.65a3.57 3.57 0 01-2.85.87 3.57 3.57 0 01-2.85-.87.2.2 0 01.28-.28 3.21 3.21 0 002.57.69 3.21 3.21 0 002.57-.69.2.2 0 01.28.28zm-.14-1.65a1 1 0 111-1 1 1 0 01-1 1z" fill="white"/>
          </svg>
          <span>reddit</span>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Log in to continue your Reddit journey</p>

        {error && (
          <div className="auth-error" role="alert" id="login-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin} id="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            id="login-submit"
            className={`btn-primary ${loading ? "btn-loading" : ""}`}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true"></span>
                Logging in…
              </>
            ) : "Log In"}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <p className="auth-footer">
          New to Reddit?{" "}
          <Link to="/register" className="auth-link" id="go-to-register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
