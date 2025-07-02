const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');

const { sendMail } = require('../../utils/nodemailer');

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

const signup = async (data) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      contactNumber,
      profilePhoto
    } = data;

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      contactNumber,
      profilePhoto
    });

    await user.save();
    const userObject = user.toObject();
    delete userObject.password;
    const userWithoutPassword = userObject;

    return {
      success: true,
      message: 'Signup successful',
      user: userWithoutPassword
    };
  } catch (err) {
    console.error('[service] signup:', err);
    return { success: false, error: 'Internal Server Error' };
  }
};

const signin = async (req) => {
  try {
    const {
      body: { password },
      userData
    } = req;

    const isMatch = await userData.comparePassword(password);
    if (!isMatch) return { success: false, error: 'Invalid credentials' };

    const token = jwt.sign(
      { id: userData._id, email: userData.email },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    return { success: true, message: 'Signin successful', token };
  } catch (err) {
    console.error('[service] signin:', err);
    return { success: false, error: 'Internal Server Error' };
  }
};

const forgotPassword = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendMail(
      email,
      'Password Reset Request',
      `Click the link to reset your password: ${resetUrl}`,
      `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
    );

    return { success: true, message: 'Password reset email sent' };
  } catch (error) {
    return { success: true, message: 'Unable to send email!' };
  }
};

// const resetPassword = async (data) => {
//   try {
//     const { token, newPassword } = data;

//     const decoded = jwt.verify(token, SECRET_KEY);
//     if (!decoded || !decoded.id) {
//       return { success: false, error: 'Invalid or expired token' };
//     }

//     const user = await User.findById(decoded.id);
//     if (!user) {
//       return { success: false, error: 'User not found' };
//     }

//     user.password = newPassword;

//     await user.save();

//     return { success: true, message: 'Password reset successful' };
//   } catch (err) {
//     console.error('[service] resetPassword:', err);
//     return { success: false, error: 'Internal Server Error' };
//   }
// };
const resetPassword = async (token, newPassword) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return { success: false, error: 'Invalid or expired token' };
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return { success: true, message: 'Password reset successful' };
  } catch (error) {
    return { success: false, message: 'Unable to reset password' };
  }
};

module.exports = { signup, signin, forgotPassword, resetPassword };
