package com.example.onlinemunicipalticket;

import org.h2.tools.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class H2Config {

    @Bean(initMethod = "start", destroyMethod = "stop")
    public Server h2TcpConsoleServer() throws java.sql.SQLException {
        return Server.createTcpServer("-tcp");
    }
}
