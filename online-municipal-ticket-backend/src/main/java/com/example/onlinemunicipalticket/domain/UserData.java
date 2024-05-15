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
@Table(name = "USER_DATA")
public class UserData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
    @Enumerated(EnumType.STRING)
    private UserRole role;

    public UserData(String firstName, String lastName, String email, String password, UserRole userRole) {
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
