package zoll_h1.com.travel_planer.dto.request;


import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class CreateTripRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Destination must not exceed 100 characters")
    private String title;

    @NotBlank(message = "Destination is required")
    @Size(max = 100, message = "Destination must not exceed 100 characters")
    private String destination;

    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;

    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date must be today or in the future")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    @Future(message = "End date must be in the future")
    private LocalDate endDate;

    @DecimalMin(value = "0.0", inclusive = true, message = "Budget must not be positive")
    @Digits(integer = 8, fraction = 2, message = "Budget must have at most 8 digits and 2 decimal places")
    private BigDecimal budget;
}
