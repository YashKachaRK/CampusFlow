import { useState, useEffect } from "react";

export default function Profile() {
  const [user, setUser] = useState({ name: "", email: "", role: "" });
  
  // States for basic info editing
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "" });

  // States for password changing
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("campusflow_user"));
    if (data) {
      setUser(data);
      setForm(data);
    }
  }, []);

  // Handle updating Name & Email
  const handleSave = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("campusflow_user"));

      const res = await fetch(
        `http://localhost:5000/api/auth/update/${currentUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Update failed");
      }

      // Update state + localStorage
      setUser(data.user);
      setForm(data.user);
      localStorage.setItem("campusflow_user", JSON.stringify(data.user));

      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Handle updating Password
  const handlePasswordSave = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      alert("Please fill in all password fields.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      const currentUser = JSON.parse(localStorage.getItem("campusflow_user"));

      const res = await fetch(
        `http://localhost:5000/api/auth/change-password/${currentUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      alert("Password changed successfully!");
      setIsChangingPassword(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 800 }}>
      
      {/* Profile Header */}
      <div
        style={{
          background: "var(--bg-card)",
          padding: "2rem",
          borderRadius: 16,
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "3rem",
            color: "white",
            fontWeight: "bold",
            boxShadow: "0 0 30px rgba(124,58,237,0.3)",
          }}
        >
          {user.name ? user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() : "U"}
        </div>
        <div>
          <h2 style={{ fontSize: "1.8rem", margin: "0 0 0.5rem 0", fontWeight: 800, color: "var(--text-primary)" }}>
            {user.name || "User"}
          </h2>
          <span style={{ display: "inline-block", padding: "0.3rem 0.8rem", background: "rgba(124,58,237,0.1)", color: "#a78bfa", borderRadius: 20, fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {user.role || "Student"}
          </span>
        </div>
      </div>

      {/* Basic Account Details Form */}
      {!isChangingPassword && (
        <div style={{ marginTop: "2rem", background: "var(--bg-card)", padding: "2rem", borderRadius: 16, border: "1px solid var(--border)" }}>
          <h3 style={{ marginTop: 0, marginBottom: "1.5rem", fontWeight: 600, color: "var(--text-primary)" }}>
            Account Details
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                value={isEditing ? form.name : user.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                readOnly={!isEditing}
                style={{ opacity: isEditing ? 1 : 0.8, cursor: isEditing ? "text" : "not-allowed" }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                value={isEditing ? form.email : user.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                readOnly={!isEditing}
                style={{ opacity: isEditing ? 1 : 0.8, cursor: isEditing ? "text" : "not-allowed" }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <input
                className="form-input"
                value={user.role || ""}
                readOnly
                style={{ opacity: 0.8, cursor: "not-allowed", textTransform: "capitalize" }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Account Status</label>
              <input
                className="form-input"
                value="Active"
                readOnly
                style={{ opacity: 0.8, color: "#22c55e", cursor: "not-allowed", fontWeight: 600 }}
              />
            </div>
          </div>

          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
            {isEditing ? (
              <>
                <button className="btn btn-primary" style={{ padding: "0.6rem 1.2rem" }} onClick={handleSave}>
                  Save Changes
                </button>
                <button className="btn" style={{ padding: "0.6rem 1.2rem", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "none" }} onClick={() => { setIsEditing(false); setForm(user); }}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-primary" style={{ padding: "0.6rem 1.2rem" }} onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
                <button className="btn" style={{ padding: "0.6rem 1.2rem", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "none", cursor: "pointer" }} onClick={() => setIsChangingPassword(true)}>
                  Change Password
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Change Password Form */}
      {isChangingPassword && (
        <div className="animate-fade-in" style={{ marginTop: "2rem", background: "var(--bg-card)", padding: "2rem", borderRadius: 16, border: "1px solid #ef4444" }}>
          <h3 style={{ marginTop: 0, marginBottom: "1.5rem", fontWeight: 600, color: "#ef4444" }}>
            Change Security Credentials
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem", maxWidth: 400 }}>
            <div className="form-group">
              <label className="form-label">Current Password *</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter current password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password *</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter new password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password *</label>
              <input
                type="password"
                className="form-input"
                placeholder="Confirm new password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
            <button className="btn" style={{ padding: "0.6rem 1.2rem", background: "#ef4444", color: "white", border: "none", cursor: "pointer" }} onClick={handlePasswordSave}>
              Update Password
            </button>
            <button className="btn btn-secondary" style={{ padding: "0.6rem 1.2rem" }} onClick={() => { setIsChangingPassword(false); setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}