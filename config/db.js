const mongoose = require('mongoose');
require('dotenv').config();

const dbURI = "mongodb+srv://teste:Teste123456789@cluster0.xgzastz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
//const dbURI = "mongodb://35.219.140.144:27017,35.219.169.95:27017/?replicaSet=rs0"
//const dbURI = "mongodb://10.182.0.37:27017,10.182.0.38:27017,10.182.0.41:27017/?replicaSet=rs0"
//process.env.MONGODB_URI ;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Successfully connected to MongoDB database.');
}).catch(err => {
  console.error('Error connecting to MongoDB database:', err);
});