async function loadConfig() {
    try {
        const response = await fetch('./01_Assets/03_JS/01_config.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Config loaded successfully:', data);
        return data;
    } catch (error) {
        console.error('Failed to load config:', error);
        throw error;
    }
}

async function loadComponent(name) {
    try {
        const response = await fetch(`./01_Assets/03_JS/02_Components/${name}.html`);
        if (!response.ok) {
            throw new Error(`Failed to load ${name} component: ${response.status}`);
        }
        return response.text();
    } catch (error) {
        console.error(`Error loading ${name} component:`, error);
        throw error;
    }
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