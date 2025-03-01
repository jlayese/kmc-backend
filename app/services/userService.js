const mongoose = require("mongoose");
const User = require('../models/User');
const Contact = require("../models/Contact");

exports.approveUserService = async (id) => {
  return await User.findByIdAndUpdate(
    id,
    { isApproved: true },
    { new: true, runValidators: true }
  );
};

exports.createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};


exports.getUsers = async () => {
  return await User.find({ role: { $ne: "admin" }, isDeleted: false });
};



exports.getUsersWithUnsharedContacts = async (userId) => {
  return await User.aggregate([
    {
      $match: {
        _id: { $ne: new mongoose.Types.ObjectId(userId) }, // Exclude the current user
        role: "user",
        isDeleted: false,
        isActive: true,
        isApproved: true
      }
    },
    {
      $project: {
        password: 0 
      }
    }
    // {
    //   $lookup: {
    //     from: "contacts",
    //     localField: "_id",
    //     foreignField: "owner",
    //     as: "contacts"
    //   }
    // },
    // {
    //   $unwind: { path: "$contacts", preserveNullAndEmptyArrays: true }
    // },
    // {
    //   $match: {
    //     $or: [
    //       { "contacts.sharedUsers": { $exists: false } }, // Contact has no shared users
    //       { "contacts.sharedUsers": { $not: { $elemMatch: { $eq: new mongoose.Types.ObjectId(userId) } } } } // Contact is NOT shared with userId
    //     ]
    //   }
    // },
    // {
    //   $group: {
    //     _id: "$_id",
    //     firstName: { $first: "$firstName" },
    //     lastName: { $first: "$lastName" },
    //     email: { $first: "$email" }
    //   }
    // }
  ]);
};


exports.getUserById = async (id) => {
  return await User.findById(id);
};


exports.updateUser = async (id, userData) => {
  return await User.findByIdAndUpdate(id, userData, { new: true });
};


exports.deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};
