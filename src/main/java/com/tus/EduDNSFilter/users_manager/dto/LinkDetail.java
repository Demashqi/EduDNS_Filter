package com.tus.EduDNSFilter.users_manager.dto;

// Simple DTO to encapsulate a link's HTTP method and URL
@lombok.Getter
public  class LinkDetail {
    private String method;
    private String href;
    
    public LinkDetail(String method, String href) {
        this.method = method;
        this.href = href;
    }
}

