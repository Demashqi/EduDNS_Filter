package com.tus.EduDNSFilter.server.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.tus.EduDNSFilter.server.model.BlockedDomain;
import com.tus.EduDNSFilter.server.repository.BlockedDomainRepository;

import java.util.List;
import java.util.Optional;

@Service
public class BlockedDomainService {

    private final BlockedDomainRepository repository;

    public BlockedDomainService(BlockedDomainRepository repository) {
        this.repository = repository;
    }

      public BlockedDomain addBlockedDomain(String domain) {
        // Check if the domain is already blocked
        if (isDomainBlocked(domain)) {
            // If already blocked, throw a ResponseStatusException with HTTP 400 Bad Request
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Domain is already blocked");
        }

        BlockedDomain blockedDomain = new BlockedDomain(domain);
        return repository.save(blockedDomain);
    }

    public List<BlockedDomain> getAllBlockedDomains() {
        return repository.findAll();
    }

    public BlockedDomain getBlockedDomainById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Blocked domain not found"));
    }

    public BlockedDomain updateBlockedDomain(Long id, BlockedDomain blockedDomain) {
        Optional<BlockedDomain> existing = repository.findById(id);
        if (existing.isPresent()) {
            BlockedDomain domainToUpdate = existing.get();
            domainToUpdate.setDomain(blockedDomain.getDomain());
            return repository.save(domainToUpdate);
        } else {
            throw new RuntimeException("Blocked domain not found");
        }
    }

    public void deleteBlockedDomain(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
        } else {
            throw new RuntimeException("Blocked domain not found");
        }
    }

    // New method to delete a domain by its domain name
    public void deleteBlockedDomainByName(String domain) {
        BlockedDomain blockedDomain = repository.findByDomain(domain)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Blocked domain not found"));

        repository.delete(blockedDomain);
    }


    public boolean isDomainBlocked(String domain) {
        String lowerDomain = domain.toLowerCase();
        List<BlockedDomain> blockedDomains = repository.findAll();
        for (BlockedDomain bd : blockedDomains) {
            String blocked = bd.getDomain().toLowerCase();
            if (lowerDomain.equals(blocked) || lowerDomain.endsWith("." + blocked)) {
                return true;
            }
        }
        return false;
    }
}
