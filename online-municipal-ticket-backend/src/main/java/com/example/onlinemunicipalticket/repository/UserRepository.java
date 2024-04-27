package com.example.onlinemunicipalticket.repository;

import com.example.onlinemunicipalticket.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
