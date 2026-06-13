package com.researchhub.backend.config;

import com.researchhub.backend.entity.Role;
import com.researchhub.backend.entity.Scholarship;
import com.researchhub.backend.entity.User;
import com.researchhub.backend.repository.ScholarshipRepository;
import com.researchhub.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ScholarshipRepository scholarshipRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        
        // Seed Users
        if (userRepository.findByEmail("admin@researchhub.ai").isEmpty()) {
            System.out.println("Seeding database with default users...");
            
            User admin = User.builder()
                    .name("System Administrator")
                    .email("admin@researchhub.ai")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);

            User researcher = User.builder()
                    .name("Dr. Lokesh Yadav")
                    .email("researcher@cern.ch")
                    .password(passwordEncoder.encode("password"))
                    .role(Role.RESEARCHER)
                    .degree("Ph.D. in High Energy Physics")
                    .country("Switzerland")
                    .researchInterest("Quantum Field Theory")
                    .build();
            userRepository.save(researcher);

            User student = User.builder()
                    .name("Aspiring Student")
                    .email("student@university.edu")
                    .password(passwordEncoder.encode("password"))
                    .role(Role.STUDENT)
                    .degree("B.Sc. Physics")
                    .country("India")
                    .researchInterest("Particle Physics")
                    .build();
            userRepository.save(student);
        }

        // Seed Scholarships
        if (scholarshipRepository.count() == 0) {
            System.out.println("Seeding database with high-profile scholarships...");
            
            List<Scholarship> scholarships = List.of(
                Scholarship.builder()
                        .title("CERN Summer Student Programme")
                        .provider("CERN (European Organization for Nuclear Research)")
                        .country("Switzerland")
                        .deadline("2026-01-31")
                        .description("Join CERN in Geneva for a summer to work on advanced physics projects. An incredible opportunity to collaborate with world-class scientists and researchers.")
                        .requirements("Undergraduate in Physics, Computing, or Engineering. Minimum 3 years of university studies completed.")
                        .build(),
                Scholarship.builder()
                        .title("Google PhD Fellowship Program")
                        .provider("Google DeepMind")
                        .country("Global / USA")
                        .deadline("2026-03-15")
                        .description("Supporting exceptional graduate students doing exceptional research in computer science and related disciplines.")
                        .requirements("Full-time graduate student pursuing a PhD. Must be nominated by an eligible university.")
                        .build(),
                Scholarship.builder()
                        .title("Marie Skłodowska-Curie Actions (MSCA)")
                        .provider("European Commission")
                        .country("Europe")
                        .deadline("2026-09-11")
                        .description("Postdoctoral Fellowships supporting researchers' careers and fostering excellence in research.")
                        .requirements("Ph.D. degree. Maximum 8 years experience in research. Mobility rule applies.")
                        .build(),
                Scholarship.builder()
                        .title("DAAD EPOS Scholarship")
                        .provider("DAAD Germany")
                        .country("Germany")
                        .deadline("2026-10-01")
                        .description("Development-Related Postgraduate Courses (EPOS) for individuals from developing countries.")
                        .requirements("2 years of professional experience. Bachelor's degree in related field.")
                        .build(),
                Scholarship.builder()
                        .title("Stanford Knight-Hennessy Scholars")
                        .provider("Stanford University")
                        .country("USA")
                        .deadline("2026-10-10")
                        .description("Multidisciplinary, multicultural graduate fellowship program. Full funding for any graduate degree at Stanford.")
                        .requirements("Enrollment in a full-time Stanford graduate program. Demonstrated leadership and civic mindset.")
                        .build()
            );
            scholarshipRepository.saveAll(scholarships);
        }
    }
}
