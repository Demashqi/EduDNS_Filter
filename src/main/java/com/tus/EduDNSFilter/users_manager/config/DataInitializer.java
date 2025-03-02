package com.tus.EduDNSFilter.users_manager.config;

import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.tus.EduDNSFilter.users_manager.model.ApiEndpoint;
import com.tus.EduDNSFilter.users_manager.model.ApiGroup;
import com.tus.EduDNSFilter.users_manager.model.Role;
import com.tus.EduDNSFilter.users_manager.model.User;
import com.tus.EduDNSFilter.users_manager.repository.ApiEndpointRepository;
import com.tus.EduDNSFilter.users_manager.repository.ApiGroupRepository;
import com.tus.EduDNSFilter.users_manager.repository.UserRepository;
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private ApiGroupRepository apiGroupRepository;
    
    @Autowired
    private ApiEndpointRepository apiEndpointRepository;
    
    private final String declareAdmin = "admin";
    
    @Override
    public void run(String... args) throws Exception {
        // Create admin user if not exists
        if (userRepository.findByUsername(declareAdmin).isEmpty()) {
            User admin = new User();
            admin.setUsername(declareAdmin);
            admin.setPassword(passwordEncoder.encode(declareAdmin));
            admin.setRoles(Set.of(Role.ADMIN, Role.TEACHER));
            userRepository.save(admin);
        }
        
        // Populate API groups and endpoints if not already present
        if (apiGroupRepository.count() == 0) {
            // --- Authentication Group (accessible to non-admin users) ---
            ApiGroup authGroup = new ApiGroup("Authentication");
            authGroup = apiGroupRepository.save(authGroup);
            // Login endpoint is allowed for non-admin (Role.TEACHER)
            ApiEndpoint loginEndpoint = new ApiEndpoint("POST", "/api/auth/login", "login", authGroup, Set.of(Role.TEACHER));
            apiEndpointRepository.save(loginEndpoint);
            
            // --- Domain Logs Group (admin-only) ---
            ApiGroup domainLogsGroup = new ApiGroup("Domain Logs");
            domainLogsGroup = apiGroupRepository.save(domainLogsGroup);
            ApiEndpoint getDomainLogs = new ApiEndpoint("GET", "/api/admin/domain-logs", "getDomainLogs", domainLogsGroup, Set.of(Role.ADMIN));
            ApiEndpoint deleteDomainLogs = new ApiEndpoint("DELETE", "/api/admin/domain-logs", "deleteDomainLogs", domainLogsGroup, Set.of(Role.ADMIN));
            ApiEndpoint deleteDomainLogById = new ApiEndpoint("DELETE", "/api/admin/domain-logs/{id}", "deleteDomainLogById", domainLogsGroup, Set.of(Role.ADMIN));
            apiEndpointRepository.save(getDomainLogs);
            apiEndpointRepository.save(deleteDomainLogs);
            apiEndpointRepository.save(deleteDomainLogById);
            
            // --- Admin Users Group (admin-only) ---
            ApiGroup adminUsersGroup = new ApiGroup("Admin Users");
            adminUsersGroup = apiGroupRepository.save(adminUsersGroup);
            ApiEndpoint registerUser = new ApiEndpoint("POST", "/api/admin/register", "registerUser", adminUsersGroup, Set.of(Role.ADMIN));
            ApiEndpoint getAllUsers = new ApiEndpoint("GET", "/api/admin/users", "getAllUsers", adminUsersGroup, Set.of(Role.ADMIN));
            ApiEndpoint deleteUserById = new ApiEndpoint("DELETE", "/api/admin/users/{id}", "deleteUserById", adminUsersGroup, Set.of(Role.ADMIN));
            ApiEndpoint updateUserById = new ApiEndpoint("PUT", "/api/admin/users/{id}", "updateUserById", adminUsersGroup, Set.of(Role.ADMIN));
            apiEndpointRepository.save(registerUser);
            apiEndpointRepository.save(getAllUsers);
            apiEndpointRepository.save(deleteUserById);
            apiEndpointRepository.save(updateUserById);
            
            // --- Blocklist Group (accessible to admin and teachers) ---
            ApiGroup blocklistGroup = new ApiGroup("Blocklist");
            blocklistGroup = apiGroupRepository.save(blocklistGroup);
            ApiEndpoint addBlockedDomain = new ApiEndpoint("POST", "/api/teacher/blocklist", "addBlockedDomain", blocklistGroup, Set.of(Role.TEACHER, Role.ADMIN));
            ApiEndpoint getBlockedDomains = new ApiEndpoint("GET", "/api/teacher/blocklist", "getBlockedDomains", blocklistGroup, Set.of(Role.TEACHER,Role.ADMIN));
            ApiEndpoint getBlockedDomainById = new ApiEndpoint("GET", "/api/teacher/blocklist/{id}", "getBlockedDomainById", blocklistGroup, Set.of(Role.TEACHER,Role.ADMIN));
            ApiEndpoint deleteBlockedDomainByName = new ApiEndpoint("DELETE", "/api/teacher/blocklist/name/{domain}", "deleteBlockedDomainByName", blocklistGroup, Set.of(Role.TEACHER,Role.ADMIN));
            apiEndpointRepository.save(addBlockedDomain);
            apiEndpointRepository.save(getBlockedDomains);
            apiEndpointRepository.save(getBlockedDomainById);
            apiEndpointRepository.save(deleteBlockedDomainByName);
        }
    }
}
