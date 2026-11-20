import React from "react";
import { Badge, Card } from "../ui";
import { useApi } from "../api";
import { useAuth } from "../auth";
import { fmt } from "../meta";

function Stat({ label, value, hint, warn }) {
  return (
    <Card hover>
      <span className="caption-uppercase muted">{label}</span>
      <div className="display-lg" style={{ margin: "8px 0 4px", color: warn ? "var(--color-error)" : undefined }}>{value}</div>
      {hint && <span className="caption muted">{hint}</span>}
    </Card>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data, error, loading } = useApi("/dashboard/student");

  if (loading && !data) return <p className="muted">Loading...</p>;
  if (error) return <p className="msg-err">{error}</p>;
  if (data && !data.found) return (
    <div>
      <h1 className="display-lg">Welcome, {user.name}</h1>
      <p className="muted" style={{ marginTop: 12 }}>No student record is linked to your account yet. Contact your admin.</p>
    </div>
  );
  if (!data) return null;

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1 className="display-lg">Welcome, {data.name}</h1>
        <p className="muted">{data.rollNo} · {data.department} · Semester {data.semester} · Section {data.section}</p>
      </div>

      <div className="grid grid-4">
        <Stat label="Average Attendance" value={`${data.avgAttendance}%`} warn={data.avgAttendance < 75} hint={data.avgAttendance < 75 ? "Below 75% threshold" : "On track"} />
        <Stat label="Courses" value={data.attendance?.length || 0} hint="With attendance records" />
        <Stat label="Upcoming Deadlines" value={data.deadlines?.filter(d => !d.submitted).length || 0} hint="Assignments pending" />
        <Stat label="Upcoming Exams" value={data.exams?.length || 0} hint="Scheduled exams" />
      </div>

      {data.attendance?.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 className="display-md" style={{ marginBottom: 16 }}>Attendance by Course</h2>
          <div className="grid grid-3">
            {data.attendance.map((a) => (
              <Card key={a.code} hover>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong>{a.code}</strong>
                    <div className="caption muted">{a.course}</div>
                  </div>
                  <div className="display-md" style={{ color: a.percent < 65 ? "var(--color-error)" : a.percent < 75 ? "#e6a700" : "var(--color-success)" }}>
                    {a.percent}%
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {data.marks?.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 className="display-md" style={{ marginBottom: 16 }}>Exam Scores</h2>
          <Card style={{ padding: 0 }}>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>Course</th><th>Exam</th><th>Marks</th><th>Percentage</th></tr>
                </thead>
                <tbody>
                  {data.marks.map((m, i) => (
                    <tr key={i}>
                      <td>{m.code} · {m.course}</td>
                      <td>{m.exam}</td>
                      <td className="strong">{m.marks} / {m.maxMarks}</td>
                      <td><Badge tone={m.percent < 40 ? "error" : "success"}>{m.percent}%</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {data.deadlines?.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 className="display-md" style={{ marginBottom: 16 }}>Upcoming Deadlines</h2>
          <Card style={{ padding: 0 }}>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>Assignment</th><th>Course</th><th>Deadline</th><th>Days Left</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {data.deadlines.map((d, i) => (
                    <tr key={i}>
                      <td className="strong">{d.title}</td>
                      <td>{d.course}</td>
                      <td>{fmt(d.deadline)}</td>
                      <td>{d.daysLeft} day{d.daysLeft !== 1 ? "s" : ""}</td>
                      <td><Badge tone={d.submitted ? "success" : "default"}>{d.submitted ? "Submitted" : "Pending"}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {data.exams?.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 className="display-md" style={{ marginBottom: 16 }}>Upcoming Exams</h2>
          <Card style={{ padding: 0 }}>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>Exam</th><th>Course</th><th>Date</th><th>Days Left</th></tr>
                </thead>
                <tbody>
                  {data.exams.map((e, i) => (
                    <tr key={i}>
                      <td className="strong">{e.name}</td>
                      <td>{e.course}</td>
                      <td>{e.date}</td>
                      <td>{e.daysLeft} day{e.daysLeft !== 1 ? "s" : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
