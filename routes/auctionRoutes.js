const express = require('express');
const router = express.Router();
const authController = require('../controllers/auctionController');
const bidController = require('../controllers/bidController');

//================================================ Actions general ================================================
//create auction
router.post('/', authController.createAuction);
//get all auctions
router.get('/', authController.getAllAuctions);
//get auction by id
router.get('/:id', authController.getAuctionById);
//update auction by id
router.put('/:id', authController.updateAuctionById);
//delete auction by id
router.delete('/:id', authController.deleteAuctionById);
//get all auctions by user id
router.get('/user/:userid', authController.getAllAuctionsByUserId);
//begin auction
router.put('/:id/begin', authController.beginAuction);

//================================================ Bid for auction ================================================
//make bid
router.post('/:id/makeBid', bidController.makeBid);
//get all bids for auction
router.get('/:id/bids', bidController.getAllBidsByAuctionId);
//get current bid for auction
router.get('/:id/bid', bidController.getCurrentBidByAuctionId);



module.exports = router;