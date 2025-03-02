package com.tus.DNSResolver.users_manager.controller;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.tus.DNSResolver.users_manager.model.ApiEndpoint;
import com.tus.DNSResolver.users_manager.service.ApiEndpointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.tus.DNSResolver.users_manager.dto.AuthRequest;
import com.tus.DNSResolver.users_manager.service.UserDetailsServiceImpl;
import com.tus.DNSResolver.users_manager.util.JwtUtil;

import com.tus.DNSResolver.users_manager.model.Role;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private ApiEndpointService apiEndpointService;
    
    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthRequest authRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new Exception("Incorrect username or password", e);
        }
        
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);
        
        // Extract roles as a List<String>
        List<String> roles = userDetails.getAuthorities().stream()
            .map(authority -> authority.getAuthority())
            .collect(Collectors.toList());
        
        // Build the basic authentication response
        Map<String, Object> response = new HashMap<>();
        response.put("jwt", jwt);
        response.put("username", userDetails.getUsername());
        response.put("roles", roles);
        
        // Retrieve all endpoints from the database
        List<ApiEndpoint> endpoints = apiEndpointService.getAllEndpoints();
        
        // If the user does NOT have the ADMIN role, filter endpoints to only include those that also allow TEACHER
        if (!roles.contains("ADMIN")) {
            endpoints = endpoints.stream()
                        .filter(ep -> ep.getRoles().contains(Role.TEACHER))
                        .collect(Collectors.toList());
        }
        
        // Build _links map using the endpoint's descriptive linkKey as the key
        Map<String, Object> links = new HashMap<>();
        for (ApiEndpoint endpoint : endpoints) {
            links.put(endpoint.getLinkKey(), new LinkDetail(endpoint.getMethod(), endpoint.getHref()));
        }
        response.put("_links", links);
        
        return ResponseEntity.ok(response);
    }
    
    // Simple DTO to encapsulate a link's HTTP method and URL
    public static class LinkDetail {
        private String method;
        private String href;
        
        public LinkDetail(String method, String href) {
            this.method = method;
            this.href = href;
        }
        
        public String getMethod() {
            return method;
        }
        
        public String getHref() {
            return href;
        }
    }
}
