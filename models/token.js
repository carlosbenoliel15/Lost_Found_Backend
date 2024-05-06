const mongoose = require("mongoose");

const { Schema, model } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const TokenSchema = new Schema({
  _userId: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 43200 },
});

const TokenModel = model("Token", TokenSchema);

module.exports = TokenModel;
