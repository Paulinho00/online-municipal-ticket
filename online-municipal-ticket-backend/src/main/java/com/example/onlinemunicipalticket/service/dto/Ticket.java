package com.example.onlinemunicipalticket.service.dto;

import jakarta.annotation.Nullable;

public record Ticket(
        long id,
        String type,
        Long purchaseTimestamp,
        @Nullable Long activationTimestamp,
        @Nullable Long expirationTimestamp,
        @Nullable String vehicleId
) {
}
