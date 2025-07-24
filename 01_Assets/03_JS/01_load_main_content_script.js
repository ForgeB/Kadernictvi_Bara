async function loadConfig() {
    const response = await fetch('./01_config.json');
    return response.json();
}

async function loadComponent(name) {
    const response = await fetch(`./02_Components/${name}.html`);
    return response.text();
}

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const config = await loadConfig();
        
        // Load components
        document.querySelector('header').outerHTML = await loadComponent('header');
        document.querySelector('footer').outerHTML = await loadComponent('footer');
        
        // Update navigation
        const navHtml = config.navigation.map(item => 
            `<a href="${item.href}" class="btn btn-outline-primary custom-nav-btn">${item.name}</a>`
        ).join('');
        document.getElementById('mainNav').innerHTML = navHtml;
        
        // Update logos
        document.getElementById('mainLogo').src = config.logos.main;
        
        // ... rest of your existing contact loading code ...
    } catch (error) {
        console.error('Error initializing page:', error);
    }
});