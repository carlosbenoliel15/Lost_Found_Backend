const {AuctionModel, BidModel} = require('../models/Auction');
const {UserModel, BidderModel} = require('../models/User');
const {FoundObjectModel} = require('../models/Object');
const ObjectId = require('mongoose').Types.ObjectId;

const errorHandler = (res, error) => {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  };

//create auction
exports.createAuction = async (req, res) => {
    try{
        const auction = new AuctionModel(req.body);
        if (await AuctionModel.findOne({foundObject: auction.foundObject})) {
            return res.status(400).json({error: "Object already in auction"});
        }
        if (req.body.startDate > req.body.endDate){
            return res.status(400).json({error: "Start date must be before end date"});
        }
        await auction.save();
        res.status(200).json(auction);
    } catch (error){
        //errorHandler(res, error);
        return res.status(400).json({error: "Could not create auction"});
    }
}

//get all auctions
exports.getAllAuctions = async (req, res) => {
    try{
        const auctions = await AuctionModel.find();
        if (!auctions) {
            return res.status(400).json({error: "No auctions found"});
        }

        var resList = [];
        for (var i = 0; i < auctions.length; i++){
            const foundObject = await FoundObjectModel.findById(auctions[i].foundObject);
            const auction = auctions[i];
            const bids = await BidModel.find({auction: new ObjectId(auction._id)});

            var highestBid = 0;
            for (var j = 0; j < bids.length; j++){
                if (bids[j].value > highestBid){
                    highestBid = bids[j].value;
                }
            }
            resList.push({
                _id: auction._id,
                foundObject: foundObject._id,
                startDate: auction.startDate, 
                endDate: auction.endDate,
                status: auction.status,
                foundObjectTitle: foundObject.title, 
                highestBid: highestBid, 
                bids: bids
            });
        }




        return res.status(200).json(resList);
    } catch (error){
        return res.status(400).json({error: "Could not get auctions"});
    }
}

//get auction by id
exports.getAuctionById = async (req, res) => {
    try{
        const auction = await AuctionModel.findById(req.params.id);
        if (!auction){
            return res.status(400).json({error: "Auction not found"});
        }
        return res.status(200).json(auction);
    } catch (error){
        return res.status(400).json({error: "Could not get auction"});
    }
}

//update auction by id
exports.updateAuctionById = async (req, res) => {
    try{
        const auction = await AuctionModel.findOne(req.params.id);
        if (!auction){
            return res.status(400).json({error: "Auction not found"});
        }

        if (req.body.foundObject == auction.foundObject){
            return res.status(400).json({error: "Object already in auction"});
        }

        if (req.body.startDate > req.body.endDate){
            return res.status(400).json({error: "Start date must be before end date"});
        }

        const updatedAuction = await AuctionModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json(updatedAuction);
    } catch (error){
        return res.status(400).json({error: "Could not update auction"});
    }
}

//delete auction by id
exports.deleteAuctionById = async (req, res) => {
    try{
        const auction = await AuctionModel.findById(req.params.id);
        if (!auction){
            return res.status(400).json({error: "Auction not found"});
        }
        await AuctionModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({message: "Auction deleted"});
    } catch (error){
        return res.status(400).json({error: "Could not delete auction"});
    }
}

//get all auctions by user id
exports.getAllAuctionsByUserId = async (req, res) => {
    try{
        const user = await UserModel.findById(req.params.userid);
        if (!user){
            return res.status(400).json({error: "User not found"});
        }

        //get all bids from user
        const bidder = await BidderModel.findOne({user: new ObjectId(user._id)});
        if (!bidder){
            return res.status(400).json({error: "Not participated in any auctions"});
        }
        
        const bids = await BidModel.find({bidder: new ObjectId(bidder._id)});
        if (!bids){
            return res.status(400).json({error: "Not participated in any auctions"});
        }
        
        //get all auctions from bids
        var auctions = [];
        for (var i = 0; i < bids.length; i++){
            const auction = await AuctionModel.findOne(bids[i].auction);
            if (auction && !auctions.includes(auction)) {
                auctions.push(auction);
            }
        }
        if (!auctions) {
            return res.status(400).json({error: "No auctions found"});
        }
        return res.status(200).json(auctions);
    } catch (error){
        return res.status(400).json({error: error.message});
    }
}