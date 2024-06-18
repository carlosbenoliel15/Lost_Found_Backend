const { jwtDecode } = require("jwt-decode");
const User = require('../models/User');

const { UserModel, BidderModel } = require('../models/User');
const cloudinary = require("cloudinary");

const cloudinaryService = require('../services/cloudinaryService');

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

    const newUser = new UserModel(req.body);
    await newUser.save();
    res.status(201).json(newUser);


  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.checkUserByEmail = async (req, res) => {
     try {
       const existingEmailUser = await UserModel.findOne({
         email: req
             .body.email
       });
       if (existingEmailUser) {
         return res.status(200).json({exist: true});
       }
       res.status(200).json({exsit: false});
     } catch (error) {
         res.status(400).json({error: error.message});

     }
}

// Function to update user data with the provided ID
exports.updateUserById = async (req, res) => {
  try {
    console.log(req.body)
    const userToken = req.body.token;
    const token = jwtDecode(userToken);
    const currentUser = await UserModel.findById(token["userId"]);
    console.log(currentUser)

    const updatedAttributes = req.body;

    // Check if there is already a user with the same email, NIC, or NIF
    if (updatedAttributes.email) {
      const existingEmailUser = await UserModel.findOne({ email: updatedAttributes.email, _id: { $ne: currentUser._id } });
      if (existingEmailUser && existingEmailUser._id.toString() !== currentUser) {
        return res.status(400).json({ error: 'Email is already in use' });
      }
    }

    if (updatedAttributes.nic) {
      const existingNicUser = await UserModel.findOne({ nic: updatedAttributes.nic, _id: { $ne: currentUser._id  }});
      if (existingNicUser && existingNicUser._id.toString() !== currentUser) {
        return res.status(400).json({ error: 'NIC is already in use' });
      }
    }

    if (updatedAttributes.nif) {
      const existingNifUser = await UserModel.findOne({ nif: updatedAttributes.nif, _id: { $ne: currentUser._id  }});
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

    if (req.file?.filename) {
      cloudinaryService.uploadImage(req.file.filename, 'profileImages').then( async result => {
            updatedAttributes['profileImage'] = result.public_id.replace('profileImages/', '')
            const updatedUser = await UserModel.findByIdAndUpdate(token["userId"], updatedAttributes, { new: true });
            if (!updatedUser) {
              return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json(updatedUser);
          }
          , error => {
            res.status(400).json({ error: error.message });
          });
    } else {
      const updatedUser = await UserModel.findByIdAndUpdate(token["userId"], updatedAttributes, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(updatedUser);
    }

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to update user password with the provided ID
exports.updatePassById = async (req, res) => {
  try {
    const userId = req.body.token;
    const oldPass = req.body.password;
    const newPass = req.body.newPassword;
    const token = jwtDecode(userId);

    const currentUser = await UserModel.findById(token.userId);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (oldPass !== currentUser.password) {
      return res.status(400).json({ error: 'Wrong password' });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(token.userId, { password: newPass }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'Failed to update password' });
    }
    return res.status(200).json({ message: 'Password updated successfully', user: updatedUser });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function updatePassword(req, res) {
  try {
      // Logic to update password
      const userId = req.params.userId;
      const newPassword = req.body.newPassword;

      // Check if user exists (replace this with your own logic for checking user existence)
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Here you would perform the logic to update the password
      // (replace this with your own logic for updating the password)

      // If password is successfully updated, send a success response
      return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
      // If an error occurs during processing, return an error message
      console.error('Error updating password:', error);
      return res.status(500).json({ error: 'Error updating password' });
  }
}

exports.deleteUserById = async (req, res) => {
  try {
    const userId = req.params.token;
    const token = jwtDecode(userId);
    const currentUser = await UserModel.findById(token["userId"]);
    // Delete the user
    await UserModel.findByIdAndDelete(currentUser);

    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.params.token;
    const token = jwtDecode(userId);
    const currentUser = await UserModel.findById(token["userId"]);
  
    // const formattedDate = currentUser.birth.toLocaleDateString('en-GB', {
    //     day: '2-digit',
    //     month: '2-digit',
    //     year: 'numeric'
    // });

    // currentUser.birth = formattedDate;
    // console.log('formattcurrentUser.birth--',currentUser.birth); // Output will be in dd-mm-yyyy format

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ currentUser });
    }catch (err) {
      return res.status(500)
        .json({ error: `Server error when trying to fetch users. ` + err });
    };


};

exports.getUserData = async (req, res) => {
  try {
    const userId = req.params.id; 
    const currentUser = await UserModel.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ currentUser });
  } catch (err) {
    return res.status(500).json({ error: `Server error when trying to fetch users. ` + err });
  }
};


exports.getUserByNIF = async (req, res) => {
  try {
    const userNif = req.params.nif; 
    const currentUser = await UserModel.findOne({ nif: userNif });
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ currentUser });
  } catch (err) {
    return res.status(500).json({ error: `Server error when trying to fetch users. ` + err });
  }
};


exports.getProfileImage = async (req, res) => {

  try {
    const publicId = req.params.id;
    const image = await cloudinaryService.getImage("profileImages/"+publicId);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    return res.status(200).json({ image });
  }catch (err) {
    return res.status(500)
        .json({ error: err });
  };
};

exports.getUser = async (req, res) => {
  try {
    const user = await UserModel.findOne(req.body);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await UserModel.findByIdAndUpdate(req.params.id, { status: 'deactive' });
    res.status(200).json({ message: 'User deactivated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.activateUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await UserModel.findByIdAndUpdate(req.params.id, { status: 'active' });
    res.status(200).json({ message: 'User activated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};