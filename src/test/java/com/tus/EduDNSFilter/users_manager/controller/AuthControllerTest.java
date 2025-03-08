package com.tus.EduDNSFilter.users_manager.controller;

import com.tus.EduDNSFilter.users_manager.service.UserDetailsServiceImpl;
import com.tus.EduDNSFilter.users_manager.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @MockBean
    private JwtUtil jwtUtil;

    @Test
    void login_Success() throws Exception {
        // Prepare a mock user details object for successful login
        String username = "testuser";
        String password = "password123";
        UserDetails userDetails = User.withUsername(username)
                                      .password(password)
                                      .authorities("ADMIN")
                                      .build();

        // Mock the service to load the user details
        when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);
        
        // Mock the JWT token generation
        String jwtToken = "fake-jwt-token";
        when(jwtUtil.generateToken(userDetails)).thenReturn(jwtToken);

        // Prepare the request JSON
        String jsonRequest = "{ \"username\": \"" + username + "\", \"password\": \"" + password + "\" }";

        // Perform the login request and assert the response
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.jwt").value(jwtToken));  // Assert that the JWT is returned in the response

        // Verify that the authenticate method was called once
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void login_Failure_InvalidCredentials() throws Exception {
        // Prepare request data with invalid credentials
        String username = "testuser";
        String password = "wrongpassword";
        String jsonRequest = "{ \"username\": \"" + username + "\", \"password\": \"" + password + "\" }";

        // Mock the authenticationManager to throw BadCredentialsException for invalid credentials
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Incorrect username or password"));

        // Perform the login request and assert the response
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isUnauthorized()); // Expect 401 Unauthorized for invalid credentials

        // Verify that authenticationManager.authenticate was called
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }
}
