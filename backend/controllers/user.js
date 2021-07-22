// Import du package de chiffrement Bcrypt
const bcrypt = require('bcrypt');


// Import modèle de données user
const user = require('../models/user');

// Fonction pour créer et enregistrer un compte utilisateur 
exports.signup = (req, res, next) => {
    // Chiffrage du mdp avec la fonction asynchrone hash
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            console.log(user);
            // Ajout de l'utilisateur dans la BDD avec la fonction asynchrone save
            user.save()
                .then(() => res.status(201).json({ message: 'Nouvel utilisateur créé' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error = res.status(500).json({error}));
};


