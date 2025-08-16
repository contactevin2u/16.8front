
# Frontend (Next.js 14, App Router)

## Local
```bash
cd frontend
cp .env.local.example .env.local
# set NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000
npm install
npm run typecheck
npm run dev
```

## Vercel
- Root Directory: `frontend/`
- Env: `NEXT_PUBLIC_API_BASE=https://<your-render-service>.onrender.com`
- Node: >=18.17 <21 (pinned)
