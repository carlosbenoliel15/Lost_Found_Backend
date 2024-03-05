const mongoose = require('mongoose');

// Schema for Category
const CategorySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, unique: true }
});

const CategoryModel = mongoose.model('Category', CategorySchema);

// Schema for LostObject
const LostObjectSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required:true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category',required:true}, // Reference to Category
  description: { 
    type: String,
    required: true 
  },
  location: { 
    type: String,
    required: true
  },
  price:{
    type:Number,
    default:0
  }, // Price field added
  status: { type: String, enum: ['Lost', 'Claimed'], default: 'Lost' }
});

const LostObjectModel = mongoose.model('LostObject', LostObjectSchema);

// Schema for FoundObject
const FoundObjectSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userWhoFound: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required:true},
  policeOfficerThatReceived: { type: mongoose.Schema.Types.ObjectId, ref: 'PoliceOfficer',required: true},
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category',required: true},
  description: { 
    type: String,
    required: true 
  },
  location: { 
    type: String,
    required: true
  },
  price:{
    type:Number,
    default:0
  },
  status: { 
    type: String, 
    enum: ['Found', 'Delivered to Police', 'Claimed', 'In Auction', 'Auctioned'], 
    default: 'Found'
  },
  claimant: { type: mongoose.Schema.Types.ObjectId, ref: 'User',default: null },
  endDate: Date
});

const FoundObjectModel = mongoose.model('FoundObject', FoundObjectSchema);

module.exports = { LostObjectModel, FoundObjectModel, CategoryModel };