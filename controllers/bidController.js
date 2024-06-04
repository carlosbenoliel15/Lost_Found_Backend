const { AuctionModel, BidModel } = require('../models/Auction');
const { BidderModel } = require('../models/User');

const errorHandler = (res, error) => {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
};

exports.makeBid = async (req, res) => {
    try {
        const auction = await AuctionModel.findById(req.body.auction);

        const bidder = await BidderModel.findById(req.body.bidder);
        if (!bidder) {
            const newBidder = new BidderModel(req.body.bidder);
            await newBidder.save();
            req.body.bidder = newBidder._id;
        }

        const bid = new BidModel(req.body);
        console.log(bid);
        const auctionId = bid.auction;
        const bidderId = bid.bidder;
        const value = bid.value;

        if (!auction) {
            return res.status(400).json({ error: "Auction not found" });
        } else if (auction.status === "Closed") {
            return res.status(400).json({ error: "Auction is closed" });
        }

        const currentBid = await BidModel.find({ auction: auctionId }).sort({ value: -1 });
        let maxBid = null;
        if (currentBid.length > 0) {
            maxBid = currentBid[0].value;
            if (maxBid >= value) {
                return res.status(400).json({ error: "Bid must be higher than current bid" });
            }
        }

        await bid.save();

        // Emit the new bid to all clients connected to this auction
        const io = req.app.get('io');
        io.to(auctionId).emit('newBid', {
            auctionId: auctionId,
            userId: bidderId,
            bidValue: value
        });

        
        io.to(auctionId).emit('newMaxBid', {
            auctionId: auctionId,
            maxBid: maxBid || value  
        });

        return res.status(200).json(bid);
    } catch (error) {
        return res.status(400).json({ error: "Could not make bid" });
    }
};


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