package com.tus.DNSResolver.users_manager.service;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.tus.DNSResolver.users_manager.model.ApiEndpoint;
import com.tus.DNSResolver.users_manager.repository.ApiEndpointRepository;

@Service
public class ApiEndpointService {

    @Autowired
    private ApiEndpointRepository apiEndpointRepository;

    public List<ApiEndpoint> getAllEndpoints() {
        return apiEndpointRepository.findAll();
    }

    public List<ApiEndpoint> getEndpointsByGroupNames(List<String> groupNames) {
        return apiEndpointRepository.findByApiGroup_GroupNameIn(groupNames);
    }
}
