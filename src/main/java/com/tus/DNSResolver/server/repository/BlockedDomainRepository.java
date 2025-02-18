package com.tus.DNSResolver.server.repository;


import com.tus.DNSResolver.server.model.BlockedDomain;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BlockedDomainRepository extends JpaRepository<BlockedDomain, Long> {
    Optional<BlockedDomain> findByDomain(String domain);
}
