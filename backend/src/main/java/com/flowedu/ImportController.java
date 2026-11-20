package com.flowedu;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/import")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
public class ImportController {
    private final ImportService service;
    private final AuditService audit;

    /** preview=true validates only; preview=false saves the valid rows. */
    @PostMapping("/{type}")
    public Map<String, Object> upload(@PathVariable String type,
                                      @RequestParam("file") MultipartFile file,
                                      @RequestParam(defaultValue = "true") boolean preview) throws Exception {
        if (file.isEmpty()) throw new IllegalArgumentException("The file is empty");
        var result = service.process(type, file, !preview);
        if (!preview && result.containsKey("imported")) {
            audit.log("IMPORT", type, null, result.get("imported") + " rows");
        }
        return result;
    }
}
