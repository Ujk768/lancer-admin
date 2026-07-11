import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setBusy(true);
    try {
      await login(email, password);
      navigate("/app");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Sign in failed. Try again.");
      } else {
        setError("Sign in failed. Try again.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-root">
      {!videoFailed ? (
        <video
          className="login-video"
          src={import.meta.env.VITE_LOGIN_VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoFailed(true)}
        />
      ) : (
        <div className="login-fallback" aria-hidden="true" />
      )}
      <div className="login-scrim" aria-hidden="true" />

      <header className="login-header">
        <Logo size={46} />
        <div className="wordmark">
          Lancer<b>Fit</b>
        </div>
      </header>

      <div className="login-body">
        <div className="login-copy">
          <h1>
            The whiteboard,
            <br />
            <em>rebuilt for campus.</em>
          </h1>
          <p>
            Administration console for the Toldo Lancer Centre fitness
            platform. Create challenges, validate results, and run the daily
            quest rotation for the Windsor campus community.
          </p>
          <div className="facility-line">
            <div>
              <strong>Toldo Lancer Centre</strong>
              University of Windsor
            </div>
            <div>
              <strong>Staff access only</strong>
              UWin credentials required
            </div>
          </div>
        </div>

        <div className="auth-card">
          <h2>Admin sign in</h2>
          <div className="sub">Restricted to Campus Recreation staff.</div>
          <form onSubmit={submit} noValidate>
            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@uwindsor.ca"
                autoComplete="username"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
              />
            </label>
            <button className="btn btn-gold" type="submit" disabled={busy}>
              {busy ? "Signing in" : "Sign in"}
            </button>
          </form>
        </div>
      </div>

      <footer className="login-footer">
        <span>UNIVERSITY OF WINDSOR</span>
        <span>CAMPUS RECREATION</span>
      </footer>
    </div>
  );
}