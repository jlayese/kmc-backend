const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

const signup = async (data) => {
  try {
    const { firstName, lastName, email, password, contactNumber, profilePhoto } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }

    const user = new User({ firstName, lastName, email, password, contactNumber, profilePhoto });

    await user.save();
    const { password: _, ...userWithoutPassword } = user.toObject();

    return { success: true, message: 'Signup successful', user: userWithoutPassword };
  } catch (err) {
    console.error('[service] signup:', err);
    return { success: false, error: 'Internal Server Error' };
  }
};


const signin = async (req) => {
  try {
    const { body: {email, password}, userData } = req;

    console.log('signin', email, password)
    console.log('user data', userData )
  

    const isMatch = await userData.comparePassword(password);
    console.log(isMatch)
    if (!isMatch) return { success: false, error: 'Invalid credentials' };

    const token = jwt.sign({ id: userData._id, email: userData.email }, SECRET_KEY, { expiresIn: '1h' });

    return { success: true, message: 'Signin successful', token };
  } catch (err) {
    console.error('[service] signin:', err);
    return { success: false, error: 'Internal Server Error' };
  }
};

const forgotPassword = async (email) => {
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
};

const resetPassword = async (data) => {
  try {
    const { token, newPassword } = data;

    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded || !decoded.id) {
      return { success: false, error: 'Invalid or expired token' };
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    user.password = newPassword;

    await user.save();

    return { success: true, message: 'Password reset successful' };
  } catch (err) {
    console.error('[service] resetPassword:', err);
    return { success: false, error: 'Internal Server Error' };
  }
};


module.exports = { signup, signin, forgotPassword, resetPassword };
