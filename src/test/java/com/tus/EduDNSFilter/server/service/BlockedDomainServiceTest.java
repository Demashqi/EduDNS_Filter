package com.tus.EduDNSFilter.server.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.tus.EduDNSFilter.server.model.BlockedDomain;
import com.tus.EduDNSFilter.server.repository.BlockedDomainRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class BlockedDomainServiceTest {

    @Mock
    private BlockedDomainRepository repository;

    @InjectMocks
    private BlockedDomainService service;

    @BeforeEach
    void setUp() {
        service = new BlockedDomainService(repository);
    }

    @Test
    void addBlockedDomain_shouldAddNewDomain() {
        String domain = "example.com";
        BlockedDomain blockedDomain = new BlockedDomain(domain);

        when(repository.findAll()).thenReturn(List.of());
        when(repository.save(any(BlockedDomain.class))).thenReturn(blockedDomain);

        BlockedDomain result = service.addBlockedDomain(domain);
        assertNotNull(result);
        assertEquals(domain, result.getDomain());
    }

    @Test
    void addBlockedDomain_shouldThrowExceptionIfDomainAlreadyBlocked() {
        String domain = "example.com";
        BlockedDomain blockedDomain = new BlockedDomain(domain);

        when(repository.findAll()).thenReturn(List.of(blockedDomain));

        assertThrows(ResponseStatusException.class, () -> service.addBlockedDomain(domain));
    }

    @Test
    void getAllBlockedDomains_shouldReturnListOfDomains() {
        List<BlockedDomain> domains = Arrays.asList(new BlockedDomain("example.com"), new BlockedDomain("test.com"));
        when(repository.findAll()).thenReturn(domains);

        List<BlockedDomain> result = service.getAllBlockedDomains();
        assertEquals(2, result.size());
    }

    @Test
    void getBlockedDomainById_shouldReturnDomain() {
        BlockedDomain blockedDomain = new BlockedDomain("example.com");
        when(repository.findById(1L)).thenReturn(Optional.of(blockedDomain));

        BlockedDomain result = service.getBlockedDomainById(1L);
        assertNotNull(result);
        assertEquals("example.com", result.getDomain());
    }

    @Test
    void getBlockedDomainById_shouldThrowExceptionIfNotFound() {
        when(repository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> service.getBlockedDomainById(1L));
    }

    @Test
    void updateBlockedDomain_shouldUpdateExistingDomain() {
        BlockedDomain existing = new BlockedDomain("old.com");
        BlockedDomain updated = new BlockedDomain("new.com");

        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.save(any(BlockedDomain.class))).thenReturn(updated);

        BlockedDomain result = service.updateBlockedDomain(1L, updated);
        assertEquals("new.com", result.getDomain());
    }

    @Test
    void updateBlockedDomain_shouldThrowExceptionIfNotFound() {
        BlockedDomain updated = new BlockedDomain("new.com");
        when(repository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.updateBlockedDomain(1L, updated));
    }

    @Test
    void deleteBlockedDomain_shouldDeleteIfExists() {
        when(repository.existsById(1L)).thenReturn(true);
        doNothing().when(repository).deleteById(1L);

        assertDoesNotThrow(() -> service.deleteBlockedDomain(1L));
    }

    @Test
    void deleteBlockedDomain_shouldThrowExceptionIfNotFound() {
        when(repository.existsById(1L)).thenReturn(false);
        assertThrows(RuntimeException.class, () -> service.deleteBlockedDomain(1L));
    }

    @Test
    void deleteBlockedDomainByName_shouldDeleteIfExists() {
        BlockedDomain blockedDomain = new BlockedDomain("example.com");
        when(repository.findByDomain("example.com")).thenReturn(Optional.of(blockedDomain));
        doNothing().when(repository).delete(blockedDomain);

        assertDoesNotThrow(() -> service.deleteBlockedDomainByName("example.com"));
    }

    @Test
    void deleteBlockedDomainByName_shouldThrowExceptionIfNotFound() {
        when(repository.findByDomain("example.com")).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, () -> service.deleteBlockedDomainByName("example.com"));
    }

    @Test
    void isDomainBlocked_shouldReturnTrueIfBlocked() {
        BlockedDomain blockedDomain = new BlockedDomain("example.com");
        when(repository.findAll()).thenReturn(List.of(blockedDomain));

        assertTrue(service.isDomainBlocked("example.com"));
    }

    @Test
    void isDomainBlocked_shouldReturnFalseIfNotBlocked() {
        when(repository.findAll()).thenReturn(List.of());
        assertFalse(service.isDomainBlocked("example.com"));
    }
}