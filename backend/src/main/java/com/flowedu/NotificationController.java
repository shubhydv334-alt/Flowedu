package com.flowedu;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final Repos.NotificationRepo repo;

    @GetMapping
    public Map<String, Object> myNotifications(Authentication auth) {
        List<Domain.Notification> list = repo.findByRecipientEmailOrderBySentAtDesc(auth.getName());
        long unread = repo.countByRecipientEmailAndReadFlagFalse(auth.getName());
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("unread", unread);
        out.put("notifications", list);
        return out;
    }

    @PostMapping("/{id}/read")
    public Domain.Notification markRead(@PathVariable Long id, Authentication auth) {
        var n = repo.findById(id).orElseThrow();
        if (!auth.getName().equalsIgnoreCase(n.getRecipientEmail()))
            throw new IllegalArgumentException("Not your notification");
        n.setReadFlag(true);
        return repo.save(n);
    }

    @PostMapping("/read-all")
    public Map<String, Object> readAll(Authentication auth) {
        List<Domain.Notification> list = repo.findByRecipientEmailOrderBySentAtDesc(auth.getName());
        int count = 0;
        for (var n : list) {
            if (!Boolean.TRUE.equals(n.getReadFlag())) {
                n.setReadFlag(true);
                repo.save(n);
                count++;
            }
        }
        return Map.of("marked", count);
    }
}
