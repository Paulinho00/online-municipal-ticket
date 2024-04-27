package com.example.onlinemunicipalticket.service;

import com.example.onlinemunicipalticket.domain.SessionData;
import com.example.onlinemunicipalticket.domain.UserData;
import com.example.onlinemunicipalticket.repository.SessionRepository;
import com.example.onlinemunicipalticket.repository.UserRepository;
import com.example.onlinemunicipalticket.service.dto.RegistrationForm;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;

    public Optional<UserData> getLoggedUser(SessionData sessionData) {
        return sessionRepository.findLoggedUser(sessionData);
    }

    public Optional<Long> login(String email, String password, String ipAddress) {
        var user = userRepository.findByEmail(email);
        if (user.isEmpty() || !user.get().getPassword().equals(password)) {
            return Optional.empty();
        }

        var sessionData = new SessionData(sessionRepository.generateToken(ipAddress), ipAddress);
        sessionRepository.save(sessionData, user.get());

        return Optional.of(sessionData.token());
    }

    public void logout(SessionData sessionData) {
        sessionRepository.remove(sessionData);
    }

    public boolean registerAccount(RegistrationForm form) {
        if(userRepository.findByEmail(form.email()).isPresent()) {
            return false;
        }

        var user = UserData.fromRegistrationForm(form);
        userRepository.save(user);

        return true;
    }
}
