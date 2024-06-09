package com.example.onlinemunicipalticket.controller;

import com.example.onlinemunicipalticket.domain.SessionData;
import com.example.onlinemunicipalticket.domain.UserRole;
import com.example.onlinemunicipalticket.service.TicketService;
import com.example.onlinemunicipalticket.service.UserService;
import com.example.onlinemunicipalticket.service.dto.TicketModel;
import com.example.onlinemunicipalticket.service.dto.TicketPageReply;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Collection;
import java.util.Optional;

@RestController
@RequestMapping("/ticket")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor(onConstructor_ = @Autowired, access = AccessLevel.PACKAGE)
public class TicketController {

    private final TicketService ticketService;
    private final UserService userService;

    @GetMapping("/check")
    public ResponseEntity<Boolean> check(
            @RequestHeader String token,
            @RequestParam long ticketInstanceId,
            @RequestParam(required = false) String vehicleId,
            HttpServletRequest request
    ) {
        var userData = userService.getLoggedUser(new SessionData(token, request.getRemoteAddr()));
        if (userData.isEmpty()) {
            return ResponseEntity.status(401).build();
        }
        if (userData.get().getRole() != UserRole.TICKET_INSPECTOR) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(ticketService.checkTicket(ticketInstanceId, vehicleId));
    }

    @GetMapping()
    public ResponseEntity<Collection<TicketModel>> getTickets(
            @RequestHeader String token,
            HttpServletRequest request
    ) {
        var userData = userService.getLoggedUser(new SessionData(token, request.getRemoteAddr()));
        if (userData.isEmpty()) {
            return ResponseEntity.status(401).build();
        }
        if (userData.get().getRole() != UserRole.PASSENGER) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(ticketService.getAvailableTickets());
    }

    @GetMapping("/owned")
    public ResponseEntity<TicketPageReply> getOwnedTickets(
            @RequestHeader String token,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size,
            HttpServletRequest request
    ) {
        var userData = userService.getLoggedUser(new SessionData(token, request.getRemoteAddr()));
        if (userData.isEmpty()) {
            return ResponseEntity.status(401).build();
        }
        if (userData.get().getRole() != UserRole.PASSENGER) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(ticketService.getOwnedTickets(userData.get().getId(), page, size));
    }


    @PostMapping("/buy")
    public ResponseEntity<Long> buy(
            @RequestHeader String token,
            @RequestParam long ticketId,
            @RequestBody(required = false) Long activeFrom,
            HttpServletRequest request
    ) {
        if(activeFrom != null && Instant.now().isAfter(Instant.ofEpochSecond(activeFrom))) {
            return ResponseEntity.status(400).build();
        }
        var userData = userService.getLoggedUser(
                new SessionData(token, request.getRemoteAddr())
        );
        if (userData.isEmpty()) {
            return ResponseEntity.status(401).build();
        }
        if (userData.get().getRole() != UserRole.PASSENGER) {
            return ResponseEntity.status(403).build();
        }

        return ticketService.buyTicket(
                        ticketId, userData.get(),
                        Optional.ofNullable(activeFrom).map(Instant::ofEpochSecond).orElse(null)
                ).map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).build());
    }

    @PostMapping("/use")
    public ResponseEntity<String> use(
            @RequestParam long ticketInstanceId,
            @RequestBody(required = false) String vehicleId
    ) {
        return ticketService.useTicket(ticketInstanceId, vehicleId) ? ResponseEntity.ok().build() : ResponseEntity.status(404).body("Ticket to use not found!");
    }
}
