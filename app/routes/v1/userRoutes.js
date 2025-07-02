const express = require('express');
const {
  authenticateToken,
  authorizeRoles
} = require('../../middlewares/authMiddleware');

const {
  getContactsOtherUsers
} = require('../../controllers/userController');

const router = express.Router();

router.use(authenticateToken);

/**
 * @swagger
 * /users/user/:userId/other-users:
 *   get:
 *     summary: Get users withou shared contacts yet
 *     tags: [User]
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
  '/user/:userId/other-users',
  authorizeRoles('admin', 'super-admin', 'user'),
  getContactsOtherUsers
);

module.exports = router;
