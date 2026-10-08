# FlowState Automations — Kinetic White Platform

> High-performance custom software engineering, business process automation, applied AI, and integrated workforce systems for growing Philippine enterprises.

[![CI & Quality Gate](https://github.com/hisham200-11/flowstate-automations-new-kinetic/actions/workflows/ci.yml/badge.svg)](https://github.com/hisham200-11/flowstate-automations-new-kinetic/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)
[![Design System](https://img.shields.io/badge/Design_System-Kinetic_White_0px-e11d48.svg)](https://flowstate.ph)

---

## 1. Overview

FlowState Automations delivers tailored enterprise software and sub-2-second conversational automation that converts website inquiries, Messenger messages, and WhatsApp conversations into confirmed consultations and CRM records.

### Core Value Proposition
- **Outcome-Driven Engineering:** Instant lead qualification, automated multi-channel routing, and synchronized calendar scheduling.
- **Dedicated Architecture:** 100% private data ownership on dedicated cloud infrastructure with zero recurring per-seat SaaS taxes.
- **Applied AI & Edge Hardware:** Practical LLM triage pipelines and physical attendance hardware (RFID + Biometrics) unified into central executive dashboards.
- **Kinetic White Design System:** 0px Swiss brutalist mechanical geometry, high-contrast monochrome obsidian ink (`#09090b`), Signal Crimson accents (`#e11d48`), and 60/120 FPS hardware-accelerated kinetic motion.

---

## 2. Platform Architecture & Capabilities

```
flowstate-kinetic-white/
├── .github/
│   └── workflows/
│       └── ci.yml                     # Automated CI/CD quality gate & security linting
├── functions/
│   └── api/
│       ├── chat.js                    # Cloudflare Pages Function: Groq LLM + D1 + Resend dispatch
│       └── contact.js                 # Cloudflare Pages Function: Validated lead capture & alerts
├── img/                               # Brand assets, og-images, and logos
├── js/
│   ├── anime.esm.js                   # Anime.js v4 ES Module
│   └── anime.umd.js                   # Anime.js v4 production UMD bundle
├── index.html                         # Flagship B2B landing page (5-Act narrative)
├── real-estate-automation.html        # Vertical landing page: Real estate & brokerages
├── logistics-automation.html          # Vertical landing page: Fleet dispatch & warehouse hubs
├── healthcare-automation.html         # Vertical landing page: Clinics & diagnostic centers
├── about.html                         # Company profile, 8-stage methodology, 4-pillar bento
├── app.js                             # Interactive client engine (ROI calculator, scope matrix)
├── chatbot.js                         # Hardened mechanical HUD live chat assistant
├── chatbot.css                        # Chatbot widget layout & visual tokens
├── styles.css                         # Kinetic White tokens, responsive grids, brutalist CSS
├── _headers                           # Strict HTTP security headers (CSP, HSTS, Permissions)
├── manifest.webmanifest               # Web App Manifest for mobile home-screen & PWA
├── sitemap.xml                        # SEO XML sitemap with vertical priority indexing
├── robots.txt                         # Search engine crawler directives
└── CHANGELOG.md                       # Comprehensive version history
```

---

## 3. Four Core Service Pillars

1. **Custom Software Solutions:** Enterprise management portals, bespoke CRM pipelines (Filament / Laravel / Postgres), and internal operations software.
2. **Business Process Automation:** Multi-channel inquiry routing, instant calendar booking locks, and automated Google Sheets / CRM sync.
3. **Applied Artificial Intelligence:** High-utility business AI, real-time inquiry triage, and internal document retrieval.
4. **Integrated Technology Solutions:** RFID hardware integration, biometric employee verification, and cloud workforce telemetry.

---

## 4. Security & Hardening Architecture

The codebase has undergone full **STRIDE threat modeling** and application security hardening:

| Layer | Defense Mechanism | Implementation Detail |
| :--- | :--- | :--- |
| **Client-Side DOM** | XSS Immunity | Dynamic chat messages are rendered via native `document.createElement` and `.textContent`. Input values are bounded and HTML entities sanitized via `escapeHtml()`. |
| **CORS Boundaries** | Strict Origin Whitelist | Endpoints match `flowstate\.ph`, `pages\.dev`, and local test origins. Wildcard fallback `'*'` is strictly eliminated. |
| **API Denial of Service** | Sliding-Window Rate Limiting | In-memory isolate rate limiters: max 12 requests/min on `/api/chat`, max 5 requests/5 min on `/api/contact`. Returns HTTP `429 Too Many Requests`. |
| **Prompt Injection** | Model Guardrails | Dual-layer instruction boundaries, input token truncation (max 1000 chars/message, max 10 turns), and null-byte (`\0`) stripping. |
| **Notification Spam** | Session Deduplication | Chat session alerts are deduplicated via LRU sets to prevent founder inbox flooding during extended conversations. |
| **HTTP Headers** | Strict Browser Enforcements | Enforced in `_headers`: Strict CSP without third-party CDNs, HSTS with preloading (`max-age=31536000`), `X-Frame-Options: DENY`, and sensor lockdown via `Permissions-Policy`. |

---

## 5. Local Development & Verification

### Prerequisites
- Node.js 20+ (recommended: Node.js 22 LTS)
- Cloudflare Wrangler CLI (optional for full edge function emulation)

### Static Code Analysis
Run the ultra-fast Rust-based linter across all scripts and serverless functions:

```bash
# Run oxlint static code analysis
npx oxlint app.js chatbot.js functions/api/chat.js functions/api/contact.js
```

### Local Preview
Serve the static website locally using any static file server:

```bash
# Using Node's npx serve
npx serve .

# Or using Cloudflare Wrangler (runs local Pages Functions)
npx wrangler pages dev .
```

---

## 6. Cloudflare Pages Deployment & CI/CD

### Environment Variables
Configure these secrets in your Cloudflare Pages project settings:

| Variable | Description | Required | Default |
| :--- | :--- | :---: | :--- |
| `GROQ_API_KEY` | Groq inference API key for live chat responses | **Yes** | — |
| `GROQ_MODEL` | Primary LLM model identifier | No | `openai/gpt-oss-120b` |
| `RESEND_API_KEY` | Resend API key for instant lead email notifications | No | — |
| `NOTIFICATION_EMAIL` | Destination mailbox for incoming lead alerts | No | `flowstateautom8t@gmail.com` |
| `ALLOWED_ORIGIN` | Explicit production domain override | No | `https://flowstate.ph` |
| `DB` | Cloudflare D1 Database binding for audit logging | No | — |

### Continuous Integration (CI)
Every pull request and push to `main` triggers `.github/workflows/ci.yml`:
1. Static code analysis via `oxlint`.
2. HTTP security header validation (`_headers`).
3. Core HTML and metadata integrity checks.

---

## 7. Rollback & Disaster Recovery Runbook

In the event of an unexpected edge runtime regression:

```bash
# 1. Instant Cloudflare Pages Rollback
# Navigate to Cloudflare Dashboard > Workers & Pages > flowstate-kinetic-white > Deployments
# Select previous known-good deployment and click "Rollback to this deployment"

# 2. Git Revert Rollback
git revert HEAD --no-edit
git push origin main
```

---

## 8. License & Authorship

Designed and engineered by **FlowState Automations** (Metro Manila, Philippines).  
Licensed under the [MIT License](LICENSE).
