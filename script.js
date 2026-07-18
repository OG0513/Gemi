/**
 * Dreamy Landscape - Version 5 Final Engine
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
    grassDensity: 160,
    candlesCount: 3 // Dynamic candle count (Configurable)
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

      dismissActiveMessage();

      const rect = envelopeWrapper.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;

      envelopeWrapper.classList.add('active-opening');
      createSparkles(originX, originY);

      // Lock interactive entities
      const interactiveObjects = document.querySelectorAll('.interactive-object');
      interactiveObjects.forEach(obj => obj.style.pointerEvents = 'none');

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
    const btnToTree = document.getElementById('btn-to-tree');
    
    galleryContainer.classList.add('visible');
    galleryContainer.setAttribute('aria-hidden', 'false');

    collageItems.forEach(item => {
      const rot = item.getAttribute('data-rotation') || '0';
      item.style.setProperty('--rotation-offset', `${rot}deg`);
    });

    collageItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('revealed-node');
      }, 250 * index);
    });

    // Fade-in tree transition control option once collage finishes
    setTimeout(() => {
      btnToTree.classList.add('visible-btn');
    }, 250 * collageItems.length + 500);

    // Bind transition logic leading into the V5 Wish Tree segment
    btnToTree.addEventListener('click', () => {
      galleryContainer.classList.remove('visible');
      galleryContainer.setAttribute('aria-hidden', 'true');

      // Shift dimmer overlay dynamically
      const dimmer = document.getElementById('scene-dimmer');
      dimmer.classList.remove('dimmed-gallery');
      dimmer.classList.add('dimmed');

      setTimeout(() => {
        initWishTreeSequence();
      }, 500);
    });
  }

  /**
   * 12. V4 Interactive Objects Orchestrator
   */
  let currentActiveMessageTimeout = null;

  function initInteractiveObjects() {
    const objects = [
      { id: 'obj-lantern', message: "Wishing you a year full of light and happiness." },
      { id: 'obj-cat', message: "You deserve all the cozy comfort in the world today." },
      { id: 'obj-teddy', message: "Sending you the warmest, coziest teddy bear hug!" },
      { id: 'obj-gift', message: "A little surprise packed with love just for you!" },
      { id: 'obj-flower', message: "Keep blooming beautifully, just as you are." },
      { id: 'interactive-moon', message: "May your path always be guided by gentle, warm light." }
    ];

    objects.forEach(obj => {
      const element = document.getElementById(obj.id);
      if (!element) return;

      element.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerObjectAnimation(obj.id, element);
        revealSpeechBubble(element, obj.message);
      });

      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          triggerObjectAnimation(obj.id, element);
          revealSpeechBubble(element, obj.message);
        }
      });
    });

    document.addEventListener('click', () => {
      dismissActiveMessage();
    });
  }

  function triggerObjectAnimation(id, element) {
    if (id === 'obj-gift') {
      if (!element.classList.contains('gift-open')) {
        element.classList.add('gift-open');
        triggerConfettiBurst(element);
        
        setTimeout(() => {
          element.classList.remove('gift-open');
        }, 3000);
      }
    } else if (id === 'obj-teddy') {
      const paw = document.getElementById('teddy-paw-left');
      if (paw && !paw.classList.contains('wave-anim')) {
        paw.classList.add('wave-anim');
        setTimeout(() => paw.classList.remove('wave-anim'), 2400);
      }
    } else if (id === 'interactive-moon') {
      const wrapper = document.getElementById('interactive-anchor');
      const ripple = document.createElement('div');
      ripple.className = 'moon-ripple';
      wrapper.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 2500);
    } else if (id === 'obj-cat') {
      element.style.transform = 'scale(1.15) translateY(-3px)';
      setTimeout(() => element.style.transform = '', 600);
    } else if (id === 'obj-flower') {
      triggerPetalBurst(element);
    }
  }

  function triggerConfettiBurst(element) {
    const anchor = document.getElementById('interactive-anchor');
    const rect = element.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top;

    const colors = ['#f2d5dc', '#dfdaf1', '#d2e4f1', '#edd18a', '#b2c29c'];

    for (let i = 0; i < 22; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-particle';
      p.style.left = `${startX}px`;
      p.style.top = `${startY}px`;
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

      const angle = Math.random() * Math.PI - Math.PI / 1.1;
      const velocity = Math.random() * 110 + 60;
      const destX = Math.cos(angle) * velocity;
      const destY = Math.sin(angle) * velocity;
      const rot = Math.random() * 360;

      p.style.setProperty('--cx', `${destX}px`);
      p.style.setProperty('--cy', `${destY}px`);
      p.style.setProperty('--rot', `${rot}deg`);

      p.style.animation = `confettiExplode 1.8s cubic-bezier(0.1, 0.8, 0.3, 1) forwards`;
      anchor.appendChild(p);

      setTimeout(() => p.remove(), 1800);
    }
  }

  function triggerPetalBurst(element) {
    const anchor = document.getElementById('interactive-anchor');
    const rect = element.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top;

    for (let i = 0; i < 6; i++) {
      const p = document.createElement('div');
      p.className = 'petal-element';
      p.style.left = `${startX}px`;
      p.style.top = `${startY}px`;
      p.style.width = '8px';
      p.style.height = '12px';

      const angle = (Math.random() - 0.5) * 2;
      const velocity = Math.random() * 50 + 20;
      
      let x = startX;
      let y = startY;
      let driftTime = 0;

      function step() {
        y += 1.5;
        x += Math.sin(driftTime) * 1.5 + angle * 0.5;
        driftTime += 0.05;

        p.style.transform = `translate3d(${(x - startX).toFixed(1)}px, ${(y - startY).toFixed(1)}px, 0) rotate(${(driftTime * 40).toFixed(0)}deg)`;
        
        if (y > window.innerHeight) {
          p.remove();
        } else {
          requestAnimationFrame(step);
        }
      }
      
      anchor.appendChild(p);
      requestAnimationFrame(step);
    }
  }

  function revealSpeechBubble(element, message) {
    dismissActiveMessage();

    const card = document.getElementById('object-message-card');
    const textSpan = document.getElementById('object-message-text');

    textSpan.textContent = message;

    const rect = element.getBoundingClientRect();
    const cardWidth = 220;

    const x = rect.left + rect.width / 2 - cardWidth / 2;
    const y = rect.top - 70;

    card.style.left = `${Math.max(10, Math.min(window.innerWidth - cardWidth - 10, x))}px`;
    card.style.top = `${y}px`;

    card.classList.add('visible');
    card.setAttribute('aria-hidden', 'false');

    currentActiveMessageTimeout = setTimeout(() => {
      dismissActiveMessage();
    }, 4500);
  }

  function dismissActiveMessage() {
    if (currentActiveMessageTimeout) {
      clearTimeout(currentActiveMessageTimeout);
      currentActiveMessageTimeout = null;
    }
    const card = document.getElementById('object-message-card');
    card.classList.remove('visible');
    card.setAttribute('aria-hidden', 'true');
  }

  /**
   * 13. V5 Magical Wish Tree Segment
   */
  let treeStage = 0;

  function initWishTreeSequence() {
    const overlay = document.getElementById('wish-tree-overlay');
    overlay.classList.add('visible');
    overlay.setAttribute('aria-hidden', 'false');

    const tree = document.getElementById('wish-tree');
    
    // First stage seeding elements
    growTreeLeavesAndLights(0);

    tree.addEventListener('click', handleTreeGrowth);
    tree.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleTreeGrowth();
      }
    });
  }

  function handleTreeGrowth() {
    const tree = document.getElementById('wish-tree');
    const text = document.getElementById('tree-progress-text');
    
    if (treeStage >= 3) {
      // Tree reaches peak cosmic form; trigger sparks & transition to cake celebration
      triggerFinalTreeCelebration(tree);
      return;
    }

    treeStage++;
    
    // Clear and scale up leaf elements relative to stage counts
    tree.className = `wish-tree stage-${treeStage}`;
    growTreeLeavesAndLights(treeStage);

    // Update text helper based on active stage bounds
    if (treeStage === 1) {
      text.textContent = "The wish sprouts! Tap again to nourish...";
    } else if (treeStage === 2) {
      text.textContent = "Branches are expanding! Keep going...";
    } else if (treeStage === 3) {
      text.textContent = "Almost fully grown! One final tap to harvest the magic...";
      document.getElementById('tree-click-prompt').textContent = "Trigger Magic ✨";
    }

    // Spark feedback on grow clicks
    const rect = tree.getBoundingClientRect();
    createSparkles(rect.left + rect.width / 2, rect.top + rect.height / 3);
  }

  function growTreeLeavesAndLights(stage) {
    const leavesContainer = document.getElementById('tree-leaves-container');
    const lightsContainer = document.getElementById('tree-lights-container');
    const butterflyContainer = document.getElementById('tree-butterflies-container');

    // Pre-calculate leaf locations inside coordinate brackets
    const leafSpreads = [
      // Stage 0 sprout leaves
      [{ top: '25%', left: '46%', size: 14 }, { top: '30%', left: '50%', size: 12 }],
      // Stage 1 leaf branches
      [{ top: '15%', left: '35%', size: 18 }, { top: '10%', left: '48%', size: 16 }, { top: '22%', left: '60%', size: 18 }, { top: '35%', left: '25%', size: 14 }],
      // Stage 2 blooming pink leaves
      [{ top: '5%', left: '40%', size: 22, color: 'glowing' }, { top: '12%', left: '22%', size: 20 }, { top: '18%', left: '68%', size: 22, color: 'glowing' }, { top: '28%', left: '72%', size: 16 }],
      // Stage 3 cosmic leaves
      [{ top: '0%', left: '44%', size: 24, color: 'glowing' }, { top: '8%', left: '62%', size: 24 }, { top: '22%', left: '15%', size: 20, color: 'glowing' }]
    ];

    // Build leaves sequentially matching active stage indices
    leafSpreads[stage].forEach((leafData, idx) => {
      const leaf = document.createElement('div');
      leaf.className = 'tree-leaf';
      if (leafData.color === 'glowing') leaf.classList.add('glowing-leaf');
      
      leaf.style.width = `${leafData.size}px`;
      leaf.style.height = `${leafData.size * 1.5}px`;
      leaf.style.top = leafData.top;
      leaf.style.left = leafData.left;
      
      leavesContainer.appendChild(leaf);
      
      // Delay slightly for natural unfold
      setTimeout(() => leaf.classList.add('active-leaf'), 50 * idx);
    });

    // Populate fairy lights
    const lightCoords = [
      [{ top: '35%', left: '40%' }],
      [{ top: '25%', left: '28%' }, { top: '28%', left: '55%' }],
      [{ top: '12%', left: '46%' }, { top: '18%', left: '64%' }],
      [{ top: '4%', left: '38%' }, { top: '10%', left: '55%' }]
    ];

    lightCoords[stage].forEach((coord, idx) => {
      const light = document.createElement('div');
      light.className = 'tree-light-bulb';
      light.style.top = coord.top;
      light.style.left = coord.left;
      
      lightsContainer.appendChild(light);
      setTimeout(() => light.classList.add('active-light'), 100 * idx);
    });

    // Add butterfly on stage 2
    if (stage === 2) {
      const bf = document.createElement('div');
      bf.className = 'tree-butterfly';
      bf.style.top = '20%';
      bf.style.left = '30%';
      
      const wingL = document.createElement('div');
      wingL.className = 'bf-wing left';
      const wingR = document.createElement('div');
      wingR.className = 'bf-wing right';
      
      bf.appendChild(wingL);
      bf.appendChild(wingR);
      butterflyContainer.appendChild(bf);
      
      setTimeout(() => bf.classList.add('active-butterfly'), 500);
    }
  }

  function triggerFinalTreeCelebration(tree) {
    const overlay = document.getElementById('wish-tree-overlay');
    const text = document.getElementById('tree-progress-text');
    
    // Dazzle flash sparkles
    const rect = tree.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 3;
    
    createSparkles(originX, originY);
    setTimeout(() => createSparkles(originX - 40, originY + 40), 150);
    setTimeout(() => createSparkles(originX + 40, originY + 40), 300);

    text.textContent = "Your wish is sowed in the cosmos...";
    document.getElementById('tree-click-prompt').style.opacity = '0';

    // Begin Transition leading directly into V5 Cake Celebration
    setTimeout(() => {
      overlay.style.opacity = '0';
      overlay.style.transform = 'translate3d(0, -30px, 0)';
      
      // Dim stars/clouds slightly to highlight upcoming focus
      document.getElementById('clouds-container').style.opacity = '0.3';
      
      // Brighten Moon intensely
      const moon = document.getElementById('interactive-moon');
      moon.style.transform = 'scale(1.15)';
      
      setTimeout(() => {
        overlay.style.display = 'none';
        initCakeCelebration();
      }, 1500);
    }, 1800);
  }

  /**
   * 14. V5 Birthday Cake Celebration View Layer Logic
   */
  let litCandlesCount = 0;
  let allCandlesAreLit = false;

  function initCakeCelebration() {
    const overlay = document.getElementById('cake-celebration-overlay');
    overlay.classList.add('visible');
    overlay.setAttribute('aria-hidden', 'false');

    const candleRow = document.getElementById('cake-candles-row');
    
    // Dynamically generate Candle list relative to Config count bounds
    for (let i = 0; i < config.candlesCount; i++) {
      const candle = document.createElement('div');
      candle.className = 'cake-candle-item';
      candle.setAttribute('role', 'button');
      candle.setAttribute('tabindex', '0');
      candle.setAttribute('aria-label', `Candle ${i + 1}. Unlit.`);

      const stick = document.createElement('div');
      stick.className = 'candle-stick';
      
      const wick = document.createElement('div');
      wick.className = 'candle-wick';
      stick.appendChild(wick);
      
      const flame = document.createElement('div');
      flame.className = 'candle-flame';
      
      candle.appendChild(stick);
      candle.appendChild(flame);
      candleRow.appendChild(candle);

      // Tap event binds to spark and light candle sticks
      const handleLight = (e) => {
        e.stopPropagation();
        if (candle.classList.contains('lit')) return;

        candle.classList.add('lit');
        candle.setAttribute('aria-label', `Candle ${i + 1}. Lit.`);
        
        // Spark effect centered directly at candle wick coordinate bounds
        const rect = wick.getBoundingClientRect();
        createSparkles(rect.left + rect.width / 2, rect.top);
        
        litCandlesCount++;
        checkCelebrationLitState();
      };

      candle.addEventListener('click', handleLight);
      candle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleLight(e);
        }
      });
    }
  }

  function checkCelebrationLitState() {
    if (litCandlesCount === config.candlesCount) {
      allCandlesAreLit = true;
      const headerText = document.getElementById('celebration-prompt-text');
      headerText.textContent = "Make a wish ✨";
      headerText.classList.add('make-wish-state');

      // Unlocks global click anywhere to blow candles out
      setTimeout(() => {
        document.addEventListener('click', blowOutCandlesCelebration);
      }, 500);
    }
  }

  function blowOutCandlesCelebration(e) {
    document.removeEventListener('click', blowOutCandlesCelebration);
    
    const headerText = document.getElementById('celebration-prompt-text');
    headerText.textContent = "May all your wishes come true... ♥";
    headerText.classList.remove('make-wish-state');

    // Blow candle wicks out
    const candles = document.querySelectorAll('.cake-candle-item');
    candles.forEach(candle => {
      candle.classList.remove('lit');
      candle.style.pointerEvents = 'none';

      // Emit smoke puffs
      const wick = candle.querySelector('.candle-wick');
      const rect = wick.getBoundingClientRect();
      createSmokePuff(rect.left + rect.width / 2, rect.top);
    });

    // Fire fireworks cascades and celebration sparkles
    setTimeout(() => {
      triggerEndGameCelebration();
    }, 400);
  }

  function createSmokePuff(x, y) {
    const anchor = document.getElementById('interactive-anchor');
    const p = document.createElement('div');
    p.className = 'smoke-particle';
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;

    // Randomize initial puff scale
    const size = Math.random() * 8 + 12;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;

    anchor.appendChild(p);
    setTimeout(() => p.remove(), 1200);
  }

  /**
   * V5 Endgame Celebration Fireworks Engine
   */
  function triggerEndGameCelebration() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Launch multi-burst fires
    launchFirework(width * 0.25, height * 0.35);
    setTimeout(() => launchFirework(width * 0.75, height * 0.3), 300);
    setTimeout(() => launchFirework(width * 0.5, height * 0.25), 600);
    setTimeout(() => launchFirework(width * 0.35, height * 0.45), 1000);
    setTimeout(() => launchFirework(width * 0.65, height * 0.4), 1300);

    // Continuous soft confetti & petals shower loops
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const giftEl = document.getElementById('obj-gift');
        if (giftEl) triggerConfettiBurst(giftEl);
      }, i * 1500);
    }
  }

  function launchFirework(x, y) {
    const container = document.getElementById('interactive-anchor');
    
    // Concentric expanding ring
    const ring = document.createElement('div');
    ring.className = 'firework-ring';
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    container.appendChild(ring);
    setTimeout(() => ring.remove(), 1600);

    // Dynamic projectile sparkle components
    const sparkleCount = 14;
    for (let i = 0; i < sparkleCount; i++) {
      const spark = document.createElement('div');
      spark.className = 'firework-sparkle';
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      
      const size = Math.random() * 4 + 3;
      spark.style.width = `${size}px`;
      spark.style.height = `${size}px`;

      const angle = (i / sparkleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const distance = Math.random() * 90 + 50;
      const destX = Math.cos(angle) * distance;
      const destY = Math.sin(angle) * distance;

      spark.style.setProperty('--dest-x', `${destX}px`);
      spark.style.setProperty('--dest-y', `${destY}px`);
      
      spark.style.animation = 'fireworkSparkleAnim 1.3s cubic-bezier(0.1, 0.8, 0.3, 1) forwards';
      container.appendChild(spark);
      
      setTimeout(() => spark.remove(), 1300);
    }
  }

  /**
   * 15. Parallax Camera Navigation System
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
    initInteractiveObjects();
  }

  initScene();
});
