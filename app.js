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
  if (heroTitle) {
    const raw = heroTitle.innerText.trim();
    heroTitle.setAttribute('aria-label', raw);
    const words = raw.split(/\s+/);
    heroTitle.innerHTML = words.map(w => `<span class="split-word">${w} </span>`).join('');
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
      if (anime && !prefersReducedMotion) {
        anime.animate(tab, {
          scale: [0.98, 1.02, 1],
          duration: 220,
          ease: 'outBack(1.4)'
        });
      }
    } else {
      tab.classList.remove('active');
    }
  });

  renderPipelineStep(stepNum);
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
  const anime = getAnime();
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

// Global scope bindings for inline HTML handlers
window.switchScenario = switchScenario;
window.switchPipelineStep = switchPipelineStep;
window.toggleScopeModule = toggleScopeModule;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.toggleFaq = toggleFaq;
