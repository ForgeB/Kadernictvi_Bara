// Load config from JSON file
async function loadConfig() {
    const response = await fetch('./01_Assets/03_JS/01_config.json');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

// Load component from HTML file
async function loadComponent(name) {
        const response = await fetch(`./02_Components/${name}.html`);
        if (!response.ok) {
            throw new Error(`Failed to load ${name} component: ${response.status}`);
        }
        return response.text();
}
// Load source and href attributes
function setElementSrc(id, src) {
    const element = document.getElementById(id);
    if (element && src) element.src = `./${src}`;
}
function setElementHref(id, href) {
    const element = document.getElementById(id);
    if (element && href) element.href = href;
}

function setupResponsiveNavigation(config) {
    if (!config.navigation) return;
    const mainNav = document.getElementById('mainNav');
    if (mainNav) {
        mainNav.innerHTML = config.navigation.map(item => {
            return `<a href="${item.href}" class="btn btn-outline-primary me-2 mb-1 nav-btn">${item.name}</a>`;
        }).join('');
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load parallel
        const [header, footer] = await Promise.all([
            loadComponent('02_header'),
            loadComponent('03_footer')
        ]);
        
        document.querySelector('header').outerHTML = header;
        document.querySelector('footer').outerHTML = footer;

        // Set current year
        const yearSpan = document.getElementById('year');
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();

        // Load config and page setup
        const config = await loadConfig();

        // Set logos
        setElementSrc('mainLogo', config.logos?.main);
        setElementSrc('facebookLogo', config.logos?.facebook);
        setElementSrc('instagramLogo', config.logos?.instagram);

        // Set social media links
        setElementHref('facebookLink', config.socialMedia?.facebook);
        setElementHref('instagramLink', config.socialMedia?.instagram);
        setElementHref('homeLink', './index.html');

        // Setup navigation
        setupResponsiveNavigation(config);
        
        // Initialize responsive behavior with a small delay to ensure DOM is ready
        setTimeout(() => {
            initializeResponsiveBehavior();
        }, 100);

    } catch (error) {
        console.error('Error initializing page:', error);
        document.body.innerHTML += `<div class="alert alert-danger">Error loading page content: ${error.message}</div>`;
    }
});





