const { LostObjectModel, FoundObjectModel } = require('../models/Object');
const { UserModel, OwnerModel } = require('../models/User');
const { jwtDecode } = require("jwt-decode");

// Middleware de tratamento de erros
const errorHandler = (res, error) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal Server Error' });
};

// Create a new LostObject
exports.createLostObject = async (req, res) => {
  try {
    const token = jwtDecode(req.body.owner);
    const ownerId  = token["userId"];
    
    const newOwnerId = await OwnerModel.findOne({ user: ownerId });
    const userIdCheck = await UserModel.findById(ownerId);
    if (!newOwnerId && userIdCheck) {
      const newOwnerId = new OwnerModel({ user: ownerId });
      await newOwnerId.save();
      console.log(newOwnerId);
      req.body.owner = newOwnerId._id;
    }
    else if(newOwnerId){
      req.body.owner = newOwnerId;
    }

    const newLostObject = new LostObjectModel(req.body);
    await newLostObject.save();
    res.status(201).json(newLostObject);
  } catch (error) {
    errorHandler(res, error);
  }
};

// Get all LostObjects
exports.getAllLostObjects = async (req, res) => {
  try {
    const lostObjects = await LostObjectModel.find();
    res.status(200).json(lostObjects);
  } catch (error) {
    errorHandler(res, error);
  }
};

// Get a LostObject by ID
exports.getLostObjectById = async (req, res) => {
  try {
    const lostObjectId = req.params.lostObjectId;
    const lostObject = await LostObjectModel.findById(lostObjectId);
    if (!lostObject) {
      return res.status(404).json({ error: 'LostObject not found' });
    }
    res.status(200).json(lostObject);
  } catch (error) {
    errorHandler(res, error);
  }
};

// Update a LostObject
exports.updateLostObject = async (req, res) => {
  try {
    const lostObjectId = req.params.lostObjectId;
    const updatedLostObject = await LostObjectModel.findByIdAndUpdate(lostObjectId, req.body, { new: true });
    if (!updatedLostObject) {
      return res.status(404).json({ error: 'LostObject not found' });
    }
    res.status(200).json(updatedLostObject);
  } catch (error) {
    errorHandler(res, error);
  }
};

// Delete a LostObject
exports.deleteLostObject = async (req, res) => {
  try {
    const lostObjectId = req.params.lostObjectId;
    const deletedLostObject = await LostObjectModel.findByIdAndDelete(lostObjectId);
    if (!deletedLostObject) {
      return res.status(404).json({ error: 'LostObject not found' });
    }
    res.status(200).json({ message: 'LostObject deleted successfully' });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.getLostMatch = async (req, res) => {
  try {
    const jsonFilter = req.body;
    const foundObjects = await FoundObjectModel.find(jsonFilter);
    if (!foundObjects) {
      return res.status(404).json({ error: 'No match found' });
    }
    res.status(200).json(foundObjects);
  } catch (error) {
    errorHandler(res, error);
  }
};


//------------------------------------------------------------------Found Object Functions ---------------------------------------------------------------------

// Create a new FoundObject
exports.createFoundObject = async (req, res) => {
  try {
    const newFoundObject = new FoundObjectModel(req.body);
    await newFoundObject.save();
    res.status(201).json(newFoundObject);
  } catch (error) {
    errorHandler(res, error);
  }
};

// Get all FoundObjects
exports.getAllFoundObjects = async (req, res) => {
  try {
    const foundObjects = await FoundObjectModel.find();
    res.status(200).json(foundObjects);
  } catch (error) {
    errorHandler(res, error);
  }
};

// Get a FoundObject by ID
exports.getFoundObjectById = async (req, res) => {
  try {
    const foundObjectId = req.params.foundObjectId;
    const foundObject = await FoundObjectModel.findById(foundObjectId);
    if (!foundObject) {
      return res.status(404).json({ error: 'FoundObject not found' });
    }
    res.status(200).json(foundObject);
  } catch (error) {
    errorHandler(res, error);
  }
};

// Update a FoundObject
exports.updateFoundObject = async (req, res) => {
  try {
    const foundObjectId = req.params.foundObjectId;
    const updatedFoundObject = await FoundObjectModel.findByIdAndUpdate(foundObjectId, req.body, { new: true });
    if (!updatedFoundObject) {
      return res.status(404).json({ error: 'FoundObject not found' });
    }
    res.status(200).json(updatedFoundObject);
  } catch (error) {
    errorHandler(res, error);
  }
};

// Delete a FoundObject
exports.deleteFoundObject = async (req, res) => {
  try {
    const foundObjectId = req.params.foundObjectId;
    const deletedFoundObject = await FoundObjectModel.findByIdAndDelete(foundObjectId);
    if (!deletedFoundObject) {
      return res.status(404).json({ error: 'FoundObject not found' });
    }
    res.status(200).json({ message: 'FoundObject deleted successfully' });
  } catch (error) {
    errorHandler(res, error);
  }
};
