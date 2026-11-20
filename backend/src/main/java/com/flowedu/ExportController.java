package com.flowedu;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
public class ExportController {
    private final Repos.StudentRepo students;
    private final Repos.AttendanceRepo attendance;
    private final Repos.MarkRepo marks;
    private final Repos.RunRepo runs;

    @GetMapping("/students")
    public ResponseEntity<byte[]> exportStudents() {
        StringBuilder sb = new StringBuilder("Roll No,Name,Email,Department,Semester,Section,Batch\n");
        for (var s : students.findAll()) {
            sb.append(csv(s.getRollNo())).append(",")
              .append(csv(s.getName())).append(",")
              .append(csv(s.getEmail())).append(",")
              .append(csv(s.getDepartment() != null ? s.getDepartment().getName() : "")).append(",")
              .append(s.getSemester() != null ? s.getSemester() : "").append(",")
              .append(csv(s.getSection())).append(",")
              .append(csv(s.getBatch())).append("\n");
        }
        return csvResponse(sb.toString(), "students.csv");
    }

    @GetMapping("/attendance")
    public ResponseEntity<byte[]> exportAttendance() {
        StringBuilder sb = new StringBuilder("Roll No,Student,Course Code,Course,Percent,Date\n");
        for (var a : attendance.findAll()) {
            sb.append(csv(a.getStudent().getRollNo())).append(",")
              .append(csv(a.getStudent().getName())).append(",")
              .append(csv(a.getCourse().getCode())).append(",")
              .append(csv(a.getCourse().getName())).append(",")
              .append(a.getPercent()).append(",")
              .append(a.getRecordDate() != null ? a.getRecordDate() : "").append("\n");
        }
        return csvResponse(sb.toString(), "attendance.csv");
    }

    @GetMapping("/marks")
    public ResponseEntity<byte[]> exportMarks() {
        StringBuilder sb = new StringBuilder("Roll No,Student,Course Code,Exam,Marks,Max Marks\n");
        for (var m : marks.findAll()) {
            sb.append(csv(m.getStudent().getRollNo())).append(",")
              .append(csv(m.getStudent().getName())).append(",")
              .append(csv(m.getCourse().getCode())).append(",")
              .append(csv(m.getExamName())).append(",")
              .append(m.getMarks()).append(",")
              .append(m.getMaxMarks()).append("\n");
        }
        return csvResponse(sb.toString(), "marks.csv");
    }

    @GetMapping("/logs")
    public ResponseEntity<byte[]> exportLogs() {
        StringBuilder sb = new StringBuilder("Workflow,Trigger,Students,Failures,Status,Started,Finished,Test\n");
        for (var r : runs.findTop100ByOrderByStartedAtDesc()) {
            sb.append(csv(r.getWorkflowName())).append(",")
              .append(csv(r.getTriggerType())).append(",")
              .append(r.getAffected()).append(",")
              .append(r.getFailures()).append(",")
              .append(csv(r.getStatus())).append(",")
              .append(r.getStartedAt() != null ? r.getStartedAt() : "").append(",")
              .append(r.getFinishedAt() != null ? r.getFinishedAt() : "").append(",")
              .append(Boolean.TRUE.equals(r.getTestRun()) ? "Yes" : "No").append("\n");
        }
        return csvResponse(sb.toString(), "logs.csv");
    }

    private static String csv(String s) {
        if (s == null) return "";
        if (s.contains(",") || s.contains("\"") || s.contains("\n")) return "\"" + s.replace("\"", "\"\"") + "\"";
        return s;
    }

    private static ResponseEntity<byte[]> csvResponse(String data, String filename) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(data.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }
}
