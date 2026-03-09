# 🏛️ Banquet Hall Booking System

A full-stack web application for managing banquet hall bookings with multi-level admin approval, invoice generation, and comprehensive reporting features.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Booking Workflow](#booking-workflow)
- [License](#license)

## ✨ Features

### User Features
- **User Authentication**: Register, login, and secure JWT-based authentication
- **Hall Gallery**: Browse available banquet halls with images and 360° virtual tours
- **Booking Management**: Create and manage bookings with real-time status tracking
- **Invoice Access**: View and download invoices in PDF format
- **Booking Status Tracking**: Monitor booking progress through approval stages

### Admin Features
- **Multi-level Approval System**: Three-tier admin approval workflow
- **Booking Review**: Review, approve, reject, or request changes for bookings
- **Payment Management**: Track and confirm payment status
- **Hall Availability Check**: Prevent double bookings with automatic availability validation
- **Reports & Analytics**: Generate comprehensive booking and revenue reports
- **Invoice Generation**: Automatic PDF invoice generation for confirmed bookings

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **PDF Generation**: PDFKit
- **Development**: Nodemon

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite (Rolldown)
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Styling**: CSS3
- **Linting**: ESLint

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**
- **Git** (optional, for cloning)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "banquet hall booking system"
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/banquet-hall-booking

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration (optional)
CORS_ORIGIN=http://localhost:5173
```

### Frontend Configuration

The frontend is configured to connect to `http://localhost:5000` by default. If your backend runs on a different port, update the base URL in `frontend/src/api/axios.js`.

## 🏃 Running the Application

### 1. Start MongoDB

Ensure MongoDB is running on your system:

```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

### 2. Run Backend Setup (First Time Only)

```bash
cd backend
npm run setup
```

This will create the database and seed initial data if configured.

### 3. Start the Backend Server

```bash
cd backend
npm run dev
```

The backend server will start at: **http://localhost:5000**

### 4. Start the Frontend Development Server

Open a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will start at: **http://localhost:5173**

### 5. Access the Application

Open your browser and navigate to: **http://localhost:5173**

## 📁 Project Structure

```
banquet-hall-booking-system/
├── backend/
│   ├── src/
│   │   ├── app.js                  # Express app configuration
│   │   ├── server.js               # Server entry point
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── constants/
│   │   │   └── bookingStatus.js   # Booking status constants
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT authentication
│   │   │   └── rbac.js            # Role-based access control
│   │   ├── models/
│   │   │   ├── User.js            # User model
│   │   │   ├── Hall.js            # Hall model
│   │   │   ├── Booking.js         # Booking model
│   │   │   └── Invoice.js         # Invoice model
│   │   ├── routes/
│   │   │   ├── auth.routes.js     # Authentication routes
│   │   │   ├── admin.routes.js    # Admin routes
│   │   │   ├── booking.routes.js  # Booking routes
│   │   │   ├── invoice.routes.js  # Invoice routes
│   │   │   └── reports.routes.js  # Reports routes
│   │   └── utils/
│   │       ├── bookingTransitions.js
│   │       ├── canTransition.js
│   │       ├── checkHallAvailability.js
│   │       ├── createInvoice.js
│   │       └── generateInvoicePDF.js
│   ├── package.json
│   └── setup.js
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx               # App entry point
│   │   ├── App.jsx                # Main app component
│   │   ├── api/
│   │   │   ├── axios.js           # Axios configuration
│   │   │   ├── auth.api.js        # Auth API calls
│   │   │   ├── booking.api.js     # Booking API calls
│   │   │   ├── invoice.api.js     # Invoice API calls
│   │   │   └── report.api.js      # Report API calls
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── BookingStatusBadge.jsx
│   │   │   └── Hall360View.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Authentication context
│   │   └── pages/
│   │       ├── auth/
│   │       │   ├── Login.jsx
│   │       │   └── Register.jsx
│   │       ├── admin/
│   │       │   ├── AdminDashboard.jsx
│   │       │   ├── BookingReview.jsx
│   │       │   └── Reports.jsx
│   │       └── user/
│   │           ├── HallGallery.jsx
│   │           ├── CreateBooking.jsx
│   │           ├── MyBookings.jsx
│   │           └── MyInvoices.jsx
│   ├── package.json
│   └── vite.config.js
│
├── START.md                        # Quick start guide
└── README.md                       # This file
```

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Booking Endpoints
- `GET /bookings` - Get all bookings (user's own bookings)
- `POST /bookings` - Create a new booking
- `GET /bookings/:id` - Get booking details
- `PATCH /bookings/:id/status` - Update booking status

### Admin Endpoints
- `GET /admin/bookings` - Get all bookings (admin view)
- `PATCH /admin/bookings/:id/review` - Review booking
- `GET /admin/halls` - Manage halls

### Invoice Endpoints
- `GET /invoices` - Get user invoices
- `GET /invoices/:id` - Get specific invoice
- `GET /invoices/:id/download` - Download invoice PDF

### Reports Endpoints
- `GET /reports/bookings` - Get booking reports
- `GET /reports/revenue` - Get revenue reports

## 👥 User Roles

### User (Customer)
- Register and login
- Browse halls
- Create bookings
- View booking status
- Access invoices

### Admin
- All user permissions
- Review bookings
- Multi-level approval
- Manage halls
- Generate reports
- Manage payments

## 🔄 Booking Workflow

The booking system follows a multi-stage approval process:

1. **ACTION_PENDING** - Initial booking created, awaiting first admin review
2. **CHANGE_REQUESTED** - Admin requested changes from user
3. **REJECTED** - Booking rejected by admin
4. **ADMIN1_APPROVED** - First level admin approval
5. **PAYMENT_REQUESTED** - Payment requested from user
6. **PAYMENT_COMPLETED** - Payment confirmed by user
7. **ADMIN2_APPROVED** - Second level admin approval
8. **ADMIN3_APPROVED** - Final approval, booking confirmed

## 🧪 Testing

### Create Admin User

For first-time setup, you need to create an admin user. You can do this by:

1. Register as a normal user through the UI
2. Update the user's role in MongoDB:

```javascript
// Using MongoDB Compass or CLI
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
);
```

Or manually insert an admin user:

```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@test.com",
  password: "$2a$10$yourHashedPasswordHere",
  phone: "1234567890",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
});
```

## 📝 Development Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run setup` - Run setup script

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Your Name

## 📞 Support

For support, email support@example.com or create an issue in the repository.

---

**Happy Booking! 🎉**
