package com.researchhub.backend.dto;
import lombok.Data;
import java.util.UUID;

@Data
public class ApplicationRequest {
    private UUID scholarshipId;
    private String statementOfPurpose;
    private String resumeLink;
}
