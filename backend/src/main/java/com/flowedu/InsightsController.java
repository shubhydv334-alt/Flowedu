package com.flowedu;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/** Phase 5 and 8: execution logs and the dashboard. */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class InsightsController {
    private final Repos.WorkflowRepo workflows;
    private final Repos.RunRepo runs;
    private final Repos.StepLogRepo stepLogs;
    private final Repos.StudentRepo students;
    private final Repos.AttendanceRepo attendance;
    private final Repos.MarkRepo marks;
    private final Repos.AssignmentRepo assignments;
    private final Repos.SubmissionRepo submissions;
    private final Repos.ExamRepo exams;

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("workflows", workflows.count());
        m.put("activeWorkflows", workflows.findByEnabledTrue().size());
        m.put("messagesSent", stepLogs.countByStatusInAndStepTypeIn(
                List.of("SUCCESS", "SIMULATED"), List.of("EMAIL", "TELEGRAM", "WEBHOOK")));
        m.put("failures", stepLogs.countByStatus("FAILED"));
        m.put("activeStudents", students.count());
        m.put("recentRuns", runs.findTop10ByOrderByStartedAtDesc());

        // --- Chart data ---
        List<Domain.WorkflowRun> allRuns = runs.findTop100ByOrderByStartedAtDesc();
        List<Domain.StepLog> allSteps = stepLogs.findAll();

        // 1. Runs per day (last 7 days)
        LocalDate today = LocalDate.now();
        DateTimeFormatter dayFmt = DateTimeFormatter.ofPattern("MMM d");
        List<Map<String, Object>> runsPerDay = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            LocalDateTime start = d.atStartOfDay();
            LocalDateTime end = d.plusDays(1).atStartOfDay();
            long count = allRuns.stream()
                    .filter(r -> r.getStartedAt() != null && !r.getStartedAt().isBefore(start) && r.getStartedAt().isBefore(end))
                    .count();
            Map<String, Object> point = new LinkedHashMap<>();
            point.put("label", d.format(dayFmt));
            point.put("value", count);
            runsPerDay.add(point);
        }
        m.put("runsPerDay", runsPerDay);

        // 2. Message breakdown by channel type
        Map<String, Long> msgBreakdown = new LinkedHashMap<>();
        for (String type : List.of("EMAIL", "TELEGRAM", "WEBHOOK")) {
            msgBreakdown.put(type, stepLogs.countByStatusInAndStepTypeIn(
                    List.of("SUCCESS", "SIMULATED"), List.of(type)));
        }
        m.put("messagesByType", msgBreakdown);

        // 3. Run status distribution
        Map<String, Long> statusDist = allRuns.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getStatus() != null ? r.getStatus() : "UNKNOWN",
                        LinkedHashMap::new,
                        Collectors.counting()));
        m.put("statusDistribution", statusDist);

        // 4. Step success vs failure over last 7 days
        List<Map<String, Object>> stepsByDay = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            LocalDateTime start = d.atStartOfDay();
            LocalDateTime end = d.plusDays(1).atStartOfDay();
            long successes = allSteps.stream()
                    .filter(s -> s.getLoggedAt() != null && !s.getLoggedAt().isBefore(start) && s.getLoggedAt().isBefore(end)
                            && ("SUCCESS".equals(s.getStatus()) || "SIMULATED".equals(s.getStatus())))
                    .count();
            long failures = allSteps.stream()
                    .filter(s -> s.getLoggedAt() != null && !s.getLoggedAt().isBefore(start) && s.getLoggedAt().isBefore(end)
                            && "FAILED".equals(s.getStatus()))
                    .count();
            Map<String, Object> point = new LinkedHashMap<>();
            point.put("label", d.format(dayFmt));
            point.put("success", successes);
            point.put("failed", failures);
            stepsByDay.add(point);
        }
        m.put("stepsByDay", stepsByDay);

        return m;
    }

    @GetMapping("/runs")
    public List<Domain.WorkflowRun> listRuns() {
        return runs.findTop100ByOrderByStartedAtDesc();
    }

    /** One run with every step: status, attempts, input and output. */
    @GetMapping("/runs/{id}")
    public Map<String, Object> run(@PathVariable Long id) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("run", runs.findById(id).orElseThrow());
        m.put("steps", stepLogs.findByRunIdOrderByIdAsc(id));
        return m;
    }

    @GetMapping("/dashboard/student")
    public Map<String, Object> studentDashboard(Authentication auth) {
        String email = auth.getName();
        var student = students.findAll().stream()
                .filter(s -> email.equalsIgnoreCase(s.getEmail()))
                .findFirst().orElse(null);

        Map<String, Object> m = new LinkedHashMap<>();
        if (student == null) { m.put("found", false); return m; }
        m.put("found", true);
        m.put("name", student.getName());
        m.put("rollNo", student.getRollNo());
        m.put("department", student.getDepartment() != null ? student.getDepartment().getName() : "");
        m.put("semester", student.getSemester());
        m.put("section", student.getSection());
        m.put("batch", student.getBatch());

        List<Domain.AttendanceRecord> att = attendance.findAll().stream()
                .filter(a -> a.getStudent().getId().equals(student.getId())).toList();
        Map<Long, Domain.AttendanceRecord> latest = new LinkedHashMap<>();
        att.stream().sorted(Comparator.comparing(Domain.AttendanceRecord::getId))
                .forEach(a -> latest.put(a.getCourse().getId(), a));
        List<Map<String, Object>> attList = new ArrayList<>();
        for (var a : latest.values()) {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("course", a.getCourse().getName());
            row.put("code", a.getCourse().getCode());
            row.put("percent", a.getPercent());
            row.put("date", a.getRecordDate());
            attList.add(row);
        }
        m.put("attendance", attList);
        double avgAtt = attList.isEmpty() ? 0 : attList.stream().mapToDouble(a -> (Double) a.get("percent")).average().orElse(0);
        m.put("avgAttendance", Math.round(avgAtt * 10.0) / 10.0);

        List<Map<String, Object>> markList = new ArrayList<>();
        marks.findAll().stream()
                .filter(mk -> mk.getStudent().getId().equals(student.getId()))
                .forEach(mk -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("course", mk.getCourse().getName());
                    row.put("code", mk.getCourse().getCode());
                    row.put("exam", mk.getExamName());
                    row.put("marks", mk.getMarks());
                    row.put("maxMarks", mk.getMaxMarks());
                    row.put("percent", mk.getMaxMarks() > 0 ? Math.round(mk.getMarks() / mk.getMaxMarks() * 1000.0) / 10.0 : 0);
                    markList.add(row);
                });
        m.put("marks", markList);

        List<Map<String, Object>> deadlines = new ArrayList<>();
        LocalDate today = LocalDate.now();
        assignments.findAll().stream()
                .filter(a -> a.getCourse() != null && WorkflowSupport.inCourse(student, a.getCourse()))
                .filter(a -> a.getDeadline() != null && a.getDeadline().toLocalDate().isAfter(today.minusDays(1)))
                .sorted(Comparator.comparing(Domain.Assignment::getDeadline))
                .limit(10)
                .forEach(a -> {
                    boolean submitted = submissions.existsByAssignmentAndStudent(a, student);
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("title", a.getTitle());
                    row.put("course", a.getCourse().getName());
                    row.put("deadline", a.getDeadline());
                    row.put("submitted", submitted);
                    row.put("daysLeft", ChronoUnit.DAYS.between(today, a.getDeadline().toLocalDate()));
                    deadlines.add(row);
                });
        m.put("deadlines", deadlines);

        List<Map<String, Object>> examList = new ArrayList<>();
        exams.findAll().stream()
                .filter(e -> e.getCourse() != null && WorkflowSupport.inCourse(student, e.getCourse()))
                .filter(e -> e.getExamDate() != null && !e.getExamDate().isBefore(today))
                .sorted(Comparator.comparing(Domain.Exam::getExamDate))
                .limit(10)
                .forEach(e -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("name", e.getName());
                    row.put("course", e.getCourse().getName());
                    row.put("date", e.getExamDate());
                    row.put("daysLeft", ChronoUnit.DAYS.between(today, e.getExamDate()));
                    examList.add(row);
                });
        m.put("exams", examList);

        return m;
    }
}
