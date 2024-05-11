const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
// Set Multer
const multer  = require('multer')
// Require the cloudinary library
const cloudinary = require('cloudinary').v2;
// Configurações
require('./config/config');
require('./config/db');
cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use(cors());
// Middlewares
/*app.use(express.json());*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const policeRoutes=require('././routes/policeRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const objectRoutes = require('./routes/objectRoutes'); 

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/police',policeRoutes)
app.use('/api/auction', auctionRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/', objectRoutes);

// Middleware de tratamento de erros
app.use(require('./middleware/errorMiddleware'));

module.exports = app;
