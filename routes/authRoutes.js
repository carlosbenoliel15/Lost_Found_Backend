const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota para login
router.post('/login', authController.login);

// Rota para obter token
router.get('/token/:token', authController.generateToken);

// Rota para forgetPasswordRedirect
router.post('/forgetPasswordRedirect', authController.forgetPasswordRedirect);

module.exports = router;
