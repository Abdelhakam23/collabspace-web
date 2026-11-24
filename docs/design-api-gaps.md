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

## Native typography of the final frame (read from Figma properties, Nov 24)
The final frame does NOT use Montserrat. Navbar text (logo, items, user name
and role) is Rubik; all dashboard content uses Inter with the "Team C Text"
styles: KPI numbers and completion rate H4 = Inter SemiBold 31px #000000;
card titles and KPI labels H6 = Inter Medium 20px (#191919 / #000000); task
titles small Body r = Inter Regular 14px #252525; meeting titles Inter
Regular 14px #000000; fractions and meta Inter Medium 12px #525256; View All
Small Caption = Inter Regular 12px #005AFB; chart axis = Inter Regular 12px
#718096. Deeper node reads (Nov 24, second pass): Recent Files file name
"small Body r" = Inter Regular 14px #27272B (secodary-500), cap-height trim,
line height 150%; file meta ("By ... - time") = Inter REGULAR 12px #525256,
cap-height trim, line height 150% (an earlier 12 Medium note was wrong);
priority pill label = Inter Medium 12px, line height 16px, no cap trim, High
= Support Red Normal #DB302A (pill container Indicator, Hug 39x24); Teams
member task count = Inter Regular 12px, line height 16px, #525256; member
name = 12px line-height-16 #525256 (row Hug 16 + group colors; weight
unread, Medium kept); chart month labels = style "12px/Regular", Inter
Regular 12px, line height 18px, #718096 (Text Color/600-Body); the frame
draws six month labels (Month row 643px, six 90px frames) while the chart
plots twelve monthly points - the dashboard now labels every second point to
match the source tick cadence, and the y axis uses six divisions (native
25k/20k/15k/10k/5k/0k). Still unread natively: pill background tints
(medium/low sampled), Ask AI hint text.

## Ask AI robot asset
The frame's robot is an image fill ("image 2", 42.67x64px, source
1024x1536 PNG). The view-only file exposes no export preset, so the
original was fetched through the properties panel's image download URL
(read-only) and downscaled to a 128x192 PNG (public/ask-ai-robot.png),
rendered at the native 42.67x64 geometry without the earlier placeholder
tile.

## Native dashboard geometry (read from Figma properties, Nov 24)
Frame 1440x1024, BG #F6F8FA, page padding 64px, card gap 24px. Cards: white
fill, 1px border in BG label #F3F4F6, radius 16, padding 20. KPI cards fixed
310x160; Project overview fixed 644x285; Active Projects and Recent Files
310x276; Tasks, Teams, Up coming meetings and Ask AI 310x414. KPI bar fill
orange is the native style Support colors/Dark orange-500 #FA9E00 with track
dark orange-50 #FFF5E6. Card heights are fixed in the design, so cards keep
their height regardless of record count (extra rows overflow hidden).

## All Projects toolbar controls
The frame draws a search box and two filter dropdowns ("All Projects",
"Newest"). A4.1 documents no search parameter, and the file does not show
the dropdown contents, so the search input and both dropdowns render inert
(aria-disabled) until their behavior has a source.

## All Projects "Add Project" overlay
The button's interaction opens a "New Project" overlay in the file. The
overlay frame has not been extracted yet, so the button is rendered inert
for this pass; POST /projects (A4.2) is documented for when it ships.

## All Projects icon glyphs and avatar images
The layer names identify the icon assets as public icon-set vectors, and the
exact paths are used: project badge "Bag-Suitcase-1--Streamline-Core"
(16x16 in a 32px tile), files glyph "mdi-light:file" (20x20), and the
trailing row affordance "pepicons-pencil:dots-y" (24x24, fill #000712 read
from the vector's native properties). Team avatars are data images: with no
avatar_url they render as initials circles in the design's avatar
geometry (23.73px, 1.48px #C2C2C2 border).

## All Projects filter dropdowns
Frame 2147224288 native reads: Hug x 40px, radius 16, border 1px
secodary-500 #27272B, padding 16 left / 10 right, gap 10, label Rubik 400
12px #000712, chevron 10x5 with 1.5px #000712 stroke. Earlier
pixel-sampled border/radius values are superseded by these reads. The
dropdown contents remain undesigned, so the controls stay inert.

## All Projects status/priority coverage
The frame draws only two samples per column: active #FA2B75 and Done
#2BA52E for status, High #DB302A and Medium #E6BA0E for priority. Other
API values (On Hold, Delayed, Low, Urgent) render in the default text
color until their design treatment exists. Native reads replaced the
pixel measurements: the table container is a vertical stack at top 250 /
left 64 with 16px gaps, the header is Fill 1312 x Hug 59 (border-bottom
1px #BCBCBD, 7 cells of Fill 181.71px plus a trailing 40x40 bordered
box), and each data row is Fill 1312 x Hug 60 with 7 cells of Fill 184px
plus 12px horizontal inset. The header/row value offsets are by design
and the implementation reproduces that structure.

## New Project overlay payload gaps
The overlay has no description or status fields. A4.2 lists both without
required markers, validation rules or example responses, so the form
omits them rather than inventing values; whether the backend defaults
status and accepts a missing description is an open API question. Members
are a documented array and all added members are sent. Priority options
come from the API's documented TaskPriority values - the file shows only
"High". Input containers reuse the file's input component styling; the
date fields are boxed in the source and the implementation (an earlier
"underlined" note was a misread of the capture).

## Project detail (All Projects / Alpha) gaps
"Project Type" in the Product Details grid has no field in the documented
Project model and is omitted. "Total Tasks" is read from A5.1 (List Tasks,
whose project_id filter is documented) via the pagination total; the
collection documents no response shape for A5.1, so the item renders only
when the response actually carries a numeric meta.total. This envelope
position is an inference from A4.1's observed shape and has been verified
only against stubbed fixture responses, not against the live API (live
calls are on hold). The pending /
in progress / completed fractions under the gauge and the Project overview
chart card depend on A4.3/A4.4, whose response shapes are undocumented in
the collection but were captured read-only from the live API (Nov 24) and
are wired from those observed keys; the avatar drawn
above the Due Date card has no owner/avatar field in the model and is
omitted. The Due Date track fill presents the elapsed fraction between the
documented start_date and deadline; the frame draws the track without
stating its semantics. Product Details icon tints and icon colors are
pixel-sampled from the 46% capture (#F2E9F1/#BF75A9 start date,
#FFEDE6/#FB743A deadline, #FBEAEA/#DB302A priority, #F3F4F6/#191919 total
tasks). Native reads since replaced the pixel estimates: the gauge ring is
a 177.61px ellipse pair, #27272B on #E9E9EA, stroke ~11 with round caps;
the exact arc geometry (~192deg track from 172.5deg, drawn 120deg dark arc,
pivot 8.7px below ring center) is documented in the gauge section below. Header block:
Fixed 1311 x Hug 71 at top 104 / left 65 with a 32px gap to the Due Date
card (Fixed 324 x Hug 71, radius 12, border #F3F4F6, padding 12). The
Product Details icon tints above remain sampled, not native. Tasks, Teams
and Files tabs are drawn in the frame but their sibling frames are not yet
implemented, so they render inert with an aria-disabled note. Table rows on
All Projects navigate to this page (Link), matching the breadcrumb's
"Projects" back-navigation drawn in the frame.

## Project detail header geometry (native, applied)
Header block: Fixed 1311 x Hug 71 at top 104 / left 65, gap 32 between the
title column (Fill 955: breadcrumb + title row) and the Due Date card
(Fixed 324 x Hug 71, radius 12, border #F3F4F6, padding 12, blue track
#005AFB on #E6EFFF). Content frame: Fixed 1312 x 785 at top 207, left 64,
tabs row (Hug 28, gap 30, active #005AFB underline) above a space-between
grid: left column Fixed 864 (Description, Project overview chart, Product
Details), right column Fixed 416 (Statistics details gauge, Team Members),
32px column separation. The header is implemented in-flow at these
measurements; the chart card remains omitted pending the undocumented
A4.3/A4.4 response shapes (see above).

## Observed live response shapes (2026-11-24, seed Admin read-only)

Read via the backend-team seed Admin account supplied in the original Postman
collection (Login (Admin) request body), with the project owner's approval for
read-only schema verification. No mutations were made.

### A4.3 GET /projects/:id/overview
`data`: id, name, description, status, priority, progress_percentage,
due_date_indicator { start_date, deadline, total_days, days_remaining,
is_overdue }, tasks_statistics { total, pending, in_progress, in_review,
completed, completion_rate, pending_percentage, in_progress_percentage,
in_review_percentage, completed_percentage }, counts { files, meetings,
messages, teams, direct_members }, teams[], direct_members[], created_by,
creator, created_at, updated_at, chart { period, year, group_by, data[12] {
month, month_number, year, label, created_tasks, completed_tasks,
progress_percentage, is_future } }.

The Alpha screen consumes this end-to-end: gauge = progress_percentage, status
legend and Total Tasks = tasks_statistics (pending / in_progress / completed
over total), chart card = chart.data created_tasks. The frame draws a single
line while the payload also carries completed_tasks; only created_tasks is
plotted since the frame gives no second series style. The "All Projects" /
"This Year" filters stay inert: the collection documents no query parameters
for this endpoint.

### A4.4 GET /projects/:id/teams
`data` is the team array itself: { id, name, completion_percentage,
total_tasks, completed_tasks, members[] { id, name, avatar_url, role_in_team,
is_leader, tasks_completed, tasks_total, tasks_ratio, progress_percentage } }.
The Team Members card lists these members; the "UI/UX" filter pill stays
inert (design-only control, no documented filter parameter).

### Sampled colors this round
- Status legend dots: Pending #191919, In Progress #005AFB, Completed #2BA52E
  (pixel-sampled from the 46% capture).
- Projects list file glyph: mdi-light:file with #F8B040 orange fill
  (fill pixel-sampled; the vector itself is the exact public asset).

## Alpha frame native geometry (reconciled 2026-11-24, frame 181-1158)

- Header: title column (2147224404) Hug 60 = breadcrumb 16 + gap 16 + title
  row 28 (2147224510, gap 16). Due Date card Fixed 324x71 (padding 12, ring
  equivalent; title 12px/15, track 3, date rows 13).
- Content frame top 207: tabs row 28, then cards at y267. Columns are Fixed
  707 tall: left = Description 111 + 32 + chart 325 + 32 + Product Details
  207; right = Project Progress 356 + 32 + Team Members fill 319.
- Chart card ("Graphs / Monthly Flow"): padding 20, gap 20, header row 24
  (filter pills), graph row 241 (horizontal gap 12: y-axis column + plot
  column 792x241; plot 218, month labels row 12, gap 11).
- Project Progress card: padding 20, gap 43, gauge group 178x178, legend row
  items vertical (value 16px/12 + gap 16 + dot+label 12px/9).
- Needle gauge inner geometry (1:1 native capture + node reads): track
  #E9E9EA is a ~192deg arc from 172.5deg (screen coords, clockwise from 3
  o'clock), r 83.3, stroke ~11, round caps; the ~162deg gap spans the
  bottom from 3 o'clock to ~8:45 and does not wrap the bottom. Dark arc
  #27272B drawn 168deg -> 294deg (126deg) starting at the track start.
  Pivot dot 17.01 white, border 1.89 #27272B drawn inside, center 8.7px
  below ring center. Needle (Rectangle 40109): 9.45x54.32 rounded bar,
  #27272B, tilted 22.09deg clockwise from vertical; Figma reports its
  rotated bounding box, so the implementation places it by center.
- Drawn-vs-truthful: the drawn dark arc (126deg) covers ~64% of the track,
  not the labeled 78%, so the design gauge is decorative (same pattern as
  the drawn 36+62+42>94 legend). Runtime mode maps pct truthfully over
  the ~192deg track (arc end and needle both at 172.5 + 1.92 * pct degrees);
  the guarded visual fixture (localStorage collabspace_visual_fixture=1)
  reproduces the drawn 126deg arc and 22.09deg needle verbatim for pixel
  comparison only.
- Figma strokes render inside the frame box, so cards use a 1px ring instead
  of a CSS border to land on exact native heights.

## Project sibling tabs (Tasks / Teams / Files) — added Nov 24

Frames: "All Projects / Alpha / Tasks" (node 181-1418), "/ teams" (181-1982),
"/ Files" (181-2367), all hi-fi 1440x1024 on the UI Design page. Wired to
A5.2 (kanban), A4.4 (teams), A7.1 (files) respectively.

- Column/team band tints pixel-sampled from 46% captures: To-do #F9FAFB,
  In Progress #E6EFFF, In Review #FAECF6, Completed #EAF6EA; team bands
  UI/UX #FAECF6, Frontend #F2EAF2, Backend #E6F8F7, Marketing #E9E9EA.
- Kanban task cards: the drawn per-task Progress bar/percent and comment
  count have no fields in the documented Task model (A5.x); omitted, not
  guessed. Cards show title, priority pill, description, assignee, due date.
  The frame's avatar stacks collapse to the single documented assignee.
- "Add Task", column "..." actions and "Upload File" are write flows. The
  plan schedules them for Day 3 (3.3 Create Task, 3.4 edit/assign/delete,
  3.7 upload, all with documented POST/PUT/PATCH/DELETE endpoints), so they
  are implementation-supported; they render inert with aria-disabled until
  that Day 3 work lands. File download (A7.5) is a read and is wired.

### Native-read corrections (Nov 24, second pass)

Geometry/type below is read from the Figma nodes directly; earlier values
were 46% pixel estimates.

- Tasks: column = white container, radius 16, 1px #E9E9EA border, 20px
  bottom padding; band 62px tall with 20px padding; list 20px side padding,
  18px gaps; task card 264x167, #F6F8FA fill, 1px #F3F4F6 border, 16px
  padding, space-between. Add Task = Inter Medium 14px #005AFB dashed-border
  button at the top of the column list. Band label ~15px Medium is inferred
  from the 22px label node box (no direct text read).
- Teams: card white, radius 16, 1px #F3F4F6 border, 16px bottom padding,
  20px internal gap; band 68px, 20px padding; team name Inter Medium 20px
  #000712. Completion text sits in a transparent 28px pill (radius 100,
  8px padding), Inter Regular 13px colored per team: UI/UX #A43782,
  Frontend #7D2D7E, Backend #04B5AE, Marketing #27272B. Member rows 40px
  tall, 16px gaps, 16px side padding; avatar 40px; name Inter Regular 14px
  #000712; role Inter Regular 12px #4A4A4A; progress 172x4 radius 100,
  #E6EFFF track with #005AFB fill; count Inter Regular 12px #000712.
- Files: Recent cards 404px wide with 50px gaps; All Files grid 346px cards,
  32px gaps; card 90px tall, radius 16, 1px #AEAEB2 border, 16px padding,
  14px gaps, white; PDF artwork ~29x37 #F44336 (lucide FileText stands in);
  name Inter Medium 16px black, uploader Inter Regular 13px black, size/time
  Inter Regular 12px black; download icon 18px black. Section titles Inter
  Medium 25px; section-to-cards gap 31px; sections 48px apart. Upload File
  button 40px tall, fully rounded (radius 32), #005AFB, 20/12px side padding.
  The All Files grid's vertical row gap was not node-read; it is matched by
  eye from the capture.
- Auth card height: the card measures ~661px against the native Hug 627.
  +20px is the intentional "Google sign-in isn't available yet" disclosure
  line (text + its 4px gap, required because the control is inert); a 12px
  footer-gap error (extra pt-3 on top of the 24px stack gap) was fixed.
  The remaining ~14px sits inside heading/field metrics and needs native
  item-level reads; documented here rather than claimed as parity.
- Native tab frames repeat the member name "Mohand wahib" on every row and
  draw "42% Completed" on all four team cards (drawn sample data); real
  values come from A4.4. Recent Files = three newest by created_at.
- The kanban API statuses map to drawn labels: Pending -> To-do,
  In Progress -> In Progress, In Review -> In Review, Completed -> Completed
  Tasks; unknown future statuses fall back to their raw label on a grey band.

## Create Task overlay (frame 141-2397) — added Nov 24

The Add Task buttons open a modal matching the "Create Task Overlay" frame
(Fixed 720, Hug content, radius 16, 24px padding, 32px gaps) and post to A5.3.
Only fields present in both the frame and the documented request body are
sent: name, due_date (the frame's End Date), status (the status of the column
whose button was clicked, sent verbatim as returned by A5.2), project_id
(route) and assigned_to.

Intersection decisions:

- Start Date is drawn in the frame but has no task-API field; it renders
  disabled with an explanatory tooltip rather than collecting data it could
  never send.
- The frame's Add Guests allows several guests while A5.3 accepts a single
  assigned_to; the first added guest is sent and the rest stay visual.
- priority, description and team_id exist in A5.3 but not in the frame, so
  they are not invented into the form; the backend's own response decides.
- Add Task Files uploads each chosen file after creation via A7.3.
- Field chrome (notched labels, 56px inputs, dashed dropzone) reuses the New
  Project overlay's measurements, which were read from the same design file.
- After a successful create the kanban board refetches (A5.2) instead of
  trusting the local state.
