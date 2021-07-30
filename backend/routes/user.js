// Import express 
const express = require('express');
// Création routeur Express 
const router = express.Router();
// Import du middleware de validation email/mot de passe
const validator = require('../middleware/validator');
// Controller pour associer les fonctions aux différentes routes
const userCtrl = require('../controllers/user');
// Import de express-rate-limit 
const rateLimit = require("express-rate-limit");

// Limitation du nombre de requêtes 
const reqLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes d'attente
  max: 3, // 3 requêtes max en 5 min
  message: "Nombre d'essais maximum atteint, merci de patienter 5 min avant de renouveler la demande."
});


// Import de la route n°1 POST /api/auth/signup -> créer un nouvel utilisateur
router.post('/signup', validator.signupValidator, userCtrl.signup);
// Import de la route n°2 POST /api/auth/login -> connecter un utilisateur existant
router.post('/login', reqLimiter, userCtrl.login);

// Export du routeur
module.exports = router;






