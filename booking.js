import { supabase } from './supabaseClient.js';

let currentStep = 1;
let vehicleData = null;
let bookingId = null;

const urlParams = new URLSearchParams(window.location.search);
const vehicleId = urlParams.get('vehicleId');

document.addEventListener('DOMContentLoaded', async () => {
    if (!vehicleId) {
        window.location.href = 'browse-cars.html';
        return;
    }

    await loadVehicleDetails();
    setupEventListeners();
    setupDateInput();
});

async function loadVehicleDetails() {
    const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', vehicleId)
        .maybeSingle();

    if (error || !data) {
        alert('Vehicle not found');
        window.location.href = 'browse-cars.html';
        return;
    }

    vehicleData = data;
    displayVehicleSummary();
}

function displayVehicleSummary() {
    const summaryHTML = `
        <div class="vehicle-card-summary">
            <img src="${vehicleData.image_url || 'https://via.placeholder.com/400x300'}" alt="${vehicleData.year} ${vehicleData.make} ${vehicleData.model}">
            <div class="vehicle-info">
                <h3>${vehicleData.year} ${vehicleData.make} ${vehicleData.model}</h3>
                <p><strong>VIN:</strong> ${vehicleData.vin || 'N/A'}</p>
                <p><strong>Mileage:</strong> ${vehicleData.mileage?.toLocaleString() || 'N/A'} miles</p>
                <div class="price-info">
                    <div class="price-row">
                        <span>Total Price:</span>
                        <span class="price">$${parseFloat(vehicleData.price).toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div class="price-row">
                        <span>Down Payment:</span>
                        <span class="price">$${parseFloat(vehicleData.down_payment).toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div class="price-row">
                        <span>Monthly Payment:</span>
                        <span class="price">$${parseFloat(vehicleData.monthly_payment).toLocaleString('en-US', {minimumFractionDigits: 2})}/mo</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('vehicleSummary').innerHTML = summaryHTML;
}

function setupDateInput() {
    const dateInput = document.getElementById('startDate');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
    dateInput.value = tomorrow.toISOString().split('T')[0];
}

function setupEventListeners() {
    document.getElementById('continueToPayment').addEventListener('click', () => {
        const startDate = document.getElementById('startDate').value;
        if (!startDate) {
            alert('Please select a start date');
            return;
        }
        goToStep(2);
    });

    document.getElementById('backToVehicle').addEventListener('click', () => {
        goToStep(1);
    });

    document.getElementById('continueToConfirm').addEventListener('click', () => {
        if (!validatePaymentForm()) {
            return;
        }
        displayConfirmation();
        goToStep(3);
    });

    document.getElementById('backToPayment').addEventListener('click', () => {
        goToStep(2);
    });

    document.getElementById('agreeTerms').addEventListener('change', (e) => {
        document.getElementById('confirmPayment').disabled = !e.target.checked;
    });

    document.getElementById('confirmPayment').addEventListener('click', processPayment);

    document.getElementById('cardNumber').addEventListener('input', formatCardNumber);
    document.getElementById('expiry').addEventListener('input', formatExpiry);
    document.getElementById('cvv').addEventListener('input', formatCVV);
}

function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
}

function formatExpiry(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
}

function formatCVV(e) {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
}

function validatePaymentForm() {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;
    const cardName = document.getElementById('cardName').value;

    if (cardNumber.length !== 16) {
        alert('Please enter a valid 16-digit card number');
        return false;
    }

    if (expiry.length !== 5 || !expiry.includes('/')) {
        alert('Please enter a valid expiry date (MM/YY)');
        return false;
    }

    if (cvv.length !== 3) {
        alert('Please enter a valid 3-digit CVV');
        return false;
    }

    if (!cardName.trim()) {
        alert('Please enter the cardholder name');
        return false;
    }

    return true;
}

function displayConfirmation() {
    const confirmVehicleHTML = `
        <p><strong>${vehicleData.year} ${vehicleData.make} ${vehicleData.model}</strong></p>
        <p>VIN: ${vehicleData.vin || 'N/A'}</p>
        <p>Start Date: ${document.getElementById('startDate').value}</p>
    `;
    document.getElementById('confirmVehicle').innerHTML = confirmVehicleHTML;

    document.getElementById('downPaymentAmount').textContent =
        `$${parseFloat(vehicleData.down_payment).toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    document.getElementById('monthlyPaymentAmount').textContent =
        `$${parseFloat(vehicleData.monthly_payment).toLocaleString('en-US', {minimumFractionDigits: 2})}/mo`;
    document.getElementById('totalDueAmount').textContent =
        `$${parseFloat(vehicleData.down_payment).toLocaleString('en-US', {minimumFractionDigits: 2})}`;

    const cardNumber = document.getElementById('cardNumber').value;
    const lastFour = cardNumber.slice(-4);
    const confirmPaymentHTML = `
        <p>Card ending in ${lastFour}</p>
        <p>${document.getElementById('cardName').value}</p>
    `;
    document.getElementById('confirmPaymentMethod').innerHTML = confirmPaymentHTML;
}

async function processPayment() {
    const confirmButton = document.getElementById('confirmPayment');
    const statusDiv = document.getElementById('paymentStatus');

    confirmButton.disabled = true;
    confirmButton.textContent = 'Processing...';
    statusDiv.innerHTML = '<div class="loading-spinner">Processing your payment...</div>';

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            throw new Error('You must be logged in to complete this booking. Please log in and try again.');
        }

        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .insert({
                user_id: user.id,
                vehicle_id: vehicleId,
                start_date: document.getElementById('startDate').value,
                status: 'pending',
                down_payment_paid: false,
                total_paid: 0,
                ownership_percentage: 0
            })
            .select()
            .single();

        if (bookingError) throw bookingError;
        bookingId = booking.id;

        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-payment`;
        const { data: { session } } = await supabase.auth.getSession();

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bookingId: bookingId,
                amount: parseFloat(vehicleData.down_payment),
                paymentType: 'down_payment',
                paymentMethodId: 'card'
            })
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Payment processing failed');
        }

        statusDiv.innerHTML = `
            <div class="payment-success">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h3>Payment Successful!</h3>
                <p>Your booking has been confirmed.</p>
                <p>Ownership: ${result.booking.ownership_percentage}%</p>
                <p>You will receive a confirmation email shortly.</p>
                <a href="dashboard.html" class="btn btn-primary">Go to Dashboard</a>
            </div>
        `;

        confirmButton.style.display = 'none';

    } catch (error) {
        console.error('Payment error:', error);
        statusDiv.innerHTML = `
            <div class="payment-error">
                <p>Payment failed: ${error.message}</p>
            </div>
        `;
        confirmButton.disabled = false;
        confirmButton.textContent = 'Try Again';
    }
}

function goToStep(step) {
    document.querySelectorAll('.booking-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.progress-step').forEach(s => s.classList.remove('active'));

    document.getElementById(`step${step}`).classList.add('active');
    for (let i = 1; i <= step; i++) {
        document.querySelector(`.progress-step[data-step="${i}"]`).classList.add('active');
    }

    currentStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
