package com.tus.DNSResolver.users_manager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tus.DNSResolver.users_manager.model.ApiGroup;

public interface ApiGroupRepository extends JpaRepository<ApiGroup, Long> {
}
