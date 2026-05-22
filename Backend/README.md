# Police Database System API

Node.js + **TypeScript** + Express + PostgreSQL API for the Myanmar police database schema. Uses **raw SQL queries** and **PostgreSQL stored procedures** (no ORM).

## Stack

- Node.js / TypeScript / Express
- `pg` — raw queries & `SELECT sp_*()` calls
- PostgreSQL stored procedures in `database/stored_procedures.sql`
- JWT authentication for police officers (`users` table)
- **Winston** + **express-winston** — HTTP and error logging

## Logging

Every API request is logged to the console and to files under `logs/`:

| File | Content |
|------|---------|
| `logs/combined.log` | All requests (JSON) |
| `logs/error.log` | Errors only (JSON) |

Optional in `.env`:

```
LOG_LEVEL=debug   # error | warn | info | http | debug
NODE_ENV=development
```

Example console output (one line per request, no headers or tokens):

```
2026-05-22 14:00:01 [info]: Police Database API listening on http://localhost:3000
2026-05-22 14:00:05 [info]: GET /api/people 200 12ms
2026-05-22 14:00:06 [info]: POST /api/auth/login 200 45ms
```

Use `logger` from `src/config/logger.ts` in your own code:

```typescript
import { logger } from '../config/logger';
logger.debug('detail', { id: personId });
logger.warn('something odd');
logger.error('failed', { err });
```

## Database connection

```
Host=localhost
Port=5432
Username=postgres
Password=1qaz!QAZ
Database=police_db
```

Configured in `.env` (see `.env.example`).

## Setup

Run from the `backend` folder:

```bash
cd backend
npm install
npm run db:init
npm run dev        # TypeScript with hot reload (tsx)
# or
npm run build      # compile to dist/
npm start          # run compiled JS
```

`db:init` creates `police_db`, tables, stored procedures, and a default admin user.

## TypeScript

- Source: `src/**/*.ts`
- Types: `src/types/models.ts`, `src/types/express.d.ts`
- Build output: `dist/`
- Strict mode enabled in `tsconfig.json`

**Default admin:** `admin` / `Admin@123`

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/auth/login` | Login (get JWT) |
| GET | `/api/auth/me` | Current user (auth required) |
| POST | `/api/auth/register` | Register officer (Admin only) |
| GET/POST/PUT/DELETE | `/api/people` | People CRUD |
| GET | `/api/people/search?q=` | Search people (SP) |
| GET/POST/PUT/DELETE | `/api/incidents` | Incidents CRUD |
| GET/POST/DELETE | `/api/criminal-records` | Criminal records |
| GET | `/api/criminal-records/incident/:id` | Records by incident |
| GET | `/api/criminal-records/person/:id` | Records by person |
| GET/POST/PUT/DELETE | `/api/vehicles` | Vehicles CRUD |
| GET | `/api/vehicles/search?plate=` | Search by plate (SP) |

All routes except `/health` and `/api/auth/login` require header:

```
Authorization: Bearer <token>
```

## Tables

1. **people** — suspects, convicts, victims, complainants
2. **incidents** — case files
3. **criminal_records** — person ↔ incident roles
4. **vehicles** — owned or related vehicles
5. **users** — police officer accounts

## Example: login & create person

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"Admin@123\"}"

curl -X POST http://localhost:3000/api/people \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"full_name\":\"ဦးမောင်မောင်ကျော်\",\"gender\":\"M\",\"nrc_number\":\"၁၂/လကန(နိုင်)၁၂၃၄၅၆\"}"
```
