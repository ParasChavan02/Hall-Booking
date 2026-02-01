# Banquet Hall Booking System - Integration Guide

## Prerequisites
- Node.js installed
- MongoDB installed and running
- Git Bash or PowerShell

## Quick Start

### 1. Start MongoDB
Open a terminal and run:
```bash
mongod
```

### 2. Start Backend Server
Open a new terminal in the project root:
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:5000

### 3. Start Frontend Server
Open another terminal in the project root:
```bash
cd frontend
npm run dev
```
Frontend will run on: http://localhost:5173

## Testing the Application

### Create Admin User (First Time Setup)
You need to create an admin user manually in MongoDB or via a registration and then update the role.

**Option 1: Use MongoDB Compass or CLI**
```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@test.com",
  password: "$2a$10$ZqX5Z5Z5Z5Z5Z5Z5Z5Z5Z.Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5", // password: admin123
  phone: "1234567890",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
});
```

**Option 2: Register as user and update role**
1. Register via the frontend at http://localhost:5173/register
2. Update the user role in MongoDB:
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
);
```

### Create Sample Halls
```javascript
db.halls.insertMany([
  {
    name: "Grand Ballroom",
    capacity: 500,
    amenities: ["Stage", "Sound System", "AC", "Projector"],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Crystal Hall",
    capacity: 200,
    amenities: ["AC", "Tables", "Chairs"],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Garden Venue",
    capacity: 300,
    amenities: ["Open Air", "Lighting", "Parking"],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);
```

## User Flow

### For Regular Users:
1. Visit http://localhost:5173
2. Click "Register" and create an account
3. Login with your credentials
4. Navigate to "Create Booking"
5. Fill in the booking details and submit
6. View your bookings in "My Bookings"
7. When payment is requested, mark it as complete
8. View invoices in "My Invoices"

### For Admin Users:
1. Login with admin credentials
2. View dashboard statistics
3. Navigate to "Review Bookings"
4. Filter bookings by status
5. Approve/Reject bookings through the workflow:
   - ACTION_PENDING → ADMIN1_APPROVED
   - ADMIN1_APPROVED → PAYMENT_REQUESTED
   - PAYMENT_COMPLETED → ADMIN2_APPROVED
   - ADMIN2_APPROVED → ADMIN3_APPROVED
6. View reports and analytics in "Reports"

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

### Bookings (User)
- POST /api/bookings - Create new booking
- GET /api/bookings/my - Get user's bookings
- POST /api/bookings/:id/status - Update booking status

### Bookings (Admin)
- GET /api/bookings - Get all bookings

### Admin
- GET /api/admin/halls - Get all halls
- POST /api/admin/halls - Create new hall

### Invoices
- GET /api/invoices/my - Get user's invoices
- GET /api/invoices/download/:bookingId - Download invoice PDF

### Reports (Admin)
- GET /api/reports/revenue - Get revenue report
- GET /api/reports/booking-status - Get booking statistics

## Troubleshooting

### Backend Issues
- **MongoDB connection error**: Make sure MongoDB is running
- **Port already in use**: Change PORT in backend/.env
- **JWT errors**: Check JWT_SECRET in backend/.env

### Frontend Issues
- **API connection refused**: Make sure backend is running on port 5000
- **CORS errors**: Backend already has CORS enabled
- **Routes not working**: Check that react-router-dom is installed

### Common Issues
- **No halls showing**: Add halls to MongoDB using the script above
- **Can't login**: Check user exists in database with correct password
- **Invoice not generating**: Check booking has totalAmount set

## Project Structure

```
banquet-hall-booking-system/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── constants/      # Booking status constants
│   │   ├── middleware/     # Auth & RBAC middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper functions
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Server entry point
│   ├── .env               # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/           # API calls
    │   ├── components/    # React components
    │   ├── context/       # React context
    │   ├── pages/         # Page components
    │   ├── App.jsx        # Main app component
    │   └── main.jsx       # Entry point
    └── package.json
```

## Features Implemented

✅ User authentication (register/login)
✅ Role-based access control (user/admin)
✅ Booking creation and management
✅ Multi-level booking approval workflow
✅ Payment tracking
✅ Invoice generation with PDF download
✅ Admin dashboard with statistics
✅ Reports and analytics
✅ Hall availability checking
✅ Responsive UI design

## Notes
- Default admin password needs to be hashed using bcrypt
- MongoDB must be running before starting the backend
- Frontend runs on port 5173 (Vite default)
- Backend runs on port 5000
- All API calls are proxied to avoid CORS issues
