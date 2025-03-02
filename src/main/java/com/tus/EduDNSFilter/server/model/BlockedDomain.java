package com.tus.EduDNSFilter.server.model;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter


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
}
