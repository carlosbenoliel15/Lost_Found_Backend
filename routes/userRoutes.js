const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const bidderController=require('../controllers/bidderController')

// User Routes
router.post('/signup', userController.createUser);

router.put('/update/:id', userController.updateUserById);  

router.delete('/delete/:id', userController.deleteUserById);

router.get('/profile/:id',userController.getUserInfo);


//Bidder Routes:

router.post('/bidder/', bidderController.createBidder);

// Remove a bidder
router.delete('/bidder/:bidderId', bidderController.removeBidder);

// List all bids by bidder
router.get('/bidder/:bidderId/bids', bidderController.getBidsByBidder);

// Get a bidder by ID
router.get('/bidder/:bidderId', bidderController.getBidderById);

// List all auctions participated by the bidder
router.get('/bidder/:bidderId/auctions', bidderController.getAuctionsByBidder);

// List all won auctions by the bidder
router.get('/bidder/:bidderId/won-auctions', bidderController.getWonAuctionsByBidder);

// List all purchased objects by the bidder
router.get('/bidder/:bidderId/purchased-objects', bidderController.getPurchasedObjectsByBidder);

// Create a bid
router.post('/bidder/:bidderId/bids', bidderController.createBid);

// Remove a bid
router.delete('/bidder/:bidderId/bids/:bidId', bidderController.deleteBid);

// Update a bid
router.put('/bidder/:bidderId/bids/:bidId', bidderController.updateBid);

module.exports = router;

