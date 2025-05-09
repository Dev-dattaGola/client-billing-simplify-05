
const express = require('express');
const mongoose = require('mongodb');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const clientRoutes = require('./routes/clientRoutes');
const adminRoutes = require('./routes/adminRoutes');
const firmRoutes = require('./routes/firmRoutes');
const systemRoutes = require('./routes/systemRoutes');

// Use routes
app.use('/api/clients', clientRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/firms', firmRoutes);
app.use('/api/system', systemRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../', 'dist', 'index.html'));
  });
}

// Initialize server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
