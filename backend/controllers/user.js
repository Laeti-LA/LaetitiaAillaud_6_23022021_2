// Import du package de chiffrement Bcrypt
const bcrypt = require('bcrypt');

// Import package webtoken 
const jwt = require('jsonwebtoken');

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

// Fonction pour connecter un utilisateur existant 
exports.login = (req, res, next) => {
    // Récupération email rentré par l'utilisateur 
    User.findOne({ email: req.body.email })
        .then(user => {
            // Si l'email n'est pas trouvé : 
            if(!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé'});
            }
            // Si l'email n'est pas trouvé, comparaison du hash du mdp saisi avec le hash du mdp enregistré sur MongoDB
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // Si la comparaison n'est pas valide : 
                    if(!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect'});   
                    }
                    // Si la comparaison est valide, renvoi du userId et d'un token : 
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            // 1er argument : données à encoder
                            { userId: user._id},
                            // 2e argument : clé secrète pour l'encodage
                            'RANDOM_TOKEN_SECRET', // Pour le dev. En prod on utiliserait une chaine de caractères bcp plus longue
                            // 3e argument = argument de configuration : expiration du token
                            { expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({error}))
        })
        .catch(error => res.status(500).json({error}));
};


