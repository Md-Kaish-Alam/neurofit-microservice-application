package com.neurofit.recommendation_service.model;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class Activity {

    private String id;
    private String userId;
    private Integer duration;
    private Integer caloriesBurned;
    private LocalDateTime startTime;
    private Map<String, Object> additionalMatrices;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
