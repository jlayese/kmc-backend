const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePhoto: { type: String, default: '' },

    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    sharedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

contactSchema.methods.updateContact = async function (updatedData, userId) {
  if (this.owner.toString() !== userId.toString()) {
    throw new Error('Only the owner can update this contact.');
  }

  Object.assign(this, updatedData);
  return this.save();
};

contactSchema.methods.shareWithUser = async function (userId) {
  if (!this.sharedUsers.includes(userId)) {
    this.sharedUsers.push(userId);
  }
  return this.save();
};

contactSchema.methods.unshareWithUser = async function (userId) {
  this.sharedUsers = this.sharedUsers.filter((id) => id.toString() !== userId.toString());
  return this.save();
};

module.exports = mongoose.model('Contact', contactSchema);
