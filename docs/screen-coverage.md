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
- Language control + overlay (139-2996, rows English (checked) / Arabic /
  France): the drawn control lives on the AUTH screens' top bar, where it
  renders as a marked non-functional control (aria-disabled, reason in
  the title): neither source contains any translated strings, so the
  overlay's Arabic/France rows could never work and no translations are
  invented. The app navbar draws no language trigger, so none is added
  there.

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

## Chats (Chats list + conversation + A8.1-A8.7): DONE (2026-11-24)
List and conversation screens implemented with send, attachments and
retry-safe failure handling; fixture-verified. Details below.

## Notifications (Notification overlay 209-6425 + A9): DONE (2026-11-24)
Navbar bell is live: unread dot from A9.3, overlay from A9.1, clicking an
unread row marks it read (A9.4) optimistically. The design draws no
mark-all or delete control, so A9.5/A9.6 stay unused. Row title/message/
time text sizes are pixel-estimated from the 100% frame read (only the
overlay title typography is node-read: Inter 500 16px #000712); time
labels follow the drawn samples (HH:MM today, Yesterday, else date).
## Reports (Reports screen + pickers + A11.1-A11.5): DONE, INTEGRATION VERIFIED (2026-11-24)
Screen, pickers and charts implemented; bindings verified against
authorized read-only live captures (2026-11-23 test account, re-verified
2026-11-24 under the granted admin read-only account with non-zero
data). Metrics bind exact observed paths: Task Completion Rate =
reports/tasks data.summary.completion_rate (live 38.4%), Projects
Completion Rate = reports/projects data.summary.average_completion_rate
(live 37.1%). The observed reports/teams summary carries counts only
(no rate key exists), so the drawn Teams Activity Rate card correctly
reads "Not available". Charts bind the named monthly series
(completed_tasks / projects); the payload's second series (created_tasks)
has no drawn home and stays unused. No delta field exists in any
observed payload, so "from last month" never renders. Print/Save uses
the browser's own print (client concern; no API exists).

## Ask AI (frames 225-9992 + 229-5948, A10.2): DONE (2026-11-24)
/ask-ai implements the empty state and the chat surface, entered from the
dashboard Ask AI card (now a link). Sends A10.2 { query }; the reply body
is undocumented in the collection, so the answer is read tolerantly from
common envelope fields (documented in code). Disclosed estimates: badge
border #D7E3FA pixel-sampled; CB badge text color, timestamp size/color
pixel-estimated; the design's speaker/thumbs feedback icons have no API
and are omitted while copy stays (works client-side); no AI error surface
exists in the design, so send failures restore the draft with one plain
note. The drawn external-link card is implemented: any URL in a message
renders as the drawn blue link card showing only what the URL carries
(host as title, URL as body; the drawn placeholder description is
omitted). Project-scoped asks (A10.3) are excluded: the collection
documents no field names for the extra parameter and no drawn screen
offers a project selector, so wiring it would invent both.
## Profile (Profile, /overview, /tasks, /files, /Settomgs + A2.x): DONE (2026-11-24)
Overview, tasks, files and settings implemented and fixture-verified.
The settings availability field binds only the payload value (no default
status is fabricated). The stats cards bind the observed auth/me stats block
(completed_tasks, hours_worked) by exact path; absent keys read
"Not available". Reachability:
the profile screens have no drawn prototype entry point, so the navbar
user chip links to /profile as the only drawn affordance (judgment call,
disclosed; the Navbar instance shows no Prototype interactions).

## Search
- Search Bar overlay (225-10323): RESOLVED (2026-11-24) — no global
  /search endpoint exists in the collection, so the navbar search input
  renders disabled with the reason named, and the overlay is EXCLUDED.
  Per-field search stays client-side where drawn.

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
separate user decision. The fixture harness fails closed: any request to
the live host that is not an explicitly stubbed endpoint is aborted,
recorded, and fails the render run (caught a mis-routed handler once
already).

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

## Chats (/chats and /chats/[id])

Source: "Chats" frame (node 126-2481, inbox tab state) plus its prototype
destinations, the Project Chats list state and the drawn open-conversation
state (1440x1024 each, page background #F6F8FA). The conversation state was
found through the prototype links, not frame names; earlier name searches
missed it.

Implemented:

- Sidebar card (drawn 415x942 at left 65/top 104, white, 16px radius,
  16px padding, 24px gaps): "Chats" title (Inter 600 49px #222222), search
  icon disabled (no message-search parameter), "inbox" tab disabled (no DM
  endpoint; the drawn inbox content is omitted entirely), "Project Chats"
  tab active, and one row per project (row 383 Fill x 96, 8px radius) with
  the latest message (A8.1, per_page=1) as the drawn preview line and time.
- Empty state at /chats: centered "Select Chat" (style estimated).
- Conversation at /chats/[id]: white header card (864 wide, 16px
  radius/padding/gap) with the project name; search, phone, video and menu
  icons disabled (no endpoints); message list (avatar initials, name, time,
  body, attachment chip when present; bubble 16px radius, 8/16 padding,
  geometry from the drawn bubble frame); composer (white, 16px radius,
  24px/16px padding) sending A8.2 with the message text on click or Enter,
  with double-submit guarding.

Omissions and disabled controls:

- No channels concept in the API: drawn channel sub-labels ("Public
  Channel", "Frontend Team Channel") are omitted; one conversation per
  project; the header shows the project name.
- Direct messages (inbox tab): no DM endpoint, tab disabled.
- Message search, voice/video call, chat settings icons: no endpoints,
  disabled with reasons.
- Message attachments: the paperclip uploads through A7.2, then the
  message sends through A8.2 with file_attachment_id. A picked file shows
  as a small removable chip above the input (the source draws no
  pending-attachment state; minimal affordance). Upload failure keeps the
  file and text for retry; a send failure after a successful upload
  retries the send only, so an attachment is never stored twice. Received
  attachment chips link to the file URL.
- Thread replies (A8.3), edit (A8.4), delete (A8.5), mark-read (A8.6) and
  unread count (A8.7): no drawn controls, omitted.
- Unread badges drawn on rows have no per-channel unread source, omitted.
- The sidebar preview refreshes locally after a successful send.

Estimated values (unmeasured in the source): tab text styles, active-tab
treatment, channel row name/preview/time text styles, "Select Chat" style,
header title size, message name/body text styles, avatar sizes, send button
size. The drawn 49px title and all card geometry are measured.

## Reports (/reports)

Source: "Reports" frame (node 104-2653, 1440x1024, #F6F8FA).

Implemented:

- Three stat cards (Task Completion Rate, Projects Completion Rate, Teams
  Activity Rate) fed by A11.2 / A11.1 / A11.3, with the drawn
  "From last month" delta when the payload carries one.
- Task Completion Time vs Deadline bar chart (blue), Projects Progress area
  chart (green), Worker Activity Rate line chart (blue), fed by A11.2 /
  A11.1 / A11.4 series (recharts).
- Cards distinguish zero from unavailable: a missing metric renders "Not
  available", a 403 renders "Not available for your role."

Limitations:

- INTEGRATION VERIFIED (2026-11-24): the A11 endpoints document no
  response fields (api.json lists none), so their shapes were grounded by
  authorized read-only live captures (2026-11-23 test account;
  re-verified 2026-11-24 under the granted admin read-only account with
  non-zero data). lib/reports-normalize.ts binds exact observed paths
  only: any deviation (renamed/moved key, missing block) still fails
  closed to "Not available", and no delta field exists in any observed
  payload, so "from last month" never renders as a guessed zero. No
  guessed metric, series or axis appears as real data.
- The drawn "All Projects" and "Monthly" dropdowns have no documented
  filter parameters and are disabled with reasons.
- The "Submit a detailed report" form has no POST endpoint; every control
  is disabled with a reason.

Estimated: stat title/value/delta text styles, card padding, chart axis
styling (drawn axis labels are placeholder junk in the source).

## Profile (/profile, /profile/settings)

Source: "Profile/overview" (node 214-8454), "Profile / tasks" (214-8743),
"Profile / files" (214-8536) and "Profile/Settomgs"; all 1440x1024,
#F6F8FA.

Implemented:

- Shared header card (drawn 1313x92 hug, 13px radius, 20px gap): avatar
  with the camera badge linking to /profile/settings, name, job title (or
  first role), join date from created_at (omitted when the payload carries
  no valid date), Completed Tasks and Hours Worked stats from A11.4 via the
  fail-closed extractor ("Not available" when absent or ambiguous), and the
  Overview / Tasks / Files tabs.
- Overview: the About section (user.about). The drawn Recent Activities
  section is omitted: the API has no activity-feed endpoint.
- Tasks: To do / Done columns from A2.5 (status !== Completed vs
  Completed). The drawn per-row progress bars are omitted: tasks carry no
  progress field. Done rows keep the drawn check marker.
- Files: three-column card grid from A2.6 (name, uploader, size, relative
  time, download link to the file URL).
- Header stats: Completed Tasks / Hours Worked bind the observed auth/me
  (A2.1) stats block by exact path (completed_tasks, hours_worked); a
  missing block or key reads "Not available", never a guessed zero.
- Settings: avatar picker (A2.2 avatar), Full Name, Phone Number, Job
  Title and Years Of Experience wired to A2.2 with double-submit guard,
  success and error states. Email Address, Availability Status and Current
  Team / Project are disabled: A2.2 has no fields for them. No password
  form is drawn, so A2.4 (change password) is not wired. Avatar removal
  (A2.3) has no drawn control and is omitted.

Estimated: tab text styles, stat card text, section label styles, field
styles, file card icon treatment. The navbar keeps its drawn state on
profile screens (the source draws the Reports pill active there).
