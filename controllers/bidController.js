const { AuctionModel, BidModel } = require('../models/Auction');
const { BidderModel } = require('../models/User');

const makeBid = async (req, res) => {
    try {
        const { auction: auctionId, user: bidderData, value: bidValue } = req.body;

        const auction = await AuctionModel.findById(auctionId);
        if (!auction) {
            return res.status(400).json({ error: "Auction not found" });
        }

        if (auction.status === "Closed") {
            return res.status(400).json({ error: "Auction is closed" });
        }
        
        let bidder = await BidderModel.findOne({user: bidderData});
        console.log(bidderData)
        if (!bidder) {
            console.log(bidderData)
            bidder = new BidderModel({ user: bidderData});
            await bidder.save();
            
        }

        const existingBids = await BidModel.find({ auction: auctionId }).sort({ value: -1 });
        const maxBidValue = existingBids.length > 0 ? existingBids[0].value : 0;

        if (maxBidValue >= bidValue) {
            return res.status(400).json({ error: "Bid must be higher than current bid" });
        }

        const newBid = new BidModel({
            auction: auctionId,
            bidder: bidder._id,
            value: bidValue
        });

        await newBid.save();

        const io = req.io; 
        io.to(auctionId).emit('newBid', {
            auctionId,
            userId: bidder._id,
            bidValue
        });

        io.to(auctionId).emit('newMaxBid', {
            auctionId,
            maxBid: bidValue
        });

        return res.status(200).json(newBid);
    } catch (error) {
        return res.status(400).json({ error: "Could not make bid" });
    }
};

const getAllBidsByAuctionId = async (req, res) => {
    try {
        const bids = await BidModel.find({ auction: req.params.id }).sort({ value: -1 });
        return res.status(200).json(bids);
    } catch (error) {
        return res.status(400).json({ error: "Could not retrieve bids" });
    }
};

const getCurrentBidByAuctionId = async (req, res) => {
    try {
        const currentBid = await BidModel.findOne({ auction: req.params.id }).sort({ value: -1 });
        return res.status(200).json(currentBid);
    } catch (error) {
        return res.status(400).json({ error: "Could not retrieve current bid" });
    }
};

module.exports = { makeBid, getAllBidsByAuctionId, getCurrentBidByAuctionId };





//get all bids for auction
exports.getAllBidsByAuctionId = async (req, res) => {
    try{
        const auction = await AuctionModel.findById(req.params.id);
        if (!auction){
            return res.status(400).json({error: "Auction not found"});
        }
        const bids = await BidModel.find({auction: req.params.id});
        return res.status(200).json(bids);
    } catch (error){
        return res.status(400).json({error: "Could not get bids"});
    }
}

//get current bid for auction
exports.getCurrentBidByAuctionId = async (req, res) => {
    try{
        const auction = await AuctionModel.findById(req.params.id);
        if (!auction){
            return res.status(400).json({error: "Auction not found"});
        }
        const currentBid = await BidModel.findById(auction.winnerBid);
        if (!currentBid){
            return res.status(400).json({error: "Bid not found"});
        }
        return res.status(200).json(currentBid);

    } catch (error){
        return res.status(400).json({error: "Could not get current bid"});
    }
}