const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST: http://localhost:3001/api/auth/login
router.post('/login', authController.login);

// POST: http://localhost:3001/api/auth/register
router.post('/register', authController.register);
router.put('/profile', authController.updateProfile);
module.exports = router;