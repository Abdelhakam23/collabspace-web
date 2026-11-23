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
