const authService = require('../services/authService');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authService.authenticateUser(email, password);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};