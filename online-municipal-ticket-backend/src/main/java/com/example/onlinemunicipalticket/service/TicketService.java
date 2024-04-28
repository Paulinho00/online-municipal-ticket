package com.example.onlinemunicipalticket.service;

import com.example.onlinemunicipalticket.domain.TicketInstance;
import com.example.onlinemunicipalticket.domain.TicketType;
import com.example.onlinemunicipalticket.domain.UserData;
import com.example.onlinemunicipalticket.repository.TicketInstanceRepository;
import com.example.onlinemunicipalticket.repository.TicketRepository;
import com.example.onlinemunicipalticket.service.dto.Ticket;
import com.example.onlinemunicipalticket.service.dto.TicketFactory;
import com.example.onlinemunicipalticket.service.dto.TicketModel;
import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collection;
import java.util.Comparator;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final UserService userService;
    private final TicketInstanceRepository ticketInstanceRepository;
    private final TicketRepository ticketRepository;

    public boolean checkTicket(long ticketInstanceId, @Nullable String vehicleId) {
        return ticketInstanceRepository.findById(ticketInstanceId)
                .map(instance -> instance.isActive(
                        Instant.now(),
                        String.valueOf(vehicleId)
                )).orElse(false);
    }

    public Collection<TicketModel> getTickets() {
        return ticketRepository.findAll().stream()
                .map(ticket -> new TicketModel(
                        ticket.getId(),
                        ticket.getTicketType().name(),
                        ticket.getDurationSeconds().orElse(null),
                        ticket.getPrice(),
                        ticket.isReduced()
                )).toList();
    }

    public Collection<Ticket> getTickets(long userId) {
        return ticketInstanceRepository.findByUserId(userId).stream()
                .map(TicketFactory::createTicket)
                .sorted(Comparator.comparing(Ticket::type)
                        .thenComparing(
                                ticket -> ticket.activationTimestamp() != null ?
                                        ticket.activationTimestamp()
                                        : ticket.purchaseTimestamp(),
                                Comparator.nullsLast(Comparator.reverseOrder())
                        )
                ).toList();
    }

    public Optional<Long> buyTicket(long ticketId, UserData user, @Nullable Instant activeFrom) {
        return ticketRepository.findById(ticketId)
                .map(ticket -> {
                    var instance = new TicketInstance(
                            user,
                            ticket
                    );

                    if (ticket.getTicketType() == TicketType.PERIODIC) {
                        instance.setActivationTimestamp(Optional.ofNullable(activeFrom).orElse(Instant.now()));
                    }
                    ticketInstanceRepository.save(instance);

                    return Optional.of(instance.getId());
                }).orElse(Optional.empty());
    }

    public boolean useTicket(long ticketInstanceId) {
        return ticketInstanceRepository.findById(ticketInstanceId)
                .map(instance -> {
                    if (instance.isUsed()) {
                        return false;
                    }

                    instance.setActivationTimestamp(Instant.now());
                    ticketInstanceRepository.save(instance);

                    return true;
                }).orElse(false);
    }

}
