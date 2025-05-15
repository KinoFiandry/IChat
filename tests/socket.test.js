// tests/socket.test.js
const setupSocket = require('../socket');

describe('Socket Setup', () => {
  it('should join the socket room upon connection and leave on disconnect', () => {
    // 1) Créer un fake "io" dont on peut espionner .on et .to().emit
    const fakeIo = {
      on: jest.fn(),
      to: jest.fn().mockReturnValue({ emit: jest.fn() })
    };

    // 2) Créer un fake socket avec join/leave/on
    const fakeSocket = {
      handshake: { query: { userId: 'abc123' } },
      join: jest.fn(),
      leave: jest.fn(),
      on: jest.fn()
    };

    // 3) Appeler setupSocket : il va binder fakeIo.on('connection', handler)
    setupSocket(fakeIo);

    // 4) Vérifier qu'on ait bien enregistré un handler pour "connection"
    expect(fakeIo.on).toHaveBeenCalledWith('connection', expect.any(Function));

    // 5) Récupérer ce handler et simuler une connexion
    const connectionHandler = fakeIo.on.mock.calls.find(([evt]) => evt === 'connection')[1];
    connectionHandler(fakeSocket);

    // 6) À la connexion, socket.join(userId) doit avoir été appelé
    expect(fakeSocket.join).toHaveBeenCalledWith('abc123');

    // 7) Vérifier qu'on ait bien écouté l'événement 'disconnect'
    expect(fakeSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));

    // 8) Récupérer le callback de déconnexion et simuler
    const disconnectHandler = fakeSocket.on.mock.calls.find(([evt]) => evt === 'disconnect')[1];
    disconnectHandler();

    // 9) Sur déconnexion, socket.leave(userId) doit avoir été appelé
    expect(fakeSocket.leave).toHaveBeenCalledWith('abc123');
  });
});
