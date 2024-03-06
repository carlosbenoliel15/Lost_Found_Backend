const { AuctionModel, BidModel } = require('../models/Auction');
const {BidderModel} = require('../models/User');

// Create a new bidder
exports.createBidder = async (req, res) => {
    try {
      const newBidder = new BidderModel(req.body);
      await newBidder.save();
      res.status(201).json(newBidder);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

// Remove a bidder
exports.removeBidder = async (req, res) => {
    try {
      const bidderId = req.params.bidderId;
      await BidderModel.findByIdAndRemove(bidderId);
      res.status(200).json({ message: 'Bidder removed successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

// List all bids made by a bidder
exports.getBidsByBidder = async (req, res) => {
  try {
    const bidderId = req.params.bidderId;
    const bids = await BidModel.find({ bidder: bidderId });
    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a bidder by ID
exports.getBidderById = async (req, res) => {
  try {
    const bidderId = req.params.bidderId;
    const bidder = await BidderModel.findById(bidderId);
    res.status(200).json(bidder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// List all auctions participated by a bidder
exports.getAuctionsByBidder = async (req, res) => {
  try {
    const bidderId = req.params.bidderId;
    const bids = await BidModel.find({ bidder: bidderId });
    const auctions = await AuctionModel.find({ _id: { $in: bids.map(bid => bid.auction) } });
    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// List all auctions won by the bidder
exports.getWonAuctionsByBidder = async (req, res) => {
  try {
    const bidderId = req.params.bidderId;
    const wonAuctions = await AuctionModel.find({ winnerBid: bidderId });
    res.status(200).json(wonAuctions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// List all objects purchased by the bidder
exports.getPurchasedObjectsByBidder = async (req, res) => {
  try {
    const bidderId = req.params.bidderId;
    const bids = await BidModel.find({ bidder: bidderId });
    const purchasedObjects = await AuctionModel.find({ _id: { $in: bids.map(bid => bid.auction) } });
    res.status(200).json(purchasedObjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a bid
exports.createBid = async (req, res) => {
  try {
    // Implement logic to create a bid
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a bid
exports.deleteBid = async (req, res) => {
  try {
    // Implement logic to delete a bid
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a bid
exports.updateBid = async (req, res) => {
  try {
    // Implement logic to update a bid
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
