
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectToDatabase, closeConnection } = require('./backend/config/database');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Role-based access middleware
const checkUserRole = (requiredRoles = []) => {
  return (req, res, next) => {
    // Skip role check if no roles required
    if (requiredRoles.length === 0) return next();
    
    const userRole = req.headers['x-user-role'];
    
    // Admin always has access
    if (userRole === 'admin') return next();
    
    // Check if user role is in the required roles list
    if (requiredRoles.includes(userRole)) {
      return next();
    }
    
    // Access denied
    return res.status(403).json({ 
      error: 'Access denied',
      message: 'You do not have permission to access this resource'
    });
  };
};

// Import route files
const { 
  clientRoutes, 
  caseRoutes, 
  medicalRoutes,
  chatbotRoutes,
  depositionRoutes,
  attorneyRoutes,
  messageRoutes,
  calendarRoutes,
  userRoutes
} = require('./backend/routes');

// API Routes with role-based access
app.use('/api/clients', checkUserRole(['admin', 'attorney']), clientRoutes);
app.use('/api/cases', checkUserRole(['admin', 'attorney']), caseRoutes);
app.use('/api/medical', checkUserRole(['admin', 'attorney']), medicalRoutes);
app.use('/api/chatbot', checkUserRole(['admin', 'attorney', 'client']), chatbotRoutes);
app.use('/api/depositions', checkUserRole(['admin', 'attorney']), depositionRoutes);
app.use('/api/attorneys', checkUserRole(['admin']), attorneyRoutes);
app.use('/api/messages', checkUserRole(['admin', 'attorney', 'client']), messageRoutes);
app.use('/api/calendar', checkUserRole(['admin', 'attorney', 'client']), calendarRoutes);
app.use('/api/users', checkUserRole(['admin']), userRoutes);

// Special route for document endpoints with more granular control
app.use('/api/documents', (req, res, next) => {
  const userRole = req.headers['x-user-role'];
  
  // Admin and attorneys have full access
  if (userRole === 'admin' || userRole === 'attorney') {
    return next();
  }
  
  // Clients can only GET (view) and POST (upload)
  if (userRole === 'client') {
    if (req.method === 'GET' || req.method === 'POST') {
      return next();
    }
    
    // Block other methods for clients
    return res.status(403).json({ 
      error: 'Access denied',
      message: 'You do not have permission to perform this action'
    });
  }
  
  // Deny access to other roles
  return res.status(403).json({ 
    error: 'Access denied',
    message: 'You do not have permission to access documents'
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

// Setup graceful shutdown
process.on('SIGINT', async () => {
  console.log('Closing MongoDB connection due to application termination');
  await closeConnection();
  process.exit(0);
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB when server starts
    await connectToDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app; // Export for testing
