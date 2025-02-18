package com.tus.DNSResolver.server.controller;

import com.tus.DNSResolver.server.service.DomainLogService;
import com.tus.DNSResolver.server.model.DomainLog;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class DomainLogController {

    private final DomainLogService domainLogService;

    public DomainLogController(DomainLogService domainLogService) {
        this.domainLogService = domainLogService;
    }

    @GetMapping("/api/admin/domain-logs")
    public List<DomainLog> getDomainLogs() {
        return domainLogService.getLogsForLast7Days();
    }


    // Endpoint to delete all logs and return OK status
    @DeleteMapping("/api/admin/domain-logs")
    public ResponseEntity<String> deleteLogs() {
        domainLogService.deleteLogs();
        return new ResponseEntity<>("All logs have been deleted.", HttpStatus.OK);
    }

     // Endpoint to delete a log by ID
    @DeleteMapping("/api/admin/domain-logs/{id}")
    public ResponseEntity<Void> deleteDomainLog(@PathVariable Long id) {
        try {
            domainLogService.deleteLogById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
