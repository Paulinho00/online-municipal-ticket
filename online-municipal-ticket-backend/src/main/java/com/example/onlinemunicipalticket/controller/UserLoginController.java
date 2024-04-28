package com.example.onlinemunicipalticket.controller;

import com.example.onlinemunicipalticket.domain.SessionData;
import com.example.onlinemunicipalticket.service.UserService;
import com.example.onlinemunicipalticket.service.dto.LoginReply;
import com.example.onlinemunicipalticket.service.dto.RegistrationForm;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/login")
@RequiredArgsConstructor(onConstructor_ = @Autowired, access = AccessLevel.PACKAGE)
public class UserLoginController {

    private final UserService userService;

    @PostMapping()
    public ResponseEntity<LoginReply> login(
            @RequestParam String email,
            @RequestParam String password,
            HttpServletRequest request
    ) {
        var token = userService.login(email, password, request.getRemoteAddr());
        return token.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(401).build());
    }

    @PostMapping("/logout")
    public void logout(
            @RequestParam Long token,
            HttpServletRequest request
    ) {
        userService.logout(new SessionData(token, request.getRemoteAddr()));
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegistrationForm registrationForm) {
        userService.registerAccount(registrationForm);

        return userService.registerAccount(registrationForm) ?
                ResponseEntity.ok().build()
                : ResponseEntity.status(409).body("User with this email already exists");
    }
}
