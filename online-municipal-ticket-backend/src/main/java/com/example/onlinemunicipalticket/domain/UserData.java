package com.example.onlinemunicipalticket.domain;

import com.example.onlinemunicipalticket.service.dto.RegistrationForm;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Entity
@NoArgsConstructor
public class UserData {

    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private long id;

    @NotNull
    private String name;

    @NotNull
    private String lastName;

    @NotNull
    @Column(unique = true)
    private String email;

    @NotNull
    private String password;

    @NotNull
    private UserRole role;

    private UserData(String firstName, String lastName, String email, String password, UserRole userRole) {
        this.name = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = userRole;
    }

    public static UserData fromRegistrationForm(RegistrationForm registrationForm) {
        return new UserData(registrationForm.name(), registrationForm.lastName(), registrationForm.email(), registrationForm.password(), UserRole.PASSENGER);
    }
}
