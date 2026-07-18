/**
 * Interactive Premium Birthday Experience - Version 4
 * Core Architecture & Living Environmental Engine
 */

'use strict';

// Global App Configuration
const APP_CONFIG = {
  loadingSimulationTime: 2500, // Speed calibration of virtual asset initialization
  transitionDelay: 1200,      // Sync matching style.css transition speed
};

/**
 * High-Performance Environmental Rendering Engine (Canvas)
 * Creates real-time dynamic, ultra-calm, wind-swept individual grass blades, floating light particles,
 * and ultra-realistic scattered flowers at 60FPS.
 */
class EnvironmentalEngine {
  constructor() {
    this.canvas = document.getElementById('environmental-canvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.blades = [];
    this.particles = [];
    this.flowers = [];
    this.windTime = 0;
    this.activeState = 'loading'; // Syncs with currently active scene ID
    
    this.isTicking = false;
    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.generateParticles(25); // Baseline floating pollen count
    this.generateGrass();
    this.generateFlowers();

    this.start();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Regenerate layout structure safely to adapt to device orientation changes
    this.generateGrass();
    this.generateFlowers();
  }

  /**
   * Procedurally generate tall, lush grass blades with varying heights, widths, and individual wind phases
   */
  generateGrass() {
    this.blades = [];
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    // Calibrate blade count to screen width to maximize mobile performance
    const bladeCount = Math.floor(width / (window.innerWidth < 768 ? 3 : 1.5)); 

    for (let i = 0; i < bladeCount; i++) {
      const x = Math.random() * width;
      const y = height; 
      
      // Increased grass height parameters for lush visual density
      const bladeHeight = clamp(110, Math.random() * 120 + 80, 240);
      const bladeWidth = Math.random() * 4 + 2;
      
      // Depth layering colors (Warm spring greens & meadow gold highlights)
      const colorDepth = Math.random();
      const color = colorDepth > 0.65 
        ? `rgba(164, 194, 142, ${0.7 + Math.random() * 0.25})`  // vibrant meadow green
        : colorDepth > 0.3
        ? `rgba(132, 166, 110, ${0.75 + Math.random() * 0.2})`   // deeper rich green
        : `rgba(182, 206, 150, ${0.65 + Math.random() * 0.3})`;  // gold-green highlights

      this.blades.push({
        x: x,
        y: y,
        h: bladeHeight,
        w: bladeWidth,
        color: color,
        angleOffset: Math.random() * Math.PI, // Random phase offsets
        speed: 0.008 + Math.random() * 0.01,  // Slow wind sway
        springiness: 4 + Math.random() * 4     // Lower spring multiplier for calm behavior
      });
    }
  }

  /**
   * Instantiate ultra-realistic flower systems resting directly along the bottom line
   */
  generateFlowers() {
    this.flowers = [];
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    const flowerCount = window.innerWidth < 768 ? 6 : 12;
    // Elegant light palette color profiles
    const colors = [
      { petal: '#f4dcd6', core: '#e5ad9b', glow: 'rgba(244, 220, 214, 0.4)' }, // Blush Pink
      { petal: '#fcece7', core: '#d4af37', glow: 'rgba(252, 236, 231, 0.4)' }, // Soft Peach/Gold
      { petal: '#f3effc', core: '#b39fdb', glow: 'rgba(243, 239, 252, 0.4)' }, // Lavender Whisper
      { petal: '#e8f0fe', core: '#a0c3ff', glow: 'rgba(232, 240, 254, 0.4)' }, // Soft Sky Blue
    ];

    for (let i = 0; i < flowerCount; i++) {
      // Scatter evenly with organic offsets along the baseline
      const x = (width * 0.05) + (Math.random() * width * 0.9);
      const stemHeight = Math.random() * 60 + 100; // Realistic height taller than average grass
      const petalCount = Math.floor(Math.random() * 2) + 5; // 5 or 6 multi-petal structures
      
      this.flowers.push({
        x: x,
        y: height,
        h: stemHeight,
        colorProfile: colors[Math.floor(Math.random() * colors.length)],
        petalCount: petalCount,
        angleOffset: Math.random() * Math.PI,
        size: Math.random() * 4 + 8, // Leafy bud size
        windPhase: Math.random() * Math.PI
      });
    }
  }

  /**
   * Generate gentle floating ambient light particles
   */
  generateParticles(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        r: Math.random() * 2.5 + 1.2,
        alpha: Math.random() * 0.5 + 0.15,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -Math.random() * 0.3 - 0.08,
        phase: Math.random() * Math.PI
      });
    }
  }

  /**
   * High performance continuous paint loops using requestAnimationFrame
   */
  start() {
    this.isTicking = true;
    const tick = () => {
      if (!this.isTicking) return;
      this.updatePhysics();
      this.render();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  stop() {
    this.isTicking = false;
  }

  updatePhysics() {
    // Highly calibrated ultra-calm cool breeze movement variables
    this.windTime += 0.002; 

    // Update floating light particles
    this.particles.forEach(p => {
      p.y += p.speedY;
      // Organic drifting sway pattern
      p.x += p.speedX + Math.sin(this.windTime * 0.8 + p.phase) * 0.15; 
      
      // Recycle particles wrapping out of top bounds smoothly
      if (p.y < -10) {
        p.y = this.canvas.height + 10;
        p.x = Math.random() * this.canvas.width;
      }
    });
  }

  render() {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Clear frames cleanly
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Ultra-Realistic Flowers (Scattered organically beneath grass layer)
    this.flowers.forEach(f => {
      // Wind sway calculations: slow cool drift physics
      const windAngle = Math.sin(this.windTime * 1.2 + f.angleOffset) * 0.08;
      const topX = f.x + Math.sin(windAngle) * f.h;
      const topY = f.y - Math.cos(windAngle) * f.h;

      // Draw elegant bending organic stem
      ctx.beginPath();
      ctx.moveTo(f.x, f.y);
      ctx.quadraticCurveTo(f.x + (topX - f.x) * 0.3, f.y - f.h * 0.5, topX, topY);
      ctx.strokeStyle = 'rgba(122, 153, 102, 0.55)';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Draw natural alternating stem leaves
      const leafCount = 2;
      for (let j = 1; j <= leafCount; j++) {
        const ratio = j / (leafCount + 1);
        const leafY = f.y - f.h * ratio;
        const leafX = f.x + (topX - f.x) * ratio;
        const leafSide = j % 2 === 0 ? 1 : -1;

        ctx.beginPath();
        ctx.ellipse(
          leafX + leafSide * 6, 
          leafY - 2, 
          8, 
          3, 
          (leafSide * Math.PI / 6) + windAngle, 
          0, 
          Math.PI * 2
        );
        ctx.fillStyle = 'rgba(132, 166, 110, 0.65)';
        ctx.fill();
      }

      // Draw 3D realistic petals with beautiful translucent layering
      ctx.save();
      ctx.translate(topX, topY);
      ctx.rotate(windAngle * 2);

      // Back glow shadow
      ctx.beginPath();
      ctx.arc(0, 0, f.size * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = f.colorProfile.glow;
      ctx.filter = 'blur(4px)';
      ctx.fill();
      ctx.filter = 'none';

      // Draw layered realistic petals
      const petals = f.petalCount;
      const angleStep = (Math.PI * 2) / petals;
      
      for (let k = 0; k < petals; k++) {
        ctx.save();
        ctx.rotate(k * angleStep + Math.sin(this.windTime + f.windPhase) * 0.05);

        // Individual petal ellipse gradient shadow
        ctx.beginPath();
        ctx.ellipse(0, -f.size * 0.8, f.size * 0.5, f.size * 0.95, 0, 0, Math.PI * 2);
        ctx.fillStyle = f.colorProfile.petal;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 0.5;
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      }

      // Draw textured center core disc
      ctx.beginPath();
      ctx.arc(0, 0, f.size * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = f.colorProfile.core;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();

      // Core details (realistic pollen clusters)
      ctx.beginPath();
      ctx.arc(0, 0, f.size * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#f9d976';
      ctx.fill();

      ctx.restore();
    });

    // 2. Draw Grass Blades (Midground layer - Tall and slow moving)
    ctx.lineCap = 'round';
    this.blades.forEach(b => {
      // Adjusted wave formula representing calm, cool, realistic breeze sways
      const wave = Math.sin(this.windTime * b.springiness * 0.45 + (b.x * 0.005) + b.angleOffset);
      const angle = wave * 0.12; // Slow, natural angular limits

      const tipX = b.x + Math.sin(angle) * b.h;
      const tipY = b.y - Math.cos(angle) * b.h;

      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      // Quadratic bezier curve structure yields a natural weighted taper
      ctx.quadraticCurveTo(b.x, b.y - b.h * 0.5, tipX, tipY); 
      
      ctx.strokeStyle = b.color;
      ctx.lineWidth = b.w;
      ctx.stroke();
    });

    // 3. Draw Floating Particles (Foreground layer)
    this.particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
      // Reset shadows immediately to avoid heavy Canvas draw overheads
      ctx.shadowBlur = 0; 
    });
  }
}

/**
 * Scene Manager Module
 * Controls application flow, viewport sizing checks, and high-performance scene rendering
 */
class SceneManager {
  constructor() {
    this.scenes = ['scene-loading', 'scene-welcome', 'scene-card', 'scene-garden'];
    this.currentSceneId = 'scene-loading';
    this.init();
  }

  init() {
    this.validateViewports();
    window.addEventListener('resize', () => this.validateViewports());
  }

  /**
   * Transitions smoothly from one screen to another
   * @param {string} targetSceneId ID string of target scene element
   */
  transitionTo(targetSceneId) {
    const activeScene = document.getElementById(this.currentSceneId);
    const targetScene = document.getElementById(targetSceneId);

    if (!targetScene) {
      console.warn(`Target scene "${targetSceneId}" does not exist in the DOM.`);
      return;
    }

    // Step 1: Transition Out Active Scene (applies .hidden scale/zoom camera blur)
    activeScene.classList.add('hidden');
    activeScene.classList.remove('active');

    // Step 2: Swap state indicator flags after visual fade completes
    setTimeout(() => {
      activeScene.style.display = 'none';
      targetScene.style.display = 'flex';
      
      // Step 3: Trigger entrance transition on targeted elements (fades in lens settle)
      setTimeout(() => {
        targetScene.classList.remove('hidden');
        targetScene.classList.add('active');
        this.currentSceneId = targetSceneId;
        
        // Dispatch localized hook for newly focused scenes
        this.onSceneFocus(targetSceneId);
      }, 50); // Small margin to force browser layout recalculation
    }, APP_CONFIG.transitionDelay);
  }

  /**
   * Evaluates logic processes tied to newly navigated boundaries
   * @param {string} sceneId Targeted Scene Identifier
   */
  onSceneFocus(sceneId) {
    if (sceneId === 'scene-card') {
      if (window.birthdayCardController) {
        window.birthdayCardController.reset();
      }
    }
  }

  /**
   * Asserts window bounds structure to guarantee layout preservation and avoid vertical clipping overflow
   */
  validateViewports() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
}

/**
 * Asset Loading Simulation Module
 * Simulates high-fidelity rendering pipeline progress for optimal user immersion setup
 */
class Loader {
  constructor(duration, onCompleteCallback) {
    this.duration = duration;
    this.onCompleteCallback = onCompleteCallback;
    this.progressBar = document.getElementById('loader-progress');
    this.percentageText = document.getElementById('loader-percentage');
    this.statusText = document.getElementById('loader-status');
    this.statuses = [
      'Loading interface assets...',
      'Optimizing atmospheric cloud rendering...',
      'Generating ambient light profiles...',
      'Structuring sensory flow paths...',
      'Ready'
    ];
    this.start();
  }

  start() {
    const startTime = performance.now();
    
    const updateLoader = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / this.duration, 1);
      const percentage = Math.floor(progress * 100);

      // DOM Updates
      this.progressBar.style.width = `${percentage}%`;
      this.percentageText.textContent = `${percentage}%`;

      // Interpolate loading narrative phases
      const statusIdx = Math.min(
        Math.floor(progress * this.statuses.length), 
        this.statuses.length - 1
      );
      this.statusText.textContent = this.statuses[statusIdx];

      if (progress < 1) {
        requestAnimationFrame(updateLoader);
      } else {
        setTimeout(() => {
          if (typeof this.onCompleteCallback === 'function') {
            this.onCompleteCallback();
          }
        }, 400); // Buffer for micro-UX confirmation display
      }
    };

    requestAnimationFrame(updateLoader);
  }
}

/**
 * Interactive Birthday Card Scene Controller
 * Manages Envelope unfolding, sliding translation vector animations, and book folds
 */
class InteractiveCardController {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    
    // Core Elements
    this.envelope = document.getElementById('envelope-wrapper');
    this.cardBook = document.getElementById('card-book');
    this.cardCover = document.getElementById('card-cover-container');
    this.hintText = document.getElementById('card-interaction-hint');
    this.nextButton = document.getElementById('btn-next-scene');

    // Progression State Flags
    this.isEnvelopeOpen = false;
    this.isCardEmerged = false;
    this.isCardOpened = false;

    this.bindEvents();
  }

  bindEvents() {
    // Stage 1: Interact envelope flap
    this.envelope.addEventListener('click', (e) => {
      if (!this.isEnvelopeOpen) {
        this.openEnvelope();
        e.stopPropagation();
      }
    });

    // Stage 2: Click floating card body to book fold open/close
    this.cardBook.addEventListener('click', (e) => {
      if (this.isCardEmerged && !this.isCardOpened) {
        this.openCard();
        e.stopPropagation();
      }
    });
  }

  /**
   * Step 1: Open envelope flap, then slide card upward in dynamic sequence
   */
  openEnvelope() {
    this.isEnvelopeOpen = true;
    this.envelope.classList.add('open');
    this.envelope.classList.remove('floating-envelope'); // Pause structural float animations
    this.hintText.textContent = 'Opening Envelope...';

    // Slide up Card out of the envelope body after flap animation finishes rotation
    setTimeout(() => {
      this.isCardEmerged = true;
      this.envelope.classList.add('card-emerged');
      this.hintText.textContent = 'Click Card to Open';
    }, 1000);
  }

  /**
   * Step 2: Swing Cover page leftwards, expose personalized elements and reveal next button
   */
  openCard() {
    this.isCardOpened = true;
    this.cardBook.classList.add('opened');
    this.hintText.textContent = ''; // Clear prompt as interaction completes

    // Expose circular navigation path after cover fold rotation completes
    setTimeout(() => {
      this.nextButton.classList.add('visible');
    }, 1200);
  }

  /**
   * Restore initial defaults for full repeatable navigability
   */
  reset() {
    this.isEnvelopeOpen = false;
    this.isCardEmerged = false;
    this.isCardOpened = false;

    this.envelope.classList.remove('open', 'card-emerged');
    this.envelope.classList.add('floating-envelope');
    this.cardBook.classList.remove('opened');
    this.hintText.textContent = 'Click the Envelope to open';
    this.nextButton.classList.remove('visible');
  }
}

// Utility Clamp Helper Function
function clamp(min, val, max) {
  return Math.max(min, Math.min(val, max));
}

// Global App Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Canvas background physics
  const environment = new EnvironmentalEngine();
  window.environmentalEngine = environment;

  // Initialize primary Scene Architecture Manager
  const app = new SceneManager();

  // Instantiate localized view controllers
  const cardController = new InteractiveCardController(app);
  window.birthdayCardController = cardController; // Global expose for hook resets

  // Wire Welcome CTA elements safely to navigate into Scene 2 (Greeting Card)
  const btnStart = document.getElementById('btn-start-celebration');
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      app.transitionTo('scene-card');
    });
  }

  // Wire Greeting Card Scene "Next" CTA to step forward into the placeholder Garden
  const btnNextScene = document.getElementById('btn-next-scene');
  if (btnNextScene) {
    btnNextScene.addEventListener('click', () => {
      app.transitionTo('scene-garden');
    });
  }

  // Kickstart system simulation loading
  new Loader(APP_CONFIG.loadingSimulationTime, () => {
    app.transitionTo('scene-welcome');
  });
});
