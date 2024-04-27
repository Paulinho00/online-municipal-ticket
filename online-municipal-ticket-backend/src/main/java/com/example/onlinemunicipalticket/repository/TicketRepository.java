package com.example.onlinemunicipalticket.repository;

import com.example.onlinemunicipalticket.domain.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
}
