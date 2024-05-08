package com.example.onlinemunicipalticket.controller;

import com.example.onlinemunicipalticket.domain.SessionData;
import com.example.onlinemunicipalticket.domain.UserRole;
import com.example.onlinemunicipalticket.service.TicketService;
import com.example.onlinemunicipalticket.service.UserService;
import com.example.onlinemunicipalticket.service.dto.SessionContext;
import com.example.onlinemunicipalticket.service.dto.TicketBuyRequest;
import com.example.onlinemunicipalticket.service.dto.TicketModel;
import com.example.onlinemunicipalticket.service.dto.TicketPageReply;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            @RequestBody SessionContext ctx,
            HttpServletRequest request
    ) {
        var userData = userService.getLoggedUser(new SessionData(ctx.token(), request.getRemoteAddr()));
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
            @RequestBody SessionContext ctx,
            HttpServletRequest request
    ) {
        var userData = userService.getLoggedUser(new SessionData(ctx.token(), request.getRemoteAddr()));
        if (userData.isEmpty()) {
            return ResponseEntity.status(401).build();
        }
        if (userData.get().getRole() != UserRole.TICKET_INSPECTOR) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(ticketService.getAvailableTickets());
    }

    @GetMapping("/owned")
    public ResponseEntity<TicketPageReply> getOwnedTickets(
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size,
            @RequestBody SessionContext ctx,
            HttpServletRequest request
    ) {
        var userData = userService.getLoggedUser(new SessionData(ctx.token(), request.getRemoteAddr()));
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
            @RequestParam long ticketId,
            @RequestBody TicketBuyRequest body,
            HttpServletRequest request
    ) {
        var userData = userService.getLoggedUser(
                new SessionData(body.ctx().token(), request.getRemoteAddr())
        );
        if (userData.isEmpty()) {
            return ResponseEntity.status(401).build();
        }
        if (userData.get().getRole() != UserRole.PASSENGER) {
            return ResponseEntity.status(403).build();
        }

        return ticketService.buyTicket(ticketId, userData.get(), body.getActiveFrom().orElse(null))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).build());
    }

    @PostMapping("/use")
    public ResponseEntity<String> use(@RequestParam long ticketInstanceId) {
        return ticketService.useTicket(ticketInstanceId) ? ResponseEntity.ok().build() : ResponseEntity.status(404).body("Ticket to use not found!");
    }
}
