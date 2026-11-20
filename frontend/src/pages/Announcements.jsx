import React, { useState } from "react";
import { Button, Card, Input } from "../ui";
import { api, useApi } from "../api";

function Select({ label, value, onChange, options }) {
  return (
    <div className="field">
      <label>{label}</label>
      <select className="input" value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
    </div>
  );
}

export default function Announcements() {
  const depts = useApi("/departments");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [channels, setChannels] = useState(["EMAIL"]);
  const [deptId, setDeptId] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [batch, setBatch] = useState("");
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  function toggleChannel(ch) {
    setChannels((prev) => prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]);
  }

  async function send(e) {
    e.preventDefault(); setErr(""); setResult(null); setBusy(true);
    try {
      const body = {
        subject, message, channels,
        departmentId: deptId ? Number(deptId) : null,
        semester: semester ? Number(semester) : null,
        section: section || null,
        batch: batch || null,
      };
      setResult(await api("/announcements", { method: "POST", body }));
    } catch (ex) { setErr(ex.message); }
    finally { setBusy(false); }
  }

  return (
    <>
      <div className="page-head">
        <h1 className="display-lg">Bulk Announcement</h1>
        <p className="muted">Send a message to all matching students immediately.</p>
      </div>

      <Card>
        <form onSubmit={send} className="stack">
          <Input label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Important notice" />
          <div className="field">
            <label>Message</label>
            <textarea className="input" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your announcement here..." />
          </div>

          <div>
            <label className="caption-uppercase muted" style={{ display: "block", marginBottom: 8 }}>Channels</label>
            <div className="row">
              {["EMAIL", "TELEGRAM"].map((ch) => (
                <label key={ch} className="row" style={{ gap: 6, cursor: "pointer" }}>
                  <input type="checkbox" checked={channels.includes(ch)} onChange={() => toggleChannel(ch)} />
                  {ch.charAt(0) + ch.slice(1).toLowerCase()}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="caption-uppercase muted" style={{ display: "block", marginBottom: 8 }}>Audience (optional filters)</label>
            <div className="grid grid-4">
              <Select label="Department" value={deptId} onChange={setDeptId}
                options={[{ value: "", label: "All departments" }, ...((depts.data || []).map((d) => ({ value: String(d.id), label: d.name })))]} />
              <Input label="Semester" type="number" value={semester} onChange={(e) => setSemester(e.target.value)} placeholder="Any" />
              <Input label="Section" value={section} onChange={(e) => setSection(e.target.value)} placeholder="Any" />
              <Input label="Batch" value={batch} onChange={(e) => setBatch(e.target.value)} placeholder="Any" />
            </div>
          </div>

          {err && <p className="msg-err">{err}</p>}
          {result && (
            <p className="msg-ok">
              Sent to {result.recipients} student{result.recipients !== 1 ? "s" : ""}.
              {result.sent > 0 && ` ${result.sent} delivered.`}
              {result.simulated > 0 && ` ${result.simulated} simulated (no API keys configured).`}
            </p>
          )}

          <div className="row">
            <Button type="submit" disabled={busy || !subject || !message || channels.length === 0}>
              {busy ? "Sending..." : "Send announcement"}
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}
