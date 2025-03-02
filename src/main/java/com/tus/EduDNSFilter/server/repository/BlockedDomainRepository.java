package com.tus.EduDNSFilter.server.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.tus.EduDNSFilter.server.model.BlockedDomain;

import java.util.Optional;

public interface BlockedDomainRepository extends JpaRepository<BlockedDomain, Long> {
    Optional<BlockedDomain> findByDomain(String domain);
}
