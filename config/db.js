const mongoose = require('mongoose');
require('dotenv').config();

const dbURI = "mongodb+srv://teste:Teste123456789@cluster0.xgzastz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
//process.env.MONGODB_URI ;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Successfully connected to MongoDB database.');
}).catch(err => {
  console.error('Error connecting to MongoDB database:', err);
});
