package zoll_h1.com.travel_planer.dto.response;

import jdk.jfr.DataAmount;
import zoll_h1.com.travel_planer.model.TripStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TripResponse {

    private Long id;
    private String title;
    private String destination;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal budget;
    private TripStatus status;
    private Long userId;
    private LocalDateTime createdAt;

    private List<ActivityResponse> activities;
}
