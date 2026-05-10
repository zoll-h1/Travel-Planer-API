package zoll_h1.com.travel_planer.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import zoll_h1.com.travel_planer.dto.request.CreateActivityRequest;
import zoll_h1.com.travel_planer.dto.request.UpdateActivityRequest;
import zoll_h1.com.travel_planer.dto.response.ActivityResponse;
import zoll_h1.com.travel_planer.service.ActivityService;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/activities")
@Tag(name = "Activities", description = "CRUD operations for trip activities")
@SecurityRequirement(name = "bearerAuth")
public class ActivityController {

    private final ActivityService activityService;

    @Autowired
    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ActivityResponse addActivity(
            @PathVariable Long tripId,
            @Valid @RequestBody CreateActivityRequest request,
            Authentication authentication
            ) {
        String email = authentication.getName();
        return activityService.addActivity(tripId, request, email);
    }

    @GetMapping
    public List<ActivityResponse> getAllActivities(@PathVariable Long tripId, Authentication authentication) {
        String email = authentication.getName();
        return activityService.getAllActivities(tripId, email);
    }

    @GetMapping("/{activityId}")
    public ActivityResponse getActivityById(@PathVariable Long tripId, @PathVariable Long activityId, Authentication authentication) {
        String email = authentication.getName();
        return activityService.getActivityById(tripId, activityId, email);
    }

    @PutMapping("/{activityId}")
    public ActivityResponse updateActivity(@PathVariable Long tripId, @PathVariable Long activityId, @Valid @RequestBody UpdateActivityRequest request, Authentication authentication) {
        String email = authentication.getName();
        return activityService.updateActivity(tripId, activityId, request, email);
    }

    @DeleteMapping("/{activityId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteActivity(@PathVariable Long tripId, @PathVariable Long activityId, Authentication authentication) {
        String email = authentication.getName();

        activityService.deleteActivity(tripId, activityId, email);
    }

}
