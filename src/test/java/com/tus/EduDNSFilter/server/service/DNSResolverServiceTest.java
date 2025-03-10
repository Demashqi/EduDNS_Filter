package com.tus.EduDNSFilter.server.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.xbill.DNS.Header;
import org.xbill.DNS.Message;

import org.xbill.DNS.Rcode;


@ExtendWith(MockitoExtension.class)
public class DNSResolverServiceTest {

    @Mock
    private BlockedDomainService blockedDomainService;

    @Mock
    private DomainLogService domainLogService;
    /**
     * Test when the query contains no question.
     * Expected: an error response with Rcode.FORMERR.
     */
    @Test
    void testResolveDNS_NoQuestion() {
        // Create a Message with no question record.
        Message query = new Message();
        // (Assumption: getQuestion() returns null for a message with no question.)

        DNSResolverService service = new DNSResolverService(blockedDomainService, domainLogService);
        Message response = service.resolveDNS(query);

        // The response should have FORMERR error code.
        Header header = response.getHeader();
        assertEquals(Rcode.FORMERR, header.getRcode(), "Expected FORMERR when no question is present");

        // Since no question exists, the dependencies should not be invoked.
        verifyNoInteractions(blockedDomainService);
        verifyNoInteractions(domainLogService);
    }
}
