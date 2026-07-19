/**
 * Interactive Magical Garden Environment
 * Version 1 (Foundation)
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

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
        loadingDuration: 3500, // 3.5 seconds
        parallaxFactor: 0.05
    };

    // Initialize Components
    generateCelestialSky(starsContainer, CONFIG.starCount);
    generateMeadow(grassCanopy, CONFIG.grassDensity, CONFIG.flowerCount);
    
    // Fireflies and Petals Engine
    const atmEngine = new AtmosphereEngine(atmosphereCanvas);
    atmEngine.start();

    // Set up Parallax (Only desktop / mouse devices)
    if (window.matchMedia('(hover: hover)').matches) {
        setupParallax(CONFIG.parallaxFactor);
    }

    // Handles Loading Completion Screen Transitions
    setTimeout(() => {
        loader.classList.add('fade-out');
        scene.classList.remove('hidden-scene');
    }, CONFIG.loadingDuration);

    // Watch for window resize events
    window.addEventListener('resize', () => {
        atmEngine.resize();
    });
}

/* ==========================================================================
   1. Helper Density Calculators
   ========================================================================== */
function calculateGrassDensity() {
    const width = window.innerWidth;
    if (width < 600) return 90;   // Mobile
    if (width < 1200) return 160; // Tablet
    return 280;                   // Desktop/Retina
}

function calculateFlowerCount() {
    const width = window.innerWidth;
    if (width < 600) return 12;
    if (width < 1200) return 22;
    return 35;
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
        
        // Random placement parameters
        const x = Math.random() * 100;
        const y = Math.random() * 70; // Keep stars in top 70% of sky viewport
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

    // Natural hues variations
    const grassColors = [
        '#223725', // Sage dark
        '#2d4230', // Sage medium
        '#3a553f', // Sage lighter
        '#4a674f', // Soft forest
        '#354a37'  // Olive tone
    ];

    const flowerColors = [
        '#f3b0c3', // Blush pink
        '#d6cbd3', // Lavender
        '#eae5d9', // Soft cream
        '#f4d1ae', // Soft pale gold
        '#b5c7d3'  // Baby blue
    ];

    const flowerTypes = ['bell', 'star', 'bud'];

    // 1. Generate Procedural Grass Blades
    for (let i = 0; i < grassDensity; i++) {
        const blade = document.createElement('div');
        blade.className = 'grass-blade';

        const positionX = (i / grassDensity) * 100 + (Math.random() * 2 - 1);
        const height = Math.floor(Math.random() * 80) + 60; // 60px to 140px
        const width = (Math.random() * 2.5 + 2).toFixed(1);
        const swayDuration = (Math.random() * 3 + 3.5).toFixed(1); // Unsynchronized sway
        const swayDelay = (Math.random() * -5).toFixed(1); // Negative delay prevents initial snap
        const swayAngle = (Math.random() * 4 + 3).toFixed(1);
        const color = grassColors[Math.floor(Math.random() * grassColors.length)];

        blade.style.left = `${positionX}%`;
        blade.style.height = `${height}px`;
        blade.style.width = `${width}px`;
        blade.style.zIndex = Math.floor(height); // Natural layering depth sort
        blade.style.setProperty('--blade-color', color);
        blade.style.setProperty('--sway-duration', `${swayDuration}s`);
        blade.style.setProperty('--sway-delay', `${swayDelay}s`);
        blade.style.setProperty('--sway-angle', `${swayAngle}deg`);

        fragment.appendChild(blade);
    }

    // 2. Generate Random Scenic Wildflowers
    for (let i = 0; i < flowerCount; i++) {
        const flower = document.createElement('div');
        const type = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
        flower.className = `flower flower-type-${type}`;

        const positionX = (Math.random() * 96) + 2; // Keep in scenic layout bounding box
        const stemHeight = Math.floor(Math.random() * 70) + 70; // 70px to 140px
        const swayDuration = (Math.random() * 2.5 + 4).toFixed(1);
        const swayDelay = (Math.random() * -5).toFixed(1);
        const swayAngle = (Math.random() * 3 + 2).toFixed(1);
        const flowerScale = (Math.random() * 0.4 + 0.8).toFixed(2);
        const color = flowerColors[Math.floor(Math.random() * flowerColors.length)];

        flower.style.left = `${positionX}%`;
        flower.style.zIndex = Math.floor(stemHeight + 10); // Placed relative to grass depth
        flower.style.setProperty('--stem-height', `${stemHeight}px`);
        flower.style.setProperty('--sway-duration', `${swayDuration}s`);
        flower.style.setProperty('--sway-delay', `${swayDelay}s`);
        flower.style.setProperty('--sway-angle', `${swayAngle}deg`);
        flower.style.setProperty('--flower-color', color);
        flower.style.setProperty('--flower-scale', flowerScale);

        // Substructure Elements
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
   4. Atmospheric Canvas Simulation (Fireflies & Floating Petals)
   ========================================================================== */
class AtmosphereEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.fireflies = [];
        this.petals = [];
        this.active = true;
        this.resize();
        
        // Settings constants
        this.fireflyCount = 20;
        this.petalCount = 15;
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

        // Create Fireflies
        for (let i = 0; i < this.fireflyCount; i++) {
            this.fireflies.push({
                x: Math.random() * this.width,
                y: Math.random() * (this.height * 0.6) + (this.height * 0.3), // Mid-lower region focus
                radius: Math.random() * 2 + 1.2,
                alpha: Math.random() * 0.7 + 0.3,
                fadeSpeed: Math.random() * 0.02 + 0.005,
                direction: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.4 + 0.15,
                pulseDirection: Math.random() > 0.5 ? 1 : -1,
                turnSpeed: (Math.random() * 0.04 - 0.02)
            });
        }

        // Create Drifting Blossom Petals
        for (let i = 0; i < this.petalCount; i++) {
            this.petals.push({
                x: Math.random() * this.width,
                y: Math.random() * -this.height, // Spawn above screen
                size: Math.random() * 6 + 4,
                speedY: Math.random() * 0.6 + 0.4,
                speedX: Math.random() * 0.3 - 0.15,
                oscillationSpeed: Math.random() * 0.02 + 0.01,
                oscillationAmplitude: Math.random() * 20 + 10,
                angle: Math.random() * 360,
                rotationSpeed: Math.random() * 1 - 0.5,
                phase: Math.random() * 100,
                color: 'rgba(243, 176, 195, 0.45)' // Beautiful semi-translucent blush pink
            });
        }
    }

    update() {
        // Update Fireflies
        this.fireflies.forEach(f => {
            f.direction += f.turnSpeed;
            f.x += Math.cos(f.direction) * f.speed;
            f.y += Math.sin(f.direction) * f.speed;

            // Fade intensity pulsing
            f.alpha += f.fadeSpeed * f.pulseDirection;
            if (f.alpha >= 1) {
                f.alpha = 1;
                f.pulseDirection = -1;
            } else if (f.alpha <= 0.1) {
                f.alpha = 0.1;
                f.pulseDirection = 1;
                f.fadeSpeed = Math.random() * 0.02 + 0.005; // Vary future pulse speeds
            }

            // Canvas wrapping bounds check
            if (f.x < -20) f.x = this.width + 20;
            if (f.x > this.width + 20) f.x = -20;
            if (f.y < -20) f.y = this.height + 20;
            if (f.y > this.height + 20) f.y = -20;
        });

        // Update Drifting Petals
        this.petals.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX + Math.sin(p.phase) * 0.15;
            p.phase += p.oscillationSpeed;
            p.angle += p.rotationSpeed;

            // If petal drifts past landscape boundaries, reset on top
            if (p.y > this.height + 20 || p.x < -20 || p.x > this.width + 20) {
                p.y = -20;
                p.x = Math.random() * this.width;
                p.speedY = Math.random() * 0.6 + 0.4;
                p.speedX = Math.random() * 0.3 - 0.15;
            }
        });
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 1. Draw Magical Glowing Fireflies
        this.fireflies.forEach(f => {
            this.ctx.beginPath();
            const gradient = this.ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius * 6);
            gradient.addColorStop(0, `rgba(244, 209, 174, ${f.alpha})`);
            gradient.addColorStop(0.3, `rgba(244, 209, 174, ${f.alpha * 0.4})`);
            gradient.addColorStop(1, 'rgba(244, 209, 174, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.arc(f.x, f.y, f.radius * 6, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // 2. Draw Gentle Floating Blossom Petals
        this.petals.forEach(p => {
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.angle * Math.PI) / 180);
            
            this.ctx.beginPath();
            this.ctx.fillStyle = p.color;
            // Draw custom organic curved leaf/petal shape
            this.ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, 2 * Math.PI);
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
   5. Dynamic Parallax Scrolling Effect
   ========================================================================== */
function setupParallax(factor) {
    const moon = document.querySelector('.moon-layer');
    const stars = document.querySelector('.stars-layer');
    const clouds = document.querySelector('.clouds-layer');
    const meadow = document.querySelector('.meadow-container');

    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX - window.innerWidth / 2;
        const mouseY = e.clientY - window.innerHeight / 2;

        // Apply smooth dynamic transforms relative to mouse origin
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
            meadow.style.transform = `translate(${mouseX * speed}px, 0)`; // Keep vertical locked on ground
        }
    });
}
