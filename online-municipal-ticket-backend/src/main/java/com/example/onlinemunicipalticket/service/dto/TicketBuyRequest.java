package com.example.onlinemunicipalticket.service.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;

import java.time.Instant;
import java.util.Optional;

public record TicketBuyRequest(
        @Nullable Long activeFrom,

        @NotBlank(message = "Session context is required")
        SessionContext ctx
) {

    public Optional<Instant> getActiveFrom() {
        return Optional.ofNullable(activeFrom).map(Instant::ofEpochSecond);
    }
}
