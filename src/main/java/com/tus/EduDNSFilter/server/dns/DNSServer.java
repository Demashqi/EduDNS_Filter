package com.tus.EduDNSFilter.server.dns;


import org.springframework.stereotype.Component;
import org.xbill.DNS.Message;

import com.tus.EduDNSFilter.server.service.DNSResolverService;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import java.net.DatagramPacket;
import java.net.DatagramSocket;

// @Component
// public class DNSServer implements Runnable {

//     private final DNSResolverService dnsResolverService;
//     // Use port 8053 to avoid requiring root privileges (change to 53 if appropriate)
//     private final int port = 53;

//     public DNSServer(DNSResolverService dnsResolverService) {
//         this.dnsResolverService = dnsResolverService;
//     }

//     @PostConstruct
//     public void start() {
//         Thread thread = new Thread(this);
//         thread.setDaemon(true);
//         thread.start();
//     }

//       @PreDestroy // Add shutdown hook
//     public void stop() {
//         running = false;
//         if (socket != null && !socket.isClosed()) {
//             socket.close(); // Explicitly close the socket
//     }
//     }
//     @Override
//     public void run() {
//         try (DatagramSocket socket = new DatagramSocket(port)) {
//             System.out.println("DNS Server is running on port " + port);
//             byte[] buffer = new byte[512];
//             while (true) {
//                 DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
//                 socket.receive(packet);
//                 // Process each packet in its own thread (for concurrent handling)
//                 new Thread(() -> processPacket(packet, socket)).start();
//             }
//         } catch (Exception e) {
//             e.printStackTrace();
//         }
//     }

//     private void processPacket(DatagramPacket packet, DatagramSocket socket) {
//         try {
//             // Copy only the actual data received.
//             byte[] data = new byte[packet.getLength()];
//             System.arraycopy(packet.getData(), 0, data, 0, packet.getLength());
    
//             Message query = new Message(data);
//             Message response = dnsResolverService.resolveDNS(query);
//             byte[] responseData = response.toWire();
//             DatagramPacket responsePacket = new DatagramPacket(
//                     responseData, responseData.length, packet.getAddress(), packet.getPort());
//             socket.send(responsePacket);
//         } catch (Exception e) {
//             e.printStackTrace();
//         }
//     }
    
// }


@Component
public class DNSServer implements Runnable {

    private final DNSResolverService dnsResolverService;
    private final int port = 53;
    private volatile DatagramSocket socket; // Keep socket as a field
    private volatile boolean running = true;

    public DNSServer(DNSResolverService dnsResolverService) {
        this.dnsResolverService = dnsResolverService;
    }

    @PostConstruct
    public void start() {
        Thread thread = new Thread(this);
        thread.setDaemon(true);
        thread.start();
    }

    @PreDestroy // Add shutdown hook
    public void stop() {
        running = false;
        if (socket != null && !socket.isClosed()) {
            socket.close(); // Explicitly close the socket
        }
    }

    @Override
    public void run() {
        try {
            socket = new DatagramSocket(port);
            System.out.println("DNS Server is running on port " + port);
            byte[] buffer = new byte[512];
            
            while (running) { // Check running flag
                DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
                socket.receive(packet); // This will throw if socket is closed
                new Thread(() -> processPacket(packet)).start();
            }
        } catch (Exception e) {
            if (!socket.isClosed()) { // Ignore errors during shutdown
                e.printStackTrace();
            }
        } finally {
            if (socket != null && !socket.isClosed()) {
                socket.close();
            }
        }
    }

    private void processPacket(DatagramPacket packet) {
        // ... existing processing code ...
        // Use socket field instead of parameter
        try {
            // ... existing code ...
            // Copy only the actual data received.
            byte[] data = new byte[packet.getLength()];
            System.arraycopy(packet.getData(), 0, data, 0, packet.getLength());
    
            Message query = new Message(data);
            Message response = dnsResolverService.resolveDNS(query);
            byte[] responseData = response.toWire();
            DatagramPacket responsePacket = new DatagramPacket(
            responseData, responseData.length, packet.getAddress(), packet.getPort());
            socket.send(responsePacket); // Use class-level socket
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}