# CollabSpace Web

Frontend for CollabSpace, a project management workspace: projects, a task board, meetings, team chats, reports and an AI assistant page. It talks to the CollabSpace REST API and is built from the Figma UI design.

Live: https://collabspace-web-seven.vercel.app

## Stack

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

- Navigation drawer on tablet and phone, with a notification panel that stays inside the screen.
- Chat composer send button no longer shrinks on 320px phones.
- New Project and Create Task dialogs: the guest Add button no longer overlaps the input, and New Project scrolls on short screens.
- Meetings toolbar wraps on narrow screens.
- Profile tasks and files read the fields the API actually returns.

## Workflow

Work goes on a feature branch, then a pull request into `development`, then into `main`. Vercel deploys `main`.
