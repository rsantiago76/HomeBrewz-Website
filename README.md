# HomeBrewz — Amplify Starter (React + FastAPI)

This repo is a **starter folder structure** for deploying a React frontend with AWS Amplify Hosting and a FastAPI backend (container-ready).

## Structure
- `frontend/` — React + TypeScript (Vite)
- `backend/` — FastAPI (async), SQLAlchemy async scaffold
- `infra/` — placeholders for Terraform/CDK (optional)
- `amplify.yml` — Amplify build spec for the frontend

## Quick Start (local)
### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# Mac/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Deploy (Amplify)
1. Push this repo to GitHub
2. In AWS Amplify → **New app** → **Host web app**
3. Select the repo/branch
4. Set env var in Amplify:
   - `VITE_API_BASE_URL` (e.g. https://api.homebrewz.example.com)
5. Deploy

> Note: Amplify Hosting builds the `frontend/` app via `amplify.yml`. The backend is deployed separately (ECS/Fargate, App Runner, or Lambda container).

## Environment Variables
Frontend:
- `VITE_API_BASE_URL`

Backend:
- `DATABASE_URL`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `FRONTEND_URL`
