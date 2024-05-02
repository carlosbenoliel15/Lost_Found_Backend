const mongoose = require('mongoose');
require('dotenv').config();

const dbURI = "mongodb://35.219.140.144:27017,35.219.169.95:27017/?replicaSet=rs0";
//process.env.MONGODB_URI ;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Successfully connected to MongoDB database.');
}).catch(err => {
  console.error('Error connecting to MongoDB database:', err);
});