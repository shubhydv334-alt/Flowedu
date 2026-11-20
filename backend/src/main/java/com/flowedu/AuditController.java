package com.flowedu;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AuditController {
    private final Repos.AuditLogRepo repo;

    @GetMapping
    public List<Domain.AuditLog> list() {
        return repo.findTop200ByOrderByPerformedAtDesc();
    }
}
