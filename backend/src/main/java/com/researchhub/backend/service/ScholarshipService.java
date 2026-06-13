package com.researchhub.backend.service;
import com.researchhub.backend.entity.Scholarship;
import com.researchhub.backend.repository.ScholarshipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScholarshipService {
    private final ScholarshipRepository repository;

    public List<Scholarship> getAllScholarships() {
        return repository.findAll();
    }
    public Scholarship createScholarship(Scholarship scholarship) {
        return repository.save(scholarship);
    }
}
