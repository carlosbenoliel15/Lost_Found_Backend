const mongoose = require('mongoose');

// Schema para PoliceStation
const PoliceStationSchema = new mongoose.Schema({
  address:{type:String,required:true},
  name:{type: String, required: true, unique:true},
  zip_code:{type:String, required:true},
  phone_number:{type: String,required:true,unique:true},
});

// Model para PoliceStation
const PoliceStationModel = mongoose.model('PoliceStation', PoliceStationSchema);

module.exports = { PoliceStationModel };
