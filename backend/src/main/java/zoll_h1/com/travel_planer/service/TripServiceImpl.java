package zoll_h1.com.travel_planer.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import zoll_h1.com.travel_planer.dto.request.CreateTripRequest;
import zoll_h1.com.travel_planer.dto.request.UpdateTripRequest;
import zoll_h1.com.travel_planer.dto.response.ActivityResponse;
import zoll_h1.com.travel_planer.dto.response.TripResponse;
import zoll_h1.com.travel_planer.dto.response.TripSummaryResponse;
import zoll_h1.com.travel_planer.exception.ForbiddenException;
import zoll_h1.com.travel_planer.exception.ResourceNotFoundException;
import zoll_h1.com.travel_planer.exception.UnauthorizedException;
import zoll_h1.com.travel_planer.exception.ValidationException;
import zoll_h1.com.travel_planer.model.Activity;
import zoll_h1.com.travel_planer.model.Trip;
import zoll_h1.com.travel_planer.model.TripStatus;
import zoll_h1.com.travel_planer.model.User;
import zoll_h1.com.travel_planer.repository.TripRepository;
import zoll_h1.com.travel_planer.repository.UserRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TripServiceImpl implements TripService{

    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    @Autowired
    public TripServiceImpl (TripRepository tripRepository, UserRepository userRepository) {
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }

    @Override
    public TripResponse createTrip(CreateTripRequest request, String userEmail) {
        if(request.getStartDate().isAfter(request.getEndDate())) {
            throw new ValidationException("Start date must be before end date");
        }
        // Finding the authenticated user
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        // Create new Trip
        Trip trip = new Trip();
        trip.setTitle(request.getTitle());
        trip.setDestination(request.getDestination());
        trip.setDescription(request.getDescription());
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setBudget(request.getBudget());
        trip.setStatus(TripStatus.PLANNED);
        trip.setUser(user);

        Trip saved = tripRepository.save(trip);

        return mapToTripResponse(saved);
    }

    @Override
    public List<TripSummaryResponse> getAllMyTrips(String userEmail, TripStatus status) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        // Get trips
        List<Trip> trips;
        if(status != null) {
            // Filter by status
            trips = tripRepository.findByUserIdAndStatus(user.getId(), status);
        } else {
            trips = tripRepository.findByUserId(user.getId());
        }
        return trips.stream()
                .map(this::mapToTripSummaryResponse)
                .collect(Collectors.toList());
    }
    @Override
    public TripResponse getTripById(Long tripId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Trip trip = tripRepository.findByIdAndUserId(tripId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found or access denied"));
         if(!trip.getUser().getId().equals(user.getId())) {
             throw new ForbiddenException("You are not allowed to access trip trip");
         }
        return mapToTripResponse(trip);


    }
    @Override
    public TripResponse updateTrip(Long tripId, UpdateTripRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Trip trip = tripRepository.findByIdAndUserId(tripId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found or access denied"));

        if(request.getStartDate() != null && request.getEndDate() != null) {
            if(request.getStartDate().isAfter(request.getEndDate())) {
                throw new ValidationException("Start date must be before end date");
            }
        }
        if(!trip.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You are not allowed to access to this trip");
        }
        if(request.getTitle() != null) {
            trip.setTitle(request.getTitle());
        }
        if(request.getDestination() != null) {
            trip.setDestination(request.getDestination());
        }
        if(request.getDescription() != null){
            trip.setDescription(request.getDescription());
        }
        if(request.getStartDate() != null) {
            trip.setStartDate(request.getStartDate());
        }
        if(request.getEndDate() != null) {
            trip.setEndDate(request.getEndDate());
        }
        if(request.getBudget() != null) {
            trip.setBudget(request.getBudget());
        }
        if(request.getStatus() != null) {
            trip.setStatus(request.getStatus());
        }
        Trip updated = tripRepository.save(trip);

        return mapToTripResponse(updated);
    }
    @Override
    public void deleteTrip(Long tripId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Trip trip = tripRepository.findByIdAndUserId(tripId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found or access denied"));

        if(!trip.getUser().getId().equals(user.getId())){
            throw new ForbiddenException("You are not allowed to this trip");
        }
        tripRepository.delete(trip);
    }
    @Override
    public List<TripSummaryResponse> getUpcomingTrips(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Trip> upcomingTrips = tripRepository.findUpcomingTripsByUserId(user.getId(), LocalDate.now());

        return upcomingTrips.stream()
                .map(this::mapToTripSummaryResponse)
                .collect(Collectors.toList());
    }
    @Override
    public Map<String , Object> getTripStats(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Trip> allTrips = tripRepository.findByUserId(user.getId());

        long totalTrips = allTrips.size();

        BigDecimal totalBudget = allTrips.stream()
                .map(Trip::getBudget)
                .filter(budget -> budget != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalActivityCost = allTrips
                .stream()
                .flatMap(trip -> trip.getActivities().stream())
                .map(Activity::getCost)
                .filter(cost -> cost != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long plannedCount = allTrips.stream()
                .filter(t -> t.getStatus() == TripStatus.PLANNED)
                .count();

        long ongoingCount = allTrips.stream()
                .filter(t -> t.getStatus() == TripStatus.ONGOING)
                .count();

        long completedCount = allTrips.stream()
                .filter(t -> t.getStatus() == TripStatus.COMPLETED)
                .count();

        long cancelledCount = allTrips.stream()
                .filter(t -> t.getStatus() == TripStatus.CANCELLED)
                .count();

        Map<String , Object> stats = new HashMap<>();
        stats.put("totalTrips", totalTrips);
        stats.put("totalBudget", totalBudget);
        stats.put("totalCost", totalActivityCost);
        stats.put("plannedCount", plannedCount);
        stats.put("ongoingCount", ongoingCount);
        stats.put("completedCount", completedCount);
        stats.put("cancelledCount", cancelledCount);

        return stats;
    }
    // Helper: Convert Trip entity to TripResponse DTO
    private TripResponse mapToTripResponse(Trip trip) {
        List<ActivityResponse> activities = trip.getActivities().stream()
                .map(this::mapToActivityResponse)
                .collect(Collectors.toList());

        return new TripResponse(
                trip.getId(),
                trip.getTitle(),
                trip.getDestination(),
                trip.getDescription(),
                trip.getStartDate(),
                trip.getEndDate(),
                trip.getBudget(),
                trip.getStatus(),
                trip.getUser().getId(),
                trip.getCreatedAt(),
                activities
        );
    }
    // Helper: Convert Activity entity to ActivityResponse DTO
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

    // Helper: Convert Trip entity to TripSummaryResponse DTO (no activities)
    private TripSummaryResponse mapToTripSummaryResponse(Trip trip) {
        int activityCount = trip.getActivities().size();
        BigDecimal totalCost = trip.getActivities().stream()
                .map(Activity::getCost)
                .filter(cost -> cost != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return new TripSummaryResponse(
                trip.getId(),
                trip.getTitle(),
                trip.getDestination(),
                trip.getStartDate(),
                trip.getEndDate(),
                trip.getBudget(),
                trip.getStatus(),
                activityCount,
                totalCost
        );
    }

}
