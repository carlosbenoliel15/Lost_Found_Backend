const {PoliceStationModel, PoliceOfficerModel}= require('../models/Police');
const UserModel = require('../models/User');
const { LostObjectModel, FoundObjectModel, CategoryModel } = require('../models/Object');

exports.createPoliceStation = async (req, res) => {
  try {
    const newPoliceStation = new PoliceStationModel(req.body);
    await newPoliceStation.save();
    res.status(201).json(newPoliceStation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updatePoliceStation = async (req, res) => {
  try {
    const { id } = req.params;
    await PoliceStationModel.findByIdAndUpdate(id, req.body);
    res.status(200).json({ message: 'Police station updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPoliceStationById = async (req, res) => {
  try {
    const { id } = req.params;
    const policeStation = await PoliceStationModel.findById(id);
    res.status(200).json(policeStation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePoliceStation = async (req, res) => {
  try {
    const { id } = req.params;
    await PoliceStationModel.findByIdAndDelete(id);
    res.status(200).json({ message: 'Police station deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createPoliceOfficer = async (req, res) => {
  try {
    const newPoliceOfficer = new PoliceOfficerModel(req.body);
    await newPoliceOfficer.save();
    res.status(201).json(newPoliceOfficer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updatePoliceOfficer = async (req, res) => {
  try {
    const { id } = req.params;
    await PoliceOfficerModel.findByIdAndUpdate(id, req.body);
    res.status(200).json({ message: 'Police officer updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPoliceOfficerById = async (req, res) => {
  try {
    const { id } = req.params;
    const policeOfficer = await PoliceOfficerModel.findById(id);
    res.status(200).json(policeOfficer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePoliceOfficer = async (req, res) => {
  try {
    const { id } = req.params;
    await PoliceOfficerModel.findByIdAndDelete(id);
    res.status(200).json({ message: 'Police officer deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.registerUserByPolice = async (req, res) => {
  try {
    const newUser = new UserModel(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createFoundObjectByPolice = async (req, res) => {
  try {
    const newFoundObject = new FoundObjectModel(req.body);
    await newFoundObject.save();
    res.status(201).json(newFoundObject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.updateFoundObjectByPolice = async (req, res) => {
  try {
    const { id } = req.params;
    await FoundObjectModel.findByIdAndUpdate(id, req.body);
    res.status(200).json({ message: 'Found object updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFoundObjectByIdByPolice = async (req, res) => {
  try {
    const { id } = req.params;
    const foundObject = await FoundObjectModel.findById(id);
    res.status(200).json(foundObject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFoundObjectByPolice = async (req, res) => {
  try {
    const { id } = req.params;
    await FoundObjectModel.findByIdAndDelete(id);
    res.status(200).json({ message: 'Found object deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
