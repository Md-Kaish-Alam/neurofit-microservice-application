package com.neurofit.user_service.service;

import com.neurofit.user_service.dto.RegisterRequest;
import com.neurofit.user_service.dto.UserResponse;
import com.neurofit.user_service.model.User;
import com.neurofit.user_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private static UserResponse getUserResponse(User responseUser) {
        UserResponse userResponse = new UserResponse();
        userResponse.setId(responseUser.getId());
        userResponse.setKeycloakId(responseUser.getKeycloakId());
        userResponse.setEmail(responseUser.getEmail());
        userResponse.setPassword(responseUser.getPassword());
        userResponse.setFirstName(responseUser.getFirstName());
        userResponse.setLastName(responseUser.getLastName());
        userResponse.setCreatedAt(responseUser.getCreatedAt());
        userResponse.setUpdatedAt(responseUser.getUpdatedAt());
        return userResponse;
    }

    public UserResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())){
            User existingUser = userRepository.findByEmail(request.getEmail());
            return getUserResponse(existingUser);
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setKeycloakId(request.getKeycloakId());
        user.setPassword(request.getPassword());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        User savedUser = userRepository.save(user);

        return getUserResponse(savedUser);
    }

    public UserResponse getUserProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        return getUserResponse(user);
    }

    public Boolean existsByUserId(String userId) {
        return userRepository.existsByKeycloakId(userId);
    }
}
