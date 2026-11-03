# Contacts API

REST API for a personal contacts book with user accounts — homework project from the
[GoIT](https://goit.global) Fullstack course (Node.js module).

**Live API:** [nodejs-hw-mongodb-e8vb.onrender.com](https://nodejs-hw-mongodb-e8vb.onrender.com)
— deployed from the `hw6-email-and-images` branch, so it does not include the Swagger docs and
the latest fixes from `main` yet. Free Render instance: the first request after a pause can take
up to a minute. API documentation (Swagger UI) is served at `/api-docs` when you run `main` locally.

## Features

- **Auth with JWT:** register, login, refresh and logout; access token (15 min) + refresh token
  and session id in httpOnly cookies (7 days)
- **Password reset by email:** a reset link is sent through the [Brevo](https://www.brevo.com) API
- **Contacts per user:** every contact belongs to the logged-in user
- **Pagination, sorting and filters:** `page`, `perPage`, `sortBy`, `sortOrder`, `type`, `isFavourite`
- **Contact photos:** upload with `multipart/form-data`, stored in [Cloudinary](https://cloudinary.com)
- **Validation** of request bodies with [Joi](https://joi.dev); errors as JSON with HTTP status codes
- **OpenAPI 3 docs** bundled with [Redocly](https://redocly.com) and served by Swagger UI

## Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | Create an account |
| POST | `/auth/login` | Log in, returns an access token |
| POST | `/auth/refresh` | New access token from the refresh cookie |
| POST | `/auth/logout` | End the session |
| POST | `/auth/send-reset-email` | Send a password reset link |
| POST | `/auth/reset-pwd` | Set a new password with the reset token |
| GET | `/contacts` | List contacts (paginated, sortable, filterable) |
| GET | `/contacts/:contactId` | Get one contact |
| POST | `/contacts` | Create a contact (JSON or form data with `photo`) |
| PUT | `/contacts/:contactId` | Update a contact (JSON or form data with `photo`) |
| PATCH | `/contacts/:contactId` | Update a contact (JSON or form data with `photo`) |
| PATCH | `/contacts/:contactId/favorite` | Mark or unmark as favourite |
| DELETE | `/contacts/:contactId` | Delete a contact (204) |

All `/contacts` routes need `Authorization: Bearer <accessToken>`.

## Tech stack

Node.js 22 · Express 5 · MongoDB Atlas + Mongoose · JWT · bcryptjs · Joi · Multer · Cloudinary ·
Brevo API · pino-http · Swagger UI + Redocly · ESLint

## Run locally

```bash
npm ci
cp .env.example .env   # fill in MongoDB, JWT, Brevo and Cloudinary values
npm run dev            # http://localhost:3000, docs at http://localhost:3000/api-docs
npm run build-docs     # rebuild docs/swagger.json from docs/openapi.yaml
```
