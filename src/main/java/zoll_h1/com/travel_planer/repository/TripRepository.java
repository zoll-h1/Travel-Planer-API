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
public interface TripRepository extends JpaRepository<Trip, Long>{
    List<Trip> findByUserId(Long userId);

    List<Trip> findByUserIdAndStatus(Long userId, TripStatus status);

    Optional<Trip> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT t FROM Trip t WHERE t.user.id = :userId AND t.startDate > :currentDate ORDER BY t.startDate ASC")
    List<Trip> findUpcomingTripsByUserId(@Param("userId") Long userId, @Param("currentDate") LocalDate currentDate);

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, TripStatus status);
}
