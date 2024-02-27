const mongoose = require('mongoose');

// Schema para PoliceStation
const PoliceStationSchema = new mongoose.Schema({
  address: String
});

// Schema para PoliceOfficer
const PoliceOfficerSchema = new mongoose.Schema({
  name: String,
  id: String,
  station: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PoliceStation'
  }
});

// Model para PoliceStation
const PoliceStationModel = mongoose.model('PoliceStation', PoliceStationSchema);

// Model para PoliceOfficer
const PoliceOfficerModel = mongoose.model('PoliceOfficer', PoliceOfficerSchema);

module.exports = { PoliceStationModel, PoliceOfficerModel };
