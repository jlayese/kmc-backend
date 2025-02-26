const express = require('express');
const {
  updateProfile,
  changePassword,
  getProfile,

} = require('../controllers/userController');
const {
  authenticateToken,
} = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authenticateToken, updateProfile);
router.get('/:id', authenticateToken, changePassword);
router.get('/:id', authenticateToken, getProfile);



module.exports = router;
