// STOCRX Backend Notification System
// Node.js/Express backend for handling vehicle notifications

const express = require('express');
const router = express.Router();

// In-memory storage (replace with database in production)
let subscribers = [];
let vehicles = [
    {
        id: 1,
        name: "2015 Honda Civic",
        year: 2015,
        make: "Honda",
        model: "Civic",
        price: 7500,
        downPayment: 1500,
        totalOwed: 3500,
        mileage: 85000,
        transmission: "Automatic",
        dateAdded: new Date()
    },
    {
        id: 2,
        name: "2014 Toyota Camry",
        year: 2014,
        make: "Toyota",
        model: "Camry",
        price: 8200,
        downPayment: 1500,
        totalOwed: 3500,
        mileage: 92000,
        transmission: "Automatic",
        dateAdded: new Date()
    },
    {
        id: 3,
        name: "2016 Nissan Altima",
        year: 2016,
        make: "Nissan",
        model: "Altima",
        price: 7800,
        downPayment: 1500,
        totalOwed: 3500,
        mileage: 78000,
        transmission: "Automatic",
        dateAdded: new Date()
    },
    {
        id: 4,
        name: "2014 Honda CR-V",
        year: 2014,
        make: "Honda",
        model: "CR-V",
        price: 8500,
        downPayment: 1500,
        totalOwed: 3500,
        mileage: 95000,
        transmission: "Automatic",
        dateAdded: new Date()
    },
    {
        id: 5,
        name: "2015 Ford Escape",
        year: 2015,
        make: "Ford",
        model: "Escape",
        price: 7800,
        downPayment: 1500,
        totalOwed: 3500,
        mileage: 102000,
        transmission: "Automatic",
        dateAdded: new Date()
    }
];

// Subscribe to notifications
router.post('/api/notifications/subscribe', (req, res) => {
    const { email, userId } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    
    const existingSubscriber = subscribers.find(s => s.email === email);
    
    if (existingSubscriber) {
        return res.status(200).json({ 
            message: 'Already subscribed',
            subscriber: existingSubscriber 
        });
    }
    
    const subscriber = {
        id: subscribers.length + 1,
        email,
        userId: userId || null,
        subscribedAt: new Date(),
        preferences: {
            newVehicles: true,
            priceDrops: true,
            swapOpportunities: true
        }
    };
    
    subscribers.push(subscriber);
    
    res.status(201).json({
        message: 'Successfully subscribed to notifications',
        subscriber
    });
});

// Unsubscribe from notifications
router.post('/api/notifications/unsubscribe', (req, res) => {
    const { email } = req.body;
    
    subscribers = subscribers.filter(s => s.email !== email);
    
    res.json({ message: 'Successfully unsubscribed' });
});

// Get all vehicles
router.get('/api/vehicles', (req, res) => {
    res.json({ vehicles });
});

// Get new vehicles (added in last 24 hours)
router.get('/api/vehicles/new', (req, res) => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newVehicles = vehicles.filter(v => new Date(v.dateAdded) > oneDayAgo);
    
    res.json({ vehicles: newVehicles });
});

// Add new vehicle (admin only)
router.post('/api/vehicles', (req, res) => {
    const vehicle = {
        id: vehicles.length + 1,
        ...req.body,
        dateAdded: new Date()
    };
    
    vehicles.push(vehicle);
    
    // Notify all subscribers
    notifySubscribers(vehicle);
    
    res.status(201).json({
        message: 'Vehicle added successfully',
        vehicle
    });
});

// Notification function
function notifySubscribers(vehicle) {
    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    subscribers.forEach(subscriber => {
        if (subscriber.preferences.newVehicles) {
            console.log(`Sending notification to ${subscriber.email} about ${vehicle.name}`);
            
            // Email notification logic here
            sendEmailNotification(subscriber.email, vehicle);
            
            // Push notification logic here (if mobile app)
            sendPushNotification(subscriber.userId, vehicle);
        }
    });
}

function sendEmailNotification(email, vehicle) {
    // Example email notification
    const emailContent = {
        to: email,
        subject: `New Vehicle Available: ${vehicle.name}`,
        html: `
            <h2>New Vehicle Posted on STOCRX!</h2>
            <h3>${vehicle.name}</h3>
            <p><strong>Price:</strong> $${vehicle.price.toLocaleString()}</p>
            <p><strong>Down Payment:</strong> $${vehicle.downPayment.toLocaleString()}</p>
            <p><strong>Monthly Subscription:</strong> $${(vehicle.totalOwed / 6).toFixed(0)}</p>
            <p><strong>Mileage:</strong> ${vehicle.mileage.toLocaleString()} miles</p>
            <p><a href="https://stocrx.com/vehicles/${vehicle.id}">View Vehicle Details</a></p>
        `
    };
    
    // Integrate with your email service
    console.log('Email notification:', emailContent);
}

function sendPushNotification(userId, vehicle) {
    // Example push notification for mobile app
    if (!userId) return;
    
    const notification = {
        userId,
        title: 'New Vehicle Available!',
        body: `${vehicle.name} is now available on STOCRX`,
        data: {
            vehicleId: vehicle.id,
            type: 'new_vehicle'
        }
    };
    
    // Integrate with Firebase Cloud Messaging or similar
    console.log('Push notification:', notification);
}

// WebSocket support for real-time notifications
function setupWebSocket(io) {
    io.on('connection', (socket) => {
        console.log('Client connected for notifications');
        
        socket.on('subscribe', (data) => {
            socket.join('vehicle-notifications');
            console.log('Client subscribed to vehicle notifications');
        });
        
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
}

// Emit new vehicle notification via WebSocket
function emitNewVehicleNotification(io, vehicle) {
    io.to('vehicle-notifications').emit('new-vehicle', vehicle);
}

module.exports = {
    router,
    setupWebSocket,
    emitNewVehicleNotification,
    notifySubscribers
};