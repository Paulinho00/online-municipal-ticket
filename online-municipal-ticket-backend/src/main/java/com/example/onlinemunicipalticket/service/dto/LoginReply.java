package com.example.onlinemunicipalticket.service.dto;

public record LoginReply(
        String token,
        long userId,
        String name,
        String lastName,
        String role,
        String email
) {
}
