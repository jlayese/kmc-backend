const userService = require('../services/userService');

exports.getContactsOtherUsers = async (req, res) => {
  try {
    const users = await userService.getUsersWithUnsharedContacts(req.params.userId);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully!',
      data: users
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
