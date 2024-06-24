const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const bodyParser = require('body-parser');

router.post('/', paymentController.payment);
router.post('/webhook', bodyParser.raw({type: 'application/json'}) ,paymentController.webhook);
router.post('/send-email', paymentController.sendEmail);
router.get('/checkPayment/:auctionId', paymentController.checkPayment);


router.post('/createPaymentInfo', paymentController.createPaymentInfo);
router.get('/getPaymentInfo/:id', paymentController.getPaymentInfoById);
router.get('/getPaymentInfoUser/:userid', paymentController.getPaymentInfoByUser);

module.exports = router;