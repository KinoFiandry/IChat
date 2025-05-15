// server.js
const { server } = require('./app');
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Serveur démarré sur port ${PORT}`);
});
