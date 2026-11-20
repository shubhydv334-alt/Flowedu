import React from "react";
import { Badge, Button, Card } from "../ui";
import { api, useApi } from "../api";
import { fmt } from "../meta";

export default function Notifications() {
  const { data, error, reload } = useApi("/notifications");

  async function markRead(id) {
    await api(`/notifications/${id}/read`, { method: "POST" });
    reload();
  }

  async function readAll() {
    await api("/notifications/read-all", { method: "POST" });
    reload();
  }

  const list = data?.notifications || [];

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="display-lg">Notifications</h1>
          <p className="muted">{data?.unread || 0} unread notification{data?.unread !== 1 ? "s" : ""}</p>
        </div>
        {data?.unread > 0 && <Button variant="outline" onClick={readAll}>Mark all as read</Button>}
      </div>
      {error && <p className="msg-err">{error}</p>}
      {list.length === 0 ? (
        <Card><div className="empty muted">No notifications yet.</div></Card>
      ) : (
        <div className="stack">
          {list.map((n) => (
            <Card key={n.id} style={{ borderLeft: !n.readFlag ? "3px solid var(--color-accent)" : undefined }}>
              <div className="row" style={{ marginBottom: 8 }}>
                <Badge>{n.channel}</Badge>
                <strong>{n.subject || n.workflowName}</strong>
                <Badge tone={n.status === "SENT" || n.status === "SUCCESS" ? "success" : "default"}>{n.status}</Badge>
                <span className="caption muted">{fmt(n.sentAt)}</span>
                {!n.readFlag && (
                  <Button variant="text" className="btn-sm" onClick={() => markRead(n.id)}>Mark read</Button>
                )}
              </div>
              <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{n.body}</p>
              <span className="caption muted">From: {n.workflowName}</span>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
