package com.researchhub.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "research_projects")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResearchProject {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String status;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = "PLANNING";
    }
}
