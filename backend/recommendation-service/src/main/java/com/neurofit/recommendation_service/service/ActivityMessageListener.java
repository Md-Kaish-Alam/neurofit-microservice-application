package com.neurofit.recommendation_service.service;

import com.neurofit.recommendation_service.model.Activity;
import com.neurofit.recommendation_service.model.Recommendation;
import com.neurofit.recommendation_service.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActivityMessageListener {

    private final RecommendationRepository recommendationRepository;

    private final ActivityRecommendationService activityRecommendationService;

    @RabbitListener(queues = "activity.queue")
    public void processActivity(Activity activity) {
        Recommendation recommendation = activityRecommendationService.generateRecommendation(activity);
        recommendationRepository.save(recommendation);
    }

}
