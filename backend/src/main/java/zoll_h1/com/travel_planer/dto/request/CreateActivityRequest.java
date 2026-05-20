package zoll_h1.com.travel_planer.dto.request;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import zoll_h1.com.travel_planer.model.ActivityType;

import java.math.BigDecimal;
import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CreateActivityRequest {
    @NotBlank(message = "Activity name is required")
    @Size(max = 100, message = "Activity name must not be exceed 100 characters")
    private String name;

    @NotNull(message = "Activity type is required")
    private ActivityType type;

    @NotNull(message = "Activity date is required")
    private LocalDate activityDate;

    @NotNull(message = "Cost is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Cost must be zero or positive")
    @Digits(integer = 8, fraction = 2, message = "Cost must have at most 8 digits and 2 decimal places")
    private BigDecimal cost;

    @Size(max = 5000, message = "Notes must not be exceed 5000 characters")
    private String notes;
}
