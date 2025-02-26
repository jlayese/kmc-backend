const authService = require('../services/authService');

const signup = async (req, res) => {
  try {
    const result = await authService.signup(req.body);
    res.status(result.success ? 201 : 400).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const signin = async (req, res) => {
  try {
    const result = await authService.signin(req);
    res.status(result.success ? 200 : 401).json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const resetPassword = async (req, res) => {
  const result = await authService.resetPassword(req.body);
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
};

module.exports = { signup, signin, forgotPassword, resetPassword };
