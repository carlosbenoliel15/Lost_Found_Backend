const mongoose = require('mongoose');

// Schema para User
const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name:{ type: String, required: true },
  email: { type: String, unique: true },
  adddress:{type:String},
  profile_photo:{type:String},
  password: { type: String, required: true },
  phone:String,
  birth:{type:Date},
  status: String,
  nic: { type: String, unique: true },
  nif: { type: String, unique: true },
  gender: String,
  profileImage: String,
});

// Middleware to format birth date before saving
UserSchema.pre('save', function(next) {
  if (this.birth) {
    // Format birth date to DD-MM-YYYY
    const formattedBirthDate = formatDate(this.birth);
    this.birth = formattedBirthDate;
  }
  next();
});

// Function to format date to DD-MM-YYYY
function formatDate(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

const UserModel = mongoose.model('User', UserSchema);

// Schema para Bidder
const BidderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true }
});

const BidderModel = mongoose.model('Bidder', BidderSchema);

// Schema para Owner
const OwnerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true }
});

const OwnerModel = mongoose.model('Owner', OwnerSchema);

module.exports = { UserModel, BidderModel, OwnerModel };