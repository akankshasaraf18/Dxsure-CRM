# Dxsure-CRM

## Project Title and Description
Dxsure-CRM is a full-stack customer relationship management system designed to help teams manage employees, clients, vendors, petty cash, and client payments from a centralized platform. The project is split into a React frontend and an Express/MongoDB backend, making it suitable for internal business operations and workflow tracking.

## Features
- Secure authentication with login and registration
- Role-based access for admin and employee users
- Employee management
- Client management
- Vendor management
- Petty cash tracking
- Client payment entry and management
- Dashboard-based navigation for different user roles
- Protected routes and token-based session handling

## Tech Stack
- Frontend: React, React Router, Axios, CSS
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Authentication: JSON Web Token (JWT), bcryptjs
- Tooling: React Scripts, Nodemon

## Folder Structure
```text
Dxsure-CRM/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── clientController.js
│   │   ├── clientPaymentController.js
│   │   ├── employeeController.js
│   │   ├── pettyCashController.js
│   │   └── vendorController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   ├── Client.js
│   │   ├── ClientPayment.js
│   │   ├── Employee.js
│   │   ├── PettyCash.js
│   │   ├── User.js
│   │   └── Vendor.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── clientPaymentRoutes.js
│   │   ├── clientRoutes.js
│   │   ├── employeeRoutes.js
│   │   ├── pettyCashRoutes.js
│   │   └── vendorRoutes.js
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   └── src/
│       ├── api/
│       │   └── axios.js
│       ├── App.css
│       ├── App.js
│       ├── App.test.js
│       ├── components/
│       │   ├── EmployeeSidebar.css
│       │   ├── EmployeeSidebar.js
│       │   ├── Navbar.css
│       │   ├── Navbar.js
│       │   ├── Sidebar.css
│       │   └── Sidebar.js
│       ├── index.css
│       ├── index.js
│       ├── pages/
│       │   ├── AdminDashboard.css
│       │   ├── AdminDashboard.js
│       │   ├── EmployeeDashboard.css
│       │   ├── EmployeeDashboard.js
│       │   ├── Login.css
│       │   ├── Login.js
│       │   ├── Register.css
│       │   ├── Register.js
│       │   ├── employee/
│       │   │   ├── EmployeeDashboard.css
│       │   │   ├── EmployeeDashboard.js
│       │   │   └── EmployeeProfile.js
│       │   ├── admin/
│       │   │   ├── ClientPaymentEntry.css
│       │   │   ├── ClientPaymentEntry.js
│       │   │   ├── CreateClient.css
│       │   │   ├── CreateClient.js
│       │   │   ├── CreateEmployee.css
│       │   │   ├── CreateEmployee.js
│       │   │   ├── CreateVendor.css
│       │   │   ├── CreateVendor.js
│       │   │   ├── ManageClientPayments.css
│       │   │   ├── ManageClientPayments.js
│       │   │   ├── ManageClients.css
│       │   │   ├── ManageClients.js
│       │   │   ├── ManageEmployees.css
│       │   │   ├── ManageEmployees.js
│       │   │   ├── ManagePettyCash.css
│       │   │   ├── ManagePettyCash.js
│       │   │   ├── ManageVendors.css
│       │   │   ├── ManageVendors.js
│       │   │   ├── PettyCashEntry.css
│       │   │   └── PettyCashEntry.js
│       │   ├── rest.css
│       │   └── rest.html
│       ├── reportWebVitals.js
│       ├── routes/
│       │   └── ProtectedRoute.js
│       └── setupTests.js
└── README.md
```

## How to Run Locally
### Prerequisites
- Node.js and npm installed
- MongoDB running locally

### Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   node server.js
   ```
   The backend runs on port `5000` and connects to MongoDB at `mongodb://127.0.0.1:27017/dxsurecrm`.

### Frontend Setup
1. Open a second terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm start
   ```
   The frontend runs on port `3000`.

### Application URLs
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## Contributing
Contributions are welcome. If you would like to improve Dxsure-CRM, please follow these steps:

1. Fork the repository.
2. Create a new branch for your changes.
3. Make your updates and test them locally.
4. Commit your changes with clear messages.
5. Open a pull request for review.

Please keep contributions focused, readable, and consistent with the existing project structure.
