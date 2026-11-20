import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Input, GradientOrb } from "../ui";
import { useAuth } from "../auth";
import { api } from "../api";

const DEMO = [
  ["Admin", "admin@flowedu.local", "admin123"],
  ["Teacher", "teacher@flowedu.local", "teacher123"],
  ["Student", "student@flowedu.local", "student123"],
];

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@flowedu.local");
  const [password, setPassword] = useState("admin123");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await login(email, password);
      nav("/dashboard", { replace: true });
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-wrap orb-host">
      <GradientOrb color="mint" size={460} top={-140} left={-120} />
      <GradientOrb color="lavender" size={460} bottom={-160} right={-120} />
      <GradientOrb color="peach" size={300} top={120} right={180} />
      <div className="orb-content" style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 className="display-xl">FlowEdu</h1>
          <p>Automate campus communication</p>
        </div>
        <Card className="login-card" style={{ maxWidth: "none" }}>
          <form className="stack" onSubmit={submit}>
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {err && <span className="msg-err">{err}</span>}
            <Button type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
          </form>
          <div className="pills" style={{ marginTop: 20 }}>
            {DEMO.map(([label, e, p]) => (
              <button key={label} type="button" className="pill" onClick={() => { setEmail(e); setPassword(p); }}>
                {label}
              </button>
            ))}
          </div>
          {!forgotMode ? (
            <button type="button" className="caption muted" style={{ marginTop: 12, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
              onClick={() => setForgotMode(true)}>Forgot password?</button>
          ) : (
            <div className="stack" style={{ marginTop: 16 }}>
              <Input label="Email" type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
              {resetMsg && <p className={resetMsg.startsWith("Error") ? "msg-err" : "msg-ok"}>{resetMsg}</p>}
              <div className="row">
                <Button variant="outline" onClick={async () => {
                  try {
                    const r = await api("/auth/forgot-password", { method: "POST", body: { email: resetEmail } });
                    setResetMsg(r.message || "Password has been reset. Check the new temporary password.");
                  } catch (ex) { setResetMsg("Error: " + ex.message); }
                }}>Reset password</Button>
                <Button variant="text" onClick={() => { setForgotMode(false); setResetMsg(""); }}>Cancel</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
