package com.condoncorp.photo_king_backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.moderation.ModerationPrompt;
import org.springframework.ai.moderation.ModerationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ImageModerationService {

    private final ObjectMapper objectMapper = new ObjectMapper();


    private final String API_URL = "https://api.openai.com/v1/moderations";

    @Value("${spring.ai.openai.api-key}")
    private String API_KEY;

    public boolean moderateImage(String imageUrl) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();

        // Build multimodal input
        Map<String, Object> imageMap = new HashMap<>();
        imageMap.put("type", "image_url");
        imageMap.put("image_url", Map.of("url", imageUrl));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "omni-moderation-latest");
        requestBody.put("input", List.of(imageMap));

        // Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(API_KEY);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        // Send request
        ResponseEntity<String> response = restTemplate.exchange(
                API_URL,
                HttpMethod.POST,
                entity,
                String.class
        );

        // Parse response
        Map<String, Object> responseMap = objectMapper.readValue(response.getBody(), Map.class);
        List<Map<String, Object>> results = (List<Map<String, Object>>) responseMap.get("results");

        for (Map<String, Object> result : results) {
            Boolean flagged = (Boolean) result.get("flagged");
            if (flagged != null && flagged) {
                return true; // flagged
            }
        }
        return false; // not flagged
    }


}
