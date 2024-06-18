const {PoliceStationModel}= require('../models/Police');
const {UserModel,PoliceOfficerModel,BidderModel} = require('../models/User');
const { jwtDecode } = require("jwt-decode");
const { LostObjectModel, FoundObjectModel, CategoryModel } = require('../models/Object');
const { AuctionModel, PaymentModel } = require('../models/Auction');

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

exports.getPoliceStationNameByPoliceId = async (req, res) => {
  try {
    const { id } = req.params;
    const policeOfficer = await PoliceOfficerModel.findById(id).populate('station');
    
    if (!policeOfficer) {
      return res.status(404).json({ error: 'Police officer not found' });
    }

    const policeStation = policeOfficer.station;
    const policeStationName = policeStation ? policeStation.name : 'No station assigned';

    res.status(200).json({ policeStationName });
  } catch (error) {
    console.error(`Error fetching police station for officer ID ${req.params.id}:`, error);
    res.status(500).json({ error: "Could not fetch police station name" });
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
    const { id } = req.params;
    const policeOfficer = await PoliceOfficerModel.findById(id);
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

exports.getPoliceOfficerByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const policeOfficer = await PoliceOfficerModel.findOne({ user: id });
    if (!policeOfficer) {
      return res.status(404).json({ error: 'Police officer not found' });
    }
    res.status(200).json(policeOfficer);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.policeDeliveryObjectAuction = async (req, res) => {
  try {
    const { bidderid, auctionid } = req.params;
    const bidder = await BidderModel.findById(bidderid);
    const auction = await AuctionModel.findById(auctionid);
    const foundObject = await FoundObjectModel.findById(auction.foundObject);
    const payment = await PaymentModel.find({paymentAuction : auctionid})

    if (!bidder || !auction || !foundObject || !payment) {
      return res.status(404).json({ error: 'Object not found' });
    }
    if (foundObject.status === 'Claimed') {
      return res.status(400).json({ error: 'Object already claimed' });
    }
    if (foundObject.claimant != bidderid) {
      return res.status(400).json({ error: 'The user is not the owner of the auctioned object' });
    }
    if (payment[0].paymentStatus === "Not Paid") {
      return res.status(400).json({ error: 'The auction was not yet paid' });
    }

    foundObject.status = 'Claimed';
    foundObject.save();
    res.status(200).json({ message: 'Object claimed successfully' });
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.policeDeliveryObject = async (req, res) => {
  try {
    const { lostid, foundid, ownerid } = req.params;
    const lostObject = await LostObjectModel.findById(lostid);
    const foundObject = await FoundObjectModel.findById(foundid);
    if (!lostObject || !foundObject) {
      return res.status(404).json({ error: 'Object not found' });
    }
    if (foundObject.status === 'Claimed') {
      return res.status(400).json({ error: 'Object already claimed' });
    }
    if (lostObject.owner != ownerid ) {
      return res.status(400).json({ error: 'This user is not the owner of the object' });
    }

    foundObject.status = 'Claimed';
    foundObject.claimant = lostObject.owner;
    foundObject.save();
    lostObject.status = 'Claimed';
    lostObject.save();
    res.status(200).json({ message: 'Object claimed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}