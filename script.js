/**
 * Interactive Premium Birthday Experience - Version 3
 * Core Architecture & Scene Manager
 */

'use strict';

// Global App Configuration
const APP_CONFIG = {
  loadingSimulationTime: 2500, // Speed calibration of virtual asset initialization
  transitionDelay: 1200,      // Sync matching style.css transition speed
};

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

    // Step 1: Transition Out Active Scene
    activeScene.classList.add('hidden');
    activeScene.classList.remove('active');

    // Step 2: Swap state indicator flags after visual fade completes
    setTimeout(() => {
      activeScene.style.display = 'none';
      targetScene.style.display = 'flex';
      
      // Step 3: Trigger entrance transition on targeted elements
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
      // Re-trigger envelope controller instantiation to bind click handlers clean
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
      // Direct envelope logic blocks from triggering once card is detached
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
    this.cardBook.classList.remove('opened');
    this.hintText.textContent = 'Click the Envelope to open';
    this.nextButton.classList.remove('visible');
  }
}

// Global App Initialization
document.addEventListener('DOMContentLoaded', () => {
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
