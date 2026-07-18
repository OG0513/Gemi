/**
 * Dreamy Landscape - Version 3 Gallery Engine
 * Architectural elements structured modularly for performance and maintainability.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global Wind Parameters
  const windState = {
    strength: 1.0,
    speed: 1.0,
    targetStrength: 1.0,
    time: 0
  };

  // Environment Configs
  const config = {
    starsCount: 90,
    cloudsCount: 4,
    firefliesCount: 18,
    flowersCount: 22,
    grassDensity: 160
  };

  // Cache major selectors
  const loader = document.getElementById('loader');
  const mainScene = document.getElementById('main-scene');

  /**
   * 1. Dynamic Loading Screen Setup
   */
  function initLoading() {
    const container = document.getElementById('loader-particles');
    const width = window.innerWidth;
    const height = window.innerHeight;

    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'loader-particle';
      
      const size = Math.random() * 5 + 3;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * width}px`;
      particle.style.top = `${Math.random() * height}px`;
      
      const floatDuration = Math.random() * 10 + 10;
      particle.style.transition = `transform ${floatDuration}s linear, opacity 2s ease`;
      
      container.appendChild(particle);

      setTimeout(() => {
        particle.style.transform = `translate(${Math.random() * 40 - 20}px, -${Math.random() * 200 + 50}px)`;
        particle.style.opacity = '0';
      }, 50);
    }

    setTimeout(() => {
      loader.style.opacity = '0';
      mainScene.setAttribute('aria-hidden', 'false');
      mainScene.style.opacity = '1';
      mainScene.style.pointerEvents = 'auto';

      setTimeout(() => {
        loader.style.display = 'none';
      }, 1500);
    }, 3800);
  }

  /**
   * 2. Natural Wind Simulation Engine
   */
  function startWind() {
    function updateWind() {
      windState.time += 0.002;
      const baseWave = Math.sin(windState.time * 2);
      const spike = Math.sin(windState.time * 5.5) * 0.3;
      
      windState.targetStrength = Math.max(0.4, (baseWave + spike + 1.2));
      windState.strength += (windState.targetStrength - windState.strength) * 0.01;
      
      document.documentElement.style.setProperty('--wind-strength-multiplier', windState.strength.toFixed(3));
      
      requestAnimationFrame(updateWind);
    }
    requestAnimationFrame(updateWind);
  }

  /**
   * 3. Stars Field Construction
   */
  function createStars() {
    const container = document.getElementById('stars-container');
    const colors = ['#ffffff', '#fdfbf7', '#d2e4f1', '#dfdaf1'];

    for (let i = 0; i < config.starsCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      const size = Math.random() * 1.8 + 0.6;
      const x = Math.random() * 100;
      const y = Math.random() * 75;
      const baseOpacity = Math.random() * 0.6 + 0.2;
      
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      star.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      star.style.setProperty('--star-base-opacity', baseOpacity);
      
      const duration = Math.random() * 4 + 3;
      const delay = Math.random() * 5;
      star.style.animation = `twinkle ${duration}s ease-in-out infinite ${delay}s`;

      container.appendChild(star);
    }
  }

  /**
   * 4. Slow Ambient Cloud Assembly
   */
  function createClouds() {
    const container = document.getElementById('clouds-container');

    for (let i = 0; i < config.cloudsCount; i++) {
      const cloud = document.createElement('div');
      cloud.className = 'cloud';
      
      const width = Math.random() * 300 + 250;
      const height = width * 0.4;
      const x = Math.random() * 90;
      const y = Math.random() * 40 + 10;
      
      cloud.style.width = `${width}px`;
      cloud.style.height = `${height}px`;
      cloud.style.left = `${x}%`;
      cloud.style.top = `${y}%`;

      let driftX = 0;
      const speed = Math.random() * 0.015 + 0.005;

      function stepDrift() {
        driftX += speed;
        if (driftX > window.innerWidth * 1.1) {
          driftX = -width;
        }
        cloud.style.transform = `translateX(${driftX}px)`;
        requestAnimationFrame(stepDrift);
      }
      
      container.appendChild(cloud);
      requestAnimationFrame(stepDrift);
    }
  }

  /**
   * 5. Procedural Grass Cultivation
   */
  function createGrass() {
    const field = document.getElementById('grass-field');
    const colors = [
      'var(--color-muted-green)',
      '#566a42',
      '#3f512f',
      '#404d30',
      '#4d5a37'
    ];

    for (let i = 0; i < config.grassDensity; i++) {
      const blade = document.createElement('div');
      blade.className = 'grass-blade';
      
      const width = Math.random() * 4 + 2;
      const height = Math.random() * 85 + 40;
      const posX = Math.random() * 100;
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      const baseSwayAngle = Math.random() * 5 + 3; 
      
      blade.style.width = `${width}px`;
      blade.style.height = `${height}px`;
      blade.style.left = `${posX}%`;
      blade.style.backgroundColor = color;
      blade.style.zIndex = Math.floor(height);
      
      blade.style.setProperty('--sway-angle-base', baseSwayAngle);
      const swayDuration = Math.random() * 1.5 + 2.5;
      const swayDelay = Math.random() * -4;
      blade.style.animation = `sway ${swayDuration}s ease-in-out infinite alternate ${swayDelay}s`;

      field.appendChild(blade);
    }
  }

  /**
   * 6. Procedural Flower Garden Setup
   */
  function createFlowers() {
    const field = document.getElementById('flower-field');
    const colorThemes = [
      { petal: 'var(--color-blush-pink)', center: 'var(--color-soft-gold)' },
      { petal: 'var(--color-cream)', center: 'var(--color-soft-gold)' },
      { petal: 'var(--color-lavender)', center: 'var(--color-cream)' },
      { petal: 'var(--color-baby-blue)', center: 'var(--color-soft-gold)' }
    ];

    for (let i = 0; i < config.flowersCount; i++) {
      const flower = document.createElement('div');
      flower.className = 'flower';
      
      const posX = Math.random() * 92 + 4;
      const height = Math.random() * 50 + 35;
      const zIndexIndex = Math.floor(height);
      
      flower.style.left = `${posX}%`;
      flower.style.zIndex = zIndexIndex;
      
      const stem = document.createElement('div');
      stem.className = 'flower-stem';
      stem.style.height = `${height}px`;
      
      const head = document.createElement('div');
      head.className = 'flower-head';
      
      const theme = colorThemes[Math.floor(Math.random() * colorThemes.length)];
      
      const center = document.createElement('div');
      center.className = 'flower-center';
      center.style.backgroundColor = theme.center;
      head.appendChild(center);

      const petalCount = Math.floor(Math.random() * 3) + 5;
      const petalSize = Math.random() * 3 + 4;
      
      for (let p = 0; p < petalCount; p++) {
        const petal = document.createElement('div');
        petal.className = 'flower-petal';
        petal.style.backgroundColor = theme.petal;
        petal.style.width = `${petalSize}px`;
        petal.style.height = `${petalSize * 1.8}px`;
        
        const rotation = (p * (360 / petalCount));
        petal.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
        head.appendChild(petal);
      }

      flower.appendChild(stem);
      flower.appendChild(head);
      
      head.style.bottom = `${height}px`;

      flower.style.setProperty('--sway-angle-base', (Math.random() * 4 + 2));
      const swayDuration = Math.random() * 1.5 + 3.0;
      const swayDelay = Math.random() * -5;
      flower.style.animation = `sway ${swayDuration}s ease-in-out infinite alternate ${swayDelay}s`;

      field.appendChild(flower);
    }
  }

  /**
   * 7. Adaptive Fireflies Controller
   */
  function createFireflies() {
    const container = document.getElementById('firefly-container');
    const swarm = [];

    for (let i = 0; i < config.firefliesCount; i++) {
      const f = document.createElement('div');
      f.className = 'firefly';
      
      const glow = document.createElement('div');
      glow.className = 'firefly-glow';
      f.appendChild(glow);
      
      container.appendChild(f);

      swarm.push({
        element: f,
        x: Math.random() * window.innerWidth,
        y: Math.random() * (window.innerHeight * 0.7) + (window.innerHeight * 0.2),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.005,
        brightness: Math.random(),
        brightening: Math.random() > 0.5,
        targetX: Math.random() * window.innerWidth,
        targetY: Math.random() * window.innerHeight
      });
    }

    function updateSwarm() {
      swarm.forEach(fly => {
        fly.angle += (Math.random() - 0.5) * 0.15;
        
        fly.vx += Math.cos(fly.angle) * fly.speed * 0.1;
        fly.vy += Math.sin(fly.angle) * fly.speed * 0.1;
        
        fly.vx *= 0.98;
        fly.vy *= 0.98;
        
        fly.x += fly.vx;
        fly.y += fly.vy;
        
        const pad = 20;
        if (fly.x < -pad) fly.x = window.innerWidth + pad;
        if (fly.x > window.innerWidth + pad) fly.x = -pad;
        if (fly.y < -pad) fly.y = window.innerHeight + pad;
        if (fly.y > window.innerHeight + pad) fly.y = -pad;

        if (fly.brightening) {
          fly.brightness += 0.012;
          if (fly.brightness >= 1.0) fly.brightening = false;
        } else {
          fly.brightness -= 0.012;
          if (fly.brightness <= 0.15) fly.brightening = true;
        }

        fly.element.style.transform = `translate3d(${fly.x.toFixed(1)}px, ${fly.y.toFixed(1)}px, 0)`;
        fly.element.style.opacity = fly.brightness.toFixed(2);
      });
      requestAnimationFrame(updateSwarm);
    }
    
    requestAnimationFrame(updateSwarm);
  }

  /**
   * 8. Floating Petals Generator
   */
  function animatePetals() {
    const container = document.getElementById('petals-container');
    
    function spawnPetal() {
      if (container.childElementCount > 15) return;

      const petal = document.createElement('div');
      petal.className = 'petal-element';
      
      const size = Math.random() * 8 + 6;
      petal.style.width = `${size}px`;
      petal.style.height = `${size * 0.8}px`;
      
      const startX = Math.random() * window.innerWidth;
      const startY = -20;
      
      petal.style.left = `${startX}px`;
      petal.style.top = `${startY}px`;
      
      container.appendChild(petal);

      let posX = startX;
      let posY = startY;
      let angle = Math.random() * 360;
      let angleSpeed = (Math.random() - 0.5) * 1.5;
      
      const fallSpeed = Math.random() * 0.8 + 0.6;
      const driftAmplitude = Math.random() * 1.5 + 0.5;
      let driftTime = Math.random() * 100;

      function driftStep() {
        if (!petal.parentNode) return;

        driftTime += 0.01;
        posY += fallSpeed;
        posX += (Math.sin(driftTime) * driftAmplitude) + (windState.strength * 0.5);
        angle += angleSpeed;

        petal.style.transform = `translate3d(${(posX - startX).toFixed(1)}px, ${(posY - startY).toFixed(1)}px, 0) rotate(${angle.toFixed(1)}deg)`;

        if (posY > window.innerHeight + 20 || posX < -20 || posX > window.innerWidth + 20) {
          petal.remove();
        } else {
          requestAnimationFrame(driftStep);
        }
      }

      requestAnimationFrame(driftStep);
    }

    setInterval(spawnPetal, 1800);
  }

  /**
   * 9. Sparkles Generator System
   */
  function createSparkles(startX, startY) {
    const container = document.getElementById('interactive-anchor');
    const sparkleCount = 18;

    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      
      const size = Math.random() * 5 + 3;
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      sparkle.style.left = `${startX}px`;
      sparkle.style.top = `${startY}px`;

      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 90 + 30;
      const destX = Math.cos(angle) * distance;
      const destY = Math.sin(angle) * distance - 20;

      sparkle.style.setProperty('--dest-x', `${destX}px`);
      sparkle.style.setProperty('--dest-y', `${destY}px`);

      const duration = Math.random() * 0.6 + 0.8;
      const delay = Math.random() * 0.15;
      sparkle.style.animation = `sparkleOut ${duration}s cubic-bezier(0.25, 1, 0.5, 1) forwards ${delay}s`;

      container.appendChild(sparkle);

      setTimeout(() => {
        sparkle.remove();
      }, (duration + delay) * 1000);
    }
  }

  /**
   * 10. Interactive Envelope & Letter Orchestration (V2 & V3 Hooks)
   */
  function initEnvelopeLetter() {
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const sceneDimmer = document.getElementById('scene-dimmer');
    const letterOverlay = document.getElementById('letter-overlay');
    const letterParagraphs = document.querySelectorAll('.letter-paragraph');
    const btnContinue = document.getElementById('btn-continue');
    
    let alreadyOpened = false;

    function handleOpenEnvelope() {
      if (alreadyOpened) return;
      alreadyOpened = true;

      const rect = envelopeWrapper.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;

      envelopeWrapper.classList.add('active-opening');
      createSparkles(originX, originY);

      setTimeout(() => {
        sceneDimmer.classList.add('dimmed');
        letterOverlay.classList.add('visible');
        letterOverlay.setAttribute('aria-hidden', 'false');
      }, 1100);

      setTimeout(() => {
        revealParagraphs(0);
      }, 2300);
    }

    function revealParagraphs(index) {
      if (index >= letterParagraphs.length) {
        setTimeout(() => {
          btnContinue.classList.add('visible-btn');
          btnContinue.removeAttribute('disabled');
        }, 800);
        return;
      }

      letterParagraphs[index].classList.add('reveal-p');
      const delay = letterParagraphs[index].classList.contains('signature') ? 900 : 1800;
      
      setTimeout(() => {
        revealParagraphs(index + 1);
      }, delay);
    }

    envelopeWrapper.addEventListener('click', handleOpenEnvelope);
    envelopeWrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpenEnvelope();
      }
    });

    // Gallery Transition Trigger
    btnContinue.addEventListener('click', () => {
      letterOverlay.classList.remove('visible');
      letterOverlay.setAttribute('aria-hidden', 'true');
      
      const meadowContainer = document.getElementById('meadow-container');
      meadowContainer.style.transform = 'translateY(15vh)';

      sceneDimmer.classList.remove('dimmed');
      sceneDimmer.classList.add('dimmed-gallery');

      setTimeout(() => {
        initMemoryGallery();
      }, 500);
    });
  }

  /**
   * 11. V3 Single-Screen Memory Gallery Sequential Reveal Setup
   */
  function initMemoryGallery() {
    const galleryContainer = document.getElementById('gallery-container');
    const collageItems = document.querySelectorAll('.collage-item');
    
    galleryContainer.classList.add('visible');
    galleryContainer.setAttribute('aria-hidden', 'false');

    collageItems.forEach(item => {
      const rot = item.getAttribute('data-rotation') || '0';
      item.style.setProperty('--rotation-offset', `${rot}deg`);
    });

    // Cascaded sequential fade-and-scale animations
    collageItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('revealed-node');
      }, 250 * index);
    });
  }

  /**
   * 12. Parallax Camera Navigation System
   */
  function initParallax() {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouch) return;

    const layers = document.querySelectorAll('.parallax-layer');
    const envelope = document.getElementById('envelope-wrapper');
    
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    window.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      targetMouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    });

    function runLerpParallax() {
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      layers.forEach(layer => {
        const depth = parseFloat(layer.getAttribute('data-depth')) || 0;
        const moveX = currentMouseX * depth * -50;
        const moveY = currentMouseY * depth * -30;
        
        layer.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0)`;
      });

      // Subtle parallax shift applied to centered envelope to maintain three-dimensional space
      if (envelope && !envelope.classList.contains('active-opening')) {
        const moveX = currentMouseX * 0.05 * -35;
        const moveY = currentMouseY * 0.05 * -20;
        envelope.style.transform = `translate3d(calc(-50% + ${moveX.toFixed(2)}px), calc(-50% + ${moveY.toFixed(2)}px), 0)`;
      }

      requestAnimationFrame(runLerpParallax);
    }
    
    requestAnimationFrame(runLerpParallax);
  }

  /**
   * Complete Scene Orchestration Core
   */
  function initScene() {
    initLoading();
    startWind();
    createStars();
    createClouds();
    createGrass();
    createFlowers();
    createFireflies();
    animatePetals();
    initParallax();
    initEnvelopeLetter();
  }

  initScene();
});
