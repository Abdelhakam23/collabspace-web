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

## API configuration

The app talks to the CollabSpace backend at the URL in `NEXT_PUBLIC_API_URL`
(see `.env.local`; the collection's host is the default). All requests go
through `lib/api-client.ts`: the Bearer token is read from web storage
(localStorage when "Remember Me" is checked, sessionStorage otherwise), a
401 outside the auth calls clears the token and returns to `/login`.

## Scope: implemented vs unsupported

Every screen is built from the Figma UI Design frames, and only where both
the design and the backend collection support the control. The headline
areas (auth, dashboard, projects, tasks kanban, meetings, chats with
attachments, notifications, Ask AI, reports, profile) are fully wired.

Controls the design draws but the API does not serve render disabled with
an on-control reason instead of pretending to work: video/voice call
buttons, global and in-chat search, report filters and the detailed-report
form, most duration/month navigation options. Where an endpoint's payload
cannot honestly feed a drawn element (for example the report charts, which
would need duration/rate series the API does not return), the element shows
an explicit empty state rather than invented numbers.

`docs/screen-coverage.md` lists every screen, its source frames and
endpoints, and each deviation or disabled control with its reason.
