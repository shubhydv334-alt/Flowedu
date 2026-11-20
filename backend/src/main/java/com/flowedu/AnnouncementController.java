package com.flowedu;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
public class AnnouncementController {
    private final Repos.StudentRepo students;
    private final Repos.NotificationRepo notifications;
    private final AuditService audit;
    private final ObjectProvider<JavaMailSender> mailSender;
    @Value("${spring.mail.host:}") private String mailHost;
    @Value("${flowedu.mail-from}") private String mailFrom;

    public record AnnounceReq(String subject, String message, List<String> channels,
                              Long departmentId, Integer semester, String section, String batch) {}

    @PostMapping
    public Map<String, Object> send(@RequestBody AnnounceReq req, Authentication auth) {
        if (req.subject == null || req.subject.isBlank()) throw new IllegalArgumentException("Subject is required");
        if (req.message == null || req.message.isBlank()) throw new IllegalArgumentException("Message is required");
        List<String> channels = req.channels != null && !req.channels.isEmpty() ? req.channels : List.of("EMAIL");

        List<Domain.Student> targets = students.findAll().stream()
                .filter(s -> req.departmentId == null || (s.getDepartment() != null && req.departmentId.equals(s.getDepartment().getId())))
                .filter(s -> req.semester == null || req.semester.equals(s.getSemester()))
                .filter(s -> req.section == null || req.section.isBlank() || req.section.equalsIgnoreCase(s.getSection()))
                .filter(s -> req.batch == null || req.batch.isBlank() || req.batch.equalsIgnoreCase(s.getBatch()))
                .toList();

        int sent = 0;
        int simulated = 0;
        for (Domain.Student s : targets) {
            for (String ch : channels) {
                if ("EMAIL".equalsIgnoreCase(ch) && s.getEmail() != null && !s.getEmail().isBlank()) {
                    boolean real = trySendEmail(s.getEmail(), req.subject, req.message);
                    notifications.save(Domain.Notification.builder()
                            .recipientEmail(s.getEmail()).recipientName(s.getName())
                            .channel("EMAIL").workflowName("Announcement")
                            .subject(req.subject).body(req.message)
                            .status(real ? "SENT" : "SIMULATED")
                            .sentAt(LocalDateTime.now()).readFlag(false).build());
                    if (real) sent++; else simulated++;
                }
                if ("TELEGRAM".equalsIgnoreCase(ch)) {
                    notifications.save(Domain.Notification.builder()
                            .recipientEmail(s.getEmail()).recipientName(s.getName())
                            .channel("TELEGRAM").workflowName("Announcement")
                            .subject(req.subject).body(req.message)
                            .status("SIMULATED")
                            .sentAt(LocalDateTime.now()).readFlag(false).build());
                    simulated++;
                }
            }
        }
        audit.log("ANNOUNCEMENT", "Announcement", null, "Sent to " + targets.size() + " students: " + req.subject);

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("recipients", targets.size());
        out.put("sent", sent);
        out.put("simulated", simulated);
        return out;
    }

    private boolean trySendEmail(String to, String subject, String body) {
        JavaMailSender js = (mailHost == null || mailHost.isBlank()) ? null : mailSender.getIfAvailable();
        if (js == null) return false;
        SimpleMailMessage m = new SimpleMailMessage();
        m.setFrom(mailFrom);
        m.setTo(to);
        m.setSubject(subject);
        m.setText(body);
        try { js.send(m); return true; } catch (Exception e) { return false; }
    }
}
