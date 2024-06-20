const express = require('express');
const router = express.Router();
const authController = require('../controllers/auctionController');
const bidController = require('../controllers/bidController');

// Pass the io object to the bid controller
const auctionRoutes = (io) => {
    // Middleware to attach io to req
    router.use((req, res, next) => {
        req.io = io;
        next();
    });

    // Auction routes
    router.post('/', authController.createAuction);
    router.get('/', authController.getAllAuctions);
    router.get('/:id', authController.getAuctionById);
    router.put('/:id', authController.updateAuctionById);
    router.delete('/:id', authController.deleteAuctionById);
    router.get('/user/:userid', authController.getAllAuctionsByUserId);
    router.put('/:id/begin', authController.beginAuction);
    router.put('/:id/end', authController.endAuction);
    router.get('/where/:id', authController.whereIsAuction);

    // Bid routes for auction
    router.post('/makeBid', bidController.makeBid);
    router.get('/:id/bids', bidController.getAllBidsByAuctionId);
    router.get('/:id/bid', bidController.getCurrentBidByAuctionId);

    return router;
}

module.exports = auctionRoutes;
