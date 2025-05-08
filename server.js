
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

// MongoDB Connection
let db;

// Connect to MongoDB on startup
const initializeDb = async () => {
  try {
    db = await connectToDatabase();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

// Make db available to all routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Role and firm-based access middleware
const checkAccess = (requiredRoles = [], checkFirmMatch = false) => {
  return (req, res, next) => {
    // Skip role check if no roles required
    if (requiredRoles.length === 0) return next();
    
    const userRole = req.headers['x-user-role'];
    const userId = req.headers['x-user-id'];
    const firmId = req.headers['x-firm-id'];
    
    // Super Admin always has access
    if (userRole === 'superadmin') return next();
    
    // Check if user role is in the required roles list
    if (!requiredRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'You do not have permission to access this resource'
      });
    }
    
    // If firm matching is required, make sure user belongs to the same firm as the resource
    if (checkFirmMatch && req.params.firmId && firmId !== req.params.firmId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have access to resources from other firms'
      });
    }
    
    // Special check for attorneys accessing client data - they must be assigned to the client
    if (userRole === 'attorney' && req.params.clientId) {
      // This would be a database lookup in a real app
      // For now, we'll assume it's passed in the request for simplicity
      const attorneyAssignedClients = req.headers['x-assigned-clients'] ? 
        req.headers['x-assigned-clients'].split(',') : [];
        
      if (!attorneyAssignedClients.includes(req.params.clientId)) {
        return res.status(403).json({
          error: 'Access denied',
          message: 'You are not assigned to this client'
        });
      }
    }
    
    // Special check for clients - they can only access their own data
    if (userRole === 'client' && req.params.clientId && userId !== req.params.clientId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only access your own data'
      });
    }
    
    next();
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
app.use('/api/clients', checkAccess(['admin', 'attorney', 'client'], true), clientRoutes);
app.use('/api/cases', checkAccess(['admin', 'attorney', 'client'], true), caseRoutes);
app.use('/api/medical', checkAccess(['admin', 'attorney'], true), medicalRoutes);
app.use('/api/chatbot', checkAccess(['admin', 'attorney', 'client'], true), chatbotRoutes);
app.use('/api/depositions', checkAccess(['admin', 'attorney'], true), depositionRoutes);
app.use('/api/attorneys', checkAccess(['admin', 'superadmin'], true), attorneyRoutes);
app.use('/api/messages', checkAccess(['admin', 'attorney', 'client'], true), messageRoutes);
app.use('/api/calendar', checkAccess(['admin', 'attorney', 'client'], true), calendarRoutes);
app.use('/api/users', checkAccess(['admin', 'superadmin'], true), userRoutes);

// Super admin specific routes
app.use('/api/firms', checkAccess(['superadmin']), require('./backend/routes/firmRoutes'));
app.use('/api/admins', checkAccess(['superadmin']), require('./backend/routes/adminRoutes'));
app.use('/api/system', checkAccess(['superadmin']), require('./backend/routes/systemRoutes'));

// Special route for document endpoints with more granular control
app.use('/api/documents', (req, res, next) => {
  const userRole = req.headers['x-user-role'];
  const userId = req.headers['x-user-id'];
  const clientId = req.query.clientId || req.body.clientId;
  
  // Super Admin and Firm Admin have full access
  if (userRole === 'superadmin' || userRole === 'admin') {
    return next();
  }
  
  // Attorneys can only access documents of their assigned clients
  if (userRole === 'attorney') {
    // In a real app, this would be a database check
    const attorneyAssignedClients = req.headers['x-assigned-clients'] ? 
      req.headers['x-assigned-clients'].split(',') : [];
    
    if (clientId && !attorneyAssignedClients.includes(clientId)) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'You do not have access to this client\'s documents'
      });
    }
    
    // Attorney has full access to their assigned clients' documents
    return next();
  }
  
  // Clients can only GET (view) and POST (upload) their own documents
  if (userRole === 'client') {
    // Clients can only access their own documents
    if (clientId && clientId !== userId) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'You can only access your own documents'
      });
    }
    
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
    await initializeDb();
    
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
