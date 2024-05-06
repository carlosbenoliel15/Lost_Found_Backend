const User = require('../models/User');
const dayjs = require("dayjs");

const getUser = (user) => user.hidePassword();

const createUser = ({ first_name, last_name, email,address,phone,birth, password, nic, nif }) => {
    return new User({
      first_name,
      last_name,
      email,
      address,
      phone,
      birth,
      gender,
      nic,
      nif,
      password,
    });
  };
  

const setResetPasswordToken = (user, resetTokenValue, expiryDate) => {
  user.passwordResetToken = resetTokenValue;
  user.passwordResetExpires = expiryDate;
};

const findUserBy = async (prop, value) => await User.findOne({ [prop]: value });

const findUserById = async (id) => await User.findById(id);

const saveUser = async (user) => await user.save();

const setUserPassword = async (user, password) => {
  user.password = password;
  user.passwordResetToken = "";
  user.passwordResetExpires = dayjs().toDate();
  return await user.hashPassword();
};

const setUserVerified = async (user) => {
  user.isVerified = true;
  user.expires = undefined;
};

const deleteUserById = async (user) => await User.findByIdAndDelete(user._id);

const updateUserById = async (user,newUser) => await User.findByIdAndUpdate(user._id,newUser,{ new: true });

const deleteUnverifiedUserByEmail = async (email) =>
  await User.findOneAndDelete({ email, isVerified: false });

module.exports = {
  getUser,
  createUser,
  setResetPasswordToken,
  findUserBy,
  findUserById,
  saveUser,
  setUserPassword,
  setUserVerified,
  deleteUserById,
  deleteUnverifiedUserByEmail,
  updateUserById
};
