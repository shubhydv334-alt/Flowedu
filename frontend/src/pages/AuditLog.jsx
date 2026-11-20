import React from "react";
import { Badge, Card } from "../ui";
import { useApi } from "../api";
import { fmt } from "../meta";

export default function AuditLog() {
  const { data, error } = useApi("/audit");

  return (
    <>
      <div className="page-head">
        <h1 className="display-lg">Audit Log</h1>
        <p className="muted">Who did what, and when.</p>
      </div>
      {error && <p className="msg-err">{error}</p>}
      <Card style={{ padding: 0 }}>
        {!data || data.length === 0 ? (
          <div className="empty muted">No activity recorded yet.</div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>Action</th><th>Type</th><th>Detail</th><th>User</th><th>When</th></tr>
              </thead>
              <tbody>
                {data.map((a) => (
                  <tr key={a.id}>
                    <td><Badge>{a.action}</Badge></td>
                    <td>{a.entityType}</td>
                    <td>{a.detail}</td>
                    <td className="strong">{a.performedBy}</td>
                    <td>{fmt(a.performedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
