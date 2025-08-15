# Menix Backend

This is the backend server for the Menix BGMI Tournament App, designed to be deployed on Vercel with MongoDB Atlas integration.

## Features

- **Dual Authentication**: Supports both MongoDB Atlas and JSON file-based authentication
- **Tournament Management**: CRUD operations for tournaments and team registrations
- **User Management**: User registration, login, and profile management
- **CORS Enabled**: Configured for production use

## Deployment

### 1. Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy from the backend directory:
   ```bash
   cd backend
   vercel
   ```

3. Follow the prompts to configure your project

### 2. MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster
2. Get your connection string
3. Set environment variables in Vercel:
   - `MONGODB_URI`: Your MongoDB Atlas connection string

### 3. Environment Variables

Set these in your Vercel project settings:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
NODE_ENV=production
```

## API Endpoints

### Authentication
- `POST /login` - JSON file-based login
- `POST /api/login` - MongoDB Atlas login
- `POST /register` - User registration
- `GET /user/:id` - Get user by ID

### Tournaments
- `GET /tournaments` - Get all tournaments
- `POST /tournaments` - Create new tournament
- `POST /tournaments/:id/register` - Register team for tournament

### Health Check
- `GET /health` - Server health status

## File Structure

```
backend/
├── server.js          # Main server file
├── vercel.json        # Vercel configuration
├── package.json       # Dependencies
├── users.json         # User data (JSON fallback)
├── tournaments.json   # Tournament data (JSON fallback)
└── README.md          # This file
```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Server will run on `http://localhost:5000`

## Production Notes

- The server automatically handles both MongoDB Atlas and JSON file operations
- CORS is configured for production use
- All endpoints are properly routed through Vercel
- Health check endpoint for monitoring

## Troubleshooting

### CORS Issues
- Ensure your frontend domain is allowed in CORS settings
- Check Vercel deployment logs for any errors

### MongoDB Connection
- Verify your MongoDB Atlas connection string
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure your database user has proper permissions

### File Operations
- JSON files are read-only in production (Vercel)
- Use MongoDB Atlas for production data storage
- JSON files serve as fallback/initial data 