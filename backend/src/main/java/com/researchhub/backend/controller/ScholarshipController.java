package com.researchhub.backend.controller;
import com.researchhub.backend.entity.Scholarship;
import com.researchhub.backend.service.ScholarshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/scholarships")
@RequiredArgsConstructor
public class ScholarshipController {
    private final ScholarshipService service;

    @GetMapping
    public ResponseEntity<List<Scholarship>> getAll() {
        return ResponseEntity.ok(service.getAllScholarships());
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Scholarship> create(@RequestBody Scholarship scholarship) {
        return ResponseEntity.ok(service.createScholarship(scholarship));
    }
}
