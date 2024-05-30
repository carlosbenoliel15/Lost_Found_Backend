const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const bodyParser = require('body-parser');

router.post('/', paymentController.payment);
router.post('/webhook', bodyParser.raw({type: 'application/json'}) ,paymentController.webhook);
router.post('/send-email', paymentController.sendEmail);

module.exports = router;