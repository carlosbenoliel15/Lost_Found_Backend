const express = require('express');
const app = express();
const cors = require('cors');
// Configurações
require('./config/config');
require('./config/db');
app.use(cors());
// Middlewares
app.use(express.json());

// Rotas
const authRoutes = require('./routes/authRoutes');
const  userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

// Middleware de tratamento de erros
app.use(require('./middleware/errorMiddleware'));

module.exports = app;
