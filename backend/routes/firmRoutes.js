
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Get all firms
router.get('/', async (req, res) => {
  try {
    const db = req.db;
    const firms = await db.collection('firms').find({}).toArray();
    res.json(firms);
  } catch (error) {
    console.error('Error fetching firms:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a single firm by ID
router.get('/:id', async (req, res) => {
  try {
    const db = req.db;
    const firm = await db.collection('firms').findOne({ id: req.params.id });
    
    if (!firm) {
      return res.status(404).json({ message: 'Firm not found' });
    }
    
    res.json(firm);
  } catch (error) {
    console.error('Error fetching firm:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new firm
router.post('/', async (req, res) => {
  try {
    const db = req.db;
    
    const newFirm = {
      ...req.body,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      createdBy: req.headers['x-user-id'] || 'system'
    };
    
    await db.collection('firms').insertOne(newFirm);
    res.status(201).json(newFirm);
  } catch (error) {
    console.error('Error creating firm:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update an existing firm
router.put('/:id', async (req, res) => {
  try {
    const db = req.db;
    const updatedData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    const result = await db.collection('firms').updateOne(
      { id: req.params.id },
      { $set: updatedData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Firm not found' });
    }
    
    const updatedFirm = await db.collection('firms').findOne({ id: req.params.id });
    res.json(updatedFirm);
  } catch (error) {
    console.error('Error updating firm:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a firm
router.delete('/:id', async (req, res) => {
  try {
    const db = req.db;
    const result = await db.collection('firms').deleteOne({ id: req.params.id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Firm not found' });
    }
    
    res.json({ message: 'Firm deleted successfully' });
  } catch (error) {
    console.error('Error deleting firm:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users for a firm
router.get('/:firmId/users', async (req, res) => {
  try {
    const db = req.db;
    const users = await db.collection('users').find({ firmId: req.params.firmId }).toArray();
    res.json(users);
  } catch (error) {
    console.error('Error fetching firm users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Assign admin to a firm
router.post('/:firmId/admin', async (req, res) => {
  try {
    const db = req.db;
    const { adminId } = req.body;
    
    if (!adminId) {
      return res.status(400).json({ message: 'Admin ID is required' });
    }
    
    // Update the firm
    const firmResult = await db.collection('firms').updateOne(
      { id: req.params.firmId },
      { 
        $set: { 
          adminId,
          updatedAt: new Date().toISOString() 
        } 
      }
    );
    
    if (firmResult.matchedCount === 0) {
      return res.status(404).json({ message: 'Firm not found' });
    }
    
    // Update the user's firmId
    await db.collection('users').updateOne(
      { id: adminId },
      { 
        $set: { 
          firmId: req.params.firmId,
          updatedAt: new Date().toISOString() 
        } 
      }
    );
    
    const updatedFirm = await db.collection('firms').findOne({ id: req.params.firmId });
    res.json(updatedFirm);
  } catch (error) {
    console.error('Error assigning admin to firm:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
