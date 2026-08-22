# Architecture

## 1. Backend architecture

Requests enter Express in `app.js` (Helmet, CORS with credentials, JSON body, cookie parser, rate limit, static uploads).

```
HTTP / WebSocket
    → Controller     request/response only
    → Service        validation orchestration, credits, notifications, AI
    → Repository     mongoose queries, always tenant-scoped for CRM data
    → MongoDB
```

**Controllers** never import models. **Services** never send HTTP. **Repositories** never emit sockets or call Twilio.

Cross-cutting:

- `ApiError` + `asyncHandler` + global `error.middleware.js`
- Consistent JSON: `{ success, message, data }` / `{ success, message, error }`
- Audit log on candidate and user mutations

Swappable integrations live under `services/ai/` and `services/telephony/` so CRM modules stay provider-agnostic.

## 2. SaaS multi-tenancy

**Shared database, shared collections, mandatory `companyId` on tenant data** (row-level isolation). This is the usual early-stage SaaS pattern: one cluster, cheap to operate, indexes on `{ companyId, ... }`.

Hierarchy:

```
SUPER_ADMIN
  └── Company (tenant)
        ├── COMPANY_ADMIN
        ├── RECRUITER / AGENT
        └── Candidates, Clients, Leads, Calls, Follow-ups, Campaigns
```

`tenant.middleware.js`:

- Company users: `req.tenant.companyId = req.user.companyId`
- Super Admin: optional `X-Company-Id` (or `?companyId=`) to enter a tenant
- `requireTenant` blocks Super Admin from CRM routes without that header

Repositories call `scoped(companyId)` so a leaked ObjectId from another tenant cannot be read or updated.

Future split: move high-volume call recordings to object storage; if a customer requires physical isolation, shard by `companyId` or provision a dedicated database using the same schema.

## 3. Database design

| Collection | Role |
| --- | --- |
| users | Authn/z; `companyId` null only for SUPER_ADMIN |
| companies | Tenant + `subscription.{ plan, credits, status }` |
| candidates | Pipeline + `statusHistory` |
| clients | Hiring companies / reqs |
| leads | Top of funnel; convert to candidate |
| calls | Telephony metadata, transcript, `aiAnalysis` |
| followups | Reminders |
| campaigns | Bulk outbound lists + stats |
| notifications | Per-user inbox |
| auditlogs | Who did what |

Indexes favor `companyId` + time and unique email on users/companies.

**Credits:** creating a call decrements `subscription.credits` atomically (`$inc` with `$gte`). Campaign start best-effort queues calls until credits run out.

## 4. Twilio integration approach

`TwilioAdapter` is the only place Twilio credentials should be used.

1. Configure `TWILIO_*` in env.
2. `CallService.create` asks the adapter to place an outbound call and stores `telephony.providerCallSid`.
3. Twilio hits `POST /api/calls/webhooks/twilio/status` with `CallSid`, `CallStatus`, `CallDuration`, `RecordingUrl`.
4. Service maps Twilio statuses → `RINGING | CONNECTED | COMPLETED | MISSED | FAILED` and emits `call:updated` on the company Socket.io room.

Before production:

- Validate `X-Twilio-Signature`
- Serve TwiML from `/api/calls/webhooks/twilio/voice` (connect agent via `<Client>` / SIP / conference)
- Store recordings in S3/GCS; persist URL only
- Move campaign dialing to a job queue (BullMQ) instead of an in-request loop

SIP/WebRTC can implement the same adapter contract (`placeOutboundCall`, status webhooks) without changing controllers.

## 5. AI voice pipeline

Current demo path (no paid AI API):

```
transcript string
  → DemoLlmProvider (heuristics)
  → DecisionEngine (suggested CRM status / follow-up)
  → optional persist on Call.aiAnalysis
```

Target production path:

```
Phone call
  → Twilio / SIP
  → audio stream
  → Speech-to-text (local Whisper / Deepgram)
  → Local LLM (Ollama / llama.cpp) + optional RAG (job desc + company KB in a vector DB)
  → Decision engine
  → Text-to-speech
  → Candidate hears the agent / IVR
  → CRM update (call row, candidate status, follow-up)
```

Providers:

| File | Swap with |
| --- | --- |
| `services/ai/providers/stt.stub.js` | Whisper HTTP, Twilio Media Streams |
| `services/ai/providers/demoLlm.provider.js` | Ollama `chat` API |
| `services/ai/providers/tts.stub.js` | Piper / Coqui |
| `VECTOR_DB_URL` | Qdrant / pgvector embeddings of JD + FAQ |

`POST /api/ai/analyze-call` is the public contract for the demo. `POST /api/ai/calls/:id/analyze` writes analysis onto a tenant call.

## 6. Deployment architecture

Suggested production layout:

```
Internet
  → TLS terminator (Nginx / Cloudflare / ALB)
  → Node API replicas (stateless) + Socket.io sticky sessions or Redis adapter
  → MongoDB replica set
  → Object storage (resumes, recordings)
  → Optional Redis (rate limit, Socket.io, BullMQ)
  → Optional GPU/CPU worker box for Whisper + LLM
```

Process:

- `NODE_ENV=production`, `COOKIE_SECURE=true`, `COOKIE_SAMESITE=none` if API and SPA are on different sites (requires HTTPS)
- Restrict CORS `CLIENT_ORIGIN`
- Do not expose Mongo publicly
- Seed Super Admin once; disable public `register-company` later if you sell via sales-led onboarding
- Health: `GET /health` for load balancers
- Horizontal scale: run `node src/server.js` behind PM2 or a container orchestrator; put the follow-up interval on a single worker or a cron job so replicas do not duplicate reminders

Container sketch: Node 20 Alpine image, env from a secret manager, volume or S3 for `uploads/`.
