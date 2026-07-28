/**
 * Cinematic Environment Engine (Version 2.5 Dynamic Insect Fireflies)
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
    lastFrameTime: 0,
    deltaTime: 0,
    
    // Cursor tracking states for the parallax layer displacement
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    parallaxSpeed: 0.05
  };

  // 3. Module Registry (To easily mount future visual sub-systems)
  const ActiveSystems = new Set();

  /**
   * Performance-optimized window resizing utility.
   * Debounces callback execution to protect GPU performance.
   */
  const ResizeManager = {
    timer: null,

    init() {
      window.addEventListener('resize', this.handleResize.bind(this), { passive: true });
      window.addEventListener('orientationchange', this.handleResize.bind(this), { passive: true });
      this.bindMouseParallax();
      this.updateViewportDimensions();
    },

    bindMouseParallax() {
      const trackMove = (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        State.targetMouseX = (clientX / State.width) - 0.5;
        State.targetMouseY = (clientY / State.height) - 0.5;
      };

      window.addEventListener('mousemove', trackMove, { passive: true });
      window.addEventListener('touchmove', trackMove, { passive: true });
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
   * Computes delta-time independently of screen refresh-rates.
   */
  const AnimationManager = {
    frameId: null,

    start() {
      State.lastFrameTime = performance.now();
      this.loop(State.lastFrameTime);
    },

    loop(currentTime) {
      if (!State.isActive) return;

      this.frameId = requestAnimationFrame(this.loop.bind(this));

      State.deltaTime = (currentTime - State.lastFrameTime) / 1000;
      State.lastFrameTime = currentTime;

      // Smoothly interpolate cursor parallax coordinates
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
    },

    stop() {
      if (this.frameId) {
        cancelAnimationFrame(this.frameId);
      }
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

      const baseGradient = ctx.createLinearGradient(0, 0, 0, h);
      baseGradient.addColorStop(0, 'hsla(230, 25%, 12%, 1)');
      baseGradient.addColorStop(0.5, 'hsla(260, 20%, 18%, 1)');
      baseGradient.addColorStop(1, 'hsla(265, 30%, 25%, 1)');
      ctx.fillStyle = baseGradient;
      ctx.fillRect(0, 0, w, h);

      const driftX = Math.sin(this.ambientTime) * (w * 0.15);
      const driftY = Math.cos(this.ambientTime * 0.8) * (h * 0.08);

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
      const x = this.centerX;
      const y = this.centerY;
      const r = this.radius;

      ctx.clearRect(0, 0, State.width, State.height);

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

      const moonX = MoonSystem.centerX;
      const moonY = MoonSystem.centerY;
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

      for (let i = 0; i < this.stars.length; i++) {
        const s = this.stars[i];
        
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);

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

      const moonX = MoonSystem.centerX;
      const moonY = MoonSystem.centerY;

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
   * Firefly System (Version 2.5 Sub-System - Added)
   * Renders realistic, insect-like fireflies utilizing dynamic path steering vectors,
   * gravitational bounds, and moon light glares avoidance parameters.
   */
  const FireflySystem = {
    name: 'FireflySystem',
    canvas: null,
    ctx: null,
    fireflies: [],
    
    init(width, height, dpr) {
      this.canvas = document.getElementById('fireflies-canvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.onResize(width, height, dpr);
    },

    onResize(width, height, dpr) {
      if (!this.canvas) return;

      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
      this.ctx.scale(dpr, dpr);

      this.generateFireflies(width, height);
    },

    /**
     * Builds fireflies scattered across the screen with a spatial bias
     * toward the lower and middle portions of the viewport (the future meadow layer).
     */
    generateFireflies(width, height) {
      this.fireflies = [];
      const utils = GardenEngine.getUtils();

      // Responsive quantity calculations (caps rendering load on lower-res viewports)
      const area = width * height;
      const count = utils.clamp(Math.floor(area / 30000), 20, 55);

      for (let i = 0; i < count; i++) {
        // Classify deep layering offsets
        const depthRandom = Math.random();
        let depth = 1; // Middle range
        let size = utils.randomRange(1.0, 1.8);
        let maxOpacity = utils.randomRange(0.4, 0.7);
        let speedFactor = 1.0;
        let parallax = 0.012;

        if (depthRandom < 0.35) {
          depth = 0; // Background (smaller, slower, more transparent)
          size = utils.randomRange(0.5, 0.95);
          maxOpacity = utils.randomRange(0.2, 0.45);
          speedFactor = 0.6;
          parallax = 0.005;
        } else if (depthRandom > 0.88) {
          depth = 2; // Foreground (larger, brighter)
          size = utils.randomRange(2.0, 3.2);
          maxOpacity = utils.randomRange(0.7, 0.95);
          speedFactor = 1.4;
          parallax = 0.024;
        }

        // Concentrates firefly bounds in the bottom 50% of the viewport height
        const startX = utils.randomRange(50, width - 50);
        const startY = utils.randomRange(height * 0.45, height * 0.92);

        this.fireflies.push({
          x: startX,
          y: startY,
          size: size,
          depth: depth,
          parallax: parallax,
          
          // Speed vectors (allows insect-like velocity pauses)
          speed: 0,
          targetSpeed: utils.randomRange(15, 30) * speedFactor,
          angle: utils.randomRange(0, Math.PI * 2),
          targetAngle: utils.randomRange(0, Math.PI * 2),
          steeringForce: utils.randomRange(1.8, 3.5),
          
          // Blinking metadata
          maxOpacity: maxOpacity,
          opacity: 0,
          pulsePhase: utils.randomRange(0, Math.PI * 2),
          pulseSpeed: utils.randomRange(0.8, 2.5),
          
          // Event state cycles (Wandering, Pausing, Circling)
          behaviorTimer: utils.randomRange(0.5, 2.5),
          isCircling: false,
          circleSpeed: 0
        });
      }
    },

    update(dt) {
      const utils = GardenEngine.getUtils();
      const w = State.width;
      const h = State.height;

      // Fetch public moon state details for avoidance checking
      const moonX = MoonSystem.centerX;
      const moonY = MoonSystem.centerY;
      const moonR = MoonSystem.radius;
      const avoidanceShield = moonR * 1.35; // Invisible boundary around the moon

      for (let i = 0; i < this.fireflies.length; i++) {
        const f = this.fireflies[i];

        // 1. Behavior State Cycles (Pausing, Steering, or Circling)
        f.behaviorTimer -= dt;
        if (f.behaviorTimer <= 0) {
          f.behaviorTimer = utils.randomRange(1.0, 3.5);
          
          const roll = Math.random();
          if (roll < 0.15) {
            // Freeze motion (simulate settling on grass blades)
            f.targetSpeed = 0;
          } else if (roll >= 0.15 && roll < 0.35) {
            // Circle loop mode
            f.isCircling = true;
            f.circleSpeed = utils.randomRange(-3.5, 3.5);
            f.targetSpeed = utils.randomRange(10, 22);
          } else {
            // General wandering steer
            f.isCircling = false;
            f.targetSpeed = utils.randomRange(15, 32);
            f.targetAngle = utils.randomRange(0, Math.PI * 2);
          }
        }

        // Calculate steering angles
        if (f.isCircling) {
          f.targetAngle += f.circleSpeed * dt;
        }

        // Interpolate current speeds and coordinates safely
        f.speed += (f.targetSpeed - f.speed) * (4.0 * dt);
        f.angle += (f.targetAngle - f.angle) * (f.steeringForce * dt);

        // Vector translation coordinates
        let nextX = f.x + Math.cos(f.angle) * f.speed * dt;
        let nextY = f.y + Math.sin(f.angle) * f.speed * dt;

        // 2. Avoid Moon Surface (reverses velocity vectors on approaching glare limits)
        if (moonR > 0) {
          const dx = nextX - moonX;
          const dy = nextY - moonY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < avoidanceShield) {
            // Instantly steer away from the moon's surface
            f.targetAngle = Math.atan2(dy, dx) + utils.randomRange(-0.4, 0.4);
            f.angle = f.targetAngle;
            f.isCircling = false;
            
            // Push coordinates out to edge of the shield to prevent entry glitches
            nextX = moonX + (dx / dist) * avoidanceShield;
            nextY = moonY + (dy / dist) * avoidanceShield;
          }
        }

        // 3. Gravity Boundaries (keeps fireflies down inside the lower half of the screen)
        if (nextY < h * 0.42) {
          f.targetAngle = Math.PI / 2 + utils.randomRange(-0.5, 0.5); // Steer downwards
        }

        // Apply translated coordinates
        f.x = nextX;
        f.y = nextY;

        // 4. Wrap viewport edges smoothly
        const padding = 20;
        if (f.x < -padding) f.x = w + padding;
        if (f.x > w + padding) f.x = -padding;
        if (f.y > h + padding) f.y = h * 0.45; // Force spawn back above ground limit

        // 5. Breathing illumination cycles (clamped sine-waves produce dark periods)
        f.pulsePhase += f.pulseSpeed * dt;
        const sineWave = Math.sin(f.pulsePhase);
        
        let activeOpacity = 0;
        if (sineWave > -0.3) {
          // Map opacity curve on positive sine ranges
          const ratio = (sineWave + 0.3) / 1.3;
          activeOpacity = f.maxOpacity * ratio;
        }

        // 6. Proximity Glare Attenuation (dims glowing points near moon's light)
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
    },

    render() {
      if (!this.ctx) return;

      const ctx = this.ctx;
      ctx.clearRect(0, 0, State.width, State.height);

      for (let i = 0; i < this.fireflies.length; i++) {
        const f = this.fireflies[i];
        if (f.opacity <= 0.01) continue;

        // Apply mouse displacement calculations directly to rendering coords
        const px = State.mouseX * State.width * f.parallax;
        const py = State.mouseY * State.height * f.parallax;

        const renderX = f.x + px;
        const renderY = f.y + py;

        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        // Warm yellow-green color configurations
        const innerColor = `hsla(74, 90%, 65%, ${f.opacity})`;
        const midColor = `hsla(74, 80%, 60%, ${f.opacity * 0.35})`;
        const outerFade = 'rgba(150, 200, 50, 0)';

        // Multi-tiered glowing composite circles (body, soft inner glow, outer haze)
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

        ctx.restore();
      }
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
      this.registerSystem(FireflySystem); // Version 2.5 Active
      
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
