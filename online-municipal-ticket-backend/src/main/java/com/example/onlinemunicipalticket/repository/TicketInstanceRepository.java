package com.example.onlinemunicipalticket.repository;

import com.example.onlinemunicipalticket.domain.TicketInstance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketInstanceRepository extends JpaRepository<TicketInstance, Long> {

    Page<TicketInstance> findByUserIdOrderByPurchaseTimestampDesc(long userId, Pageable pageable);
}
