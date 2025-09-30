// STOCRX Platform JavaScript - Updated with Dropdown Menu & Animations

// ========================================
// MOBILE MENU FUNCTIONALITY
// ========================================
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
const mobileNavClose = document.getElementById('mobile-nav-close');

// Open mobile menu
mobileMenuToggle?.addEventListener('click', () => {
    mobileNav.classList.add('active');
    mobileMenuToggle.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
});

// Close mobile menu
mobileNavClose?.addEventListener('click', () => {
    mobileNav.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
});

// Mobile submenu toggles
const mobileNavToggles = document.querySelectorAll('.mobile-nav-toggle');
mobileNavToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const submenu = toggle.nextElementSibling;
        const isActive = toggle.classList.contains('active');
        
        // Close all other submenus
        document.querySelectorAll('.mobile-nav-toggle').forEach(t => {
            if (t !== toggle) {
                t.classList.remove('active');
                t.nextElementSibling.classList.remove('active');
            }
        });
        
        // Toggle current submenu
        toggle.classList.toggle('active');
        submenu.classList.toggle('active');
    });
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.mobile-submenu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = '';
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
// SAMPLE CAR DATA (5 vehicles)
// ========================================
const vehicles = [
    {
        id: 1,
        name: "2015 Honda Civic",
        image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=500",
        price: 7500,
        downPayment: 1500,
        monthly: 583,
        mileage: 85000,
        year: 2015,
        make: "Honda",
        model: "Civic"
    },
    {
        id: 2,
        name: "2014 Toyota Camry",
        image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500",
        price: 8200,
        downPayment: 1500,
        monthly: 583,
        mileage: 92000,
        year: 2014,
        make: "Toyota",
        model: "Camry"
    },
    {
        id: 3,
        name: "2016 Nissan Altima",
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500",
        price: 7800,
        downPayment: 1500,
        monthly: 583,
        mileage: 78000,
        year: 2016,
        make: "Nissan",
        model: "Altima"
    },
    {
        id: 4,
        name: "2014 Honda CR-V",
        image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500",
        price: 8500,
        downPayment: 1500,
        monthly: 583,
        mileage: 95000,
        year: 2014,
        make: "Honda",
        model: "CR-V"
    },
    {
        id: 5,
        name: "2015 Ford Escape",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500",
        price: 7800,
        downPayment: 1500,
        monthly: 583,
        mileage: 102000,
        year: 2015,
        make: "Ford",
        model: "Escape"
    }
];

// ========================================
// LOAD FEATURED CARS
// ========================================
function loadFeaturedCars() {
    const carsGrid = document.getElementById('cars-grid');
    if (!carsGrid) return;

    carsGrid.innerHTML = '';

    vehicles.forEach(vehicle => {
        const carCard = createCarCard(vehicle);
        carsGrid.appendChild(carCard);
    });
}

function createCarCard(vehicle) {
    const card = document.createElement('div');
    card.className = 'car-card';
    card.innerHTML = `
        <div class="car-image">
            <img src="${vehicle.image}" alt="${vehicle.name}">
        </div>
        <div class="car-details">
            <h3>${vehicle.name}</h3>
            <div class="car-specs">
                <span><strong>Price:</strong> $${vehicle.price.toLocaleString()}</span>
                <span><strong>Mileage:</strong> ${vehicle.mileage.toLocaleString()} mi</span>
            </div>
            <div class="car-pricing">
                <div class="price-item">
                    <span class="label">Down Payment</span>
                    <span class="value">$${vehicle.downPayment.toLocaleString()}</span>
                </div>
                <div class="price-item">
                    <span class="label">Monthly</span>
                    <span class="value">$${vehicle.monthly}/mo</span>
                </div>
            </div>
            <div class="car-actions">
                <a href="car-details.html?id=${vehicle.id}" class="btn-primary">View Details</a>
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
    loadFeaturedCars();
    
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
</script>