package com.tus.EduDNSFilter.karate;

import com.intuit.karate.Results;
import com.intuit.karate.Runner;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class RunAllKarateTestsIT {
    @Test
    void testAll() {
        Results results = Runner.path("classpath:features")
                                .parallel(1); // Thread is needed her to show all tests grouped together on karate dashboard
    }
}