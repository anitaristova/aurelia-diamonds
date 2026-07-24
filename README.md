# Aurelia Diamonds

A single-brand jewelry e-commerce web application built on the MERN stack
(MongoDB, Express, React, Node.js). The project runs locally through Docker.

## Requirements

- Docker and Docker Compose

## Getting Started

1. Copy the example environment file and adjust values as needed:

   ```bash
   cp .env.example .env
   ```

   At minimum, set a strong `JWT_SECRET` and an `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
   The admin account is created automatically on first startup if it does not
   already exist. The application otherwise starts with empty data.

2. Start the stack:

   ```bash
   docker compose up --build
   ```

3. Open the app:

   - Storefront: http://localhost:5173
   - API health: http://localhost:5000/api/health

## Project Structure

```
client/   React + Vite frontend
server/   Express + Mongoose API
```

The Vite dev server proxies `/api` requests to the backend, so the browser only
needs to talk to the client port during development.

## Services

- `mongo`  — MongoDB database
- `server` — Express API
- `client` — React (Vite) dev server
