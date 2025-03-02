package com.tus.DNSResolver.users_manager.model;

import java.util.List;
import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "api_groups")
public class ApiGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Group name (e.g. "Authentication", "Blocklist")
    @Column(nullable = false, unique = true)
    private String groupName;

    @OneToMany(mappedBy = "apiGroup", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ApiEndpoint> endpoints;

    public ApiGroup() {}

    public ApiGroup(String groupName) {
        this.groupName = groupName;
    }
}