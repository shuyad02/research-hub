package com.researchhub.backend.repository;
import com.researchhub.backend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ApplicationRepository extends JpaRepository<Application, UUID> {
    List<Application> findByUserId(UUID userId);
    Optional<Application> findByUserIdAndScholarshipId(UUID userId, UUID scholarshipId);
}
