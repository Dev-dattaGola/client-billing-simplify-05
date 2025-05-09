
# Deployment Guide

## Project Structure

The LYZ Law Firm application is organized with a clear separation of frontend and backend code:

- `/src/frontend` - Contains all frontend React components and logic
- `/src/backend` - Contains all backend server code, routes, and controllers

## Deployment Options

### Option 1: Full-Stack Deployment (Recommended)

For services like Render, Heroku, or similar:

1. Deploy the root project directory
2. Set the build command in your deployment platform:
   ```
   npm run build
   ```
3. Set the start command:
   ```
   npm run start
   ```
4. Set any required environment variables (see .env.example)

### Option 2: Separate Deployments

#### Backend Deployment
1. Deploy the backend code
2. Set the start command:
   ```
   node src/backend/server.js
   ```
3. Set required backend environment variables

#### Frontend Deployment
1. Build the frontend:
   ```
   npm run build
   ```
2. Deploy the generated `dist` directory to a static hosting service like Netlify, Vercel, etc.
3. Configure the frontend to point to your backend API url

## Environment Variables

See `.env.example` for required environment variables.

## Database Setup

This application uses MongoDB. Make sure to set up your database and provide the connection string in your environment variables.

## Production Considerations

- Enable CORS protection for your specific domains
- Set up proper security headers
- Configure rate limiting for API endpoints
- Set up monitoring and logging
