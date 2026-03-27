import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("Passwords do not match.");

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      alert("Password reset successfully! You can now log in.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <div style={{ width: "100%", maxWidth: 400, background: "var(--bg-card)", padding: "2rem", borderRadius: 16, border: "1px solid var(--border)" }}>
        <h2 style={{ color: "var(--text-primary)", marginTop: 0 }}>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">New Password</label>
            <input type="password" required className="form-input" value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%" }}/>
          </div>
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">Confirm Password</label>
            <input type="password" required className="form-input" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={{ width: "100%" }}/>
          </div>
          {error && <div style={{ color: "#ef4444", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</div>}
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Resetting..." : "Save New Password"}
          </button>
        </form>
      </div>
    </div>
  );
}