import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Toast from "../components/Toast";
import { authService } from "../services/authService";


export default function Login() {
  const navigate = useNavigate();

  const [activeForm, setActiveForm] = useState("login");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));

    try {
      await authService.login(data);
      showToast("Login successful", "success");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      const message =
        typeof err === "string"
          ? err
          : err?.message || "Login failed";

      showToast(message, "error");
    }
  };




  // ---------------- REGISTER (FRONTEND ONLY) ----------------
  const handleRegister = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));

    if (data.password !== data.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    try {
      await authService.register(data);
      showToast("Registered successfully", "success");
      setActiveForm("login");
    } catch (err) {
      const message =
        typeof err === "string"
          ? err
          : err?.message || "Registration failed";

      showToast(message, "error");
    }
  };


  return (
    <div className="auth-page">
      {toast && (
        <Toast message={toast.message} type={toast.type} />
      )}

      <div className="auth-container">
        {/* LEFT SIDE */}
        <div className="auth-left">
          <div className="auth-hero">
            <h1 className="hero-title">Real Time Communication</h1>
            <p className="hero-subtitle">
              Secure video meetings, collaboration & messaging
            </p>

            <div className="hero-features">
              <div className="feature-item">🎥 HD Video Calls</div>
              <div className="feature-item">🖥 Screen Sharing</div>
              <div className="feature-item">🔐 End-to-End Security</div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">
          {/* LOGIN */}
          {activeForm === "login" && (
            <form className="auth-form" onSubmit={handleLogin}>
              <h2>Welcome Back</h2>
              <p className="text-muted">Login to your account</p>

              <input
                name="username"
                placeholder="Username"
                autoComplete="username"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                minLength={6}
                required
              />

              <button className="btn-primary" type="submit">
                Login
              </button>

              <p className="switch-text">
                New user?{" "}
                <span onClick={() => setActiveForm("register")}>
                  Create account
                </span>
              </p>
            </form>
          )}

          {/* REGISTER */}
          {activeForm === "register" && (
            <form className="auth-form" onSubmit={handleRegister}>
              <h2>Create Account</h2>
              <p className="text-muted">Join RTC Connect</p>

              <input
                name="username"
                placeholder="Username"
                autoComplete="username"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="email"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                minLength={6}
                required
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                required
              />

              <button className="btn-primary" type="submit">
                Register
              </button>

              <p className="switch-text">
                Already have an account?{" "}
                <span onClick={() => setActiveForm("login")}>
                  Login
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
