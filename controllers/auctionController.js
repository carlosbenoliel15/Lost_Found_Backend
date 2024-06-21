const {AuctionModel, BidModel} = require('../models/Auction');
const {UserModel, BidderModel, PoliceOfficerModel} = require('../models/User');
const {FoundObjectModel} = require('../models/Object');
const {PoliceStationModel} = require('../models/Police');
const { ServerDescription } = require('mongodb');
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
            if (!foundObject){
                return res.status(400).json({error: "Object not found", auction: auctions[i]._id});
            }
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
                bids: bids,
                location:foundObject.location,
                price: foundObject.price,
                coordinates:foundObject.coordinates,
                description:foundObject.description,
                objectImage: foundObject.objectImage
            });
        }




        return res.status(200).json(resList);
    } catch (error){
        return res.status(400).json({error: error.message});
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
            return res.status(200).json({message: "Not participated in any auctions"});
        }
        
        const bids = await BidModel.find({bidder: new ObjectId(bidder._id)});
        if (!bids){
            return res.status(200).json({message: "Not participated in any auctions"});
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

//begin auction
exports.beginAuction = async (req, res) => {
    try{
        const auction = await AuctionModel.findById(req.params.id);
        if (!auction){
            return res.status(400).json({error: "Auction not found"});
        }
        if (auction.status == "Open"){
            return res.status(400).json({error: "Auction already active"});
        }

        auction.status = "Open";
        auction.startDate = Date.now();
        auction.winnerBid = null;
        await auction.save();
        return res.status(200).json(auction);
    } catch (error){
        return res.status(400).json({error: "Could not begin auction"});
    }
}

//end auction (not tested)
exports.endAuction = async (req, res) => {
    try{
        const auction = await AuctionModel.findById(req.params.id);
        if (!auction){
            return res.status(400).json({error: "Auction not found"});
        }
        if (auction.status == "Closed"){
            return res.status(400).json({error: "Auction already ended"});
        }
        if (auction.status == "Open"){
            winnerbid = null;
            winner = null;
            const bids = await BidModel.find({auction: new ObjectId(auction._id)});
            var highestBid = 0;
            for (var i = 0; i < bids.length; i++){
                if (bids[i].value > highestBid){
                    highestBid = bids[i].value;
                    winnerbid = bids[i];
                    winner = bids[i].bidder;
                }
            }
            auction.status = "Closed";
            auction.endDate = Date.now();
            auction.winnerBid = winnerbid;

            const found = await FoundObjectModel.findById(auction.foundObject);
            found.claimant = winner;
            await found.save();
            await auction.save();

            if (winner != null){
                const user = await UserModel.findById(winner.user);
                if (!user){
                    return res.status(400).json({error: "User not found"});
                }

                let transporter = nodemailer.createTransport({
                    service: 'gmail', // or use another email service
                    auth: {
                      user: process.env.EMAIL_ADDRESS,
                      pass: process.env.EMAIL_PASSWORD
                    }
                });

                var text = `Hi ${user.first_name} ${user.last_name},\nCongratulations! You have won the auction for the object ${found.title}! Please go and pay the item.`;
                var line1 = `Hi ${user.first_name} ${user.last_name},`;
                var line2 = `Congratulations! You have won the auction for the object ${found.title}!`;
                var line3 = `Please go and pay the item.`;

                let mailOptions = {
                    from: "no-reply@bidfinder.ddns.net",
                    to: user.email,
                    subject: "Auction status",
                    text: text,
                    html: `
                    <p>${line1}</p>
                    <p>${line2}</p>
                    <p>${line3}</p>
                    <img src="cid:unique@icon.cid" alt="Icon" />`,
                    attachments: [
                        {
                            filename: 'icon.png',
                            path: 'logo.png',
                            cid: 'unique@icon.cid'
                        }
                    ]
                };
                await transporter.sendMail(mailOptions);
            }
            
        }

        return res.status(200).json(auction);
    } catch (error){
        return res.status(400).json({error: "Could not end auction"});
    }
}

//where FoundObject is
exports.whereIsAuction = async (req, res) => {
    try{
        const auction = await AuctionModel.findById(req.params.id);
        if (!auction){
            return res.status(400).json({error: "Auction not found"});
        }
        const foundObject = await FoundObjectModel.findById(auction.foundObject);
        if (!foundObject){
            return res.status(400).json({error: "Object not found"});
        }
        const policeOfficerThatReceived = await PoliceOfficerModel.findById(foundObject.policeOfficerThatReceived);
        if (!policeOfficerThatReceived){
            return res.status(400).json({error: "Police officer not found"});
        }
        const policeStation = await PoliceStationModel.findById(policeOfficerThatReceived.station);
        return res.status(200).json(policeStation);
    } catch (error){
        return res.status(400).json({error: "Could not find object"});
    }
}