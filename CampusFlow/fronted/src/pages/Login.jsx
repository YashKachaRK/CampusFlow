import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login"); // 'login' | 'signup' | 'forgot'
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // For success messages

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (tab === "forgot") {
      if (!form.email) return setError("Please enter your email.");
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setMessage("Password reset link sent to your email!");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      const url =
        tab === "login"
          ? "http://localhost:5000/api/auth/login"
          : "http://localhost:5000/api/auth/register";

      const payload =
        tab === "login"
          ? { email: form.email, password: form.password }
          : {
              name: form.name,
              email: form.email,
              password: form.password,
              role: form.role,
            };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      const userData = data.user || data;

      localStorage.setItem("campusflow_user", JSON.stringify(userData));

      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else if (userData.role === "faculty") {
        navigate("/faculty/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", position: "relative", overflow: "hidden" }}>
      {/* Background glow */}
      <div style={{ position: "absolute", top: "15%", left: "30%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "20%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, #7c3aed, #3b82f6)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "0.75rem", boxShadow: "0 0 30px rgba(124,58,237,0.4)" }}>🎓</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 900, background: "linear-gradient(90deg,#a78bfa,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.5px" }}>CampusFlow</div>
        </div>

        {/* Card */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 18, padding: "2rem", boxShadow: "0 24px 60px rgba(0,0,0,0.4)" }}>
          
          {/* Tabs */}
          {tab !== "forgot" && (
            <div style={{ display: "flex", background: "var(--bg-secondary)", borderRadius: 10, padding: 4, marginBottom: "1.5rem" }}>
              {["login", "signup"].map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(""); setMessage(""); }}
                  style={{ flex: 1, border: "none", cursor: "pointer", borderRadius: 8, padding: "0.5rem", fontSize: "0.85rem", fontWeight: 600, transition: "all 0.2s", background: tab === t ? "linear-gradient(135deg, #7c3aed, #3b82f6)" : "transparent", color: tab === t ? "white" : "var(--text-muted)", boxShadow: tab === t ? "0 4px 12px rgba(124,58,237,0.35)" : "none" }}
                >
                  {t === "login" ? "🔑 Log In" : "✨ Sign Up"}
                </button>
              ))}
            </div>
          )}

          {tab === "forgot" && (
            <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
              <h3 style={{ margin: 0, color: "var(--text-primary)" }}>Reset Password</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Enter your email to receive a reset link.</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {tab === "signup" && (
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="e.g. Yash Kacha" value={form.name} onChange={(e) => set("name", e.target.value)} style={{ width: "100%" }} />
              </div>
            )}

            <div className="form-group" style={{ marginBottom: "1rem" }}>
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" placeholder="you@college.edu" value={form.email} onChange={(e) => set("email", e.target.value)} style={{ width: "100%" }} />
            </div>

            {tab !== "forgot" && (
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label className="form-label">Password</label>
                  {tab === "login" && (
                    <span onClick={() => { setTab("forgot"); setError(""); setMessage(""); }} style={{ fontSize: "0.72rem", color: "#a78bfa", cursor: "pointer" }}>Forgot password?</span>
                  )}
                </div>
                <input type="password" className="form-input" placeholder="••••••••" value={form.password} onChange={(e) => set("password", e.target.value)} style={{ width: "100%" }} />
              </div>
            )}

            {tab === "signup" && (
              <>
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label className="form-label">Confirm Password</label>
                  <input type="password" className="form-input" placeholder="••••••••" value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} style={{ width: "100%" }} />
                </div>
                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label className="form-label">Log in as / I am a...</label>
                  <select className="form-select" value={form.role} onChange={(e) => set("role", e.target.value)} style={{ width: "100%" }}>
                    <option value="student">🎓 Student</option>
                    <option value="faculty">👨‍🏫 Faculty</option>
                  </select>
                </div>
              </>
            )}

            {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "0.6rem 0.85rem", fontSize: "0.8rem", color: "#ef4444", marginBottom: "1rem" }}>⚠ {error}</div>}
            {message && <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 8, padding: "0.6rem 0.85rem", fontSize: "0.8rem", color: "#22c55e", marginBottom: "1rem" }}>✓ {message}</div>}

            <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "0.7rem", opacity: loading ? 0.8 : 1 }} disabled={loading}>
              {loading ? "Processing..." : tab === "login" ? "🔑 Log In" : tab === "signup" ? "✨ Create Account" : "📩 Send Reset Link"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
            {tab === "login" ? (
              <>Don't have an account? <span onClick={() => setTab("signup")} style={{ color: "#a78bfa", cursor: "pointer", fontWeight: 600 }}>Sign up</span></>
            ) : (
              <>Back to <span onClick={() => setTab("login")} style={{ color: "#a78bfa", cursor: "pointer", fontWeight: 600 }}>Log in</span></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}