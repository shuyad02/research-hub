package com.researchhub.backend.repository;
import com.researchhub.backend.entity.Scholarship;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface ScholarshipRepository extends JpaRepository<Scholarship, UUID> {}
