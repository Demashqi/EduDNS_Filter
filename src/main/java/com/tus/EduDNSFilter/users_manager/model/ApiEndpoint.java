package com.tus.EduDNSFilter.users_manager.model;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;
@Getter
@Setter
@Entity
@Table(name = "api_endpoints")
public class ApiEndpoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // HTTP method such as "GET", "POST", etc.
    @Column(nullable = false)
    private String method;

    // URL of the endpoint, e.g. "/api/auth/login"
    @Column(nullable = false)
    private String href;

    // Descriptive key (for _links map) such as "getDomainLogs", "getAllUsers", etc.
    @Column(nullable = false, unique = true)
    private String linkKey;

    // Many-to-many mapping with roles using the Role enum
    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "endpoint_roles", joinColumns = @JoinColumn(name = "endpoint_id"))
    @Column(name = "role")
    private Set<Role> roles;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private ApiGroup apiGroup;

    public ApiEndpoint() {}

    public ApiEndpoint(String method, String href, String linkKey, ApiGroup apiGroup, Set<Role> roles) {
        this.method = method;
        this.href = href;
        this.linkKey = linkKey;
        this.apiGroup = apiGroup;
        this.roles = roles;
    }
}
