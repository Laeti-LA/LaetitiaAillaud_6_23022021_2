// Import express 
const express = require('express');

// Création routeur Express 
const router = express.Router();

// Import du middleware authentification
const auth = require('../middleware/auth');
// Import du middleware multer
const multer = require('../middleware/multer-config');

// Controller pour associer les fonctions aux différentes routes
const sauceCtrl = require('../controllers/sauce');

// ------------ ROUTES -------------- 

// Import de la route n°5 POST /api/sauces -> créer une nouvelle sauce
router.post('/', multer, sauceCtrl.createSauce);
// Import de la route n°4 GET /api/sauces/:id -> récupérer une sauce à partir de son id
router.get('/:id', auth, sauceCtrl.getOneSauce);
// Import de la route n°6 PUT /api/sauces/:id -> mettre à jour une sauce 
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
// Import de la route n°7 DELETE /api/sauces/:id -> supprimer une sauce 
router.delete('/:id', auth, sauceCtrl.deleteSauce);
// Import de la route n°3 GET /api/sauces -> récupérer toutes les sauces
router.get('/', auth, sauceCtrl.getAllSauces);
// Import de la route n°8 POST /api/sauces/:id/like -> ajouter un like ou un dislike 
router.post('/:id/like', auth, sauceCtrl.rateOneSauce);
module.exports = router;