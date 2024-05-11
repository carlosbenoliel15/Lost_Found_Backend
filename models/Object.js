const mongoose = require('mongoose');

// Schema for Category
const CategorySchema = new mongoose.Schema({
  name: { type: String, unique: true }
});

const CategoryModel = mongoose.model('Category', CategorySchema);

// Schema for SubCategory
const SubCategorySchema = new mongoose.Schema({
  name: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category',required:true}
});

const SubCategoryModel = mongoose.model('SubCategory', SubCategorySchema);

const ObjSubCategorySchema =  new mongoose.Schema({
  object: { type: mongoose.Schema.Types.ObjectId, required: true},
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required:true},
  description: { type: String, required: true}
});

const ObjSubCategoryModel = mongoose.model('ObjSubCategory', ObjSubCategorySchema);

const LostObjectSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required:true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category',required:true}, // Reference to Category
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  price:{ type:Number, default:0 },
  lostDate: String,
  status: { type: String, enum: ['Lost', 'Claimed'], default: 'Lost' },
  objectImage: String,
});

const LostObjectModel = mongoose.model('LostObject', LostObjectSchema);

// Schema for FoundObject
const FoundObjectSchema = new mongoose.Schema({
  userWhoFound: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true },
  policeOfficerThatReceived: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  price:{ type:Number, default:0 },
  status: { type: String, enum: ['Found', 'Delivered to Police', 'Claimed', 'In Auction', 'Auctioned'], default: 'Found' },
  claimant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  foundDate: { type: String, required: true},
  endDate: String,
  objectImage: String,
});

const FoundObjectModel = mongoose.model('FoundObject', FoundObjectSchema);

module.exports = { LostObjectModel, FoundObjectModel, CategoryModel, SubCategoryModel, ObjSubCategoryModel};