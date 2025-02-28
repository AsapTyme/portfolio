document.addEventListener('DOMContentLoaded', function() {
    // Variables for project filtering
    const projectGrid = document.querySelector('.project-grid');
    let isFiltering = false;
    
    // Interactive cursor follower - fixed version
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    let cursorVisible = false;
    let cursorEnlarged = false;

    // Mouse movement with explicit coordinates
    document.addEventListener('mousemove', e => {
        // Update cursor position with explicit coordinates
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        
        // Make cursor visible on first move
        if (!cursorVisible) {
            cursorVisible = true;
            cursor.style.opacity = '1';
            document.body.classList.add('cursor-active');
        }
    });

    // Make sure cursor disappears when leaving the window
    document.addEventListener('mouseout', () => {
        cursorVisible = false;
        cursor.style.opacity = '0';
        document.body.classList.remove('cursor-active');
    });

    document.addEventListener('mouseenter', () => {
        cursorVisible = true;
        cursor.style.opacity = '1';
        document.body.classList.add('cursor-active');
    });

    // Cursor effects on interactive elements
    const clickables = document.querySelectorAll(
        'a, button, .project-card, .bento-item, input, textarea'
    );

    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-enlarged');
            cursorEnlarged = true;
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-enlarged');
            cursorEnlarged = false;
        });
    });

    // Disable custom cursor on mobile/touch devices
    function isTouchDevice() {
        return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
    }

    if (isTouchDevice()) {
        cursor.style.display = 'none';
        document.body.classList.remove('cursor-active');
    }

    // Initialize skill bars with animation delay
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    skillBars.forEach((bar, index) => {
        // Get the width from the inline style
        const width = bar.style.width;
        // Set the CSS variable for the animation
        bar.style.setProperty('--width', width);
        // Reset width to 0 to prepare for animation
        bar.style.width = '0';
        
        // Delay each bar's animation
        setTimeout(() => {
            bar.style.width = width;
        }, 300 + (index * 200));
    });

    // Interactive word cloud for skills section
    const words = document.querySelectorAll('.word-cloud span');
    words.forEach(word => {
        word.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.2)';
            this.style.color = 'var(--primary-color)';
        });
        
        word.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
            this.style.color = '';
        });
    });

    // Interactive project filter with improved stability
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    // Initialize all projects
    projects.forEach(project => {
        // Add a consistent height to avoid layout shifts
        project.style.height = project.offsetHeight + 'px';
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Prevent interactions during filtering
            if (isFiltering) return;
            isFiltering = true;
            
            // Disable 3D effects during filtering
            projectGrid.classList.add('filtering-active');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Show/hide projects based on filter
            projects.forEach(project => {
                // Get the original height for the project
                const originalHeight = project.getAttribute('data-height') || project.offsetHeight;
                if (!project.getAttribute('data-height')) {
                    project.setAttribute('data-height', originalHeight);
                }
                
                if (filter === 'all' || project.getAttribute('data-category') === filter) {
                    // Show project with a fade
                    project.style.height = originalHeight + 'px';
                    project.style.margin = '';
                    project.style.opacity = '1';
                    project.style.visibility = 'visible';
                    project.style.position = 'relative';
                    project.style.display = 'block';
                    // Reset transform to avoid conflict with tilt
                    project.style.transform = 'perspective(1000px) translateY(-0.3125rem)';
                } else {
                    // Hide project with a fade
                    project.style.opacity = '0';
                    project.style.transform = 'perspective(1000px) scale(0.95)';
                    project.style.visibility = 'hidden';
                    project.style.position = 'absolute';
                    // Don't remove from flow immediately to prevent jarring shifts
                    setTimeout(() => {
                        project.style.height = '0';
                        project.style.margin = '0';
                        project.style.padding = '0';
                        project.style.display = 'none';
                    }, 300);
                }
            });

            // Re-enable interactions after filtering is complete
            setTimeout(() => {
                isFiltering = false;
                projectGrid.classList.remove('filtering-active');
                projectGrid.classList.add('filtering-complete');
                
                // Remove the class after a short delay to ensure smooth transition
                setTimeout(() => {
                    projectGrid.classList.remove('filtering-complete');
                }, 300);
                
                // Handle empty state
                let visibleProjects = Array.from(projects).filter(project => 
                    project.style.visibility !== 'hidden');
                    
                if (visibleProjects.length === 0) {
                    // No projects visible - show a message
                    if (!document.querySelector('.no-projects-message')) {
                        const message = document.createElement('div');
                        message.className = 'no-projects-message';
                        message.textContent = 'No projects in this category yet. Check back soon!';
                        message.style.gridColumn = '1 / -1';
                        message.style.textAlign = 'center';
                        message.style.padding = '2rem';
                        projectGrid.appendChild(message);
                    }
                } else {
                    // Remove message if it exists
                    const message = document.querySelector('.no-projects-message');
                    if (message) {
                        message.remove();
                    }
                }
            }, 600);
        });
    });

    // Typing effect for hero section
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        const phrases = [
            'a Front-end Developer',
            'a UI/UX Enthusiast',
            'a Web Designer',
            'an Apple Certified Swift Developer'
        ];
        
        let currentPhraseIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        
        function typeEffect() {
            const currentPhrase = phrases[currentPhraseIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentPhrase.substring(0, currentCharIndex - 1);
                currentCharIndex--;
                typingSpeed = 50;
            } else {
                typingElement.textContent = currentPhrase.substring(0, currentCharIndex + 1);
                currentCharIndex++;
                typingSpeed = 100;
            }
            
            if (!isDeleting && currentCharIndex === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 1000; // Pause at end
            } else if (isDeleting && currentCharIndex === 0) {
                isDeleting = false;
                currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                typingSpeed = 500; // Pause before new phrase
            }
            
            setTimeout(typeEffect, typingSpeed);
        }
        
        typeEffect();
    }

    // Throttle function to limit how often the mousemove handler fires
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Improved 3D tilt effect for project cards
    const tiltCards = document.querySelectorAll('.project-card');
    
    tiltCards.forEach(card => {
        // Variables to control the effect
        let isHovering = false;
        let lastMouseX = 0;
        let lastMouseY = 0;
        
        // Use requestAnimationFrame for smoother animation
        let tiltAnimationFrame;
        
        const updateTilt = () => {
            if (!isHovering || isFiltering) return;
            
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            
            // Calculate distance from center (normalized from -1 to 1)
            const normalizedX = (lastMouseX - cardCenterX) / (cardRect.width / 2);
            const normalizedY = (lastMouseY - cardCenterY) / (cardRect.height / 2);
            
            // Apply rotation with limits
            // Reduce the max rotation angle and apply easing for smoother effect
            const maxRotation = 5; // Maximum rotation in degrees (reduced from 10)
            const rotateX = Math.max(Math.min(-normalizedY * maxRotation, maxRotation), -maxRotation).toFixed(2);
            const rotateY = Math.max(Math.min(normalizedX * maxRotation, maxRotation), -maxRotation).toFixed(2);
            
            // Apply transform with easing
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            
            // Request next frame
            tiltAnimationFrame = requestAnimationFrame(updateTilt);
        };
        
        // Throttled mousemove handler
        const handleMouseMove = throttle(function(e) {
            if (isFiltering) return;
            
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            
            // If we're not already running the animation loop, start it
            if (!tiltAnimationFrame) {
                tiltAnimationFrame = requestAnimationFrame(updateTilt);
            }
        }, 16); // ~60fps
        
        card.addEventListener('mouseenter', () => {
            if (isFiltering) return;
            
            isHovering = true;
            // Reset any existing transform to ensure clean start
            card.style.transition = 'transform 0.3s ease';
            // Start the animation loop
            tiltAnimationFrame = requestAnimationFrame(updateTilt);
        });
        
        card.addEventListener('mousemove', handleMouseMove);
        
        card.addEventListener('mouseleave', () => {
            isHovering = false;
            // Cancel the animation frame
            if (tiltAnimationFrame) {
                cancelAnimationFrame(tiltAnimationFrame);
                tiltAnimationFrame = null;
            }
            // Smooth transition back to default state
            card.style.transition = 'transform 0.5s ease';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-0.3125rem)';
        });
    });

    // Fun confetti effect on contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            if (!window.confettiTriggered) {
                triggerConfetti();
                window.confettiTriggered = true;
            }
        });
    }

    function triggerConfetti() {
        const colors = ['#0077ff', '#6c63ff', '#00c6ff', '#ffffff'];
        
        for (let i = 0; i < 100; i++) {
            createConfetti(colors[Math.floor(Math.random() * colors.length)]);
        }
    }

    function createConfetti(color) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = color;
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.opacity = Math.random();
        confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
});