const mongoose = require('mongoose');

// Schema para Auction
const AuctionSchema = new mongoose.Schema({
  foundObject: { type: mongoose.Schema.Types.ObjectId, ref: 'FoundObject',required:true},
  endDate:{type: Date , required: true },
  startDate: {type: Date, required: true },
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  winnerBid: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }
});

const AuctionModel = mongoose.model('Auction', AuctionSchema);

// Schema para Bid
const BidSchema = new mongoose.Schema({
  bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'Bidder',required:true},
  auction: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction',required:true },
  value: Number
});

const BidModel = mongoose.model('Bid', BidSchema);

module.exports = { AuctionModel, BidModel };