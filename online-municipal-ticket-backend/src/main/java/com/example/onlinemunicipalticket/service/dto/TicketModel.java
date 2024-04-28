package com.example.onlinemunicipalticket.service.dto;

import jakarta.annotation.Nullable;

import java.math.BigDecimal;

public record TicketModel(
       long id,
       String type,
       @Nullable Long durationSeconds,
       BigDecimal price,
       boolean isReduced
) {
}
