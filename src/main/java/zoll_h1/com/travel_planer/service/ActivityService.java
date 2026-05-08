package zoll_h1.com.travel_planer.service;


import zoll_h1.com.travel_planer.dto.request.CreateActivityRequest;
import zoll_h1.com.travel_planer.dto.request.UpdateActivityRequest;
import zoll_h1.com.travel_planer.dto.response.ActivityResponse;
import zoll_h1.com.travel_planer.model.Activity;

import java.util.List;

public interface ActivityService {
    ActivityResponse addActivity(Long tripId, CreateActivityRequest request, String userEmail);

    List<ActivityResponse> getAllActivities(Long tripId, String userEmail);

    ActivityResponse getActivityById(Long tripId, Long activityId, String userEmail);

    ActivityResponse updateActivity(Long tripId, Long activityId, UpdateActivityRequest request, String userEmail);

    void deleteActivity(Long tripId, Long activityId, String userEmail);
}
