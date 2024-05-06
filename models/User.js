import { model, Schema, Document } from "mongoose";
import { omit } from "ramda";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true},
  last_name: { type: String, required: true },
  email: { type: String, unique: true,required:true },
  address: { type: String },
  profile_photo: { type: String },
  password: { type: String, required: true, },
  phone:{type: String},
  birth: { type: Date},
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  nic: { type: String, unique: true,required:true},
  nif: { type: String, unique: true, requirede:true},
  gender: {String},
  roles: [{ type: String, enum: ['owner', 'bidder', 'admin', 'police'], default: 'owner' }],
  registration_date: { type: Date, default: Date.now },
  last_login: { type: Date },
  authentication_token: { type: String },
  account_activation: { type: String, enum: ['pending', 'activated', 'deactivated'], default: 'pending' },
  passwordResetToken: { type: String, default: "" },
  passwordResetExpires: { type: Date, default: dayjs().toDate() },
  expires: { type: Date, default: dayjs().toDate(), expires: 43200 },

  google_id: { type: String,default:null }, 
  google_access_token: { type: String,default:null }, 
  google_email_verified: { type: Boolean,defaul:null}, 
  google_profile_id: { type: String, default:null}, 
  google_profile_name: { type: String, default: null}


});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.hashPassword = function () {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err1, salt) => {
      if (err1) {
        reject(err1);
        return;
      }
      bcrypt.hash(this.password, salt, (err2, hash) => {
        if (err2) {
          reject(err2);
          return;
        }
        this.password = hash;
        resolve(hash);
      });
    });
  });
};

userSchema.methods.hidePassword = function () {
  return omit(["password", "__v", "_id"], this.toObject({ virtuals: true }));
};


const UserModel = mongoose.model('User', UserSchema);

module.exports = { UserModel };
