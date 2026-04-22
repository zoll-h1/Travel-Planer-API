package zoll_h1.com.travel_planer.repository;

import zoll_h1.com.travel_planer.model.Trip;
import zoll_h1.com.travel_planer.model.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

@Repository
public interface TripRepository {
    List<Trip> findByUserId(Long userId);

    List<Trip> findByUserIdAndStatus(Long userId, TripStatus status);

    Optional<Trip> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT t FROM trip WHERE t.user.id = :user.Id AND t.startDate > :currenDate ORDER BY t.startDAte ASC")
    List<Trip> finIdUpcomingTrips(@Param("user_id") Long userId, @Param("currentDate") LocalDate currentDate);

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, TripStatus status);
}
