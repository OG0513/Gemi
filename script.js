/**
 * Interactive Premium Birthday Experience - Version 1
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
    this.currentSceneId = 'scene-loading';
    this.scenes = document.querySelectorAll('.scene');
    this.init();
  }

  init() {
    this.validateViewports();
    window.addEventListener('resize', () => this.validateViewports());
  }

  /**
   * transitions smoothly from one screen to another
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
      }, 50); // Small margin to force browser layout recalculation
    }, APP_CONFIG.transitionDelay);
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

// Global App Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Initialize primary Scene Architecture Manager
  const app = new SceneManager();

  // Create isolated triggers for interactive controls
  const handleStartExperience = () => {
    // Modular navigation ready for future card transitions
    console.log("Welcome complete. Ready for Version 2: Birthday Card Integration.");
  };

  // Wire CTA elements safely
  const btnStart = document.getElementById('btn-start-celebration');
  if (btnStart) {
    btnStart.addEventListener('click', handleStartExperience);
  }

  // Kickstart system simulation loading
  new Loader(APP_CONFIG.loadingSimulationTime, () => {
    app.transitionTo('scene-welcome');
  });
});
