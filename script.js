/**
 * Cinematic Environment Engine (Version 4.6 Procedural Scraps & Dissolves)
 * Namespace structure to manage lifecycle, states, and render threads.
 */

// Global high-performance paper audio triggers
const playPaperSound = (type) => {
  console.log(`Audio Event Triggered: paper_${type}`);
};

const GardenEngine = (() => {
  'use strict';

  // 1. Core Configuration Parameters
  const Config = {
    fpsLimit: 60,
    resizeDebounceDelay: 150,
  };

  // 2. Global State Engine
  const State = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    isInitialized: false,
    isActive: true,
    
    // Parallax displacements
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    parallaxSpeed: 0.05,
    
    isScrollOpening: false,
    isScrollOpened: false,
    isGalleryActive: false,
    isLoaded: false
  };

  // 3. Module Registry (To easily mount future visual sub-systems)
  const ActiveSystems = new Set();

  /**
   * Performance-optimized window resizing and device sensors manager.
   */
  const ResizeManager = {
    timer: null,

    init() {
      window.addEventListener('resize', this.handleResize.bind(this), { passive: true });
      window.addEventListener('orientationchange', this.handleResize.bind(this), { passive: true });
      this.bindInputs();
      this.updateViewportDimensions();
    },

    bindInputs() {
      const trackMove = (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        State.targetMouseX = (clientX / State.width) - 0.5;
        State.targetMouseY = (clientY / State.height) - 0.5;
      };

      window.addEventListener('mousemove', trackMove, { passive: true });
      window.addEventListener('touchmove', trackMove, { passive: true });

      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (e) => {
          if (!e.gamma || !e.beta) return;
          const tiltX = e.gamma / 45; 
          const tiltY = (e.beta - 45) / 45; 

          State.targetMouseX = Utils.clamp(tiltX, -0.5, 0.5);
          State.targetMouseY = Utils.clamp(tiltY, -0.5, 0.5);
        }, { passive: true });
      }
    },

    updateViewportDimensions() {
      State.width = window.innerWidth;
      State.height = window.innerHeight;
      State.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      ActiveSystems.forEach(system => {
        if (typeof system.onResize === 'function') {
          system.onResize(State.width, State.height, State.pixelRatio);
        }
      });
    },

    handleResize() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.updateViewportDimensions();
      }, Config.resizeDebounceDelay);
    }
  };

  /**
   * Centralized Animation Loop Manager.
   */
  const AnimationManager = {
    frameId: null,

    start() {
      State.lastFrameTime = performance.now();
      this.bindVisibilityTracker();
      this.loop(State.lastFrameTime);
    },

    bindVisibilityTracker() {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          State.isActive = false;
          if (this.frameId) cancelAnimationFrame(this.frameId);
        } else {
          State.isActive = true;
          State.lastFrameTime = performance.now();
          this.loop(State.lastFrameTime);
        }
      });
    },

    loop(currentTime) {
      if (!State.isActive) return;

      this.frameId = requestAnimationFrame(this.loop.bind(this));

      State.deltaTime = (currentTime - State.lastFrameTime) / 1000;
      State.lastFrameTime = currentTime;

      State.mouseX += (State.targetMouseX - State.mouseX) * State.parallaxSpeed;
      State.mouseY += (State.targetMouseY - State.mouseY) * State.parallaxSpeed;

      ActiveSystems.forEach(system => {
        if (typeof system.update === 'function') {
          system.update(State.deltaTime);
        }
        if (typeof system.render === 'function') {
          system.render();
        }
      });
    }
  };

  /**
   * Environment System (Version 1.3 Sub-System - Preserved)
   * Renders a highly performance-optimized slowly breathing atmospheric evening sky.
   */
  const EnvironmentSystem = {
    name: 'EnvironmentSystem',
    canvas: null,
    ctx: null,
    bufferWidth: 512,
    bufferHeight: 512,
    ambientTime: 0,
    ambientSpeed: 0.04,

    init(width, height, dpr) {
      this.canvas = document.getElementById('environment-canvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d', { alpha: false });
      this.onResize(width, height, dpr);
    },

    onResize(width, height, dpr) {
      if (!this.canvas) return;
      this.canvas.width = this.bufferWidth;
      this.canvas.height = this.bufferHeight;
    },

    update(dt) {
      this.ambientTime += this.ambientSpeed * dt;
    },

    render() {
      if (!this.ctx) return;

      const ctx = this.ctx;
      const w = this.bufferWidth;
      const h = this.bufferHeight;

      ctx.clearRect(0, 0, w, h);

      const px = State.mouseX * w * 0.003;
      const py = State.mouseY * h * 0.003;

      const baseGradient = ctx.createLinearGradient(0, 0, 0, h);
      baseGradient.addColorStop(0, 'hsla(230, 25%, 12%, 1)');
      baseGradient.addColorStop(0.5, 'hsla(260, 20%, 18%, 1)');
      baseGradient.addColorStop(1, 'hsla(265, 30%, 25%, 1)');
      ctx.fillStyle = baseGradient;
      ctx.fillRect(0, 0, w, h);

      const driftX = Math.sin(this.ambientTime) * (w * 0.15) + px;
      const driftY = Math.cos(this.ambientTime * 0.8) * (h * 0.08) + py;

      const horizonGlow = ctx.createRadialGradient(
        w * 0.5 + driftX,
        h * 0.85 + driftY,
        0,
        w * 0.5 + driftX,
        h * 0.85 + driftY,
        w * 0.6
      );
      horizonGlow.addColorStop(0, 'hsla(43, 50%, 75%, 0.15)');
      horizonGlow.addColorStop(0.5, 'hsla(350, 40%, 88%, 0.08)');
      horizonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, 0, w, h);

      const upperAtmosphereGlow = ctx.createRadialGradient(
        w * 0.35 - driftX * 0.5,
        h * 0.2 + driftY * 0.5,
        w * 0.1,
        w * 0.35 - driftX * 0.5,
        h * 0.2 + driftY * 0.5,
        w * 0.8
      );
      upperAtmosphereGlow.addColorStop(0, 'hsla(205, 35%, 84%, 0.12)');
      upperAtmosphereGlow.addColorStop(0.6, 'hsla(265, 30%, 82%, 0.04)');
      upperAtmosphereGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = upperAtmosphereGlow;
      ctx.fillRect(0, 0, w, h);

      const horizonHaze = ctx.createLinearGradient(0, h * 0.7, 0, h);
      horizonHaze.addColorStop(0, 'rgba(230, 220, 240, 0)');
      horizonHaze.addColorStop(1, 'hsla(260, 20%, 20%, 0.3)'); 
      ctx.fillStyle = horizonHaze;
      ctx.fillRect(0, h * 0.65, w, h * 0.35);
    }
  };

  /**
   * Moon System (Version 2.3 Refined - Preserved)
   * Manages the warm celestial moon coordinates, pre-rendered surfaces, and nested glow filters.
   */
  const MoonSystem = {
    name: 'MoonSystem',
    canvas: null,
    ctx: null,
    offscreenCanvas: null,
    offscreenCtx: null,
    centerX: 0,
    centerY: 0,
    radius: 0,
    glowTime: 0,
    glowSpeed: 0.35,

    init(width, height, dpr) {
      this.canvas = document.getElementById('moon-canvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.offscreenCanvas = document.createElement('canvas');
      this.offscreenCtx = this.offscreenCanvas.getContext('2d');

      this.onResize(width, height, dpr);
    },

    onResize(width, height, dpr) {
      if (!this.canvas) return;

      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
      this.ctx.scale(dpr, dpr);

      const isMobile = width < 600;
      this.centerX = width * (isMobile ? 0.66 : 0.74);
      this.centerY = height * (isMobile ? 0.24 : 0.28);
      
      const baseMeasurement = Math.min(width, height);
      this.radius = baseMeasurement * (isMobile ? 0.16 : 0.135);
      this.radius = Math.max(Math.min(this.radius, 200), 55);

      this.preRenderLunarSurface();
    },

    preRenderLunarSurface() {
      const dpr = State.pixelRatio;
      const size = Math.ceil(this.radius * 2 * dpr);
      const center = size / 2;
      const r = this.radius * dpr;

      this.offscreenCanvas.width = size;
      this.offscreenCanvas.height = size;
      const octx = this.offscreenCtx;

      octx.clearRect(0, 0, size, size);

      octx.save();
      octx.beginPath();
      octx.arc(center, center, r, 0, Math.PI * 2);
      octx.clip();

      const baseGrad = octx.createRadialGradient(
        center - r * 0.15,
        center - r * 0.15,
        r * 0.05,
        center,
        center,
        r
      );
      baseGrad.addColorStop(0, 'hsla(38, 55%, 94%, 1)');
      baseGrad.addColorStop(0.45, 'hsla(35, 45%, 88%, 1)');
      baseGrad.addColorStop(0.82, 'hsla(43, 50%, 82%, 1)');
      baseGrad.addColorStop(1, 'hsla(30, 10%, 65%, 1)');
      octx.fillStyle = baseGrad;
      octx.beginPath();
      octx.arc(center, center, r, 0, Math.PI * 2);
      octx.fill();

      octx.globalAlpha = 0.11;
      octx.fillStyle = 'hsla(25, 10%, 42%, 1)';
      const maria = [
        { x: center - r * 0.35, y: center - r * 0.25, r: r * 0.38 },
        { x: center - r * 0.15, y: center + r * 0.1, r: r * 0.28 },
        { x: center + r * 0.3, y: center - r * 0.45, r: r * 0.24 },
        { x: center + r * 0.35, y: center + r * 0.1, r: r * 0.32 },
        { x: center - r * 0.5, y: center + r * 0.3, r: r * 0.22 },
        { x: center + r * 0.05, y: center - r * 0.5, r: r * 0.18 }
      ];
      maria.forEach(m => {
        octx.beginPath();
        octx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        octx.filter = `blur(${r * 0.09}px)`;
        octx.fill();
      });
      octx.filter = 'none';
      octx.globalAlpha = 1.0;

      let seed = 123;
      const seededRandom = () => {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
      };

      const generateCraters = (count, maxR, shadowIntensity) => {
        for (let i = 0; i < count; i++) {
          const angle = seededRandom() * Math.PI * 2;
          const distance = Math.sqrt(seededRandom()) * r * 0.95;
          const cx = center + Math.cos(angle) * distance;
          const cy = center + Math.sin(angle) * distance;
          const cr = r * seededRandom() * maxR;

          octx.save();
          octx.beginPath();
          octx.arc(cx, cy, cr, 0, Math.PI * 2);
          octx.clip();

          octx.beginPath();
          octx.arc(cx - cr * 0.12, cy - cr * 0.12, cr, 0, Math.PI * 2);
          octx.fillStyle = `rgba(50, 42, 35, ${shadowIntensity * 0.26})`;
          octx.fill();

          octx.beginPath();
          octx.arc(cx + cr * 0.1, cy + cr * 0.1, cr, 0, Math.PI * 2);
          octx.strokeStyle = 'rgba(253, 246, 226, 0.45)';
          octx.lineWidth = Math.max(cr * 0.08, 0.5);
          octx.stroke();

          octx.restore();
        }
      };

      generateCraters(12, 0.08, 1.2);
      generateCraters(60, 0.025, 0.9);

      octx.restore();
    },

    update(dt) {
      this.glowTime += this.glowSpeed * dt;
    },

    render() {
      if (!this.ctx || !this.offscreenCanvas) return;

      const ctx = this.ctx;
      const r = this.radius;

      ctx.clearRect(0, 0, State.width, State.height);

      const px = State.mouseX * State.width * 0.007;
      const py = State.mouseY * State.height * 0.007;

      const x = this.centerX + px;
      const y = this.centerY + py;

      const breath = 1.0 + Math.sin(this.glowTime) * 0.15;

      ctx.globalCompositeOperation = 'screen';
      
      const outerGlow = ctx.createRadialGradient(x, y, r * 0.8, x, y, r * 5.0);
      outerGlow.addColorStop(0, `hsla(43, 50%, 75%, ${0.05 * breath})`);
      outerGlow.addColorStop(0.4, `hsla(350, 40%, 88%, ${0.02 * breath})`);
      outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(x, y, r * 5.0, 0, Math.PI * 2);
      ctx.fill();

      const ambientGlow = ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 3.0);
      ambientGlow.addColorStop(0, `hsla(43, 65%, 78%, ${0.09 * breath})`);
      ambientGlow.addColorStop(0.5, `hsla(38, 55%, 94%, ${0.03 * breath})`);
      ambientGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = ambientGlow;
      ctx.beginPath();
      ctx.arc(x, y, r * 3.0, 0, Math.PI * 2);
      ctx.fill();

      const coreGlow = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 1.5);
      coreGlow.addColorStop(0, `hsla(38, 55%, 94%, ${0.18 * breath})`);
      coreGlow.addColorStop(0.6, `hsla(43, 65%, 78%, ${0.06 * breath})`);
      coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(x, y, r * 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = 'source-over';

      const size = r * 2;
      ctx.drawImage(
        this.offscreenCanvas,
        0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height,
        x - r, y - r, size, size
      );
    }
  };

  /**
   * Star System (Version 2.3 Sub-System - Preserved)
   * Procedurally generates, clusters, and renders hundreds of organic, multi-depth stars.
   */
  const StarSystem = {
    name: 'StarSystem',
    canvas: null,
    ctx: null,
    stars: [],

    init(width, height, dpr) {
      this.canvas = document.getElementById('stars-canvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.onResize(width, height, dpr);
    },

    onResize(width, height, dpr) {
      if (!this.canvas) return;

      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
      this.ctx.scale(dpr, dpr);

      this.generateStarfield(width, height);
    },

    generateStarfield(width, height) {
      this.stars = [];
      const utils = Utils; 

      const area = width * height;
      const starCount = utils.clamp(Math.floor(area / 3200), 120, 500);

      const clusters = [];
      for (let c = 0; c < 5; c++) {
        clusters.push({
          x: utils.randomRange(width * 0.1, width * 0.9),
          y: utils.randomRange(height * 0.1, height * 0.6)
        });
      }

      for (let i = 0; i < starCount; i++) {
        let sx, sy;

        if (Math.random() < 0.65) {
          const parent = clusters[Math.floor(Math.random() * clusters.length)];
          const r = utils.randomRange(20, Math.min(width, height) * 0.25);
          const theta = Math.random() * Math.PI * 2;
          sx = parent.x + Math.cos(theta) * r;
          sy = parent.y + Math.sin(theta) * r;
        } else {
          sx = utils.randomRange(0, width);
          sy = utils.randomRange(0, height * 0.75);
        }

        sx = utils.clamp(sx, 1, width - 1);
        sy = utils.clamp(sy, 1, height - 1);

        const depthRandom = Math.random();
        let depth = 0;
        let size = utils.randomRange(0.4, 0.75);
        let glow = 0;

        if (depthRandom > 0.70 && depthRandom <= 0.94) {
          depth = 1;
          size = utils.randomRange(0.8, 1.25);
        } else if (depthRandom > 0.94) {
          depth = 2;
          size = utils.randomRange(1.3, 1.75);
          glow = utils.randomRange(2, 4);
        }

        this.stars.push({
          x: sx,
          y: sy,
          size: size,
          depth: depth,
          glow: glow,
          baseOpacity: utils.randomRange(0.2, 0.7),
          opacity: 0,
          twinkleSpeed: utils.randomRange(0.6, 2.2),
          twinklePhase: utils.randomRange(0, Math.PI * 2)
        });
      }
    },

    update(dt) {
      const utils = Utils;

      const moonX = MoonSystem.centerX + (State.mouseX * State.width * 0.007);
      const moonY = MoonSystem.centerY + (State.mouseY * State.height * 0.007);
      const moonR = MoonSystem.radius;
      const glareRadius = moonR * 3.8;

      for (let i = 0; i < this.stars.length; i++) {
        const s = this.stars[i];

        s.twinklePhase += s.twinkleSpeed * dt;
        let twinkleFactor = 0.6 + Math.sin(s.twinklePhase) * 0.4;
        
        let targetOpacity = s.baseOpacity * twinkleFactor;

        if (moonR > 0) {
          const dx = s.x - moonX;
          const dy = s.y - moonY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < glareRadius) {
            const factor = utils.clamp((distance - moonR * 1.1) / (glareRadius - moonR * 1.1), 0.05, 1.0);
            targetOpacity *= factor;
          }
        }

        s.opacity = targetOpacity;
      }
    },

    render() {
      if (!this.ctx) return;

      const ctx = this.ctx;
      ctx.clearRect(0, 0, State.width, State.height);

      const px = State.mouseX * State.width * 0.004;
      const py = State.mouseY * State.height * 0.004;

      for (let i = 0; i < this.stars.length; i++) {
        const s = this.stars[i];
        
        ctx.beginPath();
        ctx.arc(s.x + px, s.y + py, s.size, 0, Math.PI * 2);

        if (s.depth === 2) {
          ctx.fillStyle = `rgba(253, 246, 226, ${s.opacity})`;
          ctx.shadowColor = 'rgba(253, 246, 226, 0.5)';
          ctx.shadowBlur = s.glow;
        } else {
          ctx.fillStyle = `rgba(240, 243, 255, ${s.opacity})`;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  };

  /**
   * Cloud System (Version 2.4 Sub-System - Preserved)
   * Renders volumetric clouds using grouped puff particles of offset radial gradients.
   */
  const CloudSystem = {
    name: 'CloudSystem',
    canvas: null,
    ctx: null,
    clouds: [],
    
    init(width, height, dpr) {
      this.canvas = document.getElementById('clouds-canvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.onResize(width, height, dpr);
    },

    onResize(width, height, dpr) {
      if (!this.canvas) return;

      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
      this.ctx.scale(dpr, dpr);

      this.generateClouds(width, height);
    },

    generateClouds(width, height) {
      this.clouds = [];
      const utils = Utils;

      const lanes = [
        { y: height * 0.15, depth: 0, scale: 0.7 },
        { y: height * 0.42, depth: 1, scale: 1.0 },
        { y: height * 0.28, depth: 2, scale: 1.3 },
        { y: height * 0.60, depth: 1, scale: 1.1 },
        { y: height * 0.50, depth: 0, scale: 0.8 },
        { y: height * 0.32, depth: 2, scale: 1.45 }
      ];

      lanes.forEach((lane, index) => {
        const cloudBaseWidth = utils.randomRange(180, 280) * lane.scale;
        const cloudBaseHeight = utils.randomRange(50, 80) * lane.scale;
        
        const puffs = [];
        const puffCount = 14;

        for (let p = 0; p < puffCount; p++) {
          const ratio = p / (puffCount - 1);
          const px = (ratio - 0.5) * cloudBaseWidth * utils.randomRange(0.8, 1.1);
          const domeFactor = Math.sin(ratio * Math.PI);
          const py = -domeFactor * cloudBaseHeight * utils.randomRange(0.4, 0.85);
          const pr = cloudBaseHeight * (0.35 + domeFactor * utils.randomRange(0.4, 0.65));

          puffs.push({
            offsetX: px,
            offsetY: py,
            radius: pr,
            baseAlpha: utils.randomRange(0.08, 0.24)
          });
        }

        let driftVelocity = 0;
        let baseOpacity = 0.15;
        let parallaxFactor = 0.01;

        if (lane.depth === 0) {
          driftVelocity = utils.randomRange(3.5, 6.0);
          baseOpacity = 0.22;
          parallaxFactor = 0.008;
        } else if (lane.depth === 1) {
          driftVelocity = utils.randomRange(2.0, 3.2);
          baseOpacity = 0.38;
          parallaxFactor = 0.018;
        } else {
          driftVelocity = utils.randomRange(0.9, 1.8);
          baseOpacity = 0.45;
          parallaxFactor = 0.03;
        }

        const startX = utils.randomRange(-width * 0.2, width * 0.85);

        this.clouds.push({
          x: startX,
          baseY: lane.y,
          width: cloudBaseWidth,
          height: cloudBaseHeight,
          puffs: puffs,
          depth: lane.depth,
          vx: driftVelocity,
          opacity: baseOpacity,
          parallax: parallaxFactor
        });
      });
    },

    update(dt) {
      const boundaryOffset = 450;

      for (let i = 0; i < this.clouds.length; i++) {
        const c = this.clouds[i];
        c.x += (c.vx * dt);

        if (c.x > State.width + boundaryOffset) {
          c.x = -boundaryOffset - c.width;
        }
      }
    },

    render() {
      if (!this.ctx) return;

      const ctx = this.ctx;
      ctx.clearRect(0, 0, State.width, State.height);

      const moonX = MoonSystem.centerX + (State.mouseX * State.width * 0.007);
      const moonY = MoonSystem.centerY + (State.mouseY * State.height * 0.007);

      const sortedClouds = [...this.clouds].sort((a, b) => a.depth - b.depth);

      for (let i = 0; i < sortedClouds.length; i++) {
        const c = sortedClouds[i];

        const px = State.mouseX * State.width * c.parallax;
        const py = State.mouseY * State.height * c.parallax;

        const renderX = c.x + px;
        const renderY = c.baseY + py;

        for (let j = 0; j < c.puffs.length; j++) {
          const p = c.puffs[j];
          const puffX = renderX + p.offsetX;
          const puffY = renderY + p.offsetY;

          const dx = moonX - puffX;
          const dy = moonY - puffY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const dirX = dx / dist;
          const dirY = dy / dist;

          const lightIntensity = Math.max(0.1, 1.0 - dist / (State.width * 0.75));
          const offsetDist = p.radius * 0.24 * lightIntensity;
          const gradCenterX = puffX + (dirX * offsetDist);
          const gradCenterY = puffY + (dirY * offsetDist);

          const puffGrad = ctx.createRadialGradient(
            gradCenterX, gradCenterY, p.radius * 0.05,
            puffX, puffY, p.radius
          );

          const goldenRim = `hsla(43, 60%, 82%, ${c.opacity * p.baseAlpha * 1.5 * lightIntensity})`;
          const shadowBody = `hsla(262, 12%, 40%, ${c.opacity * p.baseAlpha * 0.8})`;
          const diffuseFade = 'rgba(25, 20, 35, 0)';

          puffGrad.addColorStop(0, goldenRim);
          puffGrad.addColorStop(0.3, shadowBody);
          puffGrad.addColorStop(1, diffuseFade);

          ctx.beginPath();
          ctx.arc(puffX, puffY, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = puffGrad;
          ctx.fill();
        }
      }
    }
  };

  /**
   * Meadow & Flower Garden System (Version 4.5 Expanded Species & Slower Waves)
   * Procedurally generates, clusters, and depth-interleaves grass blades and wildflowers.
   */
  const MeadowSystem = {
    name: 'MeadowSystem',
    canvas: null,
    ctx: null,
    renderList: [],
    
    windTime: 0,
    windSpeed: 0.75, 

    init(width, height, dpr) {
      this.canvas = document.getElementById('meadow-canvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.onResize(width, height, dpr);
    },

    onResize(width, height, dpr) {
      if (!this.canvas) return;

      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
      this.ctx.scale(dpr, dpr);

      this.generateGarden(width, height);
    },

    generateGarden(width, height) {
      this.renderList = [];
      const utils = Utils;

      const moonX = MoonSystem.centerX + (State.mouseX * State.width * 0.007);

      const grassCount = utils.clamp(Math.floor(width * 0.72), 300, 850);
      for (let i = 0; i < grassCount; i++) {
        const baseX = utils.randomRange(0, width);
        const depthRandom = Math.random();
        
        let depth = 1; 
        let length = utils.randomRange(32, 52);
        let baseWidth = utils.randomRange(1.5, 2.4);
        let swayAmp = utils.randomRange(4, 9); 
        let baseY = height + utils.randomRange(-5, 15);
        let parallax = 0.012;

        if (depthRandom < 0.45) {
          depth = 0;
          length = utils.randomRange(16, 28);
          baseWidth = utils.randomRange(0.8, 1.4);
          swayAmp = utils.randomRange(2, 4);
          baseY = height - utils.randomRange(5, 18);
          parallax = 0.004;
        } else if (depthRandom > 0.86) {
          depth = 2;
          length = utils.randomRange(58, 88);
          baseWidth = utils.randomRange(2.6, 3.8);
          swayAmp = utils.randomRange(8, 16);
          baseY = height + utils.randomRange(10, 28);
          parallax = 0.022;
        }

        const baseCurve = utils.randomRange(-0.06, 0.06);

        const distToMoon = Math.abs(baseX - moonX);
        const lightInfluence = utils.clamp(1.0 - (distToMoon / (width * 0.55)), 0, 1.0);

        let hue, sat, light;
        if (Math.random() < 0.6) {
          hue = utils.randomRange(105, 125);
          sat = utils.randomRange(14, 22);
          light = utils.randomRange(16, 26) + (lightInfluence * 12);
        } else {
          hue = utils.randomRange(185, 210);
          sat = utils.randomRange(10, 18);
          light = utils.randomRange(14, 22) + (lightInfluence * 8);
        }

        let colorString;
        if (lightInfluence > 0.45 && Math.random() < lightInfluence * 0.8) {
          colorString = `hsla(43, 25%, ${Math.floor(light * 1.15)}%, ${depth === 0 ? 0.7 : 1.0})`;
        } else {
          colorString = `hsla(${hue}, ${sat}%, ${Math.floor(light)}%, ${depth === 0 ? 0.7 : 1.0})`;
        }

        this.renderList.push({
          isFlower: false,
          baseX: baseX,
          baseY: baseY,
          length: length,
          width: baseWidth,
          curve: baseCurve,
          color: colorString,
          depth: depth,
          parallax: parallax,
          swayPhase: utils.randomRange(0, Math.PI * 2),
          swaySpeed: utils.randomRange(0.3, 0.7), 
          swayAmp: swayAmp
        });
      }

      const flowerCount = utils.clamp(Math.floor(width / 24), 22, 60); 
      const clusterCenters = [width * 0.18, width * 0.35, width * 0.52, width * 0.72, width * 0.88]; 

      const flowerTypes = ['daisy', 'tulip', 'lavender', 'rose', 'bluebell', 'forgetmenot', 'cosmos', 'buttercup', 'lily', 'violet'];
      const flowerColors = [
        'hsla(350, 45%, 88%, 1)',  
        'hsla(265, 35%, 84%, 1)',  
        'hsla(205, 35%, 84%, 1)',  
        'hsla(38, 45%, 92%, 1)',   
        'hsla(43, 60%, 75%, 1)',   
        'hsla(0, 0%, 94%, 1)',     
        'hsla(285, 30%, 78%, 1)'   
      ];

      for (let i = 0; i < flowerCount; i++) {
        let fx;
        if (Math.random() < 0.75) {
          const center = clusterCenters[Math.floor(Math.random() * clusterCenters.length)];
          fx = center + utils.randomRange(-width * 0.08, width * 0.08);
        } else {
          fx = utils.randomRange(width * 0.05, width * 0.95);
        }

        fx = utils.clamp(fx, 15, width - 15);

        const distToMoon = Math.abs(fx - moonX);
        const lightInfluence = utils.clamp(1.0 - (distToMoon / (width * 0.55)), 0, 1.0);

        const depthRandom = Math.random();
        let depth = 1;
        let length = utils.randomRange(48, 76);
        let stemWidth = utils.randomRange(1.8, 2.4);
        let swayAmp = utils.randomRange(6, 11); 
        let baseY = height + utils.randomRange(-2, 18);
        let parallax = 0.012;

        if (depthRandom < 0.35) {
          depth = 0;
          length = utils.randomRange(28, 45);
          stemWidth = utils.randomRange(1.0, 1.5);
          swayAmp = utils.randomRange(3, 5);
          baseY = height - utils.randomRange(3, 14);
          parallax = 0.004;
        } else if (depthRandom > 0.88) {
          depth = 2;
          length = utils.randomRange(80, 110);
          stemWidth = utils.randomRange(2.8, 3.6);
          swayAmp = utils.randomRange(12, 18);
          baseY = height + utils.randomRange(12, 32);
          parallax = 0.022;
        }

        const type = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
        const baseColor = flowerColors[Math.floor(Math.random() * flowerColors.length)];

        const leafCount = Math.floor(utils.randomRange(0, 3));
        const leaves = [];
        for (let l = 0; l < leafCount; l++) {
          leaves.push({
            side: Math.random() < 0.5 ? -1 : 1,
            yOffset: utils.randomRange(0.25, 0.7),
            length: utils.randomRange(8, 16) * (depth === 0 ? 0.6 : (depth === 2 ? 1.4 : 1.0)),
            angle: utils.randomRange(0.2, 0.6)
          });
        }

        const stemCurve = utils.randomRange(-0.06, 0.06);

        this.renderList.push({
          isFlower: true,
          type: type,
          baseX: fx,
          baseY: baseY,
          length: length,
          stemWidth: stemWidth,
          curve: stemCurve,
          depth: depth,
          parallax: parallax,
          color: baseColor,
          lightInfluence: lightInfluence,
          petalCount: Math.floor(utils.randomRange(8, 14)),
          petalSize: utils.randomRange(4, 9) * (depth === 0 ? 0.6 : (depth === 2 ? 1.4 : 1.0)),
          bloomAngle: utils.randomRange(-0.15, 0.15),
          leaves: leaves,
          swayPhase: utils.randomRange(0, Math.PI * 2),
          swaySpeed: utils.randomRange(0.3, 0.7), 
          swayAmp: swayAmp,
          headX: 0,
          headY: 0
        });
      }

      this.renderList.sort((a, b) => {
        if (a.depth !== b.depth) return a.depth - b.depth;
        return a.baseY - b.baseY;
      });
    },

    update(dt) {
      this.windSpeed += (1.4 - this.windSpeed) * dt;
      this.windTime += this.windSpeed * dt;

      for (let i = 0; i < this.renderList.length; i++) {
        const item = this.renderList[i];
        item.swayPhase += item.swaySpeed * dt;
      }
    },

    render() {
      if (!this.ctx) return;

      const ctx = this.ctx;
      const w = State.width;
      const h = State.height;

      ctx.clearRect(0, 0, State.width, State.height);

      const groundGrad = ctx.createLinearGradient(0, h * 0.85, 0, h);
      groundGrad.addColorStop(0, 'rgba(25, 20, 35, 0)');
      groundGrad.addColorStop(0.35, 'hsla(110, 15%, 15%, 0.4)');
      groundGrad.addColorStop(1, 'hsla(260, 20%, 11%, 0.95)');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, h * 0.82, w, h * 0.18);

      for (let i = 0; i < this.renderList.length; i++) {
        const item = this.renderList[i];

        const px = State.mouseX * w * item.parallax;
        const py = State.mouseY * h * item.parallax;

        const bx = item.baseX + px;
        const by = item.baseY + py;

        const windWave = Math.sin(this.windTime + (bx * 0.004) + item.swayPhase) * item.swayAmp;

        if (item.isFlower) {
          this.drawFlower(ctx, item, bx, by, windWave);
        } else {
          this.drawGrass(ctx, item, bx, by, windWave);
        }
      }
    },

    drawGrass(ctx, b, bx, by, windWave) {
      const tipX = bx + windWave + (b.curve * b.length);
      const tipY = by - b.length;

      const ctrlX = bx + (tipX - bx) * 0.55;
      const ctrlY = by - b.length * 0.5;

      ctx.beginPath();
      ctx.moveTo(bx - b.width / 2, by);
      ctx.quadraticCurveTo(ctrlX, ctrlY, tipX, tipY);
      ctx.quadraticCurveTo(ctrlX, ctrlY, bx + b.width / 2, by);
      ctx.fillStyle = b.color;
      ctx.fill();
    },

    drawFlower(ctx, f, bx, by, windWave) {
      const tipX = bx + windWave + (f.curve * f.length);
      const tipY = by - f.length;

      const ctrlX = bx + (tipX - bx) * 0.55;
      const ctrlY = by - f.length * 0.5;

      f.headX = tipX;
      f.headY = tipY;

      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.quadraticCurveTo(ctrlX, ctrlY, tipX, tipY);
      
      const isBackground = f.depth === 0;
      ctx.strokeStyle = isBackground ? 'hsla(110, 10%, 25%, 0.7)' : 'hsla(110, 15%, 30%, 1)';
      ctx.lineWidth = f.stemWidth;
      ctx.lineCap = 'round';
      ctx.stroke();

      f.leaves.forEach(leaf => {
        const t = leaf.yOffset;
        const leafY = by * (1 - t) * (1 - t) + ctrlY * 2 * (1 - t) * t + tipY * t * t;
        const leafX = bx * (1 - t) * (1 - t) + ctrlX * 2 * (1 - t) * t + tipX * t * t;

        const leafEnd = leafX + (leaf.length * leaf.side);
        const leafControlY = leafY - leaf.length * 0.25;

        ctx.beginPath();
        ctx.moveTo(leafX, leafY);
        ctx.quadraticCurveTo(leafX + (leaf.length * 0.5 * leaf.side), leafControlY, leafEnd, leafY);
        ctx.quadraticCurveTo(leafX + (leaf.length * 0.5 * leaf.side), leafY + leaf.length * 0.15, leafX, leafY);
        ctx.fillStyle = isBackground ? 'hsla(110, 10%, 22%, 0.6)' : 'hsla(110, 12%, 26%, 1)';
        ctx.fill();
      });

      ctx.save();
      ctx.translate(tipX, tipY);
      
      const dx = tipX - ctrlX;
      const dy = tipY - ctrlY;
      const angle = Math.atan2(dy, dx) - Math.PI / 2 + f.bloomAngle;
      ctx.rotate(angle);

      const pulseOpacity = 0.8 + (f.lightInfluence * 0.2);
      ctx.globalAlpha = isBackground ? 0.65 : pulseOpacity;

      if (f.type === 'daisy' || f.type === 'cosmos') {
        const petalC = f.color;
        const centerC = f.lightInfluence > 0.4 ? 'hsla(43, 60%, 75%, 1)' : 'hsla(43, 40%, 65%, 1)';
        const count = f.type === 'cosmos' ? 8 : f.petalCount;

        ctx.fillStyle = petalC;
        for (let p = 0; p < count; p++) {
          ctx.rotate((Math.PI * 2) / count);
          ctx.beginPath();
          ctx.ellipse(0, f.petalSize * 1.1, f.petalSize * (f.type === 'cosmos' ? 0.5 : 0.35), f.petalSize, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(0, 0, f.petalSize * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = centerC;
        ctx.fill();

      } else if (f.type === 'tulip' || f.type === 'buttercup') {
        const c = f.type === 'buttercup' ? 'hsla(43, 80%, 72%, 1)' : f.color; 
        ctx.fillStyle = c;

        ctx.beginPath();
        ctx.moveTo(-f.petalSize * 0.6, 0);
        ctx.bezierCurveTo(-f.petalSize * 1.1, -f.petalSize * 1.5, -f.petalSize * 0.3, -f.petalSize * 1.8, 0, -f.petalSize * 0.8);
        ctx.bezierCurveTo(f.petalSize * 0.3, -f.petalSize * 1.8, f.petalSize * 1.1, -f.petalSize * 1.5, f.petalSize * 0.6, 0);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = `hsla(43, 60%, 94%, 0.15)`;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-f.petalSize * 0.4, -f.petalSize * 0.8, -f.petalSize * 0.2, -f.petalSize * 1.6, 0, -f.petalSize * 1.8);
        ctx.bezierCurveTo(f.petalSize * 0.2, -f.petalSize * 1.6, f.petalSize * 0.4, -f.petalSize * 0.8, 0, 0);
        ctx.closePath();
        ctx.fill();

      } else if (f.type === 'rose') {
        ctx.fillStyle = f.color;
        const layers = [f.petalSize * 1.2, f.petalSize * 0.85, f.petalSize * 0.5];
        layers.forEach((size, idx) => {
          ctx.beginPath();
          ctx.arc(0, -size * 0.2, size, 0, Math.PI * 2);
          ctx.fillStyle = idx % 2 === 0 ? f.color : 'hsla(350, 45%, 94%, 1)'; 
          ctx.fill();
        });

      } else if (f.type === 'bluebell' || f.type === 'lavender') {
        const c = f.type === 'bluebell' ? 'hsla(205, 45%, 84%, 1)' : f.color;
        ctx.fillStyle = c;

        const tiers = isBackground ? 3 : 5;
        const gap = f.petalSize * 1.15;

        for (let t = 0; t < tiers; t++) {
          const yPos = -t * gap;
          const scale = 1.0 - (t * 0.15);

          ctx.beginPath();
          ctx.ellipse(-f.petalSize * 0.5 * scale, yPos, f.petalSize * 0.35 * scale, f.petalSize * 0.5 * scale, -Math.PI / 3, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.ellipse(f.petalSize * 0.5 * scale, yPos, f.petalSize * 0.35 * scale, f.petalSize * 0.5 * scale, Math.PI / 3, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (f.type === 'forgetmenot' || f.type === 'violet') {
        ctx.fillStyle = f.type === 'forgetmenot' ? 'hsla(205, 55%, 84%, 1)' : 'hsla(285, 30%, 78%, 1)'; 
        const offsetPositions = [
          { x: -f.petalSize * 0.6, y: -f.petalSize * 0.4 },
          { x: f.petalSize * 0.6, y: -f.petalSize * 0.5 },
          { x: 0, y: -f.petalSize * 1.2 }
        ];

        offsetPositions.forEach(pos => {
          ctx.save();
          ctx.translate(pos.x, pos.y);
          for (let p = 0; p < 5; p++) {
            ctx.rotate((Math.PI * 2) / 5);
            ctx.beginPath();
            ctx.arc(0, f.petalSize * 0.4, f.petalSize * 0.35, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.beginPath();
          ctx.arc(0, 0, f.petalSize * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = 'var(--color-soft-gold)';
          ctx.fill();
          ctx.restore();
        });

      } else if (f.type === 'lily') {
        ctx.fillStyle = 'hsla(0, 0%, 94%, 1)';
        for (let p = 0; p < 6; p++) {
          ctx.rotate(Math.PI / 3);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(-f.petalSize * 0.3, -f.petalSize * 0.8, 0, -f.petalSize * 1.6);
          ctx.quadraticCurveTo(f.petalSize * 0.3, -f.petalSize * 0.8, 0, 0);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(0, -f.petalSize * 0.3, f.petalSize * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = 'var(--color-soft-gold)';
        ctx.fill();
      }

      ctx.restore();
    }
  };

  /**
   * Effects System (Version 2.8 Consolidates Fireflies, Floating Petals, Ambient Dust)
   * Renders high-performance particle states onto a single unified High-DPI canvas layer.
   */
  const EffectsSystem = {
    name: 'EffectsSystem',
    canvas: null,
    ctx: null,
    fireflies: [],
    petals: [],
    dust: [],

    init(width, height, dpr) {
      this.canvas = document.getElementById('effects-canvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.onResize(width, height, dpr);
    },

    onResize(width, height, dpr) {
      if (!this.canvas) return;

      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
      this.ctx.scale(dpr, dpr);

      this.generateParticles(width, height);
    },

    generateParticles(width, height) {
      const utils = Utils;
      const area = width * height;

      // 1. Generate Fireflies (Preserved)
      this.fireflies = [];
      const ffCount = utils.clamp(Math.floor(area / 30000), 20, 55);
      for (let i = 0; i < ffCount; i++) {
        const depthRandom = Math.random();
        let depth = 1, size = utils.randomRange(1.0, 1.8), maxOpacity = utils.randomRange(0.4, 0.7), speedFactor = 1.0, parallax = 0.012;

        if (depthRandom < 0.35) {
          depth = 0; size = utils.randomRange(0.5, 0.95); maxOpacity = utils.randomRange(0.2, 0.45); speedFactor = 0.6; parallax = 0.005;
        } else if (depthRandom > 0.88) {
          depth = 2; size = utils.randomRange(2.0, 3.2); maxOpacity = utils.randomRange(0.7, 0.95); speedFactor = 1.4; parallax = 0.024;
        }

        this.fireflies.push({
          x: utils.randomRange(50, width - 50),
          y: utils.randomRange(height * 0.45, height * 0.92),
          size: size,
          depth: depth,
          parallax: parallax,
          speed: 0,
          targetSpeed: utils.randomRange(15, 30) * speedFactor,
          angle: utils.randomRange(0, Math.PI * 2),
          targetAngle: utils.randomRange(0, Math.PI * 2),
          steeringForce: utils.randomRange(1.8, 3.5),
          maxOpacity: maxOpacity,
          opacity: 0,
          pulsePhase: utils.randomRange(0, Math.PI * 2),
          pulseSpeed: utils.randomRange(0.8, 2.5),
          behaviorTimer: utils.randomRange(0.5, 2.5),
          isCircling: false,
          circleSpeed: 0,
          hoverTarget: null,
          hoverTimer: 0
        });
      }

      // 2. Generate Floating Petals
      this.petals = [];
      const petalCount = utils.clamp(Math.floor(width / 75), 10, 25);
      for (let i = 0; i < petalCount; i++) {
        this.petals.push(this.createPetal(width, height, true));
      }

      // 3. Generate Ambient Dust
      this.dust = [];
      const dustCount = utils.clamp(Math.floor(area / 15000), 25, 75);
      for (let i = 0; i < dustCount; i++) {
        this.dust.push({
          x: utils.randomRange(0, width),
          y: utils.randomRange(0, height * 0.8),
          size: utils.randomRange(0.3, 0.95),
          opacity: 0,
          baseOpacity: utils.randomRange(0.08, 0.28),
          pulsePhase: utils.randomRange(0, Math.PI * 2),
          pulseSpeed: utils.randomRange(0.4, 1.8),
          vy: utils.randomRange(-3, -8),
          vx: utils.randomRange(-2, 2),
          parallax: utils.randomRange(0.003, 0.01)
        });
      }
    },

    createPetal(width, height, randomY = false) {
      const utils = Utils;
      const depthRandom = Math.random();
      
      let depth = 1, scale = 1.0, maxOpacity = utils.randomRange(0.45, 0.75), parallax = 0.012;
      if (depthRandom < 0.35) {
        depth = 0; scale = 0.6; maxOpacity = utils.randomRange(0.2, 0.45); parallax = 0.004;
      } else if (depthRandom > 0.85) {
        depth = 2; scale = 1.45; maxOpacity = utils.randomRange(0.7, 0.9); parallax = 0.022;
      }

      return {
        x: utils.randomRange(-50, width),
        y: randomY ? utils.randomRange(height * 0.6, height * 0.92) : height + 20,
        width: utils.randomRange(5, 9) * scale,
        height: utils.randomRange(7, 12) * scale,
        depth: depth,
        parallax: parallax,
        maxOpacity: maxOpacity,
        opacity: 0,
        vx: utils.randomRange(8, 22) * scale,
        vy: utils.randomRange(-12, -26) * scale,
        rotation: utils.randomRange(0, Math.PI * 2),
        rotSpeed: utils.randomRange(-0.8, 1.8),
        dipPhase: utils.randomRange(0, Math.PI * 2),
        dipSpeed: utils.randomRange(1.5, 3.5),
        dipAmp: utils.randomRange(3, 8),
        life: utils.randomRange(6.0, 11.0),
        maxLife: 10.0
      };
    },

    update(dt) {
      const utils = Utils;
      const w = State.width;
      const h = State.height;

      const moonX = MoonSystem.centerX + (State.mouseX * State.width * 0.007);
      const moonY = MoonSystem.centerY + (State.mouseY * State.height * 0.007);
      const moonR = MoonSystem.radius;
      const avoidanceShield = moonR * 1.35;

      const flowers = MeadowSystem.renderList.filter(item => item.isFlower);

      // 1. Update Fireflies
      for (let i = 0; i < this.fireflies.length; i++) {
        const f = this.fireflies[i];

        if (f.hoverTarget) {
          f.hoverTimer -= dt;
          const hdx = f.hoverTarget.headX - f.x;
          const hdy = f.hoverTarget.headY - f.y;
          const hdist = Math.sqrt(hdx * hdx + hdy * hdy);

          if (hdist > 6) {
            f.targetAngle = Math.atan2(hdy, hdx);
            f.targetSpeed = utils.clamp(hdist * 0.8, 2, 10);
          } else {
            f.targetSpeed = 0;
          }

          if (f.hoverTimer <= 0) {
            f.hoverTarget = null;
            f.behaviorTimer = 0.5;
          }
        } else {
          f.behaviorTimer -= dt;
          if (f.behaviorTimer <= 0) {
            f.behaviorTimer = utils.randomRange(1.0, 3.5);
            const roll = Math.random();
            if (roll < 0.15) {
              f.targetSpeed = 0;
            } else if (roll >= 0.15 && roll < 0.35) {
              f.isCircling = true;
              f.circleSpeed = utils.randomRange(-3.5, 3.5);
              f.targetSpeed = utils.randomRange(10, 22);
            } else if (roll >= 0.35 && roll < 0.55 && flowers.length > 0) {
              const randomFlower = flowers[Math.floor(Math.random() * flowers.length)];
              const fdx = randomFlower.headX - f.x;
              const fdy = randomFlower.headY - f.y;
              const fdist = Math.sqrt(fdx * fdx + fdy * fdy);

              if (fdist < 150) {
                f.hoverTarget = randomFlower;
                f.hoverTimer = utils.randomRange(1.5, 4.0);
                f.isCircling = false;
              }
            } else {
              f.isCircling = false;
              f.targetSpeed = utils.randomRange(15, 32);
              f.targetAngle = utils.randomRange(0, Math.PI * 2);
            }
          }
        }

        if (f.isCircling && !f.hoverTarget) {
          f.targetAngle += f.circleSpeed * dt;
        }

        f.speed += (f.targetSpeed - f.speed) * (4.0 * dt);
        f.angle += (f.targetAngle - f.angle) * (f.steeringForce * dt);

        let nextX = f.x + Math.cos(f.angle) * f.speed * dt;
        let nextY = f.y + Math.sin(f.angle) * f.speed * dt;

        if (moonR > 0) {
          const dx = nextX - moonX;
          const dy = nextY - moonY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < avoidanceShield) {
            f.targetAngle = Math.atan2(dy, dx) + utils.randomRange(-0.4, 0.4);
            f.angle = f.targetAngle;
            f.isCircling = false;
            f.hoverTarget = null;
            nextX = moonX + (dx / dist) * avoidanceShield;
            nextY = moonY + (dy / dist) * avoidanceShield;
          }
        }

        if (nextY < h * 0.42) {
          f.targetAngle = Math.PI / 2 + utils.randomRange(-0.5, 0.5);
          f.hoverTarget = null;
        }

        f.x = nextX;
        f.y = nextY;

        const padding = 20;
        if (f.x < -padding) f.x = w + padding;
        if (f.x > w + padding) f.x = -padding;
        if (f.y > h + padding) f.y = h * 0.45;

        f.pulsePhase += f.pulseSpeed * dt;
        const sineWave = Math.sin(f.pulsePhase);
        let activeOpacity = 0;
        if (sineWave > -0.3) {
          activeOpacity = f.maxOpacity * ((sineWave + 0.3) / 1.3);
        }

        if (moonR > 0) {
          const dx = f.x - moonX;
          const dy = f.y - moonY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const glareLimit = moonR * 3.5;

          if (distance < glareLimit) {
            const factor = utils.clamp((distance - moonR * 1.1) / (glareLimit - moonR * 1.1), 0.1, 1.0);
            activeOpacity *= factor;
          }
        }
        f.opacity = activeOpacity;
      }

      // 2. Update Floating Petals
      for (let i = 0; i < this.petals.length; i++) {
        const p = this.petals[i];

        p.life -= dt;
        if (p.life <= 0) {
          this.petals[i] = this.createPetal(w, h, false);
          continue;
        }

        p.rotation += p.rotSpeed * dt;
        p.dipPhase += p.dipSpeed * dt;

        const windDrift = Math.sin(p.dipPhase) * p.dipAmp;

        p.x += (p.vx + windDrift) * dt;
        p.y += p.vy * dt;

        if (p.x > w + 50 || p.y < -50) {
          this.petals[i] = this.createPetal(w, h, false);
          continue;
        }

        const lifeRatio = p.life / p.maxLife;
        let activeOpacity = p.maxOpacity;
        if (lifeRatio < 0.25) {
          activeOpacity = p.maxOpacity * (lifeRatio / 0.25);
        } else if (lifeRatio > 0.85) {
          activeOpacity = p.maxOpacity * ((1.0 - lifeRatio) / 0.15);
        }

        if (moonR > 0) {
          const dx = p.x - moonX;
          const dy = p.y - moonY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const glareLimit = moonR * 2.2;

          if (distance < glareLimit) {
            const factor = utils.clamp((distance - moonR) / (glareLimit - moonR), 0.35, 1.0);
            activeOpacity *= factor;
          }
        }

        p.opacity = utils.clamp(activeOpacity, 0, 1.0);
      }

      // 3. Update Ambient Dust
      for (let i = 0; i < this.dust.length; i++) {
        const d = this.dust[i];

        d.x += d.vx * dt;
        d.y += d.vy * dt;

        if (d.y < -10) {
          d.y = h + 10;
          d.x = utils.randomRange(0, w);
        }

        d.pulsePhase += d.pulseSpeed * dt;
        const flicker = 0.7 + Math.sin(d.pulsePhase) * 0.3;
        
        let opacity = d.baseOpacity * flicker;

        if (moonR > 0) {
          const dx = d.x - moonX;
          const dy = d.y - moonY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const glareLimit = moonR * 2.5;

          if (distance < glareLimit) {
            opacity *= utils.clamp((distance - moonR) / (glareLimit - moonR), 0.15, 1.0);
          }
        }

        d.opacity = opacity;
      }
    },

    render() {
      if (!this.ctx) return;

      const ctx = this.ctx;
      ctx.clearRect(0, 0, State.width, State.height);

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // 1. Draw Ambient Dust
      for (let i = 0; i < this.dust.length; i++) {
        const d = this.dust[i];
        if (d.opacity <= 0.01) continue;

        const dpx = State.mouseX * State.width * d.parallax;
        const dpy = State.mouseY * State.height * d.parallax;

        ctx.beginPath();
        ctx.arc(d.x + dpx, d.y + dpy, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(253, 246, 226, ${d.opacity})`;
        ctx.fill();
      }

      // 2. Draw Fireflies
      for (let i = 0; i < this.fireflies.length; i++) {
        const f = this.fireflies[i];
        if (f.opacity <= 0.01) continue;

        const px = State.mouseX * State.width * f.parallax;
        const py = State.mouseY * State.height * f.parallax;

        const renderX = f.x + px;
        const renderY = f.y + py;

        const innerColor = `hsla(74, 90%, 65%, ${f.opacity})`;
        const midColor = `hsla(74, 80%, 60%, ${f.opacity * 0.35})`;
        const outerFade = 'rgba(150, 200, 50, 0)';

        const glow = ctx.createRadialGradient(
          renderX, renderY, f.size * 0.2,
          renderX, renderY, f.size * 5.0
        );
        glow.addColorStop(0, innerColor);
        glow.addColorStop(0.2, midColor);
        glow.addColorStop(1, outerFade);

        ctx.beginPath();
        ctx.arc(renderX, renderY, f.size * 5.0, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      // 3. Draw Floating Petals
      ctx.globalCompositeOperation = 'source-over';
      
      for (let i = 0; i < this.petals.length; i++) {
        const p = this.petals[i];
        if (p.opacity <= 0.01) continue;

        const ppx = State.mouseX * State.width * p.parallax;
        const ppy = State.mouseY * State.height * p.parallax;

        const rx = p.x + ppx;
        const ry = p.y + ppy;

        ctx.save();
        ctx.translate(rx, ry);
        ctx.rotate(p.rotation);

        ctx.beginPath();
        ctx.moveTo(-p.width / 2, 0);
        ctx.quadraticCurveTo(0, -p.height / 2, p.width / 2, 0);
        ctx.quadraticCurveTo(0, p.height / 2, -p.width / 2, 0);
        ctx.closePath();

        const petalGrad = ctx.createLinearGradient(0, -p.height / 2, 0, p.height / 2);
        petalGrad.addColorStop(0, `hsla(350, 55%, 90%, ${p.opacity})`);
        petalGrad.addColorStop(1, `hsla(265, 30%, 82%, ${p.opacity * 0.85})`);

        ctx.fillStyle = petalGrad;
        ctx.fill();

        ctx.restore();
      }

      ctx.restore();
    }
  };

  /**
   * Parchment Scroll Controller (Version 4.5 Sub-System - Replaces EnvelopeSystem)
   * Manages rolling animations, vertical scaling, line reveals, and continue actions.
   */
  const ScrollSystem = {
    name: 'ScrollSystem',
    dom: {},
    lines: [],
    lineTimer: 0,
    lineDelay: 1600, 
    activeLineIndex: 0,
    isOpened: false,

    init() {
      this.dom = {
        scroll: document.getElementById('scroll-intro'),
        trigger: document.getElementById('scroll-continue-trigger'),
        lines: document.querySelectorAll('.scroll-line')
      };

      if (!this.dom.scroll) {
        this.dom = { scroll: null };
        return;
      }

      this.lines = Array.from(this.dom.lines);
      this.bindEvents();
    },

    bindEvents() {
      if (this.dom.trigger) {
        this.dom.trigger.addEventListener('click', () => {
          this.playPaperSound('scroll_exit');
          this.triggerScrollExit();
        });
      }
    },

    triggerScrollLanding() {
      if (!this.dom.scroll) return;
      this.dom.scroll.classList.add('state-scroll-down');
      this.playPaperSound('scroll_slide_in');

      setTimeout(() => {
        this.triggerScrollUnroll();
      }, 1800);
    },

    triggerScrollUnroll() {
      if (!this.dom.scroll) return;
      this.dom.scroll.classList.add('state-scroll-open');
      this.playPaperSound('scroll_unroll');

      setTimeout(() => {
        this.isOpened = true;
      }, 2000);
    },

    triggerScrollExit() {
      if (!this.dom.scroll) return;
      
      this.dom.scroll.classList.remove('state-scroll-open');
      this.dom.scroll.classList.add('fade-out');

      const worldLayer = document.getElementById('layer-world');
      if (worldLayer) {
        worldLayer.classList.add('state-camera-zoom');
        worldLayer.classList.add('state-blur-garden');
      }

      setTimeout(() => {
        GallerySystem.activate();
      }, 1800);
    },

    playPaperSound(type) {
      console.log(`Audio Event Triggered: paper_${type}`);
    },

    update(dt) {
      if (!this.isOpened || this.activeLineIndex >= this.lines.length) return;

      this.lineTimer += dt * 1000;
      if (this.lineTimer >= this.lineDelay) {
        this.lineTimer = 0;
        
        const line = this.lines[this.activeLineIndex];
        if (line) {
          this.playPaperSound('line_fade');
          line.classList.add('visible');
        }
        
        this.activeLineIndex++;

        if (this.activeLineIndex === this.lines.length) {
          this.revealContinueBtn();
        }
      }
    },

    revealContinueBtn() {
      setTimeout(() => {
        this.playPaperSound('continue_unlocked');
        if (this.dom.trigger) {
          this.dom.trigger.classList.add('visible');
          this.dom.trigger.setAttribute('tabindex', '0');
          this.dom.trigger.setAttribute('aria-hidden', 'false');
        }
      }, 1200);
    },

    render() {
      if (!this.dom.scroll) return;

      const px = State.mouseX * State.width * 0.022;
      const py = State.mouseY * State.height * 0.022;
      
      this.dom.scroll.style.marginLeft = `${px}px`;
      
      if (!State.isScrollOpening) {
        this.dom.scroll.style.marginTop = `${py}px`;
      }
    }
  };

  /**
   * Memory Gallery System (Version 4.5 Scrapbook Memory Lane Board - Fixed arrays & undefined playPaperSound exceptions)
   * Seeded with Polaroids, vintage Postcards, and handwritten note scraps.
   */
  const GallerySystem = {
    name: 'GallerySystem',
    dom: {},
    touchStartX: 0,
    touchStartY: 0,

    scraps: [
      {
        id: 'scrap-1',
        type: 'polaroid',
        title: 'Starlit Walk',
        date: 'Oct 14, 2024',
        sceneClass: 'scene-gradient-starry',
        hasMoon: true,
        hasMountain: true,
        x: 60, y: 40, rot: -8, scale: 0.95, z: 2
      },
      {
        id: 'scrap-2',
        type: 'polaroid',
        title: 'Twilight Lake',
        date: 'Nov 22, 2024',
        sceneClass: 'scene-gradient-sunset',
        hasFlower: true,
        hasMountain: true,
        x: 480, y: 30, rot: 5, scale: 1.0, z: 4
      },
      {
        id: 'scrap-3',
        type: 'polaroid',
        title: 'December Wish',
        date: 'Dec 25, 2024',
        sceneClass: 'scene-gradient-aurora',
        hasStars: true,
        hasMountain: true,
        x: 270, y: 220, rot: -3, scale: 1.05, z: 6
      },
      {
        id: 'scrap-4',
        type: 'postcard',
        title: 'The Journey',
        text: 'Every step taken alongside you feels like walking through a dream... May we continue charting constellations together.',
        x: 60, y: 280, rot: 4, scale: 0.9, z: 3
      },
      {
        id: 'scrap-5',
        type: 'note',
        text: 'A quick little note just to say... thank you for being the warmest light in my sky. ✿',
        x: 320, y: 20, rot: -12, scale: 0.85, z: 1
      },
      {
        id: 'scrap-6',
        type: 'polaroid',
        title: 'Golden Meadows',
        date: 'Jan 02, 2025',
        sceneClass: 'scene-gradient-sunset',
        hasFlower: true,
        x: 540, y: 280, rot: -6, scale: 0.95, z: 5
      }
    ],

    init() {
      this.dom = {
        wrapper: document.getElementById('memory-gallery'),
        board: document.getElementById('gallery-board-container')
      };

      if (!this.dom.wrapper) {
        this.dom = { wrapper: null, board: null };
        return;
      }

      this.buildScrapbookBoard();
      this.bindTouchGestures();
    },

    buildScrapbookBoard() {
      if (!this.dom.board) return;
      this.dom.board.innerHTML = '';

      this.scraps.forEach(s => {
        const item = document.createElement('div');
        item.className = `${s.type}-scrappy`;
        item.id = s.id;
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `Memory piece: ${s.title || 'Handwritten note'}`);

        item.style.left = `${s.x}px`;
        item.style.top = `${s.y}px`;
        item.style.zIndex = s.z;

        item.dataset.rot = s.rot;
        item.dataset.scale = s.scale;

        if (s.type === 'polaroid') {
          let internalSceneHTML = `<div class="scrappy-scene ${s.sceneClass}">`;
          if (s.hasStars) internalSceneHTML += `<div class="procedural-stars"></div>`;
          if (s.hasMoon) internalSceneHTML += `<div class="procedural-moon"></div>`;
          if (s.hasMountain) internalSceneHTML += `<div class="procedural-mountain"></div>`;
          if (s.hasFlower) internalSceneHTML += `<div class="procedural-flower-silhouette"></div>`;
          internalSceneHTML += `</div>`;

          item.innerHTML = `
            <div class="photo-slot">
              ${internalSceneHTML}
            </div>
            <div class="polaroid-caption">
              <h3 class="caption-title">${s.title}</h3>
              <span class="caption-date">${s.date}</span>
            </div>
          `;
        } else if (s.type === 'postcard') {
          item.innerHTML = `
            <div class="vintage-borders"></div>
            <div class="postcard-divider"></div>
            <div class="note-text" style="width: 44%;">
              <p style="margin: 0 0 4px 0; font-weight: bold; border-bottom: 1px dashed rgba(140, 120, 100, 0.35); padding-bottom: 2px;">Postcard</p>
              ${s.text}
            </div>
          `;
          item.style.width = '240px';
          item.style.height = '160px';
        } else if (s.type === 'note') {
          item.innerHTML = `
            <div class="note-text" style="width: 140px;">
              ${s.text}
            </div>
          `;
        }

        this.dom.board.appendChild(item);
      });

      this.onResize(State.width, State.height, State.pixelRatio);
    },

    bindTouchGestures() {
      if (!this.dom.board) return;
      const handleStart = (e) => {
        if (!State.isGalleryActive) return;
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
      };

      const handleEnd = (e) => {
        if (!State.isGalleryActive) return;
        const diffX = e.changedTouches[0].clientX - this.touchStartX;
        const diffY = e.changedTouches[0].clientY - this.touchStartY;
      };

      this.dom.board.addEventListener('touchstart', handleStart, { passive: true });
      this.dom.board.addEventListener('touchend', handleEnd, { passive: true });
    },

    activate() {
      if (State.isGalleryActive) return;
      State.isGalleryActive = true;

      if (this.dom.wrapper) {
        this.dom.wrapper.classList.add('active');
        this.dom.wrapper.setAttribute('aria-hidden', 'false');
      }

      if (!this.dom.board) return;
      const scrapNodes = Array.from(this.dom.board.children);
      
      scrapNodes.forEach((node, idx) => {
        setTimeout(() => {
          playPaperSound('scrap_drop');
          
          node.classList.add('visible');
          
          const r = node.dataset.rot;
          const s = node.dataset.scale;
          node.style.transform = `scale(${s}) rotate(${r}deg) translateY(0)`;
        }, idx * 280); 
      });

      playPaperSound('board_unveiled');
    },

    onResize(width, height, dpr) {
      if (!this.dom.board) return;

      const baseWidth = 850;
      const baseHeight = 540;
      
      const scale = Math.min(width / baseWidth, height / baseHeight);
      const targetScale = Utils.clamp(scale, 0.44, 1.0); 
      
      this.dom.board.style.transform = `scale(${targetScale})`;
    },

    update(dt) {},

    render() {
      if (!this.dom.wrapper || !State.isGalleryActive || !this.dom.board) return;

      const px = State.mouseX * State.width * 0.024;
      const py = State.mouseY * State.height * 0.024;
      this.dom.board.style.marginLeft = `${px}px`;
      this.dom.board.style.marginTop = `${py}px`;
    }
  };

  /**
   * Scene Manager to handle initialization lifecycle steps,
   * mount scene layers, and control transition states. (Preserved & Enhanced)
   */
  const SceneManager = {
    dom: {},

    init() {
      this.dom = {
        loading: document.getElementById('layer-loading'),
        world: document.getElementById('layer-world'),
      };
    },

    revealWorld() {
      if (State.isLoaded) return; // Prevent duplicate revealWorld execution
      State.isLoaded = true;

      if (this.dom.loading) {
        this.dom.loading.style.opacity = '0';
        this.dom.loading.style.pointerEvents = 'none';

        setTimeout(() => {
          this.dom.loading.style.display = 'none';
          LoadingSystem.destroy();
          GardenEngine.unregisterSystem(LoadingSystem);
          
          // Step 4 & 5: Wait about 900 ms after loading has faded out, then slide Scroll into center
          setTimeout(() => {
            if (ScrollSystem && typeof ScrollSystem.triggerScrollLanding === 'function') {
              ScrollSystem.triggerScrollLanding();
            }
          }, 900);
        }, 1200);
      }
    }
  };

  /**
   * Mathematical and functional utility helpers. (Preserved)
   */
  const Utils = {
    randomRange(min, max) {
      return Math.random() * (max - min) + min;
    },

    clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }
  };

  // Public API exposure (Preserved & Enhanced)
  return {
    init() {
      if (State.isInitialized) return;

      ResizeManager.init();
      SceneManager.init();
      
      // Register global systems
      this.registerSystem(LoadingSystem);
      this.registerSystem(EnvironmentSystem);
      this.registerSystem(MoonSystem); 
      this.registerSystem(StarSystem); 
      this.registerSystem(CloudSystem); 
      this.registerSystem(MeadowSystem); 
      this.registerSystem(EffectsSystem); 
      this.registerSystem(ScrollSystem); 
      this.registerSystem(GallerySystem); 
      
      AnimationManager.start();

      // Meticulous Fail-Safe Fallback: Guarantees revealWorld runs in 5 seconds even if loader blocks
      setTimeout(() => {
        if (!State.isLoaded) {
          console.warn('Bootstrapping fall-safe fallback triggered.');
          SceneManager.revealWorld();
        }
      }, 5000);

      State.isInitialized = true;
      console.log('Garden Engine initialized.');
    },

    registerSystem(system) {
      if (system && typeof system.init === 'function') {
        system.init(State.width, State.height, State.pixelRatio);
        ActiveSystems.add(system);
        console.log(`System mounted successfully: ${system.name || 'Anonymous'}`);
      }
    },

    unregisterSystem(system) {
      if (ActiveSystems.has(system)) {
        ActiveSystems.delete(system);
      }
    },

    getUtils() {
      return Utils;
    }
  };
})();

// Dual-State Initialization: safely bypasses DOMContentLoaded readyState triggers
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    GardenEngine.init();
  });
} else {
  GardenEngine.init();
}
