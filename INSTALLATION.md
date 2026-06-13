# Local Installation Guide

## Prerequisites
- **Java 21**
- **Node.js 20+**
- **Docker & Docker Compose** (Optional, for containerized local DB)
- **Maven 3.9+** (or use the provided wrapper)

## Environment Setup
1. Create a `.env` file in the `backend` directory based on `.env.example` (or set system variables).
   You will need a `GEMINI_API_KEY` to test the AI features.

## Running via Docker Compose (Recommended)
You can spin up the entire stack locally using Docker Compose.
```bash
docker-compose up --build
```
- Frontend will be available at `http://localhost:3000`
- Backend API will be available at `http://localhost:8080`
- PostgreSQL will run on `localhost:5432`

## Running Manually

### 1. Database
Run a local PostgreSQL instance or use Docker:
```bash
docker run --name researchhub-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

### 2. Backend
```bash
cd backend
./mvnw spring-boot:run
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
