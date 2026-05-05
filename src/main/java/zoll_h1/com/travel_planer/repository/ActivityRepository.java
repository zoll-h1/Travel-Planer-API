package zoll_h1.com.travel_planer.repository;

import zoll_h1.com.travel_planer.model.Activity;
import zoll_h1.com.travel_planer.model.ActivityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.swing.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByTripId(Long tripId);

    Optional<Activity> findByIdAndTripId(long id, Long tripId);

    List<Activity> findByIdAndType(Long tripId, ActivityType type);

    @Query("SELECT COALESCE(SUM(a.cost), 0) FROM Activity a WHERE a.trip.id = :tripId")
    BigDecimal calculateTotalCost(@Param("tripId") Long tripId);

    long countByTripId(Long tripId);
}
