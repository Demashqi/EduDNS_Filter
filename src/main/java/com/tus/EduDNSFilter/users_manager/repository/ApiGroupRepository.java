package com.tus.EduDNSFilter.users_manager.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tus.EduDNSFilter.users_manager.model.ApiGroup;

public interface ApiGroupRepository extends JpaRepository<ApiGroup, Long> {
}
