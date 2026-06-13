package com.researchhub.backend.controller;
import com.researchhub.backend.entity.ResearchProject;
import com.researchhub.backend.entity.User;
import com.researchhub.backend.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RESEARCHER')")
public class ProjectController {
    private final ProjectService service;

    @GetMapping
    public ResponseEntity<List<ResearchProject>> getMyProjects(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.getUserProjects(user.getId()));
    }
    @PostMapping
    public ResponseEntity<ResearchProject> create(@RequestBody ResearchProject project, @AuthenticationPrincipal User user) {
        project.setOwner(user);
        return ResponseEntity.ok(service.createProject(project));
    }
}

