/**
 * Interactive Premium Birthday Experience - Version 6 (The Grand Finale)
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
 * Draws 11 unique flower species scattered along the bottom edge, detailed branching leaf stems,
 * and floating particles with Day/Night rendering overrides at a stable 60FPS.
 * Incorporates a stunning Grand Finale Star spelling animation.
 */
class EnvironmentalEngine {
  constructor() {
    this.canvas = document.getElementById('environmental-canvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.particles = [];
    this.flowers = [];
    this.stars = [];
    this.confetti = [];
    
    this.windTime = 0;
    this.isNight = false;
    this.isTicking = false;
    this.activeState = 'loading';
    
    // Grand Finale Galaxy Star Spelling Points
    this.textTargetPoints = [];
    this.isSpellingStars = false;

    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.generateParticles(25); // Kept minimal to optimize rendering speed
    this.generateFlowers();
    this.generateBackgroundStars(100);

    this.start();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Smoothly re-establish coordinates without computational layout spikes
    this.generateFlowers();
    this.generateBackgroundStars(100);
    if (this.isSpellingStars) {
      this.rearrangeStarsToText();
    }
  }

  setNightMode(active) {
    this.isNight = active;
  }

  /**
   * Pre-calculates pixel point mapping of text "HAPPY BIRTHDAY ❤️" inside offscreen canvas
   */
  generateStarTextPoints() {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    // Target text dimensions
    tempCanvas.width = 400;
    tempCanvas.height = 100;
    
    tempCtx.fillStyle = '#ffffff';
    tempCtx.font = 'bold 32px "Cinzel", Georgia, serif';
    tempCtx.textAlign = 'center';
    tempCtx.textBaseline = 'middle';
    tempCtx.fillText('HAPPY BIRTHDAY ❤️', 200, 50);
    
    const imgData = tempCtx.getImageData(0, 0, 400, 100);
    const points = [];
    
    // Sampling pixels with reasonable density
    for (let y = 0; y < 100; y += 6) {
      for (let x = 0; x < 400; x += 6) {
        const idx = (y * 400 + x) * 4;
        if (imgData.data[idx] > 128) {
          points.push({ x: x - 200, y: y - 50 }); // Normalize around coordinates origin
        }
      }
    }
    return points;
  }

  /**
   * Triggers the Galaxy Star Spell sequence for the Grand Finale
   */
  rearrangeStarsToText() {
    this.isSpellingStars = true;
    this.textTargetPoints = this.generateStarTextPoints();
    
    const screenCenterX = this.canvas.width / 2;
    const screenCenterY = this.canvas.height * 0.3; // Spell in the clear upper sky
    
    // Map existing star coordinates smoothly to the text template points
    this.stars.forEach((star, index) => {
      if (index < this.textTargetPoints.length) {
        const pt = this.textTargetPoints[index];
        star.targetX = screenCenterX + pt.x * (window.innerWidth < 480 ? 0.75 : 1);
        star.targetY = screenCenterY + pt.y * (window.innerWidth < 480 ? 0.75 : 1);
        star.isSpelled = true;
      } else {
        // Unused extra stars drift gently outwards to form a beautiful celestial aura
        star.isSpelled = false;
        star.targetX = undefined;
        star.targetY = undefined;
      }
    });
  }

  /**
   * Procedurally generates exactly 11 unique flower species with specific drawing profiles.
   * Calculated to scale fluidly with no vertical layout cropping.
   */
  generateFlowers() {
    this.flowers = [];
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    const speciesDefinitions = [
      { name: 'Rose', petalColor: '#F48FB1', nightColor: '#FF4081', stemThickness: 2.8, size: 10 },
      { name: 'Tulip', petalColor: '#FFAB91', nightColor: '#FF6E40', stemThickness: 2.5, size: 9 },
      { name: 'Lily', petalColor: '#FFF59D', nightColor: '#FFFF00', stemThickness: 2.2, size: 12 },
      { name: 'Daisy', petalColor: '#FFFFFF', nightColor: '#E040FB', stemThickness: 1.8, size: 8 },
      { name: 'Sunflower', petalColor: '#FFE082', nightColor: '#FFD700', stemThickness: 3.5, size: 14 },
      { name: 'Lavender', petalColor: '#B39DDB', nightColor: '#7C4DFF', stemThickness: 1.5, size: 7 },
      { name: 'Poppy', petalColor: '#EF9A9A', nightColor: '#FF1744', stemThickness: 2.0, size: 11 },
      { name: 'Orchid', petalColor: '#F48FB1', nightColor: '#D500F9', stemThickness: 2.1, size: 10 },
      { name: 'Cherry Blossom', petalColor: '#FFCDD2', nightColor: '#F50057', stemThickness: 1.9, size: 7 },
      { name: 'Bluebell', petalColor: '#9FA8DA', nightColor: '#2979FF', stemThickness: 1.6, size: 8 },
      { name: 'Wildflower', petalColor: '#80CBC4', nightColor: '#00E5FF', stemThickness: 1.4, size: 6 }
    ];

    // Align base anchors with safe padding offsets to bypass hardware notches / safari UI overlaps
    const flowerBottomY = height - 12;

    speciesDefinitions.forEach((spec, index) => {
      const step = width / 12;
      const x = step * (index + 1) + (Math.random() - 0.5) * (step * 0.4);
      
      // Fluid scale stem height based on device sizes to ensure no clipping
      const stemHeight = clamp(70, height * 0.18 + Math.random() * 30, 180);

      this.flowers.push({
        x: x,
        y: flowerBottomY,
        h: stemHeight,
        species: spec,
        angleOffset: Math.random() * Math.PI,
        windPhase: Math.random() * Math.PI,
        swayRange: 0.045 + Math.random() * 0.025
      });
    });
  }

  generateBackgroundStars(count) {
    this.stars = [];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height * 0.5, // Render stars upper sky exclusively
        r: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.5 + 0.3,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        phase: Math.random() * Math.PI,
        targetX: undefined,
        targetY: undefined,
        isSpelled: false
      });
    }
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

  /**
   * Spawns physical colorful confetti upon candle blow sequence
   */
  spawnConfettiExplosion() {
    this.confetti = [];
    const colors = ['#f4dcd6', '#fcece7', '#f3effc', '#FFF9F2', '#c5a059', '#e2b4bd'];
    for (let i = 0; i < 70; i++) {
      this.confetti.push({
        x: this.canvas.width / 2,
        y: this.canvas.height * 0.65,
        r: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 12 - 4,
        gravity: 0.25,
        alpha: 1
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
    this.windTime += 0.003; 

    // Update floating light particles
    this.particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(this.windTime * 0.5 + p.phase) * 0.12; 
      
      if (p.y < -10) {
        p.y = this.canvas.height + 10;
        p.x = Math.random() * this.canvas.width;
      }
    });

    // Update galaxy stars smooth interpolation vector targets
    this.stars.forEach(star => {
      if (this.isSpellingStars && star.isSpelled) {
        // Smooth easing vector interpolation
        star.x += (star.targetX - star.x) * 0.05;
        star.y += (star.targetY - star.y) * 0.05;
      } else {
        // Standard starry sky drift movement
        star.x += Math.sin(this.windTime * 0.1 + star.phase) * 0.05;
      }
    });

    // Confetti Physics simulation
    this.confetti.forEach((c, idx) => {
      c.vy += c.gravity;
      c.x += c.vx;
      c.y += c.vy;
      c.alpha -= 0.012;
      
      if (c.alpha <= 0) {
        this.confetti.splice(idx, 1);
      }
    });
  }

  render() {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Stars (If Night mode is active or spelling sequence triggers)
    if (this.isNight) {
      this.stars.forEach(star => {
        const pulseAlpha = star.isSpelled 
          ? 1.0 
          : star.alpha + Math.sin(this.windTime * star.pulseSpeed + star.phase) * 0.25;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.isSpelled ? star.r * 1.3 : star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
        
        if (star.isSpelled) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#ffffff';
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    }

    // 2. Draw Flowers (Organic, non-row bottom scatters)
    this.flowers.forEach(f => {
      const windAngle = Math.sin(this.windTime * 1.0 + f.angleOffset) * f.swayRange;
      const topX = f.x + Math.sin(windAngle) * f.h;
      const topY = f.y - Math.cos(windAngle) * f.h;

      // Draw Main Stem with realistic sway
      ctx.beginPath();
      ctx.moveTo(f.x, f.y);
      ctx.quadraticCurveTo(f.x + (topX - f.x) * 0.35, f.y - f.h * 0.5, topX, topY);
      ctx.strokeStyle = this.isNight ? 'rgba(25, 45, 30, 0.65)' : 'rgba(120, 150, 100, 0.65)';
      ctx.lineWidth = f.species.stemThickness;
      ctx.stroke();

      // Draw branching lateral stems for secondary miniature blossoms
      const branchX = f.x + (topX - f.x) * 0.45;
      const branchY = f.y - f.h * 0.45;
      const branchAngle = windAngle + 0.35;
      const branchLen = f.h * 0.28;
      const branchTopX = branchX - Math.sin(branchAngle) * branchLen;
      const branchTopY = branchY - Math.cos(branchAngle) * branchLen;

      ctx.beginPath();
      ctx.moveTo(branchX, branchY);
      ctx.quadraticCurveTo(branchX - 10, branchY - branchLen * 0.5, branchTopX, branchTopY);
      ctx.stroke();

      // Stem Leaves
      ctx.beginPath();
      ctx.ellipse(topX - 6, topY + 20, 6, 2, windAngle - 0.4, 0, Math.PI * 2);
      ctx.ellipse(topX + 6, topY + 40, 5, 2.2, windAngle + 0.4, 0, Math.PI * 2);
      ctx.fillStyle = this.isNight ? 'rgba(30, 55, 35, 0.55)' : 'rgba(130, 160, 110, 0.55)';
      ctx.fill();

      const color = this.isNight ? f.species.nightColor : f.species.petalColor;

      // Primary Bloom Glow Layer
      if (this.isNight) {
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
      }

      // Draw Primary Bloom Node
      ctx.save();
      ctx.translate(topX, topY);
      ctx.rotate(windAngle);
      this.drawSpeciesBloom(ctx, f.species.name, f.species.size, color);
      ctx.restore();

      // Draw Secondary Miniature Bloom Node at Branch Tip
      ctx.save();
      ctx.translate(branchTopX, branchTopY);
      ctx.rotate(branchAngle);
      this.drawSpeciesBloom(ctx, f.species.name, f.species.size * 0.6, color);
      ctx.restore();

      if (this.isNight) {
        ctx.restore(); 
      }
    });

    // 3. Draw Confetti particles
    this.confetti.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fillStyle = c.color;
      ctx.globalAlpha = c.alpha;
      ctx.fill();
    });
    ctx.globalAlpha = 1.0; // Reset canvas transparency global state

    // 4. Draw Particles
    this.particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = this.isNight 
        ? `rgba(180, 220, 255, ${p.alpha * 0.8})` 
        : `rgba(255, 255, 255, ${p.alpha})`;
      ctx.fill();
    });
  }

  drawSpeciesBloom(ctx, name, size, color) {
    switch(name) {
      case 'Rose': this.drawRose(ctx, size, color); break;
      case 'Tulip': this.drawTulip(ctx, size, color); break;
      case 'Lily': this.drawLily(ctx, size, color); break;
      case 'Daisy': this.drawDaisy(ctx, size, color); break;
      case 'Sunflower': this.drawSunflower(ctx, size, color); break;
      case 'Lavender': this.drawLavender(ctx, size, color); break;
      case 'Poppy': this.drawPoppy(ctx, size, color); break;
      case 'Orchid': this.drawOrchid(ctx, size, color); break;
      case 'Cherry Blossom': this.drawCherryBlossom(ctx, size, color); break;
      case 'Bluebell': this.drawBluebell(ctx, size, color); break;
      case 'Wildflower': this.drawWildflower(ctx, size, color); break;
    }
  }

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

  drawTulip(ctx, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-size * 0.6, 0);
    ctx.bezierCurveTo(-size * 0.8, -size * 1.2, 0, -size * 1.5, 0, -size * 0.3);
    ctx.bezierCurveTo(0, -size * 1.5, size * 0.8, -size * 1.2, size * 0.6, 0);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.4, size * 0.45, size * 0.7, 0, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

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
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(-1, -size * 0.2, 2, -size * 0.8);
  }

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

  drawLavender(ctx, size, color) {
    ctx.fillStyle = color;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.ellipse(0, -i * 8, size * 0.65, size * 0.45, 0.4, 0, Math.PI * 2);
      ctx.ellipse(0, -i * 8, size * 0.65, size * 0.45, -0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

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

  drawOrchid(ctx, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(-size * 0.8, -size * 0.3, size * 0.7, size * 0.5, -0.4, 0, Math.PI * 2);
    ctx.ellipse(size * 0.8, -size * 0.3, size * 0.7, size * 0.5, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, size * 0.4, size * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = '#E040FB';
    ctx.fill();
  }

  drawCherryBlossom(ctx, size, color) {
    ctx.fillStyle = color;
    for (let i = 0; i < 5; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI * 2) / 5);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-size * 0.5, -size * 1.1);
      ctx.lineTo(0, -size * 0.8);
      ctx.lineTo(size * 0.5, -size * 1.1);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  drawBluebell(ctx, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, -size * 0.3, size * 0.65, Math.PI, 0, false);
    ctx.lineTo(size * 0.4, size * 0.3);
    ctx.lineTo(0, size * 0.05);
    ctx.lineTo(-size * 0.4, size * 0.3);
    ctx.closePath();
    ctx.fill();
  }

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
    this.scenes = ['scene-loading', 'scene-welcome', 'scene-card', 'scene-garden', 'scene-gift', 'scene-cake', 'scene-celebration'];
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

    activeScene.classList.add('hidden');
    activeScene.classList.remove('active');

    setTimeout(() => {
      activeScene.style.display = 'none';
      targetScene.style.display = 'flex';
      
      setTimeout(() => {
        targetScene.classList.remove('hidden');
        targetScene.classList.add('active');
        this.currentSceneId = targetSceneId;
        
        // Dispatch localized hook for newly focused scenes
        this.onSceneFocus(targetSceneId);
      }, 50); 
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
    
    // Activating Grand Finale Galaxy Spell
    if (sceneId === 'scene-celebration') {
      document.body.classList.add('night-mode');
      if (window.environmentalEngine) {
        window.environmentalEngine.setNightMode(true);
        window.environmentalEngine.rearrangeStarsToText();
      }
      setTimeout(() => {
        const board = document.getElementById('final-wish-card');
        if (board) {
          board.classList.remove('hidden');
          board.style.opacity = 0;
          board.style.transition = 'opacity 2s ease';
          setTimeout(() => board.style.opacity = 1, 100);
        }
      }, 1500);
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

      this.progressBar.style.width = `${percentage}%`;
      this.percentageText.textContent = `${percentage}%`;

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
        }, 400); 
      }
    };

    requestAnimationFrame(updateLoader);
  }
}

/**
 * Interactive Birthday Card Scene Controller
 * FAST AUTOMATED TIMELINE SEQUENCE
 */
class InteractiveCardController {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    
    this.envelope = document.getElementById('envelope-wrapper');
    this.cardBook = document.getElementById('card-book');
    this.cardCover = document.getElementById('card-cover-container');
    this.hintText = document.getElementById('card-interaction-hint');
    this.nextButton = document.getElementById('btn-next-scene');
    this.innerContent = document.querySelector('.inside-right-content');

    this.isInteracting = false;
    this.isEnvelopeOpen = false;
    this.isCardEmerged = false;
    this.isCardOpened = false;

    this.bindEvents();
  }

  bindEvents() {
    this.envelope.addEventListener('click', (e) => {
      if (!this.isInteracting) {
        this.startCinematicSequence();
        e.stopPropagation();
      }
    });
  }

  startCinematicSequence() {
    this.isInteracting = true;
    this.envelope.classList.remove('floating-envelope'); 
    
    this.envelope.classList.add('shake-react');
    this.hintText.textContent = 'Opening...';

    setTimeout(() => {
      this.envelope.classList.remove('shake-react');
      
      this.isEnvelopeOpen = true;
      this.envelope.classList.add('open');
      
      setTimeout(() => {
        this.isCardEmerged = true;
        this.envelope.classList.add('emerge-full');
        this.envelope.classList.add('dimmed');
        this.hintText.textContent = '';

        setTimeout(() => {
          this.isCardOpened = true;
          this.cardBook.classList.add('opened');
          
          setTimeout(() => {
            this.innerContent.classList.add('visible');

            setTimeout(() => {
              this.nextButton.classList.add('visible');
              setTimeout(() => {
                this.nextButton.classList.add('floating-btn');
              }, 400);
            }, 400);
          }, 450);
        }, 650);
      }, 350);
    }, 150);
  }

  reset() {
    this.isInteracting = false;
    this.isEnvelopeOpen = false;
    this.isCardEmerged = false;
    this.isCardOpened = false;

    this.envelope.classList.remove('open', 'card-emerged', 'emerge-half', 'emerge-full', 'dimmed', 'shake-react');
    this.envelope.classList.add('floating-envelope');
    this.cardBook.classList.remove('opened');
    this.innerContent.classList.remove('visible');
    this.hintText.textContent = 'Click the Envelope to open';
    this.nextButton.classList.remove('visible', 'floating-btn');
  }
}

/**
 * Controller for Scene 5 (The Floating Gift Box)
 */
class InteractiveGiftController {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.giftBox = document.getElementById('gift-box');
    this.letterCard = document.getElementById('gift-letter');
    this.hintText = document.getElementById('gift-interaction-hint');
    this.btnNext = document.getElementById('btn-gift-next');
    
    this.isOpened = false;
    this.bindEvents();
  }

  bindEvents() {
    this.giftBox.addEventListener('click', (e) => {
      if (!this.isOpened) {
        this.openGift();
        e.stopPropagation();
      }
    });
  }

  openGift() {
    this.isOpened = true;
    this.giftBox.classList.add('opened');
    this.hintText.textContent = '';

    setTimeout(() => {
      this.letterCard.classList.remove('hidden');
      setTimeout(() => {
        this.letterCard.classList.add('visible');
      }, 50);
    }, 800);
  }

  reset() {
    this.isOpened = false;
    this.giftBox.classList.remove('opened');
    this.letterCard.classList.add('hidden');
    this.letterCard.classList.remove('visible');
    this.hintText.textContent = 'Tap the floating box to reveal your gift';
  }
}

/**
 * Controller for Scene 6 (The Interactive Cake)
 */
class InteractiveCakeController {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.cake = document.getElementById('interactive-cake');
    this.flame = document.getElementById('candle-flame');
    this.hintText = document.getElementById('cake-interaction-hint');
    this.btnNext = document.getElementById('btn-cake-next');
    
    this.isBlown = false;
    this.bindEvents();
  }

  bindEvents() {
    this.cake.addEventListener('click', (e) => {
      if (!this.isBlown) {
        this.blowCandle();
        e.stopPropagation();
      }
    });
  }

  blowCandle() {
    this.isBlown = true;
    this.flame.style.opacity = 0;
    this.flame.style.transform = 'translateX(-50%) scale(0)';
    this.hintText.textContent = '';

    // Confetti effect burst
    if (window.environmentalEngine) {
      window.environmentalEngine.spawnConfettiExplosion();
    }

    setTimeout(() => {
      this.btnNext.classList.add('visible');
      this.btnNext.classList.add('floating-btn');
    }, 800);
  }

  reset() {
    this.isBlown = false;
    this.flame.style.opacity = 1;
    this.flame.style.transform = 'translateX(-50%) scale(1)';
    this.hintText.textContent = 'Click the glowing candle to blow it out';
    this.btnNext.classList.remove('visible', 'floating-btn');
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
  window.birthdayCardController = cardController; 

  const giftController = new InteractiveGiftController(app);
  window.birthdayGiftController = giftController;

  const cakeController = new InteractiveCakeController(app);
  window.birthdayCakeController = cakeController;

  // Setup Standard Navigation triggers
  const btnStart = document.getElementById('btn-start-celebration');
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      app.transitionTo('scene-card');
    });
  }

  const btnNextScene = document.getElementById('btn-next-scene');
  if (btnNextScene) {
    btnNextScene.addEventListener('click', () => {
      app.transitionTo('scene-garden');
      // Trigger auto-fade on garden next button
      setTimeout(() => {
        const gBtn = document.getElementById('btn-garden-next');
        if (gBtn) gBtn.classList.add('visible');
      }, 1500);
    });
  }

  const btnGardenNext = document.getElementById('btn-garden-next');
  if (btnGardenNext) {
    btnGardenNext.addEventListener('click', () => {
      app.transitionTo('scene-gift');
      giftController.reset();
    });
  }

  const btnGiftNext = document.getElementById('btn-gift-next');
  if (btnGiftNext) {
    btnGiftNext.addEventListener('click', () => {
      app.transitionTo('scene-cake');
      cakeController.reset();
    });
  }

  const btnCakeNext = document.getElementById('btn-cake-next');
  if (btnCakeNext) {
    btnCakeNext.addEventListener('click', () => {
      app.transitionTo('scene-celebration');
    });
  }

  // Kickstart system simulation loading
  new Loader(APP_CONFIG.loadingSimulationTime, () => {
    app.transitionTo('scene-welcome');
  });
});
