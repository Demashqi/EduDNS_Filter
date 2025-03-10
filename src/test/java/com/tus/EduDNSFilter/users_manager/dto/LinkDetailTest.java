package com.tus.EduDNSFilter.users_manager.dto;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

public class LinkDetailTest {

    @Test
    public void testConstructorAndGetters() {
        // Given values for method and href
        String expectedMethod = "GET";
        String expectedHref = "http://example.com/api/resource";

        // When creating an instance of LinkDetail
        LinkDetail linkDetail = new LinkDetail(expectedMethod, expectedHref);

        // Then verify the object is not null and getters return expected values
        assertNotNull(linkDetail, "LinkDetail instance should not be null");
        assertEquals(expectedMethod, linkDetail.getMethod(), "Method should match the provided value");
        assertEquals(expectedHref, linkDetail.getHref(), "Href should match the provided value");
    }
}
