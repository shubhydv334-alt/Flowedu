// Shared constants for the builder. Keys match the context keys built by WorkflowEngine.

export const VARIABLES = [
  { key: "student.name", label: "Student Name" },
  { key: "student.email", label: "Student Email" },
  { key: "student.rollNo", label: "Roll Number" },
  { key: "student.department", label: "Department" },
  { key: "student.semester", label: "Semester" },
  { key: "student.section", label: "Section" },
  { key: "student.batch", label: "Batch" },
  { key: "course.name", label: "Course Name" },
  { key: "course.code", label: "Course Code" },
  { key: "course.teacher", label: "Course Teacher" },
  { key: "attendance.percent", label: "Attendance %" },
  { key: "assignment.title", label: "Assignment Title" },
  { key: "assignment.deadline", label: "Assignment Deadline" },
  { key: "assignment.daysLeft", label: "Days Until Deadline" },
  { key: "exam.name", label: "Exam Name" },
  { key: "exam.date", label: "Exam Date" },
  { key: "exam.daysLeft", label: "Days Until Exam" },
  { key: "summary.count", label: "Summary Count" },
  { key: "summary.list", label: "Summary List" },
  { key: "marks.score", label: "Marks Score" },
  { key: "marks.maxMarks", label: "Maximum Marks" },
  { key: "marks.percent", label: "Marks %" },
  { key: "ai.message", label: "AI Message" },
];

export const CONDITION_FIELDS = [
  { key: "attendance.percent", label: "Attendance %" },
  { key: "student.semester", label: "Semester" },
  { key: "student.department", label: "Department" },
  { key: "student.section", label: "Section" },
  { key: "student.batch", label: "Batch" },
  { key: "course.code", label: "Course Code" },
  { key: "assignment.submitted", label: "Assignment Submitted (yes/no)" },
  { key: "assignment.daysLeft", label: "Days Until Deadline" },
  { key: "exam.daysLeft", label: "Days Until Exam" },
  { key: "marks.percent", label: "Marks %" },
];

export const OPERATOR_LABELS = {
  "<": "is less than",
  "<=": "is at most",
  ">": "is more than",
  ">=": "is at least",
  "==": "equals",
  "!=": "does not equal",
  "contains": "contains",
};

export const OPERATORS = ["<", "<=", ">", ">=", "==", "!=", "contains"];

export const EVENTS = [
  { key: "ATTENDANCE_UPLOADED", label: "Attendance uploaded", source: "ATTENDANCE" },
  { key: "ASSIGNMENT_SUBMITTED", label: "Assignment submitted", source: "ASSIGNMENT" },
  { key: "MARKS_UPLOADED", label: "Marks uploaded", source: "MARKS" },
];

export const DATE_SOURCES = [
  { key: "ASSIGNMENT_DEADLINE", label: "Assignment deadline", source: "ASSIGNMENT" },
  { key: "EXAM_DATE", label: "Exam date", source: "EXAM" },
];

export const SOURCES = ["ATTENDANCE", "ASSIGNMENT", "EXAM", "STUDENT", "MARKS"];

export const CRON_PRESETS = [
  { label: "Mondays 8:00", cron: "0 0 8 * * MON" },
  { label: "Daily 9:00", cron: "0 0 9 * * *" },
  { label: "Every hour", cron: "0 0 * * * *" },
  { label: "Every minute (demo)", cron: "0 * * * * *" },
];

export const STEP_TYPES = [
  { key: "AI", label: "AI message" },
  { key: "EMAIL", label: "Email" },
  { key: "TELEGRAM", label: "Telegram" },
  { key: "WEBHOOK", label: "Webhook" },
];

export const tone = (s) => (s === "SUCCESS" ? "success" : s === "FAILED" ? "error" : "default");

export const fmt = (d) => (d ? new Date(d).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "-");

export function fieldLabel(key) {
  const f = CONDITION_FIELDS.find((c) => c.key === key);
  return f ? f.label : key;
}

export function triggerSummary(t = {}) {
  if (t.type === "EVENT") return `On: ${String(t.event || "").replaceAll("_", " ").toLowerCase()}`;
  if (t.type === "SCHEDULE") return `Schedule: ${t.cron}`;
  if (t.type === "DATE") return `${t.daysBefore} day(s) before ${t.dateSource === "EXAM_DATE" ? "exam" : "deadline"}`;
  return "-";
}
