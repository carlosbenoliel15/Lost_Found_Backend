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
    const userId = req.params.userId;
    const bidder = await BidderModel.find({user: userId });
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

exports.getBidderUser=  async(req, res) => {
  try {
    const userId = req.params.bidderId;
    const bidder = await BidderModel.findOne({ user: userId });
    if (!bidder) {
      return res.status(404).json({ message: 'Bidder not found' });
    }
    res.json(bidder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};