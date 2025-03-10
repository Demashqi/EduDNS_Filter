package com.tus.EduDNSFilter.karate;

import com.intuit.karate.junit5.Karate;

public class BlocklistIT {
    @Karate.Test
    Karate testBlocklist() {
        return Karate.run("classpath:features/blocklist.feature").relativeTo(getClass());
    }
}