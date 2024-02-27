// Schema para Auction
const AuctionSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // Adicionando o campo _id
  foundObject: { type: mongoose.Schema.Types.ObjectId, ref: 'FoundObject' },
  endDate: Date,
  startDate: Date,
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  winnerBid: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }
});

const AuctionModel = mongoose.model('Auction', AuctionSchema);

// Schema para Bid
const BidSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // Adicionando o campo _id
  bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  auction: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction' },
  value: Number
});

const BidModel = mongoose.model('Bid', BidSchema);
