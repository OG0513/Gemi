/**
 * Interactive Magical Garden Environment
 * Version 2 (Envelope & Reading Mechanics)
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

let atmEngineInstance = null; // Reference to trigger canvas effects

function initApp() {
    const starsContainer = document.getElementById('stars-container');
    const grassCanopy = document.getElementById('grass-canopy');
    const atmosphereCanvas = document.getElementById('atmosphere-canvas');
    const scene = document.getElementById('scene');
    const loader = document.getElementById('loader');

    // Configuration Settings
    const CONFIG = {
        starCount: 120,
        grassDensity: calculateGrassDensity(),
        flowerCount: calculateFlowerCount(),
        loadingDuration: 3500
    };

    // Initialize Components
    generateCelestialSky(starsContainer, CONFIG.starCount);
    generateMeadow(grassCanopy, CONFIG.grassDensity, CONFIG.flowerCount);
    
    // Fireflies, Petals and Sparkles Canvas Engine
    atmEngineInstance = new AtmosphereEngine(atmosphereCanvas);
    atmEngineInstance.start();

    // Set up Parallax (Only desktop / mouse hover devices)
    if (window.matchMedia('(hover: hover)').matches) {
        setupParallax();
    }

    // Set up Envelope Interactions
    setupEnvelopeEngine();

    // Handles Loading Completion Screen Transitions
    setTimeout(() => {
        loader.classList.add('fade-out');
        scene.classList.remove('hidden-scene');
    }, CONFIG.loadingDuration);

    window.addEventListener('resize', () => {
        atmEngineInstance.resize();
    });
}

/* ==========================================================================
   1. Helper Layout Calculators
   ========================================================================== */
function calculateGrassDensity() {
    const width = window.innerWidth;
    if (width < 600) return 90;
    if (width < 1200) return 160;
    return 270;
}

function calculateFlowerCount() {
    const width = window.innerWidth;
    if (width < 600) return 12;
    if (width < 1200) return 22;
    return 34;
}

/* ==========================================================================
   2. Celestial & Starfield Generator
   ========================================================================== */
function generateCelestialSky(container, count) {
    if (!container) return;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const x = Math.random() * 100;
        const y = Math.random() * 65; // Stars kept nicely above terrain
        const size = (Math.random() * 1.5 + 0.5).toFixed(1);
        const duration = (Math.random() * 4 + 3).toFixed(1);
        const delay = (Math.random() * 5).toFixed(1);
        const maxOpacity = (Math.random() * 0.6 + 0.3).toFixed(2);

        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty('--twinkle-duration', `${duration}s`);
        star.style.setProperty('--twinkle-delay', `${delay}s`);
        star.style.setProperty('--star-max-opacity', maxOpacity);

        fragment.appendChild(star);
    }
    container.appendChild(fragment);
}

/* ==========================================================================
   3. Procedural Meadow Engine
   ========================================================================== */
function generateMeadow(container, grassDensity, flowerCount) {
    if (!container) return;
    const fragment = document.createDocumentFragment();

    const grassColors = ['#1e2f1f', '#2d4230', '#3b553f', '#445f48', '#324634'];
    const flowerColors = ['#f3b0c3', '#d6cbd3', '#eae5d9', '#f4d1ae', '#b5c7d3'];
    const flowerTypes = ['bell', 'star', 'bud'];

    // 1. Generate Procedural Grass
    for (let i = 0; i < grassDensity; i++) {
        const blade = document.createElement('div');
        blade.className = 'grass-blade';

        const positionX = (i / grassDensity) * 100 + (Math.random() * 2 - 1);
        const height = Math.floor(Math.random() * 70) + 60; // 60px to 130px
        const width = (Math.random() * 2.5 + 2).toFixed(1);
        const swayDuration = (Math.random() * 3 + 3.5).toFixed(1);
        const swayDelay = (Math.random() * -5).toFixed(1);
        const swayAngle = (Math.random() * 4 + 3).toFixed(1);
        const color = grassColors[Math.floor(Math.random() * grassColors.length)];

        blade.style.left = `${positionX}%`;
        blade.style.height = `${height}px`;
        blade.style.width = `${width}px`;
        blade.style.zIndex = Math.floor(height);
        blade.style.setProperty('--blade-color', color);
        blade.style.setProperty('--sway-duration', `${swayDuration}s`);
        blade.style.setProperty('--sway-delay', `${swayDelay}s`);
        blade.style.setProperty('--sway-angle', `${swayAngle}deg`);

        fragment.appendChild(blade);
    }

    // 2. Generate Scenic Wildflowers
    for (let i = 0; i < flowerCount; i++) {
        const flower = document.createElement('div');
        const type = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
        flower.className = `flower flower-type-${type}`;

        const positionX = (Math.random() * 96) + 2;
        const stemHeight = Math.floor(Math.random() * 60) + 70; // 70px to 130px
        const swayDuration = (Math.random() * 2.5 + 4).toFixed(1);
        const swayDelay = (Math.random() * -5).toFixed(1);
        const swayAngle = (Math.random() * 3 + 2).toFixed(1);
        const flowerScale = (Math.random() * 0.4 + 0.8).toFixed(2);
        const color = flowerColors[Math.floor(Math.random() * flowerColors.length)];

        flower.style.left = `${positionX}%`;
        flower.style.zIndex = Math.floor(stemHeight + 10);
        flower.style.setProperty('--stem-height', `${stemHeight}px`);
        flower.style.setProperty('--sway-duration', `${swayDuration}s`);
        flower.style.setProperty('--sway-delay', `${swayDelay}s`);
        flower.style.setProperty('--sway-angle', `${swayAngle}deg`);
        flower.style.setProperty('--flower-color', color);
        flower.style.setProperty('--flower-scale', flowerScale);

        const stem = document.createElement('div');
        stem.className = 'flower-stem';
        
        const head = document.createElement('div');
        head.className = 'flower-head';

        flower.appendChild(stem);
        flower.appendChild(head);
        fragment.appendChild(flower);
    }

    container.appendChild(fragment);
}

/* ==========================================================================
   4. Atmospheric Canvas Simulation (Fireflies, Petals, and Interactive Sparkles)
   ========================================================================== */
class AtmosphereEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.fireflies = [];
        this.petals = [];
        this.sparkles = [];
        this.active = true;
        this.resize();
        
        this.fireflyCount = 18;
        this.petalCount = 12;
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    initElements() {
        this.fireflies = [];
        this.petals = [];
        this.sparkles = [];

        // Create Fireflies
        for (let i = 0; i < this.fireflyCount; i++) {
            this.fireflies.push({
                x: Math.random() * this.width,
                y: Math.random() * (this.height * 0.6) + (this.height * 0.3),
                radius: Math.random() * 2 + 1.2,
                alpha: Math.random() * 0.7 + 0.3,
                fadeSpeed: Math.random() * 0.02 + 0.005,
                direction: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.4 + 0.15,
                pulseDirection: Math.random() > 0.5 ? 1 : -1,
                turnSpeed: (Math.random() * 0.04 - 0.02)
            });
        }

        // Create Petals
        for (let i = 0; i < this.petalCount; i++) {
            this.petals.push({
                x: Math.random() * this.width,
                y: Math.random() * -this.height,
                size: Math.random() * 6 + 4,
                speedY: Math.random() * 0.5 + 0.3,
                speedX: Math.random() * 0.3 - 0.15,
                oscillationSpeed: Math.random() * 0.02 + 0.01,
                oscillationAmplitude: Math.random() * 20 + 10,
                angle: Math.random() * 360,
                rotationSpeed: Math.random() * 1 - 0.5,
                phase: Math.random() * 100,
                color: 'rgba(243, 176, 195, 0.4)'
            });
        }
    }

    // Triggered when clicking envelope to create magical visual reinforcement
    triggerSparkleBlast(x, y) {
        const sparkleColors = ['#f4d1ae', '#ffd29d', '#ffffff', '#f3b0c3'];
        for (let i = 0; i < 40; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 6 + 2;
            this.sparkles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - 1.5, // Bias upward trajectory
                radius: Math.random() * 2.5 + 1,
                alpha: 1,
                decay: Math.random() * 0.02 + 0.01,
                color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)]
            });
        }
    }

    update() {
        // Update Fireflies
        this.fireflies.forEach(f => {
            f.direction += f.turnSpeed;
            f.x += Math.cos(f.direction) * f.speed;
            f.y += Math.sin(f.direction) * f.speed;

            f.alpha += f.fadeSpeed * f.pulseDirection;
            if (f.alpha >= 1) { f.alpha = 1; f.pulseDirection = -1; }
            else if (f.alpha <= 0.1) { f.alpha = 0.1; f.pulseDirection = 1; }

            if (f.x < -20) f.x = this.width + 20;
            if (f.x > this.width + 20) f.x = -20;
            if (f.y < -20) f.y = this.height + 20;
            if (f.y > this.height + 20) f.y = -20;
        });

        // Update Petals
        this.petals.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX + Math.sin(p.phase) * 0.15;
            p.phase += p.oscillationSpeed;
            p.angle += p.rotationSpeed;

            if (p.y > this.height + 20 || p.x < -20 || p.x > this.width + 20) {
                p.y = -20;
                p.x = Math.random() * this.width;
            }
        });

        // Update Interactive Burst Sparkles
        for (let i = this.sparkles.length - 1; i >= 0; i--) {
            const s = this.sparkles[i];
            s.x += s.vx;
            s.y += s.vy;
            s.vy += 0.05; // Gentle gravity effect
            s.vx *= 0.98; // Friction drag
            s.alpha -= s.decay;

            if (s.alpha <= 0) {
                this.sparkles.splice(i, 1);
            }
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 1. Fireflies
        this.fireflies.forEach(f => {
            this.ctx.beginPath();
            const gradient = this.ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius * 6);
            gradient.addColorStop(0, `rgba(244, 209, 174, ${f.alpha})`);
            gradient.addColorStop(0.3, `rgba(244, 209, 174, ${f.alpha * 0.35})`);
            gradient.addColorStop(1, 'rgba(244, 209, 174, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.arc(f.x, f.y, f.radius * 6, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // 2. Sparkles
        this.sparkles.forEach(s => {
            this.ctx.beginPath();
            this.ctx.fillStyle = s.color;
            this.ctx.globalAlpha = s.alpha;
            this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1.0; // Reset canvas context alpha map

        // 3. Petals
        this.petals.forEach(p => {
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.angle * Math.PI) / 180);
            this.ctx.beginPath();
            this.ctx.fillStyle = p.color;
            this.ctx.ellipse(0, 0, p.size, p.size * 0.65, 0, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    loop() {
        if (!this.active) return;
        this.update();
        this.render();
        requestAnimationFrame(() => this.loop());
    }

    start() {
        this.initElements();
        this.loop();
    }
}

/* ==========================================================================
   5. Interactive Envelope & Folding Letter Mechanics
   ========================================================================== */
function setupEnvelopeEngine() {
    const envelope = document.getElementById('interactive-envelope');
    const wrapper = document.getElementById('envelope-wrapper');
    const promptText = document.getElementById('envelope-prompt');
    const modal = document.getElementById('letter-modal');
    const paragraphs = document.querySelectorAll('.letter-para');
    const continueBtn = document.getElementById('continue-btn');
    const scene = document.getElementById('scene');

    let letterOpened = false;

    // Combined click or key press interaction handler
    const openAction = (e) => {
        if (letterOpened) return;
        letterOpened = true;

        // Obtain dynamic viewport positions for sparkle system coordinates
        const rect = envelope.getBoundingClientRect();
        const sparkleX = rect.left + rect.width / 2;
        const sparkleY = rect.top + rect.height / 2;

        // 1. Emit magical interactive visual effects
        if (atmEngineInstance) {
            atmEngineInstance.triggerSparkleBlast(sparkleX, sparkleY);
        }

        // 2. Phase 1: Open Flap 3D structure
        promptText.style.opacity = '0';
        envelope.classList.add('is-opening');

        // 3. Phase 2: Slide letter preview smoothly out of back envelope pocket
        setTimeout(() => {
            envelope.classList.add('is-extracting');
        }, 850);

        // 4. Phase 3: Transition view context beautifully into writing-desk mode
        setTimeout(() => {
            wrapper.classList.add('envelope-disappearing');
            scene.classList.add('dimmed-atmosphere');
            modal.classList.add('is-active');
            
            // Execute comfortable chronological paragraph reveals
            revealLetterParagraphs(paragraphs, continueBtn);
        }, 1900);
    };

    envelope.addEventListener('click', openAction);
    
    // Keyboard accessibility fallback triggers
    envelope.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openAction(e);
        }
    });

    // Premium interactive click response for disabled continue button
    continueBtn.addEventListener('click', () => {
        // Non-navigating reactive state loop (Micro-interactions ready for next version phase)
        continueBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            continueBtn.style.transform = 'scale(1)';
        }, 150);
    });
}

function revealLetterParagraphs(paragraphs, button) {
    let index = 0;
    
    const showNext = () => {
        if (index < paragraphs.length) {
            paragraphs[index].classList.add('visible');
            index++;
            // Soft pacing delays
            setTimeout(showNext, 1800);
        } else {
            // Unlock and reveal continue actions smoothly on completion of message narrative
            button.removeAttribute('disabled');
            button.classList.add('is-unlocked');
        }
    };

    // Stagger slightly before releasing first sentence block
    setTimeout(showNext, 1200);
}

/* ==========================================================================
   6. Dynamic Parallax Layer Scrolling Effects
   ========================================================================== */
function setupParallax() {
    const moon = document.querySelector('.moon-layer');
    const stars = document.querySelector('.stars-layer');
    const clouds = document.querySelector('.clouds-layer');
    const meadow = document.querySelector('.meadow-container');
    const envelopeWrapper = document.getElementById('envelope-wrapper');

    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX - window.innerWidth / 2;
        const mouseY = e.clientY - window.innerHeight / 2;

        if (stars) {
            const speed = stars.getAttribute('data-speed');
            stars.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
        }
        if (moon) {
            const speed = moon.getAttribute('data-speed');
            moon.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
        }
        if (clouds) {
            const speed = clouds.getAttribute('data-speed');
            clouds.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
        }
        if (meadow) {
            const speed = meadow.getAttribute('data-speed');
            meadow.style.transform = `translate(${mouseX * speed}px, 0)`; // Vertical alignment locked on floor bounds
        }
        if (envelopeWrapper && !envelopeWrapper.classList.contains('envelope-disappearing')) {
            // Delicate, heavy responsive translation shift for visual tracking
            envelopeWrapper.style.transform = `translate(calc(-50% + ${mouseX * 0.006}px), calc(15vh + ${mouseY * 0.006}px))`;
        }
    });
            }
