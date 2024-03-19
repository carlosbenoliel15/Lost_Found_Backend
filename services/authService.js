const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { UserModel} = require('../models/User');
const { JWT_SECRET } = require('../config/config');

const authService = {
  // Função para autenticar um usuário
  async authenticateUser(email, password) {
    try {
      // Busque o usuário pelo email
      const user = await UserModel.findOne({ email });

      // Se o usuário não existir, retorne um erro
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      

      if(user.password!== password){
        throw new Error('credencias incorretas');
      }
      // Gere um token JWT para o usuário
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    
      return token;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = authService;
