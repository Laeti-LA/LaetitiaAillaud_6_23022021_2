// Import express 
const express = require('express');

// Création routeur Express 
const router = express.Router();

// Controller pour associer les fonctions aux différentes routes
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);

// Export du routeur
module.exports = router;