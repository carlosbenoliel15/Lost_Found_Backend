const mongoose = require('mongoose');

// Schema para Category
const CategorySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // Adicionando o campo _id
  name: { type: String, unique: true }
});

const CategoryModel = mongoose.model('Category', CategorySchema);

// Schema para Object
const ObjectSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  description: String,
  local: String,
  price: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
});

const ObjectModel = mongoose.model('Object', ObjectSchema);

// Schema para LostObject
const LostObjectSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ...ObjectSchema.obj // Herda os campos de ObjectSchema
});

const LostObjectModel = mongoose.model('LostObject', LostObjectSchema);

// Schema para FoundObject
const FoundObjectSchema = new mongoose.Schema({
  userWhoFound: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  policeOfficerThatReceived: { type: mongoose.Schema.Types.ObjectId, ref: 'PoliceOfficer' },
  ...ObjectSchema.obj // Herda os campos de ObjectSchema
});

const FoundObjectModel = mongoose.model('FoundObject', FoundObjectSchema);

module.exports = { CategoryModel, ObjectModel, LostObjectModel, FoundObjectModel };
