package com.example.onlinemunicipalticket.domain;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.Optional;

@Data
@NoArgsConstructor
@Entity
public class TicketInstance {

    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(
            name = "ticket_id",
            referencedColumnName = "id",
            insertable = false,
            updatable = false
    )
    private Ticket ticket;

    @ManyToOne(optional = false)
    @JoinColumn(
            name = "user_id",
            referencedColumnName = "id",
            insertable = false,
            updatable = false
    )
    private UserData user;

    @CreationTimestamp
    private Instant purchaseTimestamp;

    @Nullable
    private Instant activationTimestamp;

    @Nullable
    private String vehicleId;

    public TicketInstance(UserData user, Ticket ticket) {
        this.user = user;
        this.ticket = ticket;
    }

    public Optional<Instant> getActivationTimestamp() {
        return Optional.ofNullable(activationTimestamp);
    }

    public boolean isUsed() {
        return activationTimestamp != null;
    }

    public Optional<String> getVehicleId() {
        return Optional.ofNullable(vehicleId);
    }

    public boolean isActive(Instant now, @Nullable String vehicleId) {
        if (now.isBefore(purchaseTimestamp) || !isUsed()) {
            return false;
        }

        return switch (ticket.getTicketType()) {
            case DISPOSABLE -> getVehicleId()
                    .map(vid -> vid.equals(vehicleId))
                    .orElse(false);
            case PERIODIC, TIMED -> getActivationTimestamp()
                    .map(use -> ticket.getDuration().isPresent()
                            && now.isAfter(use)
                            && now.isBefore(use.plus(ticket.getDuration().get()))
                    )
                    .orElse(false);
        };
    }

    public Optional<Instant> getExpirationTimestamp() {
        return getActivationTimestamp().flatMap(use -> ticket.getDuration().map(use::plus));
    }
}
