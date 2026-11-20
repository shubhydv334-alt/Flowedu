package com.flowedu;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditService {
    private final Repos.AuditLogRepo repo;

    public void log(String action, String entityType, Long entityId, String detail) {
        String user = "system";
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null) user = auth.getName();
        repo.save(Domain.AuditLog.builder()
                .action(action).entityType(entityType).entityId(entityId)
                .detail(detail).performedBy(user).performedAt(LocalDateTime.now())
                .build());
    }
}
