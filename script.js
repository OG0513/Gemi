/**
 * A Little World Made Just for Her
 * Cinematic Interactive Experience with Integrated Canvas Firework Engine
 */
/* ==================================================
   1. CONFIGURATION SYSTEM
   ================================================== */
const Config = {
  scaleFactor: 0.90, // Firework scale set to 90%
  celebrationDuration: 14000, // Duration of active firework launches
  initials: {
    viewBox: "0 0 600 240",
    strokes: [
      {
        id: "stroke-1",
        d: "M 65,160 C 45,140 45,95 75,70 C 100,50 135,50 138,95 C 142,140 135,185 130,200 C 128,205 120,195 125,165 C 135,115 155,110 175,135 C 185,148 195,160 210,158",
        duration: 1100,
        strokeWidth: 3.5,
        color: "var(--color-cream)"
      },
      {
        id: "stroke-2",
        d: "M 100,128 C 120,120 150,118 175,125",
        duration: 400,
        strokeWidth: 3.0,
        color: "var(--color-cream)"
      },
      {
        id: "stroke-3",
        d: "M 300,135 C 315,118 318,100 302,88 C 285,75 265,95 282,122 C 298,150 315,172 278,178 C 258,181 248,162 262,148 C 282,128 308,118 328,152 C 335,165 342,175 348,173",
        duration: 900,
        strokeWidth: 3.0,
        color: "var(--color-soft-gold)"
      },
      {
        id: "stroke-4",
        d: "M 385,150 C 375,138 372,118 388,95 C 402,72 418,72 418,118 C 418,148 412,185 412,195 C 412,200 418,192 428,165 C 442,125 458,92 468,112 C 475,128 468,178 468,192 C 468,198 474,190 484,165 C 498,125 512,95 522,115 C 528,130 525,165 538,160 C 548,155 558,145 565,140",
        duration: 1300,
        strokeWidth: 3.5,
        color: "var(--color-cream)"
      }
    ]
  },
  particles: {
    colors: [
      "rgba(252, 248, 242, 0.75)",
      "rgba(230, 202, 133, 0.8)",
      "rgba(247, 214, 208, 0.65)",
      "rgba(200, 221, 242, 0.65)",
      "rgba(226, 216, 238, 0.65)"
    ],
    stardustColor: "rgba(252, 232, 158, 0.9)"
  },
  sky: {
    starCount: 130,
    starColors: [
      "rgba(252, 248, 242, 0.9)",
      "rgba(230, 202, 133, 0.95)",
      "rgba(247, 214, 208, 0.85)",
      "rgba(200, 221, 242, 0.85)",
      "rgba(226, 216, 238, 0.85)"
    ]
  },
  grass: {
    palette: {
      back: ["#162a24", "#1a332b", "#1f3a32"],
      mid: ["#234338", "#2a4f43", "#315b4d"],
      front: ["#345e52", "#3e6f61", "#487e70"]
    },
    moonlightTip: "rgba(230, 202, 133, 0.4)"
  },
  flowers: {
    species: ["daisy", "lavender", "cosmos", "bluebell", "buttercup", "violet"],
    palette: {
      daisy: { petal: "#fcf8f2", center: "#e6ca85" },
      lavender: { floret: "#c5b2db", stem: "#2a4a3e" },
      cosmos: { petal: "#f3b1aa", center: "#fce89e" },
      bluebell: { petal: "#b3d1ee", stem: "#28483c" },
      buttercup: { petal: "#fce89e", center: "#385d52" },
      violet: { petal: "#b590d6", center: "#fcf8f2" }
    }
  },
  fireflies: {
    color: "rgba(252, 232, 158, 0.95)",
    glowColor: "rgba(230, 202, 133, 0.28)"
  },
  memories: [
    { id: 1, image: "images/photo01.jpg", caption: "A quiet night under the stars...", type: "polaroid", accent: "tape-top-right", number: "No. 01", fallbackRoman: "I" },
    { id: 2, image: "images/photo02.jpg", caption: "Sweet laughter & gentle breeze", type: "postcard", accent: "postmark", number: "No. 02", fallbackRoman: "II" },
    { id: 3, image: "images/photo03.jpg", caption: "Unforgettable warm moments", type: "polaroid", accent: "pressed-flower", number: "No. 03", fallbackRoman: "III" },
    { id: 4, image: "images/photo04.jpg", caption: "Walking through the moonlight", type: "polaroid", accent: "tape-top-left", number: "No. 04", fallbackRoman: "IV" },
    { id: 5, image: "images/photo05.jpg", caption: "A smile that brightens the day", type: "postcard", accent: "stamp-air", number: "No. 05", fallbackRoman: "V" },
    { id: 6, image: "images/photo06.jpg", caption: "Forever in our hearts", type: "polaroid", accent: "pressed-leaf", number: "No. 06", fallbackRoman: "VI" },
    { id: 7, image: "images/photo07.jpg", caption: "Whispers of joy and light", type: "postcard", accent: "tape-top-right", number: "No. 07", fallbackRoman: "VII" },
    { id: 8, image: "images/photo08.jpg", caption: "Surrounded by nature’s grace", type: "postcard", accent: "stamp-wish", number: "No. 08", fallbackRoman: "VIII" },
    { id: 9, image: "images/photo09.jpg", caption: "Moments that shine forever", type: "polaroid", accent: "pressed-flower-pink", number: "No. 09", fallbackRoman: "IX" },
    { id: 10, image: "images/photo10.jpg", caption: "A story made just for her", type: "postcard", accent: "tape-top-left", number: "No. 10", fallbackRoman: "X" }
  ],
  finalMessage: {
    recipientName: "My Dearest",
    signature: "— Atif",
    lines: [
      { text: "Happy Birthday once again,", class: "final-line-salutation" },
      { text: "{{recipientName}}", class: "final-line-recipient" },
      { text: "I hope this little journey", class: "" },
      { text: "brought a smile to your face.", class: "" },
      { text: "May this year bring you", class: "" },
      { text: "happiness,", class: "" },
      { text: "good health,", class: "" },
      { text: "success,", class: "" },
      { text: "and countless beautiful memories.", class: "" },
      { text: "Thank you for being", class: "" },
      { text: "a wonderful part of my life.", class: "" },
      { text: "Keep smiling.", class: "" },
      { text: "Keep shining.", class: "" },
      { text: "Have the most amazing birthday.", class: "" },
      { text: "{{signature}}", class: "final-line-signature" }
    ]
  },
  timings: {
    initialPause: 600,
    interStrokeDelay: 80,
    glowDelay: 200,
    subtitleDelay: 400,
    subtitleHold: 1400,
    fadeSceneDuration: 1200,
    gardenAdmirePause: 900,
    rollPauseBeforeUnfurl: 400,
    unfurlDuration: 1400,
    pauseBeforeLetterReveal: 350,
    lineRevealInterval: 550,
    pauseBeforeContinue: 400,
    finalLineRevealInterval: 700
  }
};

/* ==================================================
   2. UTILITIES & MATH
   ================================================== */
const MyMath = {
  random: (min, max) => Math.random() * (max - min) + min,
  clamp: (val, min, max) => Math.max(min, Math.min(max, val)),
  randomChoice: arr => arr[Math.floor(Math.random() * arr.length)],
  pointDist: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
  pointAngle: (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1)
};

const Utils = {
  clamp: MyMath.clamp,
  randomRange: MyMath.random,
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  wait: ms => new Promise(resolve => setTimeout(resolve, ms)),
  prefersReducedMotion: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => { clearTimeout(timeout); func(...args); };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  generateFallbackSVG: romanNumber => {
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23e8dec8"/><circle cx="200" cy="130" r="45" fill="%23d4c5a9"/><path d="M80,240 Q160,170 240,240 T400,240 L400,300 L80,300 Z" fill="%23bba88a"/><text x="50%" y="270" font-family="serif" font-size="16" fill="%2378654c" text-anchor="middle" font-style="italic">Memory ${romanNumber}</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svgStr)}`;
  }
};

/* ==================================================
   3. STAGE CANVAS LOOP WRAPPER
   ================================================== */
class Stage {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;
    this.listeners = {};
    this.lastTime = performance.now();
    
    this.tick = this.tick.bind(this);
    requestAnimationFrame(this.tick);
  }

  addEventListener(type, fn) {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(fn);
  }

  resize(w, h) {
    this.width = w;
    this.height = h;
    this.canvas.width = w * this.dpr;
    this.canvas.height = h * this.dpr;
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
  }

  tick(now) {
    const dt = now - this.lastTime;
    this.lastTime = now;
    const frameTime = Math.min(dt, 100);
    const lag = frameTime / (1000 / 60);

    if (this.listeners['ticker']) {
      this.listeners['ticker'].forEach(fn => fn(frameTime, lag));
    }
    requestAnimationFrame(this.tick);
  }
}

/* ==================================================
   4. WEB AUDIO SOUND MANAGER (WITH AUDIO DUCKING)
   ================================================== */
const soundManager = {
  baseURL: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/',
  ctx: null,
  sources: {
    lift: { volume: 0.9, playbackRateMin: 0.85, playbackRateMax: 0.95, fileNames: ['lift1.mp3', 'lift2.mp3', 'lift3.mp3'] },
    burst: { volume: 0.9, playbackRateMin: 0.8, playbackRateMax: 0.9, fileNames: ['burst1.mp3', 'burst2.mp3'] },
    burstSmall: { volume: 0.25, playbackRateMin: 0.8, playbackRateMax: 1, fileNames: ['burst-sm-1.mp3', 'burst-sm-2.mp3'] },
    crackle: { volume: 0.2, playbackRateMin: 1, playbackRateMax: 1, fileNames: ['crackle1.mp3'] },
    crackleSmall: { volume: 0.3, playbackRateMin: 1, playbackRateMax: 1, fileNames: ['crackle-sm-1.mp3'] }
  },
  _lastSmallBurstTime: 0,

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.preload();
    }
  },

  preload() {
    Object.keys(this.sources).forEach(type => {
      const source = this.sources[type];
      source.buffers = [];
      source.fileNames.forEach(fileName => {
        fetch(this.baseURL + fileName)
          .then(res => res.arrayBuffer())
          .then(data => this.ctx.decodeAudioData(data))
          .then(buffer => source.buffers.push(buffer))
          .catch(() => {});
      });
    });
  },

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  playSound(type, scale = 1) {
    if (!this.ctx || this.ctx.state !== 'running') return;
    if (type === 'burstSmall') {
      const now = Date.now();
      if (now - this._lastSmallBurstTime < 20) return;
      this._lastSmallBurstTime = now;
    }

    const source = this.sources[type];
    if (!source || !source.buffers.length) return;

    scale = MyMath.clamp(scale, 0, 1);
    const volume = source.volume * scale;
    const rate = MyMath.random(source.playbackRateMin, source.playbackRateMax) * (2 - scale);

    const gainNode = this.ctx.createGain();
    gainNode.gain.value = volume;

    const buffer = MyMath.randomChoice(source.buffers);
    const bufferSource = this.ctx.createBufferSource();
    bufferSource.playbackRate.value = rate;
    bufferSource.buffer = buffer;
    bufferSource.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    bufferSource.start(0);
  }
};

function setAmbientAudioDucking(duck) {
  if (window.ambientAudio && typeof window.ambientAudio.setVolume === 'function') {
    const targetVolume = duck ? 0.25 : 1.0;
    window.ambientAudio.fadeToVolume(targetVolume, 1000);
  }
}

/* ==================================================
   5. RESPONSIVE ENVIRONMENT ENGINE
   ================================================== */
class ResponsiveSystem {
  constructor(particleCanvas, grassCanvas, particleSystem, grassSystem) {
    this.particleCanvas = particleCanvas;
    this.grassCanvas = grassCanvas;
    this.particleSystem = particleSystem;
    this.grassSystem = grassSystem;

    this.debouncedResize = Utils.debounce(() => this.handleResize(), 100);
    this.init();
  }

  getViewportCategory() {
    const w = window.innerWidth;
    if (w < 380) return 'small-phone';
    if (w < 600) return 'medium-phone';
    if (w < 1024) return 'tablet';
    if (w < 1440) return 'laptop';
    return 'desktop';
  }

  getMeadowHeightPct() {
    const cat = this.getViewportCategory();
    switch (cat) {
      case 'small-phone':
      case 'medium-phone': return 0.35;
      case 'tablet': return 0.32;
      case 'laptop': return 0.30;
      case 'desktop': default: return 0.28;
    }
  }

  getGrassCount() {
    const cat = this.getViewportCategory();
    switch (cat) {
      case 'small-phone': return 210;
      case 'medium-phone': return 250;
      case 'tablet': return 300;
      case 'laptop': return 340;
      case 'desktop': default: return 380;
    }
  }

  getFlowerCount() {
    const cat = this.getViewportCategory();
    switch (cat) {
      case 'small-phone': return 32;
      case 'medium-phone': return 42;
      case 'tablet': return 55;
      case 'laptop': return 68;
      case 'desktop': default: return 80;
    }
  }

  getFlowerScale() {
    const cat = this.getViewportCategory();
    switch (cat) {
      case 'small-phone': return 1.05;
      case 'medium-phone': return 1.12;
      case 'tablet': return 1.22;
      case 'laptop': return 1.28;
      case 'desktop': default: return 1.35;
    }
  }

  getFireflyCount() {
    const cat = this.getViewportCategory();
    switch (cat) {
      case 'small-phone': return 14;
      case 'medium-phone': return 17;
      case 'tablet': return 21;
      case 'laptop': return 25;
      case 'desktop': default: return 28;
    }
  }

  getPollenCount() {
    const cat = this.getViewportCategory();
    switch (cat) {
      case 'small-phone': return 16;
      case 'medium-phone': return 20;
      case 'tablet': return 22;
      case 'laptop': return 26;
      case 'desktop': default: return 30;
    }
  }

  getSafeBottomInset() {
    const div = document.createElement('div');
    div.style.paddingBottom = 'env(safe-area-inset-bottom, 0px)';
    document.body.appendChild(div);
    const inset = parseFloat(window.getComputedStyle(div).paddingBottom) || 0;
    document.body.removeChild(div);
    return inset;
  }

  init() {
    this.updateDimensions();
    window.addEventListener('resize', this.debouncedResize);
  }

  updateDimensions() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    const meadowPct = this.getMeadowHeightPct();
    const grassCanvasHeight = this.height * meadowPct;

    document.documentElement.style.setProperty('--meadow-height', `${grassCanvasHeight}px`);

    if (this.particleCanvas) {
      this.particleCanvas.width = this.width * this.dpr;
      this.particleCanvas.height = this.height * this.dpr;
      this.particleCanvas.style.width = `${this.width}px`;
      this.particleCanvas.style.height = `${this.height}px`;

      const ctx = this.particleCanvas.getContext('2d');
      ctx.scale(this.dpr, this.dpr);
    }

    if (this.grassCanvas) {
      this.grassCanvas.width = this.width * this.dpr;
      this.grassCanvas.height = grassCanvasHeight * this.dpr;
      this.grassCanvas.style.width = `${this.width}px`;
      this.grassCanvas.style.height = `${grassCanvasHeight}px`;

      const ctx = this.grassCanvas.getContext('2d');
      ctx.scale(this.dpr, this.dpr);
    }
  }

  handleResize() {
    this.updateDimensions();
    if (this.particleSystem) {
      this.particleSystem.resize(this.width, this.height, this.getFireflyCount(), this.getPollenCount());
    }
    if (this.grassSystem) {
      this.grassSystem.resize(
        this.width,
        this.height * this.getMeadowHeightPct(),
        this.getGrassCount(),
        this.getFlowerCount(),
        this.getFlowerScale(),
        this.getSafeBottomInset()
      );
    }
  }
}

/* ==================================================
   6. BACKGROUND PARTICLES, MILKY WAY & CONTINUOUS STARS
   ================================================== */
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.stars = [];
    this.stardustSparks = [];
    this.shootingStars = [];
    this.fireflies = [];
    this.pollen = [];

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.isRunning = false;
    this.animFrameId = null;
    this.lastShootingStarTime = performance.now();

    this.fireflyCount = 28;
    this.pollenCount = 30;
    this.isGatheringHigh = false;

    this.initParticles();
    this.initStars();
    this.initFireflies();
    this.initPollen();
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < 28; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Utils.randomRange(1.2, 2.8),
        vx: Utils.randomRange(-0.015, 0.015),
        vy: Utils.randomRange(-0.03, -0.005),
        baseAlpha: Utils.randomRange(0.2, 0.7),
        alpha: Utils.randomRange(0.2, 0.7),
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: Utils.randomRange(0.002, 0.006),
        color: Config.particles.colors[Math.floor(Math.random() * Config.particles.colors.length)]
      });
    }
  }

  initStars() {
    if (this.stars.length > 0) return;

    this.stars = [];
    for (let i = 0; i < Config.sky.starCount; i++) {
      const isSparkle = Math.random() < 0.12;
      this.stars.push({
        relX: Math.random(),
        relY: Math.random(),
        x: 0,
        y: 0,
        radius: isSparkle ? Utils.randomRange(1.8, 2.8) : Utils.randomRange(0.7, 1.6),
        baseAlpha: Utils.randomRange(0.3, 0.9),
        alpha: Utils.randomRange(0.3, 0.9),
        twinkleSpeed: Utils.randomRange(0.01, 0.03),
        phase: Math.random() * Math.PI * 2,
        isSparkle: isSparkle,
        color: Config.sky.starColors[Math.floor(Math.random() * Config.sky.starColors.length)]
      });
    }
    this.updateStarPositions();
  }

  updateStarPositions() {
    this.stars.forEach(s => {
      s.x = s.relX * this.width;
      s.y = s.relY * this.height;
    });
  }

  initFireflies() {
    this.fireflies = [];
    for (let i = 0; i < this.fireflyCount; i++) {
      this.fireflies.push({
        x: Math.random() * this.width,
        y: Utils.randomRange(this.height * 0.35, this.height * 0.88),
        radius: Utils.randomRange(1.8, 2.8),
        glowRadius: Utils.randomRange(14, 24),
        vx: Utils.randomRange(-0.25, 0.25),
        vy: Utils.randomRange(-0.2, 0.2),
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: Utils.randomRange(0.01, 0.025),
        alpha: Utils.randomRange(0.2, 0.85),
        wanderTimer: 0
      });
    }
  }

  initPollen() {
    this.pollen = [];
    for (let i = 0; i < this.pollenCount; i++) {
      this.pollen.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Utils.randomRange(0.8, 1.8),
        vx: Utils.randomRange(-0.02, 0.02),
        vy: Utils.randomRange(-0.02, 0.01),
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: Utils.randomRange(0.002, 0.006),
        alpha: Utils.randomRange(0.15, 0.55),
        color: Config.particles.colors[Math.floor(Math.random() * Config.particles.colors.length)]
      });
    }
  }

  setGatheringHigh(enabled) { this.isGatheringHigh = enabled; }

  addStardustSpark(x, y) {
    if (Utils.prefersReducedMotion()) return;
    for (let i = 0; i < 2; i++) {
      this.stardustSparks.push({
        x: x + Utils.randomRange(-2, 2),
        y: y + Utils.randomRange(-2, 2),
        radius: Utils.randomRange(1.2, 3.0),
        vx: Utils.randomRange(-0.5, 0.5),
        vy: Utils.randomRange(-0.5, 0.5),
        alpha: 0.95,
        decay: Utils.randomRange(0.02, 0.04),
        color: Config.particles.stardustColor
      });
    }
  }

  triggerShootingStar() {
    if (Utils.prefersReducedMotion()) return;
    const startX = Utils.randomRange(this.width * 0.1, this.width * 0.7);
    const startY = Utils.randomRange(this.height * 0.05, this.height * 0.35);
    const length = Utils.randomRange(80, 140);
    const speed = Utils.randomRange(3.5, 5.5);

    this.shootingStars.push({
      x: startX, y: startY, length: length,
      vx: speed, vy: speed * 0.55, alpha: 1.0,
      decay: Utils.randomRange(0.014, 0.024), width: Utils.randomRange(1.4, 2.2)
    });
  }

  resize(width, height, fireflyCount, pollenCount) {
    this.width = width; this.height = height;
    if (fireflyCount) this.fireflyCount = fireflyCount;
    if (pollenCount) this.pollenCount = pollenCount;
    this.updateStarPositions();
    this.initFireflies();
    this.initPollen();
  }

  start() { if (this.isRunning) return; this.isRunning = true; this.loop(); }
  stop() { this.isRunning = false; if (this.animFrameId) cancelAnimationFrame(this.animFrameId); }

  drawMilkyWay() {
    const ctx = this.ctx;
    ctx.save();

    const grad = ctx.createLinearGradient(0, this.height * 0.1, this.width, this.height * 0.75);
    grad.addColorStop(0, 'rgba(200, 220, 242, 0.0)');
    grad.addColorStop(0.35, 'rgba(216, 200, 242, 0.038)');
    grad.addColorStop(0.5, 'rgba(235, 240, 255, 0.065)');
    grad.addColorStop(0.65, 'rgba(200, 220, 242, 0.038)');
    grad.addColorStop(1, 'rgba(200, 220, 242, 0.0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, this.height * 0.08);
    ctx.bezierCurveTo(this.width * 0.35, this.height * 0.15, this.width * 0.65, this.height * 0.45, this.width, this.height * 0.68);
    ctx.lineTo(this.width, this.height * 0.88);
    ctx.bezierCurveTo(this.width * 0.65, this.height * 0.65, this.width * 0.35, this.height * 0.35, 0, this.height * 0.28);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  drawSparkleStar(x, y, radius, alpha, color) {
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 0.75;

    const size = radius * 2.8;
    this.ctx.beginPath();
    this.ctx.moveTo(x - size, y); this.ctx.lineTo(x + size, y);
    this.ctx.moveTo(x, y - size); this.ctx.lineTo(x, y + size);
    this.ctx.stroke();

    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius * 0.7, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  loop(now = performance.now()) {
    if (!this.isRunning) return;
    this.ctx.clearRect(0, 0, this.width, this.height);
    const isReduced = Utils.prefersReducedMotion();

    this.drawMilkyWay();

    for (let s of this.stars) {
      if (!isReduced) {
        s.phase += s.twinkleSpeed;
        s.alpha = Utils.clamp(s.baseAlpha + Math.sin(s.phase) * 0.35, 0.15, 0.95);
      }
      if (s.isSparkle) this.drawSparkleStar(s.x, s.y, s.radius, s.alpha, s.color);
      else {
        this.ctx.save();
        this.ctx.globalAlpha = s.alpha;
        this.ctx.fillStyle = s.color;
        this.ctx.beginPath();
        this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }

    for (let pol of this.pollen) {
      if (!isReduced) {
        pol.x += pol.vx; pol.y += pol.vy; pol.phase += pol.pulseSpeed;
        pol.alpha = 0.15 + (Math.sin(pol.phase) * 0.5 + 0.5) * 0.4;
        if (pol.y < -10) pol.y = this.height + 10;
        if (pol.x < -10) pol.x = this.width + 10;
        if (pol.x > this.width + 10) pol.x = -10;
      }
      this.ctx.save();
      this.ctx.globalAlpha = pol.alpha;
      this.ctx.fillStyle = pol.color;
      this.ctx.beginPath();
      this.ctx.arc(pol.x, pol.y, pol.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    for (let p of this.particles) {
      if (!isReduced) {
        p.x += p.vx; p.y += p.vy; p.phase += p.pulseSpeed;
        p.alpha = Utils.clamp(p.baseAlpha + Math.sin(p.phase) * 0.15, 0.1, 0.85);
        if (p.y < -10) p.y = this.height + 10;
        if (p.x < -10) p.x = this.width + 10;
        if (p.x > this.width + 10) p.x = -10;
      }
      const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3.2);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius * 3.2, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    for (let ff of this.fireflies) {
      if (!isReduced) {
        ff.phase += ff.pulseSpeed;
        ff.alpha = 0.25 + (Math.sin(ff.phase) * 0.5 + 0.5) * 0.65;
        const targetMinY = this.isGatheringHigh ? this.height * 0.15 : this.height * 0.35;
        const targetMaxY = this.isGatheringHigh ? this.height * 0.65 : this.height * 0.88;

        if (ff.y > targetMaxY) ff.vy -= 0.03;
        if (ff.y < targetMinY) ff.vy += 0.03;
        ff.x += ff.vx + Math.sin(ff.phase * 0.8) * 0.25;
        ff.y += ff.vy + Math.cos(ff.phase * 0.6) * 0.18;

        ff.wanderTimer += 0.016;
        if (ff.wanderTimer > 3.5) {
          ff.vx = Utils.randomRange(-0.25, 0.25);
          ff.vy = Utils.randomRange(-0.2, 0.2);
          ff.wanderTimer = 0;
        }
      }

      const fireflyGrad = this.ctx.createRadialGradient(ff.x, ff.y, 0, ff.x, ff.y, ff.glowRadius);
      fireflyGrad.addColorStop(0, Config.fireflies.color);
      fireflyGrad.addColorStop(0.35, Config.fireflies.glowColor);
      fireflyGrad.addColorStop(1, 'rgba(0,0,0,0)');

      this.ctx.save();
      this.ctx.globalAlpha = ff.alpha;
      this.ctx.fillStyle = fireflyGrad;
      this.ctx.beginPath();
      this.ctx.arc(ff.x, ff.y, ff.glowRadius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    for (let i = this.stardustSparks.length - 1; i >= 0; i--) {
      const sp = this.stardustSparks[i];
      sp.x += sp.vx; sp.y += sp.vy; sp.alpha -= sp.decay;
      if (sp.alpha <= 0) { this.stardustSparks.splice(i, 1); continue; }

      this.ctx.save();
      this.ctx.globalAlpha = sp.alpha;
      this.ctx.fillStyle = sp.color;
      this.ctx.beginPath();
      this.ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    if (!isReduced && now - this.lastShootingStarTime > 8500) {
      this.triggerShootingStar();
      this.lastShootingStarTime = now + Utils.randomRange(-2000, 3000);
    }

    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const st = this.shootingStars[i];
      st.x += st.vx; st.y += st.vy; st.alpha -= st.decay;
      if (st.alpha <= 0) { this.shootingStars.splice(i, 1); continue; }

      const tailX = st.x - (st.vx / Math.hypot(st.vx, st.vy)) * st.length;
      const tailY = st.y - (st.vy / Math.hypot(st.vx, st.vy)) * st.length;
      const grad = this.ctx.createLinearGradient(st.x, st.y, tailX, tailY);
      grad.addColorStop(0, `rgba(252, 248, 242, ${st.alpha})`);
      grad.addColorStop(0.3, `rgba(230, 202, 133, ${st.alpha * 0.7})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      this.ctx.save();
      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = st.width;
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(st.x, st.y);
      this.ctx.lineTo(tailX, tailY);
      this.ctx.stroke();
      this.ctx.restore();
    }

    this.animFrameId = requestAnimationFrame(timestamp => this.loop(timestamp));
  }
}

/* ==================================================
   7. PLANTING ZONE GARDEN ENGINE (GRASS & FLOWERS)
   ================================================== */
class GrassSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight * 0.30;
    this.grassCount = 340;
    this.flowerCount = 68;
    this.flowerScaleGlobal = 1.28;
    this.safeBottomInset = 0;
    this.isCalmWind = false;

    this.blades = [];
    this.flowers = [];
    this.isRunning = false;
    this.animFrameId = null;

    this.initGarden();
  }

  setCalmWind(enabled) { this.isCalmWind = enabled; }

  initGarden() {
    this.initGrass();
    this.initFlowers();
  }

  initGrass() {
    this.blades = [];
    for (let i = 0; i < this.grassCount; i++) {
      let layer = 0;
      const layerRoll = Math.random();
      if (layerRoll > 0.6) layer = 2;
      else if (layerRoll > 0.28) layer = 1;

      let height = Utils.randomRange(24, 42);
      let baseWidth = Utils.randomRange(1.4, 2.0);
      let colorArray = Config.grass.palette.back;

      if (layer === 1) {
        height = Utils.randomRange(40, 64); baseWidth = Utils.randomRange(2.0, 3.0); colorArray = Config.grass.palette.mid;
      } else if (layer === 2) {
        height = Utils.randomRange(58, 86); baseWidth = Utils.randomRange(2.8, 4.0); colorArray = Config.grass.palette.front;
      }

      this.blades.push({
        x: Math.random() * this.width, layer, height, baseWidth,
        naturalCurve: Utils.randomRange(-8, 8), flexibility: Utils.randomRange(0.6, 1.3),
        freq: Utils.randomRange(0.0012, 0.0025), phase: Math.random() * Math.PI * 2,
        color: colorArray[Math.floor(Math.random() * colorArray.length)],
        hasHighlight: layer === 2 && Math.random() < 0.65
      });
    }
    this.blades.sort((a, b) => a.layer - b.layer);
  }

  initFlowers() {
    this.flowers = [];
    for (let i = 0; i < this.flowerCount; i++) {
      const species = Config.flowers.species[Math.floor(Math.random() * Config.flowers.species.length)];
      let layer = Math.floor(Math.random() * 3);
      let layerScale = Utils.randomRange(0.75, 0.95);
      if (layer === 1) layerScale = Utils.randomRange(0.95, 1.15);
      if (layer === 2) layerScale = Utils.randomRange(1.15, 1.35);

      const combinedScale = layerScale * this.flowerScaleGlobal;
      this.flowers.push({
        x: Math.random() * this.width, layer, species,
        plantZoneOffset: Utils.randomRange(18, 48),
        stemHeight: Utils.randomRange(28, 58) * combinedScale,
        stemCurve: Utils.randomRange(-8, 8), scale: combinedScale,
        windFactor: species === 'lavender' || species === 'cosmos' ? 0.45 : 0.32,
        freq: Utils.randomRange(0.001, 0.002), phase: Math.random() * Math.PI * 2,
        color: Config.flowers.palette[species]
      });
    }
    this.flowers.sort((a, b) => a.layer - b.layer);
  }

  resize(width, height, grassCount, flowerCount, flowerScaleGlobal, safeBottomInset) {
    this.width = width; this.height = height;
    if (grassCount) this.grassCount = grassCount;
    if (flowerCount) this.flowerCount = flowerCount;
    if (flowerScaleGlobal) this.flowerScaleGlobal = flowerScaleGlobal;
    if (safeBottomInset !== undefined) this.safeBottomInset = safeBottomInset;
    this.initGarden();
  }

  start() { if (this.isRunning) return; this.isRunning = true; this.loop(); }
  stop() { this.isRunning = false; if (this.animFrameId) cancelAnimationFrame(this.animFrameId); }

  drawFlower(flower, tipX, tipY) {
    const ctx = this.ctx;
    const s = flower.scale;
    ctx.save();
    ctx.translate(tipX, tipY);

    switch (flower.species) {
      case 'daisy': {
        const petalCount = 10;
        ctx.fillStyle = flower.color.petal;
        for (let i = 0; i < petalCount; i++) {
          ctx.save();
          ctx.rotate((i * Math.PI * 2) / petalCount);
          ctx.beginPath();
          ctx.ellipse(0, -8 * s, 2.6 * s, 7 * s, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = flower.color.center;
        ctx.beginPath(); ctx.arc(0, 0, 3.8 * s, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case 'lavender': {
        ctx.fillStyle = flower.color.floret;
        for (let i = 0; i < 6; i++) {
          const yOff = -i * 4.5 * s;
          ctx.beginPath();
          ctx.ellipse(-2.5 * s, yOff, 3 * s, 2 * s, -0.2, 0, Math.PI * 2);
          ctx.ellipse(2.5 * s, yOff, 3 * s, 2 * s, 0.2, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }
      case 'cosmos': {
        ctx.fillStyle = flower.color.petal;
        for (let i = 0; i < 8; i++) {
          ctx.save(); ctx.rotate((i * Math.PI * 2) / 8);
          ctx.beginPath(); ctx.ellipse(0, -8.5 * s, 4 * s, 7.5 * s, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = flower.color.center;
        ctx.beginPath(); ctx.arc(0, 0, 3.5 * s, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case 'bluebell': {
        ctx.fillStyle = flower.color.petal;
        for (let i = 0; i < 3; i++) {
          ctx.save(); ctx.translate(-i * 2.5 * s, i * 5 * s);
          ctx.beginPath(); ctx.arc(0, 0, 4 * s, 0, Math.PI); ctx.fill();
          ctx.restore();
        }
        break;
      }
      case 'buttercup': {
        ctx.fillStyle = flower.color.petal;
        for (let i = 0; i < 5; i++) {
          ctx.save(); ctx.rotate((i * Math.PI * 2) / 5);
          ctx.beginPath(); ctx.ellipse(0, -5 * s, 3.5 * s, 5 * s, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = flower.color.center;
        ctx.beginPath(); ctx.arc(0, 0, 2.5 * s, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case 'violet': {
        ctx.fillStyle = flower.color.petal;
        for (let i = 0; i < 5; i++) {
          ctx.save(); ctx.rotate((i * Math.PI * 2) / 5);
          ctx.beginPath(); ctx.ellipse(0, -4.5 * s, 2.8 * s, 4.8 * s, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = flower.color.center;
        ctx.beginPath(); ctx.arc(0, 0, 1.6 * s, 0, Math.PI * 2); ctx.fill();
        break;
      }
    }
    ctx.restore();
  }

  loop(now = performance.now()) {
    if (!this.isRunning) return;
    this.ctx.clearRect(0, 0, this.width, this.height);
    const isReduced = Utils.prefersReducedMotion();

    const windMult = this.isCalmWind ? 0.45 : 1.0;
    const globalWind = isReduced ? 0 : (Math.sin(now * 0.0008) * 9 + Math.cos(now * 0.0018) * 4) * windMult;
    const grassBaseY = this.height - Math.max(10, this.safeBottomInset + 6);

    for (let layer = 0; layer < 3; layer++) {
      const layerBlades = this.blades.filter(b => b.layer === layer);
      for (let blade of layerBlades) {
        const gustWave = isReduced ? 0 : Math.sin(now * 0.0012 - blade.x * 0.0025) * 7 * windMult;
        const bladeSway = isReduced ? 0 : (globalWind + gustWave + Math.sin(now * blade.freq + blade.phase) * 3) * blade.flexibility;

        const totalOffset = blade.naturalCurve + bladeSway;
        const tipX = blade.x + totalOffset;
        const tipY = grassBaseY - blade.height;
        const ctrlX = blade.x + totalOffset * 0.5;
        const ctrlY = grassBaseY - blade.height * 0.55;
        const halfWidth = blade.baseWidth * 0.5;

        this.ctx.save();
        this.ctx.fillStyle = blade.color;
        this.ctx.beginPath();
        this.ctx.moveTo(blade.x - halfWidth, grassBaseY);
        this.ctx.quadraticCurveTo(ctrlX - halfWidth * 0.3, ctrlY, tipX, tipY);
        this.ctx.quadraticCurveTo(ctrlX + halfWidth * 0.3, ctrlY, blade.x + halfWidth, grassBaseY);
        this.ctx.closePath();
        this.ctx.fill();

        if (blade.hasHighlight) {
          this.ctx.strokeStyle = Config.grass.moonlightTip;
          this.ctx.lineWidth = 0.75;
          this.ctx.beginPath();
          this.ctx.moveTo(ctrlX, ctrlY);
          this.ctx.quadraticCurveTo(ctrlX + totalOffset * 0.2, tipY + blade.height * 0.15, tipX, tipY);
          this.ctx.stroke();
        }
        this.ctx.restore();
      }

      const layerFlowers = this.flowers.filter(f => f.layer === layer);
      for (let flower of layerFlowers) {
        const flowerBaseY = grassBaseY - flower.plantZoneOffset;
        const gustWave = isReduced ? 0 : Math.sin(now * 0.001 - flower.x * 0.002) * 5 * windMult;
        const flowerSway = isReduced ? 0 : (globalWind + gustWave + Math.sin(now * flower.freq + flower.phase) * 2) * flower.windFactor;

        const totalOffset = flower.stemCurve + flowerSway;
        const tipX = flower.x + totalOffset;
        const tipY = flowerBaseY - flower.stemHeight;
        const ctrlX = flower.x + totalOffset * 0.5;
        const ctrlY = flowerBaseY - flower.stemHeight * 0.5;

        this.ctx.save();
        this.ctx.strokeStyle = "#254238";
        this.ctx.lineWidth = 1.4 * flower.scale;
        this.ctx.beginPath();
        this.ctx.moveTo(flower.x, flowerBaseY);
        this.ctx.quadraticCurveTo(ctrlX, ctrlY, tipX, tipY);
        this.ctx.stroke();
        this.ctx.restore();

        this.drawFlower(flower, tipX, tipY);
      }
    }

    this.animFrameId = requestAnimationFrame(timestamp => this.loop(timestamp));
  }
}

/* ==================================================
   8. EXACT ORIGINAL FIREWORK ENGINE FROM INDEX(1).HTML
   ================================================== */
const GRAVITY = 0.9;
let simSpeed = 1;

const COLOR = {
  Red: '#ff0043', Green: '#14fc56', Blue: '#1e7fff',
  Purple: '#e60aff', Gold: '#ffbf36', White: '#ffffff'
};
const INVISIBLE = '_INVISIBLE_';
const COLOR_CODES = Object.values(COLOR);
const COLOR_CODES_W_INVIS = [...COLOR_CODES, INVISIBLE];
const PI_2 = Math.PI * 2;
const PI_HALF = Math.PI * 0.5;

const COLOR_TUPLES = {
  '#ff0043': { r: 255, g: 0, b: 67 },
  '#14fc56': { r: 20, g: 252, b: 86 },
  '#1e7fff': { r: 30, g: 127, b: 255 },
  '#e60aff': { r: 230, g: 10, b: 255 },
  '#ffbf36': { r: 255, g: 191, b: 54 },
  '#ffffff': { r: 255, g: 255, b: 255 }
};

function randomColorSimple() { return COLOR_CODES[Math.floor(Math.random() * COLOR_CODES.length)]; }
let lastColor;
function randomColor(options) {
  const notSame = options && options.notSame;
  const notColor = options && options.notColor;
  const limitWhite = options && options.limitWhite;
  let color = randomColorSimple();

  if (limitWhite && color === COLOR.White && Math.random() < 0.6) {
    color = randomColorSimple();
  }
  if (notSame) {
    while (color === lastColor) { color = randomColorSimple(); }
  } else if (notColor) {
    while (color === notColor) { color = randomColorSimple(); }
  }
  lastColor = color;
  return color;
}
function whiteOrGold() { return Math.random() < 0.5 ? COLOR.Gold : COLOR.White; }
function makePistilColor(c) { return (c === COLOR.White || c === COLOR.Gold) ? randomColor({ notColor: c }) : whiteOrGold(); }

function createParticleCollection() {
  const col = {};
  COLOR_CODES_W_INVIS.forEach(c => col[c] = []);
  return col;
}

const Star = {
  drawWidth: 3.0,
  airDrag: 0.98,
  airDragHeavy: 0.992,
  active: createParticleCollection(),
  _pool: [],

  _new() { return {}; },

  add(x, y, color, angle, speed, life, speedOffX, speedOffY) {
    const inst = this._pool.pop() || this._new();
    inst.visible = true; inst.heavy = false;
    inst.x = x; inst.y = y; inst.prevX = x; inst.prevY = y;
    inst.color = color;
    inst.speedX = Math.sin(angle) * speed + (speedOffX || 0);
    inst.speedY = Math.cos(angle) * speed + (speedOffY || 0);
    inst.life = life; inst.fullLife = life;
    inst.spinAngle = Math.random() * PI_2; inst.spinSpeed = 0.8; inst.spinRadius = 0;
    inst.sparkFreq = 0; inst.sparkSpeed = 1; inst.sparkTimer = 0;
    inst.sparkColor = color; inst.sparkLife = 750; inst.sparkLifeVariation = 0.25;
    inst.strobe = false;
    this.active[color].push(inst);
    return inst;
  },

  returnInstance(inst) {
    if (inst.onDeath) inst.onDeath(inst);
    inst.onDeath = null; inst.secondColor = null; inst.transitionTime = 0; inst.colorChanged = false;
    this._pool.push(inst);
  }
};

const Spark = {
  drawWidth: 0.85,
  airDrag: 0.9,
  active: createParticleCollection(),
  _pool: [],

  _new() { return {}; },

  add(x, y, color, angle, speed, life) {
    const inst = this._pool.pop() || this._new();
    inst.x = x; inst.y = y; inst.prevX = x; inst.prevY = y;
    inst.color = color;
    inst.speedX = Math.sin(angle) * speed;
    inst.speedY = Math.cos(angle) * speed;
    inst.life = life;
    this.active[color].push(inst);
    return inst;
  },

  returnInstance(inst) { this._pool.push(inst); }
};

const BurstFlash = {
  active: [],
  _pool: [],
  _new() { return {}; },
  add(x, y, radius, colorTuple) {
    const inst = this._pool.pop() || this._new();
    inst.x = x; inst.y = y; inst.radius = radius;
    inst.colorTuple = colorTuple || { r: 255, g: 220, b: 150 };
    this.active.push(inst);
    return inst;
  },
  returnInstance(inst) { this._pool.push(inst); }
};

function createParticleArc(start, arcLength, count, randomness, particleFactory) {
  const angleDelta = arcLength / count;
  const end = start + arcLength - (angleDelta * 0.5);
  if (end > start) {
    for (let angle = start; angle < end; angle += angleDelta) {
      particleFactory(angle + Math.random() * angleDelta * randomness);
    }
  } else {
    for (let angle = start; angle > end; angle += angleDelta) {
      particleFactory(angle + Math.random() * angleDelta * randomness);
    }
  }
}

function createBurst(count, particleFactory, startAngle = 0, arcLength = PI_2) {
  const R = 0.5 * Math.sqrt(count / Math.PI);
  const C = 2 * R * Math.PI;
  const C_HALF = C / 2;
  for (let i = 0; i <= C_HALF; i++) {
    const ringAngle = i / C_HALF * PI_HALF;
    const ringSize = Math.cos(ringAngle);
    const partsPerFullRing = C * ringSize;
    const partsPerArc = partsPerFullRing * (arcLength / PI_2);
    const angleInc = PI_2 / partsPerFullRing;
    const angleOffset = Math.random() * angleInc + startAngle;
    const maxRandomAngleOffset = angleInc * 0.33;
    for (let j = 0; j < partsPerArc; j++) {
      let angle = angleInc * j + angleOffset + Math.random() * maxRandomAngleOffset;
      particleFactory(angle, ringSize);
    }
  }
}

function crossetteEffect(star) {
  const startAngle = Math.random() * PI_HALF;
  createParticleArc(startAngle, PI_2, 4, 0.5, angle => {
    Star.add(star.x, star.y, star.color, angle, Math.random() * 0.6 + 0.75, 600);
  });
}

function floralEffect(star) {
  createBurst(18, (angle, speedMult) => {
    Star.add(star.x, star.y, star.color, angle, speedMult * 2.4, 1000 + Math.random() * 300, star.speedX, star.speedY);
  });
  BurstFlash.add(star.x, star.y, 46);
  soundManager.playSound('burstSmall');
}

function fallingLeavesEffect(star) {
  createBurst(7, (angle, speedMult) => {
    const newStar = Star.add(star.x, star.y, INVISIBLE, angle, speedMult * 2.4, 2400 + Math.random() * 600, star.speedX, star.speedY);
    newStar.sparkColor = COLOR.Gold;
    newStar.sparkFreq = 120;
    newStar.sparkSpeed = 0.28;
    newStar.sparkLife = 750;
    newStar.sparkLifeVariation = 3.2;
  });
  BurstFlash.add(star.x, star.y, 46);
  soundManager.playSound('burstSmall');
}

function crackleEffect(star) {
  createParticleArc(0, PI_2, 32, 1.8, angle => {
    Spark.add(star.x, star.y, COLOR.Gold, angle, Math.pow(Math.random(), 0.45) * 2.4, 300 + Math.random() * 200);
  });
}

// 12-inch shell definitions (size = 4)
const crysanthemumShell = (size = 4) => {
  const glitter = Math.random() < 0.25;
  const singleColor = Math.random() < 0.72;
  const color = singleColor ? randomColor({ limitWhite: true }) : [randomColor(), randomColor({ notSame: true })];
  const pistil = singleColor && Math.random() < 0.42;
  const pistilColor = pistil && makePistilColor(color);
  const secondColor = singleColor && (Math.random() < 0.2 || color === COLOR.White) ? pistilColor || randomColor({ notColor: color, limitWhite: true }) : null;
  const streamers = !pistil && color !== COLOR.White && Math.random() < 0.42;
  return {
    shellSize: size, spreadSize: 300 + size * 100, starLife: 900 + size * 200, starDensity: 1.2,
    color, secondColor, glitter: glitter ? 'light' : '', glitterColor: whiteOrGold(),
    pistil, pistilColor, streamers
  };
};

const ghostShell = (size = 4) => {
  const shell = crysanthemumShell(size);
  shell.starLife *= 1.5;
  let ghostColor = randomColor({ notColor: COLOR.White });
  shell.streamers = true;
  shell.color = INVISIBLE;
  shell.secondColor = ghostColor;
  shell.glitter = '';
  return shell;
};

const strobeShell = (size = 4) => {
  const color = randomColor({ limitWhite: true });
  return {
    shellSize: size, spreadSize: 280 + size * 92, starLife: 1100 + size * 200, starLifeVariation: 0.40,
    starDensity: 1.1, color, glitter: 'light', glitterColor: COLOR.White, strobe: true,
    strobeColor: Math.random() < 0.5 ? COLOR.White : null, pistil: Math.random() < 0.5, pistilColor: makePistilColor(color)
  };
};

const palmShell = (size = 4) => {
  const color = randomColor();
  const thick = Math.random() < 0.5;
  return {
    shellSize: size, color, spreadSize: 250 + size * 75, starDensity: thick ? 0.15 : 0.4,
    starLife: 1800 + size * 200, glitter: thick ? 'thick' : 'heavy'
  };
};

const ringShell = (size = 4) => {
  const color = randomColor();
  const pistil = Math.random() < 0.75;
  return {
    shellSize: size, ring: true, color, spreadSize: 300 + size * 100, starLife: 900 + size * 200,
    starCount: 2.2 * PI_2 * (size + 1), pistil, pistilColor: makePistilColor(color),
    glitter: !pistil ? 'light' : '', glitterColor: color === COLOR.Gold ? COLOR.Gold : COLOR.White,
    streamers: Math.random() < 0.3
  };
};

const crossetteShell = (size = 4) => {
  const color = randomColor({ limitWhite: true });
  return {
    shellSize: size, spreadSize: 300 + size * 100, starLife: 750 + size * 160, starLifeVariation: 0.4,
    starDensity: 0.85, color, crossette: true, pistil: Math.random() < 0.5, pistilColor: makePistilColor(color)
  };
};

const floralShell = (size = 4) => ({
  shellSize: size, spreadSize: 300 + size * 120, starDensity: 0.12, starLife: 500 + size * 50,
  starLifeVariation: 0.5, color: Math.random() < 0.65 ? 'random' : (Math.random() < 0.15 ? randomColor() : [randomColor(), randomColor({ notSame: true })]), floral: true
});

const fallingLeavesShell = (size = 4) => ({
  shellSize: size, color: INVISIBLE, spreadSize: 300 + size * 120, starDensity: 0.12, starLife: 500 + size * 50,
  starLifeVariation: 0.5, glitter: 'medium', glitterColor: COLOR.Gold, fallingLeaves: true
});

const willowShell = (size = 4) => ({
  shellSize: size, spreadSize: 300 + size * 100, starDensity: 0.6, starLife: 3000 + size * 300,
  glitter: 'willow', glitterColor: COLOR.Gold, color: INVISIBLE
});

const crackleShell = (size = 4) => {
  const color = Math.random() < 0.75 ? COLOR.Gold : randomColor();
  return {
    shellSize: size, spreadSize: 380 + size * 75, starDensity: 1, starLife: 600 + size * 100,
    starLifeVariation: 0.32, glitter: 'light', glitterColor: COLOR.Gold, color, crackle: true,
    pistil: Math.random() < 0.65, pistilColor: makePistilColor(color)
  };
};

const horsetailShell = (size = 4) => {
  const color = randomColor();
  return {
    shellSize: size, horsetail: true, color, spreadSize: 250 + size * 38, starDensity: 0.9,
    starLife: 2500 + size * 300, glitter: 'medium', glitterColor: Math.random() < 0.5 ? whiteOrGold() : color,
    strobe: color === COLOR.White
  };
};

const shellTypes = {
  'Crackle': crackleShell, 'Crossette': crossetteShell, 'Crysanthemum': crysanthemumShell,
  'Falling Leaves': fallingLeavesShell, 'Floral': floralShell, 'Ghost': ghostShell,
  'Horse Tail': horsetailShell, 'Palm': palmShell, 'Ring': ringShell,
  'Strobe': strobeShell, 'Willow': willowShell
};

const shellNames = Object.keys(shellTypes);

class Shell {
  constructor(options) {
    Object.assign(this, options);
    this.starLifeVariation = options.starLifeVariation || 0.125;
    this.color = options.color || randomColor();
    this.glitterColor = options.glitterColor || this.color;

    if (!this.starCount) {
      const density = options.starDensity || 1;
      const scaledSize = this.spreadSize / 54;
      this.starCount = Math.max(6, scaledSize * scaledSize * density);
    }
  }

  launch(position, launchHeight) {
    const width = stageW; const height = stageH;
    const hpad = 60; const vpad = 50;
    const minHeightPercent = 0.45;
    const minHeight = height - height * minHeightPercent;

    const launchX = position * (width - hpad * 2) + hpad;
    const launchY = height;
    const burstY = minHeight - (launchHeight * (minHeight - vpad));

    const launchDistance = launchY - burstY;
    const launchVelocity = Math.pow(launchDistance * 0.04, 0.64);

    const comet = this.comet = Star.add(
      launchX, launchY,
      typeof this.color === 'string' && this.color !== INVISIBLE ? this.color : COLOR.White,
      Math.PI, launchVelocity * (this.horsetail ? 1.2 : 1),
      launchVelocity * (this.horsetail ? 100 : 400)
    );

    comet.heavy = true;
    comet.spinRadius = MyMath.random(0.32, 0.85);
    comet.sparkFreq = 12; comet.sparkLife = 320; comet.sparkLifeVariation = 3;
    if (this.color === INVISIBLE) comet.sparkColor = COLOR.Gold;

    if (Math.random() > 0.4 && !this.horsetail) {
      comet.secondColor = INVISIBLE;
      comet.transitionTime = Math.pow(Math.random(), 1.5) * 700 + 500;
    }

    comet.onDeath = c => this.burst(c.x, c.y);
    soundManager.playSound('lift');
  }

  burst(x, y) {
    const speed = this.spreadSize / 96;
    let color, onDeath, sparkFreq, sparkSpeed, sparkLife;
    let sparkLifeVariation = 0.25;
    let playedDeathSound = false;

    if (this.crossette) onDeath = star => {
      if (!playedDeathSound) { soundManager.playSound('crackleSmall'); playedDeathSound = true; }
      crossetteEffect(star);
    };
    if (this.crackle) onDeath = star => {
      if (!playedDeathSound) { soundManager.playSound('crackle'); playedDeathSound = true; }
      crackleEffect(star);
    };
    if (this.floral) onDeath = floralEffect;
    if (this.fallingLeaves) onDeath = fallingLeavesEffect;

    if (this.glitter === 'light') { sparkFreq = 400; sparkSpeed = 0.3; sparkLife = 300; sparkLifeVariation = 2; }
    else if (this.glitter === 'medium') { sparkFreq = 200; sparkSpeed = 0.44; sparkLife = 700; sparkLifeVariation = 2; }
    else if (this.glitter === 'heavy') { sparkFreq = 80; sparkSpeed = 0.8; sparkLife = 1400; sparkLifeVariation = 2; }
    else if (this.glitter === 'thick') { sparkFreq = 16; sparkSpeed = 1.5; sparkLife = 1400; sparkLifeVariation = 3; }
    else if (this.glitter === 'streamer') { sparkFreq = 32; sparkSpeed = 1.05; sparkLife = 620; sparkLifeVariation = 2; }
    else if (this.glitter === 'willow') { sparkFreq = 120; sparkSpeed = 0.34; sparkLife = 1400; sparkLifeVariation = 3.8; }

    const starFactory = (angle, speedMult) => {
      const standardInitialSpeed = this.spreadSize / 1800;
      const star = Star.add(
        x, y, color || randomColor(), angle, speedMult * speed,
        this.starLife + Math.random() * this.starLife * this.starLifeVariation,
        this.horsetail ? this.comet && this.comet.speedX : 0,
        this.horsetail ? this.comet && this.comet.speedY : -standardInitialSpeed
      );

      if (this.secondColor) {
        star.transitionTime = this.starLife * (Math.random() * 0.05 + 0.32);
        star.secondColor = this.secondColor;
      }
      if (this.strobe) {
        star.transitionTime = this.starLife * (Math.random() * 0.08 + 0.46);
        star.strobe = true;
        star.strobeFreq = Math.random() * 20 + 40;
        if (this.strobeColor) star.secondColor = this.strobeColor;
      }
      star.onDeath = onDeath;
      if (this.glitter) {
        star.sparkFreq = sparkFreq; star.sparkSpeed = sparkSpeed;
        star.sparkLife = sparkLife; star.sparkLifeVariation = sparkLifeVariation;
        star.sparkColor = this.glitterColor; star.sparkTimer = Math.random() * star.sparkFreq;
      }
    };

    if (typeof this.color === 'string') {
      color = this.color === 'random' ? null : this.color;
      if (this.ring) {
        const ringStartAngle = Math.random() * Math.PI;
        const ringSquash = Math.pow(Math.random(), 2) * 0.85 + 0.15;
        createParticleArc(0, PI_2, this.starCount, 0, angle => {
          const initSpeedX = Math.sin(angle) * speed * ringSquash;
          const initSpeedY = Math.cos(angle) * speed;
          const newSpeed = MyMath.pointDist(0, 0, initSpeedX, initSpeedY);
          const newAngle = MyMath.pointAngle(0, 0, initSpeedX, initSpeedY) + ringStartAngle;
          const star = Star.add(x, y, color, newAngle, newSpeed, this.starLife + Math.random() * this.starLife * this.starLifeVariation);
          if (this.glitter) {
            star.sparkFreq = sparkFreq; star.sparkSpeed = sparkSpeed;
            star.sparkLife = sparkLife; star.sparkLifeVariation = sparkLifeVariation;
            star.sparkColor = this.glitterColor; star.sparkTimer = Math.random() * star.sparkFreq;
          }
        });
      } else {
        createBurst(this.starCount, starFactory);
      }
    } else if (Array.isArray(this.color)) {
      if (Math.random() < 0.5) {
        const start = Math.random() * Math.PI; const start2 = start + Math.PI; const arc = Math.PI;
        color = this.color[0]; createBurst(this.starCount, starFactory, start, arc);
        color = this.color[1]; createBurst(this.starCount, starFactory, start2, arc);
      } else {
        color = this.color[0]; createBurst(this.starCount / 2, starFactory);
        color = this.color[1]; createBurst(this.starCount / 2, starFactory);
      }
    }

    if (this.pistil) {
      const innerShell = new Shell({
        spreadSize: this.spreadSize * 0.5, starLife: this.starLife * 0.6,
        starLifeVariation: this.starLifeVariation, starDensity: 1.4,
        color: this.pistilColor, glitter: 'light', glitterColor: this.pistilColor === COLOR.Gold ? COLOR.Gold : COLOR.White
      });
      innerShell.burst(x, y);
    }
    if (this.streamers) {
      const innerShell = new Shell({
        spreadSize: this.spreadSize * 0.9, starLife: this.starLife * 0.8,
        starLifeVariation: this.starLifeVariation, starCount: Math.floor(Math.max(6, this.spreadSize / 45)),
        color: COLOR.White, glitter: 'streamer'
      });
      innerShell.burst(x, y);
    }

    const colorHex = typeof this.color === 'string' && this.color !== INVISIBLE ? this.color : COLOR.White;
    const tuple = COLOR_TUPLES[colorHex] || { r: 255, g: 220, b: 150 };
    BurstFlash.add(x, y, this.spreadSize / 3.5, tuple);

    if (this.comet) {
      soundManager.playSound('burst', 0.85);
    }
  }
}

let trailsStage, mainStage;
let stageW, stageH;
let currentFrame = 0;
let isFireworksActive = false;

/* ==================================================
   DYNAMIC ENVIRONMENTAL LIGHTING SYSTEM
   ================================================== */
const currentEnvLight = { r: 0, g: 0, b: 0, a: 0, x: 0.5, y: 0.4 };
const targetEnvLight = { r: 0, g: 0, b: 0, a: 0, x: 0.5, y: 0.4 };

function updateEnvironmentLighting(speed) {
  let totalR = 0, totalG = 0, totalB = 0, totalWeight = 0;
  let weightedX = 0, weightedY = 0;

  COLOR_CODES.forEach(colorHex => {
    const stars = Star.active[colorHex];
    const count = stars ? stars.length : 0;
    if (count > 0) {
      const tuple = COLOR_TUPLES[colorHex] || { r: 255, g: 220, b: 150 };
      totalR += tuple.r * count;
      totalG += tuple.g * count;
      totalB += tuple.b * count;
      totalWeight += count;
    }
  });

  BurstFlash.active.forEach(bf => {
    const burstWeight = 180;
    const tuple = bf.colorTuple || { r: 255, g: 220, b: 150 };
    totalR += tuple.r * burstWeight;
    totalG += tuple.g * burstWeight;
    totalB += tuple.b * burstWeight;
    weightedX += (bf.x / stageW) * burstWeight;
    weightedY += (bf.y / stageH) * burstWeight;
    totalWeight += burstWeight;
  });

  if (totalWeight > 0) {
    targetEnvLight.r = totalR / totalWeight;
    targetEnvLight.g = totalG / totalWeight;
    targetEnvLight.b = totalB / totalWeight;
    targetEnvLight.x = weightedX > 0 ? (weightedX / totalWeight) : 0.5;
    targetEnvLight.y = weightedY > 0 ? (weightedY / totalWeight) : 0.4;

    const maxDensity = 350;
    const rawIntensity = Math.min(1.0, totalWeight / maxDensity);
    targetEnvLight.a = Math.pow(rawIntensity, 0.42) * 0.36;
  } else {
    targetEnvLight.a = 0;
  }

  const lerpSpeed = 0.10 * speed;
  currentEnvLight.r += (targetEnvLight.r - currentEnvLight.r) * lerpSpeed;
  currentEnvLight.g += (targetEnvLight.g - currentEnvLight.g) * lerpSpeed;
  currentEnvLight.b += (targetEnvLight.b - currentEnvLight.b) * lerpSpeed;
  currentEnvLight.a += (targetEnvLight.a - currentEnvLight.a) * lerpSpeed;
  currentEnvLight.x += (targetEnvLight.x - currentEnvLight.x) * lerpSpeed;
  currentEnvLight.y += (targetEnvLight.y - currentEnvLight.y) * lerpSpeed;

  const flashOverlay = document.getElementById('firework-flash-overlay');
  if (flashOverlay) {
    if (currentEnvLight.a > 0.005) {
      const r = currentEnvLight.r | 0;
      const g = currentEnvLight.g | 0;
      const b = currentEnvLight.b | 0;
      const a = currentEnvLight.a.toFixed(3);
      const posX = (currentEnvLight.x * 100).toFixed(1);
      const posY = (currentEnvLight.y * 100).toFixed(1);

      flashOverlay.style.background = `radial-gradient(circle at ${posX}% ${posY}%, rgba(${r}, ${g}, ${b}, ${a}) 0%, rgba(${r}, ${g}, ${b}, ${(a * 0.45).toFixed(3)}) 55%, rgba(${r}, ${g}, ${b}, 0) 85%)`;
      flashOverlay.style.opacity = '1';
    } else {
      flashOverlay.style.opacity = '0';
    }
  }
}

function initFireworksEngine() {
  trailsStage = new Stage('trails-canvas');
  mainStage = new Stage('main-canvas');

  function handleResize() {
    const container = document.getElementById('fireworks-canvas-container');
    const w = container.clientWidth;
    const h = container.clientHeight;

    trailsStage.resize(w, h);
    mainStage.resize(w, h);

    stageW = w / Config.scaleFactor;
    stageH = h / Config.scaleFactor;
  }

  window.addEventListener('resize', handleResize);
  handleResize();

  mainStage.addEventListener('ticker', (frameTime, lag) => {
    if (!isFireworksActive) return;

    currentFrame++;
    const timeStep = frameTime * simSpeed;
    const speed = simSpeed * lag;

    const starDrag = 1 - (1 - Star.airDrag) * speed;
    const starDragHeavy = 1 - (1 - Star.airDragHeavy) * speed;
    const sparkDrag = 1 - (1 - Spark.airDrag) * speed;
    const gAcc = (timeStep / 1000) * GRAVITY;

    COLOR_CODES_W_INVIS.forEach(color => {
      const stars = Star.active[color];
      for (let i = stars.length - 1; i >= 0; i--) {
        const star = stars[i];
        if (star.updateFrame === currentFrame) continue;
        star.updateFrame = currentFrame;
        star.life -= timeStep;

        if (star.life <= 0) {
          stars.splice(i, 1);
          Star.returnInstance(star);
        } else {
          const burnRate = Math.pow(star.life / star.fullLife, 0.5);
          const burnRateInverse = 1 - burnRate;

          star.prevX = star.x; star.prevY = star.y;
          star.x += star.speedX * speed; star.y += star.speedY * speed;

          if (!star.heavy) { star.speedX *= starDrag; star.speedY *= starDrag; }
          else { star.speedX *= starDragHeavy; star.speedY *= starDragHeavy; }
          star.speedY += gAcc;

          if (star.spinRadius) {
            star.spinAngle += star.spinSpeed * speed;
            star.x += Math.sin(star.spinAngle) * star.spinRadius * speed;
            star.y += Math.cos(star.spinAngle) * star.spinRadius * speed;
          }

          if (star.sparkFreq) {
            star.sparkTimer -= timeStep;
            while (star.sparkTimer < 0) {
              star.sparkTimer += star.sparkFreq * 0.75 + star.sparkFreq * burnRateInverse * 4;
              Spark.add(star.x, star.y, star.sparkColor, Math.random() * PI_2, Math.random() * star.sparkSpeed * burnRate, star.sparkLife * 0.8 + Math.random() * star.sparkLifeVariation * star.sparkLife);
            }
          }

          if (star.life < star.transitionTime) {
            if (star.secondColor && !star.colorChanged) {
              star.colorChanged = true;
              star.color = star.secondColor;
              stars.splice(i, 1);
              Star.active[star.secondColor].push(star);
              if (star.secondColor === INVISIBLE) star.sparkFreq = 0;
            }
            if (star.strobe) {
              star.visible = Math.floor(star.life / star.strobeFreq) % 3 === 0;
            }
          }
        }
      }

      const sparks = Spark.active[color];
      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        spark.life -= timeStep;
        if (spark.life <= 0) {
          sparks.splice(i, 1);
          Spark.returnInstance(spark);
        } else {
          spark.prevX = spark.x; spark.prevY = spark.y;
          spark.x += spark.speedX * speed; spark.y += spark.speedY * speed;
          spark.speedX *= sparkDrag; spark.speedY *= sparkDrag;
          spark.speedY += gAcc;
        }
      }
    });

    renderFireworks(speed);
  });
}

function renderFireworks(speed) {
  const { dpr } = mainStage;
  const trailsCtx = trailsStage.ctx;
  const mainCtx = mainStage.ctx;
  const width = stageW; const height = stageH;

  const scale = Config.scaleFactor;
  trailsCtx.scale(dpr * scale, dpr * scale);
  mainCtx.scale(dpr * scale, dpr * scale);

  // PRESERVE GARDEN VISIBILITY: Use 'destination-out' to fade particle trails to transparent instead of dark fill!
  trailsCtx.globalCompositeOperation = 'destination-out';
  trailsCtx.fillStyle = `rgba(0, 0, 0, ${0.12 * speed})`;
  trailsCtx.fillRect(0, 0, width, height);

  mainCtx.clearRect(0, 0, width, height);

  while (BurstFlash.active.length) {
    const bf = BurstFlash.active.pop();
    const tuple = bf.colorTuple || { r: 255, g: 200, b: 120 };
    const grad = trailsCtx.createRadialGradient(bf.x, bf.y, 0, bf.x, bf.y, bf.radius);
    grad.addColorStop(0, `rgba(${tuple.r}, ${tuple.g}, ${tuple.b}, 0.85)`);
    grad.addColorStop(0.35, `rgba(${tuple.r}, ${tuple.g}, ${tuple.b}, 0.25)`);
    grad.addColorStop(1, `rgba(${tuple.r}, ${tuple.g}, ${tuple.b}, 0)`);
    trailsCtx.fillStyle = grad;
    trailsCtx.fillRect(bf.x - bf.radius, bf.y - bf.radius, bf.radius * 2, bf.radius * 2);
    BurstFlash.returnInstance(bf);
  }

  trailsCtx.globalCompositeOperation = 'lighten';
  trailsCtx.lineWidth = Star.drawWidth;

  COLOR_CODES.forEach(color => {
    const stars = Star.active[color];
    trailsCtx.strokeStyle = color;
    trailsCtx.beginPath();
    stars.forEach(star => {
      if (star.visible) {
        trailsCtx.moveTo(star.x, star.y);
        trailsCtx.lineTo(star.prevX, star.prevY);
      }
    });
    trailsCtx.stroke();
  });

  COLOR_CODES.forEach(color => {
    const sparks = Spark.active[color];
    trailsCtx.strokeStyle = color;
    trailsCtx.beginPath();
    sparks.forEach(spark => {
      trailsCtx.moveTo(spark.x, spark.y);
      trailsCtx.lineTo(spark.prevX, spark.prevY);
    });
    trailsCtx.stroke();
  });

  trailsCtx.setTransform(1, 0, 0, 1, 0, 0);
  mainCtx.setTransform(1, 0, 0, 1, 0, 0);

  // Update Dynamic Scene Lighting
  updateEnvironmentLighting(speed);
}

let finaleInterval = null;

function launchFinaleBatch() {
  if (!isFireworksActive) return;
  // Launch 1 to 4 12-inch shells simultaneously per batch
  const shellCount = Math.floor(Math.random() * 4) + 1;

  for (let i = 0; i < shellCount; i++) {
    const shellName = MyMath.randomChoice(shellNames);
    const size = 4; // 12-inch shells
    const shellObj = shellTypes[shellName](size);
    const shell = new Shell(shellObj);

    const posX = MyMath.random(0.15, 0.85);
    const posY = MyMath.random(0.35, 0.85);

    setTimeout(() => {
      if (isFireworksActive) shell.launch(posX, posY);
    }, i * MyMath.random(60, 180));
  }
}

function startFinaleCelebration() {
  isFireworksActive = true;
  const container = document.getElementById('fireworks-canvas-container');
  if (container) container.classList.add('active');

  const moonlitScene = document.getElementById('moonlit-sky-scene');
  if (moonlitScene) moonlitScene.classList.add('at-end');

  launchFinaleBatch();
  finaleInterval = setInterval(launchFinaleBatch, 1100);
}

function stopFinaleCelebration() {
  clearInterval(finaleInterval);
}

/* ==================================================
   9. HANDWRITING ANIMATION SYSTEM
   ================================================== */
class HandwritingSystem {
  constructor(svgElement, penTipElement, particleSystem) {
    this.svg = svgElement;
    this.penTip = penTipElement;
    this.strokeGroup = svgElement.querySelector('#stroke-group');
    this.particleSystem = particleSystem;
    this.paths = [];
    this.isWriting = false;

    this.buildPaths();
  }

  buildPaths() {
    this.strokeGroup.innerHTML = '';
    this.paths = [];

    Config.initials.strokes.forEach(strokeConfig => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('id', strokeConfig.id);
      path.setAttribute('d', strokeConfig.d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', strokeConfig.color);
      path.setAttribute('stroke-width', strokeConfig.strokeWidth);
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      path.classList.add('handwritten-path');

      this.strokeGroup.appendChild(path);

      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length} ${length}`;
      path.style.strokeDashoffset = `${length}`;

      this.paths.push({ element: path, length, duration: strokeConfig.duration, config: strokeConfig });
    });

    if (this.penTip) this.penTip.style.opacity = '0';
  }

  async animateAll() {
    this.isWriting = true;
    if (Utils.prefersReducedMotion()) {
      this.paths.forEach(p => p.element.style.strokeDashoffset = '0');
      if (this.penTip) this.penTip.style.opacity = '0';
      this.isWriting = false;
      return;
    }

    if (this.penTip) this.penTip.style.opacity = '1';

    for (let i = 0; i < this.paths.length; i++) {
      await this.animateStroke(this.paths[i]);
      if (i < this.paths.length - 1) await Utils.wait(Config.timings.interStrokeDelay);
    }

    if (this.penTip) this.penTip.style.opacity = '0';
    this.isWriting = false;
  }

  animateStroke(pathData) {
    return new Promise(resolve => {
      const path = pathData.element;
      const totalLength = pathData.length;
      const duration = pathData.duration;
      const startTime = performance.now();

      const step = now => {
        const elapsed = now - startTime;
        const progress = Utils.clamp(elapsed / duration, 0, 1);
        const eased = Utils.easeInOutCubic(progress);

        path.style.strokeDashoffset = `${totalLength * (1 - eased)}`;
        const pointLength = totalLength * eased;
        if (pointLength >= 0 && pointLength <= totalLength) {
          const point = path.getPointAtLength(pointLength);
          this.updatePenTipPosition(point);
        }

        if (progress < 1) requestAnimationFrame(step);
        else { path.style.strokeDashoffset = '0'; resolve(); }
      };

      requestAnimationFrame(step);
    });
  }

  updatePenTipPosition(point) {
    if (!this.penTip) return;
    this.penTip.setAttribute('cx', point.x);
    this.penTip.setAttribute('cy', point.y);

    const ctm = this.svg.getScreenCTM();
    if (ctm && this.particleSystem) {
      const svgPoint = this.svg.createSVGPoint();
      svgPoint.x = point.x; svgPoint.y = point.y;
      const clientPoint = svgPoint.matrixTransform(ctm);
      this.particleSystem.addStardustSpark(clientPoint.x, clientPoint.y);
    }
  }

  applySoftGlow() { this.svg.classList.add('has-soft-glow'); }
  reset() { this.svg.classList.remove('has-soft-glow'); this.buildPaths(); }
}

/* ==================================================
   10. SCENE MANAGER & CELEBRATION TRIGGER
   ================================================== */
class SceneManager {
  constructor(particleSystem, grassSystem) {
    this.particleSystem = particleSystem;
    this.grassSystem = grassSystem;

    this.loadingScene = document.getElementById('loading-scene');
    this.moonlitSkyScene = document.getElementById('moonlit-sky-scene');
    this.paperContainer = document.getElementById('paper-container');
    this.focusOverlay = document.getElementById('scroll-focus-overlay');
    this.fireworkFlashOverlay = document.getElementById('firework-flash-overlay');
    this.memoryLaneFoundation = document.getElementById('memory-lane-foundation');
    this.memoryLaneScrapbook = document.getElementById('memory-lane-scrapbook');
    this.scrapbookTrack = document.getElementById('scrapbook-track');
    this.finalMessageContainer = document.getElementById('final-message-container');
    this.finalMessageContent = document.getElementById('final-message-content');
    
    this.letterLines = document.querySelectorAll('.letter-line, .letter-divider');
    this.continueContainer = document.getElementById('continue-container');
    this.continueBtn = document.getElementById('continue-btn');
    
    this.hasReachedEndOfPath = false;
    this.isTransitioning = false;

    this.initEvents();
    this.buildScrapbookDOM();
    this.buildFinalMessageDOM();
  }

  initEvents() {
    if (this.continueBtn) {
      this.continueBtn.addEventListener('click', e => this.handleContinueClick(e));
    }
  }

  buildScrapbookDOM() {
    if (!this.scrapbookTrack || !Config.memories) return;
    this.scrapbookTrack.innerHTML = '';

    Config.memories.forEach((mem, idx) => {
      const card = document.createElement('article');
      const isPolaroid = mem.type === 'polaroid';
      card.className = `memory-card ${isPolaroid ? 'card-polaroid' : 'card-postcard'} memory-${idx + 1}`;
      card.setAttribute('data-index', idx);

      let accentHTML = '';
      if (mem.accent === 'tape-top-right') accentHTML = '<div class="masking-tape tape-top-right"></div>';
      else if (mem.accent === 'tape-top-left') accentHTML = '<div class="masking-tape tape-top-left"></div>';
      else if (mem.accent === 'pressed-flower') accentHTML = '<div class="pressed-flower-accent">✿</div>';
      else if (mem.accent === 'pressed-leaf') accentHTML = '<div class="pressed-leaf-accent">🍃</div>';

      let headerHTML = isPolaroid ? '' : `
        <div class="postcard-header">
          <span class="postmark-circle">✦</span>
          <span class="postcard-stamp">${mem.accent === 'stamp-air' ? 'AIR' : 'POST'}</span>
        </div>
      `;

      const fallbackSrc = Utils.generateFallbackSVG(mem.fallbackRoman || 'I');

      // Create img natively in JS to avoid inline onerror security blocks
      const img = document.createElement('img');
      img.className = 'memory-photo';
      img.alt = 'Memory Photo';
      img.loading = 'lazy';
      img.src = mem.image;
      img.onerror = () => { img.onerror = null; img.src = fallbackSrc; };

      card.innerHTML = `
        ${accentHTML}
        <div class="frame-body">
          ${headerHTML}
          <div class="photo-wrapper">
            <div class="photo-overlay-glare"></div>
          </div>
          <div class="caption-area">
            <span class="card-number">${mem.number}</span>
            <p class="caption-text">${mem.caption}</p>
          </div>
        </div>
      `;

      card.querySelector('.photo-wrapper').appendChild(img);
      this.scrapbookTrack.appendChild(card);
    });

    const endSpacer = document.createElement('div');
    endSpacer.className = 'end-of-path-spacer';
    endSpacer.innerHTML = '<div class="path-fade-end"></div>';
    this.scrapbookTrack.appendChild(endSpacer);

    this.memoryCards = document.querySelectorAll('.memory-card');
    this.initScrapbookScroll();
  }

  buildFinalMessageDOM() {
    if (!this.finalMessageContent || !Config.finalMessage) return;
    this.finalMessageContent.innerHTML = '';

    Config.finalMessage.lines.forEach(lineObj => {
      const p = document.createElement('p');
      let text = lineObj.text;
      text = text.replace('{{recipientName}}', Config.finalMessage.recipientName || 'My Dearest');
      text = text.replace('{{signature}}', Config.finalMessage.signature || '— Atif');

      p.className = `final-message-line ${lineObj.class || ''}`;
      p.textContent = text;
      this.finalMessageContent.appendChild(p);
    });

    this.finalMessageLines = document.querySelectorAll('.final-message-line');
  }

  initScrapbookScroll() {
    if (!this.memoryLaneScrapbook) return;

    this.memoryLaneScrapbook.addEventListener('wheel', e => {
      if (this.memoryLaneScrapbook.classList.contains('active') && !this.hasReachedEndOfPath) {
        e.preventDefault();
        this.memoryLaneScrapbook.scrollLeft += (e.deltaY || e.deltaX) * 1.2;
        this.checkScrollEnd();
      }
    }, { passive: false });

    this.memoryLaneScrapbook.addEventListener('scroll', Utils.debounce(() => this.checkScrollEnd(), 60));

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      }, { root: this.memoryLaneScrapbook, threshold: 0.10 });

      this.memoryCards.forEach(card => observer.observe(card));
    } else {
      this.memoryCards.forEach(card => card.classList.add('in-view'));
    }
  }

  checkScrollEnd() {
    if (!this.memoryLaneScrapbook || this.hasReachedEndOfPath || !this.memoryCards || !this.memoryCards.length) return;

    const maxScroll = this.memoryLaneScrapbook.scrollWidth - this.memoryLaneScrapbook.clientWidth;
    const currentScroll = this.memoryLaneScrapbook.scrollLeft;

    if (currentScroll >= maxScroll - 60) {
      this.triggerCelebrationSequence();
    }
  }

  async triggerCelebrationSequence() {
    if (this.hasReachedEndOfPath) return;
    this.hasReachedEndOfPath = true;

    // 1. Detect when visitor reaches final memory card & center it smoothly
    const lastCard = this.memoryCards[this.memoryCards.length - 1];
    if (lastCard && this.memoryLaneScrapbook) {
      const targetScroll = lastCard.offsetLeft - (this.memoryLaneScrapbook.clientWidth - lastCard.clientWidth) / 2;
      this.memoryLaneScrapbook.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
    }

    // 2. Prevent any further scrolling
    this.memoryLaneScrapbook.classList.add('is-locked');

    // 3. Wait 1 second
    await Utils.wait(1000);

    // 4. Gracefully fade out all memory cards while keeping Moonlit Garden visible
    if (this.scrapbookTrack) {
      this.scrapbookTrack.classList.add('fade-out');
    }

    // 5. Duck ambient soundtrack
    setAmbientAudioDucking(true);

    // 6. Start integrated firework celebration
    startFinaleCelebration();

    // 7. Run celebration launches
    await Utils.wait(Config.celebrationDuration);

    // 8. Cease NEW shell launches
    stopFinaleCelebration();

    // 9. Allow remaining particles, comets, trails & smoke to decay naturally (~4.5s)
    await Utils.wait(4500);

    // 10. Restore ambient audio & smoothly fade out fireworks canvas container (~3.5s)
    setAmbientAudioDucking(false);

    const fwContainer = document.getElementById('fireworks-canvas-container');
    if (fwContainer) fwContainer.classList.remove('active');

    await Utils.wait(3500);

    // 11. Shutdown active state
    isFireworksActive = false;

    // 12. Calm, elegant transition to final birthday message
    this.revealFinalMessage();
  }

  async revealFinalMessage() {
    if (!this.finalMessageLines) return;
    for (let el of this.finalMessageLines) {
      el.classList.add('visible');
      await Utils.wait(Config.timings.finalLineRevealInterval);
    }
  }

  async fadeOutLoadingScene() {
    if (!this.loadingScene) return;
    if (this.moonlitSkyScene) this.moonlitSkyScene.classList.add('active');
    this.loadingScene.classList.add('dissolving');
    await Utils.wait(Config.timings.fadeSceneDuration);
    this.loadingScene.style.display = 'none';
  }

  async bringInPaperRoll() {
    if (!this.paperContainer) return;
    if (this.focusOverlay) this.focusOverlay.classList.add('active');
    this.paperContainer.classList.add('arrived');
    await Utils.wait(1000);
  }

  async unfurlPaper() {
    if (!this.paperContainer) return;
    this.paperContainer.classList.add('unfurled');
    await Utils.wait(Config.timings.unfurlDuration);
  }

  async revealLetterLineByLine() {
    if (!this.letterLines) return;
    for (let el of this.letterLines) {
      el.classList.add('visible');
      await Utils.wait(Config.timings.lineRevealInterval);
    }
  }

  async showContinueInteraction() {
    if (this.continueContainer) this.continueContainer.classList.add('visible');
  }

  async handleContinueClick(e) {
    if (e) e.preventDefault();
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    if (this.continueBtn) this.continueBtn.style.pointerEvents = 'none';
    if (this.paperContainer) this.paperContainer.classList.add('rolling-up');
    await Utils.wait(1400);

    if (this.paperContainer) this.paperContainer.classList.add('ascending');
    await Utils.wait(1400);

    if (this.focusOverlay) this.focusOverlay.style.opacity = '0.14';
    if (this.memoryLaneFoundation) this.memoryLaneFoundation.classList.add('active');
    await Utils.wait(800);

    if (this.memoryLaneScrapbook) this.memoryLaneScrapbook.classList.add('active');

    // Force cards in view when scrapbook becomes active
    if (this.memoryCards) {
      this.memoryCards.forEach(card => card.classList.add('in-view'));
    }

    this.isTransitioning = false;
  }
}

/* ==================================================
   11. TIMELINE MANAGER & INITIALIZATION
   ================================================== */
class TimelineManager {
  constructor(handwritingSystem, sceneManager) {
    this.handwriting = handwritingSystem;
    this.sceneManager = sceneManager;
    this.subtitleContainer = document.getElementById('subtitle-container');
  }

  async runSequence() {
    await Utils.wait(Config.timings.initialPause);
    await this.handwriting.animateAll();
    await Utils.wait(Config.timings.glowDelay);
    this.handwriting.applySoftGlow();

    await Utils.wait(Config.timings.subtitleDelay);
    if (this.subtitleContainer) this.subtitleContainer.classList.add('visible');

    await Utils.wait(Config.timings.subtitleHold);
    await this.sceneManager.fadeOutLoadingScene();

    await Utils.wait(Config.timings.gardenAdmirePause);
    await this.sceneManager.bringInPaperRoll();

    await Utils.wait(Config.timings.rollPauseBeforeUnfurl);
    await this.sceneManager.unfurlPaper();

    await Utils.wait(Config.timings.pauseBeforeLetterReveal);
    await this.sceneManager.revealLetterLineByLine();

    await Utils.wait(Config.timings.pauseBeforeContinue);
    await this.sceneManager.showContinueInteraction();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  soundManager.init();
  initFireworksEngine();

  const particleCanvas = document.getElementById('particle-canvas');
  const grassCanvas = document.getElementById('grass-canvas');
  const svg = document.getElementById('initials-svg');
  const penTip = document.getElementById('pen-tip');

  const particleSystem = new ParticleSystem(particleCanvas);
  const grassSystem = new GrassSystem(grassCanvas);
  const responsiveSystem = new ResponsiveSystem(particleCanvas, grassCanvas, particleSystem, grassSystem);
  const handwritingSystem = new HandwritingSystem(svg, penTip, particleSystem);
  const sceneManager = new SceneManager(particleSystem, grassSystem);
  const timelineManager = new TimelineManager(handwritingSystem, sceneManager);

  responsiveSystem.handleResize();
  particleSystem.start();
  grassSystem.start();

  timelineManager.runSequence();

  // Resume AudioContext on user interaction
  const unlockAudio = () => { soundManager.resume(); };
  window.addEventListener('click', unlockAudio, { once: true });
  window.addEventListener('touchstart', unlockAudio, { once: true });
});
