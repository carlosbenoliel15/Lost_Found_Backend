const mongoose = require('mongoose');

// Schema para User
const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name:{ type: String, required: true },
  email: { type: String, unique: true },
  adddress:{type:String},
  profile_photo:{type:String},
  password: { type: String, required: true },
  phone:String,
  birth:{type: String},
  status: String,
  nic: { type: String, unique: true },
  nif: { type: String, unique: true },
  gender: String,
  profileImage: String,
  role: { type: String, enum: ["User","Police","Admin"] ,required: true },
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

// Schema para PoliceOfficer
const PoliceOfficerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  police_id: { type: String, unique: true },
  station: {type: mongoose.Schema.Types.ObjectId,ref: 'PoliceStation'}
});

// Model para PoliceStation
const PoliceOfficerModel = mongoose.model('PoliceOfficer', PoliceOfficerSchema);

module.exports = { UserModel, BidderModel, OwnerModel, PoliceOfficerModel };