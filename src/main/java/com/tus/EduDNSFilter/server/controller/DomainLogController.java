package com.tus.EduDNSFilter.server.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tus.EduDNSFilter.server.model.DomainLog;
import com.tus.EduDNSFilter.server.service.DomainLogService;

import java.util.List;

@RestController
@PreAuthorize("hasAuthority('ADMIN')")
@RequestMapping("/api/admin")
public class DomainLogController {

    private final DomainLogService domainLogService;

    public DomainLogController(DomainLogService domainLogService) {
        this.domainLogService = domainLogService;
    }

    @GetMapping("/domain-logs")
    public List<DomainLog> getDomainLogs() {
        return domainLogService.getLogsForLast7Days();
    }


    // Endpoint to delete all logs and return OK status
    @DeleteMapping("/domain-logs")
    public ResponseEntity<String> deleteLogs() {
        domainLogService.deleteLogs();
        return new ResponseEntity<>("All logs have been deleted.", HttpStatus.NO_CONTENT);
    }

     // Endpoint to delete a log by ID
    @DeleteMapping("/domain-logs/{id}")
    public ResponseEntity<Void> deleteDomainLog(@PathVariable Long id) {
        try {
            domainLogService.deleteLogById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
