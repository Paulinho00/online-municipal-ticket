package com.example.onlinemunicipalticket.controller;

import com.example.onlinemunicipalticket.domain.SessionData;
import com.example.onlinemunicipalticket.domain.UserRole;
import com.example.onlinemunicipalticket.service.TicketService;
import com.example.onlinemunicipalticket.service.UserService;
import com.example.onlinemunicipalticket.service.dto.Ticket;
import com.example.onlinemunicipalticket.service.dto.TicketModel;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.Collection;

@RestController
@RequestMapping("/ticket")
@RequiredArgsConstructor(onConstructor_ = @Autowired, access = AccessLevel.PACKAGE)
public class TicketController {

    private final TicketService ticketService;
    private final UserService userService;

    @GetMapping("/check")
    public ResponseEntity<Boolean> check(
            @RequestParam long ticketInstanceId,
            @RequestParam(required = false) String vehicleId,
            @RequestParam long sessionToken,
            HttpServletRequest request
    ) {
        var userData = userService.getLoggedUser(new SessionData(sessionToken, request.getRemoteAddr()));
        if (userData.isEmpty()) {
            return ResponseEntity.status(401).build();
        }
        if (userData.get().getRole() != UserRole.TICKET_INSPECTOR) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(ticketService.checkTicket(ticketInstanceId, vehicleId));
    }

    @GetMapping("")
    public ResponseEntity<Collection<TicketModel>> getTickets(
            @RequestParam long sessionToken,
            HttpServletRequest request
    ) {
        var userData = userService.getLoggedUser(new SessionData(sessionToken, request.getRemoteAddr()));
        if (userData.isEmpty()) {
            return ResponseEntity.status(401).build();
        }
        if (userData.get().getRole() != UserRole.TICKET_INSPECTOR) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(ticketService.getTickets());
    }

    @GetMapping("/owned")
    public ResponseEntity<Collection<Ticket>> getOwnedTickets(
            @RequestParam long sessionToken,
            HttpServletRequest request
    ) {
        var userData = userService.getLoggedUser(new SessionData(sessionToken, request.getRemoteAddr()));
        if (userData.isEmpty()) {
            return ResponseEntity.status(401).build();
        }
        if (userData.get().getRole() != UserRole.PASSENGER) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(ticketService.getTickets(userData.get().getId()));
    }


    @PostMapping("/buy")
    public ResponseEntity<Long> buy(
            @RequestParam long ticketId,
            @RequestParam long sessionToken,
            @RequestParam(required = false) Long activeFrom,
            HttpServletRequest request
    ) {
        var userData = userService.getLoggedUser(new SessionData(sessionToken, request.getRemoteAddr()));
        if (userData.isEmpty()) {
            return ResponseEntity.status(401).build();
        }
        if (userData.get().getRole() != UserRole.PASSENGER) {
            return ResponseEntity.status(403).build();
        }

        return ticketService.buyTicket(ticketId, userData.get(), Instant.ofEpochSecond(activeFrom))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).build());
    }

    @PostMapping("/use")
    public ResponseEntity<String> use(@RequestParam long ticketInstanceId) {
        return ticketService.useTicket(ticketInstanceId) ? ResponseEntity.ok().build() : ResponseEntity.status(404).body("Ticket to use not found!");
    }
}
