# NextRound — AI Mock Interview Platform

An AI-powered mock interview platform: sign up, build a candidate profile, configure a session (behavioral / technical / DSA / mixed), and run a live interview with an AI interviewer ("Alex") that asks questions, scores your answers, and produces a scorecard.

## Project structure

```
nextround/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
├── server/
│   └── index.js          ← local proxy that holds your Anthropic API key
└── src/
    ├── main.jsx           ← app entry point
    ├── App.jsx            ← root component / screen router
    ├── styles.css         ← component styles (cards, buttons, inputs, etc.)
    ├── theme.css           ← CSS variable design tokens (colors, fonts)
    ├── data/
    │   └── constants.js   ← domains, session types, dropdown options
    ├── lib/
    │   └── claude.js      ← fetch wrapper that calls the proxy server
    └── components/
        ├── UIPrimitives.jsx   ← Badge, ScoreBar, CircleScore, RadarChart, etc.
        ├── AuthScreen.jsx     ← login / signup
        ├── Sidebar.jsx        ← left nav
        ├── Dashboard.jsx      ← home screen with stats
        ├── ProfileScreen.jsx  ← candidate profile form
        ├── SessionScreen.jsx  ← interview configuration
        ├── HistoryScreen.jsx  ← past session list
        ├── InterviewScreen.jsx← live chat interview + AI feedback
        └── ScorecardScreen.jsx← end-of-session results
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Add your Anthropic API key

```bash
cp .env.example .env
```

Open `.env` and paste your key (get one at [console.anthropic.com](https://console.anthropic.com/settings/keys)):

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### 3. Run the app

This project ships with a tiny local proxy server (`server/index.js`). It exists because the browser **cannot** call `api.anthropic.com` directly — there's no CORS support, and it would expose your API key to anyone with devtools open. The proxy holds the key server-side and forwards requests.

Run both the frontend and the proxy together:

```bash
npm start
```

This runs Vite (`http://localhost:5173`) and the API proxy (`http://localhost:3001`) side by side. Open `http://localhost:5173` in your browser.

Alternatively, run them in two separate terminals:

```bash
# terminal 1
npm run server

# terminal 2
npm run dev
```

## How auth works

This is a **frontend-only demo**. The login/signup screen accepts any email + password (6+ characters) — there's no real backend user database. It's there to demonstrate the full product flow (auth → profile → session → interview → scorecard). Swap `AuthScreen.jsx`'s `submit()` handler for a real auth provider (Auth0, Supabase, Firebase, your own API) when you're ready to ship.

Likewise, profile data and session history live in React state only and reset on page refresh. To persist them, wire `App.jsx`'s `profile`/`history` state to a database or `localStorage`.

## Customizing the look

All colors, spacing, and fonts route through CSS variables defined in `src/theme.css`. Change a value there and it updates everywhere. Component-level styles (cards, buttons, chips, etc.) live in `src/styles.css`.

## Tech stack

- **React 18** + **Vite** — no router library; screen switching is handled with simple state in `App.jsx`
- **Tabler Icons** (via CDN, loaded in `index.html`) for all `<i className="ti ti-...">` icons
- **Express** (in `server/`) — minimal API key proxy, no database
- **Claude Sonnet 4.6** (`claude-sonnet-4-6`) — powers interview questions and answer scoring, called via `src/lib/claude.js`

## Known limitations (carried over from the original prototype)

- No persistent storage — refreshing the page clears your session/profile/history
- Auth is not real — any email/password combination logs you in
- No voice input/output (text-only interview)
- No PDF export of scorecards
