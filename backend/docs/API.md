# API documentation

Base URL: `http://localhost:5000`

All JSON responses:

**Success**

```json
{ "success": true, "message": "", "data": {} }
```

**Error**

```json
{ "success": false, "message": "", "error": "" }
```

Auth cookie: HTTP-only `accessToken` (or `Authorization: Bearer <jwt>`). Browser clients should use `credentials: 'include'`.

Super Admin tenant scope: header `X-Company-Id: <companyObjectId>` on CRM routes.

Query pagination (list endpoints): `page`, `limit` (max 100).

---

## Auth

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register-company` | No | Create tenant + company admin, set cookie |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/logout` | No | Clear cookie |
| GET | `/api/auth/me` | Yes | Current user |

### Register company

```json
{
  "companyName": "Acme Hiring",
  "industry": "IT",
  "name": "Priya Admin",
  "email": "admin@acme.test",
  "password": "Password1!",
  "phone": "+910000000000"
}
```

### Login

```json
{ "email": "admin@acme.test", "password": "Password1!" }
```

---

## Users (tenant)

Requires auth + company context. Create/update: `SUPER_ADMIN` or `COMPANY_ADMIN`.

| Method | Path |
| --- | --- |
| GET | `/api/users` |
| POST | `/api/users` |
| PATCH | `/api/users/:id` |

```json
{
  "name": "Ravi Recruiter",
  "email": "ravi@acme.test",
  "password": "Password1!",
  "phone": "+911111111111",
  "role": "RECRUITER"
}
```

Roles: `SUPER_ADMIN` | `COMPANY_ADMIN` | `RECRUITER` | `AGENT`.

---

## Companies

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/companies` | Super Admin: all; others: own company |
| POST | `/api/companies` | Super Admin only |
| GET | `/api/companies/:id` | |
| PATCH | `/api/companies/:id` | Super Admin may change subscription |

---

## Candidates

| Method | Path |
| --- | --- |
| POST | `/api/candidates` |
| GET | `/api/candidates` |
| GET | `/api/candidates/:id` |
| PUT | `/api/candidates/:id` |
| DELETE | `/api/candidates/:id` |
| POST | `/api/candidates/:id/resume` | multipart field `resume` (PDF/DOC) |

List filters: `search`, `status`, `source`, `skill`, `assignedTo`, `minExperience`, `page`, `limit`.

Status: `NEW` | `SCREENING` | `INTERVIEW` | `SELECTED` | `REJECTED`.

```json
{
  "name": "Aisha Khan",
  "email": "aisha@example.com",
  "phone": "+919876543210",
  "skills": ["React", "Node"],
  "experience": 3,
  "source": "naukri",
  "status": "NEW"
}
```

---

## Clients

`POST/GET/GET:id/PUT/DELETE` `/api/clients`

Filters: `search`, `status` (`ACTIVE` | `INACTIVE` | `PROSPECT`).

---

## Leads

`POST/GET/GET:id/PUT/DELETE` `/api/leads`  
`POST /api/leads/:id/convert` — creates a candidate and marks lead `CONVERTED`.

Status: `NEW` | `CONTACTED` | `QUALIFIED` | `CONVERTED` | `LOST`.

---

## Calls

| Method | Path | Auth |
| --- | --- | --- |
| POST | `/api/calls` | Yes |
| GET | `/api/calls` | Yes |
| GET | `/api/calls/:id` | Yes |
| POST | `/api/calls/webhooks/twilio/status` | Twilio (public; sign in prod) |

Consumes **1 subscription credit**. Twilio adapter stores a local SID when credentials are missing.

```json
{
  "candidateId": "<id>",
  "callType": "OUTBOUND",
  "transcript": "optional",
  "agentId": "<optional user id>"
}
```

Filters: `callStatus`, `callType`, `candidateId`, `agentId`.

Call status: `INITIATED` | `RINGING` | `CONNECTED` | `MISSED` | `FAILED` | `COMPLETED`.

---

## AI

| Method | Path |
| --- | --- |
| POST | `/api/ai/analyze-call` |
| POST | `/api/ai/calls/:id/analyze` |

```json
{
  "transcript": "Candidate has 3 years React experience and wants 8 LPA"
}
```

Demo output shape:

```json
{
  "summary": "Candidate is suitable for React developer role",
  "sentiment": "Positive",
  "candidateScore": 85,
  "recommendation": "Schedule technical interview"
}
```

(`data` also includes `decision` and `pipeline` metadata.)

---

## Follow-ups

`POST/GET /api/followups`  
`PUT /api/followups/:id`

Status: `PENDING` | `COMPLETED`.

```json
{
  "candidateId": "<id>",
  "assignedTo": "<userId>",
  "task": "Call back after notice period discussion",
  "reminderDate": "2026-08-23T10:00:00.000Z"
}
```

Due items emit Socket.io + persist a notification (poll every 60s).

---

## Campaigns

`POST/GET/GET:id/PUT /api/campaigns`  
`POST /api/campaigns/:id/start` — sets ACTIVE and creates outbound calls  
`POST /api/campaigns/:id/pause`

```json
{
  "name": "React surge week",
  "description": "Outbound to NEW React candidates",
  "candidates": ["<id>", "<id>"],
  "script": "Intro and screening questions"
}
```

---

## Notifications & dashboard

| Method | Path |
| --- | --- |
| GET | `/api/notifications` |
| PATCH | `/api/notifications/:id/read` |
| PATCH | `/api/notifications/read-all` |
| GET | `/api/dashboard/overview` |

Socket.io (same origin cookie or `auth.token`):

- Rooms: `user:<id>`, `company:<companyId>`
- Events: `notification`, `notification:company`, `call:created`, `call:updated`

---

## Health

`GET /health`
