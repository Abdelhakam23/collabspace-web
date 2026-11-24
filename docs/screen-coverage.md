# Whole-project screen coverage (design ∩ API)

Scope rule: a screen or control is in scope only when BOTH the UI Design
page (hi-fi frames) and the backend collection (api.json) support it.
This table covers every top-level product surface on the UI Design page,
not only the current branch. Research/UX-page frames (personas, case
study, competitive analysis, wireframes, screenshots, logos) and the
Design system page are source material, not product screens.

Legend: DONE = implemented and pixel-verified; TODO = both sources support
it, not yet implemented; EXCLUDED = one source missing, reason given.

## Auth
- Sign In (frame 225-9362): DONE. Google button disabled: A1.8/A1.9 exist
  but the saved backend redirect points at a localhost callback (noted
  in-app).
- Sign Up: DONE.
- Forgot/reset password (A1.5-A1.7): EXCLUDED — layer search for
  "Forgot" on the UI Design page returns zero results; the
  "Forget Password?" link stays inert by design rule.
- Language overlay (139-2996, 210xHug116 r16 p16, rows English (checked)
  / Arabic / France): TODO as a marked control — the selector itself is
  drawn, but neither source contains any translated strings, so Arabic
  and France render disabled with the limitation noted; no translations
  will be invented.

## Core app
- Dashboard (285-12895, A10.1): DONE.
- All Projects list (114-1915, A4.1): DONE (filter/sort chips inert —
  A4.1 documents no such parameters).
- New Project overlay (A4.2): DONE. The three "Project overlay" named
  frames were reviewed (2026-11-24): 139-1571 is a project-picker
  dropdown (All Projects checked / Project one / Project two, 210xHug116)
  for the global Tasks Page; 163-1089 is a report-type picker (Project
  Progress / Meetings Summery / Worker Preformance / Tasks / KPI's,
  608xHug172) for the Reports screen; 163-995 is a period picker
  (Monthly checked / Daily / Yearly, 210xHug116). None is an edit or
  delete surface, so A4.5/A4.8 stay EXCLUDED (no drawn affordance).
  Open: align the Tasks Page project dropdown with 139-1571, including
  the "All Projects" entry (check A5.1 without project_id for whether an
  all-projects task list is supported before enabling it).
- Project shell: Overview (A4.3) DONE, Teams (A4.4) DONE, Tasks
  (A5.2/A5.3/A5.6) DONE, Files (A7.1/A7.2) DONE.
- Global Tasks Page (107-11473): DONE (A4.1 + A5.2 + A5.3 + A5.6 + A2.1;
  team filter entries disabled — no team field/filter in the API).
- Create Task Overlay: DONE. My task overlay: DONE (filter menu).

## Tasks/detail surfaces
- Task detail/edit/assign/delete (A5.4, A5.5, A5.7, A5.8): EXCLUDED,
  cross-checked on the UI Design page 2026-11-24: the only "Task
  Details" nodes are boxes in a sitemap/flowchart diagram (160x24 labels
  alongside "Workflows", "Timeline", "Table view", "Roles
  (admin-manger)", "Channels", "Threads"), not a hi-fi screen. No edit
  or delete affordance found ("Edit Task" and "Delete" layer searches:
  zero results).
- Column actions menu: EXCLUDED — no column-level endpoint.

## Meetings (design frames + A6.1-A6.10): TODO
Hi-fi frames: Meetings (screen; node id pending), Meetings / Join
Meeting (274-12876), Add Meeting overlay (139-2808), Duration overlay
(139-1583: Today / This Week / This Month / Last Three Month / This
Year — compare with A6.1 time_filter values before wiring). Items like
"Up coming meetings", "Create meetings", "Meetings settings", "Sprint
Planning Meeting" are in-screen labels/cards, not standalone frames
(find-box type evidence, 2026-11-24). AI summary work (A6.6-A6.9)
depends on what the summary surface offers.

## Chats (design frames + A8.1-A8.7): TODO
Hi-fi frames: Chats (screen; node id pending). "Project Chat", "Search
in chat", "Chat settings" are in-screen elements of it (find-box type
evidence). Message send/edit/delete and thread replies have API support;
frame review pending.

## Notifications (Notification overlay + A9.1-A9.6): TODO
Overlay frame 209-6425. The navbar bell is currently inert with a
static dot; A9.3 (unread count) plus the overlay make this supported.

## Reports (Reports screen + pickers + A11.1-A11.5): TODO
Hi-fi frames: Reports (screen; node id pending) with the report-type
picker 163-1089 and period picker 163-995. "Detailed Reports", "Print/
Save Report", "KPI's", "Personal", "Project progress" are in-screen
labels (find-box type evidence); print/save has no API (browser print
is a client concern — review during implementation).

## Ask AI (Ask AI + Ask Ai/ chat frames + A10.2-A10.4): TODO
Frames: Ask AI empty state 225-9992 (1440x1024, BG #F6F8FA, "Collabspace
AI" heading, sparkle badge, "Hi There" greeting, input card "ask me
anything about...." with + / mic / Submit), chat surface 229-5948
(1440x1024 Hug, AI/user bubbles with CB badge and avatar, external-link
card, feedback icon row, typing indicator, "Message to ChatBot...."
input). No robot artwork exists on these frames (layer search "robot":
zero results); the center badge is a sparkle icon from the icon set.
Entry point from the navbar or dashboard to be confirmed during
implementation.

## Profile (Profile, /overview, /tasks, /files, /Settomgs + A2.x): TODO
Profile/overview (A2.1), Profile / tasks (A2.5), Profile / files (A2.6),
Profile/Settings (A2.2 avatar, A2.3 remove avatar, A2.4 password) are all
in the intersection. Node ids pending harvest.

## Search
- Search Bar overlay (225-10323): REVIEW PENDING — no global /search
  endpoint exists in the collection; per-field search is already
  client-side where drawn. If the overlay is a command/search UI, it is
  EXCLUDED unless an endpoint is found. Inspect the frame content before
  finalizing.

## Admin/AI settings/audit
- A12 user management, A13.1/A13.2 AI settings, A13.3 audit logs:
  EXCLUDED, cross-checked on the UI Design page 2026-11-24: "Admin"
  search returns only "John Doe (Admin)" card labels and sitemap boxes;
  "Audit" returns only case-study "Accessibility Audit" text. No admin
  frames exist.

## Files
- File delete (A7.6): EXCLUDED — no drawn affordance.
- File download (A7.5): read-only, DONE if wired (verify during sweep).

## Unidentified top-level layers (identify during implementation)
Frame 2147224599, Frame 2147224589, Frame 2147224606, Frame 2147224473,
Frame 2147224287, Rectangle 40093, Frame, n 1, image 1, image 1830,
Group 43674 — likely decorative assets or older frame versions; each
gets a one-line classification before the final sweep.

## Testing boundary (all TODO families)
Reads render live data; every write flow (schedule meeting, send message,
mark read, update profile, AI asks that create tasks) is implemented but
verified only against local fixtures — zero live mutations without a
separate user decision.

## Layer-panel windows (2026-11-24, UI Design page, top-level rows as read)
Window A: ... Search Bar overlay, Profile / files, Profile / tasks,
Profile/Settomgs, Profile/overview, Frame, Notification overlay,
Ask Ai/ chat, Frame, Navbar, Profile, Report, Meetings, Chats, Tasks,
Projects, Ask AI, Sing in/ Up, Dashboard, My task overlay x2,
Frame 2147224499, Component 3, Frame 2147224506, Component 1,
Project overlay x2, Files, Wireframe-21/16/24/19/22/20, Chats, Slack,
Select Files, Meeting room.
Window B: Rectangle 40094, Rectangle 40093, Frame 2147224473,
Create Task Overlay, Ask AI, Sign up, Frame 2147224287, Sign in,
Tasks Page, Meetings / join Meeting, Meetings, image 1,
All Projects / Alpha / Files, / teams, / Tasks, All Projects / Alpha,
Add Meeting overlay, New Project overlya (sic), All Projects,
Language overlay, My task overlay, Duration overlay, Project overlay,
Teams overlay, Frame 2147224297, image 1838, Dashboard, Reports.
Notes: the two windows come from different panel scroll regions and
overlap partially; "Report"/"Reports", "Meeting room", "Select Files",
"Slack", the second "Chats", and "Files" need classification (screen,
section, or asset). Screen node ids still to harvest via find box +
size check: Meetings, Chats, Reports/Report, Profile/overview,
Profile / tasks, Profile / files, Profile/Settomgs, Meeting room.
Known ids: Ask AI 225-9992 (1440x1024, vertical, gap 40, fill #F8FAFC),
Ask Ai/ chat 229-5948, Sign in 225-9362, Dashboard 285-12895,
Tasks Page 107-11473, All Projects 114-1915, project tabs
181-1418/181-1982/181-2367, Create Task Overlay 141-2397,
Meetings / join Meeting 274-12876, Notification overlay 209-6425,
Add Meeting overlay 139-2808, Duration overlay 139-1583,
Teams overlay 139-1513, Language overlay 139-2996,
Search Bar overlay 225-10323, project picker 139-1571,
report-type picker 163-1089, period picker 163-995,
New Project overlay = "New Project overlya" (id recorded in
implementation notes).
