const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const bidderController=require('../controllers/bidderController');
const ownerController = require('../controllers/ownerController');
const multer = require("multer");

const upload = multer({ dest: 'uploads/' })

// User Routes
router.post('/signup/',upload.single('profileImage'), userController.createUser);
router.put('/update/',upload.single('profileImage'), userController.updateUserById);
router.put('/updatePass/', userController.updatePassById);
router.get('/list/', userController.listUsers);  
router.delete('/delete/:token', userController.deleteUserById);
router.get('/profile/:token',userController.getUserInfo);
router.get('/userData/:id', userController.getUserData);
router.get('/userNif/:nif', userController.getUserByNIF);
router.get('/profileImage/:id', userController.getProfileImage);
router.post('/getUser/', userController.getUser);
router.put('/deactivate/:id', userController.deactivateUser);
router.put('/activate/:id', userController.activateUser);
router.post('/checkByEmail/', userController.checkUserByEmail);

//Routes for owner
router.get('/owner/foundobjects/', ownerController.getListFoundObject);
router.get('/owner/lostobjects/:id', ownerController.getListLostObject);
router.get('/owner/:id', ownerController.getOwnerbyUserId);
router.get('/owners/:id', ownerController.getOwnerInfo);
router.post('/owner/:id', ownerController.createOwner);

//Routes for bidder
router.post('/bidder/', bidderController.createBidder);
router.delete('/bidder/:bidderId', bidderController.removeBidder);
router.get('/bidder/:bidderId/bids', bidderController.getBidsByBidder);
router.get('/bidder/user/:bidderId', bidderController.getBidderUser);
router.get('/bidder/:userId', bidderController.getBidderById);
router.get('/bidder/:bidderId/auctions', bidderController.getAuctionsByBidder);
router.get('/bidder/:bidderId/won-auctions', bidderController.getWonAuctionsByBidder);
router.get('/bidder/:bidderId/purchased-objects', bidderController.getPurchasedObjectsByBidder);

module.exports = router;

