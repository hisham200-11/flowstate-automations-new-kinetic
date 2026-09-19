# FlowState Automations — Kinetic White

> High-performance conversational AI booking assistant, calendar lock engine, and custom CRM automation landing page built with the Kinetic White design system and Anime.js v4 kinetic choreography.

---

## Overview

FlowState Automations converts incoming web, Messenger, and WhatsApp traffic into confirmed bookings in sub-2 seconds. This codebase contains the standalone Kinetic White interface:
- **Design System:** Kinetic White — 0px Swiss brutalist geometry, monochrome ink contrast (`#000000`, `#0a0a0c`, `#ffffff`), and fluid responsive layouts.
- **Motion Engine:** Anime.js v4 orchestrating kinetic badge pulses, interactive scope estimators, and dynamic canvas backgrounds.
- **Backend Architecture:** Cloudflare Pages Functions (`functions/api/chat.js`) powered by Groq LLM inference with D1 and Resend integrations.

---

## Tech Stack

- **Frontend:** Vanilla HTML5, CSS3, Modern ES6+ JavaScript
- **Animation:** [Anime.js v4](https://animejs.com/) (bundled in `js/`)
- **Typography:** JetBrains Mono (monospace data/currency) + Plus Jakarta Sans (interface text)
- **Backend:** Cloudflare Pages Functions (Edge V8)
- **AI Engine:** Groq API (`openai/gpt-oss-120b` / `llama-3.3-70b-versatile` fallback chain)

---

## Directory Structure

```
├── app.js               # Core interface logic, scope calculator, dynamic tiers
├── chatbot.css          # Floating conversational AI widget styling
├── chatbot.js           # Lightweight client-side chat interface
├── functions/
│   └── api/
│       └── chat.js      # Cloudflare Pages Function (Groq + D1 + Resend)
├── img/                 # Authentic brand raster assets and vector icons
├── index.html           # Main production landing page
├── js/
│   ├── anime.esm.js     # Anime.js v4 ES Module
│   └── anime.umd.js     # Anime.js v4 UMD Bundle
└── styles.css           # Kinetic White design tokens and layout system
```

---

## Deployment

Deploy directly to Cloudflare Pages:

```bash
# Using Wrangler CLI
npx wrangler pages deploy . --project-name=flowstate-kinetic-white
```

### Environment Variables
Configure in your Cloudflare Pages Dashboard:
- `GROQ_API_KEY` (required for live AI responses)
- `RESEND_API_KEY` (optional for lead email notifications)
- `NOTIFICATION_EMAIL` (optional fallback: flowstateautom8t@gmail.com)
- `DB` (optional Cloudflare D1 database binding)
