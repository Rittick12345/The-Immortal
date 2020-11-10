const express = require('express');
const { register, login, getMe } = require('../controllers/auth');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, authorize, getMe);

module.exports = router;
