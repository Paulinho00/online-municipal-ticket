package com.example.onlinemunicipalticket.service.dto;

import java.util.Collection;

public record TicketPageReply(
        Collection<Ticket> tickets,
        int totalPages, long totalElements
) {
}
