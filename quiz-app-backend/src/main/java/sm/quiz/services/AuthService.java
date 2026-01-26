package sm.quiz.services;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sm.quiz.entities.AppUser;
import sm.quiz.entities.dto.UserRequest;
import sm.quiz.entities.dto.UserResponse;
import sm.quiz.repositories.AppUserRepository;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository userRepository;

    public UserResponse login(UserRequest request) {

    	UserResponse response = new UserResponse();

        AppUser user = userRepository
                .findByUsername(request.getUsername())
                .orElse(null);

        if (user == null) {
            response.setSuccess(false);
            response.setMessage("Invalid credentials");
            return response;
        }

        if (!user.getPassword().equals(request.getPassword())) {
            response.setSuccess(false);
            response.setMessage("Invalid credentials");
            return response;
        }

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            response.setSuccess(false);
            response.setMessage("User is inactive");
            return response;
        }

        response.setSuccess(true);
        response.setMessage("Login successful");
        response.setUserId(user.getUserId());
        response.setUsername(user.getUsername());
        response.setRole(user.getRole());

        return response;
    }
}
