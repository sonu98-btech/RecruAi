# AI Calling CRM — Backend

SaaS backend for an automated calling and recruitment platform. Companies (tenants) manage candidates, clients, leads, recruiters, calls, follow-ups, and AI call intelligence.

This is a production-oriented **4-layer** Node.js API (Controller → Service → Repository → MongoDB), not a thin CRUD demo. Telephony and LLM providers are behind adapters so Twilio, SIP/WebRTC, Whisper, and local models can be plugged in without rewriting CRM logic.

## Stack

- Node.js, Express, MongoDB, Mongoose
- ES Modules
- JWT in HTTP-only cookies, bcrypt
- Helmet, CORS, rate limiting, Multer, Socket.io, Nodemailer

## Quick start

```bash
cd backend
copy .env.example .env   # Windows
# cp .env.example .env  # macOS / Linux

# Edit JWT_SECRET and MONGODB_URI in .env

npm install
npm run seed             # creates SUPER_ADMIN from .env
npm run dev              # http://localhost:5000
```

Health check: `GET /health`

## Folder structure

```
backend/
  src/
    config/           db + env
    controllers/      HTTP only
    services/         business logic + AI/telephony adapters
    repositories/     mongoose only
    models/           schemas
    routes/
    middleware/       auth, role, tenant, errors
    utils/
    validators/
    sockets/
    uploads/
    scripts/          seed
    app.js
    server.js
  docs/
    ARCHITECTURE.md
    API.md
  .env.example
  package.json
```

## Auth bootstrap

1. `npm run seed` → Super Admin (`SEED_SUPER_ADMIN_EMAIL` / `SEED_SUPER_ADMIN_PASSWORD`).
2. `POST /api/auth/register-company` → tenant + Company Admin (also sets the auth cookie).
3. Company Admin `POST /api/users` → Recruiters / Agents.

Credentials are stored in an HTTP-only cookie named `accessToken` (see `COOKIE_NAME`). Super Admins acting on a tenant must send header `X-Company-Id`.

## Tenant isolation

Every business document includes `companyId`. Repositories always query with that scope. Company users cannot pass another company id. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Core capabilities

| Area | Behavior beyond CRUD |
| --- | --- |
| Candidates | Search, filters, pagination, status history, resume upload, company notifications |
| Leads | Convert lead → candidate |
| Calls | Credit consumption, Twilio adapter + status webhook, Socket.io updates |
| Campaigns | Start campaign queues outbound call records per candidate |
| AI | Demo transcript analyzer; pipeline stubs for STT → LLM → decision → TTS |
| Follow-ups | Due-reminder scheduler + Socket.io |
| Dashboard | Tenant KPIs and conversion rate |

## API

See [docs/API.md](docs/API.md).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Watch mode |
| `npm start` | Production process |
| `npm run seed` | Super Admin |

## License

UNLICENSED — private project.
