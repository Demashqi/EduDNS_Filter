package com.tus.EduDNSFilter.server.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.tus.EduDNSFilter.server.model.DomainLog;
import com.tus.EduDNSFilter.server.repository.DomainLogRepository;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DomainLogServiceTest {

    @Mock
    private DomainLogRepository domainLogRepository;

    private DomainLogService domainLogService;

    @BeforeEach
    void setUp() {
        domainLogService = new DomainLogService(domainLogRepository);
    }

    @Test
    void testLogDomain() {
        // Given
        String domain = "example.com";
        boolean blocked = true;

        // When: logDomain is called.
        domainLogService.logDomain(domain, blocked);

        // Then: verify that domainLogRepository.save() was called with a DomainLog having the expected values.
        ArgumentCaptor<DomainLog> captor = ArgumentCaptor.forClass(DomainLog.class);
        verify(domainLogRepository).save(captor.capture());
        DomainLog capturedLog = captor.getValue();

        assertEquals(domain, capturedLog.getDomain(), "Domain should match the provided value");
        assertEquals(blocked, capturedLog.isBlocked(), "Blocked status should match the provided value");
        assertNotNull(capturedLog.getTimestamp(), "Timestamp should not be null");

        // Optionally: check that the timestamp is close to now (within a few seconds)
        LocalDateTime now = LocalDateTime.now();
        assertTrue(!capturedLog.getTimestamp().isBefore(now.minusSeconds(5)) &&
                   !capturedLog.getTimestamp().isAfter(now.plusSeconds(5)),
                   "Timestamp should be close to the current time");
    }

    @Test
    void testGetLogsForLast7Days() {
        // Given: prepare some fake DomainLog entries.
        DomainLog log1 = new DomainLog("example.com", false, LocalDateTime.now());
        DomainLog log2 = new DomainLog("test.com", true, LocalDateTime.now().minusDays(1));
        List<DomainLog> expectedLogs = Arrays.asList(log1, log2);

        // When: the repository returns our fake logs when findByTimestampAfter is called.
        when(domainLogRepository.findByTimestampAfter(any(LocalDateTime.class))).thenReturn(expectedLogs);

        // Then: verify that getLogsForLast7Days() returns the expected logs.
        List<DomainLog> logs = domainLogService.getLogsForLast7Days();
        assertEquals(expectedLogs, logs, "The logs returned should match the expected list");

        // Capture and inspect the argument passed to findByTimestampAfter().
        ArgumentCaptor<LocalDateTime> captor = ArgumentCaptor.forClass(LocalDateTime.class);
        verify(domainLogRepository).findByTimestampAfter(captor.capture());
        LocalDateTime capturedDate = captor.getValue();
        assertNotNull(capturedDate, "Captured date should not be null");
        // Here we expect the captured date to be roughly seven days ago.
        LocalDateTime expectedDate = LocalDateTime.now().minusDays(7);
        long secondsDifference = Math.abs(java.time.Duration.between(expectedDate, capturedDate).getSeconds());
        assertTrue(secondsDifference < 5, "The timestamp should be within 5 seconds of seven days ago");
    }

    @Test
    void testDeleteOldLogs() {
        // When: deleteOldLogs() is called.
        domainLogService.deleteOldLogs();

        // Then: verify that deleteByTimestampBefore() is called with the correct timestamp (now minus 7 days).
        ArgumentCaptor<LocalDateTime> captor = ArgumentCaptor.forClass(LocalDateTime.class);
        verify(domainLogRepository).deleteByTimestampBefore(captor.capture());
        LocalDateTime capturedDate = captor.getValue();
        assertNotNull(capturedDate, "Captured date should not be null");

        // Optionally: verify that the captured date is approximately seven days ago.
        LocalDateTime expectedDate = LocalDateTime.now().minusDays(7);
        long secondsDiff = Math.abs(java.time.Duration.between(expectedDate, capturedDate).getSeconds());
        assertTrue(secondsDiff < 5, "The timestamp should be within 5 seconds of seven days ago");
    }

    @Test
    void testDeleteLogs() {
        // When: deleteLogs() is called.
        domainLogService.deleteLogs();

        // Then: verify that deleteAll() is called on the repository.
        verify(domainLogRepository).deleteAll();
    }

    @Test
    void testDeleteLogById_Success() {
        // Given: an existing log id.
        Long id = 1L;
        when(domainLogRepository.existsById(id)).thenReturn(true);

        // When: deleteLogById is called.
        domainLogService.deleteLogById(id);

        // Then: verify that deleteById() is called with the provided id.
        verify(domainLogRepository).deleteById(id);
    }

    @Test
    void testDeleteLogById_NotFound() {
        // Given: a log id that does not exist.
        Long id = 2L;
        when(domainLogRepository.existsById(id)).thenReturn(false);

        // When & Then: calling deleteLogById should throw an IllegalArgumentException.
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            domainLogService.deleteLogById(id);
        });
        String expectedMessage = "Log with ID " + id + " does not exist";
        assertTrue(exception.getMessage().contains(expectedMessage));
    }
}
