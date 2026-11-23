# CollabSpace

A collaborative project management platform for teams: projects, tasks, meetings, files, messaging, reports and AI-assisted insights.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- TanStack Query 5 for server state
- Axios API client with Bearer token auth

## Getting started

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL
npm run dev
```

## Project structure

- `app/` — routes, layouts, providers
- `lib/api-client.ts` — axios instance, auth token handling, error envelope
- `lib/api/` — typed API modules per domain (auth, projects, tasks, meetings, files, messages, notifications, dashboard, reports, teams, users, profile, ai)
- `lib/types.ts` — shared domain types
- `components/` — shared UI components

## Workflow

- Feature branches off `development`, pull requests back into `development`.
- `main` holds the integrated, reviewed result.
