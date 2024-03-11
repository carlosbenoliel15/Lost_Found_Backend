const User = require('../models/User');
const Object = require('../models/Object');

const { LostObjectModel, FoundObjectModel } = require('../models/Object');
const { UserModel, OwnerModel } = require('../models/User');

exports.getListFoundObject = async (req, res) => {
    const objectList = await FoundObjectModel.find();
    if (objectList.length === 0) {
        return res.status(404).json({ error: 'No found objects' });
    }
    res.status(200).json(objectList);    
}

exports.getListLostObject = async (req, res) => {
    const ownerId = req.params.id;
    const owner = await OwnerModel.findOne(ownerId);
    if (!owner) {
        return res.status(404).json({ error: 'Owner not found' });
    }
    const lostObjects = await LostObjectModel.find({ owner: ownerId });
    res.status(200).json(lostObjects);
}

exports.getOwnerInfo = async (req, res) => {
    const ownerId = req.params.id;
    const owner = await OwnerModel.findOne(ownerId);
    if (!owner) {
        return res.status(404).json({ error: 'Owner not found' });
    }
    res.status(200).json(owner);
}

exports.createOwner = async (req, res) => {
    const userId = req.params.id;
    const ownerId = new OwnerModel.findOne({ user: userId });
    const userIdCheck = new UserModel.findById({ user: userId});
    if (ownerId) {
        return res.status(404).json({ error: 'Owner already exists' });
    }

    if (!userIdCheck) {
        return res.status(404).json({ error: 'User does not exist' });
    }
    const newOwner = new OwnerModel({ user: userId });
    await newOwner.save();
    res.status(200).json(newOwner);
}