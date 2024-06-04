const express = require('express');
const router = express.Router();
const authController = require('../controllers/auctionController');
const bidController = require('../controllers/bidController');

// Passar o objeto io para o controlador de leilão
const auctionRoutes = (io) => {
    // Rotas do leilão
    router.post('/', authController.createAuction);
    router.get('/', authController.getAllAuctions);
    router.get('/:id', authController.getAuctionById);
    router.put('/:id', authController.updateAuctionById);
    router.delete('/:id', authController.deleteAuctionById);
    router.get('/user/:userid', authController.getAllAuctionsByUserId);

    // Rotas de lances para leilão
    router.post('/:id/makeBid', bidController.makeBid);
    router.get('/:id/bids', bidController.getAllBidsByAuctionId);
    router.get('/:id/bid', bidController.getCurrentBidByAuctionId);

    return router;
}

module.exports = auctionRoutes;
