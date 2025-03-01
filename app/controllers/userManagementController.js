const userService = require("../services/userService");

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: "User created successfully!",
      data: { user },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully!",
      data: { users },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({
      success: true,
      message: "User retrieved successfully!",
      data: { user },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let message = "User updated successfully!";
    if (!req.body._id) {
      if (req.body.isApproved === true) {
        message = "User approved successfully!";
      } else if (req.body.isApproved === false) {
        message = "User approval revoked!";
      } else if (req.body.isActive === false) {
        message = "User deactivated successfully!";
      }
    }

    res.json({ success: true, message, data: { user } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  getUserById,
};
