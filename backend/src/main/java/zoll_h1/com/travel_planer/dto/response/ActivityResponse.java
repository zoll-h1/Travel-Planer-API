package zoll_h1.com.travel_planer.dto.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import zoll_h1.com.travel_planer.model.ActivityType;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class ActivityResponse {

    private Long id;
    private String name;
    private ActivityType type;
    private LocalDate activityDate;
    private BigDecimal cost;
    private String notes;
    private Long tripId;
}
