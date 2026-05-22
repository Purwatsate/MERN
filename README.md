# Police Database System (MERN)

Monorepo layout:

```
MERN/
  backend/    # Node.js + TypeScript + Express + PostgreSQL API
  frontend/   # React + TypeScript (မြန်မာဘာသာ UI)
```

## Quick start

**Terminal 1 — Backend:**
```bash
cd backend
npm install
npm run db:init
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
```

- API: http://localhost:3000
- App: http://localhost:5173
- Login: `admin` / `Admin@123`

## Docs

- [backend/README.md](backend/README.md) — API & database
- [frontend/README.md](frontend/README.md) — React app (Myanmar UI)
