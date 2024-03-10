const mongoose = require('mongoose');

// Schema para User
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone:String,
  birth: String, // to do alterar........
  status: String,
  nic: { type: String, unique: true },
  nif: { type: String, unique: true },
  gender: String
});

const UserModel = mongoose.model('User', UserSchema);

// Schema para Bidder
const BidderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true }
});

const BidderModel = mongoose.model('Bidder', BidderSchema);

// Schema para Owner
const OwnerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true }
});

const OwnerModel = mongoose.model('Owner', OwnerSchema);

module.exports = { UserModel, BidderModel, OwnerModel };