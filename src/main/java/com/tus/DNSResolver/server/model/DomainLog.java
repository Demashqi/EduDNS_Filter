package com.tus.DNSResolver.server.model;

import javax.persistence.*;
import java.time.LocalDateTime;

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

    public Long getId() {
        return id;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public boolean isBlocked() {
        return blocked;
    }

    public void setBlocked(boolean blocked) {
        this.blocked = blocked;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
