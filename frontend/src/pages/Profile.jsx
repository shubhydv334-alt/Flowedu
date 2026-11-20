import React, { useState } from "react";
import { Button, Card, Input } from "../ui";
import { api, useApi } from "../api";
import { useAuth } from "../auth";

export default function Profile() {
  const { user } = useAuth();
  const { data, reload } = useApi("/auth/me");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");

  React.useEffect(() => {
    if (data && !loaded) { setName(data.name); setEmail(data.email); setLoaded(true); }
  }, [data, loaded]);

  async function saveProfile(e) {
    e.preventDefault(); setMsg(""); setErr("");
    try {
      await api("/auth/profile", { method: "PUT", body: { name, email } });
      setMsg("Profile updated");
      reload();
    } catch (ex) { setErr(ex.message); }
  }

  async function changePassword(e) {
    e.preventDefault(); setPwMsg(""); setPwErr("");
    if (!oldPw || !newPw) { setPwErr("Both fields are required"); return; }
    try {
      await api("/auth/change-password", { method: "POST", body: { oldPassword: oldPw, newPassword: newPw } });
      setPwMsg("Password changed");
      setOldPw(""); setNewPw("");
    } catch (ex) { setPwErr(ex.message); }
  }

  return (
    <>
      <div className="page-head">
        <h1 className="display-lg">Profile</h1>
      </div>
      <div className="grid grid-2">
        <Card>
          <h3 style={{ marginBottom: 16 }}>Personal details</h3>
          <form onSubmit={saveProfile} className="stack">
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Role" value={data?.role || user?.role || ""} disabled />
            {msg && <p className="msg-ok">{msg}</p>}
            {err && <p className="msg-err">{err}</p>}
            <div className="row"><Button type="submit">Save changes</Button></div>
          </form>
        </Card>
        <Card>
          <h3 style={{ marginBottom: 16 }}>Change password</h3>
          <form onSubmit={changePassword} className="stack">
            <Input label="Current password" type="password" value={oldPw} onChange={(e) => setOldPw(e.target.value)} />
            <Input label="New password" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
            {pwMsg && <p className="msg-ok">{pwMsg}</p>}
            {pwErr && <p className="msg-err">{pwErr}</p>}
            <div className="row"><Button type="submit">Change password</Button></div>
          </form>
        </Card>
      </div>
    </>
  );
}
