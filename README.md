# STOCRX - Subscription to Own Car Rental Platform

## Overview
STOCRX is a revolutionary car rental platform that allows users to subscribe to vehicles and build ownership with every payment. No lump sum buyout required - ownership comes through subscription payments.

## Features

### Core Features
- **Subscription-to-Own Model**: Build equity with every payment
- **Flexible Contracts**: 3-6 month terms
- **No Credit Check Required**: $1,500 down payment
- **Vehicle Swap/Upgrade**: Transfer equity to different vehicles
- **Early Buyout Option**: 25% discount on remaining balance
- **Real-time Notifications**: Get notified when new vehicles are posted

### User Features
- Browse available vehicles (2011-2019 models under $10K)
- Interactive ownership calculator
- Multi-language support (English, Spanish, Arabic)
- AI-powered chatbot support
- GPS tracking via smartphone
- QR code scanner for vehicle verification
- Biometric login (Face ID, Fingerprint)

### Technical Features
- Responsive design (mobile, tablet, desktop)
- Real-time notification system
- Backend API for vehicle management
- WebSocket support for live updates
- Email notification integration ready
- Push notification support for mobile apps

## Installation

### Prerequisites
- Node.js 14+ (for backend)
- Modern web browser
- Email service account (SendGrid, AWS SES, etc.) for notifications

### Frontend Setup
1. Clone the repository
```bash
git clone https://github.com/yourusername/stocrx.git
cd stocrx
```

2. Open `index.html` in your browser or serve with a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server
```

3. Access the site at `http://localhost:8000`

### Backend Setup (Optional - for notifications)
1. Install dependencies:
```bash
npm install express socket.io cors
```

2. Create a server file:
```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { router, setupWebSocket } = require('./backend-notifications');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());
app.use(router);

setupWebSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`STOCRX backend running on port ${PORT}`);
});
```

3. Start the server:
```bash
node server.js
```

## File Structure
```
stocrx-final/
├── index.html                  # Main HTML file
├── styles.css                  # All CSS styles
├── script.js                   # Frontend JavaScript
├── backend-notifications.js    # Backend notification system
├── README.md                   # This file
└── package.json               # Node.js dependencies (create if needed)
```

## Configuration

### Vehicle Data
Edit the `vehicles` array in `script.js` to add/modify vehicles:
```javascript
const vehicles = [
    {
        id: 1,
        name: "2015 Honda Civic",
        image: "https://example.com/image.jpg",
        downPayment: 1500,
        totalOwed: 3500,
        subscription: 583,
        year: 2015,
        make: "Honda",
        model: "Civic",
        mileage: 85000,
        transmission: "Automatic"
    }
];
```

### Notification Settings
Configure email notifications in `backend-notifications.js`:
```javascript
function sendEmailNotification(email, vehicle) {
    // Add your email service integration here
    // Example: SendGrid, AWS SES, Mailgun, etc.
}
```

## Usage

### For Users
1. **Browse Vehicles**: View available cars on the homepage
2. **Calculate Ownership**: Use the calculator to see payment plans
3. **Subscribe to Notifications**: Get alerts for new vehicles
4. **Contact Support**: 24/7 AI chatbot or email support

### For Admins
1. **Add New Vehicles**: Use the backend API to add vehicles
2. **Manage Notifications**: Configure notification preferences
3. **Monitor Subscriptions**: Track user subscriptions

## API Endpoints

### Notifications
- `POST /api/notifications/subscribe` - Subscribe to notifications
- `POST /api/notifications/unsubscribe` - Unsubscribe from notifications

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/new` - Get vehicles added in last 24 hours
- `POST /api/vehicles` - Add new vehicle (admin only)

## Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary: #3563E9;
    --primary-dark: #2748B8;
    --secondary: #53389E;
    /* ... more colors */
}
```

### Payment Terms
Modify calculator defaults in `script.js`:
```javascript
const downPaymentInput = document.getElementById('down-payment');
downPaymentInput.value = 1500; // Change default down payment
```

## Deployment

### Static Hosting (Frontend Only)
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect GitHub repository
- **GitHub Pages**: Enable in repository settings

### Full Stack Deployment
- **Heroku**: Deploy with Node.js buildpack
- **AWS**: Use EC2 or Elastic Beanstalk
- **DigitalOcean**: Deploy on a Droplet

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
Copyright © 2025 STOCRX. All rights reserved.

## Contact
- **Email**: contact@stocrx.com
- **Phone**: 1-800-STOCRX
- **Website**: https://stocrx.com

## Support
For technical support or questions:
- Use the AI chatbot on the website
- Email: contact@stocrx.com
- Check the FAQ section

## Version History
- **v1.0.0** (2025-01-30) - Initial release
  - Subscription-to-own model
  - 5 initial vehicles
  - Notification system
  - Responsive design
  - Multi-language support

## Roadmap
- [ ] Mobile app (React Native)
- [ ] Advanced GPS tracking
- [ ] QR code integration
- [ ] Biometric authentication
- [ ] Calendar integration
- [ ] Payment gateway integration
- [ ] Insurance provider integration
- [ ] Admin dashboard
- [ ] Analytics and reporting