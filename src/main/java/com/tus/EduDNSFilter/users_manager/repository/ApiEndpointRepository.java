package com.tus.EduDNSFilter.users_manager.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;


import com.tus.EduDNSFilter.users_manager.model.ApiEndpoint;

public interface ApiEndpointRepository extends JpaRepository<ApiEndpoint, Long> {
    List<ApiEndpoint> findByApiGroup_GroupNameIn(List<String> groupNames);
}