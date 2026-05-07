package zoll_h1.com.travel_planer.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import zoll_h1.com.travel_planer.dto.request.CreateActivityRequest;
import zoll_h1.com.travel_planer.dto.request.UpdateActivityRequest;
import zoll_h1.com.travel_planer.dto.response.ActivityResponse;
import zoll_h1.com.travel_planer.model.Activity;
import zoll_h1.com.travel_planer.model.Trip;
import zoll_h1.com.travel_planer.model.User;
import zoll_h1.com.travel_planer.repository.ActivityRepository;
import zoll_h1.com.travel_planer.repository.TripRepository;
import zoll_h1.com.travel_planer.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityServiceImpl implements ActivityService {

    private final ActivityRepository activityRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    @Autowired
    public ActivityServiceImpl(
            ActivityRepository activityRepository,
            TripRepository tripRepository,
            UserRepository userRepository
    ) {
        this.activityRepository = activityRepository;
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ActivityResponse addActivity(Long tripId, CreateActivityRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Trip trip = tripRepository.findByIdAndUserId(tripId, user.getId())
                .orElseThrow(() -> new RuntimeException("Trip not found or access denied"));

        // Creation of a new Activity
        Activity activity = new Activity();
        activity.setName(request.getName());
        activity.setType(request.getType());
        activity.setActivityDate(request.getActivityDate());
        activity.setCost(request.getCost());
        activity.setNotes(request.getNotes());
        activity.setTrip(trip); // Linking to the trip

        Activity saved = activityRepository.save(activity);

        return mapToActivityResponse(saved);
    }

    @Override
    public List<ActivityResponse> getAllActivities(Long tripId, String userEmail) {
     User user = userRepository.findByEmail(userEmail)
             .orElseThrow(() -> new RuntimeException("User not found"));

     Trip trip = tripRepository.findByIdAndUserId(tripId, user.getId())
             .orElseThrow(() -> new RuntimeException("Trip not found or access denied"));

     // Getting all activities for this trip
     List<Activity> activities = activityRepository.findByTripId(tripId);

     return activities.stream()
             .map(this::mapToActivityResponse)
             .collect(Collectors.toList());
    }

    @Override
    public ActivityResponse getActivityById(Long tripId, Long activityId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Trip trip = tripRepository.findByIdAndUserId(tripId, user.getId())
                .orElseThrow(() -> new RuntimeException("Trip not found or access denied"));

        Activity activity = activityRepository.findByIdAndTripId(activityId, tripId)
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        return mapToActivityResponse(activity);
    }

    @Override
    public ActivityResponse updateActivity(Long tripId, Long activityId, UpdateActivityRequest request, String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Trip trip = tripRepository.findByIdAndUserId(tripId, user.getId())
                .orElseThrow(() -> new RuntimeException("Trip not found or access denied"));

        Activity activity = activityRepository.findByIdAndTripId(activityId, tripId)
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        // Updating fields(only if provided in request)
        if(request.getName() != null) {
            activity.setName(request.getName());
        }
        if(request.getType() != null) {
            activity.setType(request.getType());
        }
        if(request.getActivityDate() != null) {
            activity.setActivityDate(request.getActivityDate());
        }
        if(request.getCost() != null) {
            activity.setCost(request.getCost());
        }
        if(request.getNotes() != null) {
            activity.setNotes(request.getNotes());
        }

        Activity updated = activityRepository.save(activity);

        return mapToActivityResponse(updated);
    }
    @Override
    public void deleteActivity(Long tripId, Long activityId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Trip trip = tripRepository.findByIdAndUserId(tripId, user.getId())
                .orElseThrow(() -> new RuntimeException("Trip not found or access denied"));

        Activity activity = activityRepository.findByIdAndTripId(activityId, tripId)
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        activityRepository.delete(activity);
    }
    // Helper : Convert Activity entity to ActivityResponse DTO
    private ActivityResponse mapToActivityResponse(Activity activity) {
        return new ActivityResponse(
                activity.getId(),
                activity.getName(),
                activity.getType(),
                activity.getActivityDate(),
                activity.getCost(),
                activity.getNotes(),
                activity.getTrip().getId()
        );
    }


}
