# CollabSpace Web

Frontend for CollabSpace, a project management workspace: projects, a task board, meetings, team chats, reports and an AI assistant page. It talks to the CollabSpace REST API and is built from the Figma UI design.

Live: https://collabspace-web-seven.vercel.app

## Stack
<<<<<<< development

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, TanStack Query, Axios, React Hook Form with Zod, dnd-kit for the task board, Recharts, lucide-react, date-fns.

## Running it

Node.js 20.9 or newer (the minimum Next.js 16.4.6 requires) and the API base URL.

    git clone https://github.com/Abdelhakam23/collabspace-web.git
    cd collabspace-web
    npm install

Create `.env.local`:

    NEXT_PUBLIC_API_URL=https://collabspace.huma-volve.com

Then run `npm run dev` and open http://localhost:3000. Other scripts: `npm run build`, `npm start`, `npm run lint`.

## Folder structure

    app/
      page.tsx, layout.tsx, providers.tsx
      login/page.tsx, register/page.tsx
      dashboard/page.tsx
      projects/page.tsx
      projects/[id]/
        page.tsx
        tasks/page.tsx
        teams/page.tsx
        files/page.tsx
      tasks/page.tsx
      meetings/page.tsx
      meetings/[id]/page.tsx
      chats/page.tsx
      chats/[id]/page.tsx
      reports/page.tsx
      profile/page.tsx, profile/settings/page.tsx
      ask-ai/page.tsx
    components/
      auth, dashboard, projects, meetings, chats, reports,
      profile, tasks, ask-ai, charts
    lib/
      api-client.ts
      api/  (auth, projects, tasks, meetings, messages, files, teams,
             users, profile, reports, notifications, dashboard, ai)
      reports-normalize.ts, format.ts, colors.ts

Each folder under `components/` holds the pieces for the page of the same name.

## How it works

All requests go through one Axios client in `lib/api-client.ts` that adds the Bearer token. The token is kept in localStorage when "Remember me" is checked and in sessionStorage otherwise. A 401 on any non-auth request clears it and sends the user to /login. Responses are normalized in `lib/api`, so components get plain typed objects.

From 1280px up the app uses the top navigation bar. Below that it switches to a slim top bar with a menu button that opens a side drawer. Wide tables and the meetings grid scroll sideways inside their own container instead of stretching the page.

Controls the API has no endpoint for (calls, search, some report filters) are shown disabled. Report charts show an empty state when the API returns no series.

## Recent changes

=======

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, TanStack Query, Axios, React Hook Form with Zod, dnd-kit for the task board, Recharts, lucide-react, date-fns.

## Running it

Node.js 20.9 or newer (the minimum Next.js 16.4.6 requires) and the API base URL.

    git clone https://github.com/Abdelhakam23/collabspace-web.git
    cd collabspace-web
    npm install

Create `.env.local`:

    NEXT_PUBLIC_API_URL=https://collabspace.huma-volve.com

Then run `npm run dev` and open http://localhost:3000. Other scripts: `npm run build`, `npm start`, `npm run lint`.

## Folder structure

    app/
      page.tsx, layout.tsx, providers.tsx
      login/page.tsx, register/page.tsx
      dashboard/page.tsx
      projects/page.tsx
      projects/[id]/
        page.tsx
        tasks/page.tsx
        teams/page.tsx
        files/page.tsx
      tasks/page.tsx
      meetings/page.tsx
      meetings/[id]/page.tsx
      chats/page.tsx
      chats/[id]/page.tsx
      reports/page.tsx
      profile/page.tsx, profile/settings/page.tsx
      ask-ai/page.tsx
    components/
      auth, dashboard, projects, meetings, chats, reports,
      profile, tasks, ask-ai, charts
    lib/
      api-client.ts
      api/  (auth, projects, tasks, meetings, messages, files, teams,
             users, profile, reports, notifications, dashboard, ai)
      reports-normalize.ts, format.ts, colors.ts

Each folder under `components/` holds the pieces for the page of the same name.

## How it works

All requests go through one Axios client in `lib/api-client.ts` that adds the Bearer token. The token is kept in localStorage when "Remember me" is checked and in sessionStorage otherwise. A 401 on any non-auth request clears it and sends the user to /login. Responses are normalized in `lib/api`, so components get plain typed objects.

From 1280px up the app uses the top navigation bar. Below that it switches to a slim top bar with a menu button that opens a side drawer. Wide tables and the meetings grid scroll sideways inside their own container instead of stretching the page.

Controls the API has no endpoint for (calls, search, some report filters) are shown disabled. Report charts show an empty state when the API returns no series.

## Recent changes

>>>>>>> main
- Navigation drawer on tablet and phone, with a notification panel that stays inside the screen.
- Chat composer send button no longer shrinks on 320px phones.
- New Project and Create Task dialogs: the guest Add button no longer overlaps the input, and New Project scrolls on short screens.
- Meetings toolbar wraps on narrow screens.
- Profile tasks and files read the fields the API actually returns.

## Workflow

<<<<<<< development
<<<<<<< feature/responsive-fixes
1. Pages read and mutate server data through TanStack Query hooks.
2. Every call passes through one Axios client, which attaches the Bearer token from web storage.
3. A `401` outside the auth calls clears the token and routes back to `/login`.
4. Forms validate with Zod schemas before anything is sent.

---

## 📂 Project Structure

```text
.
├── app/                          # Routes (App Router)
│   ├── page.tsx                  # Redirects to /dashboard or /login
│   ├── layout.tsx, providers.tsx
│   ├── login/, register/
│   ├── dashboard/
│   ├── projects/
│   │   └── [id]/                 # Project shell
│   │       ├── page.tsx          # Overview
│   │       ├── tasks/
│   │       ├── teams/
│   │       └── files/
│   ├── tasks/
│   ├── meetings/
│   │   └── [id]/                 # Meeting room
│   ├── chats/
│   │   └── [id]/                 # Conversation
│   ├── reports/
│   ├── profile/
│   │   └── settings/
│   └── ask-ai/
├── components/                   # Feature UI, one folder per area: auth,
│                                 # dashboard, projects, meetings, chats,
│                                 # reports, profile, tasks, ask-ai, charts
├── lib/
│   ├── api-client.ts             # Axios instance, token storage, error envelope
│   ├── api/                      # Typed API modules, one per backend domain
│   └── reports-normalize.ts, format.ts, colors.ts
└── public/                       # Static assets
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.9 or newer
- **npm**
- A reachable **CollabSpace API** base URL

### Install and run

```bash
git clone https://github.com/Abdelhakam23/collabspace-web.git
cd collabspace-web
npm install
```

Create `.env.local` in the project root pointing at your CollabSpace API (see [Environment Variables](#-environment-variables)):

```dotenv
NEXT_PUBLIC_API_URL=https://your-collabspace-api-host
```

Then:

```bash
npm run dev
```

Open `http://localhost:3000`.

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

---

## 🔐 Environment Variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the CollabSpace backend API |

Values prefixed with `NEXT_PUBLIC_` are visible in the browser; never put secrets there.

---

## 🎨 Design & API Scope

Every screen is built from the Figma **UI Design** frames, at the intersection of what the design draws and what the backend serves.

- Where the design draws a control the API does not support (video/voice calls, global and in-chat search, some report filters and extra date-navigation options), the control renders **disabled with its reason** instead of pretending to work.
- Where an endpoint cannot honestly feed a drawn element (the report charts, for example, would need series the API does not return), the element shows an **explicit empty state** rather than invented numbers.

---

## 🔀 Workflow

- Feature branches are cut from `development` and land back through reviewed pull requests.
- `main` holds the integrated, reviewed result.

---

<div align="center">

**Built frame by frame, endpoint by endpoint.**

</div>
=======
Work goes on a feature branch, then a pull request into `development`, then into `main`. Vercel deploys `main`.
>>>>>>> development
=======
Work goes on a feature branch, then a pull request into `development`, then into `main`. Vercel deploys `main`.
>>>>>>> main
