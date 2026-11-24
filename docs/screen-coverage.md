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

## Meetings (design frames + A6.1-A6.10): page + scheduling + room DONE (two unresolved limitations)
Hi-fi frames: Meetings (screen 114-2597, 1440x1024, #F6F8FA),
Meetings / Join Meeting (114-3107, 1440x1024, #F6F8FA), Add Meeting overlay
(139-2808, 720xHug595 r16 p24 gap32), Duration overlay (139-1583,
210x164 r16 p16 white: Today / This Week / This Month / Last Three
Month / This Year). Items like "Up coming meetings", "Create
meetings", "Meetings settings", "Sprint Planning Meeting" are
in-screen labels/cards, not standalone frames (find-box type
evidence, 2026-11-24).

DONE (/meetings, node-read measurements):
- Header row (114-2599: top 120/left 65, gap 32): H1 Inter 600 31px
  lh150% #000; Add Meeting pill (114-3005: Hug142x40, r32,
  p12/12/12/20 gap8, #005AFB, Inter 500 14 #FFF) opens the overlay.
- Toolbar row (114-2606: top 202): month label Inter 500 20px #000712
  (H6). A6.1 takes no date range, so the month arrows render disabled
  with an explanatory title; the label shows the real current month.
- This Week control + Duration overlay: only "This Week" is enabled
  (sends the documented time_filter=upcoming); the other four drawn
  options have no documented value and render disabled with a title.
  The endpoint's scope for time_filter=upcoming is undocumented.
  UNRESOLVED DESIGN-LABEL CONFLICT: the control says "This Week" but
  the grid shows a rolling five-day range (today + next four), which
  is not a calendar week and breaks across week boundaries; no drawn
  or documented control offers a real calendar-week scope. Closed control's border is pixel-estimated as #CBD5E0
  (native control too small to sample cleanly).
- Week grid (114-2617: 1311 at left 64/top 281): six equal 218.5px
  columns (time column + five days), rows with 1px #F3F4F6 row/cell
  borders, day cells p16/12 gap2, time cell p16 gap2. The frame
  repeats the weekday+number header (Rubik 400 14/16 #000, centered)
  inside every row, so the grid does the same. Today column filled
  #E6EFFF (pixel-sampled). The frame draws a "Today" column plus
  weekday labels ("Thurs" spelling kept), so the grid shows today
  plus the next four days with real dates. Two design conflicts were
  resolved for correctness: drawn rows are fixed 137px but the drawn
  card+header stack is 171px, so cells use 137px as a MINIMUM and grow
  with their cards (the first implementation clipped cards at the row
  boundary); and the drawn 9:00-13:00 hour window grows when returned
  meetings start earlier or later, so no appointment loses its cell.
  Meetings whose day falls outside the five drawn columns CANNOT be
  reached by any drawn control or documented API value (month
  navigation and the other Duration options are unsupported): the
  grid reports the count under it as an explicit UNRESOLVED
  LIMITATION, not as discoverable data. The native frame's grid
  (Hug 789) overflows its own 1024 frame, so the web page scrolls
  naturally instead.
- Meeting card (114-3050: Fill194.5 x Fixed105, r16, 1px #F3F4F6, p12,
  white; has an on-click interaction to the Join frame): title Inter
  400 14/16 #000, time Inter 400 12/16 #000/75% (native marks center
  alignment; pixels show left, so left), avatars 32px circle border
  2px #C2C2C2 (initials placeholders - data limitation), +N chip Inter
  800 10/16 #606C80 in a #F3F4F6 circle (chip bg pixel-estimated),
  Join (Hug44x16 r16 gap4, Inter 400 12/16 cap-trim #383838 +
  ion:add-outline 12px). Join links to meeting_link when the list
  item carries one (A6.1 fields are undocumented; A6.2 includes the
  field); otherwise it is disabled with an explanation.
- Add Meeting overlay wired to A6.2: title/description/meeting_date/
  start_time from Subject/Note/Date/Time; end_time = start + the
  selected duration. The drawn "Select Duration" has no option list
  anywhere in the file, so the select offers common durations (its
  choice only shifts the computed end_time). meeting_link and
  project_id have no drawn control and are NOT sent. Guests resolve
  against A12.1 like the Create Task overlay. Fixture-tested against a
  stubbed POST (no live mutation authority).

DONE (meetings/[id] room, canonical node 114-3107 on UI Design,
1440x1024, #F6F8FA; copies 274-12876 (720x502 miniature) and
75-2482 (UX page) measured for geometry, canonical wins conflicts):
- Breadcrumb "Meetings > {title}" links back to /meetings; separator
  and muted styling are estimated (text style panel cut off before
  the color section was read).
- Title Inter 600 31px lh150% #000 (Team C Text/H4, same pattern as
  the other page H1s).
- Meta row (gap 16): project name resolved through A4.3 overview
  (the only supported project_id -> name path; omitted if the fetch
  fails), attendee initials avatars (5 + overflow), date and
  start-end time from A6.3.
- Video area: drawn 752x323 r28 #D9D9D9 with a centered play glyph
  (flowbite:play-solid 64x64; brand-blue fill estimated from the
  design screenshot). Rendered as an inert placeholder with no
  controls: the API has no call/embed capability, so nothing here
  implies a working video call.
- Tabs: AI Summary active (white tab, r tl8/tr7, p10), Note and
  Comments drawn but endpoint-less, so they render disabled with the
  reason on hover. Tab text style/color estimated (Inter 500 14px).
- AI card (751 wide, r20 tl0, p20/16/16/16 gap24, #F0F0F0): "AI
  Generate Summary" Rubik 500 24px, "Key Points" Rubik 500 20px,
  bullets Inter 400 16px. A6.7 returns one content string, so lines
  written as "- " bullets render under Key Points and anything else
  renders as paragraphs; no content is invented. Line heights
  normalized (native cap-trim values clip real text).
- OMITTED: the drawn "Meeting Transcripts" side panel, its search
  and language menu. The API has no transcript read endpoint (A6.6
  only accepts a transcript as generation input), so there is no
  honest content for it.
- MeetingCard Join now always navigates to the room (the card's
  drawn on-click destination); meeting_link stays a scheduling-only
  field with no drawn read control, so the earlier external-link
  behavior was removed.
- Fixture-verified: room render and grid -> Join -> room navigation
  (stubbed A6.1/A6.3/A6.7, zero live mutations).

AI summary work (A6.6-A6.9) depends on what the summary surface
offers.

## Chats (design frames + A8.1-A8.7): TODO
Hi-fi frames: Chats (screen; node id pending). "Project Chat", "Search
in chat", "Chat settings" are in-screen elements of it (find-box type
evidence). Message send/edit/delete and thread replies have API support;
frame review pending.

## Notifications (Notification overlay 209-6425 + A9): DONE (2026-11-24)
Navbar bell is live: unread dot from A9.3, overlay from A9.1, clicking an
unread row marks it read (A9.4) optimistically. The design draws no
mark-all or delete control, so A9.5/A9.6 stay unused. Row title/message/
time text sizes are pixel-estimated from the 100% frame read (only the
overlay title typography is node-read: Inter 500 16px #000712); time
labels follow the drawn samples (HH:MM today, Yesterday, else date).
## Reports (Reports screen + pickers + A11.1-A11.5): TODO
Hi-fi frames: Reports (screen; node id pending) with the report-type
picker 163-1089 and period picker 163-995. "Detailed Reports", "Print/
Save Report", "KPI's", "Personal", "Project progress" are in-screen
labels (find-box type evidence); print/save has no API (browser print
is a client concern — review during implementation).

## Ask AI (frames 225-9992 + 229-5948, A10.2): DONE (2026-11-24)
/ask-ai implements the empty state and the chat surface, entered from the
dashboard Ask AI card (now a link). Sends A10.2 { query }; the reply body
is undocumented in the collection, so the answer is read tolerantly from
common envelope fields (documented in code). Disclosed estimates: badge
border #D7E3FA pixel-sampled; CB badge text color, timestamp size/color
pixel-estimated; the design's speaker/thumbs feedback icons have no API
and are omitted while copy stays (works client-side); no AI error surface
exists in the design, so send failures restore the draft with one plain
note. The external-link card and project-scoped asks (A10.3) remain open.
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
Meetings / join Meeting 114-3107 (canonical; 274-12876 miniature
superseded), Notification overlay 209-6425,
Add Meeting overlay 139-2808, Duration overlay 139-1583,
Teams overlay 139-1513, Language overlay 139-2996,
Search Bar overlay 225-10323, project picker 139-1571,
report-type picker 163-1089, period picker 163-995,
New Project overlay = "New Project overlya" (id recorded in
implementation notes).
