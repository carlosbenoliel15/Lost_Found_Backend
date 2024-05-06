const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota para login
router.post('/login', authController.login);
// Rota para login com Google
router.post('/loginGoogle', authController.loginGoogle);

module.exports = router;
