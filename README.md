# Guestbook

A minimal full-stack guestbook: visitors can post, edit and delete messages.

- `backend/` - Spring Boot 4 (Java 21), H2 in-memory database, REST API on port 8080
- `frontend/` - React + TypeScript (Vite) on port 5173, proxying `/api` to the backend

## Prerequisites

- JDK 17+ (built and tested on 21)
- Node.js 20+ and npm

## Run the backend

```bash
cd backend
./mvnw spring-boot:run        # Windows: .\mvnw.cmd spring-boot:run
```

The API is at `http://localhost:8080/api/messages`. Data lives in memory and is reset on restart.

## Run the frontend

In a second terminal, with the backend running:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Tests

```bash
cd backend && ./mvnw test      # service unit tests + controller validation/404 tests
cd frontend && npm test        # component and API-layer tests (Vitest + Testing Library)
```

## API

| Method | Path | Body | Success |
|---|---|---|---|
| GET | `/api/messages` | - | 200, list newest first |
| POST | `/api/messages` | `{"name", "text"}` | 201, created message |
| PUT | `/api/messages/{id}` | `{"text"}` | 200, updated message |
| DELETE | `/api/messages/{id}` | - | 204 |

A message looks like `{"id", "name", "text", "createdAt", "updatedAt"}`; `updatedAt` is `null` until the
message is edited. Errors return `{"message": "..."}` with 400 for validation failures (name required,
text required and at most 200 characters) and 404 for unknown IDs.
