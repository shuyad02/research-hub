package com.researchhub.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "scholarships")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Scholarship {
    @Id
    @GeneratedValue
    private UUID id;
    private String title;
    private String description;
    private String provider;
    private String country;
    private String deadline;
    private String requirements;
}
