package com.researchhub.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    public String checkEligibility(Double cgpa, String degree, String country, String researchInterest) {
        String prompt = String.format("Analyze the eligibility for international scholarships for a student with CGPA %s, Degree %s, from %s, interested in %s. Suggest 3 specific scholarships and explain reasoning.", cgpa, degree, country, researchInterest);
        return callGeminiApi(prompt);
    }

    public String generateProposal(String topic, String abstractText) {
        String prompt = String.format("Generate a structured research proposal and a roadmap for the topic '%s' with the following abstract: '%s'.", topic, abstractText);
        return callGeminiApi(prompt);
    }

    private String callGeminiApi(String prompt) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> contents = new HashMap<>();
            Map<String, Object> parts = new HashMap<>();
            
            parts.put("text", prompt);
            contents.put("parts", List.of(parts));
            requestBody.put("contents", List.of(contents));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            String url = apiUrl + "?key=" + apiKey;
            Map response = restTemplate.postForObject(url, entity, Map.class);
            
            // Return raw response toString for demonstration. A proper DTO mapping is recommended in production.
            return response != null ? response.toString() : "No response from Gemini API"; 
        } catch (Exception e) {
            return "Error calling Gemini API: " + e.getMessage();
        }
    }
}
