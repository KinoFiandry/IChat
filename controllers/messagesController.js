const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  const { receiverId } = req.params;
  const { content } = req.body;
  try {
    const msg = new Message({ senderId: req.user.id, receiverId, content });
    await msg.save();

    // socket emission
    req.io.to(receiverId).emit('private_message', msg);
    res.json(msg);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};

exports.getMessages = async (req, res) => {
  const { userId } = req.params;
  try {
    const msgs = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: userId },
        { senderId: userId, receiverId: req.user.id }
      ]
    }).sort('timestamp');
    res.json(msgs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};