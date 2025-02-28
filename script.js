document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const modeSwitch = document.getElementById('mode-switch');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
    const contactForm = document.getElementById('contactForm');
    
    // Function to set theme based on preference
    function setTheme(isDark) {
        if (isDark) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', null);
        }
    }
    
    // Check for saved user preference, if none, check system preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        setTheme(true);
    } else if (localStorage.getItem('darkMode') === null) {
        // Check system preference
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDarkMode);
        
        // Listen for changes in system preference
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (localStorage.getItem('darkMode') === null) { // Only auto-switch if user hasn't manually set preference
                setTheme(e.matches);
            }
        });
    }
    
    // Dark Mode Toggle
    modeSwitch.addEventListener('click', () => {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        setTheme(isDarkMode);
    });
    
    // Mobile Menu Toggle - fixed version
    if (mobileMenuBtn && mobileMenu) {
        // Initial state
        mobileMenu.style.display = 'flex';
        
        mobileMenuBtn.addEventListener('click', () => {
            // Toggle the active class for the mobile menu
            mobileMenu.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = mobileMenuBtn.querySelectorAll('span');
            if (mobileMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(0.3125rem, 0.375rem)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(0.3125rem, -0.375rem)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    
                    // Reset hamburger icon
                    const spans = mobileMenuBtn.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });
        });
    }
    
    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-0.625rem)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(-0.3125rem)';
        });
    });
    
    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('section, .bento-item, .project-card');
    
    function checkReveal() {
        const windowHeight = window.innerHeight;
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - 6.25) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Initialize element styles
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(1.25rem)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Add scroll event listener
    window.addEventListener('scroll', checkReveal);
    
    // Check on initial load
    checkReveal();
    
    // Contact Form Submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Simulating form submission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // Simulate API call for form submission
            setTimeout(() => {
                // Show success message
                const formGroups = document.querySelectorAll('.form-group');
                formGroups.forEach(group => group.style.display = 'none');
                
                submitButton.style.display = 'none';
                
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <h3>Message Sent!</h3>
                    <p>Thanks for reaching out, ${name}. I'll get back to you as soon as possible.</p>
                    <button class="secondary-btn">Send Another Message</button>
                `;
                
                contactForm.appendChild(successMessage);
                
                // Reset form on "Send Another Message" click
                const resetButton = successMessage.querySelector('button');
                resetButton.addEventListener('click', () => {
                    formGroups.forEach(group => group.style.display = 'block');
                    submitButton.style.display = 'inline-block';
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                    contactForm.reset();
                    successMessage.remove();
                });
            }, 1500);
        });
    }
    
    // Dynamic project card generation (example for future use)
    function generateProjectCards(projects) {
        const projectGrid = document.querySelector('.project-grid');
        
        // Clear existing cards
        projectGrid.innerHTML = '';
        
        // Create cards from data
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            
            card.innerHTML = `
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}">
                </div>
                <div class="project-details">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-techs">
                        ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        <a href="${project.codeLink}" class="project-link"><i class="fab fa-github"></i> Code</a>
                        <a href="${project.demoLink}" class="project-link"><i class="fas fa-external-link-alt"></i> Demo</a>
                    </div>
                </div>
            `;
            
            projectGrid.appendChild(card);
        });
    }
    
    // Example project data structure for future use
    const sampleProjects = [
        {
            title: "Project Name 1",
            description: "Short description of the project showcasing your skills and the problem it solves.",
            image: "/api/placeholder/600/400",
            technologies: ["React", "Tailwind", "JavaScript"],
            codeLink: "#",
            demoLink: "#"
        },
        // Add more projects as needed
    ];
    
    // Call functions if needed in the future
    // generateProjectCards(sampleProjects);
});