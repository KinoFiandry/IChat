// routes/status.js
const express = require('express');
const router = express.Router();

router.get('/online', (req, res) => req.io.emit
  ? res.json(Array.from(req.io.onlineUsers || []))
  : res.status(500).send('Socket non initialisé')
);

module.exports = router;
