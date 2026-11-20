import React, { useState } from "react";
import { Badge, Button, Card, Input, Table } from "../ui";
import { api, useApi } from "../api";

function Select({ label, value, onChange, options }) {
  return (
    <div className="field">
      <label>{label}</label>
      <select className="input" value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export default function UserManagement() {
  const { data, error, reload } = useApi("/auth/users");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "STUDENT" });
  const [msg, setMsg] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  async function create(e) {
    e.preventDefault(); setMsg("");
    try {
      await api("/auth/users", { method: "POST", body: form });
      setForm({ name: "", email: "", password: "", role: "STUDENT" });
      setOpen(false); reload();
    } catch (err) { setMsg(err.message); }
  }

  async function update(id) {
    setMsg("");
    try {
      await api(`/auth/users/${id}`, { method: "PUT", body: editForm });
      setEditId(null); reload();
    } catch (err) { setMsg(err.message); }
  }

  async function remove(id) {
    if (!window.confirm("Delete this user?")) return;
    try { await api(`/auth/users/${id}`, { method: "DELETE" }); reload(); }
    catch (err) { setMsg(err.message); }
  }

  const columns = [
    { key: "name", header: "Name", strong: true },
    { key: "email", header: "Email" },
    { key: "role", header: "Role", render: (u) => <Badge>{u.role}</Badge> },
    {
      key: "_a", header: "",
      render: (u) => (
        <div className="row" style={{ gap: 6, justifyContent: "flex-end" }}>
          <Button variant="outline" className="btn-sm" onClick={() => { setEditId(u.id); setEditForm({ name: u.name, email: u.email, role: u.role }); }}>Edit</Button>
          <Button variant="text" onClick={() => remove(u.id)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="display-lg">User Management</h1>
          <p className="muted">Create, edit and remove user accounts.</p>
        </div>
        <Button onClick={() => setOpen(!open)}>{open ? "Close" : "Add user"}</Button>
      </div>
      {(msg || error) && <p className="msg-err">{msg || error}</p>}

      {open && (
        <Card style={{ marginBottom: 24 }}>
          <form onSubmit={create} className="stack">
            <div className="grid grid-4">
              <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <Select label="Role" value={form.role} onChange={(v) => setForm({ ...form, role: v })}
                options={[{ value: "ADMIN", label: "Admin" }, { value: "TEACHER", label: "Teacher" }, { value: "STUDENT", label: "Student" }]} />
            </div>
            <div className="row"><Button type="submit">Create user</Button></div>
          </form>
        </Card>
      )}

      {editId && (
        <Card style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 12 }}>Edit user</h3>
          <div className="grid grid-3">
            <Input label="Name" value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            <Input label="Email" type="email" value={editForm.email || ""} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
            <Select label="Role" value={editForm.role} onChange={(v) => setEditForm({ ...editForm, role: v })}
              options={[{ value: "ADMIN", label: "Admin" }, { value: "TEACHER", label: "Teacher" }, { value: "STUDENT", label: "Student" }]} />
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            <Button onClick={() => update(editId)}>Save</Button>
            <Button variant="outline" onClick={() => setEditId(null)}>Cancel</Button>
          </div>
        </Card>
      )}

      <Card style={{ padding: 0 }}>
        {!data || data.length === 0 ? <div className="empty muted">No users.</div> : <Table columns={columns} rows={data} />}
      </Card>
    </>
  );
}
