/**
 * FLOWSTATE AUTOMATIONS — MECHANICAL HUD LIVE CHATBOT CONTROLLER (Sharp White Edition)
 * Supercharged with Anime.js v4 Kinetic Motion.
 * Fully standalone, resilient, accessible, and connected to Cloudflare /api/chat.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'fsa_chat_sharp_msgs_v1';
  const TEASER_DISMISSED_KEY = 'fsa_chat_teaser_dismissed_sharp';

  let chatState = {
    isOpen: false,
    isTyping: false,
    messages: [],
    teaserTimeout: null,
    teaserProgressAnim: null,
    isTeaserHovered: false
  };

  function getAnime() {
    return typeof window !== 'undefined' ? window.anime : null;
  }

  const DEFAULT_MESSAGES = [
    {
      sender: 'bot',
      text: "Welcome to FlowState Automations. I'm your real-time scoping assistant. Ask me about custom CRM builds, omni-channel dispatch, or instant booking integrations.",
      time: getCurrentTime()
    }
  ];

  const STARTER_CHIPS = [
    'Custom Software & CRM Integration',
    'How Much Does a Custom Build Cost?',
    'How Fast Can We Deploy?',
    'Multi-Channel Support (WhatsApp, Web, Messenger)'
  ];

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function initChatbot() {
    loadPersistedMessages();
    renderChatElements();
    setupEventListeners();
    setupTeaserSequence();
  }

  function loadPersistedMessages() {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        chatState.messages = JSON.parse(saved);
      } else {
        chatState.messages = [...DEFAULT_MESSAGES];
      }
    } catch (e) {
      chatState.messages = [...DEFAULT_MESSAGES];
    }
  }

  function persistMessages() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(chatState.messages));
    } catch (e) {}
  }

  function renderChatElements() {
    if (document.getElementById('fsaChatDock')) return;

    const dock = document.createElement('div');
    dock.id = 'fsaChatDock';
    dock.className = 'fsa-chat-dock';
    dock.innerHTML = `
      <!-- Sharp Teaser Bubble -->
      <div id="fsaChatTeaser" class="fsa-chat-teaser" style="display: none; opacity: 0;">
        <div class="fsa-teaser-content">
          <span class="fsa-teaser-tag">[ LIVE DEMO // &lt;2s ]</span>
          <span class="fsa-teaser-text">Test our sub-2-second automated assistant live.</span>
        </div>
        <button class="fsa-teaser-close" id="fsaTeaserClose" aria-label="Dismiss">&times;</button>
        <div class="fsa-teaser-progress" id="fsaTeaserProgress"></div>
      </div>

      <!-- Sharp Mechanical Launcher Button -->
      <button class="fsa-chat-launcher" id="fsaChatLauncher" aria-label="Open live chat assistant">
        <span class="fsa-launcher-status"></span>
        <span id="fsaLauncherText">[ CHAT LIVE • &lt;2s ]</span>
      </button>

      <!-- Sharp Chat Modal Window -->
      <div id="fsaChatWindow" class="fsa-chat-window" style="display: none; opacity: 0;" role="dialog" aria-modal="true" aria-label="Live Assistant">
        <!-- Mechanical Header -->
        <div class="fsa-chat-header">
          <div class="fsa-header-info">
            <div class="fsa-header-avatar">FS</div>
            <div>
              <div class="fsa-header-title">FlowState • Technical Desk</div>
              <div class="fsa-header-sub"><span class="status-dot"></span> Online &lt; 2s</div>
            </div>
          </div>
          <div class="fsa-header-actions">
            <button class="fsa-header-btn" id="fsaChatReset" title="Reset thread">[ RESET ]</button>
            <button class="fsa-header-btn" id="fsaChatClose" title="Close">[ &times; ]</button>
          </div>
        </div>

        <!-- Conversation Scroll Body -->
        <div class="fsa-chat-body" id="fsaChatBody"></div>

        <!-- Suggestion Chips -->
        <div class="fsa-chips-wrapper" id="fsaChipsWrapper">
          ${STARTER_CHIPS.map(chip => `<button class="fsa-chip" data-query="${chip}">${chip}</button>`).join('')}
        </div>

        <!-- Chat Input Bar -->
        <form class="fsa-chat-input-bar" id="fsaChatForm">
          <input type="text" class="fsa-chat-input" id="fsaChatInput" placeholder="Type your automation requirement..." autocomplete="off" />
          <button type="submit" class="fsa-chat-send" id="fsaChatSend">SEND &rarr;</button>
        </form>
      </div>
    `;

    document.body.appendChild(dock);
    renderMessageHistory();
  }

  function renderMessageHistory() {
    const body = document.getElementById('fsaChatBody');
    if (!body) return;
    body.innerHTML = '';

    chatState.messages.forEach(msg => {
      const el = document.createElement('div');
      el.className = `fsa-msg ${msg.sender === 'user' ? 'fsa-msg-user' : 'fsa-msg-bot'}`;
      el.innerHTML = `
        <div>${msg.text}</div>
        <span class="fsa-msg-time">${msg.time}</span>
      `;
      body.appendChild(el);
    });

    body.scrollTop = body.scrollHeight;
  }

  function setupEventListeners() {
    const launcher = document.getElementById('fsaChatLauncher');
    const closeBtn = document.getElementById('fsaChatClose');
    const resetBtn = document.getElementById('fsaChatReset');
    const form = document.getElementById('fsaChatForm');
    const input = document.getElementById('fsaChatInput');
    const teaser = document.getElementById('fsaChatTeaser');
    const teaserClose = document.getElementById('fsaTeaserClose');

    launcher?.addEventListener('click', toggleChat);
    closeBtn?.addEventListener('click', closeChat);
    resetBtn?.addEventListener('click', resetChat);

    teaser?.addEventListener('click', (e) => {
      if (e.target.id !== 'fsaTeaserClose') {
        dismissTeaser();
        openChat();
      }
    });

    teaserClose?.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissTeaser();
    });

    teaser?.addEventListener('mouseenter', () => {
      chatState.isTeaserHovered = true;
      if (chatState.teaserProgressAnim) chatState.teaserProgressAnim.pause();
      if (chatState.teaserTimeout) clearTimeout(chatState.teaserTimeout);
    });

    teaser?.addEventListener('mouseleave', () => {
      chatState.isTeaserHovered = false;
      if (chatState.teaserProgressAnim) chatState.teaserProgressAnim.play();
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text || chatState.isTyping) return;
      input.value = '';
      sendUserMessage(text);
    });

    document.querySelectorAll('.fsa-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        if (query && !chatState.isTyping) {
          sendUserMessage(query);
        }
      });
    });

    // Global CTA Hook
    window.openFlowStateChat = function (optionalQuery) {
      openChat();
      if (optionalQuery) {
        setTimeout(() => sendUserMessage(optionalQuery), 400);
      }
    };
  }

  function setupTeaserSequence() {
    try {
      if (sessionStorage.getItem(TEASER_DISMISSED_KEY)) return;
    } catch (e) {}

    setTimeout(() => {
      if (chatState.isOpen) return;
      const teaser = document.getElementById('fsaChatTeaser');
      const prog = document.getElementById('fsaTeaserProgress');
      const anime = getAnime();
      if (!teaser || !prog) return;

      teaser.style.display = 'flex';
      if (anime) {
        anime.animate(teaser, {
          opacity: [0, 1],
          translateY: [12, 0],
          duration: 350,
          ease: 'outBack(1.2)'
        });

        chatState.teaserProgressAnim = anime.animate(prog, {
          scaleX: [1, 0],
          duration: 5000,
          ease: 'linear',
          onComplete: () => {
            if (!chatState.isTeaserHovered) dismissTeaser();
          }
        });
      } else {
        teaser.style.opacity = '1';
        chatState.teaserTimeout = setTimeout(dismissTeaser, 5000);
      }
    }, 3500);
  }

  function dismissTeaser() {
    const teaser = document.getElementById('fsaChatTeaser');
    if (!teaser) return;
    try {
      sessionStorage.setItem(TEASER_DISMISSED_KEY, 'true');
    } catch (e) {}

    const anime = getAnime();
    if (anime) {
      anime.animate(teaser, {
        opacity: [1, 0],
        translateY: [0, 8],
        duration: 250,
        ease: 'outQuad',
        onComplete: () => {
          teaser.style.display = 'none';
        }
      });
    } else {
      teaser.style.display = 'none';
    }
  }

  function openChat() {
    dismissTeaser();
    const win = document.getElementById('fsaChatWindow');
    const input = document.getElementById('fsaChatInput');
    const anime = getAnime();
    if (!win) return;

    chatState.isOpen = true;
    win.style.display = 'flex';

    if (anime) {
      anime.animate(win, {
        opacity: [0, 1],
        translateY: [24, 0],
        scale: [0.96, 1],
        duration: 320,
        ease: 'outBack(1.15)',
        onComplete: () => input?.focus()
      });
    } else {
      win.style.opacity = '1';
      input?.focus();
    }
  }

  function closeChat() {
    const win = document.getElementById('fsaChatWindow');
    const anime = getAnime();
    if (!win) return;

    chatState.isOpen = false;
    if (anime) {
      anime.animate(win, {
        opacity: [1, 0],
        translateY: [0, 16],
        scale: [1, 0.96],
        duration: 220,
        ease: 'outQuad',
        onComplete: () => {
          win.style.display = 'none';
        }
      });
    } else {
      win.style.display = 'none';
    }
  }

  function toggleChat() {
    if (chatState.isOpen) closeChat();
    else openChat();
  }

  function resetChat() {
    chatState.messages = [...DEFAULT_MESSAGES];
    persistMessages();
    renderMessageHistory();
  }

  async function sendUserMessage(text) {
    chatState.messages.push({
      sender: 'user',
      text: text,
      time: getCurrentTime()
    });
    persistMessages();
    renderMessageHistory();

    showTypingIndicator();

    try {
      let sessionId = 'anon-' + Date.now();
      try {
        sessionId = sessionStorage.getItem('fsa_chat_session_id');
        if (!sessionId) {
          sessionId = 'fsa-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now();
          sessionStorage.setItem('fsa_chat_session_id', sessionId);
        }
      } catch (e) {}

      const messagesPayload = chatState.messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesPayload,
          sessionId: sessionId,
          pageUrl: window.location.href
        })
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const data = await res.json();
      hideTypingIndicator();

      chatState.messages.push({
        sender: 'bot',
        text: data.reply || "I've noted your requirement. A solutions engineer will review and prepare a custom blueprint.",
        time: getCurrentTime()
      });
      persistMessages();
      renderMessageHistory();
    } catch (err) {
      hideTypingIndicator();
      // Graceful local preview fallback
      let fallback = "Understood. Our team deploys multi-channel custom automation workflows within 2 to 3 weeks with 99.9% uptime SLA. Would you like to schedule a free 15-minute scoping consultation?";
      if (text.toLowerCase().includes('cost') || text.toLowerCase().includes('price')) {
        fallback = "Custom business automation workflows and CRM modules typically start from ₱15,000 to ₱35,000 depending on hub complexity and channel integrations. We provide an exact fixed-scope estimate upfront.";
      }
      chatState.messages.push({
        sender: 'bot',
        text: fallback,
        time: getCurrentTime()
      });
      persistMessages();
      renderMessageHistory();
    }
  }

  function showTypingIndicator() {
    chatState.isTyping = true;
    const body = document.getElementById('fsaChatBody');
    if (!body) return;

    const typingEl = document.createElement('div');
    typingEl.id = 'fsaTypingBox';
    typingEl.className = 'fsa-typing-box';
    typingEl.innerHTML = `
      <span class="fsa-typing-sq"></span>
      <span class="fsa-typing-sq"></span>
      <span class="fsa-typing-sq"></span>
    `;
    body.appendChild(typingEl);
    body.scrollTop = body.scrollHeight;

    const anime = getAnime();
    if (anime) {
      anime.animate('.fsa-typing-sq', {
        opacity: [0.2, 1],
        translateY: [-2, 0],
        delay: anime.stagger ? anime.stagger(140) : 140,
        duration: 320,
        loop: true,
        alternate: true,
        ease: 'inOutQuad'
      });
    }
  }

  function hideTypingIndicator() {
    chatState.isTyping = false;
    const typingEl = document.getElementById('fsaTypingBox');
    if (typingEl && typingEl.parentNode) {
      typingEl.parentNode.removeChild(typingEl);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }
})();
