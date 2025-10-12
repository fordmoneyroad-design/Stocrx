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
            notification.style.animation = 'driveAcross 8s ease-in-out forwards';
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
    background: var(--white);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.car-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.car-image {
    width: 100%;
    height: 220px;
    overflow: hidden;
}

.car-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.car-card:hover .car-image img {
    transform: scale(1.1);
}

.car-details {
    padding: 1.5rem;
}

.car-details h3 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: var(--text-dark);
}

.car-specs {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
    color: var(--text-medium);
    font-size: 0.9rem;
}

.car-pricing {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    background: var(--gray-100);
    border-radius: 8px;
    margin-bottom: 1rem;
}

.price-item {
    text-align: center;
}

.price-item .label {
    display: block;
    font-size: 0.8rem;
    color: var(--text-medium);
    margin-bottom: 0.3rem;
}

.price-item .value {
    display: block;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--primary);
}

.car-actions {
    text-align: center;
}

.car-actions .btn-primary {
    width: 100%;
    text-align: center;
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
</script>