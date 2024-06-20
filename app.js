const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary').v2;

require('./config/config');
require('./config/db');

cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const policeRoutes = require('./routes/policeRoutes');
const auctionRoutes = require('./routes/auctionRoutes')(io); // Pass io to auction routes
const categoryRoutes = require('./routes/categoryRoutes');
const objectRoutes = require('./routes/objectRoutes'); 
const statsRoutes = require('./routes/statsRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/police', policeRoutes);
app.use('/api/auction', auctionRoutes); // Use the auction routes
app.use('/api/category', categoryRoutes);
app.use('/api/', objectRoutes);
app.use('/api/', statsRoutes);
app.use('/api/payment', paymentRoutes);

app.use(require('./middleware/errorMiddleware'));

// Socket.io
io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('joinAuction', (auctionId) => {
        socket.join(auctionId);
    });

    socket.on('newBid', (data) => {
        io.to(data.auctionId).emit('newBid', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
