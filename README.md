<p align="center">
  <img src="https://img.shields.io/badge/VIBESYNC-Where%20Groups%20Come%20Alive-8B5CF6?style=for-the-badge&logoColor=white" alt="VIBESYNC" />
</p>

<h1 align="center">⚡ VIBESYNC</h1>
<h3 align="center">AI-Powered Shared Experience Platform</h3>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/No%20Frameworks-Pure%20Vanilla-10B981?style=flat-square" />
  <img src="https://img.shields.io/badge/AI%20Powered-ECHO%20Engine-06B6D4?style=flat-square" />
</p>

---

## 🧠 The Problem

> **The Silent Drop-Off in Shared Experiences**

People plan shared entertainment — watch parties, game nights, group discussions — but participation drops off quickly. Existing platforms focus on content streaming or messaging and fail to sustain engagement. The deeper issue: **lack of context-aware interaction** that understands group energy, participation patterns, and social friction. Digital spaces feel transactional rather than immersive.

## 💡 Our Solution

**VIBESYNC** is an AI-powered social platform that solves this with **ECHO** — a Group Soul Engine that:

- 📊 **Reads group energy** in real time through participation patterns
- 🚨 **Detects boredom** before drop-off happens and deploys emergency games
- 👻 **Crowns silent members** with funny AI-generated titles and dares
- 🤖 **ROBO mascot** narrates sessions like a sports commentator
- 🔮 **Predicts group behavior** at session start with hilarious accountability
- 🎲 **Empowers users** with Chaos Cards that flip the format entirely

---

## 🏗️ Architecture

```
vibesync/
├── index.html              # Single-page application entry point
├── css/
│   └── styles.css          # Complete design system + all component styles
├── js/
│   ├── utils.js            # Utilities, helpers, data constants
│   ├── app.js              # Main app controller, routing, dashboard
│   ├── robo.js             # ROBO mascot AI personality engine
│   ├── session.js          # Session room, chat, Ghost Crown, AI Judge
│   ├── games.js            # Mini-games engine (8 game types)
│   └── social.js           # Social features, accent mode, game suggestions
└── README.md               # This file
```

### Technical Decisions

| Decision | Rationale |
|----------|-----------|
| **Pure Vanilla HTML/CSS/JS** | No framework overhead; demonstrates core web mastery |
| **Single HTML file (SPA)** | All views are sections toggled with JS; no server-side routing needed |
| **CSS Custom Properties** | Full design token system with 50+ variables for consistency |
| **LocalStorage persistence** | User data, session history, preferences survive page refresh |
| **Client-side AI simulation** | All "AI" behaviors powered by clever algorithms — no backend needed |
| **GPU-accelerated CSS animations** | 60fps animations using `transform` and `opacity` only |
| **Google Fonts** | Inter (body) + Space Grotesk (headings) for premium typography |

---

## 🚀 Getting Started

### Prerequisites

- Any modern web browser (Chrome, Firefox, Safari, Edge)
- A local HTTP server (or Node.js for `http-server`)

### Run Locally

**Option 1: Using Node.js http-server**
```bash
# Install http-server globally (one-time)
npm install -g http-server

# Navigate to project directory
cd vibesync

# Start the server
http-server -p 3000 -c-1

# Open http://127.0.0.1:3000 in your browser
```

**Option 2: Using npx (no install needed)**
```bash
cd vibesync
npx -y http-server ./ -p 3000 -c-1
```

**Option 3: Using Python**
```bash
cd vibesync
python -m http.server 3000
```

**Option 4: Using VS Code Live Server**
1. Install the "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"

### Demo Flow

1. **Landing Page** → Click "⚡ Enter the Vibe" or "Get Started"
2. **Sign Up** → Create an account (any credentials work in demo mode)
3. **Onboarding** → Choose avatar, set vibe personality, create/join group
4. **Dashboard** → Browse active sessions, interact with ROBO
5. **Session Room** → Join a session, chat, experience AI features live

---

## ✨ Features

### 🤖 ROBO — The Living AI Mascot

| Mode | Trigger | Behavior |
|------|---------|----------|
| 😴 Sleepy | No one online | Yawning, droopy eyes, snoring |
| 🎉 Hype | Group joins | Backflip, confetti, air horn |
| 🕵️ Detective | Low energy detected | Magnifying glass, sneaking |
| 🔥 Chaos | Chaos Card played | Literally catches fire |
| 🏆 Trophy | Winner declared | Victory dance with trophy |

**Interactive**: Click ROBO for random dares, challenges, facts, jokes, and predictions. He remembers your name and reacts differently each time.

### 👻 Ghost Crown System

When AI detects prolonged silence from a member:
- **Crowned** with a funny title: "🫥 The Invisible Ninja", "💤 Lord of the AFK Realm"
- **Dare drops** with 3 options:
  - 🤖 **AI Dare** — AI-generated challenge
  - ✍️ **Manual Dare** — Group writes a custom dare
  - 🎲 **Wild Card** — Spin the Wheel of Chaos
- Complete dare → Crown removed, "Redeemed" badge earned
- Ignore → Crown gets bigger and funnier

### 🚨 Boredom Engine

When chat goes dead (low messages + low reactions):
- **Boredom level bar** fills up visually
- **ROBO deploys Emergency Fun Protocol**
- Auto-launches one of 8 mini-games

### 🎮 Mini-Games Arsenal

| Game | Type | How It Works |
|------|------|-------------|
| ⚡ Lightning Round | Trivia | 60-sec rapid fire Q&A, first to answer wins |
| 🗳️ This or That War | Voting | AI picks two absurd choices, minority gets roasted |
| 🎯 Hot Seat Roulette | Personal | Spin wheel, answer 3 rapid personal questions |
| 🎭 Plot Twist | Creative | Continue an AI-started story in one sentence |
| 🤥 Liar's Throne | Deception | One lies, group asks 3 questions, vote truth/lie |
| 😀 Emoji Court | Expression | State opinions using ONLY emojis |
| 🔥 Speed Roast | Comedy | 30 seconds to roast someone (lovingly) |
| 🔍 Who Said It? | Memory | Guess who sent an old message |

### ⚖️ AI Judge

After dares/games:
- ROBO transforms into **Judge Mode** with animated gavel
- **Jury votes** displayed with animated bars (Hilarious / Mid / Failure)
- **Verdict delivered** with AI-generated commentary
- Results saved to Memory Palace

### 🎲 Chaos Cards

- Each member gets **1 Chaos Card per session**
- Playing it **flips the format** entirely:
  - 🎭 Accent Mode, 🔄 Reverse Chat, 🎤 Rap Battle
  - 🤫 Whisper Mode, 💣 Hot Take Bomb, 🃏 Identity Swap

### 🔮 Prophecy System

At session start, ROBO makes wild predictions:
> "ROBO PREDICTS: @Hari will go quiet after 20 mins, @Priya will start an argument about food, and someone will say 'okay but hear me out' at least 4 times."

End of session → Check which came true → Hilarious accountability

### 🎬 Director's Chair

Weekly rotating position — one member controls the session:
- Choose the game, pick who gets dared
- Set the vibe (chill / chaotic / competitive)
- AI assists with suggestions

### 🎤 Confessional Booth

Anonymous confessions drop into chat:
- Group reacts without knowing who sent it
- ROBO reveals the sender only after everyone reacts

### 🏛️ Memory Palace

Timeline of legendary group moments:
- Ghost Crown events, Chaos Cards played, AI Judge verdicts
- Emergency games, prophecies come true, season champions

### 🏆 Community League

Groups ranked by **Vibe Score** (group health metric):
- Points for completing dares, zero drop-offs, high vibe streaks
- Seasonal rankings with monthly resets

---

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Electric Purple | `#a855f7` | Primary accent, CTAs, active states |
| Cyber Cyan | `#06b6d4` | Secondary accent, ROBO, links |
| Hot Pink | `#ec4899` | Danger, Chaos Cards, emphasis |
| Amber | `#f59e0b` | Warnings, Ghost Crown, energy |
| Deep Black | `#060611` | Background base |
| Surface | `#0f0f2a` | Card backgrounds |

### Typography

- **Headings**: Space Grotesk (700, 800)
- **Body**: Inter (400, 500, 600)
- **Monospace**: JetBrains Mono (scores, timers)

### Effects

- **Glassmorphism**: Frosted glass cards with `backdrop-filter: blur(20px)`
- **Glow Effects**: Neon shadows on interactive elements
- **Particle Background**: Animated floating particles
- **Micro-animations**: Spring-based transitions, staggered reveals

---

## 📱 Responsive Design

| Breakpoint | Layout Changes |
|-----------|---------------|
| `> 1024px` | Full sidebar + right panel visible |
| `768px - 1024px` | Sidebar collapses (hamburger toggle), session panel hides |
| `480px - 768px` | Single column layout, stack all grids |
| `< 480px` | Compact mode, hide vibe meter, smaller ROBO |

---

## 🧪 Interactive Demo Commands

Open browser console and try:

```javascript
// Talk to ROBO
Robo.interact()

// Trigger confetti
Utils.confetti()

// Get game suggestions from ROBO
Social.suggestGame()

// Force Ghost Crown on a member (while in session)
Session.triggerGhostCrown(Session.members[1])

// Start an accent mode challenge
Social.startAccentMode()

// Launch the Rabbit Hole game
Social.startRabbitHole()
```

---

## 📂 Screen Inventory

| # | Screen | Status |
|---|--------|--------|
| 1 | Landing Page (Hero + Features + ROBO) | ✅ Complete |
| 2 | Auth (Login + Signup) | ✅ Complete |
| 3 | Onboarding (3-step wizard) | ✅ Complete |
| 4 | Dashboard Home | ✅ Complete |
| 5 | Sessions Tab | ✅ Complete |
| 6 | Leaderboard Tab | ✅ Complete |
| 7 | Memory Palace Tab | ✅ Complete |
| 8 | Director's Chair Tab | ✅ Complete |
| 9 | Confessional Booth Tab | ✅ Complete |
| 10 | Settings Tab | ✅ Complete |
| 11 | Session Room (Live Chat) | ✅ Complete |
| 12 | Ghost Crown Alert | ✅ Complete |
| 13 | Boredom Alert | ✅ Complete |
| 14 | Mini-Game Arena (8 games) | ✅ Complete |
| 15 | AI Judge Verdict Screen | ✅ Complete |
| 16 | Prophecy Modal | ✅ Complete |
| 17 | Create Session Modal | ✅ Complete |
| 18 | Chaos Card Overlay | ✅ Complete |
| 19 | Spin Wheel (Wildcard) | ✅ Complete |

---

## 🔐 Data Persistence

All user data is stored in `localStorage`:

| Key | Data |
|-----|------|
| `vibesync_user` | User profile (name, email, avatar, vibe) |

Data persists across page reloads and browser sessions. Clear with:
```javascript
localStorage.clear()
```

---

## ♿ Accessibility

- Semantic HTML5 elements throughout
- Keyboard navigation support (Escape closes modals, `/` focuses chat)
- ARIA labels on interactive elements
- `prefers-reduced-motion` respected for animations
- Minimum 4.5:1 contrast ratio for text
- 44x44px minimum touch targets
- Screen reader announcements for dynamic content

---

## 🏆 Competitive Landscape

| Platform | What They Do | What VIBESYNC Does Better |
|----------|-------------|--------------------------|
| Discord | Text/voice chat | AI-driven engagement, nobody goes silent |
| Netflix Party | Synced viewing | Interactive games, social dynamics |
| Kahoot | Quiz games | Context-aware, adapts to group energy |
| Jackbox | Party games | Always-on AI host, not session-limited |
| Gather.town | Virtual spaces | Personality-driven interactions |

---

## 📄 Documentation

- **UX Architecture**: Complete specification with Information Architecture, User Flows, Screen Breakdowns, Microcopy, Error/Empty/Loading States, and Structural Recommendations
- **Implementation Plan**: Phased build approach from design system to polish
- **This README**: Technical documentation and feature overview

---

## 👥 Target Users

- **Friend groups** who want to make their hangouts more fun
- **Online communities** struggling with engagement drop-off
- **Gaming groups** looking for structured social experiences
- **Anyone** tired of dead group chats

---

<p align="center">
  <strong>Built with ⚡ and a lot of vibes</strong><br>
  <em>© 2026 VIBESYNC. Where Groups Come Alive.</em>
</p>
