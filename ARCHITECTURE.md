# ResearchHub AI - Architecture Document

## High-Level Architecture
The platform is designed using a modern microservices-inspired monolithic architecture to balance rapid development with scalability.
It consists of a separated Next.js 16 frontend and a Spring Boot 3 backend, communicating via RESTful APIs over HTTPS.

### Components:
- **Frontend (Next.js 16 / React 19)**: Server-Side Rendered (SSR) and Client-Side Rendered (CSR) components for optimal performance and SEO. Uses Tailwind CSS and Shadcn UI for a premium enterprise look.
- **Backend (Spring Boot 3 / Java 21)**: Robust REST API handling business logic, authentication (JWT), and database interactions via Spring Data JPA.
- **Database (PostgreSQL)**: Relational database storing users, applications, projects, and structured scholarship data.
- **AI Integration (Google Gemini API)**: External service called by the backend to power the Eligibility Checker and Proposal Generator.
- **Containerization (Docker)**: Both frontend and backend are containerized, orchestratable via Docker Compose.

## Low-Level Design (LLD)

### Backend Layering
1. **Controller Layer**: Handles incoming HTTP requests, input validation, and delegates to the Service Layer. Uses DTOs to abstract internal entity representations.
2. **Service Layer**: Contains core business logic. Coordinates between Repositories and external APIs (like Gemini).
3. **Repository Layer**: Spring Data JPA interfaces for database access. Uses JPQL and native queries for optimized data fetching.
4. **Security Layer**: Intercepts requests, validates JWT access tokens, and enforces Role-Based Access Control (RBAC).
5. **Exception Handling**: `@ControllerAdvice` global exception handler returning standardized `ApiError` responses.

### Frontend Layering
1. **Pages/App Router**: Next.js App Router for server components and routing.
2. **Components**: Reusable UI elements (Shadcn UI).
3. **Services**: Axios instances configured with interceptors to handle token injection and refreshing.
4. **State Management**: TanStack Query (React Query) for caching and asynchronous state management.
5. **Context**: React Context for global auth state.
