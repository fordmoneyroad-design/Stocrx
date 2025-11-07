// STOCRX Platform JavaScript - Updated with Dropdown Menu & Animations

// ========================================
// MOBILE MENU FUNCTIONALITY
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    // Open/Close mobile menu
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Mobile submenu toggles
    const mobileNavToggles = document.querySelectorAll('.mobile-nav-toggle');
    mobileNavToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const submenu = toggle.nextElementSibling;
            const span = toggle.querySelector('span');

            // Toggle current submenu
            toggle.classList.toggle('active');
            submenu.classList.toggle('active');

            // Change + to -
            if (toggle.classList.contains('active')) {
                span.textContent = '-';
            } else {
                span.textContent = '+';
            }
        });
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.mobile-nav a:not(.mobile-nav-toggle)').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
});

// ========================================
// ANIMATED CAR NOTIFICATION
// ========================================
function showCarNotification() {
    const notification = document.getElementById('car-notification');
    if (notification) {
        // Show notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'driveAcross 10s ease-in-out infinite';
        }, 3000);
    }
}

// Show notification on page load
window.addEventListener('load', showCarNotification);

// ========================================
// LOAD FEATURED CARS FROM DATABASE
// ========================================
async function loadFeaturedCars() {
    const carsGrid = document.getElementById('cars-grid');
    if (!carsGrid) return;

    carsGrid.innerHTML = '<div class="loading-spinner">Loading vehicles...</div>';

    try {
        const { data: vehicles, error } = await window.supabase
            .from('vehicles')
            .select('*')
            .eq('status', 'available')
            .limit(5);

        if (error) throw error;

        carsGrid.innerHTML = '';

        if (!vehicles || vehicles.length === 0) {
            carsGrid.innerHTML = '<p style="text-align: center; padding: 2rem;">No vehicles available at this time.</p>';
            return;
        }

        vehicles.forEach(vehicle => {
            const carCard = createCarCard(vehicle);
            carsGrid.appendChild(carCard);
        });
    } catch (error) {
        console.error('Error loading vehicles:', error);
        carsGrid.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--danger);">Failed to load vehicles. Please try again later.</p>';
    }
}

function createCarCard(vehicle) {
    const card = document.createElement('div');
    card.className = 'car-card';

    const downPayment = vehicle.down_payment || vehicle.downPayment || 1500;
    const monthlyPayment = vehicle.monthly_payment || vehicle.monthly || 583;
    const imageUrl = vehicle.image_url || vehicle.image || 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=500';
    const vehicleName = vehicle.name || `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

    card.innerHTML = `
        <div class="car-image">
            <img src="${imageUrl}" alt="${vehicleName}">
        </div>
        <div class="car-details">
            <h3>${vehicleName}</h3>
            <div class="car-specs">
                <span><strong>Price:</strong> $${parseFloat(vehicle.price).toLocaleString()}</span>
                <span><strong>Mileage:</strong> ${parseInt(vehicle.mileage).toLocaleString()} mi</span>
            </div>
            <div class="car-pricing">
                <div class="price-item">
                    <span class="label">Down Payment</span>
                    <span class="value">$${parseFloat(downPayment).toLocaleString()}</span>
                </div>
                <div class="price-item">
                    <span class="label">Monthly</span>
                    <span class="value">$${parseFloat(monthlyPayment)}/mo</span>
                </div>
            </div>
            <div class="car-actions">
                <a href="booking.html?vehicleId=${vehicle.id}" class="btn-primary">Book Now</a>
            </div>
        </div>
    `;
    return card;
}

// Add car card styles dynamically
const carCardStyles = `
<style>
.car-card {
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: 22px;
    overflow: hidden;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(239, 243, 255, 0.95) 100%);
    border: 1px solid rgba(85, 101, 255, 0.12);
    box-shadow: 0 20px 45px rgba(13, 27, 51, 0.08);
    transition: transform 0.35s ease, box-shadow 0.35s ease;
}

.car-card::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(85, 101, 255, 0.1) 0%, rgba(0, 216, 255, 0.08) 100%);
    opacity: 0;
    transition: opacity 0.35s ease;
    pointer-events: none;
}

.car-card:hover {
    transform: translateY(-12px);
    box-shadow: 0 32px 60px rgba(13, 27, 51, 0.14);
}

.car-card:hover::after {
    opacity: 1;
}

.car-image {
    width: 100%;
    height: 230px;
    position: relative;
    overflow: hidden;
}

.car-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.car-card:hover .car-image img {
    transform: scale(1.08);
}

.car-details {
    padding: 1.8rem;
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
}

.car-details h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-dark);
    margin: 0;
}

.car-specs {
    display: grid;
    gap: 0.45rem;
    font-size: 0.92rem;
    color: var(--text-medium);
}

.car-specs strong {
    color: var(--text-dark);
}

.car-pricing {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.9rem;
    padding: 1rem;
    background: rgba(85, 101, 255, 0.08);
    border-radius: 14px;
    border: 1px solid rgba(85, 101, 255, 0.15);
}

.price-item {
    text-align: center;
    color: var(--text-dark);
}

.price-item .label {
    display: block;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--text-light);
    margin-bottom: 0.4rem;
}

.price-item .value {
    display: block;
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--primary-dark);
}

.car-actions {
    margin-top: auto;
}

.car-actions .btn-primary {
    width: 100%;
    border-radius: 14px;
}

@media (max-width: 480px) {
    .car-card {
        border-radius: 18px;
    }

    .car-details {
        padding: 1.5rem;
    }
}
</style>
`;

// Inject car card styles
if (!document.getElementById('car-card-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'car-card-styles';
    styleElement.innerHTML = carCardStyles;
    document.head.appendChild(styleElement);
}

// ========================================
// SMOOTH SCROLLING
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// LANGUAGE SELECTOR
// ========================================
const languageSelect = document.getElementById('language-select');
languageSelect?.addEventListener('change', (e) => {
    const selectedLanguage = e.target.value;
    console.log('Language changed to:', selectedLanguage);
    // In production, this would trigger language change
    // For now, just log it
});

// ========================================
// INITIALIZE ON PAGE LOAD
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        loadFeaturedCars();
    }, 100);

    // Add scroll effect to header
    let lastScroll = 0;
    const header = document.querySelector('.main-header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });
});

// ========================================
// USER ROLE SYSTEM (Frontend/Backend Access Control)
// ========================================
const UserRole = {
    VISITOR: 'visitor',
    USER: 'user',
    ADMIN: 'admin'
};

// Get current user role (from localStorage or session)
function getCurrentUserRole() {
    return localStorage.getItem('userRole') || UserRole.VISITOR;
}

// Check if user has access to a page
function checkPageAccess(requiredRole) {
    const currentRole = getCurrentUserRole();
    
    const roleHierarchy = {
        [UserRole.VISITOR]: 0,
        [UserRole.USER]: 1,
        [UserRole.ADMIN]: 2
    };
    
    return roleHierarchy[currentRole] >= roleHierarchy[requiredRole];
}

// Restrict page access
function restrictPageAccess(requiredRole, redirectUrl = 'login.html') {
    if (!checkPageAccess(requiredRole)) {
        alert('You need to log in to access this page.');
        window.location.href = redirectUrl;
    }
}

// Example: Protect a page (call this at the top of protected pages)
// restrictPageAccess(UserRole.USER);

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        UserRole,
        getCurrentUserRole,
        checkPageAccess,
        restrictPageAccess
    };
}

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful:', registration.scope);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed:', err);
            });
    });
}

// PWA Install Prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show install button or banner (optional - you can add UI for this)
    console.log('PWA install prompt available');
});

// Track PWA installation
window.addEventListener('appinstalled', () => {
    console.log('STOCRX PWA was installed');
    deferredPrompt = null;
});