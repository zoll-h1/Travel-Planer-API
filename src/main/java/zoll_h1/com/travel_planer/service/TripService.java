package zoll_h1.com.travel_planer.service;

import zoll_h1.com.travel_planer.dto.request.CreateTripRequest;
import zoll_h1.com.travel_planer.dto.request.UpdateTripRequest;
import zoll_h1.com.travel_planer.dto.response.TripResponse;
import zoll_h1.com.travel_planer.dto.response.TripSummaryResponse;
import zoll_h1.com.travel_planer.model.TripStatus;

import java.util.List;
import java.util.Map;

public interface TripService {

    TripResponse createTrip(CreateTripRequest request, String userEmail);

    List<TripSummaryResponse> getAllMyTrips(String userEmail, TripStatus status);
    //Get a single trip by I
    TripResponse getTripById(Long tripId, String userEmail);
    //Update a trip
    TripResponse updateTrip(Long tripId, UpdateTripRequest request, String userEmail);

    void deleteTrip(Long tripId, String userEmail);

    List<TripSummaryResponse> getUpcomingTrips(String userEmail);

    Map<String, Object> getTripStats(String userEmail);

}
