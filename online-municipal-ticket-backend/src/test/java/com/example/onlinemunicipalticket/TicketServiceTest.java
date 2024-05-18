package com.example.onlinemunicipalticket;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import com.example.onlinemunicipalticket.domain.Ticket;
import com.example.onlinemunicipalticket.domain.TicketInstance;
import com.example.onlinemunicipalticket.domain.TicketType;
import com.example.onlinemunicipalticket.domain.UserData;
import com.example.onlinemunicipalticket.domain.UserRole;
import com.example.onlinemunicipalticket.repository.TicketInstanceRepository;
import com.example.onlinemunicipalticket.repository.TicketRepository;
import com.example.onlinemunicipalticket.service.TicketService;
import com.example.onlinemunicipalticket.service.dto.TicketModel;
import com.example.onlinemunicipalticket.service.dto.TicketPageReply;

import jakarta.servlet.http.HttpServletRequest;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
public class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private TicketInstanceRepository ticketInstanceRepository;

    // @Mock
    // HttpServletRequest request;

    @InjectMocks
    private TicketService ticketService;

    @Test
    public void testCheckTicketPeriodicValid() {
        // given
        UserData user = new UserData("Michal", "Sikacki", "user11@email.com", "password11", UserRole.PASSENGER);

        Ticket ticket = new Ticket();
        ticket.setTicketType(TicketType.PERIODIC);
        ticket.setDurationSeconds(24*3600L);
        ticket.setPrice(BigDecimal.valueOf(30.00));
        ticket.setReduced(false);

        TicketInstance ticketInstance = new TicketInstance(user, ticket);
        ticketInstance.setPurchaseTimestamp(Instant.now());
        ticketInstance.setActivationTimestamp(Instant.now());

        // when
        when(ticketInstanceRepository.findById(ticketInstance.getId())).thenReturn(Optional.of(ticketInstance));
        boolean result = ticketService.checkTicket(ticketInstance.getId(), null);

        // then
        assertTrue(result);
    }

    @Test
    public void testCheckTicketPeriodicInValid() {
        // given
        UserData user = new UserData("Michal", "Sikacki", "user11@email.com", "password11", UserRole.PASSENGER);

        Ticket ticket = new Ticket();
        ticket.setTicketType(TicketType.PERIODIC);
        ticket.setDurationSeconds(24*3600L);
        ticket.setPrice(BigDecimal.valueOf(30.00));
        ticket.setReduced(false);

        TicketInstance ticketInstance = new TicketInstance(user, ticket);
        ticketInstance.setPurchaseTimestamp(Instant.now().minusSeconds(25*3600L));
        ticketInstance.setActivationTimestamp(Instant.now().minusSeconds(25*3600L));

        // when
        when(ticketInstanceRepository.findById(ticketInstance.getId())).thenReturn(Optional.of(ticketInstance));
        boolean result = ticketService.checkTicket(ticketInstance.getId(), null);

        // then
        assertFalse(result);
    }

    @Test
    public void testCheckTicketTimedValid() {
        // given
        UserData user = new UserData("Michal", "Sikacki", "user11@email.com", "password11", UserRole.PASSENGER);

        Ticket ticket = new Ticket();
        ticket.setTicketType(TicketType.TIMED);
        ticket.setDurationSeconds(3600L);
        ticket.setPrice(BigDecimal.valueOf(2.00));
        ticket.setReduced(false);

        TicketInstance ticketInstance = new TicketInstance(user, ticket);
        ticketInstance.setPurchaseTimestamp(Instant.now().minusSeconds(3700L));
        ticketInstance.setActivationTimestamp(Instant.now().minusSeconds(900L));

        // when
        when(ticketInstanceRepository.findById(ticketInstance.getId())).thenReturn(Optional.of(ticketInstance));
        boolean result = ticketService.checkTicket(ticketInstance.getId(), null);

        // then
        assertTrue(result);
    }

    @Test
    public void testCheckTicketTimedInValid() {
        // given
        UserData user = new UserData("Michal", "Sikacki", "user11@email.com", "password11", UserRole.PASSENGER);

        Ticket ticket = new Ticket();
        ticket.setTicketType(TicketType.TIMED);
        ticket.setDurationSeconds(3600L);
        ticket.setPrice(BigDecimal.valueOf(2.00));
        ticket.setReduced(false);

        TicketInstance ticketInstance = new TicketInstance(user, ticket);
        ticketInstance.setPurchaseTimestamp(Instant.now().minusSeconds(4000L));
        ticketInstance.setActivationTimestamp(Instant.now().minusSeconds(3700L));

        // when
        when(ticketInstanceRepository.findById(ticketInstance.getId())).thenReturn(Optional.of(ticketInstance));
        boolean result = ticketService.checkTicket(ticketInstance.getId(), null);

        // then
        assertFalse(result);
    }

    @Test
    public void testCheckTicketDisposableNotValidated() {
        // given
        long ticketInstanceId = 1L;
        String vehicleId = "123";

        UserData user = new UserData("Michal", "Sikacki", "user11@email.com", "password11", UserRole.PASSENGER);

        Ticket ticket = new Ticket();
        ticket.setTicketType(TicketType.DISPOSABLE);
        ticket.setPrice(BigDecimal.valueOf(5.00));
        ticket.setReduced(false);

        TicketInstance ticketInstance = new TicketInstance(user, ticket);
        ticketInstance.setPurchaseTimestamp(Instant.now().minusSeconds(1800));
        ticketInstance.setVehicleId(vehicleId);

        // when
        when(ticketInstanceRepository.findById(ticketInstanceId)).thenReturn(Optional.of(ticketInstance));
        boolean result = ticketService.checkTicket(ticketInstanceId, vehicleId);

        // then
        assertFalse(result);
    }

    @Test
    public void testCheckTicketDisposableInvalidVehicle() {
        // given
        long ticketInstanceId = 1L;
        String vehicleId = "124";

        UserData user = new UserData("Michal", "Sikacki", "user11@email.com", "password11", UserRole.PASSENGER);

        Ticket ticket = new Ticket();
        ticket.setTicketType(TicketType.DISPOSABLE);
        ticket.setPrice(BigDecimal.valueOf(5.00));
        ticket.setReduced(false);

        TicketInstance ticketInstance = new TicketInstance(user, ticket);
        ticketInstance.setPurchaseTimestamp(Instant.now().minusSeconds(1800));
        ticketInstance.setActivationTimestamp(Instant.now().minusSeconds(1700));
        ticketInstance.setVehicleId("123");

        // when
        when(ticketInstanceRepository.findById(ticketInstanceId)).thenReturn(Optional.of(ticketInstance));
        boolean result = ticketService.checkTicket(ticketInstanceId, vehicleId);

        // then
        assertFalse(result);
    }

    @Test
    public void testCheckTicketDisposableValid() {
        // given
        long ticketInstanceId = 1L;
        String vehicleId = "124";

        UserData user = new UserData("Michal", "Sikacki", "user11@email.com", "password11", UserRole.PASSENGER);

        Ticket ticket = new Ticket();
        ticket.setTicketType(TicketType.DISPOSABLE);
        ticket.setPrice(BigDecimal.valueOf(5.00));
        ticket.setReduced(false);

        TicketInstance ticketInstance = new TicketInstance(user, ticket);
        ticketInstance.setPurchaseTimestamp(Instant.now().minusSeconds(1800));
        ticketInstance.setActivationTimestamp(Instant.now().minusSeconds(1700));
        ticketInstance.setVehicleId("124");

        // when
        when(ticketInstanceRepository.findById(ticketInstanceId)).thenReturn(Optional.of(ticketInstance));
        boolean result = ticketService.checkTicket(ticketInstanceId, vehicleId);

        // then
        assertTrue(result);
    }

    @Test
    public void testGetAvailableTicketsReturnsCorrectTickets() {
        // given
        Ticket ticket1 = new Ticket();
        ticket1.setDurationSeconds(48*3600L);
        ticket1.setPrice(BigDecimal.valueOf(30.00));
        ticket1.setReduced(false);
        ticket1.setTicketType(TicketType.PERIODIC);

        Ticket ticket2 = new Ticket();
        ticket2.setPrice(BigDecimal.valueOf(4.00));
        ticket2.setReduced(false);
        ticket2.setTicketType(TicketType.DISPOSABLE);

        Ticket ticket3 = new Ticket();
        ticket3.setDurationSeconds(1800L);
        ticket3.setPrice(BigDecimal.valueOf(2.00));
        ticket3.setReduced(false);
        ticket3.setTicketType(TicketType.TIMED);

        // when
        when(ticketRepository.findAll()).thenReturn(Arrays.asList(ticket1, ticket2, ticket3));
        Collection<TicketModel> availableTickets = ticketService.getAvailableTickets();

        // then
        assertEquals(3, availableTickets.size());
    }

    @Test
    public void testGetOwnedTicketsReturnsCorrectOwnedTickets() {
        // given
        long userId = 123;
        int page = 0;
        int size = 10;

        UserData user = new UserData("Michal", "Sikacki", "user11@email.com", "password11", UserRole.PASSENGER);
    
        Ticket ticket = new Ticket();
        ticket.setTicketType(TicketType.DISPOSABLE);
        ticket.setPrice(BigDecimal.valueOf(5.00));
        ticket.setReduced(false);

        TicketInstance ticketInstance1 = new TicketInstance(user, ticket);
        ticketInstance1.setPurchaseTimestamp(Instant.now().minusSeconds(1800));
        ticketInstance1.setActivationTimestamp(Instant.now().minusSeconds(1700));
        ticketInstance1.setVehicleId("124");

        TicketInstance ticketInstance2 = new TicketInstance(user, ticket);
        ticketInstance2.setPurchaseTimestamp(Instant.now().minusSeconds(1800));
        ticketInstance2.setActivationTimestamp(Instant.now().minusSeconds(1700));
        ticketInstance2.setVehicleId("125");
    
        List<TicketInstance> ticketInstances = Arrays.asList(ticketInstance1, ticketInstance2);
        Page<TicketInstance> ticketInstancePage = new PageImpl<>(ticketInstances);
    
        // when
        when(ticketInstanceRepository.findByUserIdOrderByPurchaseTimestampDesc(userId, PageRequest.of(page, size)))
                .thenReturn(ticketInstancePage);
        TicketPageReply ticketPageReply = ticketService.getOwnedTickets(userId, page, size);
    
        // then
        assertNotNull(ticketPageReply);
        assertEquals(2, ticketPageReply.tickets().size());
    }

    @Test
    public void testBuyTicketPeriodicSuccess() {
        // given
        UserData user = new UserData("Michal", "Sikacki", "user11@email.com", "password11", UserRole.PASSENGER);

        Ticket ticket = new Ticket();
        ticket.setTicketType(TicketType.PERIODIC);
        ticket.setDurationSeconds(24*3600L);
        ticket.setPrice(BigDecimal.valueOf(30.00));
        ticket.setReduced(false);
        Long ticketId = 1L;
        Instant activeFrom = Instant.now();

        TicketInstance ticketInstance = new TicketInstance(user, ticket);
        ticketInstance.setActivationTimestamp(activeFrom);

        // when
        when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(ticket));
        when(ticketInstanceRepository.save(any(TicketInstance.class))).thenAnswer(invocation -> {
            TicketInstance savedInstance = invocation.getArgument(0);
            return savedInstance;
        });

        Optional<Long> result = ticketService.buyTicket(ticketId, user, activeFrom);

        // then
        assertEquals(ticketInstance.getId(), result.orElse(null));
        verify(ticketInstanceRepository, times(1)).save(ticketInstance);
    }

    @Test
    public void testBuyTicketDisposableSuccess() {
        // given
        UserData user = new UserData("Michal", "Sikacki", "user11@email.com", "password11", UserRole.PASSENGER);

        Ticket ticket = new Ticket();
        ticket.setTicketType(TicketType.DISPOSABLE);
        ticket.setPrice(BigDecimal.valueOf(3.00));
        ticket.setReduced(false);
        Long ticketId = 2L;

        TicketInstance ticketInstance = new TicketInstance(user, ticket);

        // when
        when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(ticket));
        when(ticketInstanceRepository.save(any(TicketInstance.class))).thenAnswer(invocation -> {
            TicketInstance savedInstance = invocation.getArgument(0);
            return savedInstance;
        });

        Optional<Long> result = ticketService.buyTicket(ticketId, user, null);

        // then
        assertEquals(ticketInstance.getId(), result.orElse(null));
        verify(ticketInstanceRepository, times(1)).save(ticketInstance);
    }

    @Test
    public void testBuyTicketTimedSuccess() {
        // given
        UserData user = new UserData("Michal", "Sikacki", "user11@email.com", "password11", UserRole.PASSENGER);

        Ticket ticket = new Ticket();
        ticket.setTicketType(TicketType.TIMED);
        ticket.setDurationSeconds(1800L);
        ticket.setPrice(BigDecimal.valueOf(2.00));
        ticket.setReduced(false);
        Long ticketId = 3L;

        TicketInstance ticketInstance = new TicketInstance(user, ticket);

        // when
        when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(ticket));
        when(ticketInstanceRepository.save(any(TicketInstance.class))).thenAnswer(invocation -> {
            TicketInstance savedInstance = invocation.getArgument(0);
            return savedInstance;
        });

        Optional<Long> result = ticketService.buyTicket(ticketId, user, null);

        // then
        assertEquals(ticketInstance.getId(), result.orElse(null));
        verify(ticketInstanceRepository, times(1)).save(ticketInstance);
    }

    @Test
    public void testBuyTicketWhenTicketNotFound() {
        // given
        long nonExistingTicketId = 999L;
        UserData user = new UserData("Michal", "Sikacki", "user11@email.com", "password11", UserRole.PASSENGER);

        // when
        when(ticketRepository.findById(nonExistingTicketId)).thenReturn(Optional.empty());
        Optional<Long> result = ticketService.buyTicket(nonExistingTicketId, user, null);

        // then
        assertEquals(Optional.empty(), result);
    }

    @Test
    public void testBuyTicketWhenUserIsNull() {

        // given
        long ticketId = 1L;
        Ticket ticket = new Ticket();
        ticket.setTicketType(TicketType.PERIODIC);
        ticket.setDurationSeconds(24 * 3600L);
        ticket.setPrice(BigDecimal.valueOf(30.00));
        ticket.setReduced(false);
        Instant activeFrom = Instant.now();

        // when
        when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(ticket));
        Optional<Long> result = ticketService.buyTicket(ticketId, null, activeFrom);

        // then
        assertEquals(Optional.empty(), result);
    }

    @Test
    public void testUseTicketSuccess() {
        // given
        UserData user = new UserData("Michal", "Sikacki", "user11@email.com", "password11", UserRole.PASSENGER);

        Ticket ticket = new Ticket();
        ticket.setTicketType(TicketType.DISPOSABLE);
        ticket.setPrice(BigDecimal.valueOf(5.00));
        ticket.setReduced(false);

        long ticketInstanceId = 1L;
        TicketInstance ticketInstance = new TicketInstance(user, ticket);
        ticketInstance.setVehicleId("123");

        // when
        when(ticketInstanceRepository.findById(ticketInstanceId)).thenReturn(Optional.of(ticketInstance));
        boolean result = ticketService.useTicket(ticketInstanceId, "123");

        // then
        assertTrue(result);
        assertTrue(ticketInstance.isUsed());
        assertNotNull(ticketInstance.getActivationTimestamp());
    }

    @Test
    public void testUseTicketWithAlreadyUsedTicket() {
        // given
        UserData user = new UserData("Michal", "Sikacki", "user11@email.com", "password11", UserRole.PASSENGER);

        Ticket ticket = new Ticket();
        ticket.setTicketType(TicketType.TIMED);
        ticket.setDurationSeconds(1800L);
        ticket.setPrice(BigDecimal.valueOf(2.00));
        ticket.setReduced(false);

        long ticketInstanceId = 1L;
        TicketInstance usedTicketInstance = new TicketInstance(user, ticket);
        usedTicketInstance.setActivationTimestamp(Instant.now());
        
        // when
        when(ticketInstanceRepository.findById(ticketInstanceId)).thenReturn(Optional.of(usedTicketInstance));
        boolean result = ticketService.useTicket(ticketInstanceId, null);
    
        // then
        assertFalse(result);
    }

    @Test
    public void testUseTicketWithNonExistingTicketInstance() {
        // given
        long nonExistingTicketInstanceId = 1L;

        // when
        when(ticketInstanceRepository.findById(nonExistingTicketInstanceId)).thenReturn(Optional.empty());
        boolean result = ticketService.useTicket(nonExistingTicketInstanceId, null);

        // then
        assertFalse(result);
    }
}
