const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { sendMessage, getMessages } = require('../controllers/messagesController');

router.post('/:receiverId', auth, sendMessage);
router.get('/:userId', auth, getMessages);

module.exports = router;