package com.example.onlinemunicipalticket.service.dto;

import com.example.onlinemunicipalticket.domain.TicketInstance;
import lombok.experimental.UtilityClass;

import java.time.Instant;

@UtilityClass
public class TicketFactory {

    public Ticket createTicket(TicketInstance ticket) {
        var ticketModel = ticket.getTicket();
        return new Ticket(
                ticket.getId(),
                ticketModel.getTicketType().name(),
                ticket.getPurchaseTimestamp().getEpochSecond(),
                ticket.getActivationTimestamp().map(Instant::getEpochSecond).orElse(null),
                ticket.getExpirationTimestamp().map(Instant::getEpochSecond).orElse(null),
                ticket.getVehicleId().orElse(null)
        );
    }
}
