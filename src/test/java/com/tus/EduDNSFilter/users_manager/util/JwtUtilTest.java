package com.tus.EduDNSFilter.users_manager.util;


import static org.junit.jupiter.api.Assertions.*;

import java.util.Date;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

@SpringBootTest
public class JwtUtilTest {

    @Autowired
    private JwtUtil jwtUtil;

    @Test
    public void testGenerateTokenAndExtractUsername() {
        // Create a dummy user details instance
        UserDetails userDetails = User.withUsername("testuser")
                                      .password("password")
                                      .authorities("ADMIN")
                                      .build();

        // Generate token and extract username
        String token = jwtUtil.generateToken(userDetails);
        assertNotNull(token, "Token should not be null");
        String extractedUsername = jwtUtil.extractUsername(token);
        assertEquals("testuser", extractedUsername, "Extracted username should match");
    }

    @Test
    public void testValidateToken_Valid() {
        UserDetails userDetails = User.withUsername("testuser")
                                      .password("password")
                                      .authorities("ADMIN")
                                      .build();

        String token = jwtUtil.generateToken(userDetails);
        assertTrue(jwtUtil.validateToken(token, userDetails), "Token should be valid for the correct user");
    }

    @Test
    public void testValidateToken_InvalidUsername() {
        UserDetails userDetails = User.withUsername("testuser")
                                      .password("password")
                                      .authorities("ADMIN")
                                      .build();
        String token = jwtUtil.generateToken(userDetails);

        // Create a different user with another username
        UserDetails differentUser = User.withUsername("differentUser")
                                        .password("password")
                                        .authorities("ADMIN")
                                        .build();
        assertFalse(jwtUtil.validateToken(token, differentUser), "Token should not be valid for a different user");
    }

    @Test
    public void testExtractExpiration() {
        UserDetails userDetails = User.withUsername("testuser")
                                      .password("password")
                                      .authorities("ADMIN")
                                      .build();
        String token = jwtUtil.generateToken(userDetails);
        Date expiration = jwtUtil.extractAllClaims(token).getExpiration();
        assertNotNull(expiration, "Expiration date should not be null");
        
        // Calculate the difference between the expiration and current time.
        long diff = expiration.getTime() - System.currentTimeMillis();
        // Allowing a 5-second delta for processing delays.
        assertTrue(diff > JwtUtil.JWT_EXPIRATION_MS - 5000 && diff <= JwtUtil.JWT_EXPIRATION_MS,
                   "Expiration time should be roughly JWT_EXPIRATION_MS in the future");
    }

    @Test
    public void testExtractClaim() {
        UserDetails userDetails = User.withUsername("testuser")
                                      .password("password")
                                      .authorities("ADMIN")
                                      .build();
        String token = jwtUtil.generateToken(userDetails);
        // Use extractClaim to retrieve the subject (username)
        String subject = jwtUtil.extractClaim(token, claims -> claims.getSubject());
        assertEquals("testuser", subject, "The subject extracted from the token should be 'testuser'");
    }
}
