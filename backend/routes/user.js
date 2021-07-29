// Import express 
const express = require('express');
// Création routeur Express 
const router = express.Router();
// Import du middleware de validation email/mot de passe
const validator = require('../middleware/validator');
// Controller pour associer les fonctions aux différentes routes
const userCtrl = require('../controllers/user');
// Import du middleware Bouncer pour limiter le nombre de tentatives de connexion 
// en imposant un délai entre deux tentatives en cas de 3 échecs de connexion consécutifs 
const bouncer = require('express-bouncer')(1000, 200000, 3);

// Import de la route n°1 POST /api/auth/signup -> créer un nouvel utilisateur
router.post('/signup', validator.signupValidator, userCtrl.signup);
// Import de la route n°2 POST /api/auth/login -> connecter un utilisateur existant
router.post('/login', bouncer.block, userCtrl.login);

// Export du routeur
module.exports = router;






