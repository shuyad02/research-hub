package com.researchhub.backend.controller;

import com.researchhub.backend.dto.ApplicationRequest;
import com.researchhub.backend.entity.Application;
import com.researchhub.backend.entity.User;
import com.researchhub.backend.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService service;

    @PostMapping(value = "/apply", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Application> apply(
            @RequestParam("scholarshipId") java.util.UUID scholarshipId,
            @RequestParam("statementOfPurpose") String statementOfPurpose,
            @RequestParam("resume") org.springframework.web.multipart.MultipartFile resume,
            @AuthenticationPrincipal User user) {
        Application application = service.applyForScholarship(user, scholarshipId, statementOfPurpose, resume);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Application>> getMyApplications(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.getMyApplications(user));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Application>> getAllApplications() {
        return ResponseEntity.ok(service.getAllApplications());
    }
}

