# DPDP-GovShield — static site

Pure HTML/CSS/JS. No build step, no backend, no secrets. All former API calls are replaced by local mock data (`js/pages/mock-engine.js`, per-page mocks, `portal/js/data.js`). User changes persist in `localStorage`.

| Route | What |
|---|---|
| `/` | Citizen landing, role switcher, compliance testbench |
| `/portal/` | 12-screen multi-role compliance suite (SPA; `?role=…&page=…`) |
| `/citizen/` `/dpo/` `/auditor/` `/historical/` | Role workspaces |
| `/drill/` | Redirects to breach-response drill in the portal |

Colours/tokens: `css/site.css` (`:root`) and `portal/css/styles.css` (`:root`).

Run locally: `npx serve .` or `python -m http.server 8000`.
Deploy: `vercel --prod` from this folder (`vercel.json` included).
