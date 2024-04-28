package com.example.onlinemunicipalticket.repository;

import com.example.onlinemunicipalticket.domain.TicketInstance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketInstanceRepository extends JpaRepository<TicketInstance, Long> {

    List<TicketInstance> findByUserId(long userId);
}
