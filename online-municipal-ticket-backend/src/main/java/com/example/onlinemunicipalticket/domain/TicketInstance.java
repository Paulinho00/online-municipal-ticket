package com.example.onlinemunicipalticket.domain;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.Optional;

@Data
@Entity
public class TicketInstance {

    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private Ticket ticket;

    @ManyToOne(optional = false)
    private UserData user;

    @CreationTimestamp
    private Instant purchaseTimestamp;

    @Nullable
    private Instant useTimestamp;

    @Nullable
    private String vehicleId;

    public Optional<Instant> getUseTimestamp() {
        return Optional.ofNullable(useTimestamp);
    }

    public boolean isUsed() {
        return useTimestamp != null || ticket.getTicketType() == TicketType.PERIODIC;
    }

    public Optional<String> getVehicleId() {
        return Optional.ofNullable(vehicleId);
    }

    public boolean isActive(Instant now, @Nullable String vehicleId) {
        if (now.isBefore(purchaseTimestamp) || isUsed()) {
            return false;
        }

        return switch (ticket.getTicketType()) {
            case PERIODIC -> ticket.getDuration()
                    .map(duration -> now.isBefore(purchaseTimestamp.plus(duration)))
                    .orElse(false);
            case DISPOSABLE -> getVehicleId()
                    .map(vid -> vid.equals(vehicleId))
                    .orElse(false);
            case TIMED -> getUseTimestamp()
                    .map(use -> ticket.getDuration().isPresent()
                            && now.isBefore(use.plus(ticket.getDuration().get()))
                    )
                    .orElse(false);
        };
    }
}
