const mongoose = require('mongoose');

// Schema para PoliceStation
const PoliceStationSchema = new mongoose.Schema({
  address:{type:String,required:true},
  number:{type:Number, required: true, unique:true},
  zip_code:{type:String, required:true},
  phone_number:{type: String,required:true,unique:true},
});

// Schema para PoliceOfficer
const PoliceOfficerSchema = new mongoose.Schema({
  first_name:{type:String, required:true},
  last_name:{type:String, required:true},
  phone:{type:String, required:true},
  email:{type:String, required:true, unique:true},
  password:{type:String, required:true},
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
