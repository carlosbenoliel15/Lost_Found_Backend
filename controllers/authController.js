const authService = require('../services/authService');
const { jwtDecode } = require("jwt-decode");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authService.authenticateUser(email, password);
    res.json({ token });
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