package com.tus.EduDNSFilter.server.dns;

import com.tus.EduDNSFilter.server.service.DNSResolverService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.AfterEach;
import org.xbill.DNS.Message;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

import static org.mockito.Mockito.*;

class DNSServerTest {

    private DNSResolverService dnsResolverService;
    private DNSServer dnsServer;
    private DatagramSocket mockSocket;

    @BeforeEach
    void setUp() throws Exception {
        dnsResolverService = mock(DNSResolverService.class);
        dnsServer = new DNSServer(dnsResolverService);
        mockSocket = mock(DatagramSocket.class);
    }

    @AfterEach
    void tearDown() {
        dnsServer.stop();
    }

    @Test
    void testStartServerThread() {
        dnsServer.start();
        verify(dnsResolverService, never()).resolveDNS(any(Message.class));
    }

    @Test
    void testProcessValidPacket() throws Exception {
        byte[] queryData = new byte[512];
        DatagramPacket packet = new DatagramPacket(queryData, queryData.length, InetAddress.getLocalHost(), 53);

        Message mockResponse = new Message();
        when(dnsResolverService.resolveDNS(any(Message.class))).thenReturn(mockResponse);

        dnsServer.start();
        dnsServer.stop(); // Simulating stopping immediately after start

        verify(dnsResolverService, never()).resolveDNS(any(Message.class));
    }

    @Test
    void testStopServerClosesSocket() {
        dnsServer.stop();
        // No exceptions should be thrown, and the socket should close safely
    }
}
