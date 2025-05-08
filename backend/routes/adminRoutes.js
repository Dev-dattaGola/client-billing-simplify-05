
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Get all firm admins
router.get('/', async (req, res) => {
  try {
    const db = req.db;
    const admins = await db.collection('users').find({ role: 'admin' }).toArray();
    
    // Don't send password hash
    const sanitizedAdmins = admins.map(admin => {
      const { password, ...adminData } = admin;
      return adminData;
    });
    
    res.json(sanitizedAdmins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new firm admin
router.post('/', async (req, res) => {
  try {
    const db = req.db;
    const { name, email, password, firmId } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    
    // Check if email already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Generate password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newAdmin = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      firmId,
      status: 'active',
      permissions: ['all'],
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      createdBy: req.headers['x-user-id'] || 'system'
    };
    
    await db.collection('users').insertOne(newAdmin);
    
    // If firmId is provided, update the firm
    if (firmId) {
      await db.collection('firms').updateOne(
        { id: firmId },
        { 
          $set: { 
            adminId: newAdmin.id,
            updatedAt: new Date().toISOString() 
          } 
        }
      );
    }
    
    // Don't send password hash in response
    const { password: _, ...adminData } = newAdmin;
    
    res.status(201).json(adminData);
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update an admin
router.put('/:id', async (req, res) => {
  try {
    const db = req.db;
    const { name, email, status, firmId } = req.body;
    
    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(status && { status }),
      ...(firmId && { firmId }),
      updatedAt: new Date().toISOString()
    };
    
    // If password is included, hash it
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.password, salt);
    }
    
    const result = await db.collection('users').updateOne(
      { id: req.params.id, role: 'admin' },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    // If firmId is changed, update the old and new firm
    if (firmId) {
      // Get the admin to find the previous firmId
      const admin = await db.collection('users').findOne({ id: req.params.id });
      
      if (admin.firmId && admin.firmId !== firmId) {
        // Remove admin from old firm
        await db.collection('firms').updateOne(
          { id: admin.firmId },
          { 
            $set: { 
              adminId: null,
              updatedAt: new Date().toISOString() 
            } 
          }
        );
      }
      
      // Add admin to new firm
      await db.collection('firms').updateOne(
        { id: firmId },
        { 
          $set: { 
            adminId: req.params.id,
            updatedAt: new Date().toISOString() 
          } 
        }
      );
    }
    
    const updatedAdmin = await db.collection('users').findOne({ id: req.params.id });
    
    // Don't send password hash
    const { password, ...adminData } = updatedAdmin;
    
    res.json(adminData);
  } catch (error) {
    console.error('Error updating admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete an admin
router.delete('/:id', async (req, res) => {
  try {
    const db = req.db;
    
    // Get the admin first to find their firmId
    const admin = await db.collection('users').findOne({ id: req.params.id, role: 'admin' });
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    // If the admin is assigned to a firm, update the firm
    if (admin.firmId) {
      await db.collection('firms').updateOne(
        { id: admin.firmId },
        { 
          $set: { 
            adminId: null,
            updatedAt: new Date().toISOString() 
          } 
        }
      );
    }
    
    const result = await db.collection('users').deleteOne({ id: req.params.id, role: 'admin' });
    
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
