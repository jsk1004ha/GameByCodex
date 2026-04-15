(() => {
  "use strict";

  const STORAGE_KEY = "null-relay-save-v1";
  const FIXED_DT = 1 / 60;
  const WORLD_WIDTH = 2200;
  const WORLD_HEIGHT = 1320;
  let entityId = 1;

  const config = {
    width: 1280,
    height: 720,
    interactionRadius: 92,
    objectiveRadius: 170,
    stabilizerExposeDuration: 14,
    relayDurations: [36, 42, 48],
    railPatchDurations: [34, 38, 42],
    overdriveDuration: 6.5,
    palettes: {
      title: {
        bgA: "#0b1020",
        bgB: "#05070c",
        accent: "#48d8ff",
        accent2: "#ffbd55",
        hazard: "#ff5f78",
        grid: "rgba(72,216,255,0.12)",
        haze: "rgba(72,216,255,0.16)",
      },
      foundry: {
        bgA: "#120f09",
        bgB: "#05070b",
        accent: "#ffbd55",
        accent2: "#ff6b57",
        hazard: "#ff5f78",
        grid: "rgba(255,189,85,0.12)",
        haze: "rgba(255,189,85,0.16)",
      },
      rail: {
        bgA: "#09111a",
        bgB: "#04070a",
        accent: "#48d8ff",
        accent2: "#8df9d7",
        hazard: "#ffcb66",
        grid: "rgba(72,216,255,0.12)",
        haze: "rgba(72,216,255,0.18)",
      },
      core: {
        bgA: "#150811",
        bgB: "#04060a",
        accent: "#ff5f78",
        accent2: "#9d71ff",
        hazard: "#ffbd55",
        grid: "rgba(255,95,120,0.14)",
        haze: "rgba(157,113,255,0.18)",
      },
    },
    difficulties: {
      story: {
        label: "Story",
        enemyHp: 0.86,
        enemyDamage: 0.8,
        playerDamage: 1.18,
        heatGain: 0.92,
        barrierRegen: 1.24,
        repairs: 3,
        scoreMod: 0.9,
      },
      operative: {
        label: "Operative",
        enemyHp: 1,
        enemyDamage: 1,
        playerDamage: 1,
        heatGain: 1,
        barrierRegen: 1,
        repairs: 2,
        scoreMod: 1,
      },
      overclock: {
        label: "Overclock",
        enemyHp: 1.2,
        enemyDamage: 1.22,
        playerDamage: 0.94,
        heatGain: 1.08,
        barrierRegen: 0.88,
        repairs: 2,
        scoreMod: 1.22,
      },
    },
    settingsDefaults: {
      difficulty: "operative",
      masterVolume: 0.82,
      sfxVolume: 0.78,
      muted: false,
      highContrast: false,
      reduceShake: false,
      reduceFlash: false,
      largeHud: false,
    },
    upgrades: {
      piercing: {
        name: "Phase Piercer",
        short: "Piercing",
        desc: "Shots pierce two extra targets and gain 8% damage.",
      },
      chain: {
        name: "Arc Lattice",
        short: "Chain Arc",
        desc: "Weapon hits jump to nearby enemies for extra shock damage.",
      },
      dashShield: {
        name: "Dash Mantle",
        short: "Dash Shield",
        desc: "Dashing grants a stronger barrier pulse and a longer invulnerability edge.",
      },
      quickCool: {
        name: "Cold Sink",
        short: "Quick Cool",
        desc: "Heat dissipates faster and overheat lock clears sooner.",
      },
      barrierBloom: {
        name: "Barrier Bloom",
        short: "Barrier Bloom",
        desc: "Objectives and elite kills restore barrier and expand barrier capacity.",
      },
      overdriveExtended: {
        name: "Overdrive Rotor",
        short: "Overdrive+",
        desc: "Overdrive lasts longer and charges faster from combat actions.",
      },
      captureArray: {
        name: "Capture Array",
        short: "Fast Sync",
        desc: "Relay, rail, and stabilizer interactions complete much faster.",
      },
      lastStand: {
        name: "Edge Protocol",
        short: "Last Stand",
        desc: "Low hull boosts fire rate, damage, and movement speed.",
      },
    },
    enemyStats: {
      scrapper: { hp: 44, speed: 104, radius: 17, contact: 12, score: 16 },
      lancer: { hp: 76, speed: 82, radius: 18, contact: 18, score: 28 },
      wasp: { hp: 68, speed: 104, radius: 16, contact: 10, score: 30 },
      sentry: { hp: 120, speed: 28, radius: 21, contact: 14, score: 46 },
      warden: { hp: 1850, radius: 60, score: 800 },
    },
  };

  const byId = (id) => document.getElementById(id);
  const dom = {
    body: document.body,
    canvas: byId("game-canvas"),
    hud: byId("hud"),
    chapterLabel: byId("chapter-label"),
    objectiveLabel: byId("objective-label"),
    objectiveDetailLabel: byId("objective-detail-label"),
    contextLabel: byId("context-label"),
    threatLabel: byId("threat-label"),
    objectiveFill: byId("objective-fill"),
    scoreLabel: byId("score-label"),
    timeLabel: byId("time-label"),
    hpLabel: byId("hp-label"),
    barrierLabel: byId("barrier-label"),
    heatLabel: byId("heat-label"),
    dashLabel: byId("dash-label"),
    overdriveLabel: byId("overdrive-label"),
    repairsLabel: byId("repairs-label"),
    hpFill: byId("hp-fill"),
    barrierFill: byId("barrier-fill"),
    heatFill: byId("heat-fill"),
    dashFill: byId("dash-fill"),
    overdriveFill: byId("overdrive-fill"),
    titleScreen: byId("title-screen"),
    optionsScreen: byId("options-screen"),
    creditsScreen: byId("credits-screen"),
    pauseOverlay: byId("pause-overlay"),
    upgradeOverlay: byId("upgrade-overlay"),
    resultOverlay: byId("result-overlay"),
    chapterBanner: byId("chapter-banner"),
    bannerTitle: byId("banner-title"),
    bannerSubtitle: byId("banner-subtitle"),
    toast: byId("toast"),
    startBtn: byId("start-btn"),
    optionsBtn: byId("options-btn"),
    creditsBtn: byId("credits-btn"),
    optionsBackBtn: byId("options-back-btn"),
    creditsBackBtn: byId("credits-back-btn"),
    resumeBtn: byId("resume-btn"),
    restartBtn: byId("restart-btn"),
    backTitleBtn: byId("back-title-btn"),
    pauseObjective: byId("pause-objective"),
    pauseDetail: byId("pause-detail"),
    resultRestartBtn: byId("result-restart-btn"),
    resultTitleBtn: byId("result-title-btn"),
    difficultySelect: byId("difficulty-select"),
    optionsDifficultySelect: byId("options-difficulty-select"),
    difficultyNote: byId("difficulty-note"),
    bestScore: byId("best-score"),
    bestTime: byId("best-time"),
    clearCount: byId("clear-count"),
    masterVolume: byId("master-volume"),
    sfxVolume: byId("sfx-volume"),
    muteAudio: byId("mute-audio"),
    highContrast: byId("high-contrast"),
    reduceShake: byId("reduce-shake"),
    reduceFlash: byId("reduce-flash"),
    largeHud: byId("large-hud"),
    upgradeGrid: byId("upgrade-grid"),
    resultKicker: byId("result-kicker"),
    resultTitle: byId("result-title"),
    resultCopy: byId("result-copy"),
    resultScore: byId("result-score"),
    resultTime: byId("result-time"),
    resultMedal: byId("result-medal"),
  };

  if (!dom.canvas) {
    return;
  }

  const ctx = dom.canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const storage = {
    load() {
      const empty = {
        settings: { ...config.settingsDefaults },
        records: {
          bestScore: 0,
          bestTime: null,
          clears: 0,
          unlockedOverclock: false,
        },
      };
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return empty;
        const parsed = JSON.parse(raw);
        return {
          settings: {
            ...config.settingsDefaults,
            ...(parsed.settings || {}),
          },
          records: {
            ...empty.records,
            ...(parsed.records || {}),
          },
        };
      } catch {
        return empty;
      }
    },
    save(payload) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        return;
      }
    },
  };

  const saveBlob = storage.load();

  const state = {
    view: "title",
    settings: saveBlob.settings,
    records: saveBlob.records,
    run: null,
    ui: {
      bannerTime: 0,
      toastTime: 0,
      toastText: "",
      toastPriority: "normal",
      bannerTitle: "",
      bannerSubtitle: "",
    },
    pendingUpgrade: null,
    backgroundTime: 0,
    animationHandle: 0,
    lastTs: 0,
    accumulator: 0,
    input: {
      keys: new Set(),
      pressed: new Set(),
      mouse: {
        x: config.width / 2,
        y: config.height / 2,
        down: false,
        clicked: false,
      },
    },
  };

  const audio = {
    ctx: null,
    master: null,
    sfx: null,
    noiseBuffer: null,
    ensure() {
      if (!this.ctx) {
        const AudioCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtor) return;
        this.ctx = new AudioCtor();
        this.master = this.ctx.createGain();
        this.sfx = this.ctx.createGain();
        this.sfx.connect(this.master);
        this.master.connect(this.ctx.destination);
        this.noiseBuffer = this.makeNoiseBuffer();
        this.applySettings();
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
    },
    makeNoiseBuffer() {
      if (!this.ctx) return null;
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.5, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 1.7);
      }
      return buffer;
    },
    applySettings() {
      if (!this.master || !this.sfx) return;
      const master = state.settings.muted ? 0 : clamp(state.settings.masterVolume, 0, 1);
      this.master.gain.value = master;
      this.sfx.gain.value = clamp(state.settings.sfxVolume, 0, 1);
    },
    tone(options) {
      if (!this.ctx || state.settings.muted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const panNode = typeof this.ctx.createStereoPanner === "function" ? this.ctx.createStereoPanner() : null;
      osc.type = options.type || "triangle";
      osc.frequency.setValueAtTime(options.freq, now);
      if (options.endFreq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(40, options.endFreq), now + options.duration);
      }
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, options.volume || 0.12), now + (options.attack || 0.01));
      gain.gain.exponentialRampToValueAtTime(0.0001, now + options.duration);
      osc.connect(gain);
      if (panNode) {
        panNode.pan.value = clamp(options.pan || 0, -1, 1);
        gain.connect(panNode);
        panNode.connect(this.sfx);
      } else {
        gain.connect(this.sfx);
      }
      osc.start(now);
      osc.stop(now + options.duration + 0.02);
    },
    noise(options) {
      if (!this.ctx || !this.noiseBuffer || state.settings.muted) return;
      const now = this.ctx.currentTime;
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      filter.type = "bandpass";
      filter.frequency.value = options.freq || 1600;
      gain.gain.setValueAtTime(Math.max(0.0001, options.volume || 0.06), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (options.duration || 0.18));
      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfx);
      src.start(now);
      src.stop(now + (options.duration || 0.18) + 0.03);
    },
    play(kind, pan = 0) {
      if (!this.ctx) return;
      if (kind === "ui") {
        this.tone({ freq: 720, endFreq: 510, duration: 0.08, volume: 0.07, type: "triangle", pan });
      } else if (kind === "shoot") {
        this.tone({ freq: 240, endFreq: 120, duration: 0.11, volume: 0.09, type: "sawtooth", pan });
        this.noise({ freq: 1400, duration: 0.05, volume: 0.025 });
      } else if (kind === "hit") {
        this.tone({ freq: 170, endFreq: 84, duration: 0.16, volume: 0.12, type: "square", pan });
        this.noise({ freq: 1000, duration: 0.12, volume: 0.05 });
      } else if (kind === "dash") {
        this.tone({ freq: 420, endFreq: 180, duration: 0.18, volume: 0.1, type: "triangle", pan });
      } else if (kind === "reward") {
        this.tone({ freq: 560, endFreq: 840, duration: 0.18, volume: 0.09, type: "triangle", pan });
        this.tone({ freq: 880, endFreq: 1120, duration: 0.16, volume: 0.05, type: "sine", pan });
      } else if (kind === "warn") {
        this.tone({ freq: 210, endFreq: 280, duration: 0.22, volume: 0.08, type: "square", pan });
        this.noise({ freq: 600, duration: 0.14, volume: 0.03 });
      } else if (kind === "clear") {
        this.tone({ freq: 440, endFreq: 660, duration: 0.18, volume: 0.08, type: "triangle", pan });
        this.tone({ freq: 660, endFreq: 990, duration: 0.3, volume: 0.06, type: "sine", pan });
      } else if (kind === "gameOver") {
        this.tone({ freq: 210, endFreq: 70, duration: 0.34, volume: 0.12, type: "sawtooth", pan });
        this.noise({ freq: 500, duration: 0.28, volume: 0.04 });
      } else if (kind === "threat") {
        this.tone({ freq: 130, endFreq: 162, duration: 0.4, volume: 0.09, type: "sawtooth", pan });
      }
    },
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(t) {
    const v = clamp(t, 0, 1);
    return v * v * (3 - 2 * v);
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function angleTo(a, b) {
    return Math.atan2(b.y - a.y, b.x - a.x);
  }

  function normalize(x, y) {
    const len = Math.hypot(x, y) || 1;
    return { x: x / len, y: y / len };
  }

  function nextId() {
    entityId += 1;
    return entityId;
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "--:--";
    const whole = Math.max(0, Math.floor(seconds));
    const mins = String(Math.floor(whole / 60)).padStart(2, "0");
    const secs = String(whole % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  }

  function formatScore(value) {
    return Math.floor(value).toLocaleString("en-US");
  }

  function localPayload() {
    return {
      settings: state.settings,
      records: state.records,
    };
  }

  function persistState() {
    storage.save(localPayload());
    refreshRecordUI();
  }

  function refreshRecordUI() {
    dom.bestScore.textContent = formatScore(state.records.bestScore || 0);
    dom.bestTime.textContent = state.records.bestTime == null ? "--:--" : formatTime(state.records.bestTime);
    dom.clearCount.textContent = String(state.records.clears || 0);

    const locked = !state.records.unlockedOverclock;
    const note = locked ? "Overclock unlocks after your first clear." : "Overclock is armed.";
    dom.difficultyNote.textContent = note;

    [dom.difficultySelect, dom.optionsDifficultySelect].forEach((select) => {
      if (!select) return;
      const option = select.querySelector('option[value="overclock"]');
      if (option) option.disabled = locked;
      if (locked && state.settings.difficulty === "overclock") {
        state.settings.difficulty = "operative";
      }
      select.value = state.settings.difficulty;
    });
  }

  function applyVisualSettings() {
    dom.body.classList.toggle("high-contrast", !!state.settings.highContrast);
    dom.body.classList.toggle("large-hud", !!state.settings.largeHud);
  }

  function showBanner(title, subtitle, duration = 2.8) {
    state.ui.bannerTitle = title;
    state.ui.bannerSubtitle = subtitle;
    state.ui.bannerTime = duration;
    dom.bannerTitle.textContent = title;
    dom.bannerSubtitle.textContent = subtitle;
    dom.chapterBanner.classList.add("is-active");
  }

  function showToast(text, duration = 2.6, priority = "normal") {
    state.ui.toastText = text;
    state.ui.toastTime = duration;
    state.ui.toastPriority = priority;
    dom.toast.textContent = text;
    dom.toast.classList.toggle("priority-high", priority === "high");
    dom.toast.classList.add("is-active");
  }

  function clearTransientUi() {
    dom.chapterBanner.classList.remove("is-active");
    dom.toast.classList.remove("is-active");
    dom.toast.classList.remove("priority-high");
  }

  function setView(view) {
    state.view = view;
    renderScreens();
  }

  function renderScreens() {
    dom.titleScreen.classList.toggle("is-active", state.view === "title");
    dom.optionsScreen.classList.toggle("is-active", state.view === "options");
    dom.creditsScreen.classList.toggle("is-active", state.view === "credits");
    dom.pauseOverlay.classList.toggle("is-active", state.view === "paused");
    dom.upgradeOverlay.classList.toggle("is-active", state.view === "upgrade");
    dom.resultOverlay.classList.toggle("is-active", state.view === "result");
    const hudActive = !!state.run && ["playing", "paused", "upgrade", "result"].includes(state.view);
    dom.hud.classList.toggle("is-hidden", !hudActive);
    if (state.run && state.view === "paused") {
      dom.pauseObjective.textContent = state.run.objectiveLabel;
      dom.pauseDetail.textContent = state.run.objectiveDetail;
    }
  }

  function syncOptionControls() {
    dom.difficultySelect.value = state.settings.difficulty;
    dom.optionsDifficultySelect.value = state.settings.difficulty;
    dom.masterVolume.value = String(state.settings.masterVolume);
    dom.sfxVolume.value = String(state.settings.sfxVolume);
    dom.muteAudio.checked = !!state.settings.muted;
    dom.highContrast.checked = !!state.settings.highContrast;
    dom.reduceShake.checked = !!state.settings.reduceShake;
    dom.reduceFlash.checked = !!state.settings.reduceFlash;
    dom.largeHud.checked = !!state.settings.largeHud;
  }

  function setDifficulty(nextDifficulty) {
    if (nextDifficulty === "overclock" && !state.records.unlockedOverclock) {
      nextDifficulty = "operative";
    }
    state.settings.difficulty = nextDifficulty;
    syncOptionControls();
    refreshRecordUI();
    persistState();
  }

  function createPlayer(difficulty) {
    return {
      x: 300,
      y: 420,
      radius: 18,
      speed: 240,
      hp: 100,
      maxHp: 100,
      barrier: 60,
      maxBarrier: 60,
      heat: 0,
      heatMax: 100,
      overheated: false,
      shootCooldown: 0,
      dashCooldown: 0,
      dashMax: 4.2,
      dashTime: 0,
      dashDirX: 0,
      dashDirY: 0,
      invuln: 0,
      damageDelay: 0,
      overdrive: 0,
      overdriveActive: 0,
      overdriveUnlocked: false,
      repairCharges: difficulty.repairs,
      repairFlash: 0,
      aimAngle: 0,
      hitFlash: 0,
    };
  }

  function createRun() {
    const difficulty = config.difficulties[state.settings.difficulty] || config.difficulties.operative;
    const run = {
      difficultyKey: state.settings.difficulty,
      difficultyData: difficulty,
      elapsed: 0,
      score: 0,
      kills: 0,
      upgrades: [],
      upgradePool: Object.keys(config.upgrades),
      chapterId: "foundry",
      chapterName: "Foundry Wake",
      objectiveLabel: "",
      objectiveProgress: 0,
      objectiveDetail: "",
      player: createPlayer(difficulty),
      enemies: [],
      bullets: [],
      enemyBullets: [],
      hazards: [],
      particles: [],
      boss: null,
      stage: null,
      camera: {
        x: 0,
        y: 0,
        shake: 0,
        kickX: 0,
        kickY: 0,
      },
      flash: 0,
      hitStop: 0,
      result: null,
      stats: {
        damageDealt: 0,
        damageTaken: 0,
      },
      helpTimer: 12,
      interactionPrompt: null,
      damageIndicators: [],
      assist: {
        interactionSpeed: 1,
        cooling: 1,
        overdriveGain: 1,
        lastStand: false,
        piercing: 0,
        chain: false,
        barrierBloom: false,
        dashShield: false,
        quickCool: false,
        overdriveExtended: false,
      },
    };
    beginChapterFoundry(run);
    centerCamera(run);
    return run;
  }

  function resetCombatSpace(run) {
    run.enemies = [];
    run.bullets = [];
    run.enemyBullets = [];
    run.hazards = [];
    run.particles = [];
    run.boss = null;
  }

  function beginChapterFoundry(run) {
    resetCombatSpace(run);
    run.chapterId = "foundry";
    run.chapterName = "Foundry Wake";
    run.player.x = 340;
    run.player.y = 470;
    run.stage = {
      id: "foundry",
      relays: [
        { x: 420, y: 320, radius: 68, started: false, progress: 0, complete: false, duration: config.relayDurations[0], interact: 0 },
        { x: 820, y: 920, radius: 72, started: false, progress: 0, complete: false, duration: config.relayDurations[1], interact: 0 },
        { x: 1100, y: 500, radius: 74, started: false, progress: 0, complete: false, duration: config.relayDurations[2], interact: 0 },
      ],
      activeIndex: 0,
      spawnTimer: 1.2,
    };
    updateFoundryObjective(run);
    showBanner("Foundry Wake", "Prime the amber relays and hold the ring.");
    showToast("Move with WASD. Enter the relay ring and hold E to wake the relay.");
  }

  function beginChapterRail(run) {
    resetCombatSpace(run);
    run.chapterId = "rail";
    run.chapterName = "Rail Siege";
    run.helpTimer = 8;
    run.player.x = 1180;
    run.player.y = 700;
    run.stage = {
      id: "rail",
      route: [
        { x: 1160, y: 700 },
        { x: 1290, y: 660 },
        { x: 1410, y: 620, checkpoint: true, patchDuration: config.railPatchDurations[0] },
        { x: 1510, y: 560 },
        { x: 1640, y: 500 },
        { x: 1760, y: 470, checkpoint: true, patchDuration: config.railPatchDurations[1] },
        { x: 1850, y: 530 },
        { x: 1970, y: 610 },
        { x: 2070, y: 670, checkpoint: true, patchDuration: config.railPatchDurations[2] },
      ],
      cart: {
        x: 1160,
        y: 700,
        radius: 24,
        hp: 260,
        maxHp: 260,
        targetIndex: 1,
        speed: 58,
      },
      phase: "moving",
      spawnTimer: 1.15,
      stormTimer: 14,
      currentCheckpoint: null,
      checkpointCount: 0,
      patchProgress: 0,
      lastStormOrientation: "vertical",
    };
    updateRailObjective(run);
    showBanner("Rail Siege", "Escort the signal cart to the core tracks.");
    showToast("Protect the cart. Hold E at each junction to patch the rail.");
  }

  function beginChapterCore(run) {
    resetCombatSpace(run);
    run.chapterId = "core";
    run.chapterName = "Corefall";
    run.helpTimer = 8;
    run.player.x = 1760;
    run.player.y = 660;
    run.stage = {
      id: "core",
      phase: "stabilizers",
      stabilizers: [
        { x: 1860, y: 330, radius: 72, hp: 240, maxHp: 240, destroyed: false, state: "shielded", charge: 0, exposed: 0 },
        { x: 2090, y: 520, radius: 76, hp: 260, maxHp: 260, destroyed: false, state: "shielded", charge: 0, exposed: 0 },
        { x: 1910, y: 850, radius: 78, hp: 280, maxHp: 280, destroyed: false, state: "shielded", charge: 0, exposed: 0 },
      ],
      activeIndex: 0,
      spawnTimer: 1.2,
      pulseTimer: 12,
    };
    updateCoreObjective(run);
    showBanner("Corefall", "Breach the crimson stabilizers.");
    showToast("Hold E near a stabilizer to expose it, then fire before the shell seals.");
  }

  function beginBoss(run) {
    run.enemies = [];
    run.enemyBullets = [];
    run.hazards = [];
    run.helpTimer = 7;
    run.stage.phase = "boss";
    run.stage.pulseTimer = 10;
    run.stage.spawnTimer = 7.2;
    run.boss = {
      id: nextId(),
      type: "warden",
      x: 1940,
      y: 570,
      radius: config.enemyStats.warden.radius,
      hp: config.enemyStats.warden.hp * run.difficultyData.enemyHp,
      maxHp: config.enemyStats.warden.hp * run.difficultyData.enemyHp,
      anchors: [
        { x: 1940, y: 570 },
        { x: 1770, y: 390 },
        { x: 2120, y: 780 },
      ],
      anchorIndex: 0,
      boltTimer: 1.4,
      beamTimer: 5,
      summonTimer: 9,
      moveTimer: 3.8,
      beamCharge: 0,
      beamActive: 0,
      beamAngleStart: 0,
      beamAngleEnd: 0,
      beamAngle: 0,
      hitFlash: 0,
    };
    updateCoreObjective(run);
    showBanner("Relay Warden", "Phase through the pulses and finish the core.");
    audio.play("threat");
  }

  function centerCamera(run) {
    run.camera.x = clamp(run.player.x - config.width / 2, 0, WORLD_WIDTH - config.width);
    run.camera.y = clamp(run.player.y - config.height / 2, 0, WORLD_HEIGHT - config.height);
  }

  function startRun() {
    audio.ensure();
    state.run = createRun();
    setView("playing");
    renderUpgradeChoices([]);
    updateHud();
  }

  function returnToTitle() {
    state.run = null;
    state.pendingUpgrade = null;
    clearTransientUi();
    setView("title");
    updateHud();
  }

  function pauseRun() {
    if (!state.run || state.view !== "playing") return;
    setView("paused");
    audio.play("ui");
  }

  function resumeRun() {
    if (!state.run || state.view !== "paused") return;
    setView("playing");
    audio.play("ui");
  }

  function renderUpgradeChoices(choices) {
    dom.upgradeGrid.innerHTML = "";
    choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "upgrade-card";
      button.dataset.index = String(index);
      button.innerHTML = `<span class="eyebrow">${index + 1}</span><strong>${choice.name}</strong><p>${choice.desc}</p>`;
      button.addEventListener("click", () => pickUpgrade(index));
      dom.upgradeGrid.appendChild(button);
    });
  }

  function offerUpgrade(run, subtitle, onComplete) {
    const pool = [...run.upgradePool];
    const choices = [];
    while (choices.length < 3 && pool.length > 0) {
      const index = Math.floor(Math.random() * pool.length);
      const key = pool.splice(index, 1)[0];
      choices.push({ key, ...config.upgrades[key] });
    }
    state.pendingUpgrade = {
      choices,
      onComplete,
      subtitle,
    };
    dom.upgradeOverlay.querySelector("h2").textContent = subtitle;
    renderUpgradeChoices(choices);
    setView("upgrade");
    audio.play("reward");
  }

  function applyUpgrade(run, key) {
    const upgrade = config.upgrades[key];
    if (!upgrade) return;
    run.upgrades.push(key);
    run.upgradePool = run.upgradePool.filter((item) => item !== key);
    if (key === "piercing") {
      run.assist.piercing += 2;
    } else if (key === "chain") {
      run.assist.chain = true;
    } else if (key === "dashShield") {
      run.assist.dashShield = true;
    } else if (key === "quickCool") {
      run.assist.quickCool = true;
      run.assist.cooling = 1.45;
    } else if (key === "barrierBloom") {
      run.assist.barrierBloom = true;
      run.player.maxBarrier += 15;
      run.player.barrier = Math.min(run.player.maxBarrier, run.player.barrier + 15);
    } else if (key === "overdriveExtended") {
      run.assist.overdriveExtended = true;
      run.assist.overdriveGain = 1.24;
    } else if (key === "captureArray") {
      run.assist.interactionSpeed = 1.35;
    } else if (key === "lastStand") {
      run.assist.lastStand = true;
    }
    showToast(`${upgrade.short} synchronized.`);
  }

  function pickUpgrade(index) {
    if (state.view !== "upgrade" || !state.pendingUpgrade || !state.run) return;
    const choice = state.pendingUpgrade.choices[index];
    if (!choice) return;
    applyUpgrade(state.run, choice.key);
    const callback = state.pendingUpgrade.onComplete;
    state.pendingUpgrade = null;
    setView("playing");
    audio.play("reward");
    if (typeof callback === "function") {
      callback();
    }
  }

  function updateFoundryObjective(run) {
    const stage = run.stage;
    const relay = stage.relays[stage.activeIndex];
    if (!relay) {
      run.objectiveLabel = "All relays stabilized";
      run.objectiveProgress = 1;
      run.objectiveDetail = "Prepare for the rail push.";
      return;
    }
    if (!relay.started) {
      run.objectiveLabel = `Wake relay ${stage.activeIndex + 1} of ${stage.relays.length}`;
      run.objectiveProgress = relay.interact;
      run.objectiveDetail = "Step into the ring and hold E to start the lattice.";
    } else {
      run.objectiveLabel = `Hold relay ${stage.activeIndex + 1} of ${stage.relays.length}`;
      run.objectiveProgress = relay.progress;
      run.objectiveDetail = "Stay inside the objective ring while it stabilizes.";
    }
  }

  function updateRailObjective(run) {
    const stage = run.stage;
    const cart = stage.cart;
    if (stage.phase === "patch" && stage.currentCheckpoint) {
      run.objectiveLabel = `Patch rail ${stage.checkpointCount + 1} of 3`;
      run.objectiveProgress = stage.patchProgress;
      run.objectiveDetail = "Hold E at the junction while the cart shields cool.";
      return;
    }
    if (stage.phase === "moving") {
      const target = stage.route[stage.cart.targetIndex] || stage.route[stage.route.length - 1];
      const segmentLen = Math.max(1, Math.hypot(target.x - cart.x, target.y - cart.y));
      const distRemaining = Math.hypot(target.x - cart.x, target.y - cart.y);
      run.objectiveLabel = `Escort cart to checkpoint ${Math.min(3, stage.checkpointCount + 1)}`;
      run.objectiveProgress = 1 - clamp(distRemaining / segmentLen, 0, 1);
      run.objectiveDetail = "Keep enemies and storm bands away from the cart.";
    }
  }

  function updateCoreObjective(run) {
    const stage = run.stage;
    if (stage.phase === "boss" && run.boss) {
      run.objectiveLabel = "Destroy Relay Warden";
      run.objectiveProgress = 1 - clamp(run.boss.hp / run.boss.maxHp, 0, 1);
      run.objectiveDetail = "Dash through pulses, punish the core, and survive the sweep.";
      return;
    }
    const stabilizer = stage.stabilizers[stage.activeIndex];
    if (!stabilizer) {
      run.objectiveLabel = "Core breach complete";
      run.objectiveProgress = 1;
      run.objectiveDetail = "Prepare for the warden.";
      return;
    }
    if (stabilizer.state === "shielded") {
      run.objectiveLabel = `Expose stabilizer ${stage.activeIndex + 1} of ${stage.stabilizers.length}`;
      run.objectiveProgress = stabilizer.charge;
      run.objectiveDetail = "Hold E inside the stabilizer ring to open its plating.";
    } else {
      run.objectiveLabel = `Destroy stabilizer ${stage.activeIndex + 1} of ${stage.stabilizers.length}`;
      run.objectiveProgress = 1 - clamp(stabilizer.hp / stabilizer.maxHp, 0, 1);
      run.objectiveDetail = "Unload fire before the shell seals shut.";
    }
  }

  function gainScore(run, amount) {
    run.score += amount * run.difficultyData.scoreMod;
  }

  function gainOverdrive(run, amount) {
    const player = run.player;
    if (!player.overdriveUnlocked) return;
    player.overdrive = clamp(player.overdrive + amount * run.assist.overdriveGain, 0, 100);
  }

  function spawnParticle(run, options) {
    run.particles.push({
      x: options.x,
      y: options.y,
      vx: options.vx || 0,
      vy: options.vy || 0,
      life: options.life || 0.5,
      maxLife: options.life || 0.5,
      size: options.size || 4,
      color: options.color || "#ffffff",
    });
  }

  function burst(run, x, y, color, amount = 12, speed = 180) {
    for (let i = 0; i < amount; i += 1) {
      const angle = (Math.PI * 2 * i) / amount + rand(-0.2, 0.2);
      const velocity = rand(speed * 0.45, speed);
      spawnParticle(run, {
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: rand(0.2, 0.55),
        size: rand(2, 5),
        color,
      });
    }
  }

  function addCameraShake(run, amount) {
    run.camera.shake = Math.max(run.camera.shake, amount * (state.settings.reduceShake ? 0.35 : 1));
  }

  function flash(run, amount) {
    run.flash = Math.max(run.flash, amount * (state.settings.reduceFlash ? 0.45 : 1));
  }

  function firePlayerWeapon(run) {
    const player = run.player;
    const baseAngle = player.aimAngle;
    const spread = player.overdriveActive > 0 ? [-0.12, 0, 0.12] : [0];
    const lowHullBoost = run.assist.lastStand && player.hp < 36 ? 1.18 : 1;
    spread.forEach((offset) => {
      const angle = baseAngle + offset;
      run.bullets.push({
        id: nextId(),
        x: player.x + Math.cos(angle) * 24,
        y: player.y + Math.sin(angle) * 24,
        vx: Math.cos(angle) * 760,
        vy: Math.sin(angle) * 760,
        radius: 4,
        damage: 20 * run.difficultyData.playerDamage * lowHullBoost * (run.assist.piercing ? 1.08 : 1),
        life: 1.3,
        pierce: run.assist.piercing,
        chainReady: run.assist.chain,
      });
    });
    player.shootCooldown = player.overdriveActive > 0 ? 0.12 : 0.18;
    player.heat += 12 * run.difficultyData.heatGain * (player.overdriveActive > 0 ? 0.76 : 1);
    if (player.heat >= player.heatMax) {
      player.overheated = true;
      showToast("Weapon core overheated.");
      audio.play("warn");
    }
    audio.play("shoot", Math.cos(baseAngle) * 0.25);
    run.camera.kickX += Math.cos(baseAngle) * -2;
    run.camera.kickY += Math.sin(baseAngle) * -2;
  }

  function spawnEnemy(run, type, x, y) {
    const base = config.enemyStats[type];
    if (!base) return;
    run.enemies.push({
      id: nextId(),
      type,
      x,
      y,
      radius: base.radius,
      hp: base.hp * run.difficultyData.enemyHp,
      maxHp: base.hp * run.difficultyData.enemyHp,
      speed: base.speed,
      contact: base.contact * run.difficultyData.enemyDamage,
      score: base.score,
      attackCooldown: rand(0.4, 1.4),
      hitFlash: 0,
      targetBias: run.chapterId === "rail" && Math.random() < 0.55 ? "cart" : "player",
      state: "idle",
      cast: 0,
      dash: 0,
      aimAngle: 0,
      beamCharge: 0,
      beamActive: 0,
      beamAngle: 0,
      beamAngleStart: 0,
      beamAngleEnd: 0,
      beamDamageLock: 0,
    });
  }

  function spawnEnemyAround(run, focusX, focusY, types) {
    const angle = rand(0, Math.PI * 2);
    const radius = rand(360, 520);
    const x = clamp(focusX + Math.cos(angle) * radius, 70, WORLD_WIDTH - 70);
    const y = clamp(focusY + Math.sin(angle) * radius, 70, WORLD_HEIGHT - 70);
    spawnEnemy(run, pick(types), x, y);
  }

  function spawnMortar(run, x, y, radius, damage) {
    run.hazards.push({
      id: nextId(),
      type: "mortar",
      x,
      y,
      radius,
      damage,
      warn: 1.05,
      blast: 0.18,
      triggered: false,
      enemyHits: new Set(),
      playerHit: false,
      cartHit: false,
    });
    audio.play("warn");
  }

  function spawnStormSweep(run) {
    const stage = run.stage;
    stage.lastStormOrientation = stage.lastStormOrientation === "vertical" ? "horizontal" : "vertical";
    const orientation = stage.lastStormOrientation;
    const start = orientation === "vertical" ? rand(0, WORLD_WIDTH) : rand(0, WORLD_HEIGHT);
    const end = orientation === "vertical" ? WORLD_WIDTH - start : WORLD_HEIGHT - start;
    run.hazards.push({
      id: nextId(),
      type: "storm",
      orientation,
      start,
      end,
      warn: 1.1,
      active: 4.2,
      width: 88,
      enemyHits: new Set(),
      playerHit: false,
      cartHit: false,
    });
    showToast("Storm sweep incoming.");
    audio.play("warn");
  }

  function spawnBlackoutPulse(run, x, y, radius) {
    run.hazards.push({
      id: nextId(),
      type: "pulse",
      x,
      y,
      radius,
      warn: 0.9,
      active: 1.7,
      thickness: 42,
      enemyHits: new Set(),
      playerHit: false,
      cartHit: false,
    });
    audio.play("threat");
  }

  function damageEnemy(run, enemy, amount) {
    if (enemy.hp <= 0) return true;
    enemy.hp -= amount;
    enemy.hitFlash = 0.16;
    run.stats.damageDealt += amount;
    gainOverdrive(run, amount * 0.18);
    if (enemy.hp <= 0) {
      killEnemy(run, enemy);
      return true;
    }
    return false;
  }

  function chainArc(run, sourceEnemy, damage) {
    const candidates = run.enemies
      .filter((enemy) => enemy.id !== sourceEnemy.id && enemy.hp > 0)
      .map((enemy) => ({ enemy, d: distance(enemy, sourceEnemy) }))
      .filter((item) => item.d < 150)
      .sort((a, b) => a.d - b.d);
    if (!candidates.length) return;
    const target = candidates[0].enemy;
    damageEnemy(run, target, damage);
    burst(run, target.x, target.y, "#8ef7ff", 7, 120);
  }

  function killEnemy(run, enemy) {
    gainScore(run, enemy.score);
    run.kills += 1;
    if (run.assist.barrierBloom && (enemy.type === "sentry" || enemy.type === "lancer")) {
      run.player.barrier = Math.min(run.player.maxBarrier, run.player.barrier + 10);
    }
    gainOverdrive(run, 6);
    burst(run, enemy.x, enemy.y, enemy.type === "sentry" ? "#48d8ff" : "#ffbd55", 12, 220);
    addCameraShake(run, 4);
    audio.play("hit", (enemy.x - run.player.x) / 500);
  }

  function dealDamageToPlayer(run, amount, sourceX, sourceY) {
    const player = run.player;
    if (player.invuln > 0 || run.result) return;
    let remaining = amount;
    if (player.barrier > 0) {
      const absorbed = Math.min(player.barrier, remaining);
      player.barrier -= absorbed;
      remaining -= absorbed;
    }
    if (remaining > 0) {
      player.hp -= remaining;
    }
    player.damageDelay = 2.1;
    player.hitFlash = 0.25;
    addCameraShake(run, 9);
    flash(run, 0.26);
    run.stats.damageTaken += amount;
    if (sourceX != null && sourceY != null) {
      run.damageIndicators.push({
        angle: Math.atan2(sourceY - player.y, sourceX - player.x),
        life: 0.9,
        maxLife: 0.9,
      });
    }
    audio.play("hit", sourceX != null ? clamp((sourceX - player.x) / 400, -1, 1) : 0);
    if (player.hp > 0 && player.hp <= 28 && player.repairCharges > 0) {
      showToast("Hull critical. Press R to spend a repair charge.", 2.2, "high");
    }
    if (player.hp <= 0) {
      endRun(run, false, "The relay chain collapsed before the core re-lit.");
    }
  }

  function dealDamageToCart(run, amount) {
    const cart = run.stage && run.stage.cart;
    if (!cart || run.result) return;
    cart.hp -= amount;
    addCameraShake(run, 7);
    flash(run, 0.18);
    if (cart.hp <= 0) {
      endRun(run, false, "The signal cart was torn apart on the rail line.");
    }
  }

  function useRepair(run) {
    const player = run.player;
    if (player.repairCharges <= 0) return;
    if (player.hp >= player.maxHp && player.barrier >= player.maxBarrier) return;
    player.repairCharges -= 1;
    player.hp = Math.min(player.maxHp, player.hp + 34);
    player.barrier = Math.min(player.maxBarrier, player.barrier + 26);
    player.invuln = 0.65;
    player.repairFlash = 0.7;
    gainOverdrive(run, 10);
    burst(run, player.x, player.y, "#98ffbd", 18, 180);
    showToast("Emergency repair cycle complete.");
    audio.play("reward");
  }

  function activateOverdrive(run) {
    const player = run.player;
    if (!player.overdriveUnlocked || player.overdrive < 100 || player.overdriveActive > 0) return;
    player.overdrive = 0;
    player.overdriveActive = config.overdriveDuration + (run.assist.overdriveExtended ? 2.4 : 0);
    player.invuln = Math.max(player.invuln, 0.3);
    flash(run, 0.18);
    burst(run, player.x, player.y, "#9d71ff", 16, 210);
    showToast("Overdrive engaged.");
    audio.play("clear");
  }

  function calculateAim(run) {
    const camera = run.camera;
    const rect = dom.canvas.getBoundingClientRect();
    const scaleX = config.width / rect.width;
    const scaleY = config.height / rect.height;
    const screenX = clamp(state.input.mouse.x * scaleX, 0, config.width);
    const screenY = clamp(state.input.mouse.y * scaleY, 0, config.height);
    return {
      x: screenX + camera.x,
      y: screenY + camera.y,
    };
  }

  function updatePlayer(run, dt) {
    const player = run.player;
    const input = state.input;
    const aim = calculateAim(run);
    player.aimAngle = Math.atan2(aim.y - player.y, aim.x - player.x);
    player.shootCooldown = Math.max(0, player.shootCooldown - dt);
    player.dashCooldown = Math.max(0, player.dashCooldown - dt);
    player.invuln = Math.max(0, player.invuln - dt);
    player.damageDelay = Math.max(0, player.damageDelay - dt);
    player.repairFlash = Math.max(0, player.repairFlash - dt);
    player.hitFlash = Math.max(0, player.hitFlash - dt);
    if (player.overdriveActive > 0) {
      player.overdriveActive = Math.max(0, player.overdriveActive - dt);
    }

    const cooling = (player.overheated ? 32 : 22) * run.assist.cooling;
    player.heat = Math.max(0, player.heat - cooling * dt);
    if (player.overheated && player.heat < 42) {
      player.overheated = false;
    }

    if (player.damageDelay <= 0 && player.barrier < player.maxBarrier) {
      player.barrier = Math.min(player.maxBarrier, player.barrier + 10 * run.difficultyData.barrierRegen * dt);
    }

    if (pressed("KeyR")) {
      useRepair(run);
    }
    if (pressed("KeyQ")) {
      activateOverdrive(run);
    }

    let moveX = 0;
    let moveY = 0;
    if (down("KeyW") || down("ArrowUp")) moveY -= 1;
    if (down("KeyS") || down("ArrowDown")) moveY += 1;
    if (down("KeyA") || down("ArrowLeft")) moveX -= 1;
    if (down("KeyD") || down("ArrowRight")) moveX += 1;
    if (moveX !== 0 || moveY !== 0) {
      const n = normalize(moveX, moveY);
      moveX = n.x;
      moveY = n.y;
    }

    const lowHullBoost = run.assist.lastStand && player.hp < 36 ? 1.22 : 1;
    const dashAvailable = player.dashCooldown <= 0 && player.dashTime <= 0;
    if (pressed("Space") && dashAvailable && (moveX !== 0 || moveY !== 0)) {
      player.dashTime = 0.2;
      player.dashCooldown = Math.max(2.9, player.dashMax - (run.assist.dashShield ? 0.5 : 0));
      player.dashDirX = moveX;
      player.dashDirY = moveY;
      player.invuln = Math.max(player.invuln, run.assist.dashShield ? 0.34 : 0.26);
      if (run.assist.dashShield) {
        player.barrier = Math.min(player.maxBarrier, player.barrier + 16);
      }
      burst(run, player.x, player.y, "#48d8ff", 10, 170);
      addCameraShake(run, 7);
      audio.play("dash", Math.cos(player.aimAngle) * 0.25);
    }

    if (player.dashTime > 0) {
      player.dashTime = Math.max(0, player.dashTime - dt);
      player.x += player.dashDirX * 640 * dt;
      player.y += player.dashDirY * 640 * dt;
    } else {
      player.x += moveX * player.speed * lowHullBoost * dt;
      player.y += moveY * player.speed * lowHullBoost * dt;
    }

    player.x = clamp(player.x, 20, WORLD_WIDTH - 20);
    player.y = clamp(player.y, 20, WORLD_HEIGHT - 20);

    if (input.mouse.down && player.shootCooldown <= 0 && !player.overheated) {
      firePlayerWeapon(run);
    }
  }

  function pickTarget(run, enemy) {
    if (run.chapterId === "rail" && run.stage && run.stage.cart && run.stage.cart.hp > 0 && enemy.targetBias === "cart") {
      return run.stage.cart;
    }
    return run.player;
  }

  function spawnEnemyShot(run, x, y, angle, speed, damage, life = 2.5, radius = 5) {
    run.enemyBullets.push({
      id: nextId(),
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius,
      damage,
      life,
    });
  }

  function pointToSegmentDistance(point, start, end) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lenSq = dx * dx + dy * dy || 1;
    const t = clamp(((point.x - start.x) * dx + (point.y - start.y) * dy) / lenSq, 0, 1);
    const px = start.x + dx * t;
    const py = start.y + dy * t;
    return Math.hypot(point.x - px, point.y - py);
  }

  function dealBeamDamage(run, origin, angle, length, width, damage) {
    const player = run.player;
    const end = {
      x: origin.x + Math.cos(angle) * length,
      y: origin.y + Math.sin(angle) * length,
    };
    if (pointToSegmentDistance(player, origin, end) < width && player.invuln <= 0) {
      dealDamageToPlayer(run, damage, origin.x, origin.y);
    }
    const cart = run.stage && run.stage.cart;
    if (cart && cart.hp > 0 && pointToSegmentDistance(cart, origin, end) < width) {
      dealDamageToCart(run, damage * 0.9);
    }
  }

  function updateEnemy(run, enemy, dt) {
    enemy.attackCooldown = Math.max(0, enemy.attackCooldown - dt);
    enemy.hitFlash = Math.max(0, enemy.hitFlash - dt);
    enemy.beamDamageLock = Math.max(0, enemy.beamDamageLock - dt);

    const target = pickTarget(run, enemy);
    const angle = angleTo(enemy, target);
    enemy.aimAngle = angle;

    if (enemy.type === "scrapper") {
      const dir = normalize(target.x - enemy.x, target.y - enemy.y);
      enemy.x += dir.x * enemy.speed * dt;
      enemy.y += dir.y * enemy.speed * dt;
      if (distance(enemy, target) < enemy.radius + target.radius + 6 && enemy.attackCooldown <= 0) {
        if (target === run.player) {
          dealDamageToPlayer(run, enemy.contact, enemy.x, enemy.y);
        } else {
          dealDamageToCart(run, enemy.contact);
        }
        enemy.attackCooldown = 0.85;
      }
    } else if (enemy.type === "lancer") {
      if (enemy.state === "idle") {
        const dir = normalize(target.x - enemy.x, target.y - enemy.y);
        enemy.x += dir.x * enemy.speed * dt;
        enemy.y += dir.y * enemy.speed * dt;
        if (distance(enemy, target) < 250 && enemy.attackCooldown <= 0) {
          enemy.state = "cast";
          enemy.cast = 0.82;
          enemy.dashAngle = angle;
          audio.play("warn", clamp((enemy.x - run.player.x) / 400, -1, 1));
        }
      } else if (enemy.state === "cast") {
        enemy.cast -= dt;
        if (enemy.cast <= 0) {
          enemy.state = "dash";
          enemy.dash = 0.42;
        }
      } else if (enemy.state === "dash") {
        enemy.dash -= dt;
        enemy.x += Math.cos(enemy.dashAngle) * 560 * dt;
        enemy.y += Math.sin(enemy.dashAngle) * 560 * dt;
        if (distance(enemy, target) < enemy.radius + target.radius + 6 && enemy.attackCooldown <= 0) {
          if (target === run.player) {
            dealDamageToPlayer(run, enemy.contact, enemy.x, enemy.y);
          } else {
            dealDamageToCart(run, enemy.contact);
          }
          enemy.attackCooldown = 1.6;
        }
        if (enemy.dash <= 0) {
          enemy.state = "idle";
          enemy.attackCooldown = 2.4;
        }
      }
    } else if (enemy.type === "wasp") {
      const dist = distance(enemy, target);
      let move = { x: 0, y: 0 };
      if (dist > 300) {
        move = normalize(target.x - enemy.x, target.y - enemy.y);
      } else if (dist < 220) {
        move = normalize(enemy.x - target.x, enemy.y - target.y);
      } else {
        move = { x: Math.cos(angle + Math.PI / 2), y: Math.sin(angle + Math.PI / 2) };
      }
      enemy.x += move.x * enemy.speed * dt;
      enemy.y += move.y * enemy.speed * dt;
      if (enemy.attackCooldown <= 0) {
        spawnMortar(run, target.x, target.y, 72, enemy.contact + 4);
        enemy.attackCooldown = 2.6;
      }
    } else if (enemy.type === "sentry") {
      const orbit = {
        x: target.x + Math.cos(state.backgroundTime + enemy.id) * 80,
        y: target.y + Math.sin(state.backgroundTime * 1.1 + enemy.id * 0.5) * 70,
      };
      const dir = normalize(orbit.x - enemy.x, orbit.y - enemy.y);
      enemy.x += dir.x * enemy.speed * dt;
      enemy.y += dir.y * enemy.speed * dt;
      if (enemy.beamCharge <= 0 && enemy.beamActive <= 0 && enemy.attackCooldown <= 0) {
        enemy.beamCharge = 1.05;
        enemy.beamAngleStart = angle - 0.65;
        enemy.beamAngleEnd = angle + 0.65;
        audio.play("warn", clamp((enemy.x - run.player.x) / 400, -1, 1));
      }
      if (enemy.beamCharge > 0) {
        enemy.beamCharge -= dt;
        enemy.beamAngle = lerp(enemy.beamAngleStart, enemy.beamAngleEnd, 1 - enemy.beamCharge / 1.05);
        if (enemy.beamCharge <= 0) {
          enemy.beamActive = 1.45;
          enemy.attackCooldown = 4.8;
        }
      } else if (enemy.beamActive > 0) {
        enemy.beamActive -= dt;
        const t = 1 - enemy.beamActive / 1.45;
        enemy.beamAngle = lerp(enemy.beamAngleStart, enemy.beamAngleEnd, smoothstep(t));
        if (enemy.beamDamageLock <= 0) {
          dealBeamDamage(run, enemy, enemy.beamAngle, 620, 22, enemy.contact * 0.8);
          enemy.beamDamageLock = 0.18;
        }
      }
    }

    enemy.x = clamp(enemy.x, 20, WORLD_WIDTH - 20);
    enemy.y = clamp(enemy.y, 20, WORLD_HEIGHT - 20);
  }

  function updateBoss(run, dt) {
    const boss = run.boss;
    if (!boss) return;
    boss.hitFlash = Math.max(0, boss.hitFlash - dt);
    const phase = boss.hp / boss.maxHp > 0.66 ? 1 : boss.hp / boss.maxHp > 0.33 ? 2 : 3;
    boss.moveTimer -= dt;
    if (boss.moveTimer <= 0) {
      boss.anchorIndex = (boss.anchorIndex + 1) % boss.anchors.length;
      boss.moveTimer = phase === 3 ? 2.4 : 3.5;
    }
    const anchor = boss.anchors[boss.anchorIndex];
    boss.x = lerp(boss.x, anchor.x, dt * 1.6);
    boss.y = lerp(boss.y, anchor.y, dt * 1.6);
    boss.boltTimer -= dt;
    boss.beamTimer -= dt;
    boss.summonTimer -= dt;

    if (boss.boltTimer <= 0) {
      const count = phase === 1 ? 5 : phase === 2 ? 7 : 9;
      const spread = phase === 1 ? 0.44 : 0.7;
      const baseAngle = angleTo(boss, run.player);
      for (let i = 0; i < count; i += 1) {
        const offset = lerp(-spread, spread, count === 1 ? 0.5 : i / (count - 1));
        spawnEnemyShot(run, boss.x, boss.y, baseAngle + offset, 290 + phase * 34, 10 * run.difficultyData.enemyDamage, 3.4, 5);
      }
      boss.boltTimer = phase === 3 ? 0.92 : phase === 2 ? 1.18 : 1.45;
      audio.play("threat");
    }

    if (boss.beamCharge > 0) {
      boss.beamCharge -= dt;
      boss.beamAngle = lerp(boss.beamAngleStart, boss.beamAngleEnd, 1 - boss.beamCharge / 1.15);
      if (boss.beamCharge <= 0) {
        boss.beamActive = phase === 3 ? 1.95 : 1.45;
      }
    } else if (boss.beamActive > 0) {
      boss.beamActive -= dt;
      const t = 1 - boss.beamActive / (phase === 3 ? 1.95 : 1.45);
      boss.beamAngle = lerp(boss.beamAngleStart, boss.beamAngleEnd, smoothstep(t));
      dealBeamDamage(run, boss, boss.beamAngle, 760, 28, 12 * run.difficultyData.enemyDamage);
    } else if (boss.beamTimer <= 0) {
      const aim = angleTo(boss, run.player);
      boss.beamCharge = 1.15;
      boss.beamTimer = phase === 3 ? 4.4 : 6.6;
      boss.beamAngleStart = aim - 0.9;
      boss.beamAngleEnd = aim + 0.9;
      audio.play("warn");
    }

    if (phase >= 2 && boss.summonTimer <= 0) {
      const focus = boss.hp / boss.maxHp > 0.33 ? ["scrapper", "lancer"] : ["lancer", "wasp", "sentry"];
      spawnEnemyAround(run, boss.x, boss.y, focus);
      spawnEnemyAround(run, boss.x, boss.y, focus);
      if (phase === 3) {
        spawnEnemyAround(run, boss.x, boss.y, ["scrapper", "wasp"]);
      }
      boss.summonTimer = phase === 3 ? 8 : 10.5;
    }

    run.stage.pulseTimer -= dt;
    if (run.stage.pulseTimer <= 0) {
      run.stage.pulseTimer = phase === 3 ? 9 : 12;
      spawnBlackoutPulse(run, boss.x, boss.y, 720);
    }
  }

  function updateBullets(run, dt) {
    run.bullets.forEach((bullet) => {
      bullet.x += bullet.vx * dt;
      bullet.y += bullet.vy * dt;
      bullet.life -= dt;
    });
    run.enemyBullets.forEach((bullet) => {
      bullet.x += bullet.vx * dt;
      bullet.y += bullet.vy * dt;
      bullet.life -= dt;
    });
    run.bullets = run.bullets.filter((bullet) => bullet.life > 0 && bullet.x > -50 && bullet.x < WORLD_WIDTH + 50 && bullet.y > -50 && bullet.y < WORLD_HEIGHT + 50);
    run.enemyBullets = run.enemyBullets.filter((bullet) => bullet.life > 0 && bullet.x > -50 && bullet.x < WORLD_WIDTH + 50 && bullet.y > -50 && bullet.y < WORLD_HEIGHT + 50);
  }

  function updateParticles(run, dt) {
    run.particles.forEach((particle) => {
      particle.life -= dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vx *= 0.96;
      particle.vy *= 0.96;
    });
    run.particles = run.particles.filter((particle) => particle.life > 0);
  }

  function updateHazards(run, dt) {
    const survivors = [];
    run.hazards.forEach((hazard) => {
      if (hazard.type === "mortar") {
        hazard.warn -= dt;
        if (hazard.warn <= 0 && !hazard.triggered) {
          hazard.triggered = true;
          burst(run, hazard.x, hazard.y, "#ffbd55", 18, 240);
          if (!hazard.playerHit && distance(run.player, hazard) < hazard.radius + run.player.radius) {
            dealDamageToPlayer(run, hazard.damage, hazard.x, hazard.y);
            hazard.playerHit = true;
          }
          const cart = run.stage && run.stage.cart;
          if (cart && !hazard.cartHit && distance(cart, hazard) < hazard.radius + cart.radius) {
            dealDamageToCart(run, hazard.damage * 0.9);
            hazard.cartHit = true;
          }
          run.enemies.forEach((enemy) => {
            if (!hazard.enemyHits.has(enemy.id) && distance(enemy, hazard) < hazard.radius + enemy.radius) {
              hazard.enemyHits.add(enemy.id);
              damageEnemy(run, enemy, hazard.damage * 0.45);
            }
          });
          flash(run, 0.18);
          addCameraShake(run, 8);
          audio.play("threat");
        }
        if (hazard.triggered) {
          hazard.blast -= dt;
        }
        if (hazard.warn + hazard.blast > 0) {
          survivors.push(hazard);
        }
      } else if (hazard.type === "storm") {
        if (hazard.warn > 0) {
          hazard.warn -= dt;
        } else {
          hazard.active -= dt;
          const progress = 1 - clamp(hazard.active / 4.2, 0, 1);
          const band = lerp(hazard.start, hazard.end, progress);
          const playerCoord = hazard.orientation === "vertical" ? run.player.x : run.player.y;
          if (!hazard.playerHit && Math.abs(playerCoord - band) < hazard.width) {
            dealDamageToPlayer(run, 18 * run.difficultyData.enemyDamage, run.player.x, run.player.y);
            hazard.playerHit = true;
          }
          const cart = run.stage && run.stage.cart;
          if (cart && !hazard.cartHit) {
            const cartCoord = hazard.orientation === "vertical" ? cart.x : cart.y;
            if (Math.abs(cartCoord - band) < hazard.width) {
              dealDamageToCart(run, 18 * run.difficultyData.enemyDamage);
              hazard.cartHit = true;
            }
          }
          run.enemies.forEach((enemy) => {
            if (hazard.enemyHits.has(enemy.id)) return;
            const enemyCoord = hazard.orientation === "vertical" ? enemy.x : enemy.y;
            if (Math.abs(enemyCoord - band) < hazard.width) {
              hazard.enemyHits.add(enemy.id);
              damageEnemy(run, enemy, 26);
            }
          });
          if (hazard.active > 0) {
            survivors.push(hazard);
          }
        }
      } else if (hazard.type === "pulse") {
        if (hazard.warn > 0) {
          hazard.warn -= dt;
        } else {
          hazard.active -= dt;
          const progress = 1 - clamp(hazard.active / 1.7, 0, 1);
          const ring = progress * hazard.radius;
          if (!hazard.playerHit && Math.abs(distance(run.player, hazard) - ring) < hazard.thickness) {
            dealDamageToPlayer(run, 16 * run.difficultyData.enemyDamage, hazard.x, hazard.y);
            hazard.playerHit = true;
          }
          const cart = run.stage && run.stage.cart;
          if (cart && !hazard.cartHit && Math.abs(distance(cart, hazard) - ring) < hazard.thickness) {
            dealDamageToCart(run, 13 * run.difficultyData.enemyDamage);
            hazard.cartHit = true;
          }
          run.enemies.forEach((enemy) => {
            if (hazard.enemyHits.has(enemy.id)) return;
            if (Math.abs(distance(enemy, hazard) - ring) < hazard.thickness) {
              hazard.enemyHits.add(enemy.id);
              damageEnemy(run, enemy, 18);
            }
          });
          if (hazard.active > 0) {
            survivors.push(hazard);
          }
        }
      }
    });
    run.hazards = survivors;
  }

  function handleBulletHits(run) {
    const playerBullets = [];
    run.bullets.forEach((bullet) => {
      let alive = true;

      if (run.boss && alive && distance(bullet, run.boss) < bullet.radius + run.boss.radius) {
        run.boss.hp -= bullet.damage;
        run.boss.hitFlash = 0.16;
        run.stats.damageDealt += bullet.damage;
        gainOverdrive(run, bullet.damage * 0.16);
        burst(run, bullet.x, bullet.y, "#ff5f78", 7, 120);
        if (run.boss.hp <= 0) {
          burst(run, run.boss.x, run.boss.y, "#ffbd55", 48, 320);
          gainScore(run, config.enemyStats.warden.score);
          run.boss = null;
          endRun(run, true, "The core flared back to life.");
          return;
        }
        bullet.pierce -= 1;
        if (bullet.chainReady) {
          chainArc(run, { ...run.boss, id: -1 }, bullet.damage * 0.33);
          bullet.chainReady = false;
        }
        if (bullet.pierce < 0) alive = false;
      }

      if (run.stage && run.stage.id === "core" && run.stage.phase === "stabilizers") {
        const stabilizer = run.stage.stabilizers[run.stage.activeIndex];
        if (stabilizer && stabilizer.state === "exposed" && !stabilizer.destroyed && alive && distance(bullet, stabilizer) < bullet.radius + stabilizer.radius) {
          stabilizer.hp -= bullet.damage;
          burst(run, bullet.x, bullet.y, "#ff5f78", 7, 120);
          run.stats.damageDealt += bullet.damage;
          gainOverdrive(run, bullet.damage * 0.12);
          bullet.pierce -= 1;
          if (stabilizer.hp <= 0) {
            stabilizer.destroyed = true;
            stabilizer.state = "destroyed";
            gainScore(run, 180);
            if (run.assist.barrierBloom) {
              run.player.barrier = Math.min(run.player.maxBarrier, run.player.barrier + 16);
            }
            burst(run, stabilizer.x, stabilizer.y, "#9d71ff", 28, 280);
            addCameraShake(run, 10);
            audio.play("clear");
            run.stage.activeIndex += 1;
            updateCoreObjective(run);
            if (run.stage.activeIndex >= run.stage.stabilizers.length) {
              offerUpgrade(run, "Sync a final perk before the warden phase", () => {
                beginBoss(run);
              });
            } else {
            showToast(`Stabilizer ${run.stage.activeIndex + 1} is next. Advance to the next shell.`);
            }
          }
          if (bullet.pierce < 0) alive = false;
        }
      }

      run.enemies.forEach((enemy) => {
        if (!alive) return;
        if (distance(bullet, enemy) < bullet.radius + enemy.radius) {
          const dead = damageEnemy(run, enemy, bullet.damage);
          burst(run, bullet.x, bullet.y, enemy.type === "sentry" ? "#48d8ff" : "#ffbd55", 6, 90);
          if (!dead && bullet.chainReady) {
            chainArc(run, enemy, bullet.damage * 0.33);
            bullet.chainReady = false;
          }
          bullet.pierce -= 1;
          if (bullet.pierce < 0) alive = false;
        }
      });

      if (alive) playerBullets.push(bullet);
    });
    run.bullets = playerBullets;

    const enemyBullets = [];
    run.enemyBullets.forEach((bullet) => {
      let alive = true;
      if (distance(bullet, run.player) < bullet.radius + run.player.radius) {
        dealDamageToPlayer(run, bullet.damage, bullet.x, bullet.y);
        alive = false;
      }
      const cart = run.stage && run.stage.cart;
      if (alive && cart && distance(bullet, cart) < bullet.radius + cart.radius) {
        dealDamageToCart(run, bullet.damage);
        alive = false;
      }
      if (alive) enemyBullets.push(bullet);
    });
    run.enemyBullets = enemyBullets;
  }

  function removeDeadEnemies(run) {
    run.enemies = run.enemies.filter((enemy) => enemy.hp > 0);
  }

  function interactHeld() {
    return down("KeyE");
  }

  function handleFoundry(run, dt) {
    const stage = run.stage;
    const relay = stage.relays[stage.activeIndex];
    if (!relay) return;
    const player = run.player;
    const inRange = distance(player, relay) < config.interactionRadius;
    const inObjective = distance(player, relay) < config.objectiveRadius;

    stage.spawnTimer -= dt;
    if (stage.spawnTimer <= 0) {
      const cap = 5 + stage.activeIndex * 2;
      if (run.enemies.length < cap) {
        const types = stage.activeIndex === 0 ? ["scrapper"] : stage.activeIndex === 1 ? ["scrapper", "lancer"] : ["scrapper", "lancer", "wasp"];
        spawnEnemyAround(run, relay.x, relay.y, types);
      }
      stage.spawnTimer = Math.max(0.85, 1.65 - stage.activeIndex * 0.16);
    }

    if (!relay.started) {
      if (inRange && interactHeld()) {
        relay.interact = clamp(relay.interact + dt * 1.8 * run.assist.interactionSpeed, 0, 1);
        if (relay.interact >= 1) {
          relay.started = true;
          showToast("Relay lattice engaged. Hold the ring.");
          audio.play("clear");
        }
      } else {
        relay.interact = Math.max(0, relay.interact - dt * 1.1);
      }
    } else if (!relay.complete && inObjective) {
      relay.progress = clamp(relay.progress + (dt / relay.duration) * run.assist.interactionSpeed, 0, 1);
      if (relay.progress >= 1) {
        relay.complete = true;
        gainScore(run, 120);
        gainOverdrive(run, 28);
        if (run.assist.barrierBloom) {
          run.player.barrier = Math.min(run.player.maxBarrier, run.player.barrier + 18);
        }
        burst(run, relay.x, relay.y, "#ffbd55", 22, 240);
        stage.activeIndex += 1;
        updateFoundryObjective(run);
        audio.play("clear");
        if (stage.activeIndex >= stage.relays.length) {
          offerUpgrade(run, "Synchronize a relay perk", () => {
            beginChapterRail(run);
          });
        } else {
          showToast(`Relay ${stage.activeIndex} stabilized. Move to the next amber ring.`);
        }
      }
    }

    updateFoundryObjective(run);
  }

  function advanceCart(stage, dt) {
    const cart = stage.cart;
    const target = stage.route[cart.targetIndex];
    if (!target) return;
    const dx = target.x - cart.x;
    const dy = target.y - cart.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 4) {
      cart.x = target.x;
      cart.y = target.y;
      if (target.checkpoint && !target.cleared) {
        stage.phase = "patch";
        stage.currentCheckpoint = target;
        stage.patchProgress = 0;
        return;
      }
      cart.targetIndex += 1;
      return;
    }
    const dir = normalize(dx, dy);
    cart.x += dir.x * cart.speed * dt;
    cart.y += dir.y * cart.speed * dt;
  }

  function handleRail(run, dt) {
    const stage = run.stage;
    const cart = stage.cart;

    stage.spawnTimer -= dt;
    stage.stormTimer -= dt;
    if (stage.stormTimer <= 0) {
      stage.stormTimer = 19;
      spawnStormSweep(run);
    }
    if (stage.spawnTimer <= 0) {
      const focusX = stage.phase === "patch" && stage.currentCheckpoint ? stage.currentCheckpoint.x : cart.x;
      const focusY = stage.phase === "patch" && stage.currentCheckpoint ? stage.currentCheckpoint.y : cart.y;
      const cap = stage.phase === "patch" ? 10 : 7;
      if (run.enemies.length < cap) {
        const types = stage.checkpointCount === 0 ? ["scrapper", "wasp"] : stage.checkpointCount === 1 ? ["scrapper", "wasp", "lancer"] : ["wasp", "lancer", "sentry"];
        spawnEnemyAround(run, focusX, focusY, types);
      }
      stage.spawnTimer = stage.phase === "patch" ? 0.85 : 1.2;
    }

    if (stage.phase === "moving") {
      advanceCart(stage, dt);
    } else if (stage.phase === "patch" && stage.currentCheckpoint) {
      const cp = stage.currentCheckpoint;
      if (distance(run.player, cp) < config.interactionRadius && interactHeld()) {
        stage.patchProgress = clamp(stage.patchProgress + (dt / cp.patchDuration) * run.assist.interactionSpeed, 0, 1);
      }
      if (stage.patchProgress >= 1) {
        cp.cleared = true;
        stage.phase = "moving";
        stage.checkpointCount += 1;
        cart.hp = Math.min(cart.maxHp, cart.hp + 42);
        if (stage.checkpointCount === 1) {
          run.player.overdriveUnlocked = true;
          gainOverdrive(run, 100);
          showBanner("Overdrive Unlocked", "Trigger it with Q when the lattice is full.");
          showToast("First junction clear. Overdrive is online.");
          audio.play("clear");
        } else if (stage.checkpointCount === 2) {
          offerUpgrade(run, "Synchronize a convoy perk", () => {
            stage.currentCheckpoint = null;
            cart.targetIndex += 1;
            updateRailObjective(run);
          });
          return;
        } else if (stage.checkpointCount >= 3) {
          beginChapterCore(run);
          return;
        }
        stage.currentCheckpoint = null;
        cart.targetIndex += 1;
      }
    }

    updateRailObjective(run);
  }

  function handleCore(run, dt) {
    const stage = run.stage;
    if (stage.phase === "stabilizers") {
      const stabilizer = stage.stabilizers[stage.activeIndex];
      stage.spawnTimer -= dt;
      stage.pulseTimer -= dt;
      if (stage.pulseTimer <= 0) {
        stage.pulseTimer = 16;
        spawnBlackoutPulse(run, 1940, 570, 780);
      }
      if (stage.spawnTimer <= 0) {
        if (run.enemies.length < 8 && stabilizer) {
          const types = stage.activeIndex === 0 ? ["scrapper", "wasp"] : stage.activeIndex === 1 ? ["lancer", "wasp", "sentry"] : ["lancer", "sentry", "wasp"];
          spawnEnemyAround(run, stabilizer.x, stabilizer.y, types);
        }
        stage.spawnTimer = 1;
      }
      if (stabilizer) {
        const playerInRange = distance(run.player, stabilizer) < config.interactionRadius;
        if (stabilizer.state === "shielded") {
          if (playerInRange && interactHeld()) {
            stabilizer.charge = clamp(stabilizer.charge + dt * 0.9 * run.assist.interactionSpeed, 0, 1);
          }
          if (stabilizer.charge >= 1) {
            stabilizer.state = "exposed";
            stabilizer.exposed = config.stabilizerExposeDuration;
            showToast("Plating open. Fire into the core shell.");
            audio.play("warn");
          }
        } else if (stabilizer.state === "exposed") {
          stabilizer.exposed -= dt;
          if (stabilizer.exposed <= 0) {
            stabilizer.state = "shielded";
            stabilizer.charge = 0;
          }
        }
      }
      updateCoreObjective(run);
    } else if (stage.phase === "boss") {
      updateBoss(run, dt);
      stage.spawnTimer -= dt;
      if (stage.spawnTimer <= 0 && run.boss) {
        spawnEnemyAround(run, run.boss.x, run.boss.y, run.boss.hp / run.boss.maxHp > 0.33 ? ["scrapper", "lancer"] : ["lancer", "wasp", "sentry"]);
        stage.spawnTimer = run.boss.hp / run.boss.maxHp > 0.33 ? 7.5 : 6;
      }
      updateCoreObjective(run);
    }
  }

  function updateChapter(run, dt) {
    if (!run.stage) return;
    if (run.stage.id === "foundry") {
      handleFoundry(run, dt);
    } else if (run.stage.id === "rail") {
      handleRail(run, dt);
    } else if (run.stage.id === "core") {
      handleCore(run, dt);
    }
  }

  function updateInteractionPrompt(run) {
    run.interactionPrompt = null;
    if (!run.stage) return;
    if (run.stage.id === "foundry") {
      const relay = run.stage.relays[run.stage.activeIndex];
      if (!relay) return;
      const dist = distance(run.player, relay);
      if (!relay.started && dist < 160) {
        run.interactionPrompt = {
          x: relay.x,
          y: relay.y - relay.radius - 32,
          text: "Hold E to wake relay",
          emphasis: "interaction",
        };
      } else if (relay.started && !relay.complete && dist < config.objectiveRadius + 32) {
        run.interactionPrompt = {
          x: relay.x,
          y: relay.y - relay.radius - 32,
          text: "Stay inside the ring",
          emphasis: "objective",
        };
      }
    } else if (run.stage.id === "rail") {
      if (run.stage.phase === "patch" && run.stage.currentCheckpoint && distance(run.player, run.stage.currentCheckpoint) < 160) {
        run.interactionPrompt = {
          x: run.stage.currentCheckpoint.x,
          y: run.stage.currentCheckpoint.y - 72,
          text: "Hold E to patch junction",
          emphasis: "interaction",
        };
      } else if (distance(run.player, run.stage.cart) > 220) {
        run.interactionPrompt = {
          x: run.stage.cart.x,
          y: run.stage.cart.y - 62,
          text: "Stay near the signal cart",
          emphasis: "warning",
        };
      }
    } else if (run.stage.id === "core" && run.stage.phase === "stabilizers") {
      const stabilizer = run.stage.stabilizers[run.stage.activeIndex];
      if (!stabilizer) return;
      const dist = distance(run.player, stabilizer);
      if (stabilizer.state === "shielded" && dist < 170) {
        run.interactionPrompt = {
          x: stabilizer.x,
          y: stabilizer.y - stabilizer.radius - 36,
          text: "Hold E to expose core",
          emphasis: "interaction",
        };
      } else if (stabilizer.state === "exposed" && dist < 220) {
        run.interactionPrompt = {
          x: stabilizer.x,
          y: stabilizer.y - stabilizer.radius - 36,
          text: "Shell open. Burst it down.",
          emphasis: "warning",
        };
      }
    }

    if (!run.interactionPrompt && run.player.overdriveUnlocked && run.player.overdrive >= 100) {
      run.interactionPrompt = {
        x: run.player.x,
        y: run.player.y - 56,
        text: "Press Q to trigger overdrive",
        emphasis: "warning",
      };
    }
  }

  function updateRun(run, dt) {
    if (run.result) return;
    run.elapsed += dt;
    run.helpTimer = Math.max(0, run.helpTimer - dt);
    updatePlayer(run, dt);
    updateChapter(run, dt);
    run.enemies.forEach((enemy) => updateEnemy(run, enemy, dt));
    updateBullets(run, dt);
    updateHazards(run, dt);
    handleBulletHits(run);
    removeDeadEnemies(run);
    updateParticles(run, dt);
    run.damageIndicators = run.damageIndicators.filter((indicator) => {
      indicator.life -= dt;
      return indicator.life > 0;
    });
    updateInteractionPrompt(run);
    updateCamera(run, dt);
    run.flash = Math.max(0, run.flash - dt * 1.9);
    run.hitStop = Math.max(0, run.hitStop - dt);
  }

  function updateCamera(run, dt) {
    const targetX = clamp(run.player.x - config.width / 2, 0, WORLD_WIDTH - config.width);
    const targetY = clamp(run.player.y - config.height / 2, 0, WORLD_HEIGHT - config.height);
    run.camera.x = lerp(run.camera.x, targetX, dt * 6);
    run.camera.y = lerp(run.camera.y, targetY, dt * 6);
    run.camera.shake = Math.max(0, run.camera.shake - dt * 22);
    run.camera.kickX *= 0.88;
    run.camera.kickY *= 0.88;
  }

  function currentPalette() {
    if (!state.run) return config.palettes.title;
    return config.palettes[state.run.chapterId] || config.palettes.title;
  }

  function worldToScreen(run, x, y) {
    const shake = run ? run.camera.shake : 0;
    const shakeX = shake > 0 ? Math.sin(state.backgroundTime * 47) * shake + (run ? run.camera.kickX : 0) : 0;
    const shakeY = shake > 0 ? Math.cos(state.backgroundTime * 38) * shake + (run ? run.camera.kickY : 0) : 0;
    return {
      x: x - (run ? run.camera.x : 0) + shakeX,
      y: y - (run ? run.camera.y : 0) + shakeY,
    };
  }

  function drawBackground(run) {
    const palette = currentPalette();
    const gradient = ctx.createLinearGradient(0, 0, 0, config.height);
    gradient.addColorStop(0, palette.bgA);
    gradient.addColorStop(1, palette.bgB);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, config.width, config.height);

    ctx.save();
    const offsetX = run ? -run.camera.x * 0.12 : 0;
    const offsetY = run ? -run.camera.y * 0.12 : 0;
    ctx.translate(offsetX, offsetY);
    ctx.strokeStyle = palette.grid;
    ctx.lineWidth = 1;
    for (let x = -200; x < config.width + 260; x += 120) {
      ctx.beginPath();
      ctx.moveTo(x + (state.backgroundTime * 16) % 120, -40);
      ctx.lineTo(x - 90 + (state.backgroundTime * 16) % 120, config.height + 120);
      ctx.stroke();
    }
    for (let y = 40; y < config.height + 80; y += 110) {
      ctx.beginPath();
      ctx.moveTo(-80, y + Math.sin(state.backgroundTime + y * 0.01) * 10);
      ctx.lineTo(config.width + 80, y - Math.sin(state.backgroundTime + y * 0.01) * 10);
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    for (let i = 0; i < 4; i += 1) {
      const x = 180 + i * 280 + Math.sin(state.backgroundTime * 0.5 + i) * 40;
      const y = 110 + i * 110;
      const r = 140 + i * 26;
      const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
      grd.addColorStop(0, palette.haze);
      grd.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawWorldDecor(run) {
    const palette = currentPalette();
    ctx.save();
    for (let i = 0; i < 18; i += 1) {
      const baseX = i * 140 + 30;
      const baseY = 620 + Math.sin(i * 0.8 + state.backgroundTime * 0.2) * 12;
      const s = worldToScreen(run, baseX, baseY);
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      ctx.fillRect(s.x, s.y, 44 + (i % 3) * 18, 200 + (i % 5) * 30);
      ctx.fillStyle = palette.grid;
      ctx.fillRect(s.x + 12, s.y + 18, 20, 2);
    }
    ctx.restore();
  }

  function drawRelays(run) {
    if (!run || run.stage.id !== "foundry") return;
    run.stage.relays.forEach((relay, index) => {
      const screen = worldToScreen(run, relay.x, relay.y);
      const active = index === run.stage.activeIndex;
      ctx.save();
      ctx.strokeStyle = relay.complete ? "rgba(152,255,189,0.8)" : active ? "rgba(255,189,85,0.92)" : "rgba(255,255,255,0.18)";
      ctx.lineWidth = active ? 3 : 2;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, relay.radius + 14 + Math.sin(state.backgroundTime * 3 + index) * 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, config.objectiveRadius, 0, Math.PI * 2);
      ctx.stroke();
      if (relay.started && !relay.complete) {
        ctx.strokeStyle = "#ffbd55";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, relay.radius + 4, -Math.PI / 2, -Math.PI / 2 + relay.progress * Math.PI * 2);
        ctx.stroke();
      }
      if (!relay.started && active) {
        ctx.strokeStyle = "#48d8ff";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, relay.radius + 4, -Math.PI / 2, -Math.PI / 2 + relay.interact * Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = relay.complete ? "#98ffbd" : active ? "#ffbd55" : "rgba(255,255,255,0.18)";
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, relay.radius - 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function drawCartAndRail(run) {
    if (!run || run.stage.id !== "rail") return;
    const stage = run.stage;
    const palette = currentPalette();
    ctx.save();
    for (let i = 1; i < stage.route.length; i += 1) {
      const a = worldToScreen(run, stage.route[i - 1].x, stage.route[i - 1].y);
      const b = worldToScreen(run, stage.route[i].x, stage.route[i].y);
      ctx.strokeStyle = "rgba(72,216,255,0.16)";
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
    stage.route.filter((node) => node.checkpoint).forEach((node, index) => {
      const s = worldToScreen(run, node.x, node.y);
      ctx.strokeStyle = node.cleared ? "#98ffbd" : "rgba(72,216,255,0.8)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 54 + Math.sin(state.backgroundTime * 2 + index) * 4, 0, Math.PI * 2);
      ctx.stroke();
      if (stage.phase === "patch" && stage.currentCheckpoint === node) {
        ctx.strokeStyle = "#ffbd55";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 44, -Math.PI / 2, -Math.PI / 2 + stage.patchProgress * Math.PI * 2);
        ctx.stroke();
      }
    });
    const cart = worldToScreen(run, stage.cart.x, stage.cart.y);
    ctx.fillStyle = palette.accent;
    ctx.fillRect(cart.x - 24, cart.y - 18, 48, 36);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.strokeRect(cart.x - 18, cart.y - 14, 36, 28);
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    ctx.fillRect(cart.x - 26, cart.y - 32, 52, 6);
    ctx.fillStyle = "#98ffbd";
    ctx.fillRect(cart.x - 26, cart.y - 32, 52 * clamp(stage.cart.hp / stage.cart.maxHp, 0, 1), 6);
    ctx.restore();
  }

  function drawCoreObjects(run) {
    if (!run || run.stage.id !== "core") return;
    const stage = run.stage;
    const center = worldToScreen(run, 1940, 570);
    ctx.save();
    const coreRadius = run.boss ? 110 : 86;
    ctx.strokeStyle = run.boss ? "rgba(255,95,120,0.8)" : "rgba(255,255,255,0.16)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(center.x, center.y, coreRadius + Math.sin(state.backgroundTime * 1.7) * 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = run.boss ? "rgba(255,95,120,0.2)" : "rgba(157,113,255,0.18)";
    ctx.beginPath();
    ctx.arc(center.x, center.y, coreRadius - 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (stage.phase === "stabilizers") {
      stage.stabilizers.forEach((stabilizer, index) => {
        const s = worldToScreen(run, stabilizer.x, stabilizer.y);
        ctx.save();
        ctx.strokeStyle = stabilizer.destroyed ? "#98ffbd" : index === stage.activeIndex ? "#ff5f78" : "rgba(255,255,255,0.16)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(s.x, s.y, stabilizer.radius + Math.sin(state.backgroundTime * 2 + index) * 3, 0, Math.PI * 2);
        ctx.stroke();
        if (index === stage.activeIndex && stabilizer.state === "shielded") {
          ctx.strokeStyle = "#48d8ff";
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.arc(s.x, s.y, stabilizer.radius + 8, -Math.PI / 2, -Math.PI / 2 + stabilizer.charge * Math.PI * 2);
          ctx.stroke();
        }
        if (index === stage.activeIndex && stabilizer.state === "exposed") {
          ctx.strokeStyle = "#ff5f78";
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.arc(s.x, s.y, stabilizer.radius + 8, -Math.PI / 2, -Math.PI / 2 + (1 - stabilizer.hp / stabilizer.maxHp) * Math.PI * 2);
          ctx.stroke();
        }
        ctx.fillStyle = stabilizer.destroyed ? "#98ffbd" : stabilizer.state === "exposed" ? "rgba(255,95,120,0.55)" : "rgba(157,113,255,0.28)";
        ctx.beginPath();
        ctx.arc(s.x, s.y, stabilizer.radius - 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }
  }

  function drawHazards(run) {
    run.hazards.forEach((hazard) => {
      if (hazard.type === "mortar") {
        const s = worldToScreen(run, hazard.x, hazard.y);
        ctx.save();
        ctx.strokeStyle = hazard.triggered ? "rgba(255,189,85,0.95)" : "rgba(255,95,120,0.85)";
        ctx.lineWidth = hazard.triggered ? 9 : 3;
        ctx.beginPath();
        ctx.arc(s.x, s.y, hazard.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else if (hazard.type === "storm") {
        ctx.save();
        const progress = hazard.warn > 0 ? 0 : 1 - clamp(hazard.active / 4.2, 0, 1);
        const band = hazard.warn > 0 ? hazard.start : lerp(hazard.start, hazard.end, progress);
        const x = hazard.orientation === "vertical" ? band - run.camera.x : -run.camera.x;
        const y = hazard.orientation === "horizontal" ? band - run.camera.y : -run.camera.y;
        ctx.fillStyle = hazard.warn > 0 ? "rgba(255,189,85,0.12)" : "rgba(255,189,85,0.22)";
        if (hazard.orientation === "vertical") {
          ctx.fillRect(x - hazard.width, 0, hazard.width * 2, config.height);
        } else {
          ctx.fillRect(0, y - hazard.width, config.width, hazard.width * 2);
        }
        ctx.restore();
      } else if (hazard.type === "pulse") {
        ctx.save();
        const s = worldToScreen(run, hazard.x, hazard.y);
        if (hazard.warn > 0) {
          ctx.strokeStyle = "rgba(255,95,120,0.35)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(s.x, s.y, hazard.radius * 0.16, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          const ring = (1 - clamp(hazard.active / 1.7, 0, 1)) * hazard.radius;
          ctx.strokeStyle = "rgba(255,95,120,0.72)";
          ctx.lineWidth = hazard.thickness * 0.35;
          ctx.beginPath();
          ctx.arc(s.x, s.y, ring, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }
    });
  }

  function drawBullets(run) {
    run.bullets.forEach((bullet) => {
      const s = worldToScreen(run, bullet.x, bullet.y);
      ctx.fillStyle = run.player.overdriveActive > 0 ? "#9d71ff" : "#ffbd55";
      ctx.beginPath();
      ctx.arc(s.x, s.y, bullet.radius + 1, 0, Math.PI * 2);
      ctx.fill();
    });
    run.enemyBullets.forEach((bullet) => {
      const s = worldToScreen(run, bullet.x, bullet.y);
      ctx.fillStyle = "#ff5f78";
      ctx.beginPath();
      ctx.arc(s.x, s.y, bullet.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawEnemy(run, enemy) {
    const s = worldToScreen(run, enemy.x, enemy.y);
    ctx.save();
    if (enemy.type === "scrapper") {
      ctx.fillStyle = enemy.hitFlash > 0 ? "#ffffff" : "#ffbd55";
      ctx.beginPath();
      ctx.arc(s.x, s.y, enemy.radius, 0, Math.PI * 2);
      ctx.fill();
    } else if (enemy.type === "lancer") {
      ctx.fillStyle = enemy.hitFlash > 0 ? "#ffffff" : "#ff8a5a";
      ctx.beginPath();
      ctx.moveTo(s.x + enemy.radius, s.y);
      ctx.lineTo(s.x - enemy.radius, s.y - enemy.radius * 0.74);
      ctx.lineTo(s.x - enemy.radius, s.y + enemy.radius * 0.74);
      ctx.closePath();
      ctx.fill();
      if (enemy.state === "cast") {
        ctx.strokeStyle = "rgba(255,95,120,0.82)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + Math.cos(enemy.dashAngle) * 240, s.y + Math.sin(enemy.dashAngle) * 240);
        ctx.stroke();
      }
    } else if (enemy.type === "wasp") {
      ctx.fillStyle = enemy.hitFlash > 0 ? "#ffffff" : "#48d8ff";
      ctx.beginPath();
      ctx.arc(s.x, s.y, enemy.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.beginPath();
      ctx.moveTo(s.x - enemy.radius - 6, s.y);
      ctx.lineTo(s.x + enemy.radius + 6, s.y);
      ctx.stroke();
    } else if (enemy.type === "sentry") {
      ctx.fillStyle = enemy.hitFlash > 0 ? "#ffffff" : "#7aebff";
      ctx.fillRect(s.x - 20, s.y - 20, 40, 40);
      if (enemy.beamCharge > 0 || enemy.beamActive > 0) {
        const beamLength = 620;
        const endX = s.x + Math.cos(enemy.beamAngle) * beamLength;
        const endY = s.y + Math.sin(enemy.beamAngle) * beamLength;
        ctx.strokeStyle = enemy.beamCharge > 0 ? "rgba(255,95,120,0.52)" : "rgba(255,95,120,0.84)";
        ctx.lineWidth = enemy.beamCharge > 0 ? 3 : 9;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    }
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    ctx.fillRect(s.x - enemy.radius, s.y - enemy.radius - 12, enemy.radius * 2, 4);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(s.x - enemy.radius, s.y - enemy.radius - 12, enemy.radius * 2 * clamp(enemy.hp / enemy.maxHp, 0, 1), 4);
    ctx.restore();
  }

  function drawBoss(run) {
    if (!run.boss) return;
    const boss = run.boss;
    const s = worldToScreen(run, boss.x, boss.y);
    ctx.save();
    ctx.fillStyle = boss.hitFlash > 0 ? "#ffffff" : "#ff5f78";
    ctx.beginPath();
    ctx.arc(s.x, s.y, boss.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(s.x, s.y, boss.radius + 18 + Math.sin(state.backgroundTime * 3) * 6, 0, Math.PI * 2);
    ctx.stroke();
    if (boss.beamCharge > 0 || boss.beamActive > 0) {
      ctx.strokeStyle = boss.beamCharge > 0 ? "rgba(255,95,120,0.42)" : "rgba(255,95,120,0.88)";
      ctx.lineWidth = boss.beamCharge > 0 ? 4 : 12;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x + Math.cos(boss.beamAngle) * 760, s.y + Math.sin(boss.beamAngle) * 760);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    ctx.fillRect(s.x - 90, s.y - boss.radius - 30, 180, 7);
    ctx.fillStyle = "#ff5f78";
    ctx.fillRect(s.x - 90, s.y - boss.radius - 30, 180 * clamp(boss.hp / boss.maxHp, 0, 1), 7);
    ctx.restore();
  }

  function drawPlayer(run) {
    const player = run.player;
    const s = worldToScreen(run, player.x, player.y);
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(player.aimAngle);
    ctx.fillStyle = player.hitFlash > 0 ? "#ffffff" : player.overdriveActive > 0 ? "#9d71ff" : "#eef4ff";
    ctx.beginPath();
    ctx.moveTo(24, 0);
    ctx.lineTo(-16, -14);
    ctx.lineTo(-10, 0);
    ctx.lineTo(-16, 14);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = player.repairFlash > 0 ? "rgba(152,255,189,0.44)" : "rgba(72,216,255,0.22)";
    ctx.beginPath();
    ctx.arc(0, 0, player.radius + 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (player.invuln > 0) {
      ctx.strokeStyle = player.overdriveActive > 0 ? "rgba(157,113,255,0.9)" : "rgba(72,216,255,0.82)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(s.x, s.y, player.radius + 12, 0, Math.PI * 2);
      ctx.stroke();
    }

    const crosshairDistance = 64;
    const crossX = s.x + Math.cos(player.aimAngle) * crosshairDistance;
    const crossY = s.y + Math.sin(player.aimAngle) * crosshairDistance;
    ctx.strokeStyle = player.overdriveActive > 0 ? "#9d71ff" : "#ffbd55";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(crossX, crossY, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(crossX - 18, crossY);
    ctx.lineTo(crossX - 8, crossY);
    ctx.moveTo(crossX + 8, crossY);
    ctx.lineTo(crossX + 18, crossY);
    ctx.moveTo(crossX, crossY - 18);
    ctx.lineTo(crossX, crossY - 8);
    ctx.moveTo(crossX, crossY + 8);
    ctx.lineTo(crossX, crossY + 18);
    ctx.stroke();
  }

  function drawParticles(run) {
    run.particles.forEach((particle) => {
      const s = worldToScreen(run, particle.x, particle.y);
      ctx.globalAlpha = clamp(particle.life / particle.maxLife, 0, 1);
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function drawContextPrompt(run) {
    if (!run.interactionPrompt) return;
    const prompt = run.interactionPrompt;
    const s = worldToScreen(run, prompt.x, prompt.y);
    const width = 240;
    const height = 34;
    const x = clamp(s.x - width / 2, 18, config.width - width - 18);
    const y = clamp(s.y - height / 2, 24, config.height - height - 24);
    const colors = prompt.emphasis === "warning"
      ? { border: "rgba(255,95,120,0.72)", fill: "rgba(24,10,14,0.88)" }
      : prompt.emphasis === "objective"
        ? { border: "rgba(255,189,85,0.72)", fill: "rgba(24,18,10,0.88)" }
        : { border: "rgba(72,216,255,0.72)", fill: "rgba(9,18,24,0.88)" };
    ctx.save();
    ctx.fillStyle = colors.fill;
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 1.5;
    ctx.fillRect(x, y, width, height);
    ctx.strokeRect(x, y, width, height);
    ctx.fillStyle = "#eef4ff";
    ctx.font = "15px Arial";
    ctx.textAlign = "center";
    ctx.fillText(prompt.text, x + width / 2, y + 22);
    ctx.textAlign = "start";
    ctx.restore();
  }

  function drawDamageIndicators(run) {
    if (!run.damageIndicators.length) return;
    const center = worldToScreen(run, run.player.x, run.player.y);
    ctx.save();
    run.damageIndicators.forEach((indicator) => {
      const alpha = clamp(indicator.life / indicator.maxLife, 0, 1);
      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.rotate(indicator.angle);
      ctx.strokeStyle = `rgba(255,95,120,${0.2 + alpha * 0.65})`;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(0, 0, 42, -0.34, 0.34);
      ctx.stroke();
      ctx.restore();
    });
    ctx.restore();
  }

  function drawCombatHint(run) {
    if (run.helpTimer <= 0) return;
    const alpha = clamp(run.helpTimer / 3, 0, 1);
    const hint = run.chapterId === "foundry"
      ? "WASD move, Left click fire, Space dash, E interact"
      : run.chapterId === "rail"
        ? "Guard the cart, patch checkpoints with E, and dodge storm bands"
        : run.stage && run.stage.phase === "boss"
          ? "Overdrive with Q, dash through pulses, and punish beam gaps"
          : "Expose stabilizers with E, then burst the shell before it reseals";
    const width = 520;
    const x = (config.width - width) / 2;
    const y = config.height - 54;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(6,10,18,0.76)";
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(x, y, width, 30);
    ctx.strokeRect(x, y, width, 30);
    ctx.fillStyle = "#eef4ff";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(hint, config.width / 2, y + 20);
    ctx.textAlign = "start";
    ctx.restore();
  }

  function drawMenuBackdrop() {
    ctx.save();
    ctx.strokeStyle = "rgba(72,216,255,0.18)";
    ctx.lineWidth = 2;
    const centerX = config.width * 0.76;
    const centerY = config.height * 0.46;
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, 90 + i * 38 + Math.sin(state.backgroundTime * 1.4 + i) * 8, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function renderGame() {
    drawBackground(state.run);
    drawWorldDecor(state.run);
    if (!state.run) {
      drawMenuBackdrop();
      return;
    }
    drawRelays(state.run);
    drawCartAndRail(state.run);
    drawCoreObjects(state.run);
    drawHazards(state.run);
    state.run.enemies.forEach((enemy) => drawEnemy(state.run, enemy));
    drawBoss(state.run);
    drawBullets(state.run);
    drawParticles(state.run);
    drawPlayer(state.run);
    drawDamageIndicators(state.run);
    drawContextPrompt(state.run);
    drawCombatHint(state.run);
    if (state.run.flash > 0) {
      ctx.save();
      ctx.fillStyle = `rgba(255,255,255,${state.run.flash * 0.24})`;
      ctx.fillRect(0, 0, config.width, config.height);
      ctx.restore();
    }
  }

  function updateHud() {
    const run = state.run;
    if (!run) {
      dom.chapterLabel.textContent = "Stand by";
      dom.objectiveLabel.textContent = "Wake the relay lattice.";
      dom.objectiveDetailLabel.textContent = "Step into the ring and hold E to sync.";
      dom.contextLabel.textContent = "Move with WASD. Enter the ring and hold E.";
      dom.threatLabel.textContent = "Nominal";
      dom.threatLabel.dataset.threat = "low";
      dom.objectiveFill.style.width = "0%";
      dom.scoreLabel.textContent = "0";
      dom.timeLabel.textContent = "00:00";
      dom.hpLabel.textContent = "100";
      dom.barrierLabel.textContent = "60";
      dom.heatLabel.textContent = "0%";
      dom.dashLabel.textContent = "Ready";
      dom.overdriveLabel.textContent = "Locked";
      dom.repairsLabel.textContent = "2";
      dom.hpFill.style.width = "100%";
      dom.barrierFill.style.width = "100%";
      dom.heatFill.style.width = "0%";
      dom.dashFill.style.width = "100%";
      dom.overdriveFill.style.width = "0%";
      return;
    }
    const player = run.player;
    const hpRatio = clamp(Math.max(0, player.hp) / player.maxHp, 0, 1);
    const barrierRatio = clamp(Math.max(0, player.barrier) / player.maxBarrier, 0, 1);
    const dangerDistance = 180;
    const nearbyEnemies = run.enemies.filter((enemy) => Math.hypot(enemy.x - player.x, enemy.y - player.y) <= dangerDistance).length;
    const dangerScore = (1 - hpRatio) * 0.5 + (1 - barrierRatio) * 0.18 + (nearbyEnemies >= 5 ? 0.25 : nearbyEnemies * 0.05);
    const threatLevel = dangerScore >= 0.58 ? "high" : dangerScore >= 0.32 ? "medium" : "low";
    const threatText = threatLevel === "high" ? "Critical" : threatLevel === "medium" ? "Elevated" : "Nominal";
    const immediateAction = player.hp <= player.maxHp * 0.35 && player.repairCharges > 0
      ? "Hull critical. Press R to consume a repair charge."
      : (run.objectiveDetail || "Track the objective marker and maintain spacing.");
    dom.chapterLabel.textContent = run.chapterName;
    dom.objectiveLabel.textContent = run.objectiveLabel;
    dom.objectiveDetailLabel.textContent = run.objectiveDetail;
    dom.contextLabel.textContent = immediateAction;
    dom.threatLabel.textContent = threatText;
    dom.threatLabel.dataset.threat = threatLevel;
    dom.objectiveFill.style.width = `${Math.round(clamp(run.objectiveProgress, 0, 1) * 100)}%`;
    dom.scoreLabel.textContent = formatScore(run.score);
    dom.timeLabel.textContent = formatTime(run.elapsed);
      dom.hpLabel.textContent = Math.max(0, Math.ceil(player.hp));
      dom.barrierLabel.textContent = Math.max(0, Math.ceil(player.barrier));
    dom.heatLabel.textContent = `${Math.round(clamp(player.heat / player.heatMax, 0, 1) * 100)}%`;
    dom.dashLabel.textContent = player.dashCooldown <= 0 ? "Ready" : `${player.dashCooldown.toFixed(1)}s`;
    dom.overdriveLabel.textContent = player.overdriveUnlocked ? (player.overdriveActive > 0 ? "Active" : `${Math.round(player.overdrive)}%`) : "Locked";
    dom.repairsLabel.textContent = String(player.repairCharges);
      dom.hpFill.style.width = `${Math.round(hpRatio * 100)}%`;
      dom.barrierFill.style.width = `${Math.round(barrierRatio * 100)}%`;
    dom.heatFill.style.width = `${Math.round(clamp(player.heat / player.heatMax, 0, 1) * 100)}%`;
    dom.dashFill.style.width = `${Math.round((1 - clamp(player.dashCooldown / player.dashMax, 0, 1)) * 100)}%`;
    dom.overdriveFill.style.width = `${Math.round(clamp(player.overdrive / 100, 0, 1) * 100)}%`;
  }

  function medalForRun(run) {
    if (!run.result || !run.result.victory) return "Shard";
    if (run.difficultyKey === "overclock") return "Prime";
    if (run.elapsed <= 620) return "Gold";
    if (run.elapsed <= 720) return "Silver";
    return "Bronze";
  }

  function endRun(run, victory, copy) {
    if (run.result) return;
    const medal = victory ? medalForRun({ ...run, result: { victory: true } }) : "Shard";
    run.result = { victory, copy, medal };
    if (victory) {
      state.records.clears += 1;
      state.records.unlockedOverclock = true;
      state.records.bestScore = Math.max(state.records.bestScore || 0, Math.floor(run.score));
      if (state.records.bestTime == null || run.elapsed < state.records.bestTime) {
        state.records.bestTime = run.elapsed;
      }
      persistState();
      audio.play("clear");
      showBanner("Core reignited", "The city holds another dawn.");
    } else {
      state.records.bestScore = Math.max(state.records.bestScore || 0, Math.floor(run.score));
      persistState();
      audio.play("gameOver");
      showBanner("Relay lost", "The blackout took the line.");
    }
    dom.resultKicker.textContent = victory ? "Run complete" : "Run failed";
    dom.resultTitle.textContent = victory ? "The city breathes again." : "The line broke in the dark.";
    dom.resultCopy.textContent = copy;
    dom.resultScore.textContent = formatScore(run.score);
    dom.resultTime.textContent = formatTime(run.elapsed);
    dom.resultMedal.textContent = medal;
    setView("result");
  }

  function down(code) {
    return state.input.keys.has(code);
  }

  function pressed(code) {
    return state.input.pressed.has(code);
  }

  function clearPressed() {
    state.input.pressed.clear();
    state.input.mouse.clicked = false;
  }

  function toggleFullscreen() {
    const target = document.documentElement;
    if (!document.fullscreenElement) {
      target.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  function mainStep(dt) {
    state.backgroundTime += dt;
    if (state.ui.bannerTime > 0) {
      state.ui.bannerTime = Math.max(0, state.ui.bannerTime - dt);
      if (state.ui.bannerTime <= 0) {
        dom.chapterBanner.classList.remove("is-active");
      }
    }
    if (state.ui.toastTime > 0) {
      state.ui.toastTime = Math.max(0, state.ui.toastTime - dt);
      if (state.ui.toastTime <= 0) {
        dom.toast.classList.remove("is-active");
      }
    }

    if (pressed("KeyF")) {
      toggleFullscreen();
    }

    if (state.view === "playing" && pressed("Escape")) {
      pauseRun();
    } else if (state.view === "paused" && pressed("Escape")) {
      resumeRun();
    } else if ((state.view === "options" || state.view === "credits") && pressed("Escape")) {
      setView("title");
    } else if (state.view === "upgrade") {
      if (pressed("Digit1")) pickUpgrade(0);
      if (pressed("Digit2")) pickUpgrade(1);
      if (pressed("Digit3")) pickUpgrade(2);
    }

    if (state.run && state.view === "playing") {
      updateRun(state.run, dt);
    }

    updateHud();
    renderGame();
    clearPressed();
  }

  function frame(ts) {
    if (!state.lastTs) state.lastTs = ts;
    state.accumulator += Math.min(0.05, (ts - state.lastTs) / 1000);
    state.lastTs = ts;
    while (state.accumulator >= FIXED_DT) {
      mainStep(FIXED_DT);
      state.accumulator -= FIXED_DT;
    }
    renderGame();
    updateHud();
    state.animationHandle = requestAnimationFrame(frame);
  }

  function updatePointer(event) {
    const rect = dom.canvas.getBoundingClientRect();
    state.input.mouse.x = event.clientX - rect.left;
    state.input.mouse.y = event.clientY - rect.top;
  }

  function bindEvents() {
    window.addEventListener("keydown", (event) => {
      if (!state.input.keys.has(event.code)) state.input.pressed.add(event.code);
      state.input.keys.add(event.code);
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
        event.preventDefault();
      }
      audio.ensure();
    });
    window.addEventListener("keyup", (event) => {
      state.input.keys.delete(event.code);
    });
    window.addEventListener("blur", () => {
      state.input.keys.clear();
      state.input.mouse.down = false;
    });
    dom.canvas.addEventListener("mousemove", updatePointer);
    dom.canvas.addEventListener("mousedown", (event) => {
      updatePointer(event);
      if (event.button === 0) {
        state.input.mouse.down = true;
        state.input.mouse.clicked = true;
        audio.ensure();
      }
    });
    window.addEventListener("mouseup", (event) => {
      if (event.button === 0) {
        state.input.mouse.down = false;
      }
    });
    dom.canvas.addEventListener("contextmenu", (event) => event.preventDefault());

    dom.startBtn.addEventListener("click", startRun);
    dom.optionsBtn.addEventListener("click", () => {
      setView("options");
      audio.ensure();
      audio.play("ui");
    });
    dom.creditsBtn.addEventListener("click", () => {
      setView("credits");
      audio.ensure();
      audio.play("ui");
    });
    dom.optionsBackBtn.addEventListener("click", () => {
      setView("title");
      audio.play("ui");
    });
    dom.creditsBackBtn.addEventListener("click", () => {
      setView("title");
      audio.play("ui");
    });
    dom.resumeBtn.addEventListener("click", resumeRun);
    dom.restartBtn.addEventListener("click", startRun);
    dom.backTitleBtn.addEventListener("click", returnToTitle);
    dom.resultRestartBtn.addEventListener("click", startRun);
    dom.resultTitleBtn.addEventListener("click", returnToTitle);

    [dom.difficultySelect, dom.optionsDifficultySelect].forEach((select) => {
      select.addEventListener("change", (event) => {
        setDifficulty(event.target.value);
        audio.ensure();
        audio.play("ui");
      });
    });

    dom.masterVolume.addEventListener("input", () => {
      state.settings.masterVolume = Number(dom.masterVolume.value);
      audio.ensure();
      audio.applySettings();
      persistState();
    });
    dom.sfxVolume.addEventListener("input", () => {
      state.settings.sfxVolume = Number(dom.sfxVolume.value);
      audio.ensure();
      audio.applySettings();
      persistState();
    });
    dom.muteAudio.addEventListener("change", () => {
      state.settings.muted = dom.muteAudio.checked;
      audio.ensure();
      audio.applySettings();
      persistState();
    });
    dom.highContrast.addEventListener("change", () => {
      state.settings.highContrast = dom.highContrast.checked;
      applyVisualSettings();
      persistState();
    });
    dom.reduceShake.addEventListener("change", () => {
      state.settings.reduceShake = dom.reduceShake.checked;
      persistState();
    });
    dom.reduceFlash.addEventListener("change", () => {
      state.settings.reduceFlash = dom.reduceFlash.checked;
      persistState();
    });
    dom.largeHud.addEventListener("change", () => {
      state.settings.largeHud = dom.largeHud.checked;
      applyVisualSettings();
      persistState();
    });
  }

  function renderTextState() {
    const run = state.run;
    return JSON.stringify({
      coordinate_system: { origin: "top-left", x: "right", y: "down" },
      view: state.view,
      chapter: run ? run.chapterName : "title",
      objective: run ? { label: run.objectiveLabel, detail: run.objectiveDetail, progress: Number(run.objectiveProgress.toFixed(3)) } : null,
      player: run ? {
        x: Number(run.player.x.toFixed(1)),
        y: Number(run.player.y.toFixed(1)),
        hp: Number(Math.max(0, run.player.hp).toFixed(1)),
        barrier: Number(Math.max(0, run.player.barrier).toFixed(1)),
        heat: Number(run.player.heat.toFixed(1)),
        overdrive: Number(run.player.overdrive.toFixed(1)),
        dash_cooldown: Number(run.player.dashCooldown.toFixed(2)),
        repairs: run.player.repairCharges,
      } : null,
      enemies: run ? run.enemies.slice(0, 10).map((enemy) => ({
        type: enemy.type,
        x: Number(enemy.x.toFixed(1)),
        y: Number(enemy.y.toFixed(1)),
        hp: Number(enemy.hp.toFixed(1)),
      })) : [],
      hazards: run ? run.hazards.slice(0, 10).map((hazard) => ({
        type: hazard.type,
        x: Number((hazard.x || 0).toFixed(1)),
        y: Number((hazard.y || 0).toFixed(1)),
      })) : [],
      bullets: run ? { player: run.bullets.length, enemy: run.enemyBullets.length } : null,
      score: run ? Math.floor(run.score) : 0,
      menu: {
        title: state.view === "title",
        options: state.view === "options",
        credits: state.view === "credits",
        paused: state.view === "paused",
        upgrade: state.view === "upgrade",
        result: state.view === "result",
      },
    });
  }

  function attachHooks() {
    window.render_game_to_text = renderTextState;
    window.advanceTime = (ms) => {
      const steps = Math.max(1, Math.round(ms / (FIXED_DT * 1000)));
      for (let i = 0; i < steps; i += 1) {
        mainStep(FIXED_DT);
      }
      renderGame();
      updateHud();
      return Promise.resolve();
    };
  }

  bindEvents();
  syncOptionControls();
  refreshRecordUI();
  applyVisualSettings();
  renderScreens();
  attachHooks();
  updateHud();
  renderGame();
  state.animationHandle = requestAnimationFrame(frame);
})();
