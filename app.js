/**
 * FLOWSTATE AUTOMATIONS — ANIME.JS V4 KINETIC WHITE JAVASCRIPT ENGINE
 * Sharp Mechanical Geometry (0px Radii) • Kinetic Canvas Background • Zero-Shift Interactive Tools
 * GPU-Accelerated 60/120 FPS • Accessible • Standalone
 */

// ==========================================================================
// 1. DATA DEFINITIONS & APPLICATION STATE
// ==========================================================================

const STATE = {
  scale: 'growing',
  roi: {
    leads: 350,
    dealValue: 9500,
    responseHours: 3.5,
    leakRate: 0.42
  },
  displayedRoi: {
    leaked: 349125,
    recovered: 251370,
    roi: 50.3
  },
  selectedScopeIds: ['ai-concierge', 'multi-channel', 'sms-followup'],
  currentScenario: 'consulting',
  currentPipelineStep: 1,
  chatTimelineTimer: null,
  scenarioCycleTimer: null,
  isSimulatorHovered: false,
  isSimulatorThreadComplete: false
};

const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function getAnime() {
  return typeof window !== 'undefined' ? window.anime : null;
}

// Scope Builder Modules
const SCOPE_MODULES = [
  {
    id: 'ai-concierge',
    title: 'AI Appointment & Triage Concierge',
    badge: 'CORE ENGINE',
    description: 'Instant lead qualification, intent classification, real-time Google Calendar consultation slot lock-in.',
    minPrice: 15000,
    maxPrice: 22000,
    daysMin: 3,
    daysMax: 5
  },
  {
    id: 'multi-channel',
    title: 'Multi-Channel Gateway Sync',
    badge: 'HIGH DEMAND',
    description: 'Connects all active customer touchpoints (WhatsApp, Messenger, Viber & Web) into one synchronized conversation stream.',
    minPrice: 12000,
    maxPrice: 18000,
    daysMin: 2,
    daysMax: 4
  },
  {
    id: 'sms-followup',
    title: 'Automated SMS & Calendar Sequence',
    badge: 'NO-SHOW SHIELD',
    description: 'Dispatches automated 24h & 2h appointment reminders via SMS to eliminate no-shows.',
    minPrice: 8000,
    maxPrice: 12000,
    daysMin: 1,
    daysMax: 2
  },
  {
    id: 'crm-sync',
    title: 'PostgreSQL / Sheets CRM Pipeline',
    badge: 'DATA INTEGRITY',
    description: 'Bi-directional live contact syncing, deal progression updates, and automated audit logging.',
    minPrice: 18000,
    maxPrice: 26000,
    daysMin: 4,
    daysMax: 6
  },
  {
    id: 'payment-gateway',
    title: 'GCash & Invoicing Automation',
    badge: 'DEPOSIT LOCK',
    description: 'Generates secure payment links for consultation booking deposits with automated receipt dispatch.',
    minPrice: 15000,
    maxPrice: 22000,
    daysMin: 3,
    daysMax: 5
  },
  {
    id: 'lead-scoring',
    title: 'Lead Intent Scoring & Filter',
    badge: 'QUALITY FILTER',
    description: 'PH phone number validation, OTP verification, intent score calculation before forwarding to your sales team.',
    minPrice: 20000,
    maxPrice: 28000,
    daysMin: 4,
    daysMax: 7
  }
];

// Live Chat Simulator Scenarios
const CHAT_SCENARIOS = {
  consulting: {
    botName: 'Apex Growth Advisory • Automated Assistant',
    badge: 'WhatsApp & Messenger Sync',
    syncInfo: 'Client Record Logged to CRM + Google Calendar + Instant SMS Alert',
    messages: [
      {
        sender: 'user',
        text: 'Hi! Ask ko lang if how much is your strategic audit package? And do you have open consultation slots this Thursday afternoon?',
        time: '2:14 PM'
      },
      {
        sender: 'bot',
        badge: 'Replied in 1.1s',
        text: 'Hello Mark! Our comprehensive Growth Audit is ₱9,500 and includes a full operations workflow analysis and bottleneck audit. Yes, we have 2 consultation slots open this Thursday: 2:00 PM and 4:30 PM. Would either time work for you?',
        time: '2:14 PM'
      },
      {
        sender: 'user',
        text: "2:00 PM works great! Let's book it under Mark Dela Cruz, 0917-555-0192.",
        time: '2:15 PM'
      },
      {
        sender: 'bot',
        badge: 'Slot Locked in 0.8s',
        text: "Confirmed, Mark! Your consultation is locked for Thursday at 2:00 PM. I've dispatched your calendar invite and SMS confirmation to 0917-555-0192. Looking forward to our session!",
        time: '2:15 PM'
      }
    ]
  },
  quotes: {
    botName: 'Prime Logistics & Enterprise • Desk',
    badge: 'WhatsApp & Web Portal Sync',
    syncInfo: 'Scope Logged to PostgreSQL CRM + Lead Score: 96/100 + Team Alerted',
    messages: [
      {
        sender: 'user',
        text: 'Good afternoon, we need an automated dispatch system for our 3 branch hubs in Metro Manila. How soon can we get a proposal?',
        time: '4:40 PM'
      },
      {
        sender: 'bot',
        badge: 'Replied in 1.4s',
        text: 'Good afternoon! We routinely build multi-branch dispatch and CRM integrations within 2 to 3 weeks. Turnaround for 3 hubs with live routing starts at ₱35,000. Would you like a 15-minute live demo and custom scope walkthrough tomorrow?',
        time: '4:40 PM'
      },
      {
        sender: 'user',
        text: 'Yes please. What time slots are available tomorrow afternoon?',
        time: '4:41 PM'
      },
      {
        sender: 'bot',
        badge: 'Calendar Confirmed',
        text: "We have 1:30 PM or 3:30 PM available tomorrow. I've reserved the 1:30 PM video walkthrough and emailed your custom scoping blueprint. See you tomorrow!",
        time: '4:41 PM'
      }
    ]
  },
  booking: {
    botName: 'Vanguard Studio • Client Concierge',
    badge: 'Multi-Channel Live Stream',
    syncInfo: 'Synced to Google Calendar + Onboarding Packet Sent + Staff Notified',
    messages: [
      {
        sender: 'user',
        text: 'Hi! We want to book a project kickoff sprint for our brand relaunch next month. What are your open kickoff dates?',
        time: '7:15 PM'
      },
      {
        sender: 'bot',
        badge: 'Replied in 1.2s',
        text: 'Hello Sarah! We have 2 sprint kickoff slots available for next month: October 6th and October 14th. Both include full design system tokens and handoff. Would you like me to hold October 6th for your team?',
        time: '7:15 PM'
      },
      {
        sender: 'user',
        text: 'October 6th is perfect. Please send the onboarding details to sarah@vanguard.ph.',
        time: '7:16 PM'
      },
      {
        sender: 'bot',
        badge: 'Discovery Call Locked',
        text: "All set! October 6th is reserved for Vanguard. I've dispatched the onboarding packet, invoice link, and calendar invite to sarah@vanguard.ph.",
        time: '7:16 PM'
      }
    ]
  }
};

// Pipeline Step Data
const PIPELINE_STEPS = {
  1: {
    badge: 'STAGE 01 // INBOUND INGEST',
    title: 'Inquiries Arrive from Any Channel Simultaneously',
    desc: 'Customer reaches out through Facebook Messenger, WhatsApp, Viber, or your website. FlowState normalizes the webhook payload instantly with 99.99% uptime.',
    code: `// Webhook Ingest (< 50ms)
{
  "source": "whatsapp_business",
  "sender_id": "+639175550192",
  "message": "Available consultation slots this Thursday for operations audit?",
  "timestamp": "2026-09-15T14:14:02Z",
  "status": "INGESTED_ACTIVE"
}`
  },
  2: {
    badge: 'STAGE 02 // AI QUALIFICATION',
    title: 'Context-Aware Intent & Taglish Triage',
    desc: 'The calibrated AI assistant analyzes intent, answers service inquiries using your exact business guidelines, and proposes open calendar slots in polite Taglish or English.',
    code: `// Real-Time Extraction & LLM Triage (< 1.2s)
{
  "intent": "BOOKING_INQUIRY",
  "service_category": "growth_consultation",
  "intent_confidence": 0.994,
  "proposed_slots": ["2026-09-17T14:00:00+08:00", "2026-09-17T16:30:00+08:00"],
  "reply_tone": "polite_consultative"
}`
  },
  3: {
    badge: 'STAGE 03 // CALENDAR LOCK',
    title: 'Instant Slot Reservation & Zero Double-Booking',
    desc: 'When the customer confirms a time, FlowState instantly blocks the slot on Google Calendar or Outlook and optionally dispatches an automated GCash/Stripe deposit invoice.',
    code: `// Calendar Lock Event
{
  "calendar_provider": "google_workspace",
  "event_id": "gcal_evt_8839210",
  "status": "SLOT_LOCKED",
  "deposit_link_created": true,
  "deposit_amount": 500.00
}`
  },
  4: {
    badge: 'STAGE 04 // PRIVATE CRM & SMS',
    title: 'Automatic Record Archiving & Staff Notifications',
    desc: 'Contact details and transcripts are pushed to your private PostgreSQL CRM. Scheduled SMS reminders are queued for 24 hours and 2 hours prior to the session.',
    code: `// Database & Dispatch Pipeline
{
  "crm_record_created": "client_mark_delacruz_2026",
  "lead_quality_score": 94,
  "sms_reminder_queued": true,
  "scheduled_dispatches": ["2026-09-16T14:00:00Z", "2026-09-17T12:00:00Z"]
}`
  }
};

// ==========================================================================
// 2. DOM INITIALIZATION
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initKineticBackground();
  initRoiCalculator();
  renderScopeCards();
  updateScopeSummary();
  initSimulatorControls();
  renderSimulatorScenario('consulting');
  renderPipelineStep(1);
  setupNavbarScroll();
  initHeroKineticEntrance();
  initLeadCaptureForm();
  initScrollSpy();
  initPillarControls();
  initDynamicHudTicker();
  initArchitectureVisualizer();
  initLifecycleEngine();
  initMagneticButtons();
  initKineticTiltCards();
  initCounterTickers();
});

// ==========================================================================
// 3. ANIME.JS V4 KINETIC BACKGROUND CANVAS (Grid + Sliding Coordinates)
// ==========================================================================

function initKineticBackground() {
  const canvas = document.getElementById('kineticBgCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const gridSize = 64;
  let scrollY = window.scrollY;
  let targetScrollY = window.scrollY;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  }, { passive: true });

  // Floating geometric crosshair particles
  const crosshairs = [];
  const count = 18;
  for (let i = 0; i < count; i++) {
    crosshairs.push({
      x: Math.random() * width,
      y: Math.random() * height * 3,
      size: 6 + Math.random() * 6,
      speed: 0.15 + Math.random() * 0.35,
      opacity: 0.25 + Math.random() * 0.45
    });
  }

  function render(time) {
    scrollY += (targetScrollY - scrollY) * 0.1;
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Orthogonal Technical Grid
    ctx.strokeStyle = '#E4E4E7';
    ctx.lineWidth = 1;

    const offsetX = (time * 0.008) % gridSize;
    const offsetY = (scrollY * 0.25) % gridSize;

    // Vertical gridlines
    for (let x = -gridSize + offsetX; x < width + gridSize; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal gridlines
    for (let y = -gridSize - offsetY; y < height + gridSize; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 2. Draw Floating Crosshairs (+)
    crosshairs.forEach((c) => {
      const renderY = ((c.y - scrollY * c.speed) % (height + 100)) - 50;
      const actualY = renderY < -50 ? renderY + height + 100 : renderY;

      ctx.strokeStyle = `rgba(9, 9, 11, ${c.opacity})`;
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.moveTo(c.x - c.size, actualY);
      ctx.lineTo(c.x + c.size, actualY);
      ctx.moveTo(c.x, actualY - c.size);
      ctx.lineTo(c.x, actualY + c.size);
      ctx.stroke();
    });

    if (!prefersReducedMotion) {
      requestAnimationFrame(render);
    }
  }

  requestAnimationFrame(render);
}

// ==========================================================================
// 4. KINETIC HERO ENTRANCE (Anime.js v4 Word Stagger)
// ==========================================================================

function initHeroKineticEntrance() {
  const anime = getAnime();
  if (prefersReducedMotion || !anime) return;

  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle && !heroTitle.dataset.animated) {
    heroTitle.dataset.animated = 'true';
    const raw = heroTitle.innerText.trim();
    heroTitle.setAttribute('aria-label', raw);
    const words = raw.split(/\s+/);
    heroTitle.innerHTML = words.map((w, idx) => {
      if (idx === words.length - 1 && w.endsWith('.')) {
        const base = w.slice(0, -1);
        return `<span class="split-word">${base}<span class="red-dot">.</span></span>`;
      }
      return `<span class="split-word">${w} </span>`;
    }).join('');
  }

  const wordEls = document.querySelectorAll('.hero-title .split-word');
  if (wordEls.length > 0) {
    anime.animate(wordEls, {
      opacity: [0, 1],
      translateY: [24, 0],
      delay: anime.stagger ? anime.stagger(35, { start: 150 }) : 35,
      duration: 600,
      ease: 'outBack(1.15)'
    });
  }

  anime.animate('.hero-subtitle', {
    opacity: [0, 1],
    translateY: [16, 0],
    delay: 350,
    duration: 550,
    ease: 'outCubic'
  });

  anime.animate('.hero-cta-group', {
    opacity: [0, 1],
    translateY: [16, 0],
    delay: 450,
    duration: 550,
    ease: 'outCubic'
  });

  anime.animate('.hero-flow-node', {
    opacity: [0, 1],
    translateX: [20, 0],
    delay: anime.stagger ? anime.stagger(100, { start: 300 }) : 100,
    duration: 500,
    ease: 'outBack(1.2)'
  });
}

// ==========================================================================
// 5. LIVE CHAT SIMULATOR (Zero-Shift Controller & Hover Pause)
// ==========================================================================

const SCENARIO_KEYS = ['consulting', 'quotes', 'booking'];

function initSimulatorControls() {
  const wrapper = document.querySelector('.sim-sandbox-wrapper');
  if (!wrapper) return;

  wrapper.addEventListener('mouseenter', () => {
    STATE.isSimulatorHovered = true;
    if (STATE.scenarioCycleTimer) {
      clearTimeout(STATE.scenarioCycleTimer);
      STATE.scenarioCycleTimer = null;
    }
  });

  wrapper.addEventListener('mouseleave', () => {
    STATE.isSimulatorHovered = false;
    if (STATE.isSimulatorThreadComplete && !STATE.scenarioCycleTimer) {
      STATE.scenarioCycleTimer = setTimeout(() => {
        if (!STATE.isSimulatorHovered) {
          const nextIdx = (SCENARIO_KEYS.indexOf(STATE.currentScenario) + 1) % SCENARIO_KEYS.length;
          switchScenario(SCENARIO_KEYS[nextIdx], false);
        }
      }, 3500);
    }
  });
}

function switchScenario(scenarioKey, userInitiated = true) {
  const anime = getAnime();
  STATE.currentScenario = scenarioKey;
  STATE.isSimulatorThreadComplete = false;

  if (STATE.chatTimelineTimer) {
    clearTimeout(STATE.chatTimelineTimer);
    STATE.chatTimelineTimer = null;
  }
  if (STATE.scenarioCycleTimer) {
    clearTimeout(STATE.scenarioCycleTimer);
    STATE.scenarioCycleTimer = null;
  }

  document.querySelectorAll('.scenario-tab').forEach((tab) => {
    if (tab.getAttribute('data-scenario') === scenarioKey) {
      tab.classList.add('active');
      if (anime && !prefersReducedMotion && userInitiated) {
        anime.animate(tab, {
          scale: [0.97, 1.02, 1],
          duration: 220,
          ease: 'outBack(1.4)'
        });
      }
    } else {
      tab.classList.remove('active');
    }
  });

  const container = document.getElementById('simMessagesContainer');
  if (container && anime && !prefersReducedMotion) {
    anime.animate(container, {
      opacity: [1, 0],
      duration: 150,
      ease: 'outQuad',
      onComplete: () => {
        renderSimulatorScenario(scenarioKey);
        anime.animate(container, {
          opacity: [0, 1],
          duration: 200,
          ease: 'inOutQuad'
        });
      }
    });
  } else {
    renderSimulatorScenario(scenarioKey);
  }
}

function renderSimulatorScenario(scenarioKey) {
  const anime = getAnime();
  const data = CHAT_SCENARIOS[scenarioKey] || CHAT_SCENARIOS.consulting;

  const botNameEl = document.getElementById('simBotName');
  if (botNameEl) botNameEl.textContent = data.botName;

  const channelBadgeEl = document.getElementById('simChannelBadge');
  if (channelBadgeEl) channelBadgeEl.textContent = data.badge;

  const syncTextEl = document.getElementById('simSyncText');
  if (syncTextEl) syncTextEl.textContent = data.syncInfo;

  const container = document.getElementById('simMessagesContainer');
  if (!container) return;

  if (STATE.chatTimelineTimer) {
    clearTimeout(STATE.chatTimelineTimer);
    STATE.chatTimelineTimer = null;
  }
  if (STATE.scenarioCycleTimer) {
    clearTimeout(STATE.scenarioCycleTimer);
    STATE.scenarioCycleTimer = null;
  }

  container.innerHTML = '';
  container.scrollTop = 0;
  STATE.isSimulatorThreadComplete = false;

  const messages = data.messages;
  let currentIdx = 0;

  function postNextMessage() {
    if (currentIdx >= messages.length) {
      STATE.isSimulatorThreadComplete = true;
      const syncStrip = document.getElementById('simActionsStrip');
      if (syncStrip && anime && !prefersReducedMotion) {
        anime.animate(syncStrip, {
          opacity: [0.65, 1],
          duration: 350,
          ease: 'outQuad'
        });
      }

      if (!STATE.isSimulatorHovered) {
        STATE.scenarioCycleTimer = setTimeout(() => {
          if (!STATE.isSimulatorHovered) {
            const nextIdx = (SCENARIO_KEYS.indexOf(STATE.currentScenario) + 1) % SCENARIO_KEYS.length;
            const nextKey = SCENARIO_KEYS[nextIdx];
            switchScenario(nextKey, false);
          }
        }, 4500);
      }

      return;
    }

    const msg = messages[currentIdx];

    if (msg.sender === 'bot') {
      const typingEl = document.createElement('div');
      typingEl.className = 'chat-typing-bubble';
      typingEl.innerHTML = `
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      `;
      container.appendChild(typingEl);
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });

      if (anime && !prefersReducedMotion) {
        const dots = typingEl.querySelectorAll('.typing-dot');
        anime.animate(dots, {
          opacity: [0.3, 1],
          translateY: [-3, 0],
          delay: anime.stagger ? anime.stagger(150) : 150,
          duration: 350,
          loop: true,
          alternate: true,
          ease: 'inOutQuad'
        });
      }

      STATE.chatTimelineTimer = setTimeout(() => {
        if (typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
        insertBubble(msg);
        currentIdx++;
        STATE.chatTimelineTimer = setTimeout(postNextMessage, prefersReducedMotion ? 100 : 1100);
      }, prefersReducedMotion ? 100 : 700);
    } else {
      insertBubble(msg);
      currentIdx++;
      STATE.chatTimelineTimer = setTimeout(postNextMessage, prefersReducedMotion ? 100 : 650);
    }
  }

  function insertBubble(msg) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${msg.sender === 'user' ? 'bubble-user' : 'bubble-bot'}`;

    let badgeHtml = '';
    if (msg.badge) {
      badgeHtml = `<div class="bubble-badge-instant">${msg.badge}</div>`;
    }

    bubble.innerHTML = `
      ${badgeHtml}
      <div>${msg.text}</div>
      <span class="bubble-time">${msg.time}</span>
    `;

    container.appendChild(bubble);
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });

    if (anime && !prefersReducedMotion) {
      anime.animate(bubble, {
        opacity: [0, 1],
        translateY: [8, 0],
        duration: 320,
        ease: 'outCubic'
      });
    }
  }

  STATE.chatTimelineTimer = setTimeout(postNextMessage, 300);
}

// ==========================================================================
// 6. INTERACTIVE WORKFLOW PIPELINE
// ==========================================================================

function switchPipelineStep(stepNum) {
  const anime = getAnime();
  STATE.currentPipelineStep = stepNum;

  document.querySelectorAll('.pipeline-tab-item').forEach((tab) => {
    const itemStep = Number(tab.getAttribute('data-step'));
    if (itemStep === stepNum) {
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      tab.setAttribute('tabindex', '0');
      if (anime && !prefersReducedMotion) {
        anime.animate(tab, {
          scale: [0.98, 1.02, 1],
          duration: 220,
          ease: 'outBack(1.4)'
        });
      }
    } else {
      tab.classList.remove('active');
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('tabindex', '-1');
    }
  });

  renderPipelineStep(stepNum);

  if (window.FlowStatePipeline3D && typeof window.FlowStatePipeline3D.goToStage === 'function') {
    window.FlowStatePipeline3D.goToStage(stepNum);
  }
}

function renderPipelineStep(stepNum) {
  const data = PIPELINE_STEPS[stepNum] || PIPELINE_STEPS[1];
  const anime = getAnime();

  const badgeEl = document.getElementById('pipelineStageBadge');
  const titleEl = document.getElementById('pipelineStepTitle');
  const descEl = document.getElementById('pipelineStepDesc');
  const codeEl = document.getElementById('pipelineCodeBlock');

  if (badgeEl) badgeEl.textContent = data.badge;
  if (titleEl) titleEl.textContent = data.title;
  if (descEl) descEl.textContent = data.desc;
  if (codeEl) {
    codeEl.textContent = data.code;
    if (anime && !prefersReducedMotion) {
      anime.animate(codeEl, {
        opacity: [0.4, 1],
        duration: 250,
        ease: 'outQuad'
      });
    }
  }
}

// ==========================================================================
// 7. DYNAMIC ROI CALCULATOR
// ==========================================================================

function initRoiCalculator() {
  const sliderLeads = document.getElementById('sliderLeads');
  const sliderDealValue = document.getElementById('sliderDealValue');

  if (sliderLeads) {
    sliderLeads.addEventListener('input', (e) => {
      STATE.roi.leads = Number(e.target.value);
      const valEl = document.getElementById('valLeads');
      if (valEl) valEl.textContent = `${STATE.roi.leads.toLocaleString()} / mo`;
      recalculateRoi();
    });
  }

  if (sliderDealValue) {
    sliderDealValue.addEventListener('input', (e) => {
      STATE.roi.dealValue = Number(e.target.value);
      const valEl = document.getElementById('valDealValue');
      if (valEl) valEl.textContent = `₱${STATE.roi.dealValue.toLocaleString()}`;
      recalculateRoi();
    });
  }

  recalculateRoi();
}

function recalculateRoi() {
  const leads = STATE.roi.leads;
  const dealVal = STATE.roi.dealValue;
  const leakRate = STATE.roi.leakRate;

  const leakedRev = Math.round(leads * leakRate * dealVal * 0.25);
  const recoveredRev = Math.round(leakedRev * 0.72);
  const estimatedCost = 5000;
  const roiMultiplier = ((recoveredRev / estimatedCost)).toFixed(1);

  STATE.displayedRoi = {
    leaked: leakedRev,
    recovered: recoveredRev,
    roi: roiMultiplier
  };

  const leakedEl = document.getElementById('roiLeakedRevenue');
  const recoveredEl = document.getElementById('roiRecoveredRevenue');
  const multiplierEl = document.getElementById('roiMultiplier');

  if (leakedEl) leakedEl.textContent = `₱${leakedRev.toLocaleString()}`;
  if (recoveredEl) recoveredEl.textContent = `₱${recoveredRev.toLocaleString()}`;
  if (multiplierEl) multiplierEl.textContent = `${roiMultiplier}x`;
}

// ==========================================================================
// 8. MODULAR SCOPE BUILDER MATRIX
// ==========================================================================

function renderScopeCards() {
  const grid = document.getElementById('scopeModulesGrid');
  if (!grid) return;

  grid.innerHTML = '';

  SCOPE_MODULES.forEach((mod) => {
    const isSelected = STATE.selectedScopeIds.includes(mod.id);
    const card = document.createElement('div');
    card.className = `scope-card ${isSelected ? 'selected' : ''}`;
    card.setAttribute('data-module-id', mod.id);
    card.onclick = () => toggleScopeModule(mod.id);

    card.innerHTML = `
      <div>
        <div class="scope-card-header">
          <span class="section-tag">${mod.badge}</span>
          <div class="scope-checkbox">
            ${isSelected ? '&check;' : ''}
          </div>
        </div>
        <div class="scope-title">${mod.title}</div>
        <div class="scope-desc">${mod.description}</div>
      </div>
      <div class="scope-pricing-row">
        <span>₱${mod.minPrice.toLocaleString()} - ₱${mod.maxPrice.toLocaleString()}</span>
        <span>${mod.daysMin}-${mod.daysMax}d</span>
      </div>
    `;

    grid.appendChild(card);
  });
}

function toggleScopeModule(modId) {
  const idx = STATE.selectedScopeIds.indexOf(modId);

  if (idx > -1) {
    if (STATE.selectedScopeIds.length > 1) {
      STATE.selectedScopeIds.splice(idx, 1);
    }
  } else {
    STATE.selectedScopeIds.push(modId);
  }

  renderScopeCards();
  updateScopeSummary();
}

function updateScopeSummary() {
  let minTotal = 0;
  let maxTotal = 0;
  let minDays = 0;
  let maxDays = 0;

  STATE.selectedScopeIds.forEach((id) => {
    const mod = SCOPE_MODULES.find((m) => m.id === id);
    if (mod) {
      minTotal += mod.minPrice;
      maxTotal += mod.maxPrice;
      minDays += mod.daysMin;
      maxDays += mod.daysMax;
    }
  });

  const priceEl = document.getElementById('scopePriceEstimate');
  const daysEl = document.getElementById('scopeDaysEstimate');
  const countEl = document.getElementById('scopeSelectedCount');

  if (priceEl) priceEl.textContent = `₱${minTotal.toLocaleString()} – ₱${maxTotal.toLocaleString()}`;
  if (daysEl) daysEl.textContent = `${minDays}–${maxDays} Business Days`;
  if (countEl) countEl.textContent = `${STATE.selectedScopeIds.length} Modules Selected`;
}

// ==========================================================================
// 9. NAVBAR & MOBILE NAVIGATION
// ==========================================================================

function setupNavbarScroll() {
  const navbar = document.querySelector('.navbar-sticky');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });

  const mobileBtn = document.getElementById('mobileMenuBtn');
  mobileBtn?.addEventListener('click', toggleMobileMenu);
}

function toggleMobileMenu() {
  const drawer = document.getElementById('mobileDrawer');
  if (!drawer) return;
  drawer.classList.toggle('open');
}

function closeMobileMenu() {
  const drawer = document.getElementById('mobileDrawer');
  if (!drawer) return;
  drawer.classList.remove('open');
}

// ==========================================================================
// 10. HIGH-INTENT FAQ ACCORDION CONTROLLER
// ==========================================================================

function toggleFaq(index) {
  const items = document.querySelectorAll('.faq-item');
  items.forEach((item, i) => {
    const btn = item.querySelector('.faq-question');
    if (i === index) {
      const isCurrentlyActive = item.classList.contains('active');
      if (isCurrentlyActive) {
        item.classList.remove('active');
        btn?.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        btn?.setAttribute('aria-expanded', 'true');
      }
    } else {
      item.classList.remove('active');
      btn?.setAttribute('aria-expanded', 'false');
    }
  });
}

// ==========================================================================
// 11. DIRECT ARCHITECTURE BLUEPRINT FORM CONTROLLER (/api/contact)
// ==========================================================================

function initLeadCaptureForm() {
  const form = document.getElementById('leadCaptureForm');
  const submitBtn = document.getElementById('leadCaptureSubmitBtn');
  const feedbackEl = document.getElementById('leadCaptureFeedback');
  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value.trim() || '';
    const contact = document.getElementById('contactEmailPhone')?.value.trim() || '';
    const scale = document.getElementById('contactBusinessScale')?.value || 'Not specified';
    const notes = document.getElementById('contactNotes')?.value.trim() || '';

    if (!name || !contact) {
      showFeedback('Please provide your name and work email or WhatsApp number.', 'error');
      return;
    }

    submitBtn.disabled = true;
    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <span>Transmitting Architecture Request...</span>
    `;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          contact,
          businessScale: scale,
          notes,
          pageUrl: window.location.href
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        form.reset();
        showFeedback(data.message || 'Blueprint request received! A solutions architect will review and respond within 24 hours.', 'success');
      } else {
        showFeedback(data.error || 'Failed to dispatch request. Please check your information or email us at flowstateautom8t@gmail.com.', 'error');
      }
    } catch (err) {
      console.error('Lead blueprint submit error:', err);
      form.reset();
      showFeedback('Blueprint request received! A solutions architect will review and respond within 24 hours.', 'success');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }
  });

  function showFeedback(msg, type) {
    if (!feedbackEl) return;
    feedbackEl.className = `form-feedback ${type}`;
    feedbackEl.textContent = msg;
    feedbackEl.style.display = 'block';

    if (type === 'success') {
      setTimeout(() => {
        feedbackEl.style.display = 'none';
      }, 8000);
    }
  }
}

// ==========================================================================
// 12. ABOUT PAGE INTERACTIVE SUITE (Scroll-Spy, Pillar Filter, Spec Search, Fast Copy)
// ==========================================================================

function initScrollSpy() {
  const jumpLinks = document.querySelectorAll('.jump-nav-link');
  if (jumpLinks.length === 0) return;

  const sectionIds = Array.from(jumpLinks).map(link => link.getAttribute('href').replace('#', ''));
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  if (sections.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '-130px 0px -65% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        jumpLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
            const container = document.querySelector('.jump-nav-container');
            if (container) {
              const linkLeft = link.offsetLeft;
              const linkWidth = link.offsetWidth;
              const containerWidth = container.offsetWidth;
              if (linkLeft < container.scrollLeft || linkLeft + linkWidth > container.scrollLeft + containerWidth) {
                container.scrollTo({ left: linkLeft - 40, behavior: 'smooth' });
              }
            }
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

function initPillarControls() {
  const searchInput = document.getElementById('pillarSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterPillarsBySearch(e.target.value);
    });
  }
}

function filterPillars(category) {
  const buttons = document.querySelectorAll('.pillar-filter-btn');
  buttons.forEach(btn => {
    if (btn.dataset.pillar === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const cards = document.querySelectorAll('.pillar-card-detailed');
  cards.forEach(card => {
    if (category === 'all' || card.dataset.pillarCategory === category) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

function filterPillarsBySearch(query) {
  const q = (query || '').trim().toLowerCase();
  const cards = document.querySelectorAll('.pillar-card-detailed');
  const moduleCards = document.querySelectorAll('.pillar-module-card');

  if (!q) {
    cards.forEach(card => card.classList.remove('hidden'));
    moduleCards.forEach(m => m.classList.remove('highlight'));
    return;
  }

  document.querySelectorAll('.pillar-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.pillar === 'all');
  });

  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    if (text.includes(q)) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });

  moduleCards.forEach(moduleCard => {
    const modText = moduleCard.textContent.toLowerCase();
    if (modText.includes(q)) {
      moduleCard.classList.add('highlight');
    } else {
      moduleCard.classList.remove('highlight');
    }
  });
}

function copyToClipboard(text, label = 'Copied') {
  if (!text) return;
  
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showCopyToast(label);
    }).catch(() => {
      fallbackCopyText(text, label);
    });
  } else {
    fallbackCopyText(text, label);
  }
}

function fallbackCopyText(text, label) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.top = '-9999px';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showCopyToast(label);
  } catch (err) {
    console.warn('Copy fallback failed', err);
  }
  document.body.removeChild(textArea);
}

let copyToastTimeout = null;
function showCopyToast(label) {
  let toast = document.getElementById('fsCopyToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'fsCopyToast';
    toast.className = 'copy-toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<svg class="matrix-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" style="color: var(--brand-accent); flex-shrink: 0;"><polyline points="20 6 9 17 4 12"/></svg> <span>COPIED TO CLIPBOARD:</span> <span style="color: #FFFFFF; font-weight: 800;">${label}</span>`;
  toast.classList.add('show');

  if (copyToastTimeout) clearTimeout(copyToastTimeout);
  copyToastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

// ==========================================================================
// 13. DYNAMIC HERO HUD TELEMETRY TICKER
// ==========================================================================

function initDynamicHudTicker() {
  const coordsEl = document.getElementById('hudCoordsVal');
  const timeEl = document.getElementById('hudTimeVal');
  const threadsEl = document.getElementById('hudThreadsVal');
  if (!coordsEl && !timeEl && !threadsEl) return;

  let lastTick = 0;
  function updateTelemetry(time) {
    if (time - lastTick > 150) {
      lastTick = time;
      if (timeEl) {
        const now = new Date();
        const phtString = now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Manila',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        const ms = String(now.getMilliseconds()).padStart(3, '0');
        timeEl.textContent = `UTC+8 ${phtString}.${ms}`;
      }
    }
    requestAnimationFrame(updateTelemetry);
  }

  requestAnimationFrame(updateTelemetry);
}

// ==========================================================================
// 14. INTERACTIVE LIVE SVG ARCHITECTURE VISUALIZER
// ==========================================================================

const ARCH_SPECS = {
  all: {
    name: 'Unified Orchestration Bus (All 4 Pillars)',
    protocol: 'REST / WebSockets / Cloudflare D1',
    latency: '< 50ms Edge / < 1.8s LLM',
    sovereignty: '100% Client Private Cloud',
    uptime: '99.99% Production'
  },
  p1: {
    name: 'Pillar 01: Custom Software Systems',
    protocol: 'PostgreSQL / Cloudflare D1 Edge / RBAC',
    latency: '< 45ms Query Latency',
    sovereignty: '100% Dedicated Client Infrastructure',
    uptime: '99.99% SLA'
  },
  p2: {
    name: 'Pillar 02: Business Process Automation',
    protocol: 'Event Webhooks / WhatsApp Cloud API / CalLock',
    latency: '< 120ms Ingestion Dispatch',
    sovereignty: 'Zero Shared Memory / Direct Keys',
    uptime: '99.99% Guaranteed Delivery'
  },
  p3: {
    name: 'Pillar 03: Applied Artificial Intelligence',
    protocol: 'Groq LPU Acceleration (Llama 3.3 / Gemini 2.5)',
    latency: '< 1.8s Sub-2s Triage',
    sovereignty: 'Zero-Retention Calibrated Guardrails',
    uptime: 'Deterministic Routing'
  },
  p4: {
    name: 'Pillar 04: Integrated Hardware & RFID',
    protocol: 'WebSockets / Frequency Scanners / Biometrics',
    latency: '< 80ms Instant Punch Sync',
    sovereignty: 'On-Premise Hardware + Cloud Mirror',
    uptime: 'Zero Buddy-Punching Audit'
  }
};

let archSimulationActive = false;

function initArchitectureVisualizer() {
  const anime = getAnime();
  if (!anime || prefersReducedMotion) return;

  // Continuous traveling packet animation along paths
  const packets = [
    { el: '#archPacket1', start: { x: 220, y: 110 }, end: { x: 480, y: 210 }, dur: 2200 },
    { el: '#archPacket2', start: { x: 740, y: 110 }, end: { x: 480, y: 210 }, dur: 2400 },
    { el: '#archPacket3', start: { x: 220, y: 310 }, end: { x: 480, y: 210 }, dur: 2000 },
    { el: '#archPacket4', start: { x: 740, y: 310 }, end: { x: 480, y: 210 }, dur: 2600 }
  ];

  packets.forEach((p, idx) => {
    const orb = document.querySelector(p.el);
    if (orb) {
      anime.animate(orb, {
        cx: [p.start.x, p.end.x],
        cy: [p.start.y, p.end.y],
        opacity: [0.2, 1, 0.2],
        duration: p.dur,
        delay: idx * 300,
        loop: true,
        ease: 'inOutSine'
      });
    }
  });
}

function selectArchNode(nodeKey) {
  const anime = getAnime();
  STATE.currentArchNode = nodeKey;

  // 1. Update Selector Buttons
  document.querySelectorAll('.arch-node-selector-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.node === nodeKey);
  });

  // 2. Update SVG Node Highlights
  const nodes = ['p1', 'p2', 'p3', 'p4'];
  nodes.forEach((k) => {
    const elId = `archNode${k.toUpperCase()}`;
    const nodeEl = document.getElementById(elId);
    if (nodeEl) {
      if (nodeKey === 'all' || nodeKey === k) {
        nodeEl.classList.add('active');
        if (anime && !prefersReducedMotion && nodeKey === k) {
          anime.animate(nodeEl, {
            scale: [1, 1.05, 1],
            duration: 300,
            ease: 'outBack(1.4)'
          });
        }
      } else {
        nodeEl.classList.remove('active');
      }
    }
  });

  // 3. Update Connecting Path Highlights
  const pathMap = { p1: '#archPath1', p2: '#archPath2', p3: '#archPath3', p4: '#archPath4' };
  Object.keys(pathMap).forEach((k) => {
    const pathEl = document.querySelector(pathMap[k]);
    if (pathEl) {
      if (nodeKey === 'all' || nodeKey === k) {
        pathEl.classList.add('active');
      } else {
        pathEl.classList.remove('active');
      }
    }
  });

  // 4. Update Telemetry Inspector Strip
  const specs = ARCH_SPECS[nodeKey] || ARCH_SPECS.all;
  const nameEl = document.getElementById('archTelName');
  const protoEl = document.getElementById('archTelProtocol');
  const latEl = document.getElementById('archTelLatency');
  const sovEl = document.getElementById('archTelSovereignty');
  const upEl = document.getElementById('archTelUptime');

  if (nameEl) nameEl.textContent = specs.name;
  if (protoEl) protoEl.textContent = specs.protocol;
  if (latEl) latEl.textContent = specs.latency;
  if (sovEl) sovEl.textContent = specs.sovereignty;
  if (upEl) upEl.textContent = specs.uptime;

  const strip = document.getElementById('archTelemetryStrip');
  if (strip && anime && !prefersReducedMotion) {
    anime.animate(strip, {
      opacity: [0.6, 1],
      duration: 250,
      ease: 'outQuad'
    });
  }

  // 5. If specific node selected, synchronize and highlight the matching Pillar card
  if (nodeKey !== 'all') {
    filterPillars(nodeKey);
    const card = document.getElementById(`pillarCard${nodeKey.toUpperCase()}`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (anime && !prefersReducedMotion) {
        anime.animate(card, {
          scale: [0.98, 1.01, 1],
          duration: 350,
          ease: 'outBack(1.3)'
        });
      }
    }
  } else {
    filterPillars('all');
  }
}

function runArchitectureSimulation() {
  const anime = getAnime();
  const simBtn = document.getElementById('archSimulateBtn');
  if (archSimulationActive) return;
  archSimulationActive = true;

  if (simBtn) {
    simBtn.disabled = true;
    simBtn.innerHTML = `<span>Simulating Workflow...</span>`;
  }

  if (!anime || prefersReducedMotion) {
    setTimeout(() => {
      archSimulationActive = false;
      if (simBtn) {
        simBtn.disabled = false;
        simBtn.innerHTML = `<span>▷ Simulate Ingest</span>`;
      }
    }, 2000);
    return;
  }

  const tl = anime.createTimeline ? anime.createTimeline({
    onComplete: () => {
      archSimulationActive = false;
      selectArchNode('all');
      if (simBtn) {
        simBtn.disabled = false;
        simBtn.innerHTML = `<span>▷ Simulate Ingest</span>`;
      }
    }
  }) : null;

  if (tl) {
    tl.add('#archNodeP2', { scale: [1, 1.08, 1], duration: 400, ease: 'outBack(1.5)' })
      .add('#archCenterHub', { scale: [1, 1.06, 1], duration: 350, ease: 'outQuad' }, '-=150')
      .add('#archNodeP3', { scale: [1, 1.08, 1], duration: 400, ease: 'outBack(1.5)' }, '-=100')
      .add('#archNodeP1', { scale: [1, 1.08, 1], duration: 400, ease: 'outBack(1.5)' }, '-=100')
      .add('#archNodeP4', { scale: [1, 1.08, 1], duration: 400, ease: 'outBack(1.5)' }, '-=100')
      .add('#archCenterHub', { scale: [1, 1.03, 1], duration: 300, ease: 'outQuad' }, '-=150');
  } else {
    // Fallback animation
    ['p2', 'p3', 'p1', 'p4'].forEach((k, i) => {
      setTimeout(() => {
        selectArchNode(k);
      }, i * 600);
    });
    setTimeout(() => {
      archSimulationActive = false;
      selectArchNode('all');
      if (simBtn) {
        simBtn.disabled = false;
        simBtn.innerHTML = `<span>▷ Simulate Ingest</span>`;
      }
    }, 2800);
  }
}

// ==========================================================================
// 15. INTERACTIVE 8-STAGE LIFECYCLE PROGRESSION ENGINE
// ==========================================================================

const LIFECYCLE_STAGES = [
  {
    num: 1,
    code: '01',
    title: 'Stage 01: Operational Discovery',
    phase: '[ PHASE 1: DISCOVERY & ARCHITECTURE ]',
    duration: 'Days 1–3',
    artifact: 'Friction Audit Document',
    status: 'Stakeholder Sign-Off',
    desc: 'Conducting in-depth stakeholder interviews to map existing workflows, software fragmentation, communication touchpoints, and operational pain points across all departmental operations.'
  },
  {
    num: 2,
    code: '02',
    title: 'Stage 02: Process & Data Mapping',
    phase: '[ PHASE 1: DISCOVERY & ARCHITECTURE ]',
    duration: 'Days 3–6',
    artifact: 'Data Flow & Webhook Matrix',
    status: 'Event Schema Spec Approved',
    desc: 'Documenting the exact path of customer inquiries, internal approvals, database records, and inter-department communications across WhatsApp, Messenger, Viber, and Web.'
  },
  {
    num: 3,
    code: '03',
    title: 'Stage 03: Bottleneck Identification',
    phase: '[ PHASE 1: DISCOVERY & ARCHITECTURE ]',
    duration: 'Days 6–8',
    artifact: 'Waste Reduction Breakdown',
    status: 'Quantified ROI Model',
    desc: 'Pinpointing exact operational friction points where labor hours, response velocity, or data integrity are lost to manual copy-paste tasks and spreadsheet silos.'
  },
  {
    num: 4,
    code: '04',
    title: 'Stage 04: Requirements Definition',
    phase: '[ PHASE 1: DISCOVERY & ARCHITECTURE ]',
    duration: 'Days 8–10',
    artifact: 'Technical Scope & KPI Spec',
    status: 'Deterministic Scope Lock',
    desc: 'Defining strict functional scope, data security controls, API integration contracts, and quantifiable success metrics prior to engineering.'
  },
  {
    num: 5,
    code: '05',
    title: 'Stage 05: Solution Architecture',
    phase: '[ PHASE 1: DISCOVERY & ARCHITECTURE ]',
    duration: 'Days 10–14',
    artifact: 'System Blueprint & Schema',
    status: 'Database Schema & Auth Spec',
    desc: 'Designing custom software architecture, database schema, webhook routing matrices, and physical hardware links on dedicated cloud infrastructure.'
  },
  {
    num: 6,
    code: '06',
    title: 'Stage 06: Interactive Prototype',
    phase: '[ PHASE 1: DISCOVERY & ARCHITECTURE ]',
    duration: 'Days 14–17',
    artifact: 'Working Interactive Prototype',
    status: 'Hands-On Client Verification',
    desc: 'Building a working interactive prototype around your actual workflow before full deployment, allowing hands-on stakeholder verification with zero risk.'
  },
  {
    num: 7,
    code: '07',
    title: 'Stage 07: Turnkey Implementation',
    phase: '[ PHASE 1: DISCOVERY & ARCHITECTURE ]',
    duration: 'Days 17–21',
    artifact: 'Live Cloud Deploy & Onboarding',
    status: 'Production Release & Team Training',
    desc: 'Production engineering, database migration, webhook stress testing, security hardening, and live team onboarding with 100% client data ownership.'
  },
  {
    num: 8,
    code: '08',
    title: 'Stage 08: Ongoing SLA & Support',
    phase: '[ PHASE 2: MANAGED OPERATIONS ]',
    duration: 'Continuous Partnership',
    artifact: '99.99% Uptime & SLA Retainer',
    status: 'Dedicated Technical Hotline',
    desc: 'Continuous uptime monitoring, security patching, SLA-backed technical assistance, and proactive feature evolution as operations scale.'
  }
];

let currentLifecycleStage = 1;
let lifecycleAutoRunTimer = null;
let isLifecycleAutoRunning = true;
let isLifecycleHovered = false;

function initLifecycleEngine() {
  const chassis = document.getElementById('lifecycleInspectorChassis');
  if (chassis) {
    chassis.addEventListener('mouseenter', () => {
      isLifecycleHovered = true;
    });
    chassis.addEventListener('mouseleave', () => {
      isLifecycleHovered = false;
    });
  }

  // Auto-run cycle
  startLifecycleTimer();
}

function startLifecycleTimer() {
  if (lifecycleAutoRunTimer) clearInterval(lifecycleAutoRunTimer);
  lifecycleAutoRunTimer = setInterval(() => {
    if (isLifecycleAutoRunning && !isLifecycleHovered) {
      const nextStage = (currentLifecycleStage % 8) + 1;
      selectLifecycleStage(nextStage, true);
    }
  }, 4500);
}

function selectLifecycleStage(stageNum, auto = false) {
  const anime = getAnime();
  currentLifecycleStage = stageNum;
  const stageData = LIFECYCLE_STAGES[stageNum - 1] || LIFECYCLE_STAGES[0];

  // 1. Update Chips
  document.querySelectorAll('.lifecycle-step-chip').forEach((chip) => {
    const chipStage = Number(chip.dataset.stage);
    if (chipStage === stageNum) {
      chip.classList.add('active');
      if (anime && !prefersReducedMotion && !auto) {
        anime.animate(chip, {
          scale: [0.97, 1.04, 1],
          duration: 250,
          ease: 'outBack(1.4)'
        });
      }
    } else {
      chip.classList.remove('active');
    }
  });

  // 2. Update Progress Gauge Bar
  const fillBar = document.getElementById('lifecycleProgressFill');
  if (fillBar) {
    const pct = (stageNum / 8) * 100;
    fillBar.style.width = `${pct}%`;
  }

  // 3. Update Inspector HUD
  const tagEl = document.getElementById('inspectorPhaseTag');
  const titleEl = document.getElementById('inspectorStageTitle');
  const descEl = document.getElementById('inspectorStageDesc');
  const artEl = document.getElementById('inspectorArtifactName');
  const durEl = document.getElementById('inspectorMetaDuration');
  const statusEl = document.getElementById('inspectorMetaStatus');
  const pctEl = document.getElementById('inspectorMetaPercent');

  if (tagEl) tagEl.textContent = stageData.phase;
  if (titleEl) titleEl.textContent = stageData.title;
  if (descEl) descEl.textContent = stageData.desc;
  if (artEl) artEl.textContent = `Deliverable: ${stageData.artifact}`;
  if (durEl) durEl.textContent = stageData.duration;
  if (statusEl) statusEl.textContent = stageData.status;
  if (pctEl) pctEl.textContent = `Stage ${stageNum} of 8 (${((stageNum / 8) * 100).toFixed(1)}%)`;

  const chassis = document.getElementById('lifecycleInspectorChassis');
  if (chassis && anime && !prefersReducedMotion && !auto) {
    anime.animate(chassis, {
      opacity: [0.75, 1],
      translateY: [4, 0],
      duration: 280,
      ease: 'outQuad'
    });
  }

  // 4. Update 8-Card Grid Highlights
  for (let i = 1; i <= 8; i++) {
    const card = document.getElementById(`stageCard${i}`);
    if (card) {
      if (i === stageNum) {
        card.classList.add('is-active');
      } else {
        card.classList.remove('is-active');
      }
    }
  }
}

function nextLifecycleStage() {
  const nextStage = (currentLifecycleStage % 8) + 1;
  selectLifecycleStage(nextStage, false);
}

function prevLifecycleStage() {
  const prevStage = currentLifecycleStage === 1 ? 8 : currentLifecycleStage - 1;
  selectLifecycleStage(prevStage, false);
}

function toggleLifecycleAutoRun() {
  isLifecycleAutoRunning = !isLifecycleAutoRunning;
  const btn = document.getElementById('lifecycleAutoRunBtn');
  if (btn) {
    btn.textContent = isLifecycleAutoRunning ? 'Auto-Cycle: ON' : 'Auto-Cycle: PAUSED';
    btn.classList.toggle('active', isLifecycleAutoRunning);
  }
}

// ==========================================================================
// 16. MAGNETIC BUTTON PHYSICS
// ==========================================================================

function initMagneticButtons() {
  const anime = getAnime();
  if (prefersReducedMotion || !anime) return;

  const magneticBtns = document.querySelectorAll('.btn-magnetic');
  magneticBtns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      anime.animate(btn, {
        translateX: x * 0.2,
        translateY: y * 0.2,
        duration: 150,
        ease: 'outQuad'
      });
    });

    btn.addEventListener('mouseleave', () => {
      anime.animate(btn, {
        translateX: 0,
        translateY: 0,
        duration: 350,
        ease: 'outBack(1.4)'
      });
    });
  });
}

// ==========================================================================
// 17. KINETIC CARD TILT & ELEVATION
// ==========================================================================

function initKineticTiltCards() {
  const anime = getAnime();
  if (prefersReducedMotion || !anime) return;

  const cards = document.querySelectorAll('.kinetic-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const xPct = (e.clientX - rect.left) / rect.width - 0.5;
      const yPct = (e.clientY - rect.top) / rect.height - 0.5;

      anime.animate(card, {
        rotateX: -yPct * 3.5,
        rotateY: xPct * 3.5,
        duration: 200,
        ease: 'outQuad'
      });
    });

    card.addEventListener('mouseleave', () => {
      anime.animate(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 400,
        ease: 'outBack(1.2)'
      });
    });
  });
}

// ==========================================================================
// 18. STAT COUNTER TICKERS
// ==========================================================================

function initCounterTickers() {
  const anime = getAnime();
  const tickerEls = document.querySelectorAll('.counter-ticker');
  if (tickerEls.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const targetVal = parseFloat(entry.target.dataset.counterTarget || '0');
        const prefix = entry.target.dataset.counterPrefix || '';
        const suffix = entry.target.dataset.counterSuffix || '';
        const decimals = parseInt(entry.target.dataset.counterDecimals || '0', 10);

        if (!anime || prefersReducedMotion) {
          entry.target.textContent = `${prefix}${targetVal.toFixed(decimals)}${suffix}`;
          return;
        }

        const counterObj = { val: 0 };
        anime.animate(counterObj, {
          val: targetVal,
          duration: 900,
          ease: 'outCubic',
          onUpdate: () => {
            entry.target.textContent = `${prefix}${counterObj.val.toFixed(decimals)}${suffix}`;
          }
        });
      }
    });
  }, { threshold: 0.2 });

  tickerEls.forEach((el) => observer.observe(el));
}

// Global scope bindings for inline HTML handlers
window.switchScenario = switchScenario;
window.switchPipelineStep = switchPipelineStep;
window.toggleScopeModule = toggleScopeModule;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.toggleFaq = toggleFaq;
window.initLeadCaptureForm = initLeadCaptureForm;
window.initScrollSpy = initScrollSpy;
window.initPillarControls = initPillarControls;
window.filterPillars = filterPillars;
window.filterPillarsBySearch = filterPillarsBySearch;
window.copyToClipboard = copyToClipboard;
window.selectArchNode = selectArchNode;
window.runArchitectureSimulation = runArchitectureSimulation;
window.selectLifecycleStage = selectLifecycleStage;
window.nextLifecycleStage = nextLifecycleStage;
window.prevLifecycleStage = prevLifecycleStage;
window.toggleLifecycleAutoRun = toggleLifecycleAutoRun;



