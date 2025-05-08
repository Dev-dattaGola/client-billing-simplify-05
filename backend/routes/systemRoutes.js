
const express = require('express');
const router = express.Router();

// Get system stats
router.get('/stats', async (req, res) => {
  try {
    const db = req.db;
    
    const firmCount = await db.collection('firms').countDocuments();
    const adminCount = await db.collection('users').countDocuments({ role: 'admin' });
    const attorneyCount = await db.collection('users').countDocuments({ role: 'attorney' });
    const clientCount = await db.collection('users').countDocuments({ role: 'client' });
    
    res.json({
      firms: firmCount,
      admins: adminCount,
      attorneys: attorneyCount,
      clients: clientCount,
      systemHealth: 'Good',
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching system stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get activity logs
router.get('/logs', async (req, res) => {
  try {
    const db = req.db;
    const logs = await db.collection('activity_logs').find({})
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();
    
    res.json(logs);
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a activity log entry
router.post('/logs', async (req, res) => {
  try {
    const db = req.db;
    const { action, details } = req.body;
    
    const newLog = {
      userId: req.headers['x-user-id'] || 'system',
      userRole: req.headers['x-user-role'] || 'system',
      action,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: req.ip
    };
    
    await db.collection('activity_logs').insertOne(newLog);
    res.status(201).json(newLog);
  } catch (error) {
    console.error('Error creating log entry:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get system settings
router.get('/settings', async (req, res) => {
  try {
    const db = req.db;
    const settings = await db.collection('system_settings').findOne({ id: 'global' }) || {
      id: 'global',
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true
      },
      sessionTimeout: 60, // minutes
      loginAttempts: 5,
      emailNotifications: true
    };
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching system settings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update system settings
router.put('/settings', async (req, res) => {
  try {
    const db = req.db;
    const settings = req.body;
    
    const result = await db.collection('system_settings').updateOne(
      { id: 'global' },
      { $set: { ...settings, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
    
    const updatedSettings = await db.collection('system_settings').findOne({ id: 'global' });
    res.json(updatedSettings);
  } catch (error) {
    console.error('Error updating system settings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
