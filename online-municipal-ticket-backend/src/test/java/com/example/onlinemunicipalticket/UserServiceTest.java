package com.example.onlinemunicipalticket;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.onlinemunicipalticket.domain.SessionData;
import com.example.onlinemunicipalticket.domain.UserData;
import com.example.onlinemunicipalticket.domain.UserRole;
import com.example.onlinemunicipalticket.repository.SessionRepository;
import com.example.onlinemunicipalticket.repository.UserRepository;
import com.example.onlinemunicipalticket.service.UserService;
import com.example.onlinemunicipalticket.service.dto.LoginReply;
import com.example.onlinemunicipalticket.service.dto.RegistrationForm;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

@SpringBootTest
public class UserServiceTest {
    
    @Mock
    UserRepository userRepository;

    @Mock
    SessionRepository sessionRepository;

    @InjectMocks
    UserService userService;

    private Validator validator;

    @Test
    public void testGetLoggedUserWhenUserIsLoggedIn() {
        // given
        SessionData sessionData = new SessionData(123456789L, "127.0.0.1");
        UserData userData = new UserData("Michal", "Sikacki", "user11@email.com", "password11", UserRole.PASSENGER);
        
        // when
        when(sessionRepository.findLoggedUser(sessionData)).thenReturn(Optional.of(userData));
        Optional<UserData> result = userService.getLoggedUser(sessionData);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(userData, result.get());
        verify(sessionRepository, times(1)).findLoggedUser(sessionData);
    }

    @Test
    public void testGetLoggedUserWhenUserIsNotLoggedIn() {
        // given
        Long invalidToken = 987654321L;
        SessionData sessionData = new SessionData(invalidToken, "127.0.0.1");
        
        // when
        when(sessionRepository.findLoggedUser(sessionData)).thenReturn(Optional.empty());
        Optional<UserData> result = userService.getLoggedUser(sessionData);

        // then
        assertTrue(result.isEmpty());
        verify(sessionRepository, times(1)).findLoggedUser(sessionData);
    }

    @Test
    public void testLoginWithValidCredentials() {
        // given
        UserData user = new UserData("Michal", "Sikacki", "user11@email.com", "password11", UserRole.PASSENGER);
        
        // when
        when(userRepository.findByEmail("user11@email.com")).thenReturn(Optional.of(user));
        when(sessionRepository.generateToken("127.0.0.1")).thenReturn(123456789L);
        Optional<LoginReply> result = userService.login("user11@email.com", "password11", "127.0.0.1");

        // then
        assertTrue(result.isPresent());
        assertEquals("123456789", result.get().token());
        assertEquals("Michal", result.get().name());
        assertEquals("Sikacki", result.get().lastName());
        assertEquals("PASSENGER", result.get().role());
    }

    @Test
    public void testLoginWithInvalidEmail() {

        // when
        when(userRepository.findByEmail("user11@email.com")).thenReturn(Optional.empty());
        Optional<LoginReply> result = userService.login("user11@email.com", "password11", "127.0.0.1");

        // then
        assertTrue(result.isEmpty());
    }

    @Test
    public void testLoginWithInvalidPassword() {
        // given
        UserData user = new UserData("Michal", "Sikacki", "user11@email.com", "password11", UserRole.PASSENGER);
        
        // when
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        Optional<LoginReply> result = userService.login("user11@email.com", "wrongpassword", "127.0.0.1");

        // then
        assertTrue(result.isEmpty());
    }

    @Test
    public void testSessionTokenGenerationAndSaving() {
        // given
        UserData user = new UserData("Michal", "Sikacki", "user11@email.com", "password11", UserRole.PASSENGER);
        
        // when
        when(userRepository.findByEmail("user11@email.com")).thenReturn(Optional.of(user));
        when(sessionRepository.generateToken("127.0.0.1")).thenReturn(123456789L);
        Optional<LoginReply> result = userService.login("user11@email.com", "password11", "127.0.0.1");

        // then
        assertTrue(result.isPresent());
        verify(sessionRepository, times(1)).generateToken("127.0.0.1");
        verify(sessionRepository, times(1)).save(any(SessionData.class), eq(user));

        ArgumentCaptor<SessionData> sessionDataCaptor = ArgumentCaptor.forClass(SessionData.class);
        verify(sessionRepository).save(sessionDataCaptor.capture(), eq(user));
        SessionData capturedSessionData = sessionDataCaptor.getValue();
        assertEquals(123456789L, capturedSessionData.token());
        assertEquals("127.0.0.1", capturedSessionData.ipAddress());
    }

    @Test
    public void testLoginWithNullPassword() {
        // given
        String email = "user11@email.com";
        UserData user = new UserData("Michal", "Sikacki", "user11@email.com", "password11", UserRole.PASSENGER);
        
        // when
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        Optional<LoginReply> result = userService.login(email, null, "127.0.0.1");

        // then
        assertTrue(result.isEmpty());
    }

    @Test
    public void testRegisterAccountWhenUserAlreadyExists() {
        // given
        RegistrationForm form = new RegistrationForm("Michal", "Sikacki", "user11@email.com", "password11");

        // when
        when(userRepository.findByEmail(form.email())).thenReturn(Optional.of(new UserData()));
        boolean result = userService.registerAccount(form);

        // then
        assertFalse(result);
        verify(userRepository, times(1)).findByEmail(form.email());
        verify(userRepository, never()).save(any(UserData.class));
    }

    @Test
    public void testRegisterAccountWhenUserDoesNotExist() {
        // given
        RegistrationForm form = new RegistrationForm("Michal", "Sikacki", "user11@email.com", "password11");
        
        // when
        when(userRepository.findByEmail(form.email())).thenReturn(Optional.empty());
        boolean result = userService.registerAccount(form);

        // then
        assertTrue(result);
        verify(userRepository, times(1)).findByEmail(form.email());

        ArgumentCaptor<UserData> userCaptor = ArgumentCaptor.forClass(UserData.class);
        verify(userRepository, times(1)).save(userCaptor.capture());
        UserData savedUser = userCaptor.getValue();
        assertEquals(form.name(), savedUser.getName());
        assertEquals(form.lastName(), savedUser.getLastName());
        assertEquals(form.email(), savedUser.getEmail());
        assertEquals(form.password(), savedUser.getPassword());
    }

    @Test
    public void testValidRegistrationForm() {

        // given
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        RegistrationForm form = new RegistrationForm("Michal", "Sikacki", "user11@email.com", "password11");

        // when
        Set<ConstraintViolation<RegistrationForm>> violations = validator.validate(form);

        // then
        assertTrue(violations.isEmpty());
    }

    @Test
    public void testRegisterNameIsBlank() {
        // given
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        RegistrationForm form = new RegistrationForm("", "Sikacki", "user11@email.com", "password11");

        // when
        Set<ConstraintViolation<RegistrationForm>> violations = validator.validate(form);

        // then
        assertFalse(violations.isEmpty());
        assertEquals(1, violations.size());
        assertEquals("Name is required", violations.iterator().next().getMessage());
    }

    @Test
    public void testRegisterLastNameIsBlank() {
        // given
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        RegistrationForm form = new RegistrationForm("Michal", "", "user11@email.com", "password11");

        // when
        Set<ConstraintViolation<RegistrationForm>> violations = validator.validate(form);

        // then
        assertFalse(violations.isEmpty());
        assertEquals(1, violations.size());
        assertEquals("Last name is required", violations.iterator().next().getMessage());
    }

    @Test
    public void testRegisterEmailIsBlank() {
        // given
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        RegistrationForm form = new RegistrationForm("Michal", "Sikacki", "", "password11");

        // when
        Set<ConstraintViolation<RegistrationForm>> violations = validator.validate(form);

        // then
        assertFalse(violations.isEmpty());
        assertEquals(1, violations.size());
        assertEquals("Email is required", violations.iterator().next().getMessage());
    }

    @Test
    public void testRegisterPasswordIsBlank() {
        // given
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        RegistrationForm form = new RegistrationForm("Michal", "Sikacki", "user11@email.com", "");

        // when
        Set<ConstraintViolation<RegistrationForm>> violations = validator.validate(form);

        // then
        assertFalse(violations.isEmpty());
        assertEquals(1, violations.size());
        assertEquals("Password must be at least 6 characters long", violations.iterator().next().getMessage());
    }

    @Test
    public void testRegisterEmailIsInvalid() {
        // given
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        RegistrationForm form = new RegistrationForm("Michal", "Sikacki", "invalidEmail", "password11");

        // when
        Set<ConstraintViolation<RegistrationForm>> violations = validator.validate(form);

        // then
        assertFalse(violations.isEmpty());
        assertEquals(1, violations.size());
        assertEquals("Invalid email format", violations.iterator().next().getMessage());
    }

    @Test
    public void testRegisterPasswordIsTooShort() {
        // given
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        RegistrationForm form = new RegistrationForm("Michal", "Sikacki", "user11@email.com", "pas");

        // when
        Set<ConstraintViolation<RegistrationForm>> violations = validator.validate(form);

        // then
        assertFalse(violations.isEmpty());
        assertEquals(1, violations.size());
        assertEquals("Password must be at least 6 characters long", violations.iterator().next().getMessage());
    }

    @Test
    public void testLogoutRemovesSession() {
        // given
        SessionData sessionData = new SessionData(123456789L, "127.0.0.1");
        
        // when
        when(sessionRepository.exists(sessionData)).thenReturn(true);
        userService.logout(sessionData);

        // then
        verify(sessionRepository, times(1)).remove(sessionData);
    }

    @Test
    public void testLogoutNonExistingSession() {
        // given
        SessionData sessionData = new SessionData(987654321L, "127.0.0.1");

        // when & then
        when(sessionRepository.exists(sessionData)).thenReturn(false);
        assertThrows(IllegalArgumentException.class, () -> userService.logout(sessionData));
        verify(sessionRepository, never()).remove(any(SessionData.class));
    }
}
