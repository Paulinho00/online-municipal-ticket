package com.example.onlinemunicipalticket.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;

@Data
@Entity
public class User {

    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private long id;

    @NotNull
    private String name;

    @NotNull
    private String lastName;

    @NotNull
    private String email;

    @NotNull
    private String password;

    @NotNull
    private UserRole role;
}
