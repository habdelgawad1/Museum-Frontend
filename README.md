# Grand Egyptian Museum - Virtual Tours Platform

A comprehensive web application for the Grand Egyptian Museum featuring virtual tours, ticket booking, user management, and an admin dashboard. Built with a modern frontend and RESTful API backend.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [User Guide](#user-guide)
- [Admin Guide](#admin-guide)
- [Technologies Used](#technologies-used)
- [File Descriptions](#file-descriptions)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## ✨ Features

### For Visitors
- **Browse Virtual Tours**: Explore available museum tours with detailed information
- **Search & Filter**: Find tours by name, description, or guide
- **Tour Details**: View comprehensive tour information including:
  - Guide information
  - Duration and language
  - Price and capacity
  - Reviews and ratings
- **Ticket Booking**: Reserve tours with date and time selection
- **Payment Options**: Pay with cash or reward points
- **User Profile**: Manage personal information and view booking history
- **Booking Management**: View, update, or cancel bookings

### For Administrators
- **Tour Management**: Create, update, and delete tours
- **User Management**: Add admin users with different roles
- **Museum Information**: Update museum details and contact information
- **Dashboard**: Comprehensive admin panel with tabbed interface

### General Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Authentication**: Secure login and registration system
- **Session Management**: JWT-based authentication with token storage
- **Beautiful UI**: Egyptian-themed design with gold accents and hieroglyphic aesthetics

## 📁 Project Structure

```
project/
├── public/
│   ├── index.html              # Home page
│   ├── index.js                # Home page logic
│   ├── login.html              # Login page
│   ├── login.js                # Login functionality
│   ├── signup.html             # Registration page
│   ├── signup.js               # Registration functionality
│   ├── tours.html              # Tours listing page
│   ├── tours.js                # Tours functionality
│   ├── tickets.html            # Booking page
│   ├── tickets.js              # Booking functionality
│   ├── profile.html            # User profile page
│   ├── profile.js              # Profile management
│   ├── admin.html              # Admin dashboard
│   ├── admin.js                # Admin functionality
│   ├── config.js               # API configuration
│   ├── home.css                # Main stylesheet
│   ├── style.css               # Form styles
│   ├── tours.css               # Tours page styles
│   ├── tickets.css             # Tickets page styles
│   ├── profile.css             # Profile page styles
│   ├── admin.css               # Admin panel styles
│   └── GrandEgyptianMuseumTour.jpg  # Background image
└── README.md                   # This file
```

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A backend API server running on `http://localhost:4423`

## 📥 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd grand-egyptian-museum
   ```

2. **Install dependencies** (if using a build system)
   ```bash
   npm install
   ```

3. **Set up the backend**
   - Ensure your backend API is running on `http://localhost:4423`
   - Configure database connections
   - Set up authentication middleware

4. **Configure the application**
   - Update `public/config.js` if your API URL is different
   - Add your background image to `public/GrandEgyptianMuseumTour.jpg`

## ⚙️ Configuration

### API Configuration

Edit `public/config.js` to configure your API endpoints:

```javascript
const API_BASE_URL = 'http://localhost:4423';
```

### API Endpoints Structure

```javascript
API_ENDPOINTS = {
    auth: {
        register: '/api/v1/auth/register',
        login: '/api/v1/auth/login'
    },
    users: {
        profile: '/api/v1/users/profile'
    },
    tours: {
        all: '/api/v1/tours',
        byId: '/api/v1/tours/:id',
        byGuide: '/api/v1/guide/tours'
    },
    bookings: {
        all: '/api/v1/bookings',
        create: '/api/v1/bookings',
        byId: '/api/v1/bookings/:id',
        payCash: '/api/v1/bookings/:id/pay-cash',
        payPoints: '/api/v1/bookings/:id/pay-points'
    },
    reviews: {
        create: '/api/v1/reviews',
        byTour: '/api/v1/tours/:tourId/reviews'
    },
    admin: {
        users: '/api/v1/admin/users',
        tours: '/api/v1/admin/tours',
        home: '/api/v1/admin/home'
    }
}
```

## 🚀 Running the Application

### Development Mode

1. **Start your backend server**
   ```bash
   # In your backend directory
   npm start
   ```

2. **Serve the frontend**
   
   **Option A: Using a simple HTTP server**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Or using Node.js http-server
   npx http-server public -p 8000
   ```

   **Option B: Using Live Server (VS Code)**
   - Install the "Live Server" extension
   - Right-click on `index.html`
   - Select "Open with Live Server"

3. **Access the application**
   - Open your browser and navigate to `http://localhost:8000`

### Production Deployment

1. **Build and optimize**
   - Minify CSS and JavaScript files
   - Optimize images
   - Enable compression

2. **Deploy to web server**
   - Upload all files from the `public` directory
   - Configure web server (Apache, Nginx, etc.)
   - Set up HTTPS

3. **Update API configuration**
   - Change `API_BASE_URL` to your production API URL
   - Configure CORS on your backend

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt-token-here"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### Tours Endpoints

#### Get All Tours
```http
GET /api/v1/tours
```

**Response:**
```json
{
  "tours": [
    {
      "id": "tour-id",
      "name": "Ancient Treasures Tour",
      "guide": "Dr. Sarah Ahmed",
      "duration": "2 hours",
      "language": "English",
      "price": 50,
      "maxCapacity": 20,
      "description": "Explore the ancient treasures..."
    }
  ]
}
```

#### Get Tour by ID
```http
GET /api/v1/tours/:id
```

#### Create Tour (Admin Only)
```http
POST /api/v1/admin/tours
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Tour",
  "guide": "Guide Name",
  "duration": "2 hours",
  "language": "English",
  "price": 50,
  "maxCapacity": 20,
  "description": "Tour description"
}
```

### Bookings Endpoints

#### Create Booking
```http
POST /api/v1/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "tourId": "tour-id",
  "date": "2025-01-15",
  "time": "10:00",
  "numberOfTickets": 2,
  "totalPrice": 100,
  "specialRequests": "Wheelchair accessible",
  "paymentMethod": "cash"
}
```

#### Get User Bookings
```http
GET /api/v1/bookings
Authorization: Bearer {token}
```

#### Cancel Booking
```http
DELETE /api/v1/bookings/:id
Authorization: Bearer {token}
```

### User Profile Endpoints

#### Get Profile
```http
GET /api/v1/users/profile
Authorization: Bearer {token}
```

#### Update Profile
```http
PUT /api/v1/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "+1234567890",
  "country": "Egypt",
  "bio": "Museum enthusiast"
}
```

#### Change Password
```http
PUT /api/v1/users/profile/password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

## 👤 User Guide

### Registration and Login

1. **Register**
   - Click "Login / Sign Up" on the home page
   - Click "Sign up" link
   - Enter your email and password (minimum 6 characters)
   - Click "Sign Up"

2. **Login**
   - Click "Login / Sign Up"
   - Enter your credentials
   - Click "Login"

### Browsing Tours

1. Navigate to the "Virtual Tours" section
2. Use the search bar to find specific tours
3. Filter by guide using the dropdown
4. Click on any tour card to view detailed information
5. Read reviews from other visitors

### Booking a Tour

1. **From Tours Page:**
   - Click "Book This Tour" on any tour card
   - Or click the tour card to view details, then click "Book This Tour"

2. **On Booking Page:**
   - Select your tour (pre-selected if coming from tours page)
   - Choose date and time
   - Enter number of tickets
   - Add any special requests
   - Select payment method (Cash or Points)
   - Review the booking summary
   - Click "Confirm Booking"

### Managing Your Profile

1. Click "My Account" in the header
2. **View Information:**
   - Email, name, phone, country
   - Account statistics (total bookings, upcoming tours, total spent)
3. **Update Profile:**
   - Edit your personal information
   - Click "Update Profile"
4. **Change Password:**
   - Enter current password
   - Enter new password (twice)
   - Click "Change Password"

### Managing Bookings

1. Go to "Book Tickets" page
2. Scroll to "My Bookings" section
3. View all your bookings with status
4. **Update Booking:** Click "Update" button
5. **Cancel Booking:** Click "Cancel" button and confirm

## 👨‍💼 Admin Guide

### Accessing Admin Panel

1. Login with admin credentials
2. Navigate to "Admin Panel" from home page
3. Use the tabbed interface to manage different sections

### Managing Tours

1. **Create New Tour:**
   - Go to "Manage Tours" tab
   - Fill in all required fields:
     - Tour Name
     - Guide Name
     - Duration
     - Language
     - Price
     - Max Capacity
     - Description
   - Click "Create Tour"

2. **Edit Tour:**
   - Click "Edit" on any existing tour
   - Modify the fields
   - Click "Update Tour"

3. **Delete Tour:**
   - Click "Delete" on the tour
   - Confirm the deletion

### Managing Users

1. Go to "Manage Users" tab
2. **Add Admin User:**
   - Enter email and password
   - Select role (Admin, Super Admin, or Moderator)
   - Click "Add Admin"

### Updating Museum Information

1. Go to "Museum Info" tab
2. Update any of the following:
   - Museum Name
   - Description
   - Address
   - Phone
   - Email
   - Website
   - Opening Hours
3. Click "Update Museum Info"

## 🛠️ Technologies Used

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients, transitions, and flexbox/grid
- **JavaScript (ES6+)**: Async/await, fetch API, DOM manipulation
- **Google Fonts**: Cinzel and Inter font families

### Design Features
- Egyptian-themed color scheme (gold, navy, off-white)
- Responsive grid layouts
- CSS animations and transitions
- Modal dialogs
- Form validation

### Backend Requirements
- RESTful API architecture
- JWT authentication
- JSON data format
- CORS enabled

## 📄 File Descriptions

### HTML Files

- **index.html**: Landing page with museum information and navigation
- **login.html**: User login form
- **signup.html**: User registration form
- **tours.html**: Tours listing with search and filter
- **tickets.html**: Booking form and user bookings list
- **profile.html**: User profile management
- **admin.html**: Admin dashboard with tabs

### JavaScript Files

- **config.js**: API configuration and authentication helpers
- **index.js**: Home page initialization
- **login.js**: Login form handling
- **signup.js**: Registration form handling
- **tours.js**: Tours display, filtering, and modal functionality
- **tickets.js**: Booking creation and management
- **profile.js**: Profile viewing and editing
- **admin.js**: Admin operations (CRUD for tours, users)

### CSS Files

- **home.css**: Main stylesheet with theme variables and components
- **style.css**: Form styles for login/signup
- **tours.css**: Tours page specific styles
- **tickets.css**: Booking page styles
- **profile.css**: Profile page styles
- **admin.css**: Admin panel styles

### Key Functions

#### Authentication (config.js)
- `getAuthToken()`: Retrieve stored JWT token
- `setAuthToken(token)`: Store JWT token
- `removeAuthToken()`: Clear JWT token
- `isLoggedIn()`: Check authentication status
- `fetchWithAuth(url, options)`: Fetch with JWT header

#### Tours Management (tours.js)
- `loadTours()`: Fetch and display all tours
- `filterTours()`: Filter tours by search and guide
- `showTourDetails(tour)`: Display tour modal
- `bookTour(tour)`: Redirect to booking with selected tour

#### Booking Management (tickets.js)
- `loadToursForDropdown()`: Populate tour selector
- `updateBookingSummary()`: Calculate and display totals
- `handleBookingSubmit()`: Create new booking
- `loadUserBookings()`: Display user's bookings
- `cancelBooking(id)`: Cancel a booking

#### Profile Management (profile.js)
- `loadUserProfile()`: Fetch and display user data
- `handleUpdateProfile()`: Update user information
- `handleChangePassword()`: Change user password
- `loadAccountStats()`: Display booking statistics

#### Admin Operations (admin.js)
- `handleCreateTour()`: Create new tour
- `editTour(tour)`: Edit existing tour
- `deleteTour(id)`: Delete a tour
- `handleAddAdmin()`: Add new admin user
- `handleUpdateMuseum()`: Update museum information

## 🐛 Troubleshooting

### Common Issues

#### Login Issues
**Problem**: Cannot login / Invalid credentials
**Solution:**
- Verify email format includes "@"
- Check password is at least 6 characters
- Ensure backend server is running
- Check browser console for errors

#### Tours Not Loading
**Problem**: Tours page shows "Loading..." indefinitely
**Solution:**
- Check API endpoint in config.js
- Verify backend is running on correct port
- Check browser console for CORS errors
- Inspect network tab for failed requests

#### Booking Fails
**Problem**: Booking submission fails
**Solution:**
- Ensure you're logged in
- Check all required fields are filled
- Verify date is not in the past
- Check authentication token is valid

#### Admin Panel Access Denied
**Problem**: Cannot access admin panel
**Solution:**
- Verify you're logged in with admin account
- Check JWT token is valid and not expired
- Ensure user has admin role in database

### Browser Compatibility

The application is tested and works on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Network Issues

If experiencing CORS errors:
1. Ensure backend has CORS enabled
2. Add your frontend URL to allowed origins
3. Check backend is sending proper CORS headers

### Local Storage Issues

If authentication isn't persisting:
1. Check browser allows localStorage
2. Clear browser cache and cookies
3. Check for incognito/private mode restrictions

## 🔒 Security Considerations

### Current Implementation
- JWT token storage in localStorage
- Password minimum length validation
- Authentication required for protected routes
- Admin role verification for admin endpoints

### Recommendations for Production
- Use httpOnly cookies instead of localStorage for tokens
- Implement HTTPS
- Add CSRF protection
- Implement rate limiting
- Add input sanitization
- Use environment variables for API URLs
- Implement password strength requirements
- Add two-factor authentication
- Regular security audits

## 🚧 Future Enhancements

- [ ] Payment gateway integration
- [ ] Email notifications for bookings
- [ ] QR code generation for tickets
- [ ] Multi-language support
- [ ] Interactive virtual tour viewer
- [ ] Advanced search with multiple filters
- [ ] User reviews and ratings system
- [ ] Social media integration
- [ ] Mobile app version
- [ ] Analytics dashboard for admins
- [ ] Export booking reports
- [ ] Real-time availability checking
- [ ] Calendar view for bookings
- [ ] Push notifications
- [ ] Progressive Web App (PWA) features

## 📞 Support

For issues, questions, or contributions:
- Create an issue on GitHub
- Contact: support@grandegyptianmuseum.com
- Documentation: [Project Wiki]

## 📜 License

This project is proprietary and confidential. All rights reserved.

---

**Built with ❤️ for the Grand Egyptian Museum**

*Last Updated: December 2025*
