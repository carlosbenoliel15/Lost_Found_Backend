const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const SessionSchema = new Schema({
  session: String,
  session_id: String,
  expire: { type: Date, required: true, default: Date.now, expires: "14d" },
});

const SessionModel = model("Session", SessionSchema);

module.exports = SessionModel;
