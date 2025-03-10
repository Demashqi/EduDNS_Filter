package com.tus.EduDNSFilter.users_manager.dto;

import java.util.Set;

import com.tus.EduDNSFilter.users_manager.model.Role;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
    private String username;
    private Set<Role> roles;

    public UserDTO(String username, Set<Role> roles) {
        this.username = username;
        this.roles = roles;
    }
}
