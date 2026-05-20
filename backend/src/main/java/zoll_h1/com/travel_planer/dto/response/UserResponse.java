package zoll_h1.com.travel_planer.dto.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
        private Long id;
        private String username;
        private String email;
        private String bio;
        private String avatarUrl;
        private String travelPreferences;
        private LocalDateTime createdAt;
}
