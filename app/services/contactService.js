const Contact = require("../models/Contact");

exports.createContact = async (contactData) => {
  const contact = new Contact(contactData);
  return await contact.save();
};

// exports.getContactsByOwner = async (ownerId) => {
//   return await Contact.find({ owner: ownerId });
// };

exports.getContactsByOwner = async (ownerId) => {
    return await Contact.find({
      $or: [
        { owner: ownerId },  // Find contacts owned by the ownerId
        { sharedUsers: ownerId }  // Find contacts where ownerId is in sharedUsers
      ]
    });
  };

exports.getContactById = async (contactId, userId) => {
  return await Contact.findOne({
    _id: contactId,
    $or: [{ owner: userId }, { sharedUsers: userId }],
  });
};

exports.updateContact = async (contactId, userId, updatedData) => {
  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: contactId, owner: userId },
      updatedData,
      { new: true }
    );

    if (!updatedContact) {
      throw new Error("Contact not found");
    }

    return updatedContact;
  } catch (error) {
    throw new Error(error.message || "Error updating contact");
  }
};

exports.deleteContact = async (contactId, userId) => {
  const contact = await Contact.findById(contactId);
  if (!contact) throw new Error("Contact not found");

  if (contact.owner.toString() !== userId.toString()) {
    throw new Error("Only the owner can delete this contact.");
  }

  return await Contact.findByIdAndDelete(contactId);
};

exports.shareContact = async (contactId, userId) => {
  const contact = await Contact.findById(contactId);
  if (!contact) throw new Error("Contact not found");

  if (contact.sharedUsers.includes(userId)) {
    throw new Error("Contact already shared with this user.");
  }

  contact.sharedUsers.push(userId);
  await contact.save();

  return await Contact.findById(contactId).populate(
    "sharedUsers",
    "firstName lastName email"
  );
};

exports.unshareContact = async (contactId, userId) => {
  const contact = await Contact.findById(contactId);
  if (!contact) throw new Error("Contact not found");

  contact.sharedUsers = contact.sharedUsers.filter(
    (u) => u._id.toString() !== userId
  );

  await contact.save();

  return await Contact.findById(contactId).populate(
    "sharedUsers",
    "firstName lastName email"
  );
};
