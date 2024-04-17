const {AuctionModel, BidModel} = require('../models/Auction');

//make bid
exports.makeBid = async (req, res) => {
    try{
        const auction = await AuctionModel.findById(req.params.id);
        const bid = new BidModel(req.body);
        auctionId = bid.auction;
        bidderId = bid.bidder;
        value = bid.value;

        if (!auction){
            return res.status(400).json({error: "Auction not found"});
        } else if (auction.status === "Closed"){
            return res.status(400).json({error: "Auction is closed"});
        }

        const currentBid = await BidModel.find({auction: auctionId}).sort({value: -1});
        if (currentBid[0].value >= value){
            return res.status(400).json({error: "Bid must be higher than current bid"});
            
        }

        await bid.save();
        return res.status(200).json(bid);
    } catch (error){
        return res.status(400).json({error: "Could not make bid"});
    }
}

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
        const currentBid = auction.winnerBid;
        return res.status(200).json(currentBid);
    } catch (error){
        return res.status(400).json({error: "Could not get current bid"});
    }
}