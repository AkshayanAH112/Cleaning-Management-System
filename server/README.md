# Cleaning Management System – Server

This is the backend for the Cleaning Management System, built with Node.js, Express, and MongoDB.

## Features

- RESTful API for services, bookings, users, and authentication
- JWT-based authentication
- Role-based access for admin and users

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

```sh
npm install
```

### Environment Variables

Create a `.env` file in the `server/` directory:

```
MONGO_URI=mongodb://localhost:27017/cleaningdb
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Running the Server

```sh
node index.js
```

The API will be available at [http://localhost:5000](http://localhost:5000).

## Project Structure

```
server/
├── models/
├── routes/
├── middleware/
├── index.js
├── package.json
└── ...
```

## API Endpoints

- `/api/auth` – Authentication routes
- `/api/services` – Services management
- `/api/bookings` – Bookings management
- `/api/admin` – Admin-only routes


