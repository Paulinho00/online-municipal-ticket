package com.example.onlinemunicipalticket.service.dto;

import jakarta.validation.constraints.NotBlank;

public record SessionContext(
        @NotBlank(message = "Token is required")
        long token
) {
}
