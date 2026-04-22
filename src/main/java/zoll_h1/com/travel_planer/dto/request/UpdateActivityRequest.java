package zoll_h1.com.travel_planer.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateActivityRequest {

    @NotBlank(message = "Activity name is required")
    @Size(max = 100, message = "Activity name must now exceed 100 characters")
    private String name;

    @NotNull(message = "Activity date is required")
    private LocalDate activityDate;
}
