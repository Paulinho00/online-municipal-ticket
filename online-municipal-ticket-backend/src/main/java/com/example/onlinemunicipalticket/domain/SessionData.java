package com.example.onlinemunicipalticket.domain;

public record SessionData(Long token, String ipAddress) {

    public SessionData(String token, String ipAddress) {
        this(Long.parseLong(token), ipAddress);
    }
}
