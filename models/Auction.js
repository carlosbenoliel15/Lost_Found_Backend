const mongoose = require('mongoose');

// Schema para Auction
const AuctionSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // Adicionando o campo _id
  foundObject: { type: mongoose.Schema.Types.ObjectId, ref: 'FoundObject',required:true},
  endDate:{type: Date , required: true },
  startDate: {type: Date, required: true },
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  winnerBid: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }
});

const AuctionModel = mongoose.model('Auction', AuctionSchema);

// Schema para Bid
const BidSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // Adicionando o campo _id
  bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'Bidder',required:true},
  auction: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction',required:true },
  value: Number
});

const BidModel = mongoose.model('Bid', BidSchema);
