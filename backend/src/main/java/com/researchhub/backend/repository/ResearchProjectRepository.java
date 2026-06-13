package com.researchhub.backend.repository;
import com.researchhub.backend.entity.ResearchProject;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
public interface ResearchProjectRepository extends JpaRepository<ResearchProject, UUID> {
    List<ResearchProject> findByOwnerId(UUID ownerId);
}
