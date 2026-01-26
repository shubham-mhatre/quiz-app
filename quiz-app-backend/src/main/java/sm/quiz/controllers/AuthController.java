package sm.quiz.controllers;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sm.quiz.entities.dto.UserRequest;
import sm.quiz.entities.dto.UserResponse;
import sm.quiz.services.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
	
	private final AuthService authService;

	@PostMapping("/login")
    public UserResponse login(
            @RequestBody UserRequest request) {
        return authService.login(request);
    }

    
}
