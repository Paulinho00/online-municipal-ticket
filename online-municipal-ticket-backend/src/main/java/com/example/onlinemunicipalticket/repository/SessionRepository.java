package com.example.onlinemunicipalticket.repository;

import com.example.onlinemunicipalticket.domain.SessionData;
import com.example.onlinemunicipalticket.domain.UserData;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.util.Optional;
import java.util.Random;

@Slf4j
@Repository
public class SessionRepository {

    private final Cache<SessionData, UserData> cache;

    private static final Duration EXPIRE_TIME = Duration.ofSeconds(240);

    private static final Random RANDOM = new Random();

    public SessionRepository() {
        this.cache = Caffeine.newBuilder()
                .expireAfterAccess(EXPIRE_TIME)
                .expireAfterWrite(EXPIRE_TIME)
                .evictionListener(
                        (k, v, c) -> log.info("Session: '{}', of user: '{}' expired", k, v)
                )
                .build();
    }

    public void save(SessionData sessionData, UserData user) {
        cache.put(sessionData, user);
    }

    public Optional<UserData> findLoggedUser(SessionData sessionData) {
        return Optional.ofNullable(cache.getIfPresent(sessionData));
    }

    public void remove(SessionData sessionData) {
        cache.invalidate(sessionData);
    }

    public Long generateToken(String ipAddress) {
        var token = RANDOM.nextLong();
        while(cache.asMap().containsKey(new SessionData(token, ipAddress))) {
            token = RANDOM.nextLong();
        }

        return token;
    }
}
