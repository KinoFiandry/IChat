// controllers/statusController.js
exports.getOnlineUsers = (req, res) => {
  // on ne stocke pas en DB, juste en mémoire
  const io = req.io;
  const onlineSet = io.onlineUsers || [];
  res.json(Array.from(onlineSet));
};
