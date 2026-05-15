# Docker setup

This project can run with or without Docker.

Docker does not replace the normal local workflow. You can still run the backend from IntelliJ or Maven and the frontend with `npm run dev`. The Docker setup is an optional full-stack runtime for the existing Spring Boot backend and Next.js frontend.

## What Docker runs

- `server`: Spring Boot backend on `http://localhost:8080`
- `client`: Next.js frontend on `http://localhost:3000`

Docker does not start a database container. The backend connects to the same Neon PostgreSQL database you configure through environment variables.

## First-time setup

Copy the documented Docker environment file:

```powershell
Copy-Item .env.docker.example .env.docker
```

Then fill in `.env.docker` with your real Neon, JWT, Cloudinary, and mail values.

The `.env.docker` file is ignored by Git and should not be committed.

## Run with Docker

Use `--env-file` so Docker Compose can use the same values for build-time frontend variables and runtime container variables:

```powershell
docker compose --env-file .env.docker up --build
```

Then open:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`

Stop the containers:

```powershell
docker compose down
```

## Run without Docker

Backend:

```powershell
cd server
.\mvnw.cmd spring-boot:run
```

Frontend:

```powershell
cd client
npm run dev
```

Your existing `server/.env` and `client/.env` local files can continue to use localhost or deployed service URLs as needed.

## Environment model

The Spring backend uses the `docker` profile only inside Compose:

```yaml
SPRING_PROFILES_ACTIVE: docker
```

The Docker profile keeps Docker-specific defaults separate from normal local development.

For the frontend, there are two API URL concepts:

- `NEXT_PUBLIC_API_URL`: browser-facing URL, usually `http://localhost:8080` for Docker
- `SERVER_API_URL`: internal Docker-network URL used by Next.js rewrites, usually `http://server:8080`

This split matters because the browser is outside Docker, while the Next.js server container is inside Docker.

## Production notes

For Vercel, keep setting frontend environment variables in Vercel:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_WS_URL`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

For Render, keep setting backend environment variables in Render:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SIGNING_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`
- `MAIL_FROM`
- `FRONTEND_URL`
- `APP_CORS_ALLOWED_ORIGINS`

Set `APP_CORS_ALLOWED_ORIGINS` in Render to the deployed frontend origin, for example:

```text
https://law-connect2-0.vercel.app
```

If you need multiple allowed origins, separate them with commas:

```text
http://localhost:3000,https://law-connect2-0.vercel.app
```

## Useful checks

Validate Compose config:

```powershell
docker compose --env-file .env.docker config
```

Build images without starting containers:

```powershell
docker compose --env-file .env.docker build
```

View logs:

```powershell
docker compose logs -f server
docker compose logs -f client
```
