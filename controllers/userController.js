const { jwtDecode } = require("jwt-decode");
const User = require('../models/User');

const { UserModel, BidderModel } = require('../models/User');

exports.createUser = async (req, res) => {
  try {
    // Check if there is already a user with the same email
    const existingEmailUser = await UserModel.findOne({ email: req.body.email });
    if (existingEmailUser) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    // Check if there is already a user with the same NIC (National Identification Number)
    const existingNicUser = await UserModel.findOne({ nic: req.body.nic });
    if (existingNicUser) {
      return res.status(400).json({ error: 'NIC is already in use' });
    }

    // Check if there is already a user with the same NIF (Tax Identification Number)
    const existingNifUser = await UserModel.findOne({ nif: req.body.nif });
    if (existingNifUser) {
      return res.status(400).json({ error: 'NIF is already in use' });
    }

    // If there are no users with the same attributes, create a new user
    console.log(req.body)
    const newUser = new UserModel(req.body);
    console.log(newUser);
    console.log(newUser._id);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Function to update user data with the provided ID
exports.updateUserById = async (req, res) => {
  try {
    const userId = req.body.token;
    const token = jwtDecode(userId);
    const currentUser = await UserModel.findById(token["userId"]);

    const updatedAttributes = req.body;

    // Check if there is already a user with the same email, NIC, or NIF
    if (updatedAttributes.email) {
      const existingEmailUser = await UserModel.findOne({ email: updatedAttributes.email });
      if (existingEmailUser && existingEmailUser._id.toString() !== currentUser) {
        return res.status(400).json({ error: 'Email is already in use' });
      }
    }

    if (updatedAttributes.nic) {
      const existingNicUser = await UserModel.findOne({ nic: updatedAttributes.nic });
      if (existingNicUser && existingNicUser._id.toString() !== currentUser) {
        return res.status(400).json({ error: 'NIC is already in use' });
      }
    }

    if (updatedAttributes.nif) {
      const existingNifUser = await UserModel.findOne({ nif: updatedAttributes.nif });
      if (existingNifUser && existingNifUser._id.toString() !== currentUser) {
        return res.status(400).json({ error: 'NIF is already in use' });
      }
    }

    // Check if the attributes to be updated are different from the existing ones
    const currentUser1 = await UserModel.findById(currentUser);
    if (!currentUser1) {
      return res.status(404).json({ error: 'User not found' });
    }

    let shouldUpdate = false;
    for (const key in updatedAttributes) {
      if (currentUser1[key] !== updatedAttributes[key]) {
        shouldUpdate = true;
        break;
      }
    }

    if (!shouldUpdate) {
      return res.status(400).json({ error: 'No changes detected' });
    }

    // Update the user
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updatedAttributes, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to update user password with the provided ID
exports.updatePassById = async (req, res) => {
  try {
    const userId = req.body.token;
    const oldPass = req.body.oldPass;
    const newPass = req.body.newPass;
    const token = jwtDecode(userId);
    const currentUser = await UserModel.findById(token["userId"]);
    const userPass = currentUser.password;
    const isMatch = await bcrypt.compare(oldPass, userPass);
    if (!isMatch) {
      return res.status(404).json({ error: 'Wrong password' });
    }
    const updatedUser = await UserModel.findByIdAndUpdate(currentUser, { password: newPass }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
  }
  catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
}



exports.deleteUserById = async (req, res) => {
  try {
    const userId = req.body.token;
    const token = jwtDecode(userId);
    const currentUser = await UserModel.findById(token["userId"]);
    // Update records referencing the deleted user
    //await LostObjectModel.updateMany({ owner: userId }, { owner: 'unknown user' });
    //await FoundObjectModel.updateMany({ userWhoFound: userId }, { userWhoFound: 'unknown user' });
    //await BidModel.deleteMany({ bidder: userId });

    // Remove bids in auctions referencing the user
    // const auctions = await AuctionModel.find({ 'winnerBid.bidder': userId });
    // for (const auction of auctions) {
    //   await BidModel.findByIdAndDelete(auction.winnerBid._id);
    //   auction.winnerBid = null;
    //   await auction.save();
    // }
    // Delete the user
    await UserModel.findByIdAndDelete(currentUser);

    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.body;
    const token = jwtDecode(userId);
    const currentUser = await UserModel.findById(token["userId"]);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(201).json({ currentUser });
    }catch (err) {
      return res.status(500)
        .json({ error: `Server error when trying to fetch users.` });
    };
};


