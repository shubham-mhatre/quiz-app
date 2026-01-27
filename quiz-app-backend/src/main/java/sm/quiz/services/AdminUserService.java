package sm.quiz.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import sm.quiz.entities.AppUser;
import sm.quiz.entities.dto.UserRequest;
import sm.quiz.entities.dto.UserResponse;
import sm.quiz.repositories.AppUserRepository;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final AppUserRepository userRepository;

    @Transactional
    public UserResponse createUser(UserRequest request) {

        userRepository.findByUsername(request.getUsername())
                .ifPresent(u -> {
                    throw new IllegalArgumentException("Username already exists");
                });

        AppUser user = new AppUser();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword()); // plain text (as requested)
        user.setRole("USER");

        AppUser saved = userRepository.save(user);
        
        UserResponse savedResponse= new UserResponse();
        savedResponse.setUserId(saved.getUserId());
        savedResponse.setUsername(saved.getUsername());
        savedResponse.setRole(saved.getRole());
        
        return savedResponse;
    }

	public List<UserResponse> getAllUsers() {
		List<AppUser> users = userRepository.findAll(Sort.by(Sort.Direction.ASC, "userId"));

		List<UserResponse> userResponseList = users.stream().map(data -> {
			UserResponse userData = new UserResponse();
			userData.setUserId(data.getUserId());
			userData.setRole(data.getRole());
			userData.setUsername(data.getUsername());
			userData.setCreatedAt(data.getCreatedAt());
			return userData;
		}).collect(Collectors.toList());

		return userResponseList;
	}
}