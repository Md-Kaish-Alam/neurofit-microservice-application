package com.neurofit.gateway.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Email is required.")
    @Email(message = "Invalid Email.")
    private String email;

    private String keycloakId;

    @NotBlank(message = "Password is required.")
    @Size(min = 6, message = "Password must be at least 6 characters.")
    private String password;

    @NotBlank(message = "Fist Name is required.")
    private String firstName;

    @NotBlank(message = "Last Name is required.")
    private String lastName;

}
