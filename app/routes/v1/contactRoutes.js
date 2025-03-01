const express = require("express");
const {
  authenticateToken,
  authorizeRoles,
} = require("../../middlewares/authMiddleware");

const {
  getContacts,
  createContact,
  deleteContact,
  updateContact,
  shareContact,
  unshareContact,
} = require("../../controllers/contactsController");

const router = express.Router();

router.use(authenticateToken);

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Get contacts of a specific user
 *     tags: [Contact]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose contacts are being retrieved
 *     responses:
 *       200:
 *         description: List of contacts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60d21b4667d0d8992e610c85"
 *                   firstName:
 *                     type: string
 *                     example: "John"
 *                   lastName:
 *                     type: string
 *                     example: "Doe"
 *                   email:
 *                     type: string
 *                     example: "johndoe@example.com"
 *                   contactNumber:
 *                     type: string
 *                     example: "+1234567890"
 *                   profilePhoto:
 *                     type: string
 *                     example: "https://example.com"
 *                   owner:
 *                     type: string
 *                     example: "60d21b4667d0d8992e610c84"
 *                   sharedUsers:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["60d21b4667d0d8992e610c86", "60d21b4667d0d8992e610c87"]
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       403:
 *         description: Forbidden, insufficient permissions
 *       404:
 *         description: User not found
 */
router.get(
  "/user/:userId",
  authorizeRoles("admin", "super-admin", "user"),
  getContacts
);

/**
 * @swagger
 * /user/{userId}/contacts:
 *   get:
 *     summary: Get contacts of a specific user
 *     tags: [Contact]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose contacts are being retrieved
 *     responses:
 *       200:
 *         description: List of contacts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     example: ""
 *                   lastName:
 *                     type: string
 *                     example: ""
 *                   email:
 *                     type: string
 *                     example: ""
 *                   contactNumber:
 *                     type: string
 *                     example: ""
 *                   profilePhoto:
 *                     type: string
 *                     example: ""
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       403:
 *         description: Forbidden, insufficient permissions
 *       404:
 *         description: User not found
 */
router.post("/user/:userId/create", authorizeRoles("user"), createContact);

/**
 * @swagger
 * /user/{userId}/contact/{contactId}:
 *   delete:
 *     summary: Delete a specific contact for a user
 *     tags: [Contact]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user who owns the contact
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the contact to be deleted
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Contact deleted successfully!"
 *       400:
 *         description: Invalid request or missing parameters
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       403:
 *         description: Forbidden, insufficient permissions
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal server error
 */

router.delete(
  "/user/:userId/contact/:contactId",
  authorizeRoles("user"),
  deleteContact
);

/**
 * @swagger
 * /user/{userId}/contact/{contactId}:
 *   put:
 *     summary: Update a contact
 *     description: Updates a user's contact details. Requires authentication.
 *     tags: [Contact]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user who owns the contact
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the contact to be updated
 *     requestBody:
 *       description: Contact details to update (all fields optional)
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               contactNumber:
 *                 type: string
 *                 example: "+1234567890"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               profilePhoto:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/photo.jpg"
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Contact updated successfully"
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/user/:userId/contact/:contactId",
  authorizeRoles("user"),
  updateContact
);

/**
 * @swagger
 * /contact/{contactId}/share/{userId}:
 *   post:
 *     summary: Share a contact with another user
 *     description: Allows a user to share a contact with another user. Requires authentication.
 *     tags: [Contact]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the contact to be shared
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to share the contact with
 *     responses:
 *       200:
 *         description: Contact shared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Contact shared successfully"
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Contact or user not found
 *       500:
 *         description: Internal server error
 */
router.post(
    "/contact/:contactId/share/:userId",
    authorizeRoles("admin", "super-admin", "user"),
    shareContact
  );
  
  /**
   * @swagger
   * /contact/{contactId}/unshare/{userId}:
   *   post:
   *     summary: Unshare a contact from another user
   *     description: Allows a user to unshare a previously shared contact. Requires authentication.
   *     tags: [Contact]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: contactId
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the contact to be unshared
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the user to unshare the contact from
   *     responses:
   *       200:
   *         description: Contact unshared successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Contact unshared successfully"
   *       400:
   *         description: Invalid request
   *       401:
   *         description: Unauthorized access
   *       404:
   *         description: Contact or user not found
   *       500:
   *         description: Internal server error
   */
  router.post(
    "/contact/:contactId/unshare/:userId",
    authorizeRoles("admin", "super-admin", "user"),
    unshareContact
  );
  

// router.post(
//   "/:contactId/share/:userId",
//   authorizeRoles("admin", "super-admin", "user"),
//   shareContact
// );

// router.post(
//   "/:contactId/unshare/:userId",
//   authorizeRoles("admin", "super-admin", "user"),
//   unshareContact
// );

module.exports = router;
