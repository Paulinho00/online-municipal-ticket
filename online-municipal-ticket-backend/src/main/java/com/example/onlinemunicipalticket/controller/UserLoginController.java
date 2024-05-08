package com.example.onlinemunicipalticket.controller;

import com.example.onlinemunicipalticket.domain.SessionData;
import com.example.onlinemunicipalticket.service.UserService;
import com.example.onlinemunicipalticket.service.dto.AuthRequest;
import com.example.onlinemunicipalticket.service.dto.LoginReply;
import com.example.onlinemunicipalticket.service.dto.RegistrationForm;
import com.example.onlinemunicipalticket.service.dto.SessionContext;
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
            @Valid @RequestBody AuthRequest body,
            HttpServletRequest request
    ) {
        var token = userService.login(
                body.email(), body.password(),
                request.getRemoteAddr()
        );
        return token.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(401).build());
    }

    @PostMapping("/logout")
    public void logout(
            @RequestBody SessionContext ctx,
            HttpServletRequest request
    ) {
        userService.logout(new SessionData(ctx.token(), request.getRemoteAddr()));
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegistrationForm registrationForm) {
        userService.registerAccount(registrationForm);

        return userService.registerAccount(registrationForm) ?
                ResponseEntity.ok().build()
                : ResponseEntity.status(409).body("User with this email already exists");
    }
}
