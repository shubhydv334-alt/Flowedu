package com.flowedu;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final Repos.UserRepo users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final AuditService audit;

    public record LoginReq(String email, String password) {}
    public record UserReq(String email, String password, String name, Domain.Role role) {}
    public record ProfileReq(String name, String email) {}
    public record ChangePassReq(String oldPassword, String newPassword) {}
    public record ForgotReq(String email) {}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginReq r) {
        if (r.email() == null || r.password() == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Email and password are required"));
        }
        var u = users.findByEmail(r.email().trim().toLowerCase()).orElse(null);
        if (u == null || !encoder.matches(r.password(), u.getPasswordHash())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
        }
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("token", jwt.create(u));
        body.put("name", u.getName());
        body.put("email", u.getEmail());
        body.put("role", u.getRole().name());
        return ResponseEntity.ok(body);
    }

    @GetMapping("/me")
    public Map<String, Object> me(Authentication auth) {
        var u = users.findByEmail(auth.getName()).orElseThrow();
        return Map.of("name", u.getName(), "email", u.getEmail(), "role", u.getRole().name());
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Map<String, Object>> listUsers() {
        return users.findAll().stream().map(u -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", u.getId());
            m.put("name", u.getName());
            m.put("email", u.getEmail());
            m.put("role", u.getRole().name());
            return m;
        }).toList();
    }

    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> createUser(@RequestBody UserReq r) {
        if (r.email() == null || r.password() == null || r.name() == null || r.role() == null) {
            throw new IllegalArgumentException("email, password, name and role are required");
        }
        var u = users.save(Domain.AppUser.builder()
                .email(r.email().trim().toLowerCase())
                .passwordHash(encoder.encode(r.password()))
                .name(r.name())
                .role(r.role())
                .build());
        audit.log("CREATE", "User", u.getId(), u.getEmail());
        return Map.of("id", u.getId(), "email", u.getEmail(), "role", u.getRole().name());
    }

    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> updateUser(@PathVariable Long id, @RequestBody UserReq r) {
        var u = users.findById(id).orElseThrow();
        if (r.name() != null) u.setName(r.name());
        if (r.email() != null) u.setEmail(r.email().trim().toLowerCase());
        if (r.role() != null) u.setRole(r.role());
        if (r.password() != null && !r.password().isBlank()) u.setPasswordHash(encoder.encode(r.password()));
        users.save(u);
        audit.log("UPDATE", "User", id, u.getEmail());
        return Map.of("id", u.getId(), "name", u.getName(), "email", u.getEmail(), "role", u.getRole().name());
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        users.deleteById(id);
        audit.log("DELETE", "User", id, "");
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/profile")
    public Map<String, Object> updateProfile(@RequestBody ProfileReq r, Authentication auth) {
        var u = users.findByEmail(auth.getName()).orElseThrow();
        if (r.name() != null && !r.name().isBlank()) u.setName(r.name());
        if (r.email() != null && !r.email().isBlank()) u.setEmail(r.email().trim().toLowerCase());
        users.save(u);
        return Map.of("name", u.getName(), "email", u.getEmail(), "role", u.getRole().name());
    }

    @PostMapping("/change-password")
    public Map<String, String> changePassword(@RequestBody ChangePassReq r, Authentication auth) {
        if (r.oldPassword() == null || r.newPassword() == null) throw new IllegalArgumentException("Both old and new password are required");
        var u = users.findByEmail(auth.getName()).orElseThrow();
        if (!encoder.matches(r.oldPassword(), u.getPasswordHash())) throw new IllegalArgumentException("Old password is incorrect");
        u.setPasswordHash(encoder.encode(r.newPassword()));
        users.save(u);
        return Map.of("message", "Password changed successfully");
    }

    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@RequestBody ForgotReq r) {
        if (r.email() == null) throw new IllegalArgumentException("Email is required");
        var u = users.findByEmail(r.email().trim().toLowerCase()).orElse(null);
        if (u == null) return Map.of("message", "If the email exists, a reset has been sent.");
        u.setPasswordHash(encoder.encode("reset123"));
        users.save(u);
        return Map.of("message", "Password has been reset to: reset123 (demo mode)");
    }
}
