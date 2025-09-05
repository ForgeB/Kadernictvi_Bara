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
        console.error('Error loading config:', error);
        useDefault();
    }
}

// Load and display services data
let servicesLoaded = false;
async function loadServices(config) {
    if (servicesLoaded) {
        console.log('Services already loaded, skipping...');
        return;
    }
    
    try {
        const response = await fetch(config.content.servicesDataUrl);
        const servicesData = await response.json();
        populateServices(servicesData);
        servicesLoaded = true;
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

function populateServices(servicesData) {
    const servicesContainer = document.querySelector('#services .services-grid');
    if (!servicesContainer) return;

    // Clear existing content
    servicesContainer.innerHTML = '';

    // Create a simple list container for services
    const servicesList = document.createElement('div');
    servicesList.className = 'services-list';
    servicesList.style.display = 'block';
    servicesList.style.width = '100%';

    // Create service cards showing only service names (keys)
    Object.keys(servicesData.services).forEach((serviceKey) => {
        const serviceData = servicesData.services[serviceKey];
        const serviceCard = createServiceCard(serviceKey, serviceData, siteConfig);
        servicesList.appendChild(serviceCard);
    });

    servicesContainer.appendChild(servicesList);

    // Add brands section from config AFTER services
    if (siteConfig?.content?.brands && siteConfig.content.brands.length > 0) {
        const brandsSection = createBrandsSection(siteConfig.content.brands);
        servicesContainer.appendChild(brandsSection);
    }
}

function createBrandsSection(brands) {
    const brandsContainer = document.createElement('div');
    brandsContainer.className = 'brands-section';
    brandsContainer.style.marginBottom = '40px';
    brandsContainer.style.textAlign = 'center';

    // Brands title
    const brandsTitle = document.createElement('h3');
    brandsTitle.textContent = 'Naše značky';
    brandsTitle.style.fontSize = '1.5rem';
    brandsTitle.style.fontWeight = '600';
    brandsTitle.style.color = '#2c3e50';
    brandsTitle.style.marginBottom = '30px';
    brandsContainer.appendChild(brandsTitle);

    // Brands grid
    const brandsGrid = document.createElement('div');
    brandsGrid.className = 'brands-grid';
    brandsGrid.style.display = 'flex';
    brandsGrid.style.justifyContent = 'center';
    brandsGrid.style.alignItems = 'center';
    brandsGrid.style.gap = '30px';
    brandsGrid.style.flexWrap = 'wrap';

    brands.forEach(brand => {
        const brandItem = document.createElement('div');
        brandItem.className = 'brand-item';
        brandItem.style.display = 'flex';
        brandItem.style.flexDirection = 'column';
        brandItem.style.alignItems = 'center';
        brandItem.style.padding = '20px';
        brandItem.style.backgroundColor = 'white';
        brandItem.style.borderRadius = '10px';
        brandItem.style.boxShadow = '0 3px 15px rgba(0,0,0,0.1)';
        brandItem.style.transition = 'transform 0.3s ease';
        brandItem.style.cursor = 'pointer';

        // Brand logo
        const brandLogo = document.createElement('img');
        brandLogo.src = brand.logo;
        brandLogo.alt = `${brand.name} logo`;
        brandLogo.style.height = '60px';
        brandLogo.style.objectFit = 'contain';
        brandLogo.style.marginBottom = '10px';

        // Brand name
        const brandName = document.createElement('span');
        brandName.textContent = brand.name;
        brandName.style.fontSize = '0.9rem';
        brandName.style.fontWeight = '500';
        brandName.style.color = '#666';

        // Add hover effects
        brandItem.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        brandItem.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });

        // Add click handler if website exists
        if (brand.website) {
            brandItem.addEventListener('click', function() {
                window.open(brand.website, '_blank');
            });
        }

        brandItem.appendChild(brandLogo);
        brandItem.appendChild(brandName);
        brandsGrid.appendChild(brandItem);
    });

    brandsContainer.appendChild(brandsGrid);
    return brandsContainer;
}

function createServiceCard(serviceKey, serviceData, config) {
    // Create container directly without card wrapper
    const serviceContainer = document.createElement('div');
    serviceContainer.className = 'service-item';
    serviceContainer.style.marginBottom = '2px';

    // Service header (always visible)
    const serviceHeader = document.createElement('div');
    serviceHeader.className = 'service-header';
    serviceHeader.style.padding = '8px 0';
    serviceHeader.style.cursor = 'pointer';
    serviceHeader.style.display = 'flex';
    serviceHeader.style.justifyContent = 'space-between';
    serviceHeader.style.alignItems = 'center';
    serviceHeader.style.transition = 'background-color 0.2s ease';

    // Clean service name (remove underscores and special characters)
    const cleanServiceName = serviceKey.replace(/_/g, ' ').replace(/\+/g, '+');

    // Service title
    const title = document.createElement('span');
    title.className = 'service-title';
    title.textContent = cleanServiceName;
    title.style.margin = '0';
    title.style.fontSize = '0.9rem';
    title.style.fontWeight = '500';
    title.style.color = '#2c3e50';

    // Expand/collapse icon
    const expandIcon = document.createElement('i');
    expandIcon.className = 'fas fa-chevron-down';
    expandIcon.style.color = '#667eea';
    expandIcon.style.fontSize = '0.7rem';
    expandIcon.style.transition = 'transform 0.2s ease';

    serviceHeader.appendChild(title);
    serviceHeader.appendChild(expandIcon);

    // Service content (initially hidden)
    const serviceContent = document.createElement('div');
    serviceContent.className = 'service-content';
    serviceContent.style.maxHeight = '0';
    serviceContent.style.overflow = 'hidden';
    serviceContent.style.transition = 'max-height 0.2s ease';
    serviceContent.style.marginBottom = '10px';

    // Inner content container
    const contentInner = document.createElement('div');
    contentInner.style.paddingLeft = '15px';
    contentInner.style.paddingTop = '5px';

    // Get service images from config
    const serviceImages = config?.content?.serviceImages || {};

    // Add service image
    const serviceImage = document.createElement('img');
    serviceImage.className = 'service-image';
    serviceImage.src = serviceImages[serviceKey] || '01_Assets/01_IMG/service-hair-styling.jpg';
    serviceImage.alt = `${cleanServiceName} - služba`;
    serviceImage.style.width = '100%';
    serviceImage.style.height = '500px'; // Increased height for bigger images
    serviceImage.style.objectFit = 'cover';
    serviceImage.style.borderRadius = '6px';
    serviceImage.style.marginBottom = '15px';
    
    // Add error handling for images
    serviceImage.onerror = function() {
        console.error('Failed to load image:', this.src);
        if (!this.src.includes('service-hair-styling.jpg')) {
            this.src = '01_Assets/01_IMG/service-hair-styling.jpg';
        } else {
            this.style.display = 'none';
            console.error('Fallback image also failed to load');
        }
    };

    contentInner.appendChild(serviceImage);

    // Create pricing table
    const pricingTable = createPricingTable(serviceData);
    contentInner.appendChild(pricingTable);

    serviceContent.appendChild(contentInner);

    // Add click functionality
    let isExpanded = false;
    serviceHeader.addEventListener('click', function() {
        isExpanded = !isExpanded;
        
        if (isExpanded) {
            serviceContent.style.maxHeight = serviceContent.scrollHeight + 'px';
            expandIcon.style.transform = 'rotate(180deg)';
        } else {
            serviceContent.style.maxHeight = '0';
            expandIcon.style.transform = 'rotate(0deg)';
        }
    });

    // Hover effects on header only
    serviceHeader.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#f8f9fa';
    });

    serviceHeader.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'transparent';
    });

    serviceContainer.appendChild(serviceHeader);
    serviceContainer.appendChild(serviceContent);

    return serviceContainer;
}

function createPricingTable(serviceData) {
    const tableContainer = document.createElement('div');
    tableContainer.style.marginTop = '10px';

    // Check if service has multiple options or is a simple service
    if (typeof serviceData === 'object' && serviceData.cost && serviceData.time) {
        // Simple service with direct cost and time
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.fontSize = '0.8rem';
        table.style.marginBottom = '10px';

        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; text-align: left;">Specifikace</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; text-align: center;">Cena</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; text-align: center;">Čas</th>
        `;
        table.appendChild(headerRow);

        const dataRow = document.createElement('tr');
        dataRow.innerHTML = `
            <td style="border: 1px solid #ddd; padding: 8px;">Základní služba</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: 600; color: #667eea;">${serviceData.cost}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${serviceData.time}</td>
        `;
        table.appendChild(dataRow);
        tableContainer.appendChild(table);
    } else {
        // Service with multiple options
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.fontSize = '0.8rem';
        table.style.marginBottom = '10px';

        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; text-align: left;">Specifikace</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; text-align: center;">Cena</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5; text-align: center;">Čas</th>
        `;
        table.appendChild(headerRow);

        // Add rows for each option
        Object.entries(serviceData).forEach(([optionKey, optionData]) => {
            if (optionData && typeof optionData === 'object' && optionData.cost) {
                const dataRow = document.createElement('tr');
                dataRow.innerHTML = `
                    <td style="border: 1px solid #ddd; padding: 8px;">${optionKey}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: 600; color: #667eea;">${optionData.cost}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${optionData.time || '-'}</td>
                `;
                table.appendChild(dataRow);
            }
        });

        tableContainer.appendChild(table);
    }

    return tableContainer;
}

// =================================
// GALLERY FUNCTIONALITY
// =================================

// Load and display gallery data
let galleryLoaded = false;
async function loadGallery() {
    if (galleryLoaded) {
        console.log('Gallery already loaded, skipping...');
        return;
    }
    
    try {
        const response = await fetch('04_Content/Strories.json');
        const galleryData = await response.json();
        populateGallery(galleryData);
        galleryLoaded = true;
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}

function populateGallery(galleryData) {
    const galleryContainer = document.querySelector('#gallery .gallery-grid');
    if (!galleryContainer) return;

    // Clear existing content
    galleryContainer.innerHTML = '';

    // Create gallery items
    galleryData.stories.forEach(story => {
        const galleryItem = createGalleryItem(story);
        galleryContainer.appendChild(galleryItem);
    });

    // Initialize modal functionality
    initGalleryModal();
}

function createGalleryItem(story) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.style.cursor = 'pointer';
    galleryItem.style.position = 'relative';
    galleryItem.style.overflow = 'hidden';
    galleryItem.style.borderRadius = '10px';
    galleryItem.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    galleryItem.style.backgroundColor = 'white';
    galleryItem.style.boxShadow = '0 3px 15px rgba(0,0,0,0.1)';

    // Image
    const image = document.createElement('img');
    image.src = story.image;
    image.alt = story.title;
    image.style.width = '100%';
    image.style.height = '250px';
    image.style.objectFit = 'cover';
    image.style.transition = 'transform 0.3s ease';

    // Overlay with title
    const overlay = document.createElement('div');
    overlay.className = 'gallery-overlay';
    overlay.style.position = 'absolute';
    overlay.style.bottom = '0';
    overlay.style.left = '0';
    overlay.style.right = '0';
    overlay.style.background = 'linear-gradient(transparent, rgba(0,0,0,0.7))';
    overlay.style.color = 'white';
    overlay.style.padding = '20px 15px 15px';
    overlay.style.transform = 'translateY(100%)';
    overlay.style.transition = 'transform 0.3s ease';

    const title = document.createElement('h3');
    title.textContent = story.title;
    title.style.fontSize = '1.1rem';
    title.style.fontWeight = '600';
    title.style.margin = '0';

    overlay.appendChild(title);

    // Hover effects
    galleryItem.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
        image.style.transform = 'scale(1.1)';
        overlay.style.transform = 'translateY(0)';
    });

    galleryItem.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 3px 15px rgba(0,0,0,0.1)';
        image.style.transform = 'scale(1)';
        overlay.style.transform = 'translateY(100%)';
    });

    // Click to open modal
    galleryItem.addEventListener('click', function() {
        openGalleryModal(story);
    });

    galleryItem.appendChild(image);
    galleryItem.appendChild(overlay);

    return galleryItem;
}

function initGalleryModal() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('gallery-modal');
    if (!modal) {
        modal = createGalleryModal();
        document.body.appendChild(modal);
    }
}

function createGalleryModal() {
    const modal = document.createElement('div');
    modal.id = 'gallery-modal';
    modal.className = 'gallery-modal';
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.9)';
    modal.style.zIndex = '2000';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.padding = '20px';

    const modalContent = document.createElement('div');
    modalContent.className = 'gallery-modal-content';
    modalContent.style.backgroundColor = 'white';
    modalContent.style.borderRadius = '15px';
    modalContent.style.maxWidth = 'fit-content';
    modalContent.style.maxHeight = 'fit-content';
    modalContent.style.overflow = 'auto';
    modalContent.style.position = 'relative';
    modalContent.style.animation = 'modalSlideIn 0.3s ease';
    modalContent.style.display = 'flex';
    modalContent.style.flexDirection = 'column';

    // Close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '15px';
    closeButton.style.right = '15px';
    closeButton.style.background = 'rgba(0,0,0,0.5)';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '50%';
    closeButton.style.width = '40px';
    closeButton.style.height = '40px';
    closeButton.style.fontSize = '16px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.zIndex = '10';
    closeButton.style.transition = 'background-color 0.3s ease';

    closeButton.addEventListener('mouseenter', function() {
        this.style.backgroundColor = 'rgba(0,0,0,0.8)';
    });

    closeButton.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'rgba(0,0,0,0.5)';
    });

    closeButton.addEventListener('click', function() {
        closeGalleryModal();
    });

    const modalImage = document.createElement('img');
    modalImage.id = 'modal-image';
    modalImage.style.width = 'auto';
    modalImage.style.height = 'auto';
    modalImage.style.maxWidth = '90vw';
    modalImage.style.maxHeight = '80vh';
    modalImage.style.objectFit = 'contain';
    modalImage.style.borderRadius = '15px 15px 0 0';

    const modalText = document.createElement('div');
    modalText.id = 'modal-text';
    modalText.style.padding = '25px';

    const modalTitle = document.createElement('h2');
    modalTitle.id = 'modal-title';
    modalTitle.style.fontSize = '1.8rem';
    modalTitle.style.fontWeight = '600';
    modalTitle.style.color = '#2c3e50';
    modalTitle.style.marginBottom = '15px';

    const modalDescription = document.createElement('p');
    modalDescription.id = 'modal-description';
    modalDescription.style.fontSize = '1rem';
    modalDescription.style.lineHeight = '1.6';
    modalDescription.style.color = '#666';

    modalText.appendChild(modalTitle);
    modalText.appendChild(modalDescription);

    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalImage);
    modalContent.appendChild(modalText);

    modal.appendChild(modalContent);

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeGalleryModal();
        }
    });

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes modalSlideIn {
            from {
                transform: scale(0.8);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
        
        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        
        @media (max-width: 768px) {
            .gallery-grid {
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 15px;
            }
            
            .gallery-modal-content {
                margin: 10px;
                max-width: calc(100% - 20px);
            }
        }
    `;
    document.head.appendChild(style);

    return modal;
}

function openGalleryModal(story) {
    const modal = document.getElementById('gallery-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');

    if (modal && modalImage && modalTitle && modalDescription) {
        modalImage.src = story.image;
        modalImage.alt = story.title;
        modalTitle.textContent = story.title;
        modalDescription.textContent = story.description;

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeGalleryModal() {
    const modal = document.getElementById('gallery-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeGalleryModal();
    }
});

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
        'Bára Kubová': 'fas fa-user',
        'O mně': 'fas fa-user', // Keep for backward compatibility
        'O nás': 'fas fa-user', // Keep for backward compatibility
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
        logoText.textContent = config.siteName; // Use last word of site name
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

    // Remove any existing social media container
    const existingContainer = document.querySelector('.social-media-links');
    if (existingContainer) {
        existingContainer.remove();
    }

    // Always create floating social media bar on the left side
    const socialContainer = document.createElement('div');
    socialContainer.className = 'social-media-links floating-social';
    
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
    
    // Add to body as floating element
    document.body.appendChild(socialContainer);
    
    console.log('📱 Social media links added as floating bar on left side');
}

/**
 * Populate content sections from configuration
 */
function populateContent(config) {
    if (!config?.content) return;

    // Populate about section
    const aboutText = document.getElementById('about-text');
    if (aboutText && config.content.aboutText) {
        aboutText.textContent = config.content.aboutText;
    }

    // Populate contact section
    populateContactSection(config);

    console.log('📝 Content populated from configuration');
}

/**
 * Populate contact section with contact details
 */
function populateContactSection(config) {
    const contactDetails = document.querySelector('.contact-details');
    if (!contactDetails || !config?.contact) return;

    // Clear existing content
    contactDetails.innerHTML = '';

    // Contact information container
    const contactInfo = document.createElement('div');
    contactInfo.className = 'contact-info-container';

    // Contact title
    const contactTitle = document.createElement('h3');
    contactTitle.textContent = 'Kontaktní informace';
    contactInfo.appendChild(contactTitle);

    // Phone
    if (config.contact.phone) {
        const phoneDiv = document.createElement('div');
        phoneDiv.className = 'contact-item';
        phoneDiv.innerHTML = `
            <i class="fas fa-phone"></i>
            <strong>Telefon:</strong> <a href="tel:${config.contact.phone}">${config.contact.phone}</a>
        `;
        contactInfo.appendChild(phoneDiv);
    }

    // Email
    if (config.contact.email) {
        const emailDiv = document.createElement('div');
        emailDiv.className = 'contact-item';
        emailDiv.innerHTML = `
            <i class="fas fa-envelope"></i>
            <strong>Email:</strong> <a href="mailto:${config.contact.email}">${config.contact.email}</a>
        `;
        contactInfo.appendChild(emailDiv);
    }

    // Address
    if (config.contact.address) {
        const addressDiv = document.createElement('div');
        addressDiv.className = 'contact-item';
        const address = config.contact.address;
        addressDiv.innerHTML = `
            <i class="fas fa-map-marker-alt"></i>
            <strong>Adresa:</strong> ${address.street}, ${address.city}, ${address.zip}
        `;
        contactInfo.appendChild(addressDiv);
    }

    // Hours
    if (config.contact.hours) {
        const hoursDiv = document.createElement('div');
        hoursDiv.className = 'contact-item';
        
        const hoursTitle = document.createElement('h4');
        hoursTitle.innerHTML = '<i class="fas fa-clock"></i><strong>Otevírací doba:</strong>';
        hoursDiv.appendChild(hoursTitle);

        const hoursList = document.createElement('ul');
        hoursList.style.listStyle = 'none';
        hoursList.style.padding = '0';
        hoursList.style.marginLeft = '30px';

        Object.entries(config.contact.hours).forEach(([day, hours]) => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${capitalizeCz(day)}:</strong> ${hours}`;
            hoursList.appendChild(li);
        });

        hoursDiv.appendChild(hoursList);
        contactInfo.appendChild(hoursDiv);
    }

    contactDetails.appendChild(contactInfo);
}

/**
 * Populate footer content from configuration
 */
function populateFooter(config) {
    if (!config?.contact) return;

    // Contact information
    if (document.getElementById('footer-phone'))
        document.getElementById('footer-phone').textContent = config.contact.phone;
    if (document.getElementById('footer-email'))
        document.getElementById('footer-email').textContent = config.contact.email;
    if (document.getElementById('footer-address')) {
        const address = config.contact.address;
        document.getElementById('footer-address').textContent = `${address.street}, ${address.city}, ${address.zip}`;
    }
    
    // Hours
    const hoursList = document.getElementById('footer-hours-list');
    if (hoursList && config.contact.hours) {
        hoursList.innerHTML = '';
        Object.entries(config.contact.hours).forEach(([day, hours]) => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${capitalizeCz(day)}:</strong> ${hours}`;
            hoursList.appendChild(li);
        });
    }
    
    // Year
    if (document.getElementById('footer-year'))
        document.getElementById('footer-year').textContent = new Date().getFullYear();

    console.log('🦶 Footer populated from configuration');
}

/**
 * Capitalize first letter for Czech day names
 */
function capitalizeCz(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
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
        populateContent(config);
        populateFooter(config);
        loadServices(config);
        loadGallery(); // Load gallery content from Stories.json
        
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
        loadGallery(); // Load gallery even if config fails
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
        populateContent(config);
        populateFooter(config);
        return config;
    },
    // Gallery functions
    loadGallery,
    openGalleryModal,
    closeGalleryModal
};