package com.tus.EduDNSFilter.util;

import java.util.logging.Logger;
import java.util.logging.Level;

public class LoggerUtil {
    // Obtain a logger instance for this class
    private static final Logger LOGGER = Logger.getLogger(LoggerUtil.class.getName());

    public static void main(String[] args) {
        // Log messages at various levels
        LOGGER.severe("This is a SEVERE message");
        LOGGER.warning("This is a WARNING message");
        LOGGER.info("This is an INFO message");
        LOGGER.fine("This is a FINE message (won't show by default if level is INFO)");

        // Demonstrate logging inside a method
        new LoggerUtil().performTask();
    }

    public void performTask() {
        LOGGER.info("Starting task...");
        try {
            // Simulate some work
            int result = 10 / 2;
            LOGGER.fine("Result is: " + result);
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "An error occurred while performing the task", e);
        }
    }
}
