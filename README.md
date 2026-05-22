# Police Database System (MERN)

<p align="center">
  <img src="assets/logo.svg" alt="ရဲတပ်ဖွဲ့ အချက်အလက်စနစ်" width="80" height="80" />
</p>

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
