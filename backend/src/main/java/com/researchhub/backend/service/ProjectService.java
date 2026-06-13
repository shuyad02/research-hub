package com.researchhub.backend.service;
import com.researchhub.backend.entity.ResearchProject;
import com.researchhub.backend.repository.ResearchProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ResearchProjectRepository repository;

    public List<ResearchProject> getUserProjects(UUID userId) {
        return repository.findByOwnerId(userId);
    }
    public ResearchProject createProject(ResearchProject project) {
        return repository.save(project);
    }
}
