const authService = require('../services/authService');
const { jwtDecode } = require("jwt-decode");


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await authService.authenticateUser(email, password);
    res.json(userData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.generateToken = async (req, res) => {
  try {
    const { token } = req.params;
    // Get user information from the token
    const info = await authService.getUserInfoFromToken(token);
    res.json(info);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}