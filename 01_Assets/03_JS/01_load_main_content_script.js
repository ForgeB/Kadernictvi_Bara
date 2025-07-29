// dynamic location handling
basePath = location.pathname.includes('/03_Pages/') ? '../' : './';

async function loadConfig() {
    try {
        
        const response = await fetch(`${basePath}01_Assets/03_JS/01_config.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

    } catch (error) {
        console.error('Failed to load config:', error);
        throw error;
    }
}



async function loadComponent(name) {
    try {
        const response = await fetch(`${basePath}02_Components/${name}.html`);
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


        // Load header and footer
        const header = await loadComponent('02_header');
        document.querySelector('header').outerHTML = header;

        const footer = await loadComponent('03_footer');
        document.querySelector('footer').outerHTML = footer;

        const yearSpan = document.getElementById('year');
        yearSpan.textContent = new Date().getFullYear();

        // Load config and logo
        const config = await loadConfig();
        console.log('Config loaded:', config);

        const mainLogo = document.getElementById('mainLogo');
        mainLogo.src = config.logos.main;

        // Load navigation buttons
        const navHtml = config.navigation.map(item => 
            `<a href="${basePath}${item.href}" class="btn btn-outline-primary custom-nav-btn">${basePath}${item.name}</a>`
        ).join('');
        mainNav.innerHTML += navHtml;

    } catch (error) {
        console.error('Error initializing page:', error);
        // Display error to user
        document.body.innerHTML += `<div class="alert alert-danger">Error loading page content: ${error.message}</div>`;
    }
});
