package com.example.onlinemunicipalticket.service.dto;

import com.example.onlinemunicipalticket.domain.TicketInstance;
import lombok.experimental.UtilityClass;
import org.springframework.data.domain.Page;

@UtilityClass
public class TicketPageReplyFactory {

    public TicketPageReply create(Page<TicketInstance> ticketPage) {
        return new TicketPageReply(
                ticketPage.getContent().stream()
                        .map(TicketPageReplyFactory::createTicket)
                        .toList(),
                ticketPage.getTotalPages(),
                ticketPage.getTotalElements()
        );
    }

    private Ticket createTicket(TicketInstance ticket) {
        var ticketModel = ticket.getTicket();
        return new Ticket(
                ticket.getId(),
                ticketModel.getTicketType().name(),
                ticket.getPurchaseTimestamp(),
                ticket.getActivationTimestamp().orElse(null),
                ticket.getExpirationTimestamp().orElse(null),
                ticket.getVehicleId().orElse(null)
        );
    }
}
