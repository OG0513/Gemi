/**
 * Cinematic Environment Engine (Version 2.8 Final Environment Polish)
 * Namespace structure to manage lifecycle, states, and render threads.
 */

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
    
    // Parallax displacement metrics
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    parallaxSpeed: 0.05
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

      // Gyroscope tracking for mobile browsers
      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (e) => {
          if (!e.gamma || !e.beta) return;
          // Clamp and map tilt angles comfortably into parallax limits (-0.5 to 0.5)
          const tiltX = e.gamma / 45; // Left/Right tilt
          const tiltY = (e.beta - 45) / 45; // Front/Back tilt

          State.targetMouseX = GardenEngine.getUtils().clamp(tiltX, -0.5, 0.5);
          State.targetMouseY = GardenEngine.getUtils().clamp(tiltY, -0.5, 0.5);
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
   * Shuts down update thread completely when tab is hidden to conserve energy.
   */
  const AnimationManager = {
    frameId: null,

    start() {
      State.lastFrameTime = performance.now();
      this.bindVisibilityTracker();
      this.loop(State.lastFrameTime);
    },

    bindVisibilityTracker() {
      // Shuts down drawing threads on hidden tabs to preserve battery
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

      // Smoothly interpolate cursor/gyro coordinates
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
   * Renders a highly performance-optimized, slowly breathing atmospheric evening sky.
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

      // Subtle horizontal offset based on parallax depth (keeps sky continuous)
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

      // Golden horizon glow
      const horizonGlow = ctx.createRadialGradient(
        w * 0.5 + driftX,
        h * 0.85 + driftY,
        0,
        w * 0.5 + driftX,
        h * 0.85 + driftY,
        w * 0.6
      );
      horizonGlow.addColorStop(0, 'hsla(43, 40%, 75%, 0.15)');
      horizonGlow.addColorStop(0.5, 'hsla(350, 40%, 88%, 0.08)');
      horizonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, 0, w, h);

      // Upper sky glow
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

      // Horizon atmospheric haze
      const horizonHaze = ctx.createLinearGradient(0, h * 0.7, 0, h);
      horizonHaze.addColorStop(0, 'rgba(230, 220, 240, 0)');
      horizonHaze.addColorStop(1, 'hsla(260, 20%, 20%, 0.3)'); // Blends sky base with grass values
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

      // Parallax offset applied directly
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
      ambientGlow.addColorStop(0, `hsla(43, 60%, 75%, ${0.09 * breath})`);
      ambientGlow.addColorStop(0.5, `hsla(38, 50%, 94%, ${0.03 * breath})`);
      ambientGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = ambientGlow;
      ctx.beginPath();
      ctx.arc(x, y, r * 3.0, 0, Math.PI * 2);
      ctx.fill();

      const coreGlow = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 1.5);
      coreGlow.addColorStop(0, `hsla(38, 50%, 94%, ${0.18 * breath})`);
      coreGlow.addColorStop(0.6, `hsla(43, 55%, 75%, ${0.06 * breath})`);
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
      const utils = GardenEngine.getUtils();

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
      const utils = GardenEngine.getUtils();

      // Retrieve public moon coordinates with its respective active parallax offsets
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

      // Stars layer parallax
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
      const utils = GardenEngine.getUtils();

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

      // Retrieve public moon coordinates with its respective active parallax offsets
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
   * Meadow & Flower Garden System (Version 2.7 Sub-System - Preserved)
   * Procedurally generates, clusters, and depth-interleaves grass blades and wildflowers.
   */
  const MeadowSystem = {
    name: 'MeadowSystem',
    canvas: null,
    ctx: null,
    renderList: [],
    
    windTime: 0,
    windSpeed: 1.4,

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
      const utils = GardenEngine.getUtils();

      // Ensure stable coordinates on resize, retrieving public moon coordinates
      const moonX = MoonSystem.centerX + (State.mouseX * State.width * 0.007);

      const grassCount = utils.clamp(Math.floor(width * 0.72), 300, 850);
      for (let i = 0; i < grassCount; i++) {
        const baseX = utils.randomRange(0, width);
        const depthRandom = Math.random();
        
        let depth = 1; 
        let length = utils.randomRange(32, 52);
        let baseWidth = utils.randomRange(1.5, 2.4);
        let swayAmp = utils.randomRange(6, 11);
        let baseY = height + utils.randomRange(-5, 15);
        let parallax = 0.012;

        if (depthRandom < 0.45) {
          depth = 0;
          length = utils.randomRange(16, 28);
          baseWidth = utils.randomRange(0.8, 1.4);
          swayAmp = utils.randomRange(3, 5);
          baseY = height - utils.randomRange(5, 18);
          parallax = 0.004;
        } else if (depthRandom > 0.86) {
          depth = 2;
          length = utils.randomRange(58, 88);
          baseWidth = utils.randomRange(2.6, 3.8);
          swayAmp = utils.randomRange(13, 22);
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
          swaySpeed: utils.randomRange(0.8, 1.6),
          swayAmp: swayAmp
        });
      }

      const flowerCount = utils.clamp(Math.floor(width / 36), 14, 42);
      const clusterCenters = [width * 0.22, width * 0.48, width * 0.82];

      const flowerTypes = ['daisy', 'tulip', 'lavender'];
      const flowerColors = [
        'hsla(350, 45%, 88%, 1)',
        'hsla(265, 35%, 84%, 1)',
        'hsla(205, 35%, 84%, 1)',
        'hsla(38, 45%, 92%, 1)',
        'hsla(0, 0%, 94%, 1)'
      ];

      for (let i = 0; i < flowerCount; i++) {
        let fx;
        if (Math.random() < 0.75) {
          const center = clusterCenters[Math.floor(Math.random() * clusterCenters.length)];
          fx = center + utils.randomRange(-width * 0.1, width * 0.1);
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
        let swayAmp = utils.randomRange(8, 14);
        let baseY = height + utils.randomRange(-2, 18);
        let parallax = 0.012;

        if (depthRandom < 0.35) {
          depth = 0;
          length = utils.randomRange(28, 45);
          stemWidth = utils.randomRange(1.0, 1.5);
          swayAmp = utils.randomRange(4, 7);
          baseY = height - utils.randomRange(3, 14);
          parallax = 0.004;
        } else if (depthRandom > 0.88) {
          depth = 2;
          length = utils.randomRange(80, 110);
          stemWidth = utils.randomRange(2.8, 3.6);
          swayAmp = utils.randomRange(16, 26);
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
          swaySpeed: utils.randomRange(0.7, 1.4),
          swayAmp: swayAmp,
          
          // Render tracking values (cleared each frame loop)
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

      ctx.clearRect(0, 0, w, h);

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

      // Expose current head coords for external module queries
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

      if (f.type === 'daisy') {
        const petalC = f.color;
        const centerC = f.lightInfluence > 0.4 ? 'hsla(43, 60%, 75%, 1)' : 'hsla(43, 40%, 65%, 1)';

        ctx.fillStyle = petalC;
        for (let p = 0; p < f.petalCount; p++) {
          ctx.rotate((Math.PI * 2) / f.petalCount);
          ctx.beginPath();
          ctx.ellipse(0, f.petalSize * 1.1, f.petalSize * 0.35, f.petalSize, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(0, 0, f.petalSize * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = centerC;
        ctx.fill();

      } else if (f.type === 'tulip') {
        const c = f.color;
        ctx.fillStyle = c;

        ctx.beginPath();
        ctx.moveTo(-f.petalSize * 0.6, 0);
        ctx.bezierCurveTo(-f.petalSize * 1.1, -f.petalSize * 1.5, -f.petalSize * 0.3, -f.petalSize * 1.8, 0, -f.petalSize * 0.8);
        ctx.bezierCurveTo(f.petalSize * 0.3, -f.petalSize * 1.8, f.petalSize * 1.1, -f.petalSize * 1.5, f.petalSize * 0.6, 0);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = `hsla(0, 0%, 100%, 0.12)`;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-f.petalSize * 0.4, -f.petalSize * 0.8, -f.petalSize * 0.2, -f.petalSize * 1.6, 0, -f.petalSize * 1.8);
        ctx.bezierCurveTo(f.petalSize * 0.2, -f.petalSize * 1.6, f.petalSize * 0.4, -f.petalSize * 0.8, 0, 0);
        ctx.closePath();
        ctx.fill();

      } else if (f.type === 'lavender') {
        const c = f.color;
        ctx.fillStyle = c;

        const tiers = isBackground ? 3 : 5;
        const gap = f.petalSize * 1.15;

        for (let t = 0; t < tiers; t++) {
          const yPos = -t * gap;
          const scale = 1.0 - (t * 0.15);

          ctx.beginPath();
          ctx.ellipse(-f.petalSize * 0.5 * scale, yPos, f.petalSize * 0.3 * scale, f.petalSize * 0.4 * scale, -Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.ellipse(f.petalSize * 0.5 * scale, yPos, f.petalSize * 0.3 * scale, f.petalSize * 0.4 * scale, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();

          if (t === tiers - 1) {
            ctx.beginPath();
            ctx.ellipse(0, yPos - gap * 0.8, f.petalSize * 0.25 * scale, f.petalSize * 0.45 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        }
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
    
    // Core arrays
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
      const utils = GardenEngine.getUtils();
      const area = width * height;

      // 1. Generate Fireflies (Preserved & Responsive)
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

      // 2. Generate Floating Petals (Version 2.8 Added)
      this.petals = [];
      const petalCount = utils.clamp(Math.floor(width / 75), 10, 25);
      for (let i = 0; i < petalCount; i++) {
        this.petals.push(this.createPetal(width, height, true)); // Spawn scattered initially
      }

      // 3. Generate Atmospheric Dust (Version 2.8 Added: Tiny Glistening Points)
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
          vy: utils.randomRange(-3, -8), // Drifts slowly upward
          vx: utils.randomRange(-2, 2),
          parallax: utils.randomRange(0.003, 0.01)
        });
      }
    },

    createPetal(width, height, randomY = false) {
      const utils = GardenEngine.getUtils();
      const depthRandom = Math.random();
      
      let depth = 1, scale = 1.0, maxOpacity = utils.randomRange(0.45, 0.75), parallax = 0.012;
      if (depthRandom < 0.35) {
        depth = 0; scale = 0.6; maxOpacity = utils.randomRange(0.2, 0.45); parallax = 0.004;
      } else if (depthRandom > 0.85) {
        depth = 2; scale = 1.45; maxOpacity = utils.randomRange(0.7, 0.9); parallax = 0.022;
      }

      return {
        // Originate naturally inside the meadow bounds
        x: utils.randomRange(-50, width),
        y: randomY ? utils.randomRange(height * 0.6, height * 0.92) : height + 20,
        width: utils.randomRange(5, 9) * scale,
        height: utils.randomRange(7, 12) * scale,
        depth: depth,
        parallax: parallax,
        maxOpacity: maxOpacity,
        opacity: 0,
        
        // Drifting velocities (drift sideways and up, caught in the wind)
        vx: utils.randomRange(8, 22) * scale,
        vy: utils.randomRange(-12, -26) * scale,
        
        // Gentle rotational physics
        rotation: utils.randomRange(0, Math.PI * 2),
        rotSpeed: utils.randomRange(-0.8, 1.8),
        
        // Flight dips (allows petal to catch the wind dynamically)
        dipPhase: utils.randomRange(0, Math.PI * 2),
        dipSpeed: utils.randomRange(1.5, 3.5),
        dipAmp: utils.randomRange(3, 8),
        
        life: utils.randomRange(6.0, 11.0), // Active life timer
        maxLife: 10.0
      };
    },

    update(dt) {
      const utils = GardenEngine.getUtils();
      const w = State.width;
      const h = State.height;

      const moonX = MoonSystem.centerX + (State.mouseX * State.width * 0.007);
      const moonY = MoonSystem.centerY + (State.mouseY * State.height * 0.007);
      const moonR = MoonSystem.radius;
      const avoidanceShield = moonR * 1.35;

      const flowers = MeadowSystem.renderList.filter(item => item.isFlower);

      // 1. Update Fireflies (Preserved & Enhanced)
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

      // 2. Update Floating Petals (Version 2.8 Added)
      for (let i = 0; i < this.petals.length; i++) {
        const p = this.petals[i];

        p.life -= dt;
        if (p.life <= 0) {
          // Recycle dead petals at the base meadow bounds
          this.petals[i] = this.createPetal(w, h, false);
          continue;
        }

        // Apply slow drift movements
        p.rotation += p.rotSpeed * dt;
        p.dipPhase += p.dipSpeed * dt;

        // Sideways drift affected by wind phase dynamics
        const windDrift = Math.sin(p.dipPhase) * p.dipAmp;

        p.x += (p.vx + windDrift) * dt;
        p.y += p.vy * dt;

        // Boundaries wrap check
        if (p.x > w + 50 || p.y < -50) {
          this.petals[i] = this.createPetal(w, h, false);
          continue;
        }

        // Opacity fade curves
        const lifeRatio = p.life / p.maxLife;
        let activeOpacity = p.maxOpacity;
        if (lifeRatio < 0.25) {
          // Fade naturally before disappearing
          activeOpacity = p.maxOpacity * (lifeRatio / 0.25);
        } else if (lifeRatio > 0.85) {
          // Fade in gently upon spawning
          activeOpacity = p.maxOpacity * ((1.0 - lifeRatio) / 0.15);
        }

        // Moonlight proximity damping
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

      // 3. Update Ambient Dust (Version 2.8 Added)
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

        // Dim slightly near moon glare boundaries
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

      // 1. Draw Ambient Dust (Tiny glistening points)
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

      // 2. Draw Fireflies (Preserved)
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

      // 3. Draw Floating Petals (Elegant desaturated pink curves)
      ctx.globalCompositeOperation = 'source-over'; // Restore blend mode for standard petals painting
      
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

        // Draw organic petal silhouette (Two opposing quadratic curves)
        ctx.beginPath();
        ctx.moveTo(-p.width / 2, 0);
        ctx.quadraticCurveTo(0, -p.height / 2, p.width / 2, 0);
        ctx.quadraticCurveTo(0, p.height / 2, -p.width / 2, 0);
        ctx.closePath();

        // Moonlight backlighting highlight gradients
        const petalGrad = ctx.createLinearGradient(0, -p.height / 2, 0, p.height / 2);
        petalGrad.addColorStop(0, `hsla(350, 55%, 90%, ${p.opacity})`); // Moonlit Blush Pink Tip
        petalGrad.addColorStop(1, `hsla(265, 30%, 82%, ${p.opacity * 0.85})`); // Soft Lavender Base shadow

        ctx.fillStyle = petalGrad;
        ctx.fill();

        ctx.restore();
      }

      ctx.restore();
    }
  };

  /**
   * Loading Screen System (Version 1.2 Sub-System - Preserved)
   * Manages SVG Calligraphy strokes, magical dust canvas updates, and transitions.
   */
  const LoadingSystem = {
    name: 'LoadingSystem',
    canvas: null,
    ctx: null,
    particles: [],
    maxParticles: 45,
    isRunning: true,

    init(width, height, dpr) {
      this.canvas = document.getElementById('loading-canvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d', { alpha: true });
      this.onResize(width, height, dpr);
      this.generateParticles();
      this.triggerMonogramTimeline();
    },

    onResize(width, height, dpr) {
      if (!this.canvas) return;
      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
      this.ctx.scale(dpr, dpr);
    },

    generateParticles() {
      this.particles = [];
      const utils = GardenEngine.getUtils();

      for (let i = 0; i < this.maxParticles; i++) {
        this.particles.push({
          x: utils.randomRange(0, State.width),
          y: utils.randomRange(0, State.height),
          radius: utils.randomRange(1, 2.8),
          opacity: utils.randomRange(0.1, 0.6),
          baseOpacity: utils.randomRange(0.1, 0.5),
          vx: utils.randomRange(-8, 8),
          vy: utils.randomRange(-15, -5),
          pulseSpeed: utils.randomRange(1, 3),
          pulsePhase: utils.randomRange(0, Math.PI * 2)
        });
      }
    },

    update(dt) {
      if (!this.isRunning) return;

      const utils = GardenEngine.getUtils();

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.x += (p.vx * dt);
        p.y += (p.vy * dt);

        p.pulsePhase += p.pulseSpeed * dt;
        p.opacity = p.baseOpacity + Math.sin(p.pulsePhase) * 0.15;
        p.opacity = utils.clamp(p.opacity, 0.05, 0.85);

        if (p.y < -10) {
          p.y = State.height + 10;
          p.x = utils.randomRange(0, State.width);
        }
        if (p.x < -10 || p.x > State.width + 10) {
          p.x = utils.randomRange(0, State.width);
        }
      }
    },

    render() {
      if (!this.isRunning || !this.ctx) return;

      const ctx = this.ctx;
      ctx.clearRect(0, 0, State.width, State.height);

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(43, 60%, 75%, ${p.opacity})`;
        ctx.shadowColor = 'hsla(43, 60%, 75%, 0.4)';
        ctx.shadowBlur = 4;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    },

    triggerMonogramTimeline() {
      const paths = document.querySelectorAll('.draw-path');
      const monogramSvg = document.querySelector('.monogram-svg');
      const message = document.querySelector('.loading-message');

      paths.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
      });

      setTimeout(() => {
        paths.forEach(path => {
          path.style.strokeDashoffset = '0';
        });
      }, 400);

      setTimeout(() => {
        if (monogramSvg) monogramSvg.classList.add('glowing');
      }, 2100);

      setTimeout(() => {
        if (message) message.classList.add('visible');
      }, 3000);

      setTimeout(() => {
        SceneManager.revealWorld();
      }, 4500);
    },

    destroy() {
      this.isRunning = false;
      this.particles = [];
      if (this.canvas) {
        this.canvas.style.display = 'none';
      }
    }
  };

  /**
   * Scene Manager to handle initialization lifecycle steps,
   * mount scene layers, and control transition states. (Preserved)
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
      if (this.dom.loading) {
        this.dom.loading.style.opacity = '0';
        this.dom.loading.style.pointerEvents = 'none';

        setTimeout(() => {
          this.dom.loading.style.display = 'none';
          LoadingSystem.destroy();
          GardenEngine.unregisterSystem(LoadingSystem);
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
      this.registerSystem(EffectsSystem); // Version 2.8 Consolidator Active
      
      AnimationManager.start();

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

// Boot engine once DOM loads completely
document.addEventListener('DOMContentLoaded', () => {
  GardenEngine.init();
});
