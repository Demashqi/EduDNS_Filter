package com.tus.EduDNSFilter.util;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Handler;
import java.util.logging.Level;
import java.util.logging.LogRecord;
import java.util.logging.Logger;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class LoggerUtilTest {

    // A custom Handler to capture log messages in a list
    static class TestLogHandler extends Handler {
        private final List<LogRecord> records = new ArrayList<>();

        @Override
        public void publish(LogRecord record) {
            records.add(record);
        }

        @Override
        public void flush() {
            // No buffering done so nothing to flush
        }

        @Override
        public void close() throws SecurityException {
            // Nothing to close
        }

        public List<LogRecord> getRecords() {
            return records;
        }
    }

    private TestLogHandler handler;
    private Logger logger;

    @BeforeEach
    public void setUp() {
        // Get the logger instance used in LoggerUtil
        logger = Logger.getLogger(LoggerUtil.class.getName());
        // Set the level to ALL to capture every log (including FINE)
        logger.setLevel(Level.ALL);
        // Create and add our custom log handler
        handler = new TestLogHandler();
        logger.addHandler(handler);
    }

    @AfterEach
    public void tearDown() {
        // Remove our custom handler after each test to avoid side effects
        logger.removeHandler(handler);
    }

    @Test
    void testPerformTaskLogs() {
        // Create an instance and call performTask()
        LoggerUtil util = new LoggerUtil();
        util.performTask();

        // Get all captured log records
        List<LogRecord> records = handler.getRecords();

        // Check that the log message "Starting task..." was logged at INFO level
        boolean foundStartingTask = records.stream()
                .anyMatch(record -> record.getLevel().equals(Level.INFO)
                        && record.getMessage().contains("Starting task..."));
        // Check that the log message for the result (should be "Result is: 5") is logged (at FINE level)
        boolean foundResult = records.stream()
                .anyMatch(record -> record.getMessage().contains("Result is: 5"));

        assertTrue(foundStartingTask, "Expected log message 'Starting task...' not found");
        assertTrue(foundResult, "Expected log message 'Result is: 5' not found");
    }

    @Test
    void testMainLogs() {
        // Call the main method. This will log several messages.
        LoggerUtil.main(new String[0]);

        // Capture the log records
        List<LogRecord> records = handler.getRecords();

        // Check that the SEVERE, WARNING, and INFO messages from main are present
        boolean hasSevere = records.stream()
                .anyMatch(record -> record.getLevel().equals(Level.SEVERE)
                        && record.getMessage().contains("This is a SEVERE message"));
        boolean hasWarning = records.stream()
                .anyMatch(record -> record.getLevel().equals(Level.WARNING)
                        && record.getMessage().contains("This is a WARNING message"));
        boolean hasInfo = records.stream()
                .anyMatch(record -> record.getLevel().equals(Level.INFO)
                        && record.getMessage().contains("This is an INFO message"));
        boolean hasStartingTask = records.stream()
                .anyMatch(record -> record.getMessage().contains("Starting task..."));

        assertTrue(hasSevere, "Main should log a SEVERE message");
        assertTrue(hasWarning, "Main should log a WARNING message");
        assertTrue(hasInfo, "Main should log an INFO message");
        assertTrue(hasStartingTask, "Main should log 'Starting task...' when calling performTask");
    }
}
