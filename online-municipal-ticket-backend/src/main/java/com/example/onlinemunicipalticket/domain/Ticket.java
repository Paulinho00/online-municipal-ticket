package com.example.onlinemunicipalticket.domain;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.Optional;

@Data
@Entity
public class Ticket {

    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TicketType ticketType;

    @Nullable
    private Duration duration;

    @NotNull
    private BigDecimal price;

    private boolean reduced;

    public Optional<Duration> getDuration() {
        return Optional.ofNullable(duration);
    }

    public Optional<Long> getDurationSeconds() {
        return Optional.ofNullable(duration).map(Duration::toSeconds);
    }
}
