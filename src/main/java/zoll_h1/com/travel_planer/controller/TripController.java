package zoll_h1.com.travel_planer.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import zoll_h1.com.travel_planer.dto.request.CreateTripRequest;
import zoll_h1.com.travel_planer.dto.request.UpdateTripRequest;
import zoll_h1.com.travel_planer.dto.response.TripResponse;
import zoll_h1.com.travel_planer.dto.response.TripSummaryResponse;
import zoll_h1.com.travel_planer.model.TripStatus;
import zoll_h1.com.travel_planer.service.TripService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips")
@Tag(name = "Trips", description = "CRUD operations for travel trips, upcoming trips, and statistics")
@SecurityRequirement(name = "bearerAuth")
public class TripController {
    private final TripService tripService;

    @Autowired
    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TripResponse createTrip(@Valid @RequestBody CreateTripRequest request, Authentication authentication) {
        String email = authentication.getName();
        return tripService.createTrip(request, email);
    }

    @GetMapping
    public List<TripSummaryResponse> getAllMyTrips(@RequestParam(required = false) TripStatus status,
                                                   Authentication authentication) {
        String email = authentication.getName();
        return tripService.getAllMyTrips(email, status);
    }

    @GetMapping("/{id}")
    public TripResponse getTripById(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        return tripService.getTripById(id, email);
    }

    @PutMapping("/{id}")
    public TripResponse updateTrip(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTripRequest request,
            Authentication authentication
            ) {
        String email = authentication.getName();
        return tripService.updateTrip(id, request, email);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTrip(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String email = authentication.getName();
        tripService.deleteTrip(id, email);
    }
    @GetMapping("/upcoming")
    public List<TripSummaryResponse> getUpcomingTrips(Authentication authentication) {
        String email = authentication.getName();
        return tripService.getUpcomingTrips(email);
    }

    @GetMapping("/stats")
    public Map<String, Object> getTripStats(Authentication authentication) {
        String email = authentication.getName();
        return tripService.getTripStats(email);
    }

}
