package com.flowedu;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/risk")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
public class RiskController {
    private final Repos.StudentRepo students;
    private final Repos.AttendanceRepo attendance;
    private final Repos.MarkRepo marks;
    private final Repos.AssignmentRepo assignments;
    private final Repos.SubmissionRepo submissions;

    @GetMapping
    public Map<String, Object> riskReport() {
        List<Domain.Student> all = students.findAll();
        List<Domain.AttendanceRecord> allAtt = attendance.findAll();
        List<Domain.MarkRecord> allMarks = marks.findAll();
        List<Domain.Assignment> allAssignments = assignments.findAll();

        List<Map<String, Object>> rows = new ArrayList<>();
        int critical = 0, high = 0, medium = 0;

        for (Domain.Student s : all) {
            List<Domain.AttendanceRecord> studentAtt = allAtt.stream()
                    .filter(a -> a.getStudent().getId().equals(s.getId()))
                    .toList();
            double avgAttendance = studentAtt.isEmpty() ? 100.0 :
                    studentAtt.stream().mapToDouble(Domain.AttendanceRecord::getPercent).average().orElse(100.0);

            List<Domain.MarkRecord> studentMarks = allMarks.stream()
                    .filter(m -> m.getStudent().getId().equals(s.getId()))
                    .toList();
            double lowestMarksPct = studentMarks.isEmpty() ? 100.0 :
                    studentMarks.stream()
                            .mapToDouble(m -> m.getMaxMarks() > 0 ? (m.getMarks() / m.getMaxMarks()) * 100 : 100)
                            .min().orElse(100.0);

            long missedAssignments = 0;
            for (Domain.Assignment a : allAssignments) {
                if (a.getCourse() != null && WorkflowSupport.inCourse(s, a.getCourse())) {
                    if (a.getDeadline() != null && a.getDeadline().isBefore(LocalDateTime.now())) {
                        if (!submissions.existsByAssignmentAndStudent(a, s)) {
                            missedAssignments++;
                        }
                    }
                }
            }

            int riskScore = 0;
            List<String> factors = new ArrayList<>();
            if (avgAttendance < 50) { riskScore += 3; factors.add("Very low attendance (" + Math.round(avgAttendance) + "%)"); }
            else if (avgAttendance < 65) { riskScore += 2; factors.add("Low attendance (" + Math.round(avgAttendance) + "%)"); }
            else if (avgAttendance < 75) { riskScore += 1; factors.add("Below threshold attendance (" + Math.round(avgAttendance) + "%)"); }

            if (lowestMarksPct < 30) { riskScore += 3; factors.add("Failing marks"); }
            else if (lowestMarksPct < 40) { riskScore += 2; factors.add("Low marks"); }

            if (missedAssignments >= 3) { riskScore += 2; factors.add(missedAssignments + " missed assignments"); }
            else if (missedAssignments >= 1) { riskScore += 1; factors.add(missedAssignments + " missed assignment(s)"); }

            if (riskScore == 0) continue;

            String level = riskScore >= 5 ? "CRITICAL" : riskScore >= 3 ? "HIGH" : "MEDIUM";
            if ("CRITICAL".equals(level)) critical++;
            else if ("HIGH".equals(level)) high++;
            else medium++;

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("studentId", s.getId());
            row.put("rollNo", s.getRollNo());
            row.put("name", s.getName());
            row.put("department", s.getDepartment() != null ? s.getDepartment().getName() : "");
            row.put("semester", s.getSemester());
            row.put("section", s.getSection());
            row.put("avgAttendance", Math.round(avgAttendance * 10.0) / 10.0);
            row.put("lowestMarks", Math.round(lowestMarksPct * 10.0) / 10.0);
            row.put("missedAssignments", missedAssignments);
            row.put("riskLevel", level);
            row.put("riskScore", riskScore);
            row.put("factors", factors);
            rows.add(row);
        }

        rows.sort(Comparator.comparingInt((Map<String, Object> r) -> (int) r.get("riskScore")).reversed());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalAtRisk", rows.size());
        result.put("critical", critical);
        result.put("high", high);
        result.put("medium", medium);
        result.put("students", rows);
        return result;
    }
}
