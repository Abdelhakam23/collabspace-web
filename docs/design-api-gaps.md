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
#718096. Unverified native reads (pill labels, member names, month labels,
file rows, Ask AI hint) follow the same scale pending deeper selection.

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
The violet project glyph and the file/folder glyph cannot be exported from
the view-only file, so inline SVG approximations hold their geometry
(approximate, not native). Team avatars are data images: with no
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
color until their design treatment exists. Column x positions are
pixel-measured at 46% zoom (auto layout exposes no absolute offsets).

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
chart card depend on A4.3/A4.4, whose response shapes are undocumented, so
both are omitted rather than parsed with guessed keys; the avatar drawn
above the Due Date card has no owner/avatar field in the model and is
omitted. The Due Date track fill presents the elapsed fraction between the
documented start_date and deadline; the frame draws the track without
stating its semantics. Product Details icon tints and icon colors are
pixel-sampled from the 46% capture (#F2E9F1/#BF75A9 start date,
#FFEDE6/#FB743A deadline, #FBEAEA/#DB302A priority, #F3F4F6/#191919 total
tasks); the gauge track uses #27272B on #E9E9EA as sampled. All of these
sampled values remain unresolved approximations pending native component
reads from the file; they are not accepted final values. Tasks, Teams
and Files tabs are drawn in the frame but their sibling frames are not yet
implemented, so they render inert with an aria-disabled note. Table rows on
All Projects navigate to this page (Link), matching the breadcrumb's
"Projects" back-navigation drawn in the frame.
