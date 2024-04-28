package com.example.onlinemunicipalticket.service.dto;

public record LoginReply(
        Long token,
        long userId,
        String name,
        String lastName,
        String role
) {
}
