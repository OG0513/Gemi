/**
 * A Premium Birthday Journey - Version 1
 * Core Architecture & Scene System Module
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initializing system modules
    SceneManager.init();
    PreloaderModule.init();
    InteractiveCardModule.init();
});

/**
 * SCENE MANAGER MODULE
 * Handles transition state machines, global indicators, and scene limits.
 */
const SceneManager = (() => {
    let currentSceneIndex = 1;
    const totalScenes = 8;
    const transitionDuration = 1000; // Match duration of CSS transitions

    const selectors = {
        scenes: '.scene-section',
        dots: '.indicator-dot',
        triggers: '.next-scene-trigger',
        restartBtn: '#restart-experience-btn'
    };

    /**
     * Updates active class mappings inside indicators
     */
    const updateIndicators = (targetIndex) => {
        const dots = document.querySelectorAll(selectors.dots);
        dots.forEach(dot => {
            const step = parseInt(dot.getAttribute('data-scene-step'), 10);
            if (step === targetIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    /**
     * Coordinates animation states between scene transitions
     * @param {number} nextIndex - The upcoming scene index
     */
    const navigateToScene = (nextIndex) => {
        if (nextIndex < 1 || nextIndex > totalScenes || nextIndex === currentSceneIndex) return;

        const currentScene = document.querySelector(`${selectors.scenes}[data-scene-index="${currentSceneIndex}"]`);
        const nextScene = document.querySelector(`${selectors.scenes}[data-scene-index="${nextIndex}"]`);

        if (!currentScene || !nextScene) return;

        // Transition Step 1: Trigger current scene exit animation
        currentScene.classList.add('fade-out');

        // Transition Step 2: Swap visibility indexes
        setTimeout(() => {
            currentScene.classList.remove('active', 'fade-out');
            nextScene.classList.add('active');
            
            updateIndicators(nextIndex);
            currentSceneIndex = nextIndex;
            
            // Allow post-transition triggers for individual scene logic
            onSceneActive(nextIndex);
        }, transitionDuration);
    };

    /**
     * Hook to process unique animations when a scene opens
     * @param {number} index - The activated scene index
     */
    const onSceneActive = (index) => {
        if (index === 3) {
            // Reset card flips state on re-entry of Scene 3
            const cardAssembly = document.getElementById('card-assembly-element');
            if (cardAssembly) {
                cardAssembly.classList.remove('flipped');
            }
        }
    };

    /**
     * Binds listeners to global UI controls
     */
    const bindEvents = () => {
        // Universal direct navigation hooks
        document.querySelectorAll(selectors.triggers).forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                const target = parseInt(e.currentTarget.getAttribute('data-target'), 10);
                if (target) navigateToScene(target);
            });
        });

        // Navigation Indicators
        document.querySelectorAll(selectors.dots).forEach(dot => {
            dot.addEventListener('click', (e) => {
                const targetStep = parseInt(e.currentTarget.getAttribute('data-scene-step'), 10);
                // Prevent bypass during loading scene
                if (currentSceneIndex > 1 && targetStep > 0) {
                    navigateToScene(targetStep);
                }
            });
        });

        // Reset system hook on final step
        const restartBtn = document.querySelector(selectors.restartBtn);
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                navigateToScene(2);
            });
        }
    };

    return {
        init: () => {
            bindEvents();
        },
        navigateTo: (index) => {
            navigateToScene(index);
        },
        getCurrentIndex: () => currentSceneIndex
    };
})();

/**
 * PRELOADER MODULE
 * Simulates system checks while monitoring user experience deployment.
 */
const PreloaderModule = (() => {
    const selectors = {
        percentText: '#loader-percent',
        progressBar: '#preloader-progress',
        enterBtn: '#enter-journey-btn'
    };

    const simulateResourceLoading = () => {
        const percentText = document.querySelector(selectors.percentText);
        const progressBar = document.querySelector(selectors.progressBar);
        const enterBtn = document.querySelector(selectors.enterBtn);

        let progress = 0;
        const totalLength = 283; // Circumference matching CSS dashoffset limit

        const interval = setInterval(() => {
            // Logarithmic slowing down simulation to feel realistic
            const delta = Math.max(1, Math.floor((100 - progress) * 0.15));
            progress += delta;

            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                onLoadComplete(enterBtn);
            }

            // Visual updates
            if (percentText) percentText.textContent = progress;
            if (progressBar) {
                const offset = totalLength - (progress / 100) * totalLength;
                progressBar.style.strokeDashoffset = offset;
            }
        }, 120);
    };

    const onLoadComplete = (btn) => {
        if (!btn) return;
        btn.classList.remove('hidden');
        btn.addEventListener('click', () => {
            SceneManager.navigateTo(2);
        });
    };

    return {
        init: () => {
            simulateResourceLoading();
        }
    };
})();

/**
 * INTERACTIVE CARD MODULE
 * Controls visual flips, perspectives, and action triggers of Scene 3 Card assembly.
 */
const InteractiveCardModule = (() => {
    const selectors = {
        cardAssembly: '#card-assembly-element',
        envelopeContainer: '.interactive-envelope-container'
    };

    const initCardInteractions = () => {
        const card = document.querySelector(selectors.cardAssembly);
        const container = document.querySelector(selectors.envelopeContainer);

        if (!card || !container) return;

        // Handles standard dimensional rotations when the cursor hovers (Desktop Only)
        container.addEventListener('mousemove', (e) => {
            if (card.classList.contains('flipped')) {
                // Prevent tilt when open
                card.style.transform = `rotateY(180deg)`;
                return;
            }
            
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerPointX = rect.width / 2;
            const centerPointY = rect.height / 2;
            
            // Rotation limits
            const rotateX = ((y - centerPointY) / centerPointY) * -12;
            const rotateY = ((x - centerPointX) / centerPointX) * 12;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        // Reset orientation states on cursor exit
        container.addEventListener('mouseleave', () => {
            if (!card.classList.contains('flipped')) {
                card.style.transform = `rotateX(0deg) rotateY(0deg)`;
            } else {
                card.style.transform = `rotateY(180deg)`;
            }
        });

        // Action Trigger to flip card face open
        card.addEventListener('click', (e) => {
            // Prevent visual resets if button elements within back-face are selected
            if (e.target.closest('.action-btn')) return;
            
            card.classList.toggle('flipped');
            
            if (card.classList.contains('flipped')) {
                card.style.transform = `rotateY(180deg)`;
            } else {
                card.style.transform = `rotateY(0deg)`;
            }
        });
    };

    return {
        init: () => {
            initCardInteractions();
        }
    };
})();
