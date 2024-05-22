const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { UserModel} = require('../models/User');
const { JWT_SECRET } = require('../config/config');

const authService = {
  // Função para autenticar um usuário
  async authenticateUser(email, password) {
    try {

      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      

      if(user.password!== password){
        throw new Error('credencias incorretas');
      }
      // Gere um token JWT para o usuário
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    
// Construa o objeto contendo o token e as informações do usuário
      const userData = {
        token,
        user: {
          
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          address: user.address,
          profile_photo: user.profile_photo,
          phone: user.phone,
          birth: user.birth,
          status: user.status,
          nic: user.nic,
          nif: user.nif,
          gender: user.gender,
          profileImage: user.profileImage,
          role: user.role
        }
      };

return userData;   
 } catch (error) {
      throw error;
    }
  },
  // Function to authenticate a user with Google client ID
  async authenticateUserWithGoogle(clientId) {
    try {
      const user = await UserModel.findOne({ googleId: clientId });
      if (!user) {
        throw new Error('User not found');
      }

      // Generate a JWT token for the user
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

      // Construct the object containing the token and user information
      const userData = {
        token,
        user: {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          address: user.address,
          profile_photo: user.profile_photo,
          phone: user.phone,
          birth: user.birth,
          status: user.status,
          nic: user.nic,
          nif: user.nif,
          gender: user.gender,
          profileImage: user.profileImage,
          role: user.role
        }
      };

      return userData;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = authService;
