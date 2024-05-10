const {PoliceStationModel}= require('../models/Police');
const {UserModel,PoliceOfficerModel} = require('../models/User');
const { jwtDecode } = require("jwt-decode");
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

exports.getPoliceStation = async (req, res) => {
  try {
    const policeStations = await PoliceStationModel.find();
    res.status(200).json(policeStations);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    const policeOfficer = await PoliceOfficerModel.find({station:id});
    for (var i=0; i<policeOfficer.length; i++){
      console.log(policeOfficer[i].police_id);
      const user = await UserModel.findById(policeOfficer[i].user);
      await PoliceOfficerModel.deleteOne(policeOfficer[i]);
      await UserModel.findByIdAndDelete(user._id);
    }
    await PoliceStationModel.findByIdAndDelete(id);
    res.status(200).json({ message: 'Police station deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createPoliceOfficer = async (req, res) => {
  try {
    const userInfo = {
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      role: "Police"
    }

    const user = await UserModel.findOne({ email: req.body.email , role: "Police" });
    if (user) {
      return res.status(400).json({ error: 'Police officer already exists' });
    }
    const newUser = new UserModel(userInfo);
    await newUser.save();
    const policeman = {
      user: newUser._id,
      police_id: req.body.police_id,
      station: req.body.station
    }

    const policeOfficer = await PoliceOfficerModel.findOne({ police_id: req.body.police_id });
    if (policeOfficer) {
      return res.status(400).json({ error: 'Police officer already exists' });
    }
    const newPoliceOfficer = new PoliceOfficerModel(policeman);
    await newPoliceOfficer.save();

    res.status(201).json({ message: 'Police officer created successfully'});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updatePoliceOfficer = async (req, res) => {
  try {
    const { police_id } = req.params;
    const policeOfficer = await PoliceOfficerModel.findOne(police_id);
    if (!policeOfficer) {
      return res.status(404).json({ error: 'Police officer not found' });
    }
    const user = await UserModel.findById(policeOfficer.user);
    const policeOfficerNew = {
      police_id: req.body.police_id,
      station: req.body.station
    }

    const userNew = {
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
    }

    await UserModel.updateOne(user, userNew);
    await PoliceOfficerModel.updateOne(policeOfficer, policeOfficerNew);
    res.status(200).json({ message: 'Police officer updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPoliceOfficerById = async (req, res) => {
  try {
    const { police_id } = req.params;
    const policeOfficer = await PoliceOfficerModel.find(police_id);
    if (!policeOfficer) {
      return res.status(404).json({ error: 'Police officer not found' });
    }
    const user = await UserModel.findById(policeOfficer[0].user);
    const combinedData = {
      ...user.toObject(),
      ...policeOfficer[0].toObject()
  };
    res.status(200).json(combinedData);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch police officer" });
  }
};

exports.deletePoliceOfficer = async (req, res) => {
  try {
    const { police_id } = req.params;
    const policeOfficer = await PoliceOfficerModel.find(police_id);
    if (!policeOfficer) {
      return res.status(404).json({ error: 'Police officer not found' });
    }
    const user = await UserModel.findById(policeOfficer[0].user);
    await PoliceOfficerModel.deleteOne(police_id);
    await UserModel.findByIdAndDelete(user._id);
    res.status(200).json({ message: 'Police officer deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};