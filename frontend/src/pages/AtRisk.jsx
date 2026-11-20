import React from "react";
import { Badge, Card } from "../ui";
import { useApi } from "../api";

const riskTone = (level) => level === "CRITICAL" ? "error" : level === "HIGH" ? "error" : "default";

export default function AtRisk() {
  const { data, error, loading } = useApi("/risk");

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="display-lg">At-Risk Students</h1>
          <p className="muted">Students flagged for low attendance, low marks, or missed assignments.</p>
        </div>
      </div>
      {error && <p className="msg-err">{error}</p>}
      {loading && !data && <p className="muted">Analyzing student data...</p>}

      {data && (
        <>
          <div className="grid grid-4" style={{ marginBottom: 24 }}>
            <Card hover>
              <span className="caption-uppercase muted">Total At Risk</span>
              <div className="display-lg" style={{ margin: "8px 0" }}>{data.totalAtRisk}</div>
            </Card>
            <Card hover>
              <span className="caption-uppercase muted">Critical</span>
              <div className="display-lg" style={{ margin: "8px 0", color: "var(--color-error)" }}>{data.critical}</div>
            </Card>
            <Card hover>
              <span className="caption-uppercase muted">High</span>
              <div className="display-lg" style={{ margin: "8px 0", color: "#e6a700" }}>{data.high}</div>
            </Card>
            <Card hover>
              <span className="caption-uppercase muted">Medium</span>
              <div className="display-lg" style={{ margin: "8px 0" }}>{data.medium}</div>
            </Card>
          </div>

          {data.students.length === 0 ? (
            <Card><div className="empty muted">No students at risk. Great news!</div></Card>
          ) : (
            <Card style={{ padding: 0 }}>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Roll No</th><th>Name</th><th>Department</th><th>Attendance</th>
                      <th>Lowest Score</th><th>Missed Assignments</th><th>Risk Level</th><th>Reasons</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.students.map((s) => (
                      <tr key={s.studentId}>
                        <td className="strong">{s.rollNo}</td>
                        <td>{s.name}</td>
                        <td>{s.department}</td>
                        <td style={{ color: s.avgAttendance < 65 ? "var(--color-error)" : undefined }}>{s.avgAttendance}%</td>
                        <td style={{ color: s.lowestMarks < 40 ? "var(--color-error)" : undefined }}>{s.lowestMarks}%</td>
                        <td>{s.missedAssignments}</td>
                        <td><Badge tone={riskTone(s.riskLevel)}>{s.riskLevel}</Badge></td>
                        <td><span className="caption">{s.factors.join(", ")}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </>
  );
}
