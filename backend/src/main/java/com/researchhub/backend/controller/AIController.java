package com.researchhub.backend.controller;

import com.researchhub.backend.service.GeminiService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AIController {

    private final GeminiService geminiService;

    @PostMapping("/check-eligibility")
    public ResponseEntity<Map<String, String>> checkEligibility(@RequestBody EligibilityRequest request) {
        String response = geminiService.checkEligibility(request.getCgpa(), request.getDegree(), request.getCountry(), request.getResearchInterest());
        return ResponseEntity.ok(Map.of("result", response));
    }

    @PostMapping("/generate-proposal")
    public ResponseEntity<Map<String, String>> generateProposal(@RequestBody ProposalRequest request) {
        String response = geminiService.generateProposal(request.getTopic(), request.getAbstractText());
        return ResponseEntity.ok(Map.of("proposal", response));
    }
}

@Data
class EligibilityRequest {
    private Double cgpa;
    private String degree;
    private String country;
    private String researchInterest;
}

@Data
class ProposalRequest {
    private String topic;
    private String abstractText;
}
