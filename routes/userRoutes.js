const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const bidderController=require('../controllers/bidderController');
const ownerController = require('../controllers/ownerController');
const multer = require("multer");

const upload = multer({ dest: 'uploads/' })

// User Routes
router.post('/signup/',upload.single('profileImage'), userController.createUser);
router.put('/update/', userController.updateUserById);
router.put('/updatePass/', userController.updatePassById);  
router.delete('/delete/:token', userController.deleteUserById);
router.get('/profile/:token',userController.getUserInfo);
router.get('/profileImage/:id', userController.getProfileImage);
router.post('/getUser/', userController.getUser);
//router.get('/findByEmail/:email', userController.

//Routes for owner
router.get('/owner/foundobjects/', ownerController.getListFoundObject);
router.get('/owner/lostobjects/:id', ownerController.getListLostObject);
router.get('/owners/:id', ownerController.getOwnerInfo);
router.post('/owner/:id', ownerController.createOwner);


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

