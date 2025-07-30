// Main or follow page main page './'; followup page '../';
basePath = './';

// Load config from JSON file
async function loadConfig() {
    const response = await fetch(`${basePath}01_Assets/03_JS/01_config.json`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

// Load contact information from JSON file
async function loadContactInfo() {
    const response = await fetch(`${basePath}04_Content/Contact.json`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

// Load component from HTML file
async function loadComponent(name) {
        const response = await fetch(`${basePath}02_Components/${name}.html`);
        if (!response.ok) {
            throw new Error(`Failed to load ${name} component: ${response.status}`);
        }
        return response.text();
}

// Set source safely
function setElementSrc(id, src) {
    const element = document.getElementById(id);
    if (element && src) element.src = `${basePath}${src}`;
}
// Set links safely
function setElementHref(id, href) {
    const element = document.getElementById(id);
    if (element && href) element.href = href;
}
// Set strings safely
function setElementText(id, text) {
    const element = document.getElementById(id);
    if (element && text) element.textContent = text;
}

// Load footer contact information
function populateFooter(contactData) {
    // Set email
    const emailLink = document.getElementById('emailLink');
    if (emailLink && contactData.contactInfo?.email) {
        emailLink.href = `mailto:${contactData.contactInfo.email}`;
        emailLink.textContent = contactData.contactInfo.email;
    }
    
    // Set phone
    setElementText('phoneNumber', contactData.contactInfo?.phone);
    
    // Set address
    const address = contactData.physicalAddress;
    if (address) {
        const addressText = `${address.street}, ${address.city}${address.postalCode ? ', ' + address.postalCode : ''}, ${address.country}`;
        setElementText('address', addressText);
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

        // Load config and contact data in parallel
        const [config, contactData] = await Promise.all([
            loadConfig(),
            loadContactInfo()
        ]);

        // Populate footer with contact information
        populateFooter(contactData);

        // Set logos
        setElementSrc('mainLogo', config.logos?.main);
        setElementSrc('facebookLogo', config.logos?.facebook);
        setElementSrc('instagramLogo', config.logos?.instagram);

        // Set social media links
        setElementHref('facebookLink', config.socialMedia?.facebook);
        setElementHref('instagramLink', config.socialMedia?.instagram);
        setElementHref('homeLink', basePath + 'index.html');

        // Setup navigation
        const mainNav = document.getElementById('mainNav');
        if (mainNav && config.navigation) {
            const isInPages = location.pathname.includes('/03_Pages/');
            mainNav.innerHTML = config.navigation.map(item => {
                const href = isInPages ? `../${item.href}` : item.href;
                return `<a href="${href}" class="btn btn-outline-primary custom-nav-btn">${item.name}<span class="sr-only">&lt;</span></a>`;
            }).join('');
        }

    } catch (error) {
        console.error('Error initializing page:', error);
        document.body.innerHTML += `<div class="alert alert-danger">Error loading page content: ${error.message}</div>`;
    }
});
