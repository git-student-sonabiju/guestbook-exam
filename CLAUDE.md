# CLAUDE.md

Full-stack guestbook. Requirements live in `REQUIREMENT.md`.

## Layout

- `backend/` - Spring Boot 4, Java 21, Maven wrapper, H2 in-memory. Package `com.example.guestbook`
  split into `controller`, `service`, `repository`, `entity`, `dto`, `exception`, `config`.
- `frontend/` - Vite + React 19 + TypeScript. `src/api/messages.ts` is the only place that calls
  `fetch`; components live in `src/components/<Name>/` with their tests beside them.

## Commands

- Backend: `cd backend && ./mvnw test`, run with `./mvnw spring-boot:run` (port 8080)
- Frontend: `cd frontend && npm run lint && npm test && npm run build`, run with `npm run dev`
  (port 5173, proxies `/api` to 8080)

## Conventions

- Errors are returned as `{"message": "..."}` via `GlobalExceptionHandler`.
- Timestamps come from the injected `Clock` bean so service tests can fix time.
- No comments in source files.
