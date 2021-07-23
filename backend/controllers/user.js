// Import du package de chiffrement Bcrypt
const bcrypt = require('bcrypt');

// Import modèle de données user
const User = require('../models/user');

// Fonction pour créer et enregistrer un compte utilisateur 
exports.signup = (req, res, next) => {
    // Chiffrage du mdp avec la fonction asynchrone hash
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // Création nouvel utilisateur 
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // Ajout de l'utilisateur dans la BDD avec la fonction asynchrone save
            user.save()
                .then(() => res.status(201).json({ message: 'Nouvel utilisateur créé' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


