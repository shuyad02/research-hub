package com.researchhub.backend.service;

import com.researchhub.backend.entity.Application;
import com.researchhub.backend.entity.Scholarship;
import com.researchhub.backend.entity.User;
import com.researchhub.backend.exception.DuplicateApplicationException;
import com.researchhub.backend.repository.ApplicationRepository;
import com.researchhub.backend.repository.ScholarshipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import java.util.Map;
import com.researchhub.backend.dto.ApplicationRequest;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ScholarshipRepository scholarshipRepository;
    private final Cloudinary cloudinary;

    public Application applyForScholarship(User user, java.util.UUID scholarshipId, String statementOfPurpose, MultipartFile resume) {
        Scholarship scholarship = scholarshipRepository.findById(scholarshipId)
                .orElseThrow(() -> new IllegalArgumentException("Scholarship not found"));

        if (applicationRepository.findByUserIdAndScholarshipId(user.getId(), scholarshipId).isPresent()) {
            throw new DuplicateApplicationException("You have already applied for this scholarship.");
        }

        try {
            LocalDate deadline = LocalDate.parse(scholarship.getDeadline(), DateTimeFormatter.ISO_LOCAL_DATE);
            if (deadline.isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("The deadline for this scholarship has passed.");
            }
        } catch (Exception e) {
            // Ignore parse exception if date format is not ISO
        }

        String resumeLink = "";
        if (resume != null && !resume.isEmpty()) {
            try {
                // Upload to Cloudinary
                Map uploadResult = cloudinary.uploader().upload(resume.getBytes(), ObjectUtils.asMap(
                        "resource_type", "auto",
                        "folder", "researchhub/resumes"
                ));
                resumeLink = uploadResult.get("secure_url").toString();
            } catch (java.io.IOException e) {
                System.err.println("Cloudinary error: " + e.getMessage());
                // Fallback to local storage if Cloudinary is not configured correctly
                try {
                    String uploadDir = "uploads/resumes/";
                    java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir);
                    if (!java.nio.file.Files.exists(uploadPath)) {
                        java.nio.file.Files.createDirectories(uploadPath);
                    }
                    String originalName = resume.getOriginalFilename();
                    String fileExtension = originalName != null ? originalName.substring(originalName.lastIndexOf(".")) : ".pdf";
                    String fileName = user.getId() + "_" + System.currentTimeMillis() + fileExtension;
                    java.nio.file.Path filePath = uploadPath.resolve(fileName);
                    java.nio.file.Files.copy(resume.getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                    resumeLink = "/uploads/resumes/" + fileName;
                } catch (java.io.IOException ex) {
                    throw new RuntimeException("Could not store the file. Error: " + ex.getMessage());
                }
            }
        }

        Application application = Application.builder()
                .user(user)
                .scholarship(scholarship)
                .status("SUBMITTED")
                .statementOfPurpose(statementOfPurpose)
                .resumeLink(resumeLink)
                .build();

        application = applicationRepository.save(application);
        
        System.out.println("\n======================================================");
        System.out.println("📧 SIMULATED EMAIL SENT TO PROVIDER: " + scholarship.getProvider());
        System.out.println("Subject: New Application Received - " + scholarship.getTitle());
        System.out.println("Applicant: " + user.getName() + " (" + user.getEmail() + ")");
        System.out.println("Resume File Attached: " + resumeLink);
        System.out.println("Statement of Purpose:");
        System.out.println(statementOfPurpose);
        System.out.println("======================================================\n");

        return application;
    }

    public List<Application> getMyApplications(User user) {
        return applicationRepository.findByUserId(user.getId());
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }
}
