package com.neurofit.recommendation_service.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.neurofit.recommendation_service.model.Activity;
import com.neurofit.recommendation_service.model.Recommendation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ActivityRecommendationService {

    private final GeminiService geminiService;

    private static final Logger logger = LoggerFactory.getLogger(RecommendationService.class);

    public Recommendation generateRecommendation(Activity activity) {
        String prompt = createPromptForActivity(activity);
        String activityRecommendation = geminiService.getRecommendation(prompt);

        return processRecommendationResponse(activity, activityRecommendation);
    }

    private String createPromptForActivity(Activity activity) {
        return String.format("""
        Analyze this fitness activity and provide detailed recommendations in the following EXACT JSON format:
        {
            "analysis" : {
                "overall": "Overall analysis here",
                "pace": "Pace analysis here",
                "heartRate": "Heart rate analysis here",
                "caloriesBurned": "Calories analysis here"
            },
            "improvements": [
                {
                    "area": "Area name",
                    "recommendation": "Detailed recommendation"
                }
            ],
            "suggestions": [
                {
                    "workout": "Workout name",
                    "description": "Detailed workout description"
                }
            ],
            "safety": [
                "Safety point 1",
                "Safety point 2"
            ]
        }

        Analyze this activity:
        Activity Type: %s
        Duration: %d minutes
        Calories Burned: %d
        Additional Metrics: %s

        Provide detailed analysis focusing on performance, improvements, next workout suggestions, and safety guidelines.
        Ensure the response follows the EXACT JSON format shown above.
        """,
                activity.getActivityType(),
                activity.getDuration(),
                activity.getCaloriesBurned(),
                activity.getAdditionalMatrices()
        );
    }

    private Recommendation processRecommendationResponse(Activity activity, String activityRecommendation) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(activityRecommendation);

            JsonNode textNode = rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            String jsonContent = textNode.asText()
                    .replaceAll("```json\\n", "")
                    .replaceAll("\\n```", "")
                    .trim();


            // For analysis field
            JsonNode analysisJson = mapper.readTree(jsonContent);
            JsonNode analysisNode = analysisJson.path("analysis");

            StringBuilder fullAnalysis = new StringBuilder();
            addAnalysisSection(fullAnalysis, analysisNode, "overall", "Overall:");
            addAnalysisSection(fullAnalysis, analysisNode, "pace", "Pace:");
            addAnalysisSection(fullAnalysis, analysisNode, "heartRate", "Hear Rate:");
            addAnalysisSection(fullAnalysis, analysisNode, "caloriesBurned", "Calories:");

            // For Improvements field
            List<String> improvements = extractImprovements(analysisJson.path("improvements"));

            // For Suggestions field
            List<String> suggestions = extractSuggestions(analysisJson.path("suggestions"));

            // For Safety field
            List<String> safety = extractSafetyGuidelines(analysisJson.path("safety"));

            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .activityType(activity.getActivityType())
                    .recommendation(fullAnalysis.toString().trim())
                    .improvements(improvements)
                    .suggestions(suggestions)
                    .safety(safety)
                    .createdAt(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            logger.error("Error while generating AI-based recommendation for activity: {}", activity.getId(), e);
            return createDefaultRecommendation(activity);
        }
    }

    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode, String key, String prefix) {
        if (!analysisNode.path(key).isMissingNode()) {
            fullAnalysis.append(prefix)
                    .append(analysisNode.path(key).asText())
                    .append("\n\n");
        }
    }

    private List<String> extractImprovements(JsonNode improvementsNode) {
        List<String> improvements = new ArrayList<>();

        if (improvementsNode.isArray()) {
            improvementsNode.forEach(improvement -> {
                String area = improvement.path("area").asText();
                String detail = improvement.path("recommendation").asText();

                improvements.add(String.format("%s, %s", area, detail));
            });
        }

        return improvements.isEmpty() ?
                Collections.singletonList("No Specific improvements provided") :
                improvements;
    }

    private List<String> extractSuggestions(JsonNode suggestionsNode) {
        List<String> suggestions = new ArrayList<>();

        if (suggestionsNode.isArray()) {
            suggestionsNode.forEach(suggestion -> {
                String workout = suggestion.path("workout").asText();
                String description = suggestion.path("description").asText();

                suggestions.add(String.format("%s, %s", workout, description));
            });
        }

        return suggestions.isEmpty() ?
                Collections.singletonList("No Specific suggestions provided") :
                suggestions;
    }

    private List<String> extractSafetyGuidelines(JsonNode safetyNode) {
        List<String> safety = new ArrayList<>();

        if (safetyNode.isArray()) {
            safetyNode.forEach(item -> safety.add(item.asText()));
        }

        return safety.isEmpty() ?
                Collections.singletonList("No Specific safety guidelines provided") :
                safety;
    }

    private Recommendation createDefaultRecommendation(Activity activity) {

        Map<String, String> analysis = new HashMap<>();
        analysis.put("overall", "Unable to analyze this activity at the moment.");
        analysis.put("pace", "Pace data is not available.");
        analysis.put("heartRate", "Heart rate data could not be evaluated.");
        analysis.put("caloriesBurned", "Calorie data could not be interpreted.");


        return Recommendation.builder()
                .activityId(activity.getId())
                .userId(activity.getUserId())
                .activityType(activity.getActivityType())
                .recommendation(analysis.toString())
                .improvements(Collections.singletonList("General: Keep a consistent routine and maintain hydration."))
                .suggestions(Collections.singletonList("General Fitness: Try walking, light jogging, or stretching for 20–30 minutes daily. "))
                .safety(Arrays.asList(
                        "Start every session with dynamic warm-up stretches to prevent injury.",
                        "Drink plenty of water before, during, and after your workout.",
                        "Pay attention to any signs of fatigue or discomfort and adjust accordingly."
                ))
                .createdAt(LocalDateTime.now())
                .build();
    }

}
