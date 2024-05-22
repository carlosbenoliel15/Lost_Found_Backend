const express = require('express');
const router = express.Router();
const { getStatistics } = require('../controllers/statsController');

// Rota para obter estatísticas
router.get('/stats', getStatistics);

module.exports = router;