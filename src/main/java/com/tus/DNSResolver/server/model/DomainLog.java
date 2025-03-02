package com.tus.DNSResolver.server.model;

import javax.persistence.*;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class DomainLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String domain;
    
    private boolean blocked;
    
    private LocalDateTime timestamp;

    public DomainLog() {}

    public DomainLog(String domain, boolean blocked, LocalDateTime timestamp) {
        this.domain = domain;
        this.blocked = blocked;
        this.timestamp = timestamp;
    }
}
