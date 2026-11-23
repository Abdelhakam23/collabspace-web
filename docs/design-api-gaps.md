# Design / API source gaps

Rule for this project: a screen or control ships only when it exists in BOTH the
supplied Figma design AND the live API. Anything present in only one source is
listed here instead of being invented.

| Feature | In design | In API | Shipped state |
| --- | --- | --- | --- |
| Password recovery (forget / OTP / reset) | Only the "Forget Password?" link on the login frame; no recovery screens exist in the file | `POST /auth/forgot-password`, `/auth/verify-otp`, `/auth/reset-password` documented | Not shipped. The login link stays visible for design fidelity but is inert until a designed target exists. |
| Language switcher | Top bar of the auth frames | No i18n endpoints | Visible, intentionally non-functional (aria-disabled). |
| Google sign-in | Button on the login/register frames | `GET /auth/social/google/redirect` + `POST /auth/social/google/callback` documented, but the live redirect response points Google's consent screen at a localhost callback URL, so the round trip cannot complete as configured | Visible, disabled, with an on-screen note. Re-enable when the backend callback URL is fixed and the flow is verified. |
| Font weights | Type scale panel documents sizes; weights are not documented anywhere in the file | n/a | Weights are visually matched (compared 400/500/600 renders), not extracted. Family is Inter, labeled in the file. |
| Remember Me on register | Checkbox on the register frame | `POST /auth/register` has no `remember` field | Device-side persistence only (token kept across restarts vs current session). No server-side semantics are claimed. |

## Dashboard project-overview chart filters
The Dashboard design shows "All Projects" and period ("This week") dropdowns above
the project-overview chart, drawn over daily bars. The documented `GET /dashboard`
endpoint takes no query parameters and its default response is yearly, grouped by
month (`period: "year", `group_by: "month"`). The controls are rendered as in the
design but left inert (`aria-disabled`) until the API documents period/project
filtering; the chart renders the documented default response.

## Dashboard Teams panel member rows
The design's Teams panel lists individual members (avatar, name, role tag,
per-member progress bar, task counts) under a team selector. The dashboard
payload returns team-level items only (name, members/tasks counts), with no
member breakdown, so the panel renders one row per team in the same row
geometry and the selector stays inert. Member rows need a members source in
the dashboard payload or a documented per-team members endpoint.

## Source correction: UX wireframe vs UI Design final frames
The first dashboard/auth pass was extracted from the grayscale wireframes on the
Figma "UX" page. The authoritative source is the "UI Design" page (user
instruction, Nov 24): SectionDashboard (node 190-4108) with the final Dashboard
frame (node 285-12895, 1440x1024, Montserrat, BG #F6F8FA, Primary #005AFB).
Wireframe-extracted typography (Inter/Rubik values) was discarded.

## Dashboard KPI "from last month" deltas
The final frame shows "+9% from last month" style deltas on the KPI cards. The
dashboard payload has no delta fields, so the deltas are omitted rather than
invented.

## Accent palette
KPI accents (orange #FF9226, blue #005AFB, green #22B14C), project colors
(purple #7B2C7E, teal #0DB0A8), chart blue (#2692FF) and the priority pill
tones are pixel-sampled from the final frame render (JPEG), so they are
approximations; the named color styles (BG color #F6F8FA, Text Color #000712,
secodary-500 #27272B, Secondary #525256, BG label #F3F4F6, Primary #005AFB,
White) and the "Team C Text" scale (H1 61 - H6 20, Body 16, small body 14,
Caption 13, Small Caption 12, line-height 150%) are native Figma reads.

## Ask AI illustration
The frame shows a blue robot illustration. A neutral inline SVG holds its
geometry until the asset is exported from the file (export check in progress).
