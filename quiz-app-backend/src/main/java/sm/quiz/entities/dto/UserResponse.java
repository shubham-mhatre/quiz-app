package sm.quiz.entities.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponse {

    private Long userId;
    private String username;
    private String role;
    
    private boolean success;
    private String message;
}
