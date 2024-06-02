const {AuctionModel, BidModel} = require('../models/Auction');
const {BidderModel} = require('../models/User');

const errorHandler = (res, error) => {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  };

//make bid
exports.makeBid = async (req, res) => {
    try{
        const auction = await AuctionModel.findById(req.params.id);
        
        const bidder = await BidderModel.findById(req.body.bidder);
        if (!bidder){
            const bidder = new BidderModel(req.body.bidder);
            await bidder.save();
            req.body.bidder = bidder._id;    
        }

        const bid = new BidModel(req.body);
        var auctionId = bid.auction;
        var bidderId = bid.bidder;
        var value = bid.value;

        if (!auction){
            return res.status(400).json({error: "Auction not found"});
        } else if (auction.status === "Closed"){
            return res.status(400).json({error: "Auction is closed"});
        }

        const currentBid = await BidModel.find({auction: auctionId}).sort({value: -1});
        if (currentBid.length > 0){
            if (currentBid[0].value >= value){
                return res.status(400).json({error: "Bid must be higher than current bid"});
                
            }            
        }

        await bid.save();
        return res.status(200).json(bid);
    } catch (error){
        //errorHandler(res, error);
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
        const currentBid = await BidModel.findById(auction.winnerBid);
        if (!currentBid){
            return res.status(400).json({error: "Bid not found"});
        }
        return res.status(200).json(currentBid);

    } catch (error){
        return res.status(400).json({error: "Could not get current bid"});
    }
}