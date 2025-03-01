const authService = require("../services/authService");

const signup = async (req, res) => {
  try {
    const result = await authService.signup(req.body);
    res.status(result.success ? 201 : 400).json({
      success: result.success,
      message: result.success ? "Signup successful!" : "Signup failed.",
      data: result.user,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const signin = async (req, res) => {
  try {
    const result = await authService.signin(req);
    res.status(result.success ? 200 : 401).json({
      success: result.success,
      message: result.success ? "Signin successful!" : "Invalid credentials.",
      ...result,
    });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const result = await authService.forgotPassword(email);
    res.status(result.success ? 200 : 400).json({
      success: result.success,
      message: result.success
        ? "Password reset link sent to email."
        : "Failed to send reset link.",
      ...result,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  const { token, password: newPassword } = req.body;
  const result = await authService.resetPassword(token, newPassword);
  res.status(result.success ? 200 : 400).json({
    success: result.success,
    message: result.success
      ? "Password reset successfully!"
      : "Failed to reset password.",
    ...result,
  });
};

const getMe = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({
      success: true,
      message: "User retrieved successfully",
      data: { user },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { signup, signin, forgotPassword, resetPassword, getMe };
