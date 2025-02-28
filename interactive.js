document.addEventListener('DOMContentLoaded', function() {
    // Interactive cursor follower
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    let cursorVisible = false;
    let cursorEnlarged = false;

    // Mouse movement
    document.addEventListener('mousemove', e => {
        if (cursorVisible) {
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        }
    });

    // Show/hide cursor
    document.addEventListener('mouseenter', () => {
        cursorVisible = true;
        cursor.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursorVisible = false;
        cursor.style.opacity = '0';
    });

    // Cursor effects on interactive elements
    const clickables = document.querySelectorAll(
        'a, button, .project-card, .bento-item, input, textarea'
    );
    
    clickables.forEach(el => {
        el.addEventListener('mouseover', () => {
            cursor.classList.add('cursor-enlarged');
            cursorEnlarged = true;
        });
        
        el.addEventListener('mouseout', () => {
            cursor.classList.remove('cursor-enlarged');
            cursorEnlarged = false;
        });
    });

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

    // Interactive project filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Show/hide projects based on filter
            projects.forEach(project => {
                if (filter === 'all') {
                    project.style.display = 'block';
                    setTimeout(() => {
                        project.style.opacity = '1';
                        project.style.transform = 'translateY(0)';
                    }, 100);
                } else if (project.getAttribute('data-category') === filter) {
                    project.style.display = 'block';
                    setTimeout(() => {
                        project.style.opacity = '1';
                        project.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    project.style.opacity = '0';
                    project.style.transform = 'translateY(1.25rem)';
                    setTimeout(() => {
                        project.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Typing effect for hero section
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        const phrases = [
            'Front-End Developer',
            'UI/UX Enthusiast',
            'Web Designer',
            'Problem Solver'
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

    // Interactive 3D tilt effect for project cards
    const tiltCards = document.querySelectorAll('.project-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;
            
            // Calculate rotation based on mouse position
            const rotateX = (-mouseY / 10).toFixed(2);
            const rotateY = (mouseX / 10).toFixed(2);
            
            // Apply the transform
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
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