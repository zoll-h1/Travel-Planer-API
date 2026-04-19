package zoll_h1.com.travel_planer.dto.response;

import zoll_h1.com.travel_planer.model.TripStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TripSummmaryResponse {
        private Long id;
        private String title;
        private String destination;
        private LocalDate startDate;
        private LocalDate endDate;
        private BigDecimal budget;
        private TripStatus status;

        private int activityCount;
        private BigDecimal totalCost;

}
