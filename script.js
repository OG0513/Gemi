/**
 * Interactive Premium Birthday Experience - Version 4 (Optimized)
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
 * Draws 11 unique flower species scattered along the bottom edge, custom winds sways, 
 * and floating particles with Day/Night rendering overrides at a stable 60FPS.
 */
class EnvironmentalEngine {
  constructor() {
    this.canvas = document.getElementById('environmental-canvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.particles = [];
    this.flowers = [];
    this.windTime = 0;
    this.isNight = false;
    this.isTicking = false;
    this.activeState = 'loading';
    
    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.generateParticles(15); // Kept minimal to optimize rendering speed
    this.generateFlowers();

    this.start();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Smoothly re-establish flower coordinates without computational layout spikes
    this.generateFlowers();
  }

  /**
   * Set Night Mode flags inside rendering calculations
   * @param {boolean} active 
   */
  setNightMode(active) {
    this.isNight = active;
  }

  /**
   * Procedurally generates exactly 11 unique flower species with specific drawing profiles,
   * heights, stem thicknesses, color spaces, and wind phase intervals.
   */
  generateFlowers() {
    this.flowers = [];
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    // Defining 11 distinct flower species
    const speciesDefinitions = [
      { name: 'Rose', petalColor: '#F48FB1', nightColor: '#FF4081', stemThickness: 2.8, size: 10, offsetFactor: 0.1 },
      { name: 'Tulip', petalColor: '#FFAB91', nightColor: '#FF6E40', stemThickness: 2.5, size: 9, offsetFactor: 0.2 },
      { name: 'Lily', petalColor: '#FFF59D', nightColor: '#FFFF00', stemThickness: 2.2, size: 12, offsetFactor: 0.3 },
      { name: 'Daisy', petalColor: '#FFFFFF', nightColor: '#E040FB', stemThickness: 1.8, size: 8, offsetFactor: 0.4 },
      { name: 'Sunflower', petalColor: '#FFE082', nightColor: '#FFD700', stemThickness: 3.5, size: 14, offsetFactor: 0.5 },
      { name: 'Lavender', petalColor: '#B39DDB', nightColor: '#7C4DFF', stemThickness: 1.5, size: 7, offsetFactor: 0.6 },
      { name: 'Poppy', petalColor: '#EF9A9A', nightColor: '#FF1744', stemThickness: 2.0, size: 11, offsetFactor: 0.7 },
      { name: 'Orchid', petalColor: '#F48FB1', nightColor: '#D500F9', stemThickness: 2.1, size: 10, offsetFactor: 0.8 },
      { name: 'Cherry Blossom', petalColor: '#FFCDD2', nightColor: '#F50057', stemThickness: 1.9, size: 7, offsetFactor: 0.95 },
      { name: 'Bluebell', petalColor: '#9FA8DA', nightColor: '#2979FF', stemThickness: 1.6, size: 8, offsetFactor: 0.85 },
      { name: 'Wildflower', petalColor: '#80CBC4', nightColor: '#00E5FF', stemThickness: 1.4, size: 6, offsetFactor: 0.15 }
    ];

    // Distribute species cleanly along bottom line
    speciesDefinitions.forEach((spec, index) => {
      // Calculate layout coordinates using distinct spacing offsets
      const step = width / 12;
      const x = step * (index + 1) + (Math.random() - 0.5) * (step * 0.4);
      
      this.flowers.push({
        x: x,
        y: height,
        h: Math.random() * 50 + (window.innerHeight < 600 ? 70 : 120), // Taller on large displays
        species: spec,
        angleOffset: Math.random() * Math.PI,
        windPhase: Math.random() * Math.PI,
        swayRange: 0.03 + Math.random() * 0.03 // Gentle swaying values
      });
    });
  }

  generateParticles(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        r: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.1,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: -Math.random() * 0.2 - 0.05,
        phase: Math.random() * Math.PI
      });
    }
  }

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
    // Highly optimized calm wind cycle
    this.windTime += 0.002; 

    // Update floating light particles
    this.particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(this.windTime * 0.5 + p.phase) * 0.12; 
      
      // Wrap smoothly
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

    ctx.clearRect(0, 0, width, height);

    // Render Flowers
    this.flowers.forEach(f => {
      const windAngle = Math.sin(this.windTime * 1.0 + f.angleOffset) * f.swayRange;
      const topX = f.x + Math.sin(windAngle) * f.h;
      const topY = f.y - Math.cos(windAngle) * f.h;

      // Stem Drawing
      ctx.beginPath();
      ctx.moveTo(f.x, f.y);
      ctx.quadraticCurveTo(f.x + (topX - f.x) * 0.3, f.y - f.h * 0.5, topX, topY);
      ctx.strokeStyle = this.isNight ? 'rgba(25, 45, 30, 0.65)' : 'rgba(120, 150, 100, 0.65)';
      ctx.lineWidth = f.species.stemThickness;
      ctx.stroke();

      // Stem Leaves
      ctx.beginPath();
      ctx.ellipse(topX - 6, topY + 20, 6, 2, windAngle - 0.4, 0, Math.PI * 2);
      ctx.ellipse(topX + 6, topY + 40, 5, 2.2, windAngle + 0.4, 0, Math.PI * 2);
      ctx.fillStyle = this.isNight ? 'rgba(30, 55, 35, 0.55)' : 'rgba(130, 160, 110, 0.55)';
      ctx.fill();

      // Bloom Color Setting
      const color = this.isNight ? f.species.nightColor : f.species.petalColor;

      // Shadow glow layer for neon mode
      if (this.isNight) {
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
      }

      ctx.save();
      ctx.translate(topX, topY);
      ctx.rotate(windAngle);

      // Procedural Drawing Profiles for 11 Unique Species
      switch(f.species.name) {
        case 'Rose':
          this.drawRose(ctx, f.size, color);
          break;
        case 'Tulip':
          this.drawTulip(ctx, f.size, color);
          break;
        case 'Lily':
          this.drawLily(ctx, f.size, color);
          break;
        case 'Daisy':
          this.drawDaisy(ctx, f.size, color);
          break;
        case 'Sunflower':
          this.drawSunflower(ctx, f.size, color);
          break;
        case 'Lavender':
          this.drawLavender(ctx, f.size, color);
          break;
        case 'Poppy':
          this.drawPoppy(ctx, f.size, color);
          break;
        case 'Orchid':
          this.drawOrchid(ctx, f.size, color);
          break;
        case 'Cherry Blossom':
          this.drawCherryBlossom(ctx, f.size, color);
          break;
        case 'Bluebell':
          this.drawBluebell(ctx, f.size, color);
          break;
        case 'Wildflower':
          this.drawWildflower(ctx, f.size, color);
          break;
      }

      ctx.restore();

      if (this.isNight) {
        ctx.restore(); // Restore shadows
      }
    });

    // Draw Particles
    this.particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = this.isNight 
        ? `rgba(180, 220, 255, ${p.alpha * 0.8})` 
        : `rgba(255, 255, 255, ${p.alpha})`;
      ctx.fill();
    });
  }

  /* SPECIES 1: Swirling compact layers */
  drawRose(ctx, size, color) {
    ctx.fillStyle = color;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(0, 0, size - (i * 2.5), 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();
    }
  }

  /* SPECIES 2: Upward chalice design */
  drawTulip(ctx, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-size * 0.6, 0);
    ctx.bezierCurveTo(-size * 0.8, -size * 1.2, 0, -size * 1.5, 0, -size * 0.3);
    ctx.bezierCurveTo(0, -size * 1.5, size * 0.8, -size * 1.2, size * 0.6, 0);
    ctx.closePath();
    ctx.fill();
    
    // Front overlapping petal
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.4, size * 0.45, size * 0.7, 0, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  /* SPECIES 3: Outward curving elegant trumpet */
  drawLily(ctx, size, color) {
    ctx.fillStyle = color;
    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI) / 1.5);
      ctx.beginPath();
      ctx.ellipse(0, -size * 0.5, size * 0.4, size * 1.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    // Gold stamens
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(-1, -size * 0.2, 2, -size * 0.8);
  }

  /* SPECIES 4: Spoke-like radiating narrow petals */
  drawDaisy(ctx, size, color) {
    ctx.fillStyle = color;
    for (let i = 0; i < 8; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI) / 4);
      ctx.beginPath();
      ctx.ellipse(0, -size, size * 0.22, size * 1.1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
  }

  /* SPECIES 5: Large sunflower disc with pointed gold petals */
  drawSunflower(ctx, size, color) {
    ctx.fillStyle = color;
    for (let i = 0; i < 12; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI) / 6);
      ctx.beginPath();
      ctx.ellipse(0, -size * 0.9, size * 0.25, size * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = '#4E342E';
    ctx.fill();
  }

  /* SPECIES 6: Vertical tiny stacked nodes */
  drawLavender(ctx, size, color) {
    ctx.fillStyle = color;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.ellipse(0, -i * 8, size * 0.65, size * 0.45, 0.4, 0, Math.PI * 2);
      ctx.ellipse(0, -i * 8, size * 0.65, size * 0.45, -0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* SPECIES 7: Floppy paper-thin red petals */
  drawPoppy(ctx, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(-size * 0.4, 0, size * 0.9, size * 0.7, 0, 0, Math.PI * 2);
    ctx.ellipse(size * 0.4, 0, size * 0.9, size * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = '#1A1A1A';
    ctx.fill();
  }

  /* SPECIES 8: Asymmetric landing lip orchid */
  drawOrchid(ctx, size, color) {
    ctx.fillStyle = color;
    // Wing petals
    ctx.beginPath();
    ctx.ellipse(-size * 0.8, -size * 0.3, size * 0.7, size * 0.5, -0.4, 0, Math.PI * 2);
    ctx.ellipse(size * 0.8, -size * 0.3, size * 0.7, size * 0.5, 0.4, 0, Math.PI * 2);
    ctx.fill();
    // Landing lip
    ctx.beginPath();
    ctx.arc(0, size * 0.4, size * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = '#E040FB';
    ctx.fill();
  }

  /* SPECIES 9: Five delicate notched petals */
  drawCherryBlossom(ctx, size, color) {
    ctx.fillStyle = color;
    for (let i = 0; i < 5; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI * 2) / 5);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-size * 0.5, -size * 1.1);
      ctx.lineTo(0, -size * 0.8); // Center notch
      ctx.lineTo(size * 0.5, -size * 1.1);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  /* SPECIES 10: Drooping bell shaped capsules */
  drawBluebell(ctx, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, -size * 0.3, size * 0.65, Math.PI, 0, false);
    ctx.lineTo(size * 0.4, size * 0.3);
    ctx.lineTo(0, size * 0.05); // center bell ridge
    ctx.lineTo(-size * 0.4, size * 0.3);
    ctx.closePath();
    ctx.fill();
  }

  /* SPECIES 11: Multi-branching tiny stars */
  drawWildflower(ctx, size, color) {
    ctx.fillStyle = color;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc((i - 1.5) * 6, -i * 5, size * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }
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

  // Day/Night Interaction Bindings
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isNight = document.body.classList.toggle('night-mode');
      environment.setNightMode(isNight);
    });
  }

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
