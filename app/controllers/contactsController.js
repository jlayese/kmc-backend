const contactService = require("../services/contactService");

exports.createContact = async (req, res) => {
  try {
    const userId = req.params.userId;
    const contact = await contactService.createContact({
      ...req.body,
      owner: userId,
    });
    res.status(201).json({
      success: true,
      message: "Contacts created successfully!",
      data: { contact },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const contacts = await contactService.getContactsByOwner(req.params.userId);

    res.status(200).json({
      success: true,
      message: "Contacts retrieved successfully!",
      data: { contacts },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const { userId, contactId } = req.params;
    const updates = req.body;

    const updatedContact = await contactService.updateContact(
      contactId,
      userId,
      updates
    );
    res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      data: { contact: { ...updatedContact } },
    });
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    await contactService.deleteContact(req.params.contactId, req.params.userId);
    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

exports.shareContact = async (req, res) => {
  try {
    const { contactId, userId } = req.params;
    const sharedContact = await contactService.shareContact(contactId, userId);

    res.status(200).json({
      success: true,
      message: "Contact shared successfully",
      data: sharedContact,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({ error: error.message });
  }
};

exports.unshareContact = async (req, res) => {
  try {
    const { contactId, userId } = req.params;
    const unsharedContact = await contactService.unshareContact(contactId, userId);
    res.status(200).json({
        success: true,
        message: "Contact unshared successfully",
        data: unsharedContact,
      });
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};
