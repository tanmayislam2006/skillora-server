git remote -# Skillora Server

Skillora Server is a Node.js/Express backend for managing users, services, and bookings for a service marketplace platform. It uses MongoDB for data storage and Firebase Admin for authentication.

## Features
- User registration and login (with Firebase authentication)
- Add, update, and delete services
- Search and filter services by name
- Book services and manage bookings
- View bookings by user or service
- Update booking status
- Secure endpoints with Firebase token verification

## Endpoints

### Authentication

- `POST /register`  
  Register a new user.

- `PATCH /login`  
  Update user's last sign-in time.

### Services

- `GET /allServices?serviceName=...`  
  Get all services, optionally filter by name.

- `GET /service/:id`  
  Get a single service by ID.

- `POST /addService`  
  Add a new service (requires authentication).

- `PUT /updateService/:id`  
  Update a service by ID (requires authentication).

- `DELETE /deleteService/:id`  
  Delete a service by ID (requires authentication).

### Bookings

- `POST /purchaseServices`  
  Book a service (requires authentication).

- `GET /purchaseService/:uid`  
  Get all bookings for a user (requires authentication).

- `GET /customerBooked/:serviceId`  
  Get all bookings for a specific service (requires authentication).  
  Optional query: `serviceDate=YYYY-MM-DD`

- `GET /schedule/:uid?serviceDate=YYYY-MM-DD`  
  Get all bookings for services published by a user, optionally filter by date (requires authentication).

- `PUT /updateServiceStatus/:id`  
  Update the status of a booking (requires authentication).

### User Services

- `GET /user/:uid`  
  Get user information (requires authentication).

- `GET /userService/:uid`  
  Get all services published by a user, including booking count (requires authentication).

## Environment Variables

Create a `.env` file in the root directory with:

```
DB_USER=your_mongodb_user
DB_PASSWORD=your_mongodb_password
```

## Firebase Admin Setup

- Place your Firebase Admin SDK JSON file as `firebaseAdmin.json` in the root directory.

## Running Locally

1. Install dependencies:
   ```
   npm install
   ```
2. Start the server:
   ```
   node index.js
   ```
3. The server will run at [http://localhost:5000](http://localhost:5000)

## Deployment

- Make sure your environment variables and