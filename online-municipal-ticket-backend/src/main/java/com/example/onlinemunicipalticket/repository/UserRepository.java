package com.example.onlinemunicipalticket.repository;

import com.example.onlinemunicipalticket.domain.UserData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserData, Long> {

    Optional<UserData> findByEmail(String email);
}
