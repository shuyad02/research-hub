# Deployment Guide

## Production Deployment Architecture

- **Frontend**: Deployed on **Vercel** for global Edge CDN delivery, automatic SSL, and seamless CI/CD integration.
- **Backend**: Deployed on **Render** or **Railway** via Docker containers.
- **Database**: Managed **Supabase PostgreSQL** instance.

## Step-by-Step Deployment

### 1. Database (Supabase)
1. Create a new project on Supabase.
2. Retrieve the PostgreSQL connection string.
3. (Optional) Run initial schema migration if not using Hibernate auto-ddl in prod.

### 2. Backend (Render/Railway)
1. Link your GitHub repository.
2. Set the root directory to `backend`.
3. Provide environment variables:
   - `SPRING_DATASOURCE_URL` (Supabase URL)
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   - `JWT_SECRET` (A strong randomly generated 256-bit key)
   - `GEMINI_API_KEY`
4. Deploy using the provided `Dockerfile`.

### 3. Frontend (Vercel)
1. Import the repository into Vercel.
2. Set the root directory to `frontend`.
3. Build command: `npm run build`
4. Output directory: `.next`
5. Environment Variables:
   - `NEXT_PUBLIC_API_URL` (URL of the deployed backend, e.g., `https://api.researchhub.com`)
6. Deploy.

## CI/CD Pipeline
A GitHub Actions workflow is provided in `.github/workflows/ci-cd.yml`.
It automatically builds the backend Maven project, runs JUnit tests, and verifies the frontend Next.js build on every push to `main`.
