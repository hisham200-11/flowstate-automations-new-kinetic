# Changelog

All notable changes to the FlowState Automations platform (`flowstate-kinetic-white`) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.1.0] - 2026-10-08

### Added
- **Vertical Landing Pages Suite**:
  - `real-estate-automation.html`: Dedicated landing page tailored for Philippine real estate brokers, property managers, and developers (inquiry triage, viewing bookings, contract tracking).
  - `logistics-automation.html`: Specialized workflow page for fleet dispatchers, couriers, and warehouse hubs (route dispatch, waybill tracking, multi-branch messaging).
  - `healthcare-automation.html`: Patient booking, triage, and doctor scheduling engine for clinics and diagnostic centers.
  - Complete JSON-LD Schema markup for all vertical pages (`WebPage`, `Service`, `BreadcrumbList`, `FAQPage`).
- **Web App Manifest (`manifest.webmanifest`)**:
  - Standalone PWA metadata with obsidian theme colors (`#09090b`), high-res icons, and shortcuts.
- **GitHub Actions CI/CD Pipeline (`.github/workflows/ci.yml`)**:
  - Automated quality gate running `oxlint` static analysis, Cloudflare security headers validation, and core asset integrity checks.

### Changed
- **$10K B2B Editorial Experience Overhaul**:
  - Implemented 5-Act narrative architecture in `index.html`.
  - Introduced `Instrument Serif` editorial italics combined with `Plus Jakarta Sans` and `JetBrains Mono` HUD typography.
  - Interactive **Before/After Transformation Switch** comparing manual chaos vs. FlowState precision engineering.
  - Dynamic H1 keyword kicker badge for SEO relevance.
  - Updated `sitemap.xml` with refreshed priority indexing and new vertical routes.

### Security & Hardening
- **DOM-Based XSS Elimination**:
  - Re-engineered message rendering in `chatbot.js` using native DOM node construction and `textContent` instead of vulnerable `innerHTML` string interpolation.
  - Added HTML entity escaping (`escapeHtml()`) in `app.js` for form feedback and clipboard toasts.
- **Strict CORS & Origin Verification**:
  - Patched loose wildcard regex in `functions/api/chat.js` and `functions/api/contact.js` to strictly match `flowstate\.ph`, `pages\.dev`, and local test origins.
  - Removed permissive wildcard `'*'` fallback headers for unauthorized cross-origin callers.
- **IP Rate Limiting & DoS Shield**:
  - Added in-memory sliding window rate limiting on Cloudflare Pages functions:
    - `/api/chat`: 12 requests / minute (HTTP 429 with `Retry-After: 60`).
    - `/api/contact`: 5 requests / 5 minutes (HTTP 429 with `Retry-After: 300`).
  - Added null-byte stripping (`\0`) on user chat inputs.
- **Lead Email Alert Deduplication**:
  - Implemented `dispatchedLeadSessions` tracking to prevent spamming notification mailboxes on multi-turn chatbot conversations.
- **Content Security Policy (CSP) Tightening**:
  - Removed unused external script CDNs (`cdnjs.cloudflare.com`, `cdn.jsdelivr.net`) and third-party API hosts from client `connect-src` in `_headers`.

### Performance & Reliability
- **Zero-Lead-Loss Network Fail-Safe**:
  - Preserved user inputs on submission failure with 1-click fallback buttons (direct mailto link with encoded payload, telephone hotline).
- **Smart Battery & GPU Conservation**:
  - Added `document.visibilitychange` listener to pause background canvas animations and timers when the tab is inactive.
- **WCAG Accessibility Compliance**:
  - Enforced minimum 44×44px touch targets on mobile drawer, scenario selectors, and floating interactive controls.
- **Zero Layout Shift (0 CLS)**:
  - Fixed font-loading flash and ensured 60/120 FPS performance on laptops with GPU hardware acceleration.

---

## [1.0.0] - 2026-09-20

### Added
- Initial release of FlowState Automations Kinetic White landing page.
- 0px Swiss brutalist geometry design system.
- Anime.js v4 kinetic canvas background and interactive scope estimator.
- Cloudflare Pages Functions integration for Groq LLM inference and Resend email alerts.
