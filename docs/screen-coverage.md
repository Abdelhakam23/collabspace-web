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
  in-app); Language overlay: EXCLUDED (no i18n/locale API).
- Sign Up: DONE.
- Forgot/reset password (A1.5-A1.7): EXCLUDED — no recovery screens in
  the design, so the "Forget Password?" link stays inert by design rule.

## Core app
- Dashboard (285-12895, A10.1): DONE.
- All Projects list (114-1915, A4.1): DONE (filter/sort chips inert —
  A4.1 documents no such parameters).
- New Project / Project overlay (A4.2): DONE. Two further "Project
  overlay" frame variants exist (likely edit/other states): REVIEW
  PENDING — if they are edit/delete surfaces (A4.5/A4.8), they are TODO.
- Project shell: Overview (A4.3) DONE, Teams (A4.4) DONE, Tasks
  (A5.2/A5.3/A5.6) DONE, Files (A7.1/A7.2) DONE.
- Global Tasks Page (107-11473): DONE (A4.1 + A5.2 + A5.3 + A5.6 + A2.1;
  team filter entries disabled — no team field/filter in the API).
- Create Task Overlay: DONE. My task overlay: DONE (filter menu).

## Tasks/detail surfaces
- Task detail/edit/assign/delete (A5.4, A5.5, A5.7, A5.8): EXCLUDED —
  no task-detail surface exists anywhere in the design (layer-tree
  search evidence).
- Column actions menu: EXCLUDED — no column-level endpoint.

## Meetings (design frames + A6.1-A6.10): TODO
Frames seen: Meetings, Up coming meetings, Sprint Planning Meeting,
Meetings / Join Meeting, Create meetings, Meetings settings, Add Meeting
overlay, Duration overlay, Meetng summery. Not yet reviewed frame by
frame; list/schedule (A6.1/A6.2) are the obvious core. AI summary
(A6.6-A6.9) depends on what the summary frame offers.

## Chats (design frames + A8.1-A8.7): TODO
Frames seen: Chats, Project Chat, Chat settings. Message send/edit/delete
and thread replies have API support; frame review pending.

## Notifications (Notification overlay + A9.1-A9.6): TODO
The navbar bell is currently inert with a static dot; A9.3 (unread count)
plus the overlay frame make this a supported surface.

## Reports (Reports / Detailed Reports / KPI frames + A11.1-A11.5): TODO
Frames seen: Reports, Detailed Reports, Print/Save Report, KPI's,
Personal, Meetng summery, Project progress. Frame review pending;
print/save has no API (browser print is a client concern — review).

## Ask AI (Ask AI + Ask Ai/ chat frames + A10.2-A10.4): TODO
Robot artwork recovery via Copy-as-SVG is the immediate next step, then
the chat surface against A10.2/A10.3.

## Profile (Profile, /overview, /tasks, /files, /Settomgs + A2.x): TODO
Profile/overview (A2.1), Profile / tasks (A2.5), Profile / files (A2.6),
Profile/Settings (A2.2 avatar, A2.3 remove avatar, A2.4 password) are all
in the intersection.

## Search
- Search Bar overlay: REVIEW PENDING — no global /search endpoint exists
  in the collection; per-field search is already client-side where drawn.
  If the overlay is a command/search UI, it is EXCLUDED unless an endpoint
  is found.

## Admin/AI settings/audit
- A12 user management, A13.1/A13.2 AI settings, A13.3 audit logs:
  EXCLUDED unless matching admin frames are found — none seen so far in
  layer searches ("Users", "Settings", "Audit" show only Profile/Settings,
  which is self-service).

## Files
- File delete (A7.6): EXCLUDED — no drawn affordance.
- File download (A7.5): read-only, DONE if wired (verify during sweep).

## Testing boundary (all TODO families)
Reads render live data; every write flow (schedule meeting, send message,
mark read, update profile, AI asks that create tasks) is implemented but
verified only against local fixtures — zero live mutations without a
separate user decision.
