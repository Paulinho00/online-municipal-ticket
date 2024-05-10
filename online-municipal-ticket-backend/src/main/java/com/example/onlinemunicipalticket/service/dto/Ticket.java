package com.example.onlinemunicipalticket.service.dto;

import jakarta.annotation.Nullable;

import java.time.Instant;

public record Ticket(
        long id,
        String type,
        Instant purchaseDate,
        @Nullable Instant activationDate,
        @Nullable Instant expirationDate,
        @Nullable String vehicleId
) {
}
