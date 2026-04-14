# MongoDB Setup Guide for Amravati Transit Backend

## Overview

This backend uses MongoDB for persistent data storage. Follow the steps below to set up MongoDB for local development or use MongoDB Atlas for production.

## Option 1: Local MongoDB Setup (Recommended for Development)

### Prerequisites

- MongoDB Community Edition installed ([Download](https://www.mongodb.com/try/download/community))
- MongoDB running on your system

### Steps

1. **Start MongoDB Service**
   - **Windows**: MongoDB should start automatically with Windows services
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

2. **Verify MongoDB is Running**

   ```bash
   mongosh mongodb://localhost:27017
   ```

   If successful, you'll see the MongoDB shell prompt.

3. **Configure Environment Variables**
   Edit `.env` file in the backend directory:

   ```env
   MONGODB_URI=mongodb://localhost:27017/amravati-transit
   ```

4. **Install Dependencies**

   ```bash
   cd backend
   npm install
   # or
   bun install
   ```

5. **Seed the Database**

   ```bash
   npm run seed
   # or
   bun run seed
   ```

   This will:
   - Connect to MongoDB
   - Clear existing data
   - Insert 3 routes, 22 stops, and 12 buses

6. **Start the Backend Server**

   ```bash
   npm run dev
   # or
   bun --hot src/index.ts
   ```

   Server will start on `http://localhost:5000`

7. **Verify Database Population**

   ```bash
   # In another terminal, connect to MongoDB:
   mongosh mongodb://localhost:27017/amravati-transit

   # View collections:
   show collections

   # Check data:
   db.routes.find()
   db.stops.find()
   db.buses.find()
   ```

## Option 2: MongoDB Atlas (Cloud-Based)

### Prerequisites

- MongoDB Atlas Account ([Create](https://www.mongodb.com/cloud/atlas))
- A project created in Atlas

### Steps

1. **Create MongoDB Cluster**
   - Go to MongoDB Atlas Dashboard
   - Create a new cluster (free tier available)
   - Choose AWS, Google Cloud, or Azure
   - Wait for the cluster to be provisioned

2. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Set username and password (save these)
   - Choose "Password" authentication
   - Click "Add User"

3. **Whitelist IP Address**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Add `0.0.0.0/0` for development (or your IP for production)
   - Confirm

4. **Get Connection String**
   - Go to "Clusters"
   - Click "Connect"
   - Choose "Drivers"
   - Copy the connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/amravati-transit?retryWrites=true&w=majority`

5. **Update Environment Variables**
   Edit `.env` file:

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/amravati-transit?retryWrites=true&w=majority
   ```

6. **Replace Credentials**
   - Replace `username` with your database user
   - Replace `password` with your database password
   - Replace `cluster` with your actual cluster name

7. **Install Dependencies**

   ```bash
   cd backend
   npm install
   # or
   bun install
   ```

8. **Seed the Database**

   ```bash
   npm run seed
   # or
   bun run seed
   ```

9. **Start the Backend Server**
   ```bash
   npm run dev
   # or
   bun --hot src/index.ts
   ```

## Testing the API

Once the server is running, test the endpoints:

```bash
# Get all routes
curl http://localhost:5000/api/routes

# Get all buses
curl http://localhost:5000/api/buses

# Get all stops
curl http://localhost:5000/api/stops

# Get bus statistics
curl http://localhost:5000/api/buses/stats

# Search stops
curl "http://localhost:5000/api/stops/search?q=market"
```

## Troubleshooting

### MongoDB Connection Errors

**Error: "connect ECONNREFUSED 127.0.0.1:27017"**

- MongoDB is not running
- Start MongoDB service on your system
- Verify with `mongosh`

**Error: "authentication failed"**

- Check username and password in MONGODB_URI
- Verify IP whitelist on MongoDB Atlas (if using cloud)
- Ensure user has correct permissions

### Seed Script Issues

**Error: "connection timed out"**

- Internet connection issue
- MongoDB Atlas network connectivity problem
- Check IP whitelist (Atlas)

**Error: "duplicate key error"**

- Database not cleared properly
- Run `npm run seed` again (it clears the database first)

### Port Already in Use

If port 5000 is already in use:

1. Edit `.env` and change PORT to another value (e.g., 5001)
2. Restart the server

## Database Schema

### Routes Collection

```javascript
{
  id: String,
  name: String,
  from: String,
  to: String,
  distance: String,
  frequency: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Stops Collection

```javascript
{
  id: String,
  name: String,
  latitude: Number,
  longitude: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Buses Collection

```javascript
{
  id: String,
  number: Number,
  routeId: String,
  status: String, // "on-time" | "delayed" | "at-stop"
  nextStop: String,
  nextStopEta: Number,
  latitude: Number,
  longitude: Number,
  speed: Number,
  passengers: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Additional Commands

```bash
# Build for production
npm run build

# Run production build
npm start

# Run linter
npm run lint

# Re-seed the database
npm run seed
```

## Next Steps

1. The backend is now connected to MongoDB
2. All API endpoints use the database instead of mock data
3. The frontend can connect and fetch real data
4. Data persists between server restarts
5. You can add more endpoints for CRUD operations (Create, Update, Delete)

## References

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas Tutorial](https://docs.atlas.mongodb.com/tutorial/deploy-your-cluster/)
