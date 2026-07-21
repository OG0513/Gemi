/**
 * Interactive Magical Garden Environment
 * Version 4 (Interactive Garden Objects)
 * 
 * Mobile-Proof & Safe-Evaluation Edition
 */

// Global variable for canvas controller
let atmEngineInstance = null; 

/* ==========================================================================
   1. Atmospheric Canvas Simulation Engine (Evaluated first to prevent TDZ)
   ========================================================================== */
class AtmosphereEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.fireflies = [];
        this.petals = [];
        this.sparkles = [];
        this.ripples = [];
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
        this.ripples = [];

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

    triggerSparkleBlast(x, y, customColors = null) {
        const sparkleColors = customColors || ['#f4d1ae', '#ffd29d', '#ffffff', '#f3b0c3'];
        for (let i = 0; i < 35; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 5 + 1.5;
            this.sparkles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - 1.0,
                radius: Math.random() * 2.2 + 0.8,
                alpha: 1,
                decay: Math.random() * 0.025 + 0.012,
                color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)]
            });
        }
    }

    triggerPetalCascade(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            this.petals.push({
                x: x + (Math.random() * 30 - 15),
                y: y + (Math.random() * -10),
                size: Math.random() * 5 + 3,
                speedY: Math.random() * 0.4 + 0.3,
                speedX: Math.random() * 0.6 - 0.3,
                oscillationSpeed: Math.random() * 0.03 + 0.01,
                oscillationAmplitude: Math.random() * 15 + 5,
                angle: Math.random() * 360,
                rotationSpeed: Math.random() * 2 - 1,
                phase: Math.random() * 10,
                color: 'rgba(243, 176, 195, 0.55)'
            });
        }
    }

    triggerMoonlightRipple(x, y) {
        this.ripples.push({
            x: x,
            y: y,
            radius: 10,
            maxRadius: Math.max(this.width, this.height) * 1.2,
            speed: 12,
            alpha: 0.35
        });
    }

    update() {
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

        for (let i = this.sparkles.length - 1; i >= 0; i--) {
            const s = this.sparkles[i];
            s.x += s.vx;
            s.y += s.vy;
            s.vy += 0.04; 
            s.vx *= 0.98; 
            s.alpha -= s.decay;
            if (s.alpha <= 0) this.sparkles.splice(i, 1);
        }

        for (let i = this.ripples.length - 1; i >= 0; i--) {
            const r = this.ripples[i];
            r.radius += r.speed;
            r.alpha = 0.35 * (1 - r.radius / r.maxRadius);
            if (r.radius >= r.maxRadius) this.ripples.splice(i, 1);
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ripples.forEach(r => {
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(253, 246, 226, ${r.alpha})`;
            this.ctx.lineWidth = 3;
            this.ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
            this.ctx.stroke();
        });

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

        this.sparkles.forEach(s => {
            this.ctx.beginPath();
            this.ctx.fillStyle = s.color;
            this.ctx.globalAlpha = s.alpha;
            this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1.0; 

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
   2. Main Safe Sandbox Initializer
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function safeInit(moduleName, initFunc) {
    try {
        initFunc();
    } catch (error) {
        console.warn(`[Safe-Init] Warning inside "${moduleName}":`, error.message);
    }
}

function initApp() {
    const scene = document.getElementById('scene');
    const loader = document.getElementById('loader');

    // Loader scheduled immediately to prevent freeze states
    setTimeout(() => {
        if (loader) loader.classList.add('fade-out');
        if (scene) scene.classList.remove('hidden-scene');
    }, 3500);

    // Stars
    safeInit('Stars Canopy', () => {
        const starsContainer = document.getElementById('stars-container');
        if (starsContainer) generateCelestialSky(starsContainer, 120);
    });

    // Meadow & grass
    safeInit('Meadow Layer', () => {
        const grassCanopy = document.getElementById('grass-canopy');
        if (grassCanopy) generateMeadow(grassCanopy, calculateGrassDensity(), calculateFlowerCount());
    });
    
    // Canvas Engine
    safeInit('Atmospheric Canvas Engine', () => {
        const atmosphereCanvas = document.getElementById('atmosphere-canvas');
        if (atmosphereCanvas) {
            atmEngineInstance = new AtmosphereEngine(atmosphereCanvas);
            atmEngineInstance.start();
        }
    });

    // Parallax
    safeInit('Parallax Scrolling', () => {
        if (window.matchMedia('(hover: hover)').matches) {
            setupParallax();
        }
    });

    // Interaction setups
    safeInit('Envelope Engine', setupEnvelopeEngine);
    safeInit('Interactive Objects Layer', setupInteractiveObjects);

    window.addEventListener('resize', () => {
        if (atmEngineInstance) {
            atmEngineInstance.resize();
        }
    });
}

/* ==========================================================================
   3. Procedural Meadow Engine Helper Calculators
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

function generateCelestialSky(container, count) {
    if (!container) return;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const x = Math.random() * 100;
        const y = Math.random() * 65; 
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

function generateMeadow(container, grassDensity, flowerCount) {
    if (!container) return;
    const fragment = document.createDocumentFragment();

    const grassColors = ['#1e2f1f', '#2d4230', '#3b553f', '#445f48', '#324634'];
    const flowerColors = ['#f3b0c3', '#d6cbd3', '#eae5d9', '#f4d1ae', '#b5c7d3'];
    const flowerTypes = ['bell', 'star', 'bud'];

    for (let i = 0; i < grassDensity; i++) {
        const blade = document.createElement('div');
        blade.className = 'grass-blade';

        const positionX = (i / grassDensity) * 100 + (Math.random() * 2 - 1);
        const height = Math.floor(Math.random() * 70) + 60; 
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

    for (let i = 0; i < flowerCount; i++) {
        const flower = document.createElement('div');
        const type = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
        flower.className = `flower flower-type-${type}`;

        const positionX = (Math.random() * 96) + 2;
        const stemHeight = Math.floor(Math.random() * 60) + 70; 
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
   4. Interaction Engines & Safe Sandbox Guards
   ========================================================================== */
function setupEnvelopeEngine() {
    const envelope = document.getElementById('interactive-envelope');
    const envelopeLayer = document.getElementById('envelope-layer');
    const wrapper = document.getElementById('envelope-wrapper');
    const promptText = document.getElementById('envelope-prompt');
    const modal = document.getElementById('letter-modal');
    const paragraphs = document.querySelectorAll('.letter-para');
    const continueBtn = document.getElementById('continue-btn');
    const objectsLayer = document.getElementById('interactive-objects-layer');
    const scene = document.getElementById('scene');

    if (!envelope || !modal || !continueBtn) return;

    let letterOpened = false;

    const openAction = (e) => {
        if (letterOpened) return;
        letterOpened = true;

        closeSpeechBubble();

        const rect = envelope.getBoundingClientRect();
        const sparkleX = rect.left + rect.width / 2;
        const sparkleY = rect.top + rect.height / 2;

        if (atmEngineInstance) {
            atmEngineInstance.triggerSparkleBlast(sparkleX, sparkleY);
        }

        if (promptText) promptText.style.opacity = '0';
        envelope.classList.add('is-opening');

        setTimeout(() => {
            envelope.classList.add('is-extracting');
        }, 850);

        setTimeout(() => {
            if (wrapper) wrapper.classList.add('envelope-disappearing');
            if (scene) scene.classList.add('dimmed-atmosphere');
            modal.classList.add('is-active');
            
            revealLetterParagraphs(paragraphs, continueBtn);
        }, 1900);
    };

    envelope.addEventListener('click', openAction);
    
    envelope.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openAction(e);
        }
    });

    continueBtn.addEventListener('click', () => {
        modal.classList.remove('is-active');
        
        setTimeout(() => {
            if (envelopeLayer) envelopeLayer.style.display = 'none';
            // Continue stays active in V4 as the end button of the loop
            if (scene) scene.classList.remove('dimmed-atmosphere');
        }, 800);
    });
}

function revealLetterParagraphs(paragraphs, button) {
    let index = 0;
    
    const showNext = () => {
        if (index < paragraphs.length) {
            paragraphs[index].classList.add('visible');
            index++;
            setTimeout(showNext, 1800);
        } else {
            button.removeAttribute('disabled');
            button.classList.add('is-unlocked');
        }
    };

    setTimeout(showNext, 1200);
}

function setupInteractiveObjects() {
    const centralBubble = document.getElementById('central-bubble');
    const bubbleCloseBtn = document.getElementById('bubble-close');

    if (!centralBubble || !bubbleCloseBtn) return;

    bubbleCloseBtn.addEventListener('click', closeSpeechBubble);

    const configs = [
        {
            id: 'obj-lantern',
            msg: "Wishing you a year ahead filled with warm light, happiness, and clear paths.",
            action: (node) => {
                node.classList.add('active-bounce');
                const rect = node.getBoundingClientRect();
                if (atmEngineInstance) {
                    atmEngineInstance.triggerSparkleBlast(rect.left + 14, rect.top + 20, ['#f1c40f', '#f39c12', '#ffffff']);
                }
                setTimeout(() => node.classList.remove('active-bounce'), 1000);
            }
        },
        {
            id: 'obj-cat',
            msg: "You deserve all the sweetest, warmest comforts and cozy moments today.",
            action: (node) => {
                node.classList.add('active-bounce');
                setTimeout(() => node.classList.remove('active-bounce'), 800);
            }
        },
        {
            id: 'obj-teddy',
            msg: "Sending you the absolute warmest and coziest virtual hug on your special day.",
            action: (node) => {
                const arm = document.getElementById('teddy-arm-l');
                if (arm) arm.classList.add('waving');
                setTimeout(() => {
                    if (arm) arm.classList.remove('waving');
                }, 2400);
            }
        },
        {
            id: 'obj-gift',
            msg: "May your upcoming days be wrapped in endless surprises, smiles, and laughter!",
            action: (node) => {
                node.classList.add('active-bounce');
                const rect = node.getBoundingClientRect();
                if (atmEngineInstance) {
                    atmEngineInstance.triggerSparkleBlast(rect.left + 16, rect.top + 16, ['#eb4d4b', '#f0932b', '#6ab04c', '#ffffff']);
                }
                setTimeout(() => node.classList.remove('active-bounce'), 1000);
            }
        },
        {
            id: 'obj-butterfly',
            msg: "You hold a unique magic that makes every single day a little bit brighter.",
            action: (node) => {
                node.classList.add('active-flight');
                setTimeout(() => node.classList.remove('active-flight'), 1600);
            }
        },
        {
            id: 'obj-flower',
            msg: "May your goals, dreams, and happiness bloom beautifully in every season.",
            action: (node) => {
                node.classList.add('active-bounce');
                const rect = node.getBoundingClientRect();
                if (atmEngineInstance) {
                    atmEngineInstance.triggerPetalCascade(rect.left + 9, rect.top + 10, 12);
                }
                setTimeout(() => node.classList.remove('active-bounce'), 1000);
            }
        },
        {
            id: 'interactive-moon',
            msg: "No matter how much distance separates us, we always share the same beautiful sky.",
            action: (node) => {
                node.classList.add('active-bounce');
                const rect = node.getBoundingClientRect();
                if (atmEngineInstance) {
                    atmEngineInstance.triggerMoonlightRipple(rect.left + rect.width / 2, rect.top + rect.height / 2);
                }
                setTimeout(() => node.classList.remove('active-bounce'), 600);
            }
        },
        {
            id: 'interactive-star',
            msg: "Look up at the night sky and make a special wish on this beautiful night.",
            action: (node) => {
                node.classList.add('pulse-active');
                const rect = node.getBoundingClientRect();
                if (atmEngineInstance) {
                    atmEngineInstance.triggerSparkleBlast(rect.left + 8, rect.top + 8, ['#ffffff', '#eccc68', '#f1f2f6']);
                }
                setTimeout(() => node.classList.remove('pulse-active'), 800);
            }
        }
    ];

    configs.forEach(cfg => {
        const node = document.getElementById(cfg.id);
        if (node) {
            const interactHandler = (e) => {
                e.stopPropagation();
                cfg.action(node);
                presentSpeechBubble(cfg.msg);
            };
            node.addEventListener('click', interactHandler);
            node.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    interactHandler(e);
                }
            });
        }
    });

    document.addEventListener('click', (e) => {
        const bubble = document.getElementById('central-bubble');
        if (bubble && bubble.classList.contains('is-active') && !bubble.contains(e.target)) {
            closeSpeechBubble();
        }
    });
}

function presentSpeechBubble(text) {
    const bubble = document.getElementById('central-bubble');
    const textEl = document.getElementById('bubble-text');
    if (!bubble || !textEl) return;
    bubble.classList.remove('is-active');
    setTimeout(() => {
        textEl.textContent = text;
        bubble.classList.add('is-active');
    }, 150);
}

function closeSpeechBubble() {
    const bubble = document.getElementById('central-bubble');
    if (bubble) bubble.classList.remove('is-active');
}

/* ==========================================================================
   5. Dynamic Parallax Scrolling Engine
   ========================================================================== */
function setupParallax() {
    const moon = document.querySelector('.moon-layer');
    const stars = document.querySelector('.stars-layer');
    const clouds = document.querySelector('.clouds-layer');
    const meadow = document.getElementById('meadow-container');
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
            meadow.style.transform = `translate(${mouseX * speed}px, 0)`; 
        }
        if (envelopeWrapper && !envelopeWrapper.classList.contains('envelope-disappearing')) {
            // Updated centering maths to keep the envelope absolutely centered in tablet browsers
            envelopeWrapper.style.transform = `translate(calc(-50% + ${mouseX * 0.006}px), calc(-20% + ${mouseY * 0.006}px))`;
        }
    });
}
