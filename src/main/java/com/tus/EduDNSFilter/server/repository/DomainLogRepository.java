package com.tus.EduDNSFilter.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tus.EduDNSFilter.server.model.DomainLog;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DomainLogRepository extends JpaRepository<DomainLog, Long> {
    
    // Find logs within the last 7 days
    List<DomainLog> findByTimestampAfter(LocalDateTime timestamp);

    // Delete logs older than 7 days
    void deleteByTimestampBefore(LocalDateTime timestamp);
}
