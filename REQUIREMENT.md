# Exam question

<!-- Paste the exact question/prompt below, verbatim. Nothing outside this file is a requirement. -->

Sample exam: Guestbook

  Time limit: 45 minutes

  Build a minimal full-stack guestbook where visitors can leave, edit and delete messages.

  Backend (Java 17+, Spring Boot, H2 in-memory database)

  1. POST /api/messages creates a message with:
     - name (required, not blank)
     - text (required, not blank, at most 200 characters)
     - createdAt, which the server sets
  2. GET /api/messages lists all messages, newest first.
  3. PUT /api/messages/{id} updates a message's text, with the same validation as when creating one. It also sets
     updatedAt, which the server controls.
  4. DELETE /api/messages/{id} deletes a message.
  5. Validation errors return 400 with a JSON error message. Unknown IDs return 404.
  6. Write unit tests for the service layer covering creating a message, editing a message, and editing or deleting a
     message that doesn't exist (404).

  Frontend (React)

  1. A single page lists all messages, each showing the name, text and date. Edited messages show an "(edited)" label.
  2. A form with name and message fields and a "Post" button adds a message. The new message appears at the top of the
     list without reloading the page.
  3. Each message has an Edit button. Clicking it turns the text into an input with Save and Cancel buttons.
  4. Each message has a Delete button. Ask for confirmation first, then remove the message from the list.
  5. If any action fails, show the server's error message.

  Out of scope

  No authentication or ownership checks (anyone can edit or delete any message), no editing the name, no pagination and
  no deployment.

  Deliverable

  A working app plus a short README explaining how to run the backend and frontend.

## Time

- Given at: 2026-10-01 10:57 IST
- Limit: 45 minutes (deadline 11:42 IST)

## Checklist

- [x] B1 POST /api/messages {name, text} -> 201 with id, name, text, createdAt (server-set), updatedAt null
- [x] B2 GET /api/messages returns all messages ordered by createdAt desc
- [x] B3 PUT /api/messages/{id} {text} updates text (same text validation) and sets server-controlled updatedAt
- [x] B4 DELETE /api/messages/{id} -> 204
- [x] B5 Validation failure -> 400 JSON {"message": ...}; unknown id on PUT/DELETE -> 404 JSON {"message": ...}
- [x] B6 Service unit tests: create, edit, edit-missing (404), delete-missing (404)
- [x] F1 Single page lists messages with name, text, date; "(edited)" when updatedAt is set
- [x] F2 Form with name + message fields and "Post" button; new message prepended without reload
- [x] F3 Edit button turns text into input with Save / Cancel
- [x] F4 Delete button asks for confirmation (window.confirm), then removes message from list
- [x] F5 Any failed action shows the server's error message
- [x] D1 README with how to run backend and frontend

## Clarifications / assumptions

- Error body shape is `{"message": "<text>"}` for both 400 and 404; multiple field errors are joined into one message.
- POST returns 201 Created, DELETE returns 204 No Content, PUT returns 200 with the updated message.
- Confirmation before delete uses the browser's native `window.confirm`.
- "Edited" means `updatedAt` is non-null; it is null until the first PUT.
- Frontend calls the backend through the Vite dev-server proxy (`/api` -> `http://localhost:8080`), so no CORS config is needed.
- No pagination on GET, per the exam's out-of-scope list (overrides the paging convention).
- Primary key is an auto-increment Long.
- Timestamps are set by the service from an injected `Clock`, not `@CreationTimestamp`/`@UpdateTimestamp`: Hibernate's `@UpdateTimestamp` also fills the field on insert, which would mark every new message "(edited)".
- Name is capped at 100 characters (not in the prompt) so an over-long name is a 400 instead of a database error.
- Framework errors (405, 415, unknown path) keep their own status and use the same `{"message"}` body; only genuinely unexpected errors become 500.
- Spring Boot 4.1.1 (current Initializr default) on Java 21 rather than Boot 3; it satisfies "Java 17+, Spring Boot".

## Closing note

All checklist items are built and tested. Backend: 13 tests (6 service, 6 controller, 1 context). Frontend: 22 tests across the API layer, `MessageForm`, `MessageItem` and `App`. Every endpoint was also smoke-tested end to end through the Vite proxy against the running backend. Self-review: the React reviewer found nothing blocking; the Java reviewer flagged the catch-all handler masking framework 4xx errors as 500, which is fixed and covered by a test. Nothing was cut for time. Run instructions are in `README.md`.
