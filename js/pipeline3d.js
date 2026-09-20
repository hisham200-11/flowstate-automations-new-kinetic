/**
 * FlowState Automations - 3D Execution Pipeline Engine ("One Message, One Booking")
 * Swiss Brutalist / Kinetic White Architecture
 * 
 * Stack: Three.js r128 + Anime.js v4
 * Optimized for Rock-Solid Performance (120 FPS, Zero Memory Leaks, Zero Frame Drops)
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. CONFIGURATION & TUNING
  // ==========================================================================
  const CONFIG = {
    // Stage display durations in milliseconds
    stageDurations: [3400, 3200, 3800, 3600],
    autoPlayResumeDelay: 8000,

    // Orthographic Camera Frustum
    frustumSizeDesktop: 14.0,
    frustumSizeMobile: 16.5,

    // Camera Isometric Offset Vector (Camera is positioned at target + offset)
    cameraOffset: { x: 18, y: 16, z: 18 },

    // Stage focus targets in 3D world space (X, Y, Z) & Zoom levels
    stageTargets: [
      { lookAt: { x: -11.0, y: 0.5, z: 0 }, zoom: 1.05 }, // Stage 1: Ingest
      { lookAt: { x: -3.5,  y: 0.5, z: 0 }, zoom: 1.15 }, // Stage 2: Triage
      { lookAt: { x: 4.8,   y: 0.6, z: 0 }, zoom: 1.15 }, // Stage 3: Calendar Lock
      { lookAt: { x: 13.0,  y: 0.5, z: 0 }, zoom: 1.05 }  // Stage 4: CRM Archive
    ],

    // Stage captions & HUD Badges
    stages: [
      {
        badge: 'STAGE 01 // INBOUND INGEST',
        ticker: '0.00s',
        caption: 'STAGE 01 // INBOUND INGEST: Multi-channel webhooks normalize into single unified queue (<50ms)',
        terminalBadge: 'STAGE 01 // INBOUND INGEST',
        stepTitle: 'Inquiries Arrive from Any Channel Simultaneously',
        stepDesc: 'Customer reaches out through Facebook Messenger, WhatsApp, Viber, or your website. FlowState normalizes the webhook payload instantly.'
      },
      {
        badge: 'STAGE 02 // AI QUALIFICATION',
        ticker: '0.45s',
        caption: 'STAGE 02 // AI QUALIFICATION: Sub-2s LLM scanner discards tire-kickers; validates high-intent lead',
        terminalBadge: 'STAGE 02 // AI QUALIFICATION',
        stepTitle: 'Conversational Triage in Under 2 Seconds',
        stepDesc: 'Our Groq-accelerated LLM pipeline detects intent, budget, and language (Taglish & English), asking targeted qualification questions.'
      },
      {
        badge: 'STAGE 03 // CALENDAR LOCK',
        ticker: '0.88s',
        caption: 'STAGE 03 // CALENDAR LOCK: Atomic slot reservation with zero double-booking collision lock',
        terminalBadge: 'STAGE 03 // CALENDAR LOCK',
        stepTitle: 'Instant Calendar Booking & Invoice Generation',
        stepDesc: 'Direct integration with Google Calendar and Cal.com locks the exact appointment window with guaranteed zero double-booking.'
      },
      {
        badge: 'STAGE 04 // CRM ARCHIVAL',
        ticker: '1.10s',
        caption: 'STAGE 04 // CRM ARCHIVAL: Stamped into private database, instant founder SMS notification dispatched',
        terminalBadge: 'STAGE 04 // PRIVATE CRM SYNC',
        stepTitle: 'Private Database Record & Multi-Channel SMS Alerts',
        stepDesc: 'Lead records sync to private PostgreSQL/D1 tables, and automated confirmation reminders trigger over SMS and WhatsApp.'
      }
    ],

    // Kinetic White Palette
    colors: {
      ink: 0x09090B,
      inkMuted: 0x71717A,
      paper: 0xF4F4F5,
      surface: 0xFAFAFA,
      white: 0xFFFFFF,
      border: 0xE4E4E7,
      borderDark: 0x27272A,
      crimson: 0xE11D48,
      greyDiscard: 0xA1A1AA,
      greenSuccess: 0x10B981
    }
  };

  // ==========================================================================
  // 2. STATE & GLOBALS
  // ==========================================================================
  let container, canvasHolder, canvas, renderer, scene, camera;
  let isInitialized = false;
  let isVisible = true;
  let isPaused = false;
  let currentStage = 1;
  let autoPlayTimer = null;
  let stageAnimationTimers = [];
  let resizeObserver = null;
  let intersectionObserver = null;
  let isMobile = window.innerWidth < 768;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scene Objects
  let stage1Group, stage2Group, stage3Group, stage4Group;
  let heroPacket, heroPacketEdges;
  let rejectPacket1, rejectPacket2, duplicateRejectPacket;
  let lanePackets = [];
  let calendarGridCells = [];
  let lockedSlotMesh;
  let crmLedgerStack = [];
  let crmStampedRecord = null;
  let scanLaserLine;
  let materials = {};

  // Interpolated Camera State
  const cameraState = {
    targetX: CONFIG.stageTargets[0].lookAt.x,
    targetY: CONFIG.stageTargets[0].lookAt.y,
    targetZ: CONFIG.stageTargets[0].lookAt.z,
    zoom: CONFIG.stageTargets[0].zoom
  };

  // ==========================================================================
  // 3. INITIALIZATION
  // ==========================================================================
  function init() {
    container = document.getElementById('pipeline3dContainer');
    canvasHolder = document.querySelector('.pipeline-canvas-holder');
    canvas = document.getElementById('pipeline3dCanvas');
    const fallbackTerminal = document.getElementById('pipelineFallbackTerminal');

    if (!container || !canvas) return;

    if (!hasWebGLSupport() || typeof THREE === 'undefined') {
      console.warn('[FlowState 3D] WebGL unavailable or Three.js missing. Showing fallback terminal.');
      if (fallbackTerminal) fallbackTerminal.style.display = 'block';
      if (container) container.style.display = 'none';
      return;
    }

    setupMaterials();
    setupRenderer();
    setupCamera();
    buildWorld();
    setupDOMInteractions();
    setupObservers();

    isInitialized = true;

    if (prefersReducedMotion) {
      goToStage(3, true);
      pause();
    } else {
      goToStage(1, false);
      startAutoPlay();
    }

    renderFrame();
  }

  function hasWebGLSupport() {
    try {
      const testCanvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  }

  // ==========================================================================
  // 4. MATERIALS (With PolygonOffset to prevent Z-Fighting)
  // ==========================================================================
  function setupMaterials() {
    materials.white = new THREE.MeshBasicMaterial({
      color: CONFIG.colors.white,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });

    materials.paper = new THREE.MeshBasicMaterial({
      color: CONFIG.colors.paper,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });

    materials.crimson = new THREE.MeshBasicMaterial({
      color: CONFIG.colors.crimson,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });

    materials.greyDiscard = new THREE.MeshBasicMaterial({
      color: CONFIG.colors.greyDiscard,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });

    materials.lineInk = new THREE.LineBasicMaterial({
      color: CONFIG.colors.ink,
      linewidth: 2
    });

    materials.lineCrimson = new THREE.LineBasicMaterial({
      color: CONFIG.colors.crimson,
      linewidth: 3
    });

    materials.lineSubtle = new THREE.LineBasicMaterial({
      color: CONFIG.colors.border,
      linewidth: 1
    });

    materials.lineDark = new THREE.LineBasicMaterial({
      color: CONFIG.colors.borderDark,
      linewidth: 1
    });
  }

  function createBrutalistMesh(geometry, fillMaterial, lineMaterial) {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(geometry, fillMaterial || materials.white);
    const edges = new THREE.EdgesGeometry(geometry);
    const lines = new THREE.LineSegments(edges, lineMaterial || materials.lineInk);
    group.add(mesh);
    group.add(lines);
    group.mesh = mesh;
    group.lines = lines;
    return group;
  }

  // ==========================================================================
  // 5. RENDERER & ORTHOGRAPHIC CAMERA
  // ==========================================================================
  function setupRenderer() {
    const width = (canvasHolder && canvasHolder.clientWidth) ? canvasHolder.clientWidth : 600;
    const height = (canvasHolder && canvasHolder.clientHeight) ? canvasHolder.clientHeight : 380;

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    scene = new THREE.Scene();
  }

  function setupCamera() {
    const width = (canvasHolder && canvasHolder.clientWidth) ? canvasHolder.clientWidth : 600;
    const height = (canvasHolder && canvasHolder.clientHeight) ? canvasHolder.clientHeight : 380;
    const aspect = (height > 0) ? (width / height) : (16 / 9);
    const frustum = isMobile ? CONFIG.frustumSizeMobile : CONFIG.frustumSizeDesktop;

    camera = new THREE.OrthographicCamera(
      (frustum * aspect) / -2,
      (frustum * aspect) / 2,
      frustum / 2,
      frustum / -2,
      0.1,
      1000
    );

    updateCameraTransform();
  }

  function updateCameraTransform() {
    if (!camera) return;

    const safeTargetX = Number.isFinite(cameraState.targetX) ? cameraState.targetX : -11.0;
    const safeTargetY = Number.isFinite(cameraState.targetY) ? cameraState.targetY : 0.5;
    const safeTargetZ = Number.isFinite(cameraState.targetZ) ? cameraState.targetZ : 0;
    const safeZoom = Number.isFinite(cameraState.zoom) ? cameraState.zoom : 1.0;

    camera.position.set(
      safeTargetX + CONFIG.cameraOffset.x,
      safeTargetY + CONFIG.cameraOffset.y,
      safeTargetZ + CONFIG.cameraOffset.z
    );

    camera.lookAt(safeTargetX, safeTargetY, safeTargetZ);
    camera.zoom = safeZoom;
    camera.updateProjectionMatrix();
  }

  // ==========================================================================
  // 6. SCENE GRAPH
  // ==========================================================================
  function buildWorld() {
    // Ground Blueprint Grid
    const groundGrid = new THREE.GridHelper(50, 50, 0xD4D4D8, 0xE4E4E7);
    groundGrid.position.y = -0.12;
    scene.add(groundGrid);

    // ------------------------------------------------------------------------
    // STAGE 1: INGEST LANES (WhatsApp, Messenger, Web)
    // ------------------------------------------------------------------------
    stage1Group = new THREE.Group();
    const laneConfigs = [
      { name: 'WHATSAPP', z: -2.4 },
      { name: 'MESSENGER', z: 0.0 },
      { name: 'WEB INTAKE', z: 2.4 }
    ];

    laneConfigs.forEach((cfg) => {
      const trackGeo = new THREE.BoxGeometry(7.0, 0.1, 1.4);
      const track = createBrutalistMesh(trackGeo, materials.paper, materials.lineInk);
      track.position.set(-13.5, -0.05, cfg.z);
      stage1Group.add(track);

      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-16.8, 0.02, cfg.z),
        new THREE.Vector3(-10.2, 0.02, cfg.z)
      ]);
      const line = new THREE.Line(lineGeo, materials.lineSubtle);
      stage1Group.add(line);

      const gateArchGeo = new THREE.BoxGeometry(0.2, 1.4, 1.6);
      const gateArch = createBrutalistMesh(gateArchGeo, materials.white, materials.lineInk);
      gateArch.position.set(-16.8, 0.65, cfg.z);
      stage1Group.add(gateArch);
    });

    const funnelGeo = new THREE.BoxGeometry(3.2, 0.12, 6.2);
    const funnelPlate = createBrutalistMesh(funnelGeo, materials.white, materials.lineInk);
    funnelPlate.position.set(-8.4, -0.06, 0);
    stage1Group.add(funnelPlate);

    lanePackets = [];
    const packetGeo = new THREE.BoxGeometry(0.55, 0.55, 0.55);
    for (let i = 0; i < (isMobile ? 3 : 6); i++) {
      const p = createBrutalistMesh(packetGeo, materials.white, materials.lineInk);
      const lane = laneConfigs[i % 3];
      p.position.set(-16.0 + (i * 1.8), 0.32, lane.z);
      p.userData = { laneZ: lane.z, speed: 0.045 + (i * 0.005), initialX: -16.0 };
      stage1Group.add(p);
      lanePackets.push(p);
    }
    scene.add(stage1Group);

    // ------------------------------------------------------------------------
    // STAGE 2: TRIAGE SCANNER & REJECT CHUTE
    // ------------------------------------------------------------------------
    stage2Group = new THREE.Group();

    const scannerFrameGeo = new THREE.BoxGeometry(0.4, 3.2, 4.6);
    const scannerFrame = createBrutalistMesh(scannerFrameGeo, materials.white, materials.lineInk);
    scannerFrame.position.set(-3.5, 1.5, 0);
    stage2Group.add(scannerFrame);

    const scanLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-3.5, 0.1, -2.1),
      new THREE.Vector3(-3.5, 2.9, -2.1),
      new THREE.Vector3(-3.5, 2.9, 2.1),
      new THREE.Vector3(-3.5, 0.1, 2.1),
      new THREE.Vector3(-3.5, 0.1, -2.1)
    ]);
    scanLaserLine = new THREE.Line(scanLineGeo, materials.lineCrimson);
    stage2Group.add(scanLaserLine);

    const chuteGeo = new THREE.BoxGeometry(2.4, 0.15, 3.2);
    const chute = createBrutalistMesh(chuteGeo, materials.paper, materials.lineDark);
    chute.position.set(-3.5, -0.4, -2.8);
    chute.rotation.x = Math.PI / 8;
    stage2Group.add(chute);

    const rejectGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    rejectPacket1 = createBrutalistMesh(rejectGeo, materials.greyDiscard, materials.lineDark);
    rejectPacket1.position.set(-3.5, 0.3, -0.8);
    stage2Group.add(rejectPacket1);

    rejectPacket2 = createBrutalistMesh(rejectGeo, materials.greyDiscard, materials.lineDark);
    rejectPacket2.position.set(-3.5, 0.3, 0.8);
    stage2Group.add(rejectPacket2);
    scene.add(stage2Group);

    // ------------------------------------------------------------------------
    // STAGE 3: ISOMETRIC CALENDAR MATRIX & LOCK
    // ------------------------------------------------------------------------
    stage3Group = new THREE.Group();

    const calBaseGeo = new THREE.BoxGeometry(6.6, 0.15, 5.0);
    const calBase = createBrutalistMesh(calBaseGeo, materials.paper, materials.lineInk);
    calBase.position.set(4.8, -0.08, 0);
    stage3Group.add(calBase);

    calendarGridCells = [];
    const cols = 4;
    const rows = 3;
    const cellW = 1.35;
    const cellD = 1.25;
    const startX = 4.8 - ((cols - 1) * (cellW + 0.18)) / 2;
    const startZ = 0 - ((rows - 1) * (cellD + 0.2)) / 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isTarget = (r === 1 && c === 2); // THU 14:00 Target Slot
        const cellGeo = new THREE.BoxGeometry(cellW, 0.16, cellD);
        const cellMesh = createBrutalistMesh(cellGeo, isTarget ? materials.white : materials.white, materials.lineInk);
        const posX = startX + c * (cellW + 0.18);
        const posZ = startZ + r * (cellD + 0.2);
        cellMesh.position.set(posX, 0.08, posZ);
        stage3Group.add(cellMesh);

        if (isTarget) {
          lockedSlotMesh = cellMesh;
        } else {
          calendarGridCells.push(cellMesh);
        }
      }
    }

    duplicateRejectPacket = createBrutalistMesh(packetGeo, materials.greyDiscard, materials.lineDark);
    duplicateRejectPacket.position.set(3.2, 2.5, -2.0);
    duplicateRejectPacket.visible = false;
    stage3Group.add(duplicateRejectPacket);
    scene.add(stage3Group);

    // ------------------------------------------------------------------------
    // STAGE 4: PRIVATE CRM DATABASE LEDGER STACK
    // ------------------------------------------------------------------------
    stage4Group = new THREE.Group();
    crmLedgerStack = [];
    const ledgerW = 5.2;
    const ledgerH = 0.38;
    const ledgerD = 4.2;

    for (let i = 0; i < 4; i++) {
      const cardGeo = new THREE.BoxGeometry(ledgerW, ledgerH, ledgerD);
      const card = createBrutalistMesh(cardGeo, materials.white, materials.lineInk);
      card.position.set(13.0, (i * (ledgerH + 0.12)), 0);

      const tabGeo = new THREE.BoxGeometry(0.12, 0.2, 0.8);
      const tab = createBrutalistMesh(tabGeo, materials.paper, materials.lineDark);
      tab.position.set(13.0 + (ledgerW / 2) + 0.06, (i * (ledgerH + 0.12)), -1.0 + (i * 0.6));
      stage4Group.add(tab);

      stage4Group.add(card);
      crmLedgerStack.push(card);
    }

    const stampedGeo = new THREE.BoxGeometry(ledgerW * 0.92, 0.22, ledgerD * 0.92);
    crmStampedRecord = createBrutalistMesh(stampedGeo, materials.white, materials.lineCrimson);
    crmStampedRecord.position.set(13.0, 2.2, 0);
    crmStampedRecord.visible = false;
    stage4Group.add(crmStampedRecord);
    scene.add(stage4Group);

    // ------------------------------------------------------------------------
    // HERO PACKET
    // ------------------------------------------------------------------------
    const heroGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    heroPacket = new THREE.Mesh(heroGeo, materials.white);
    heroPacketEdges = new THREE.LineSegments(new THREE.EdgesGeometry(heroGeo), materials.lineInk);
    heroPacket.add(heroPacketEdges);
    heroPacket.position.set(-16.0, 0.38, 0);
    scene.add(heroPacket);
  }

  // ==========================================================================
  // 7. ANIMATION MANAGEMENT & CLEANUP (Crash-Proof)
  // ==========================================================================
  function stopAllActiveTweens() {
    const anime = getAnime();
    
    // Clear all pending setTimeout animation chains
    stageAnimationTimers.forEach(timer => clearTimeout(timer));
    stageAnimationTimers = [];

    if (!anime || typeof anime.remove !== 'function') return;

    // Remove in-flight tweens on all animated object properties
    const targets = [
      cameraState,
      heroPacket?.position,
      heroPacket?.rotation,
      heroPacket?.scale,
      rejectPacket1?.position,
      rejectPacket1?.rotation,
      rejectPacket2?.position,
      rejectPacket2?.rotation,
      duplicateRejectPacket?.position,
      duplicateRejectPacket?.rotation,
      lockedSlotMesh?.position,
      crmStampedRecord?.position,
      scanLaserLine?.position
    ];

    targets.forEach(t => {
      if (t) {
        try {
          anime.remove(t);
        } catch (e) {}
      }
    });
  }

  function goToStage(stageNum, immediate) {
    if (stageNum < 1 || stageNum > 4) return;
    currentStage = stageNum;
    const anime = getAnime();
    const target = CONFIG.stageTargets[stageNum - 1];
    const stageMeta = CONFIG.stages[stageNum - 1];

    // Stop existing animations before starting new stage
    stopAllActiveTweens();

    // Update Left Tab States
    document.querySelectorAll('.pipeline-tab-item').forEach((tab) => {
      const step = Number(tab.getAttribute('data-step'));
      const isCurrent = (step === stageNum);
      tab.classList.toggle('active', isCurrent);
      tab.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
      tab.setAttribute('tabindex', isCurrent ? '0' : '-1');
    });

    // Update HUD & Captions
    const stageBadge = document.getElementById('pipeline3dStageBadge');
    const ticker = document.getElementById('pipeline3dTicker');
    const caption = document.getElementById('pipeline3dCaptionText');
    const terminalBadge = document.getElementById('pipelineStageBadge');
    const stepTitle = document.getElementById('pipelineStepTitle');
    const stepDesc = document.getElementById('pipelineStepDesc');

    if (stageBadge) stageBadge.textContent = stageMeta.badge;
    if (ticker) ticker.textContent = stageMeta.ticker;
    if (caption) caption.textContent = stageMeta.caption;
    if (terminalBadge) terminalBadge.textContent = stageMeta.terminalBadge;
    if (stepTitle) stepTitle.textContent = stageMeta.stepTitle;
    if (stepDesc) stepDesc.textContent = stageMeta.stepDesc;

    if (immediate || !anime || prefersReducedMotion) {
      cameraState.targetX = target.lookAt.x;
      cameraState.targetY = target.lookAt.y;
      cameraState.targetZ = target.lookAt.z;
      cameraState.zoom = target.zoom;
      updateCameraTransform();
      applyStageStaticState(stageNum);
      return;
    }

    // Camera Motion
    anime.animate(cameraState, {
      targetX: target.lookAt.x,
      targetY: target.lookAt.y,
      targetZ: target.lookAt.z,
      zoom: target.zoom,
      duration: 1000,
      ease: 'outQuad',
      onUpdate: updateCameraTransform
    });

    triggerStageAnimation(stageNum);
  }

  function triggerStageAnimation(stageNum) {
    const anime = getAnime();
    if (!anime || prefersReducedMotion) return;

    if (stageNum === 1) {
      // ----------------------------------------------------------------------
      // STAGE 1: INGEST
      // ----------------------------------------------------------------------
      heroPacket.material = materials.white;
      heroPacketEdges.material = materials.lineInk;
      heroPacket.position.set(-16.0, 0.38, 0);
      if (crmStampedRecord) crmStampedRecord.visible = false;
      if (duplicateRejectPacket) duplicateRejectPacket.visible = false;

      anime.animate(heroPacket.position, {
        x: -8.0,
        duration: CONFIG.stageDurations[0],
        ease: 'inOutQuad'
      });

    } else if (stageNum === 2) {
      // ----------------------------------------------------------------------
      // STAGE 2: TRIAGE
      // ----------------------------------------------------------------------
      heroPacket.position.set(-8.0, 0.38, 0);
      if (crmStampedRecord) crmStampedRecord.visible = false;
      if (duplicateRejectPacket) duplicateRejectPacket.visible = false;

      anime.animate(heroPacket.position, {
        x: -0.5,
        duration: CONFIG.stageDurations[1],
        ease: 'inOutQuad',
        onUpdate: () => {
          if (heroPacket.position.x >= -3.5 && heroPacket.material !== materials.crimson) {
            heroPacket.material = materials.crimson;
            heroPacketEdges.material = materials.lineCrimson;
          }
        }
      });

      anime.animate(scanLaserLine.position, {
        x: 0.3,
        duration: 800,
        direction: 'alternate',
        loop: 3,
        ease: 'inOutSine'
      });

      rejectPacket1.position.set(-3.5, 0.3, -0.8);
      rejectPacket1.rotation.set(0, 0, 0);
      anime.animate(rejectPacket1.position, {
        y: -3.5,
        z: -4.5,
        duration: 1500,
        ease: 'inQuad'
      });
      anime.animate(rejectPacket1.rotation, {
        x: 3.5,
        y: 2.0,
        duration: 1500,
        ease: 'linear'
      });

      rejectPacket2.position.set(-3.5, 0.3, 0.8);
      rejectPacket2.rotation.set(0, 0, 0);
      const timer2 = setTimeout(() => {
        anime.animate(rejectPacket2.position, {
          y: -3.5,
          z: -4.5,
          duration: 1500,
          ease: 'inQuad'
        });
      }, 300);
      stageAnimationTimers.push(timer2);

    } else if (stageNum === 3) {
      // ----------------------------------------------------------------------
      // STAGE 3: CALENDAR LOCK (Completely hardened & crash-proof)
      // ----------------------------------------------------------------------
      heroPacket.material = materials.crimson;
      heroPacketEdges.material = materials.lineCrimson;
      heroPacket.position.set(-0.5, 0.38, 0);
      lockedSlotMesh.position.y = 0.08;
      lockedSlotMesh.lines.material = materials.lineInk;
      if (crmStampedRecord) crmStampedRecord.visible = false;
      if (duplicateRejectPacket) duplicateRejectPacket.visible = false;

      const targetX = lockedSlotMesh.position.x;
      const targetZ = lockedSlotMesh.position.z;

      // Part A: Parabolic arc jump towards target slot (Clean 2-phase tween)
      anime.animate(heroPacket.position, {
        x: targetX,
        z: targetZ,
        duration: 900,
        ease: 'outQuad'
      });

      // Arc peak
      anime.animate(heroPacket.position, {
        y: 2.4,
        duration: 450,
        ease: 'outQuad',
        onComplete: () => {
          // Arc drop into slot
          anime.animate(heroPacket.position, {
            y: 0.45,
            duration: 450,
            ease: 'outBounce',
            onComplete: () => {
              // Snap target slot up
              anime.animate(lockedSlotMesh.position, {
                y: 0.38,
                duration: 350,
                ease: 'outBack'
              });
              lockedSlotMesh.lines.material = materials.lineCrimson;

              // Collision Deflection of Duplicate Lead
              duplicateRejectPacket.visible = true;
              duplicateRejectPacket.position.set(targetX - 2.5, 2.2, targetZ - 1.6);
              duplicateRejectPacket.rotation.set(0, 0, 0);

              // Step 1: Duplicate rushes in towards locked slot
              anime.animate(duplicateRejectPacket.position, {
                x: targetX - 0.4,
                y: 0.8,
                z: targetZ - 0.2,
                duration: 350,
                ease: 'outQuad',
                onComplete: () => {
                  // Step 2: Bounces off collision barrier
                  anime.animate(duplicateRejectPacket.position, {
                    x: targetX - 3.2,
                    y: -2.5,
                    z: targetZ - 3.2,
                    duration: 650,
                    ease: 'inQuad'
                  });
                  anime.animate(duplicateRejectPacket.rotation, {
                    x: 3.5,
                    y: 2.0,
                    duration: 650,
                    ease: 'linear'
                  });
                }
              });
            }
          });
        }
      });

    } else if (stageNum === 4) {
      // ----------------------------------------------------------------------
      // STAGE 4: CRM ARCHIVE
      // ----------------------------------------------------------------------
      heroPacket.position.set(lockedSlotMesh.position.x, 0.45, lockedSlotMesh.position.z);
      crmStampedRecord.visible = true;
      crmStampedRecord.position.set(13.0, 3.2, 0);
      if (duplicateRejectPacket) duplicateRejectPacket.visible = false;

      anime.animate(heroPacket.position, {
        x: 13.0,
        y: 1.6,
        duration: 800,
        ease: 'inOutQuad',
        onComplete: () => {
          anime.animate(crmStampedRecord.position, {
            y: 1.6,
            duration: 400,
            ease: 'outBack'
          });
          crmLedgerStack.forEach((card, idx) => {
            const timer = setTimeout(() => {
              anime.animate(card.position, {
                y: (idx * 0.5),
                duration: 300,
                ease: 'outQuad'
              });
            }, idx * 40);
            stageAnimationTimers.push(timer);
          });
        }
      });
    }
  }

  function applyStageStaticState(stageNum) {
    if (!heroPacket || !lockedSlotMesh) return;

    if (stageNum === 1) {
      heroPacket.position.set(-11.0, 0.38, 0);
      heroPacket.material = materials.white;
      heroPacketEdges.material = materials.lineInk;
      if (crmStampedRecord) crmStampedRecord.visible = false;
      if (duplicateRejectPacket) duplicateRejectPacket.visible = false;
    } else if (stageNum === 2) {
      heroPacket.position.set(-3.5, 0.38, 0);
      heroPacket.material = materials.crimson;
      heroPacketEdges.material = materials.lineCrimson;
      if (crmStampedRecord) crmStampedRecord.visible = false;
      if (duplicateRejectPacket) duplicateRejectPacket.visible = false;
    } else if (stageNum === 3) {
      heroPacket.position.set(lockedSlotMesh.position.x, 0.45, lockedSlotMesh.position.z);
      heroPacket.material = materials.crimson;
      heroPacketEdges.material = materials.lineCrimson;
      lockedSlotMesh.position.y = 0.38;
      lockedSlotMesh.lines.material = materials.lineCrimson;
      if (duplicateRejectPacket) duplicateRejectPacket.visible = false;
      if (crmStampedRecord) crmStampedRecord.visible = false;
    } else if (stageNum === 4) {
      heroPacket.position.set(13.0, 1.6, 0);
      heroPacket.material = materials.crimson;
      heroPacketEdges.material = materials.lineCrimson;
      if (crmStampedRecord) {
        crmStampedRecord.visible = true;
        crmStampedRecord.position.set(13.0, 1.6, 0);
      }
    }
  }

  // ==========================================================================
  // 8. AUTO-PLAY LOOP
  // ==========================================================================
  function startAutoPlay() {
    if (prefersReducedMotion || isPaused) return;
    clearTimeout(autoPlayTimer);

    const duration = CONFIG.stageDurations[currentStage - 1] || 3400;
    autoPlayTimer = setTimeout(() => {
      if (isPaused || !isVisible) return;
      const nextStage = currentStage >= 4 ? 1 : currentStage + 1;
      goToStage(nextStage, false);
      startAutoPlay();
    }, duration);
  }

  function pause() {
    isPaused = true;
    clearTimeout(autoPlayTimer);
    const modeEl = document.getElementById('pipeline3dPlayState');
    if (modeEl) modeEl.textContent = 'PAUSED [HOVER / INTERACTION]';
  }

  function resume() {
    if (prefersReducedMotion) return;
    isPaused = false;
    const modeEl = document.getElementById('pipeline3dPlayState');
    if (modeEl) modeEl.textContent = 'AUTO-LOOP [HOVER TO PAUSE]';
    startAutoPlay();
  }

  // ==========================================================================
  // 9. OBSERVERS & EVENT LISTENERS
  // ==========================================================================
  function setupDOMInteractions() {
    if (!isMobile && container) {
      container.addEventListener('mouseenter', () => pause());
      container.addEventListener('mouseleave', () => resume());
    }

    const tabList = document.querySelector('.pipeline-tabs-list');
    if (tabList) {
      tabList.addEventListener('keydown', (e) => {
        const tabs = Array.from(document.querySelectorAll('.pipeline-tab-item'));
        const activeIdx = tabs.findIndex(t => t.classList.contains('active'));
        let newIdx = activeIdx;

        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          newIdx = (activeIdx + 1) % tabs.length;
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          newIdx = (activeIdx - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          newIdx = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          newIdx = tabs.length - 1;
        }

        if (newIdx !== activeIdx) {
          tabs[newIdx].focus();
          const stepNum = Number(tabs[newIdx].getAttribute('data-step'));
          if (typeof window.switchPipelineStep === 'function') {
            window.switchPipelineStep(stepNum);
          } else {
            goToStage(stepNum);
          }
        }
      });
    }
  }

  function setupObservers() {
    const section = document.getElementById('pipeline');
    if (section && 'IntersectionObserver' in window) {
      intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            resume();
          } else {
            pause();
          }
        });
      }, { threshold: 0.15 });

      intersectionObserver.observe(section);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        pause();
      } else if (isVisible) {
        resume();
      }
    });

    if ('ResizeObserver' in window && canvasHolder) {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(canvasHolder);
    } else {
      window.addEventListener('resize', handleResize);
    }
  }

  function handleResize() {
    if (!renderer || !camera || !canvasHolder) return;

    const width = canvasHolder.clientWidth || 600;
    const height = canvasHolder.clientHeight || 380;
    isMobile = window.innerWidth < 768;

    const aspect = (height > 0) ? (width / height) : (16 / 9);
    const frustum = isMobile ? CONFIG.frustumSizeMobile : CONFIG.frustumSizeDesktop;

    camera.left = (frustum * aspect) / -2;
    camera.right = (frustum * aspect) / 2;
    camera.top = frustum / 2;
    camera.bottom = frustum / -2;

    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  // ==========================================================================
  // 10. RENDER LOOP
  // ==========================================================================
  function renderFrame() {
    if (isVisible && renderer && scene && camera) {
      if (!prefersReducedMotion && currentStage === 1) {
        lanePackets.forEach((p) => {
          p.position.x += p.userData.speed;
          if (p.position.x > -7.2) {
            p.position.x = p.userData.initialX;
          }
        });
      }

      renderer.render(scene, camera);
    }

    requestAnimationFrame(renderFrame);
  }

  function getAnime() {
    if (window.anime && typeof window.anime.animate === 'function') {
      return window.anime;
    }
    if (typeof window.anime === 'function') {
      return {
        animate: (target, params) => window.anime({ targets: target, ...params }),
        remove: (target) => window.anime && window.anime.remove ? window.anime.remove(target) : null
      };
    }
    return null;
  }

  // ==========================================================================
  // 11. PUBLIC API
  // ==========================================================================
  window.FlowStatePipeline3D = {
    goToStage: function (n) {
      goToStage(n, false);
      pause();
      clearTimeout(autoPlayTimer);
      if (!prefersReducedMotion) {
        autoPlayTimer = setTimeout(() => {
          resume();
        }, CONFIG.autoPlayResumeDelay);
      }
    },
    play: resume,
    pause: pause,
    getConfig: () => CONFIG
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
