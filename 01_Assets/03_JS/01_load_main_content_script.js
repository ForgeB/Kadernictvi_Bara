/**
 * Kadeřnictví Bára - Main JavaScript File
 * Modern Ladies Barbershop Website
 * Handles navigation, animations, and user interactions
 */

// =================================
// CONFIGURATION MANAGEMENT
// =================================

let siteConfig = null;

/**
 * Load configuration from JSON file
 */
async function loadConfig() {
    try {
        const response = await fetch('01_Assets/03_JS/01_config.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        siteConfig = await response.json();
        console.log('✅ Configuration loaded successfully:', siteConfig);
        return siteConfig;
    } catch (error) {
        console.error('❌ Error loading configuration:', error);
        // Fallback configuration
        siteConfig = {
            siteName: "Kadeřnictví Bára",
            navigation: [
                {"name": "Služby", "href": "#services"},
                {"name": "Galerie", "href": "#gallery"},
                {"name": "O nás", "href": "#about"},
                {"name": "Kontakt", "href": "#contact"},
                {"name": "Rezervace", "href": "#booking"}
            ],
            logos: {
                main: "01_Assets/01_IMG/01_Main_Logo.png",
                facebook: "01_Assets/01_IMG/02_FB_Logo.png",
                instagram: "01_Assets/01_IMG/03_INS_Logo.png"
            },
            socialMedia: {
                facebook: "https://www.facebook.com/baja.baruska",
                instagram: "https://www.instagram.com/"
            }
        };
        return siteConfig;
    }
}

/**
 * Build navigation menu from configuration
 */
function buildNavigation(config) {
    const navMenu = document.getElementById('nav-menu');
    if (!navMenu || !config) return;

    // Clear existing navigation (except home link)
    navMenu.innerHTML = `
        <li class="nav-item">
            <a href="#home" class="nav-link active">
                <i class="fas fa-home"></i> Domů
            </a>
        </li>
    `;

    // Get navigation icon mapping
    const iconMapping = {
        'Služby': 'fas fa-cut',
        'Galerie': 'fas fa-images',
        'O nás': 'fas fa-user',
        'Kontakt': 'fas fa-envelope',
        'Rezervace': 'fas fa-calendar-alt'
    };

    // Add navigation items from config
    config.navigation.forEach(item => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        
        const href = item.href || `#${item.name.toLowerCase().replace(/\s+/g, '')}`;
        const icon = iconMapping[item.name] || 'fas fa-circle';
        const isBooking = item.name === 'Rezervace';
        
        li.innerHTML = `
            <a href="${href}" class="${isBooking ? 'cta-button' : 'nav-link'}">
                <i class="${icon}"></i> ${item.name}
            </a>
        `;
        
        navMenu.appendChild(li);
    });

    console.log('🔗 Navigation built from configuration');
}

/**
 * Update logo and branding from configuration
 */
function updateLogo(config) {
    if (!config) return;

    // Update main logo
    const logoImg = document.querySelector('.logo img');
    const logoText = document.querySelector('.logo-text');
    
    if (logoImg && config.logos?.main) {
        logoImg.src = config.logos.main;
        logoImg.alt = `${config.siteName} Logo`;
    }
    
    if (logoText) {
        logoText.textContent = config.siteName.split(' ').pop(); // Use last word of site name
    }

    // Update page title and meta tags
    document.title = `${config.siteName} - Moderní salon pro dámy`;
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
        ogTitle.content = `${config.siteName} - Moderní salon pro dámy`;
    }

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && config.logos?.main) {
        ogImage.content = config.logos.main;
    }

    console.log('🎨 Logo and branding updated from configuration');
}

/**
 * Add social media links if they exist in config
 */
function addSocialMediaLinks(config) {
    if (!config?.socialMedia) return;

    // Create social media container if it doesn't exist
    let socialContainer = document.querySelector('.social-media-links');
    if (!socialContainer) {
        socialContainer = document.createElement('div');
        socialContainer.className = 'social-media-links';
        
        // Add to footer or create a floating social bar
        const footer = document.querySelector('footer');
        if (footer) {
            footer.appendChild(socialContainer);
        } else {
            // Create floating social media bar
            socialContainer.classList.add('floating-social');
            document.body.appendChild(socialContainer);
        }
    }

    // Build social media links
    let socialLinksHTML = '';
    
    if (config.socialMedia.facebook) {
        socialLinksHTML += `
            <a href="${config.socialMedia.facebook}" target="_blank" rel="noopener noreferrer" 
               class="social-link facebook" aria-label="Facebook">
                <i class="fab fa-facebook-f"></i>
            </a>
        `;
    }
    
    if (config.socialMedia.instagram) {
        socialLinksHTML += `
            <a href="${config.socialMedia.instagram}" target="_blank" rel="noopener noreferrer" 
               class="social-link instagram" aria-label="Instagram">
                <i class="fab fa-instagram"></i>
            </a>
        `;
    }

    socialContainer.innerHTML = socialLinksHTML;
    console.log('📱 Social media links added from configuration');
}

// =================================
// HEADER FUNCTIONALITY
// =================================

/**
 * Header scroll effect - adds/removes scrolled class based on scroll position
 */
function initHeaderScrollEffect() {
    window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Mobile menu toggle functionality
 */
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        const icon = this.querySelector('i');
        
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

/**
 * Smooth scrolling for navigation links
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Only prevent default for internal links (starting with #)
            if (targetId.startsWith('#') && targetId !== '#booking') {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = 80;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
            
            // Update active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/**
 * Update active navigation link based on scroll position
 */
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY + 100; // Offset for header
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // Update active class
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        // Default to home if no section is active
        if (!current) {
            const homeLink = document.querySelector('.nav-link[href="#home"]');
            if (homeLink) {
                homeLink.classList.add('active');
            }
        }
    });
}

// =================================
// ANIMATIONS & EFFECTS
// =================================

/**
 * Initialize fade-in animations on page load
 */
function initPageAnimations() {
    const header = document.querySelector('.header');
    if (header) {
        header.classList.add('fade-in-up');
    }
    
    // Animate other elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Add parallax effect to background elements
 */
function initParallaxEffect() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// =================================
// UTILITY FUNCTIONS
// =================================

/**
 * Debounce function to limit function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if element is in viewport
 */
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Smooth scroll to top function
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// =================================
// FORM HANDLING
// =================================

/**
 * Initialize contact form handling
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateContactForm(data)) {
                // Show loading state
                showFormLoading(this);
                
                // Simulate form submission (replace with actual submission logic)
                setTimeout(() => {
                    showFormSuccess(this);
                    this.reset();
                }, 2000);
            }
        });
    }
}

/**
 * Validate contact form data
 */
function validateContactForm(data) {
    const { name, email, phone, message } = data;
    
    if (!name || name.trim().length < 2) {
        showFormError('Prosím zadejte platné jméno');
        return false;
    }
    
    if (!email || !isValidEmail(email)) {
        showFormError('Prosím zadejte platný email');
        return false;
    }
    
    if (!message || message.trim().length < 10) {
        showFormError('Prosím zadejte zprávu (minimálně 10 znaků)');
        return false;
    }
    
    return true;
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show form error message
 */
function showFormError(message) {
    // Implementation for showing error messages
    console.error('Form Error:', message);
}

/**
 * Show form loading state
 */
function showFormLoading(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Odesílám...';
    }
}

/**
 * Show form success state
 */
function showFormSuccess(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-check"></i> Odesláno!';
        
        setTimeout(() => {
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Odeslat zprávu';
        }, 3000);
    }
}

// =================================
// PERFORMANCE OPTIMIZATIONS
// =================================

/**
 * Lazy load images
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * Preload critical resources
 */
function preloadResources() {
    // Preload important images
    const criticalImages = [
        '01_Assets/01_IMG/01_Main_Logo.png'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// =================================
// INITIALIZATION
// =================================

/**
 * Initialize all functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load configuration first
        console.log('🔄 Loading site configuration...');
        const config = await loadConfig();
        
        // Build dynamic content from configuration
        buildNavigation(config);
        updateLogo(config);
        addSocialMediaLinks(config);
        
        // Initialize core functionality after navigation is built
        initHeaderScrollEffect();
        initMobileMenu();
        initSmoothScrolling();
        initActiveNavigation();
        
        // Animations and effects
        initPageAnimations();
        initParallaxEffect();
        
        // Forms
        initContactForm();
        
        // Performance
        initLazyLoading();
        preloadResources();
        
        console.log('🎉 Kadeřnictví Bára website initialized successfully!');
    } catch (error) {
        console.error('❌ Error during initialization:', error);
        
        // Initialize with default functionality even if config fails
        initHeaderScrollEffect();
        initMobileMenu();
        initSmoothScrolling();
        initActiveNavigation();
        initPageAnimations();
        initParallaxEffect();
        initContactForm();
        initLazyLoading();
        preloadResources();
        
        console.log('⚠️ Website initialized with fallback configuration');
    }
});

/**
 * Handle window resize events
 */
window.addEventListener('resize', debounce(function() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        const navMenu = document.getElementById('nav-menu');
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
}, 250));

/**
 * Export functions for external use if needed
 */
window.BaraSalon = {
    scrollToTop,
    isElementInViewport,
    debounce,
    getConfig: () => siteConfig,
    reloadConfig: async () => {
        const config = await loadConfig();
        buildNavigation(config);
        updateLogo(config);
        addSocialMediaLinks(config);
        return config;
    }
};