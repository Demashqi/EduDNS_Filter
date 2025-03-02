package com.tus.EduDNSFilter.server.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.tus.EduDNSFilter.server.model.DomainLog;
import com.tus.EduDNSFilter.server.repository.DomainLogRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DomainLogService {

    private final DomainLogRepository domainLogRepository;

    public DomainLogService(DomainLogRepository domainLogRepository) {
        this.domainLogRepository = domainLogRepository;
    }

    public void logDomain(String domain, boolean blocked) {
        DomainLog domainLog = new DomainLog(domain, blocked, LocalDateTime.now());
        domainLogRepository.save(domainLog);
    }

    public List<DomainLog> getLogsForLast7Days() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        return domainLogRepository.findByTimestampAfter(sevenDaysAgo);
    }

    @Scheduled(cron = "0 0 0 * * ?") // This cron expression means every day at midnight
    public void deleteOldLogs() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        domainLogRepository.deleteByTimestampBefore(sevenDaysAgo);
    }

    // New method to delete logs on demand
    public void deleteLogs() {
        domainLogRepository.deleteAll();
    }

    // New method to delete a specific log by ID
    public void deleteLogById(Long id) {
        if (domainLogRepository.existsById(id)) {
            domainLogRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Log with ID " + id + " does not exist");
        }
    }
}
