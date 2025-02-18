package com.tus.DNSResolver.server.model;

import javax.persistence.*;

@Entity
@Table(name = "blocked_domains")
public class BlockedDomain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String domain;

    public BlockedDomain() {}

    public BlockedDomain(String domain) {
        this.domain = domain.toLowerCase();
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public String getDomain() {
        return domain;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setDomain(String domain) {
        this.domain = domain.toLowerCase();
    }
}
