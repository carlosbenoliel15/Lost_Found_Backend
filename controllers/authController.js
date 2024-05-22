const authService = require('../services/authService');
const { jwtDecode } = require("jwt-decode");




exports.login = async (req, res) => {
  try {
    const { email, password, clientId } = req.body;
    let userData;
    if (clientId) {
      userData = await authService.authenticateUserWithGoogle(clientId);
    } else {
      userData = await authService.authenticateUser(email, password);
    }
    res.json(userData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.generateToken = async (req, res) => {
  try {
    const { token } = req.params;
    const info = jwtDecode(token);
    res.json(info);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}