// Import express 
const express = require('express');

// Création routeur Express 
const router = express.Router();

// Controller pour associer les fonctions aux différentes routes
const sauceCtrl = require('../controllers/sauce');

// ------------ ROUTES -------------- 
// Import de la route n°5 POST /api/sauces -> créer une nouvelle sauce
router.post('/', sauceCtrl.createSauce);
  
// Import de la route n°3 GET /api/sauces -> récupérer toutes les sauces
router.use('/', sauceCtrl.getAllSauces);
  
// Import de la route n°4 GET /api/sauces/:id -> récupérer une sauce à partir de son id
router.get('/:id', sauceCtrl.getOneSauce);
  
// Import de la route n°6 PUT /api/sauces/:id -> mettre à jour une sauce 
router.put('/:id', sauceCtrl.modifySauce);
  
// Import de la route n°7 DELETE /api/sauces/:id -> supprimer une sauce 
router.delete('/:id',);

// Import de la route n°8 POST /api/sauces/:id/like -> ajouter un like ou un dislike 

module.exports = router;