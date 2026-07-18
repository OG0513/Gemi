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
 * Creates real-time dynamic, wind-swept individual grass blades, floating light particles,
 * and elegant interactive flower stems at 60FPS.
 */
class EnvironmentalEngine {
  constructor() {
    this.canvas = document.getElementById('environmental-canvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.blades = [];
    this.particles = [];
    this.flowers = [];
    this.windTime = 0;
    this.activeState = 'loading'; // Syncs with currently active scene ID to govern density
    
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
   * Procedurally generate grass blades with varying heights, widths, and spring-wave settings
   */
  generateGrass() {
    this.blades = [];
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    // Calibrate blade count to screen width to maximize mobile performance
    const bladeCount = Math.floor(width / (window.innerWidth < 768 ? 4 : 2)); 

    for (let i = 0; i < bladeCount; i++) {
      const x = Math.random() * width;
      // Grass sits locked strictly at the bottom border of the screen
      const y = height; 
      
      const bladeHeight = clamp(40, Math.random() * 85 + 45, 140);
      const bladeWidth = Math.random() * 3.5 + 1.5;
      
      // Depth layering colors (Front: Golden green / Back: Deep sage green)
      const colorDepth = Math.random();
      const color = colorDepth > 0.5 
        ? `rgba(180, 196, 160, ${0.45 + Math.random() * 0.3})`  // soft golden-sage
        : `rgba(148, 168, 128, ${0.5 + Math.random() * 0.45})`;  // deep meadow sage

      this.blades.push({
        x: x,
        y: y,
        h: bladeHeight,
        w: bladeWidth,
        color: color,
        angleOffset: Math.random() * Math.PI, // Random phase offsets
        speed: 0.02 + Math.random() * 0.025,
        springiness: 12 + Math.random() * 8
      });
    }
  }

  /**
   * Instantiate flower systems resting directly within structural grass coordinates
   */
  generateFlowers() {
    this.flowers = [];
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    const flowerCount = window.innerWidth < 768 ? 4 : 8;
    const colors = ['#f4dcd6', '#fcece7', '#f3effc', '#eae0d5']; // Premium light pastel shades

    for (let i = 0; i < flowerCount; i++) {
      const x = (width * 0.1) + (Math.random() * width * 0.8);
      this.flowers.push({
        x: x,
        y: height,
        h: Math.random() * 50 + 90, // taller than average grass blades
        petalColor: colors[Math.floor(Math.random() * colors.length)],
        angleOffset: Math.random() * Math.PI,
        size: Math.random() * 3 + 4
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
        r: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.5 - 0.1,
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
    this.windTime += 0.005; // Governs global wind ripple speed

    // Update floating light particles
    this.particles.forEach(p => {
      p.y += p.speedY;
      // Sine wave lateral sway to mimic organic flight drift
      p.x += p.speedX + Math.sin(this.windTime + p.phase) * 0.2; 
      
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

    // 1. Draw Flowers (Distant Layer)
    this.flowers.forEach(f => {
      const windAngle = Math.sin(this.windTime * 2 + f.angleOffset) * 0.1;
      const topX = f.x + Math.sin(windAngle) * f.h;
      const topY = f.y - Math.cos(windAngle) * f.h;

      // Draw elegant stem
      ctx.beginPath();
      ctx.moveTo(f.x, f.y);
      ctx.quadraticCurveTo(f.x, f.y - f.h * 0.5, topX, topY);
      ctx.strokeStyle = 'rgba(148, 168, 128, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw delicate soft pastel bud
      ctx.beginPath();
      ctx.arc(topX, topY, f.size, 0, Math.PI * 2);
      ctx.fillStyle = f.petalColor;
      ctx.fill();

      // Golden core highlights
      ctx.beginPath();
      ctx.arc(topX, topY, f.size * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(212, 175, 55, 0.6)';
      ctx.fill();
    });

    // 2. Draw Grass Blades (Midground layer)
    ctx.lineCap = 'round';
    this.blades.forEach(b => {
      // Wind wave offset maps using the horizontal position creating an elegant continuous wave effect
      const wave = Math.sin(this.windTime * b.springiness + (b.x * 0.01) + b.angleOffset);
      const angle = wave * 0.15; // Limit max flex parameters to stay realistic

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
