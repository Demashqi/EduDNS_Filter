package com.tus.EduDNSFilter.server.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.tus.EduDNSFilter.server.model.BlockedDomain;
import com.tus.EduDNSFilter.server.service.BlockedDomainService;

import java.util.List;

@RestController
@PreAuthorize("hasAuthority('TEACHER')")
@RequestMapping("/api/teacher/blocklist")
public class BlocklistController {

    private final BlockedDomainService blockedDomainService;

    public BlocklistController(BlockedDomainService blockedDomainService) {
        this.blockedDomainService = blockedDomainService;
    }

    @PostMapping
    public ResponseEntity<BlockedDomain> createBlockedDomain(@RequestBody BlockedDomain blockedDomain) {
        BlockedDomain createdDomain = blockedDomainService.addBlockedDomain(blockedDomain.getDomain());
        return ResponseEntity.ok(createdDomain);
    }

    @GetMapping
    public ResponseEntity<List<BlockedDomain>> getAllBlockedDomains() {
        List<BlockedDomain> blockedDomains = blockedDomainService.getAllBlockedDomains();
        return ResponseEntity.ok(blockedDomains);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlockedDomain> getBlockedDomainById(@PathVariable Long id) {
        BlockedDomain blockedDomain = blockedDomainService.getBlockedDomainById(id);
        return ResponseEntity.ok(blockedDomain);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlockedDomain> updateBlockedDomain(@PathVariable Long id, @RequestBody BlockedDomain blockedDomain) {
        BlockedDomain updatedDomain = blockedDomainService.updateBlockedDomain(id, blockedDomain);
        return ResponseEntity.ok(updatedDomain);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlockedDomain(@PathVariable Long id) {
        blockedDomainService.deleteBlockedDomain(id);
        return ResponseEntity.noContent().build();
    }

     @DeleteMapping("/name/{domain}")
    public ResponseEntity<?> deleteBlockedDomainByName(@PathVariable String domain) {
        try {
            blockedDomainService.deleteBlockedDomainByName(domain);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatus()).body(ex.getReason());
        }
    }
}
