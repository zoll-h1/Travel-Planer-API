package zoll_h1.com.travel_planer.dto.request;


import jakarta.validation.constraints.*;
import zoll_h1.com.travel_planer.model.TripStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.annotation.processing.SupportedAnnotationTypes;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTripRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Destination must not exceed 100 characters")
    private String title;

    @NotBlank(message = "Destination is required")
    @Size(max = 100, message = "Destination must not exceed 100 characters")
    private String destination;

    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date it required")
    private LocalDate endDate;

    @DecimalMin(value = "0.0" , inclusive = true, message = "Budget must be positive")
    @Digits(integer = 8, fraction = 2, message = "Budget must not have at most 8 digits and 2 decimal places")
    private BigDecimal budget;

    @NotNull(message = "Status is required")
    private TripStatus status;
}
