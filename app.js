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
  activeSimulatorTimers: [],
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
    title: 'Private Database & CRM Pipeline',
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
    syncInfo: 'Scope Logged to Private CRM + Lead Score: 96/100 + Team Alerted',
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
  initTransformationSwitch();
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

  // Floating geometric crosshair particles (subtle technical watermarks)
  const crosshairs = [];
  const count = 12;
  for (let i = 0; i < count; i++) {
    crosshairs.push({
      x: Math.random() * width,
      y: Math.random() * height * 3,
      size: 4 + Math.random() * 4,
      speed: 0.12 + Math.random() * 0.25,
      opacity: 0.06 + Math.random() * 0.08
    });
  }

  let isRunning = true;
  let rafId = null;

  function render(time) {
    if (!isRunning) return;
    scrollY += (targetScrollY - scrollY) * 0.1;
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Orthogonal Technical Grid (subtle architectural watermark)
    ctx.strokeStyle = 'rgba(9, 9, 11, 0.035)';
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
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(c.x - c.size, actualY);
      ctx.lineTo(c.x + c.size, actualY);
      ctx.moveTo(c.x, actualY - c.size);
      ctx.lineTo(c.x, actualY + c.size);
      ctx.stroke();
    });

    if (!prefersReducedMotion && isRunning) {
      rafId = requestAnimationFrame(render);
    }
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      isRunning = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    } else {
      if (!isRunning) {
        isRunning = true;
        scrollY = targetScrollY = window.scrollY;
        rafId = requestAnimationFrame(render);
      }
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange);
  rafId = requestAnimationFrame(render);
}

// ==========================================================================
// 4. KINETIC HERO ENTRANCE (Anime.js v4 Word Stagger)
// ==========================================================================

function initHeroKineticEntrance() {
  const anime = getAnime();
  if (prefersReducedMotion || !anime) return;

  const kickerBadge = document.querySelector('.hero-kicker-badge');
  if (kickerBadge) {
    anime.animate(kickerBadge, {
      opacity: [0, 1],
      translateY: [14, 0],
      delay: 100,
      duration: 500,
      ease: 'outCubic'
    });
  }

  const heroTitleText = document.querySelector('.hero-title-text') || document.querySelector('.hero-title');
  if (heroTitleText) {
    anime.animate(heroTitleText, {
      opacity: [0, 1],
      translateY: [20, 0],
      delay: 200,
      duration: 650,
      ease: 'outBack(1.1)'
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

function clearSimulatorTimers() {
  if (STATE.chatTimelineTimer) {
    clearTimeout(STATE.chatTimelineTimer);
    STATE.chatTimelineTimer = null;
  }
  if (STATE.scenarioCycleTimer) {
    clearTimeout(STATE.scenarioCycleTimer);
    STATE.scenarioCycleTimer = null;
  }
  if (Array.isArray(STATE.activeSimulatorTimers)) {
    STATE.activeSimulatorTimers.forEach(id => clearTimeout(id));
    STATE.activeSimulatorTimers = [];
  }
  const container = document.getElementById('simMessagesContainer');
  if (container) {
    container.querySelectorAll('.chat-typing-bubble').forEach(el => el.remove());
  }
}

function queueSimulatorTimer(fn, delay) {
  if (!Array.isArray(STATE.activeSimulatorTimers)) {
    STATE.activeSimulatorTimers = [];
  }
  const timerId = setTimeout(() => {
    STATE.activeSimulatorTimers = STATE.activeSimulatorTimers.filter(id => id !== timerId);
    fn();
  }, delay);
  STATE.activeSimulatorTimers.push(timerId);
  return timerId;
}

function switchScenario(scenarioKey, userInitiated = true) {
  const anime = getAnime();
  clearSimulatorTimers();
  STATE.currentScenario = scenarioKey;
  STATE.isSimulatorThreadComplete = false;

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
  clearSimulatorTimers();

  const data = CHAT_SCENARIOS[scenarioKey] || CHAT_SCENARIOS.consulting;

  const botNameEl = document.getElementById('simBotName');
  if (botNameEl) botNameEl.textContent = data.botName;

  const channelBadgeEl = document.getElementById('simChannelBadge');
  if (channelBadgeEl) channelBadgeEl.textContent = data.badge;

  const syncTextEl = document.getElementById('simSyncText');
  if (syncTextEl) syncTextEl.textContent = data.syncInfo;

  const container = document.getElementById('simMessagesContainer');
  if (!container) return;

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
        STATE.scenarioCycleTimer = queueSimulatorTimer(() => {
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

      STATE.chatTimelineTimer = queueSimulatorTimer(() => {
        if (typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
        insertBubble(msg);
        currentIdx++;
        STATE.chatTimelineTimer = queueSimulatorTimer(postNextMessage, prefersReducedMotion ? 100 : 1100);
      }, prefersReducedMotion ? 100 : 700);
    } else {
      insertBubble(msg);
      currentIdx++;
      STATE.chatTimelineTimer = queueSimulatorTimer(postNextMessage, prefersReducedMotion ? 100 : 650);
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

  STATE.chatTimelineTimer = queueSimulatorTimer(postNextMessage, 300);
}

// ==========================================================================
// 6. SIGNATURE INTERACTIVE TRANSFORMATION SWITCH
// ==========================================================================

function switchTransformation(mode) {
  const btnManual = document.getElementById('btnStateManual');
  const btnFlowState = document.getElementById('btnStateFlowState');
  const viewManual = document.getElementById('viewManualChaos');
  const viewFlowState = document.getElementById('viewFlowStatePrecision');

  if (!btnManual || !btnFlowState || !viewManual || !viewFlowState) return;

  const anime = getAnime();

  if (mode === 'manual') {
    btnManual.classList.add('active');
    btnManual.setAttribute('aria-selected', 'true');
    btnFlowState.classList.remove('active');
    btnFlowState.setAttribute('aria-selected', 'false');

    viewFlowState.style.display = 'none';
    viewManual.style.display = 'block';

    if (anime && !prefersReducedMotion) {
      anime.animate(viewManual, {
        opacity: [0, 1],
        translateY: [8, 0],
        duration: 240,
        ease: 'outQuad'
      });
    }
  } else {
    btnFlowState.classList.add('active');
    btnFlowState.setAttribute('aria-selected', 'true');
    btnManual.classList.remove('active');
    btnManual.setAttribute('aria-selected', 'false');

    viewManual.style.display = 'none';
    viewFlowState.style.display = 'block';

    if (anime && !prefersReducedMotion) {
      anime.animate(viewFlowState, {
        opacity: [0, 1],
        translateY: [8, 0],
        duration: 240,
        ease: 'outQuad'
      });
    }
  }
}

function initTransformationSwitch() {
  switchTransformation('manual');
}

// Backwards-compatible no-op
function switchPipelineStep(_stepNum) {
  /* Deprecated: superseded by switchTransformation */
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
  }, { passive: true });

  const mobileBtn = document.getElementById('mobileMenuBtn');
  mobileBtn?.addEventListener('click', toggleMobileMenu);

  // Keyboard accessibility: Escape key dismisses mobile drawer and dropdowns
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeMobileMenu();
      const dropdownBtn = document.querySelector('.nav-dropdown-trigger');
      if (dropdownBtn) {
        dropdownBtn.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Accessible aria-expanded synchronization on solutions dropdown
  const dropdownItem = document.querySelector('.nav-item-dropdown');
  const dropdownBtn = document.querySelector('.nav-dropdown-trigger');
  if (dropdownItem && dropdownBtn) {
    dropdownItem.addEventListener('mouseenter', () => {
      dropdownBtn.setAttribute('aria-expanded', 'true');
    });
    dropdownItem.addEventListener('mouseleave', () => {
      dropdownBtn.setAttribute('aria-expanded', 'false');
    });
    dropdownBtn.addEventListener('focus', () => {
      dropdownBtn.setAttribute('aria-expanded', 'true');
    });
  }
}

function toggleMobileMenu() {
  const drawer = document.getElementById('mobileDrawer');
  const btn = document.getElementById('mobileMenuBtn');
  if (!drawer) return;
  const isOpen = drawer.classList.toggle('open');
  btn?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

function closeMobileMenu() {
  const drawer = document.getElementById('mobileDrawer');
  const btn = document.getElementById('mobileMenuBtn');
  if (!drawer) return;
  drawer.classList.remove('open');
  btn?.setAttribute('aria-expanded', 'false');
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

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function handleLeadFormSubmit(e) {
  if (e) e.preventDefault();
  const form = document.getElementById('leadCaptureForm');
  const submitBtn = document.getElementById('leadCaptureSubmitBtn');
  const feedbackEl = document.getElementById('leadCaptureFeedback');
  if (!form || !submitBtn) return;

  const name = document.getElementById('contactName')?.value.trim() || '';
  const email = document.getElementById('contactEmail')?.value.trim() || '';
  const phone = document.getElementById('contactPhone')?.value.trim() || '';
  const emailPhone = document.getElementById('contactEmailPhone')?.value.trim() || '';
  const contact = emailPhone || (email && phone ? `${email} / ${phone}` : (email || phone));
  const company = document.getElementById('contactCompany')?.value.trim() || '';
  const scale = document.getElementById('contactBusinessScale')?.value || (company ? `Company: ${company}` : 'Not specified');
  const notes = document.getElementById('contactNotes')?.value.trim() || document.getElementById('contactDetails')?.value.trim() || '';
  const pillar = form.querySelector('input[name="service_pillar"]')?.value || 'General Inquiry';

  if (!name || !contact) {
    showFeedback('Please provide your name and work email or WhatsApp number.', 'error');
    return;
  }

  submitBtn.disabled = true;
  const originalBtnHtml = submitBtn.innerHTML;
  submitBtn.innerHTML = `<span>Transmitting Architecture Request...</span>`;

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        contact,
        businessScale: scale,
        notes: pillar !== 'General Inquiry' ? `[${pillar}] ${notes}` : notes,
        pageUrl: window.location.href
      })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      form.reset();
      showFeedback(data.message || 'Blueprint request received! A solutions architect will review and respond within 24 hours.', 'success');
    } else {
      const errText = escapeHtml(data.error || 'Server rejected transmission. Please verify your contact details.');
      const fallbackHtml = `
        <div><strong>[ DISPATCH NOTICE ]</strong> ${errText}</div>
        <div class="form-feedback-fallback">
          <button type="button" class="btn-fallback" onclick="document.getElementById('leadCaptureSubmitBtn').click()">&#x21bb; Retry Submission</button>
          <a href="mailto:flowstateautom8t@gmail.com?subject=Architecture Blueprint Request - ${encodeURIComponent(name)}" class="btn-fallback">&#x2709; Direct Email Dispatch</a>
          <a href="tel:+639059557661" class="btn-fallback">&#x260e; Call 0905 955 7661</a>
        </div>
      `;
      showFeedback(fallbackHtml, 'error');
    }
  } catch (err) {
    console.error('Lead blueprint submit error:', err);
    const fallbackHtml = `
      <div><strong>[ CONNECTION DELAY / NETWORK TIMEOUT ]</strong> Unable to connect to the dispatch gateway. Your form inputs have been preserved.</div>
      <div class="form-feedback-fallback">
        <button type="button" class="btn-fallback" onclick="document.getElementById('leadCaptureSubmitBtn').click()">&#x21bb; Retry Transmission</button>
        <a href="mailto:flowstateautom8t@gmail.com?subject=Architecture Blueprint Request - ${encodeURIComponent(name)}&body=Name: ${encodeURIComponent(name)}%0D%0AContact: ${encodeURIComponent(contact)}%0D%0ANotes: ${encodeURIComponent(notes)}" class="btn-fallback">&#x2709; Send via Direct Email</a>
        <a href="tel:+639059557661" class="btn-fallback">&#x260e; Call Hotline: 0905 955 7661</a>
      </div>
    `;
    showFeedback(fallbackHtml, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnHtml;
  }

  function showFeedback(content, type) {
    if (!feedbackEl) return;
    feedbackEl.className = `form-feedback ${type}`;
    if (typeof content === 'string' && content.includes('<')) {
      feedbackEl.innerHTML = content;
    } else {
      feedbackEl.textContent = content;
    }
    feedbackEl.style.display = 'block';

    if (type === 'success') {
      setTimeout(() => {
        feedbackEl.style.display = 'none';
      }, 8000);
    }
  }
}

function initLeadCaptureForm() {
  const form = document.getElementById('leadCaptureForm');
  if (!form) return;
  form.addEventListener('submit', handleLeadFormSubmit);
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

  const cleanLabel = escapeHtml(label);
  toast.innerHTML = `<svg class="matrix-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" style="color: var(--brand-accent); flex-shrink: 0;"><polyline points="20 6 9 17 4 12"/></svg> <span>COPIED TO CLIPBOARD:</span> <span style="color: #FFFFFF; font-weight: 800;">${cleanLabel}</span>`;
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
    name: 'All Systems Connected & Synchronized',
    protocol: 'Encrypted Cloud & Real-Time Sync',
    latency: 'Under 1.8 Seconds',
    sovereignty: '100% Owned by Your Business',
    uptime: '99.99% Guaranteed Uptime'
  },
  p1: {
    name: 'Custom Software & Portals (Pillar 01)',
    protocol: 'Private Database & Role-Based Permissions',
    latency: 'Instant Page Load (< 45ms)',
    sovereignty: '100% Private Client Server',
    uptime: '99.99% High Availability'
  },
  p2: {
    name: 'Inquiry Automation & Workflows (Pillar 02)',
    protocol: 'WhatsApp, Facebook & Calendar Sync',
    latency: 'Instant Lead Hand-Off',
    sovereignty: 'Direct Business Account Keys',
    uptime: 'Zero Dropped Messages'
  },
  p3: {
    name: 'Smart AI Assistant & Triage (Pillar 03)',
    protocol: 'Taglish & English Language Models',
    latency: 'Under 1.8s Fast Reply',
    sovereignty: 'Private & Secure (No Data Leaks)',
    uptime: '24/7 Always Online'
  },
  p4: {
    name: 'Workplace Hardware & RFID (Pillar 04)',
    protocol: 'Physical RFID & Biometric Scanners',
    latency: 'Instant Punch Sync',
    sovereignty: 'Secure On-Site Hardware + Cloud',
    uptime: 'Accurate Timekeeping & 1-Click Payroll'
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

  // 2. Update SVG Node Highlights (Animate inner rect stroke instead of SVG <g> scale to prevent coordinate drift)
  const nodes = ['p1', 'p2', 'p3', 'p4'];
  nodes.forEach((k) => {
    const elId = `archNode${k.toUpperCase()}`;
    const nodeEl = document.getElementById(elId);
    if (nodeEl) {
      if (nodeKey === 'all' || nodeKey === k) {
        nodeEl.classList.add('active');
        const rectEl = nodeEl.querySelector('.arch-node-rect');
        if (anime && !prefersReducedMotion && nodeKey === k && rectEl) {
          anime.animate(rectEl, {
            stroke: ['#E11D48', '#09090B', '#E11D48'],
            strokeWidth: ['2.5px', '1.6px', '2px'],
            duration: 320,
            ease: 'outQuad'
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
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      if (anime && !prefersReducedMotion) {
        anime.animate(card, {
          scale: [0.99, 1.01, 1],
          duration: 300,
          ease: 'outQuad'
        });
      }
    }
  } else {
    filterPillars('all');
  }
}

function runArchitectureSimulation() {
  const simBtn = document.getElementById('archSimulateBtn');
  if (archSimulationActive) return;
  archSimulationActive = true;

  if (simBtn) {
    simBtn.disabled = true;
    simBtn.innerHTML = `<span>Testing Live Flow...</span>`;
  }

  const sequence = ['p2', 'p3', 'p1', 'p4'];
  sequence.forEach((k, i) => {
    setTimeout(() => {
      selectArchNode(k);
    }, i * 700);
  });

  setTimeout(() => {
    selectArchNode('all');
    archSimulationActive = false;
    if (simBtn) {
      simBtn.disabled = false;
      simBtn.innerHTML = `<span>▷ Test Live Data Flow</span>`;
    }
  }, sequence.length * 700 + 500);
}

// ==========================================================================
// 15. INTERACTIVE 8-STAGE LIFECYCLE PROGRESSION ENGINE
// ==========================================================================

const LIFECYCLE_STAGES = [
  {
    num: 1,
    code: '01',
    title: 'Stage 01: Discovery & Pain Point Audit',
    phase: '[ PHASE 1: DISCOVERY & ARCHITECTURE ]',
    duration: 'Days 1–3',
    artifact: 'Workflow Friction Audit',
    status: 'Client Alignment Sign-Off',
    desc: 'We talk directly with your team to understand your daily operations, find what takes the most time, and identify where leads or tasks slip through the cracks.'
  },
  {
    num: 2,
    code: '02',
    title: 'Stage 02: Workflow & Communication Mapping',
    phase: '[ PHASE 1: DISCOVERY & ARCHITECTURE ]',
    duration: 'Days 3–6',
    artifact: 'Step-by-Step Process Map',
    status: 'Approved Process Schema',
    desc: 'We map how customer inquiries, manager approvals, client data, and staff tasks move across WhatsApp, Facebook, email, spreadsheets, and departments.'
  },
  {
    num: 3,
    code: '03',
    title: 'Stage 03: Bottleneck & Waste Identification',
    phase: '[ PHASE 1: DISCOVERY & ARCHITECTURE ]',
    duration: 'Days 6–8',
    artifact: 'Time & Cost Savings Breakdown',
    status: 'Clear ROI Target',
    desc: 'We pinpoint exact steps where your staff loses hours to manual copy-paste work, double bookings, or forgotten customer follow-ups.'
  },
  {
    num: 4,
    code: '04',
    title: 'Stage 04: System Requirements & Scope',
    phase: '[ PHASE 1: DISCOVERY & ARCHITECTURE ]',
    duration: 'Days 8–10',
    artifact: 'Complete Feature Blueprint',
    status: 'Fixed Scope Agreement',
    desc: 'We write a clear, plain-English specification of every feature, automated rule, security permission, and expected result before writing code.'
  },
  {
    num: 5,
    code: '05',
    title: 'Stage 05: Custom System Architecture',
    phase: '[ PHASE 1: DISCOVERY & ARCHITECTURE ]',
    duration: 'Days 10–14',
    artifact: 'System Blueprint & Database Plan',
    status: 'Security & Database Plan Approved',
    desc: 'We design your private database, automated messaging pathways, and user access levels so your system is fast, secure, and easy to scale.'
  },
  {
    num: 6,
    code: '06',
    title: 'Stage 06: Interactive Clickable Demo',
    phase: '[ PHASE 1: DISCOVERY & ARCHITECTURE ]',
    duration: 'Days 14–17',
    artifact: 'Working Interactive Prototype',
    status: 'Hands-On Client Verification',
    desc: 'We build a working, clickable preview with your real business workflow so you can test and verify how it works before full deployment.'
  },
  {
    num: 7,
    code: '07',
    title: 'Stage 07: Custom Build & Team Launch',
    phase: '[ PHASE 1: DISCOVERY & ARCHITECTURE ]',
    duration: 'Days 17–21',
    artifact: 'Live System & Team Training',
    status: 'Production Release & Hand-Off',
    desc: 'We build and test the full software, connect your messaging channels and hardware, import your data, and train your staff for a smooth launch.'
  },
  {
    num: 8,
    code: '08',
    title: 'Stage 08: Ongoing SLA & Support',
    phase: '[ PHASE 2: MANAGED OPERATIONS ]',
    duration: 'Continuous Partnership',
    artifact: '99.99% Uptime & SLA Retainer',
    status: 'Direct WhatsApp & Phone Hotline',
    desc: 'We manage your cloud hosting, perform regular backups, keep your system fast and secure, and provide a direct hotline whenever you need updates.'
  }
];

let currentLifecycleStage = 1;
let lifecycleAutoRunTimer = null;
let isLifecycleAutoRunning = true;
const LIFECYCLE_INTERVAL_MS = 4500;

function initLifecycleEngine() {
  const chassis = document.getElementById('lifecycleInspectorChassis');
  if (!chassis) return;

  // Initialize first stage view
  selectLifecycleStage(1, true);

  // Start auto-run if enabled
  if (isLifecycleAutoRunning) {
    startLifecycleTimer();
  }
}

function startLifecycleTimer() {
  if (lifecycleAutoRunTimer) {
    clearInterval(lifecycleAutoRunTimer);
    lifecycleAutoRunTimer = null;
  }

  if (!isLifecycleAutoRunning) return;

  lifecycleAutoRunTimer = setInterval(() => {
    if (isLifecycleAutoRunning) {
      const nextStage = (currentLifecycleStage % 8) + 1;
      selectLifecycleStage(nextStage, true);
    }
  }, LIFECYCLE_INTERVAL_MS);
}

function selectLifecycleStage(stageNum, auto = false) {
  const anime = getAnime();
  currentLifecycleStage = stageNum;
  const stageData = LIFECYCLE_STAGES[stageNum - 1] || LIFECYCLE_STAGES[0];

  // 1. Update 8 Step Chips
  document.querySelectorAll('.lifecycle-step-chip').forEach((chip) => {
    const chipStage = Number(chip.dataset.stage);
    if (chipStage === stageNum) {
      chip.classList.add('active');
      if (anime && !prefersReducedMotion && !auto) {
        anime.animate(chip, {
          scale: [0.96, 1.04, 1],
          duration: 240,
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

  // 3. Update Inspector HUD Elements
  const tagEl = document.getElementById('inspectorPhaseTag');
  const titleEl = document.getElementById('inspectorStageTitle');
  const descEl = document.getElementById('inspectorStageDesc');
  const artEl = document.getElementById('inspectorArtifactName');
  const durEl = document.getElementById('inspectorMetaDuration');
  const statusEl = document.getElementById('inspectorMetaStatus');
  const pctEl = document.getElementById('inspectorMetaPercent');
  const counterNumEl = document.getElementById('stageCounterNum');

  if (tagEl) tagEl.textContent = stageData.phase;
  if (titleEl) titleEl.textContent = stageData.title;
  if (descEl) descEl.textContent = stageData.desc;
  if (artEl) artEl.textContent = `Deliverable: ${stageData.artifact}`;
  if (durEl) durEl.textContent = stageData.duration;
  if (statusEl) statusEl.textContent = stageData.status;
  if (pctEl) pctEl.textContent = `Stage ${stageNum} of 8 (${((stageNum / 8) * 100).toFixed(1)}%)`;
  if (counterNumEl) counterNumEl.textContent = `0${stageNum}`;

  // 4. Kinetic Transition on Chassis Content
  if (anime && !prefersReducedMotion) {
    const animTargets = [titleEl, descEl, artEl, durEl, statusEl, pctEl].filter(Boolean);
    if (animTargets.length > 0) {
      anime.animate(animTargets, {
        opacity: [0.5, 1],
        translateY: [4, 0],
        duration: 220,
        ease: 'outQuad',
        delay: anime.stagger(25)
      });
    }
  }

  // 5. If user navigated manually, reset the countdown timer so they get full duration
  if (!auto && isLifecycleAutoRunning) {
    startLifecycleTimer();
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
  const textEl = document.getElementById('lifecycleAutoRunText');
  
  if (btn) {
    btn.classList.toggle('active', isLifecycleAutoRunning);
  }
  if (textEl) {
    textEl.textContent = isLifecycleAutoRunning ? 'Auto-Cycle: ON' : 'Auto-Cycle: PAUSED';
  }

  if (isLifecycleAutoRunning) {
    startLifecycleTimer();
  } else if (lifecycleAutoRunTimer) {
    clearInterval(lifecycleAutoRunTimer);
    lifecycleAutoRunTimer = null;
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
window.switchTransformation = switchTransformation;
window.switchPipelineStep = switchPipelineStep;
window.toggleScopeModule = toggleScopeModule;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.toggleFaq = toggleFaq;
window.initLeadCaptureForm = initLeadCaptureForm;
window.submitLeadCapture = handleLeadFormSubmit;
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



