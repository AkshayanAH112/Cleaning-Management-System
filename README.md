# Cleaning Management System

A modern web application for booking and managing cleaning services. Built with React, Node.js, Express, and MongoDB, featuring a clean UI with Tailwind CSS and Material UI icons.

## Features

- **User Portal**: Book cleaning services, view and manage your bookings, and contact support.
- **Admin Dashboard**: Manage users, services, and bookings with advanced controls.
- **Responsive UI**: Clean, modern, and mobile-friendly interface.
- **Authentication**: Secure login and role-based access (admin/user).
- **Pagination**: Easily navigate large booking tables.
- **API Integration**: Communicates with a RESTful backend for all operations.

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd Cleaning Management System
   ```
2. **Install dependencies:**
   - For the frontend:
     ```sh
     cd client
     npm install
     ```
   - For the backend:
     ```sh
     cd ../server
     npm install
     ```
3. **Set up environment variables:**
   - Create a `.env` file in the `server` folder. Example:
     ```env
     MONGO_URI=mongodb://localhost:27017/cleaning
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```

### Running the Application

1. **Start the backend:**
   ```sh
   cd server
   npm start
   ```
2. **Start the frontend:**
   ```sh
   cd client
   npm start
   ```
3. **Access the app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

## Folder Structure

```
Cleaning Management System/
├── client/        # React frontend
│   ├── src/
│   └── ...
├── server/        # Express backend
│   ├── models/
│   ├── routes/
│   └── ...
└── README.md
```

## Automated Code Cleanup

- Unused variables and imports have been removed across all client code.
- All files have been linted and auto-fixed for code style and best practices.
- Folder structure has been reviewed for logical organization (see below).
- No unused or leftover Vite/React template files remain.

### Recommended Folder Structure

```
src/
├── assets/                # Images, logos, etc.
├── components/
│   ├── admin/             # Admin-only components (BookingTable, ServiceTable, etc.)
│   ├── columns/           # Table column definitions
│   ├── ui/                # Generic UI components (Input, Select)
│   ├── AuthPage.jsx
│   ├── DataTable.jsx
│   ├── Navbar.jsx
├── lib/
│   └── utils.js           # Utility functions
├── pages/                 # Route-level pages
│   ├── AboutUs.jsx
│   ├── AdminDashboard.jsx
│   ├── AdminPage.jsx
│   ├── BookingForm.jsx
│   ├── ContactUs.jsx
│   ├── Dashboard.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── NotFound.jsx
│   ├── Register.jsx
│   ├── Services.jsx
│   └── ServicesAdmin.jsx
├── App.jsx
├── App.css
├── index.css
├── main.jsx
```

All code is now clean, well-structured, and free of unused variables and files. For further custom cleanup or structure changes, just ask!

## Customization
- **Services, About, Contact Pages**: Easily editable in `client/src/pages/`.
- **Styling**: Uses Tailwind CSS and Material UI for rapid UI changes.
- **Environment**: Update `.env` for database and JWT configuration.

## Credits
- UI: Tailwind CSS, Material UI
- Icons: Material UI Icons
- Backend: Express, MongoDB