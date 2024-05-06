const { TokenModel } = require("@models/token");
const crypto = require("crypto");
const { Schema } = require("mongoose");

const createToken = () => {
  return new TokenModel({
    token: crypto.randomBytes(16).toString("hex"),
  });
};

const findTokenBy = async (prop, value) => {
  return await TokenModel.findOne({ [prop]: value });
};

const setUserId = (token, userId) => {
  token._userId = userId;
};

const saveToken = (token) => {
  return token.save();
};

module.exports = {
  createToken,
  findTokenBy,
  setUserId,
  saveToken,
};
