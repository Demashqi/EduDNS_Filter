package com.tus.DNSResolver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DnsResolverApplication {
    public static void main(String[] args) {
        SpringApplication.run(DnsResolverApplication.class, args);
    }
}
