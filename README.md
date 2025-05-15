# Cloner le dépôt
git clone https://github.com/<votre-utilisateur>/chat-api.git
cd chat-api

# Copier l'exemple de .env
cp .env.example .env
# puis éditer .env :
# MONGO_URI=mongodb://<user>:<pwd>@<host>:<port>/<db>
# JWT_SECRET=unePhraseTrèsSecrète

# Installer les dépendances
npm install

# lancement
npm run dev
Le serveur tourne par défaut sur http://localhost:3001

🚀 Endpoints API

Authentification :

 => Methode: POST 

 => URL : /api/auth/register

 => Body : { username: string, password: string }

 => Réponse : { token: string }

 => Methode: POST 

 => URL : /api/auth/login

 => Body : { username: string, password: string }

 => Réponse : { token: string }

Messages :
=> methode : POST, URL: /api/messages/:receiverId, header : Authorization: Bearer <token>, Body : { content: string }, reponse : Objet Message enregistr

=> methode :GET, URL : /api/messages/:userId
, Header : Authorization: Bearer <token>, Reponse : Array<Message> trié par date

🧪 Exemples de tests

 Postman :

Définir une varile d’environnement : base_url = http://localhost:3001.

Register : POST {{base_url}}/api/auth/register → body JSON.

Login : POST {{base_url}}/api/auth/login → enregistrer {{token}} via script de test.

Envoyer : POST {{base_url}}/api/messages/{{receiverId}} → header Authorization: Bearer {{token}}, body JSON.

Lire : GET {{base_url}}/api/messages/{{userId}} → header Authorization

✅ Tests automatisés (Jest)
Lancer :
npm test

Suites couvrant :
       . tests/auth.test.js : enregistrement & connexion
       . tests/messages.test.js : envoi & lecture des messages
       .tests/authMiddleware.test.js : cas sans / mauvais token
       . tests/socket.test.js : setup socket join/leave
       . tests/db.test.js : gestion des erreurs de connexion
       . tests/authController.error.test.js : erreurs d’auth
Rapport de couverture disponible dans coverage/.

🎯 Démarche TDD
   1. Rédaction du test (rouge) : on écrit un test unitaire qui échoue.
   2. Implémentation (vert) : on écrit juste assez de code pour faire passer le test.
   3. Refactor (bleu) : on nettoie, on améliore le code sans casser les tests.
