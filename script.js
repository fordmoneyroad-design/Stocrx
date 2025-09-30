// STOCRX Platform JavaScript
// Vehicle notification system and interactive features

// Initial vehicle data (5 cars)
const vehicles = [
    {
        id: 1,
        name: "2015 Honda Civic",
        image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=500",
        downPayment: 1500,
        totalOwed: 3500,
        subscription: 583,
        year: 2015,
        make: "Honda",
        model: "Civic",
        mileage: 85000,
        transmission: "Automatic"
    },
    {
        id: 2,
        name: "2014 Toyota Camry",
        image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500",
        downPayment: 1500,
        totalOwed: 3500,
        subscription: 583,
        year: 2014,
        make: "Toyota",
        model: "Camry",
        mileage: 92000,
        transmission: "Automatic"
    },
    {
        id: 3,
        name: "2016 Nissan Altima",
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500",
        downPayment: 1500,
        totalOwed: 3500,
        subscription: 583,
        year: 2016,
        make: "Nissan",
        model: "Altima",
        mileage: 78000,
        transmission: "Automatic"
    },
    {
        id: 4,
        name: "2014 Honda CR-V",
        image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500",
        downPayment: 1500,
        totalOwed: 3500,
        subscription: 583,
        year: 2014,
        make: "Honda",
        model: "CR-V",
        mileage: 95000,
        transmission: "Automatic"
    },
    {
        id: 5,
        name: "2015 Ford Escape",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500",
        downPayment: 1500,
        totalOwed: 3500,
        subscription: 583,
        year: 2015,
        make: "Ford",
        model: "Escape",
        mileage: 102000,
        transmission: "Automatic"
    }
];

// Notification System
class NotificationSystem {
    constructor() {
        this.subscribers = this.loadSubscribers();
        this.lastChecked = localStorage.getItem('lastChecked') || Date.now();
    }

    loadSubscribers() {
        const saved = localStorage.getItem('notificationSubscribers');
        return saved ? JSON.parse(saved) : [];
    }

    saveSubscribers() {
        localStorage.setItem('notificationSubscribers', JSON.stringify(this.subscribers));
    }

    subscribe(email) {
        if (!this.subscribers.includes(email)) {
            this.subscribers.push(email);
            this.saveSubscribers();
            return true;
        }
        return false;
    }

    showNotification(vehicle) {
        const toast = document.getElementById('notification-toast');
        const message = document.getElementById('notification-message');
        
        message.textContent = `${vehicle.name} is now available!`;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }

    checkForNewVehicles() {
        // Simulate checking for new vehicles
        // In production, this would call your backend API
        const newVehicles = vehicles.filter(v => v.id > 3);
        
        if (newVehicles.length > 0 && this.subscribers.length > 0) {
            // Show notification for the first new vehicle
            this.showNotification(newVehicles[0]);
        }
    }
}

const notificationSystem = new NotificationSystem();

// Close notification
document.querySelector('.notification-close')?.addEventListener('click', () => {
    document.getElementById('notification-toast').classList.remove('show');
});

// Load vehicles on page load
function loadVehicles() {
    const carGrid = document.getElementById('car-grid');
    carGrid.innerHTML = '';

    vehicles.forEach(vehicle => {
        const carCard = createCarCard(vehicle);
        carGrid.appendChild(carCard);
    });
}

function createCarCard(vehicle) {
    const card = document.createElement('div');
    card.className = 'car-card';
    
    const ownershipProgress = ((vehicle.downPayment / (vehicle.downPayment + vehicle.totalOwed)) * 100).toFixed(1);
    
    card.innerHTML = `
        <div class="car-image">
            <img src="${vehicle.image}" alt="${vehicle.name}">
        </div>
        <div class="car-details">
            <h3>${vehicle.name}</h3>
            <div class="price-details">
                <div class="price-item">
                    <span class="label">Down Payment</span>
                    <span class="value">$${vehicle.downPayment.toLocaleString()}</span>
                </div>
                <div class="price-item">
                    <span class="label">Subscription</span>
                    <span class="value">$${vehicle.subscription}/month</span>
                </div>
            </div>
            <div class="ownership-progress">
                <div class="progress-text">
                    <span>Ownership Progress</span>
                    <span>$${vehicle.downPayment.toLocaleString()} / $${(vehicle.downPayment + vehicle.totalOwed).toLocaleString()} paid</span>
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${ownershipProgress}%"></div>
                </div>
            </div>
            <div class="car-actions">
                <a href="#" class="btn-subscribe">Subscribe Now</a>
                <a href="#" class="btn-swap">Swap / Upgrade</a>
            </div>
        </div>
    `;
    
    return card;
}

// Calculator functionality
const downPaymentInput = document.getElementById('down-payment');
const contractLengthInput = document.getElementById('contract-length');
const totalOwedSelect = document.getElementById('total-owed');
const contractValueDisplay = document.getElementById('contract-value');
const paymentAmountDisplay = document.getElementById('payment-amount');
const totalPaymentsDisplay = document.getElementById('total-payments');
const buyoutPriceDisplay = document.getElementById('buyout-price');

let currentFrequency = 'monthly';

function calculatePayments() {
    const downPayment = parseFloat(downPaymentInput.value) || 1500;
    const contractLength = parseInt(contractLengthInput.value) || 6;
    const totalOwed = parseFloat(totalOwedSelect.value) || 3500;
    
    contractValueDisplay.textContent = `${contractLength} mo`;
    
    let numPayments;
    if (currentFrequency === 'weekly') {
        numPayments = contractLength * 4;
    } else {
        numPayments = contractLength;
    }
    
    const paymentAmount = totalOwed / numPayments;
    const buyoutPrice = totalOwed * 0.75; // 25% discount
    
    paymentAmountDisplay.textContent = `$${paymentAmount.toFixed(0)}`;
    totalPaymentsDisplay.textContent = numPayments;
    buyoutPriceDisplay.textContent = `$${buyoutPrice.toLocaleString()}`;
}

// Payment frequency toggle
document.querySelectorAll('.payment-toggle button').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.payment-toggle button').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
        currentFrequency = this.dataset.frequency;
        calculatePayments();
    });
});

// Add event listeners
downPaymentInput?.addEventListener('input', calculatePayments);
contractLengthInput?.addEventListener('input', calculatePayments);
totalOwedSelect?.addEventListener('change', calculatePayments);

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('nav ul');

mobileMenuBtn?.addEventListener('click', () => {
    nav.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            nav?.classList.remove('active');
            mobileMenuBtn?.classList.remove('active');
        }
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadVehicles();
    calculatePayments();
    
    // Check for new vehicles every 30 seconds (in production, use WebSocket or Server-Sent Events)
    setInterval(() => {
        notificationSystem.checkForNewVehicles();
    }, 30000);
    
    // Show a demo notification after 3 seconds
    setTimeout(() => {
        if (vehicles.length > 0) {
            notificationSystem.showNotification(vehicles[vehicles.length - 1]);
        }
    }, 3000);
});

// Export for backend integration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NotificationSystem,
        vehicles
    };
}