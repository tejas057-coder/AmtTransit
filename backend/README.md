# Amravati Transit Backend API

Backend API service for the Amravati Transit Bus Tracking System built with Node.js, Express, and TypeScript.

## 🚀 Features

- **Route Management** - Retrieve all routes and route details
- **Bus Tracking** - Real-time bus location, status, and ETA data
- **Stop Information** - Stop locations and buses at each stop
- **Statistics** - Bus statistics and fleet information
- **CORS Enabled** - Configured for frontend integration
- **Type-Safe** - Full TypeScript support

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🔧 Installation

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

4. Update `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:8082
```

## 🏃 Running the Server

### Development Mode

```bash
npm run dev
```

The server will start with hot-reload on `http://localhost:5000`

### Production Build

```bash
npm run build
npm start
```

## 📡 API Endpoints

### Routes

- `GET /api/routes` - Get all routes
- `GET /api/routes/:id` - Get single route by ID
- `GET /api/routes/:id/buses` - Get all buses on a specific route

### Buses

- `GET /api/buses` - Get all buses
  - Query params: `?routeId=xxx` (filter by route), `?status=on-time|delayed|at-stop` (filter by status)
- `GET /api/buses/:id` - Get single bus by ID
- `GET /api/buses/stats` - Get fleet statistics

### Stops

- `GET /api/stops` - Get all stops
- `GET /api/stops/:id` - Get single stop by ID
- `GET /api/stops/search?q=xxx` - Search stops by name

### Health Check

- `GET /health` - Server health status

## 📊 Data Models

### Route

```typescript
{
  id: string;
  name: string;
  from: string;
  to: string;
  distance: string;
  frequency: string;
}
```

### Bus

```typescript
{
  id: string;
  number: number;
  routeId: string;
  status: "on-time" | "delayed" | "at-stop";
  nextStop: string;
  nextStopEta: number; // minutes
  latitude: number;
  longitude: number;
  speed: number; // km/h
  passengers: number;
}
```

### Stop

```typescript
{
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}
```

## 📝 Example Requests

### Get All Routes

```bash
curl http://localhost:5000/api/routes
```

### Get Buses on Route 1

```bash
curl 'http://localhost:5000/api/buses?routeId=route-001'
```

### Get Delayed Buses

```bash
curl 'http://localhost:5000/api/buses?status=delayed'
```

### Search for Stops

```bash
curl 'http://localhost:5000/api/stops/search?q=Market'
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── controllers/       # Business logic
│   │   ├── routeController.ts
│   │   ├── busController.ts
│   │   └── stopController.ts
│   ├── routes/           # API route definitions
│   │   ├── routesRoute.ts
│   │   ├── busesRoute.ts
│   │   └── stopsRoute.ts
│   ├── data/             # Mock data
│   │   └── mockData.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   └── index.ts          # Main server file
├── dist/                 # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## 🔄 Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {
    /* response data */
  },
  "timestamp": "2024-04-14T10:30:00.000Z"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2024-04-14T10:30:00.000Z"
}
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. Create controller in `src/controllers/`
2. Create routes in `src/routes/`
3. Import and register routes in `src/index.ts`
4. Add TypeScript types to `src/types/index.ts`

## 📦 Dependencies

- **express** - Web framework
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment variables
- **typescript** - Type safety
- **tsx** - TypeScript executor for development

## 🚀 Future Enhancements

- WebSocket support for real-time updates
- Database integration (MongoDB/PostgreSQL)
- Authentication/Authorization
- Rate limiting
- Caching strategies
- WebSocket real-time bus tracking
- Advanced filtering and search

## 📄 License

MIT

## 👤 Author

Amravati Transit Team
