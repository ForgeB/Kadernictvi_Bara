async function loadConfig() {
    // Change from relative to absolute path
    const response = await fetch('/Kadernictvi_Bara/01_Assets/03_JS/01_config.json');
    return response.json();
}

async function loadComponent(name) {
    // Change from relative to absolute path
    const response = await fetch(`/Kadernictvi_Bara/01_Assets/03_JS/02_Components/${name}.html`);
    return response.text();
}

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const config = await loadConfig();
        console.log('Config loaded:', config); // Debug log

        // Load components with error checking
        const header = await loadComponent('header');
        if (!header) throw new Error('Header component not loaded');
        document.querySelector('header').outerHTML = header;

        const footer = await loadComponent('footer');
        if (!footer) throw new Error('Footer component not loaded');
        document.querySelector('footer').outerHTML = footer;

        // Check if elements exist before updating
        const mainNav = document.getElementById('mainNav');
        if (!mainNav) throw new Error('Navigation element not found');
        
        const navHtml = config.navigation.map(item => 
            `<a href="${item.href}" class="btn btn-outline-primary custom-nav-btn">${item.name}</a>`
        ).join('');
        mainNav.innerHTML = navHtml;

        const mainLogo = document.getElementById('mainLogo');
        if (!mainLogo) throw new Error('Logo element not found');
        mainLogo.src = config.logos.main;

    } catch (error) {
        console.error('Error initializing page:', error);
        // Display error to user
        document.body.innerHTML += `<div class="alert alert-danger">Error loading page content: ${error.message}</div>`;
    }
});